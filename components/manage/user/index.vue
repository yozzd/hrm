<template>
    <div>
        <Row>
        <h3>Manage User</h3>
        </Row>
        <Row>
        <data-table :data="userAll" :filter-options="filterOptions" :columns="columns" :loading="$apollo.loading" @on-selection-change="handleSelectionChange">
            <ButtonGroup slot="action">
            <Button type="primary" custom-icon="iconfont icon-plus" @click="show('create')">CREATE</Button>
            <Button type="error" custom-icon="iconfont icon-delete" :disabled="!multipleSelection.length" @click="handleDelete">DELETE</Button>
            </ButtonGroup>
        </data-table>

        <drawer title="Create User" width="300" v-if="isCreate" :value="isCreate" :form-options="createForm" :errors="errors" @cancel="handleCancel" @action="handleSave" @on-close="handleOnClose" save-button />
        <drawer title="Edit User" width="300" v-if="isEdit" :value="isEdit" :form-options="editForm" :edit-row="editRow" :errors="errors" @cancel="handleCancel" @action="handleEdit" @on-close="handleOnClose" />
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
            isEdit: false,
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
                },
                {
                    title: 'Action',
                    key: 'action',
                    width: 150,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.show('edit', params.row)
                                    }
                                }
                            }, 'Edit')
                        ])
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
            },
            editForm: {
                forms: [
                    { prop: 'username', label: 'Username',
                        rules: [
                            { required: true, message: 'Please input Username', trigger: 'blur' }
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
            this.isEdit = false
        },
        handleCancel(form) {
            this.isCreate = false
            this.isEdit = false
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
                            this.$Notice.success({
                                title: 'Success',
                                desc: `Username "${data.userCreate.username}" has created succesfully`
                            })
                        }
                    } catch(err) {
                        this.errors = errorHandler(err)
                    }
                } else {
                    return false
                }
            })
        },
        handleDelete: function() {
            try {
                this.$Modal.confirm({
                    title: 'Warning',
                    content: '<p>This will permanently delete the data. Continue?</p>',
                    okText: 'YES',
                    cancelText: 'CANCEL',
                    loading: true,
                    onOk: async () => {
                        const { data } = await this.$apollo.mutate({
                            mutation: USER_DELETE,
                            variables: {
                                input: this.multipleSelection
                            },
                            update: async function (store, { data: { userDelete } }) {
                                const data = store.readQuery({ query: USER_ALL })
                                _.pullAllBy(data.userAll, userDelete, 'id')
                                store.writeQuery({ query: USER_ALL, data })
                            },
                            optimisticResponse: {
                                __typename: 'Mutation',
                                userDelete: this.userAll
                            }
                        })
                        if(data.userDelete) {
                            await this.$Modal.remove()
                            this.$Notice.success({
                                title: 'Deleted',
                                desc: 'Data succesfully deleted'
                            })
                        }
                    }
                })
            } catch(err) {
                this.errors = errorHandler(err)
            }
        },
        handleEdit: function(form) {
            this.errors = []
            form.validate(async (valid) => {
                if(valid) {
                    try {
                        const { data } = await this.$apollo.mutate({
                            mutation: USER_UPDATE,
                            variables: {
                                id: this.editRow.id,
                                username: form.model.username,
                                role: form.model.role
                            },
                            update: (store, { data: { userUpdate } }) => {
                                const data = store.readQuery({ query: USER_ALL })
                                const idx = _.findIndex(data.userAll, { id: userUpdate.id })
                                data.userAll[idx].username = userUpdate.username
                                data.userAll[idx].role = userUpdate.role
                                store.writeQuery({ query: USER_ALL, data })
                            },
                            optimisticResponse: {
                                __typename: 'Mutation',
                                userUpdate: {
                                    __typename: 'UserType',
                                    id: this.editRow.id,
                                    username: form.model.username,
                                    role: form.model.role
                                }
                            }
                        })
                        if(data.userUpdate) {
                            form.resetFields()
                            this.isEdit = false
                            this.editRow = ''
                            this.$Notice.success({
                                title: 'Success',
                                desc: `Username "${data.userUpdate.username}" has updated succesfully`
                            })
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
