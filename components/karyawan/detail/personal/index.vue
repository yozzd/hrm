<template>
    <div>
        <child-header v-if="karyawanDetail" :data="karyawanDetail"></child-header>

        <info-table :data="karyawanDetail" :rows="rows">
            <tr slot="append">
                <td></td>
                <td>
                    <Button type="dashed" size="small" @click="show(karyawanDetail)">Edit</Button>
                </td>
            </tr>
        </info-table>

        <drawer title="Edit Karyawan" width="300" v-if="isEdit" :value="isEdit" :form-options="editForm" :edit-row="editRow" :errors="errors" @cancel="handleCancel" @action="handleEdit" @on-close="handleOnClose" />
    </div>
</template>

<script>
import { KARYAWAN_PERSONAL, KARYAWAN_UPDATE_PERSONAL } from '@/apollo/queries/karyawan'
import { jenisKelamin, agama, statusPernikahan } from '@/apollo/queries/options'
import Drawer from '@/components/drawer'
import InfoTable from '@/components/info-table'
import ChildHeader from '@/components/karyawan/child-header'
import errorHandler from '@/apollo/config/errorHandler'
import moment from 'moment'

export default {
    components: {
        Drawer,
        InfoTable,
        ChildHeader
    },
    apollo: {
        karyawanDetail: {
            query: KARYAWAN_PERSONAL,
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
                { prop: 'no', label: 'No Karyawan' },
                { prop: 'nama', label: 'Nama Karyawan' },
                { prop: 'personal', label: 'Tempat Lahir',
                    render: row => {
                        return row.tempatLahir
                    }
                },
                { prop: 'personal', label: 'Tanggal Lahir',
                    render: row => {
                        return moment(new Date(row.tanggalLahir)).format('DD-MM-YYYY')
                    }
                },
                { prop: 'personal', label: 'Tanggal Bergabung',
                    render: row => {
                        return moment(new Date(row.tanggalBergabung)).format('DD-MM-YYYY')
                    }
                },
                { prop: 'personal', label: 'Jenis Kelamin',
                    render: row => {
                        return row.jenisKelamin
                    }
                },
                { prop: 'personal', label: 'Agama',
                    render: row => {
                        return row.agama
                    }
                },
                { prop: 'personal', label: 'Status Pernikahan',
                    render: row => {
                        const g = _.reduce(statusPernikahan.options, (r, v, k) => {
                            r[v.value] = v.label
                            return r
                        }, {})
                        return g[row.statusPernikahan]
                    }
                },
                { prop: 'personal', label: 'Telepon',
                    render: row => {
                        return row.telepon
                    }
                }
            ],
            editForm: {
                forms: [
                    { prop: 'no', label: 'No Karyawan', itemType: 'mask', mask: 'A.####', placeholder: '_.____',
                        rules: [
                            { required: true, message: 'No Karyawan tidak boleh kosong', trigger: 'blur' },
                            { min: 6, message: 'No Karyawan minimal 6 karakter', trigger: 'blur' }
                        ]
                    },
                    { prop: 'nama', label: 'Nama Karyawan',
                        rules: [
                            { required: true, message: 'Nama Karyawan tidak boleh kosong', trigger: 'blur' }
                        ]
                    },
                    { prop: 'tempatLahir', dotProp: 'personal.tempatLahir', label: 'Tempat Lahir',
                        rules: [
                            { required: true, message: 'Tempat Lahir tidak boleh kosong', trigger: 'blur' }
                        ]
                    },
                    { prop: 'tanggalLahir', dotProp: 'personal.tanggalLahir', label: 'Tanggal Lahir', itemType: 'date', placeholder: '__-__-____',
                        rules: [
                            { required: true, type: 'date', message: 'Pilih Tanggal Lahir', trigger: 'change' }
                        ]
                    },
                    { prop: 'tanggalBergabung', dotProp: 'personal.tanggalBergabung', label: 'Tanggal Bergabung', itemType: 'date', placeholder: '__-__-____',
                        rules: [
                            { required: true, type: 'date', message: 'Pilih Tanggal Bergabung', trigger: 'change' }
                        ]
                    },
                    { prop: 'jenisKelamin', dotProp: 'personal.jenisKelamin', label: 'Jenis Kelamin', itemType: 'radio', options: jenisKelamin.options,
                        rules: [
                            { required: true, message: 'Pilih Jenis Kelamin', trigger: 'change' }
                        ]
                    },
                    { prop: 'agama', dotProp: 'personal.agama', label: 'Agama', itemType: 'select', options: agama.options, filterable: true,
                        rules: [
                            { required: true, message: 'Pilih Agama', trigger: 'change' }
                        ]
                    },
                    { prop: 'statusPernikahan', dotProp: 'personal.statusPernikahan', label: 'Status Pernikahan', itemType: 'select', options: statusPernikahan.options, filterable: true,
                        rules: [
                            { required: true, message: 'Pilih Status Pernikahan', trigger: 'change' }
                        ]
                    },
                    { prop: 'telepon', dotProp: 'personal.telepon', label: 'Telepon',
                        rules: [
                            { required: true, message: 'Nomor Telepon tidak boleh kosong', trigger: 'blur' }
                        ]
                    }
                ]
            }
        }
    },
    methods: {
        show(row) {
            this.isEdit = true
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
                            mutation: KARYAWAN_UPDATE_PERSONAL,
                            variables: {
                                id: this.editRow.id,
                                no: form.model.no,
                                nama: form.model.nama,
                                personal: {
                                    tempatLahir: form.model.tempatLahir,
                                    tanggalLahir: moment(new Date(form.model.tanggalLahir)).format('YYYY-MM-DD'),
                                    tanggalBergabung: moment(new Date(form.model.tanggalBergabung)).format('YYYY-MM-DD'),
                                    jenisKelamin: form.model.jenisKelamin,
                                    agama: form.model.agama,
                                    statusPernikahan: form.model.statusPernikahan,
                                    telepon: form.model.telepon
                                }
                            },
                            update: (store, { data: { karyawanUpdate } }) => {
                                const data = store.readQuery({
                                    query: KARYAWAN_PERSONAL,
                                    variables: {
                                        id: this.$route.params.id
                                    }
                                })
                                const merge = _.merge(data, _.merge(data.karyawanDetail, karyawanUpdate))
                                store.writeQuery({
                                    query: KARYAWAN_PERSONAL,
                                    variables: {
                                        id: this.$route.params.id
                                    },
                                    data: merge
                                })
                            },
                            optimisticResponse: {
                                __typename: 'Mutation',
                                karyawanUpdate: {
                                    __typename: 'KaryawanType',
                                    id: this.editRow.id,
                                    no: form.model.no,
                                    nama: form.model.nama,
                                    personal: {
                                        __typename: 'KaryawanPersonalType',
                                        tempatLahir: form.model.tempatLahir,
                                        tanggalLahir: moment(new Date(form.model.tanggalLahir)).format('YYYY-MM-DD'),
                                        tanggalBergabung: moment(new Date(form.model.tanggalBergabung)).format('YYYY-MM-DD'),
                                        jenisKelamin: form.model.jenisKelamin,
                                        agama: form.model.agama,
                                        statusPernikahan: form.model.statusPernikahan,
                                        telepon: form.model.telepon
                                    }
                                }
                            }
                        })
                        if(data.karyawanUpdate) {
                            form.resetFields()
                            this.isEdit = false
                            this.editRow = ''
                            this.$Notice.success({
                                title: 'Sukses',
                                desc: `Data karyawan "${data.karyawanUpdate.no}" berhasil diperbaharui`
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
