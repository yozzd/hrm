<template>
    <div>
        <Row>
        <h3>User List</h3>
        </Row>
        <Row>
        <data-table :data="employeeAll" :filter-options="filterOptions" :columns="columns" :loading="$apollo.loading" @on-selection-change="handleSelectionChange">
            <ButtonGroup slot="action">
            <Button type="primary" custom-icon="iconfont icon-plus" @click="show('create')">CREATE</Button>
            <Button type="error" custom-icon="iconfont icon-delete" :disabled="!multipleSelection.length" @click="handleDelete">DELETE</Button>
            </ButtonGroup>
        </data-table>

        <drawer title="Create Employee" width="300" v-if="isCreate" :value="isCreate" :form-options="createForm" :errors="errors" @cancel="handleCancel" @action="handleSave" @on-close="handleOnClose" save-button />
        </Row>
    </div>
</template>

<script>
import { EMPLOYEE_ALL, EMPLOYEE_CREATE, EMPLOYEE_DELETE } from '@/apollo/queries/employee'
import * as _ from 'lodash'
import DataTable from '@/components/data-table'
import Drawer from '@/components/drawer'
import errorHandler from '@/apollo/config/errorHandler'
import moment from 'moment'

export default {
    components: {
        DataTable,
        Drawer
    },
    apollo: {
        employeeAll: {
            query: EMPLOYEE_ALL
        }
    },
    data() {
        return {
            employeeAll: [],
            multipleSelection: [],
            isCreate: false,
            errors: [],
            filterOptions: {
                select: {
                    options: [
                        { value: 'no', label: 'Employee No' },
                        { value: 'name', label: 'Name' }
                    ]
                }
            },
            columns: [
                { type: 'selection', width: 40, align: 'center' },
                { title: '#', width: 60, align: 'center', slot: 'reIndex' },
                { title: 'Employee No', key: 'no', sortable: true },
                { title: 'Employee Name', key: 'name', sortable: true },
                { title: 'Place Of Birth', key: 'placeOfBirth', width: 180 },
                { title: 'Date Of Birth', key: 'dateOfBirth', width: 180,
                    render: (h, params) => {
                        return h('div', [
                            h('span', moment(new Date(params.row.dateOfBirth)).format('DD-MM-YYYY'))
                        ])
                    }
                },
                { title: 'Date Of Join', key: 'dateOfJoin', width: 180,
                    render: (h, params) => {
                        return h('div', [
                            h('span', moment(new Date(params.row.dateOfJoin)).format('DD-MM-YYYY'))
                        ])
                    }
                },
                { title: 'Gender', key: 'gender', minWidth: 180 }
            ],
            createForm: {
                forms: [
                    { prop: 'no', label: 'Employee No', itemType: 'mask', mask: 'A.####', placeholder: '_.____',
                        rules: [
                            { required: true, message: 'Please input Employee No', trigger: 'blur' },
                            { min: 6, message: 'Employee No must be at least 6 characters length', trigger: 'blur' }
                        ]
                    },
                    { prop: 'name', label: 'Employee Name',
                        rules: [
                            { required: true, message: 'Please input Employee Name', trigger: 'blur' }
                        ]
                    },
                    { prop: 'placeOfBirth', label: 'Place Of Birth',
                        rules: [
                            { required: true, message: 'Please input Place Of Birth', trigger: 'blur' }
                        ]
                    },
                    { prop: 'dateOfBirth', label: 'Date Of Birth', itemType: 'date', placeholder: '__-__-____',
                        rules: [
                            { required: true, type: 'date', message: 'Please pick a Date Of Birth', trigger: 'change' }
                        ]
                    },
                    { prop: 'dateOfJoin', label: 'Date Of Join', itemType: 'date', placeholder: '__-__-____',
                        rules: [
                            { required: true, type: 'date', message: 'Please pick a Date Of Join', trigger: 'change' }
                        ]
                    },
                    { prop: 'gender', label: 'Gender', itemType: 'radio',
                        rules: [
                            { required: true, message: 'Please select Gender', trigger: 'change' }
                        ],
                        options: [
                            { label: 'Male' },
                            { label: 'Female' }
                        ]
                    },
                    { prop: 'religion', label: 'Religion', itemType: 'select',
                        options: [
                            { label: 'Islam', value: 'Islam' },
                            { label: 'Kristen', value: 'Kristen' },
                            { label: 'Budha', value: 'Budha' },
                            { label: 'Hindu', value: 'Hindu' }
                        ],
                        rules: [
                            { required: true, message: 'Please select Religion', trigger: 'change' }
                        ]
                    },
                    { prop: 'maritalStatus', label: 'Marital Status', itemType: 'select',
                        options: [
                            { label: 'Single', value: 'S' },
                            { label: 'Married 0 Children', value: 'M0' },
                            { label: 'Married 1 Children', value: 'M1' },
                            { label: 'Married 2 Children', value: 'M2' },
                            { label: 'Married 3 Children', value: 'M3' }
                        ],
                        rules: [
                            { required: true, message: 'Please select Marital Status', trigger: 'change' }
                        ]
                    },
                    { prop: 'phoneNumber', label: 'Phone Number',
                        rules: [
                            { required: true, message: 'Please input Phone Number', trigger: 'blur' }
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
        show(action) {
            this.isCreate = true
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
                            mutation: EMPLOYEE_CREATE,
                            variables: {
                                no: form.model.no,
                                name: form.model.name,
                                placeOfBirth: form.model.placeOfBirth,
                                dateOfBirth: moment(new Date(form.model.dateOfBirth)).format('YYYY-MM-DD'),
                                dateOfJoin: moment(new Date(form.model.dateOfJoin)).format('YYYY-MM-DD'),
                                gender: form.model.gender,
                                religion: form.model.religion,
                                maritalStatus: form.model.maritalStatus,
                                phoneNumber: form.model.phoneNumber
                            },
                            update: (store, { data: { employeeCreate } }) => {
                                const data = store.readQuery({ query: EMPLOYEE_ALL })
                                data.employeeAll.push(employeeCreate)
                                store.writeQuery({ query: EMPLOYEE_ALL, data })
                            },
                            optimisticResponse: {
                                __typename: 'Mutation',
                                employeeCreate: {
                                    __typename: 'EmployeeType',
                                    id: -1,
                                    no: form.model.no,
                                    name: form.model.name,
                                    placeOfBirth: form.model.placeOfBirth,
                                    dateOfBirth: moment(new Date(form.model.dateOfBirth)).format('YYYY-MM-DD'),
                                    dateOfJoin: moment(new Date(form.model.dateOfJoin)).format('YYYY-MM-DD'),
                                    gender: form.model.gender,
                                    religion: form.model.religion,
                                    maritalStatus: form.model.maritalStatus,
                                    phoneNumber: form.model.phoneNumber
                                }
                            }
                        })
                        if(data.employeeCreate) {
                            form.resetFields()
                            this.isCreate = false
                            this.$Notice.success({
                                title: 'Success',
                                desc: `Employee No "${data.employeeCreate.no}" has created succesfully`
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
        handleDelete() {
            try {
                this.$Modal.confirm({
                    title: 'Warning',
                    content: '<p>This will permanently delete the data. Continue?</p>',
                    okText: 'YES',
                    cancelText: 'CANCEL',
                    loading: true,
                    onOk: async () => {
                        const { data } = await this.$apollo.mutate({
                            mutation: EMPLOYEE_DELETE,
                            variables: {
                                input: this.multipleSelection
                            },
                            update: async function (store, { data: { employeeDelete } }) {
                                const data = store.readQuery({ query: EMPLOYEE_ALL })
                                _.pullAllBy(data.employeeAll, employeeDelete, 'id')
                                store.writeQuery({ query: EMPLOYEE_ALL, data })
                            },
                            optimisticResponse: {
                                __typename: 'Mutation',
                                employeeDelete: this.employeeAll
                            }
                        })
                        if(data.employeeDelete) {
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
        }
    }
}
</script>
