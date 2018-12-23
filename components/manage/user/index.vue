<template>
    <div>
        <Row>
        <data-table :data="userAll" :filter-options="filterOptions" :columns="columns" :loading="$apollo.loading" @on-selection-change="handleSelectionChange">
            <ButtonGroup slot="action">
            <Button type="primary" custom-icon="iconfont icon-plus" @click="show('create')">CREATE</Button>
            <Button type="error" custom-icon="iconfont icon-delete" :disabled="!multipleSelection.length">DELETE</Button>
            </ButtonGroup>
        </data-table>

        <drawer title="Create User" v-if="isCreate" :visible="isCreate" :form-options="createForm" :errors="errors" @cancel="handleCancel" @action="handleSave" @on-close="handleOnClose" />
        </Row>
    </div>
</template>

<script>
import { USER_ALL, USER_CREATE, USER_DELETE, USER_UPDATE } from '@/apollo/queries/user'
import DataTable from '@/components/data-table'
import Drawer from '@/components/drawer'
import _ from 'lodash'
import { userRoles } from '@/auth/auth.roles'
import errorHandler from '@/apollo/config/errorHandler'

const roles = _.reduce(_.slice(userRoles, 0, userRoles.length - 1), (r, v, k) => {
    const obj = {
        value: v,
        label: _.capitalize(v)
    }
    r.push(obj)
    return r
}, [])

export default {
    components: {
        DataTable,
        Drawer
    },
    apollo: {
        userAll: {
            query: USER_ALL
        }
    },
    data() {
        return {
            userAll: [],
            multipleSelection: [],
            isCreate: false,
            errors: [],
            filterOptions: {
                select: {
                    options: [
                        { value: 'username', label: 'Username' }
                    ]
                }
            },
            columns: [
                { type: 'selection', width: 40, align: 'center' },
                { title: '#', width: 60, align: 'center', slot: 'reIndex' },
                { title: 'Username', key: 'username', sortable: true },
                { title: 'Role', key: 'role',
                    render: (h, params) => {
                        return h('div', [
                            h('span', _.capitalize(params.row.role))
                        ]);
                    },
                    filters: roles,
                    filterMethod (value, row) {
                        return row.role.indexOf(value) > -1;
                    }
                }
            ],
            createForm: {
                forms: [
                    { prop: 'username', label: 'Username',
                        rules: [
                            { required: true, message: 'Please input Username', trigger: 'blur' },
                            { min: 4, message: 'Username must be at least 4 characters length', trigger: 'blur' }
                        ]
                    },
                    { prop: 'password', label: 'Password', type: 'password',
                        rules: [
                            { required: true, message: 'Please input Password', trigger: 'blur' },
                            { min: 6, message: 'Password must be at least 6 characters length', trigger: 'blur' }
                        ]
                    },
                    { prop: 'role', label: 'Role', itemType: 'select', options: roles,
                        rules: [
                            { required: true, message: 'Please select Role', trigger: 'change' }
                        ]
                    }
                ]
            }
        }
    },
    methods: {
        handleSelectionChange(arr) {
            this.multipleSelection = arr.map(v => ({ id: v.id }))
        },
        show(action, row) {
            if(action === 'create') {
                this.isCreate = true
            } else {
                this.isEdit = true
                this.editRow = row
            }
        },
        handleOnClose() {
            this.isCreate = false
        },
        handleCancel(form) {
            this.isCreate = false
            this.errors = []
            form.resetFields()
        },
        handleSave: function(form) {
            this.errors = []
            form.validate(async (valid) => {
                if(valid) {
                    try {
                        const { data } = await this.$apollo.mutate({
                            mutation: USER_CREATE,
                            variables: {
                                username: form.model.username,
                                password: form.model.password,
                                role: form.model.role
                            },
                            update: (store, { data: { userCreate } }) => {
                                const data = store.readQuery({ query: USER_ALL })
                                data.userAll.push(userCreate)
                                store.writeQuery({ query: USER_ALL, data })
                            },
                            optimisticResponse: {
                                __typename: 'Mutation',
                                userCreate: {
                                    __typename: 'UserType',
                                    id: -1,
                                    username: form.model.username,
                                    role: form.model.role
                                }
                            }
                        })
                        if(data.userCreate) {
                            form.resetFields();
                            this.isCreate = false;
                            this.$Message.success('User created successfully')
                        }
                    } catch(err) {
                        this.errors = errorHandler(err)
                    }
                } else {
                    return false
                }
            })
        }
    }
}
</script>
