<template>
    <div>
        <child-header v-if="employeeDetail" :data="employeeDetail" />

        <info-table :data="employeeDetail" :rows="rows">
            <tr slot="append">
                <td></td>
                <td>
                    <Button type="dashed" size="small" @click="show(employeeDetail)">Edit</Button>
                </td>
            </tr>
        </info-table>

        <drawer title="Edit Employee" width="300" v-if="isEdit" :value="isEdit" :form-options="editForm" :edit-row="editRow" :errors="errors" @cancel="handleCancel" @action="handleEdit" @on-close="handleOnClose" />
    </div>
</template>

<script>
import { EMPLOYEE_PERSONAL, EMPLOYEE_UPDATE_PERSONAL } from '@/apollo/queries/employee'
import Drawer from '@/components/drawer'
import InfoTable from '@/components/info-table'
import ChildHeader from '@/components/employee/child-header'
import errorHandler from '@/apollo/config/errorHandler'
import moment from 'moment'

export default {
    components: {
        Drawer,
        InfoTable,
        ChildHeader
    },
    apollo: {
        employeeDetail: {
            query: EMPLOYEE_PERSONAL,
            variables() {
                return {
                    id: this.$route.params.id
                }
            }
        }
    },
    data() {
        return {
            errors: [],
            editRow: null,
            isEdit: false,
            rows: [
                { prop: 'no', label: 'Employee No' },
                { prop: 'name', label: 'Employee Name' },
                { prop: 'placeOfBirth', label: 'Place Of Birth' },
                { prop: 'dateOfBirth', label: 'Date Of Birth',
                    formatter: row => {
                        return moment(new Date(row)).format('DD-MM-YYYY')
                    }
                },
                { prop: 'dateOfJoin', label: 'Date Of Join',
                    formatter: row => {
                        return moment(new Date(row)).format('DD-MM-YYYY')
                    }
                },
                { prop: 'gender', label: 'Gender' },
                { prop: 'religion', label: 'Religion' },
                { prop: 'maritalStatus', label: 'Marital Status',
                    formatter: row => {
                        const g = {
                            'S': 'Single',
                            'M0': 'Married 0 Children',
                            'M1': 'Married 1 Children',
                            'M3': 'Married 2 Children',
                            'M3': 'Married 3 Children'
                        }
                        return g[row]
                    }
                },
                { prop: 'phoneNumber', label: 'Phone Number' }
            ],
            editForm: {
                forms: [
                    { prop: 'no', label: 'Employee No', itemType: 'mask', mask: 'A.####', placeholder: '_.____', disabled: true,
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
                    { prop: 'dateOfJoin', label: 'Date Of Join', itemType: 'date', placeholder: '____-__-__',
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
        show(row) {
            this.isEdit = true
            row.dateOfBirth = new Date(row.dateOfBirth)
            row.dateOfJoin = new Date(row.dateOfJoin)
            this.editRow = row
        },
        handleOnClose() {
            this.isEdit = false
        },
        handleCancel(form) {
            this.isEdit = false
            this.errors = []
            form.resetFields()
        },
        handleEdit(form) {
            this.errors = []
            form.validate(async (valid) => {
                if(valid) {
                    try {
                        const { data } = await this.$apollo.mutate({
                            mutation: EMPLOYEE_UPDATE_PERSONAL,
                            variables: {
                                id: this.editRow.id,
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
                            update: (store, { data: { employeeUpdate } }) => {
                                const data = store.readQuery({
                                    query: EMPLOYEE_PERSONAL,
                                    variables: {
                                        id: this.$route.params.id
                                    }
                                })
                                const merge = _.merge(data, _.merge(data.employeeDetail, employeeUpdate))
                                store.writeQuery({
                                    query: EMPLOYEE_PERSONAL,
                                    variables: {
                                        id: this.$route.params.id
                                    },
                                    data: merge
                                })
                            },
                            optimisticResponse: {
                                __typename: 'Mutation',
                                employeeUpdate: {
                                    __typename: 'EmployeeType',
                                    id: this.editRow.id,
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
                        if(data.employeeUpdate) {
                            form.resetFields();
                            this.isEdit = false;
                            this.editRow = '';
                            this.$Notice.success({
                                title: 'Success',
                                desc: `Employee No "${data.employeeUpdate.no}" data has been updated succesfully`
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
