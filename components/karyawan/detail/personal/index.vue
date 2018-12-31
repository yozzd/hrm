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
                { prop: 'tempatLahir', label: 'Tempat Lahir' },
                { prop: 'tanggalLahir', label: 'Tanggal Lahir',
                    formatter: row => {
                        return moment(new Date(row)).format('DD-MM-YYYY')
                    }
                },
                { prop: 'tanggalBergabung', label: 'Tanggal Bergabung',
                    formatter: row => {
                        return moment(new Date(row)).format('DD-MM-YYYY')
                    }
                },
                { prop: 'jenisKelamin', label: 'Jenis Kelamin' },
                { prop: 'agama', label: 'Agama' },
                { prop: 'statusPerkawinan', label: 'Status Perkawinan',
                    formatter: row => {
                        const g = {
                            'BM': 'Belum Menikah',
                            'M0': 'Menikah 0 Anak',
                            'M1': 'Menikah 1 Anak',
                            'M3': 'Menikah 2 Anak',
                            'M3': 'Menikah 3 Anak'
                        }
                        return g[row]
                    }
                },
                { prop: 'telepon', label: 'Telepon' }
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
                    { prop: 'tempatLahir', label: 'Tempat Lahir',
                        rules: [
                            { required: true, message: 'Tempat Lahir tidak boleh kosong', trigger: 'blur' }
                        ]
                    },
                    { prop: 'tanggalLahir', label: 'Tanggal Lahir', itemType: 'date', placeholder: '__-__-____',
                        rules: [
                            { required: true, type: 'date', message: 'Pilih Tanggal Lahir', trigger: 'change' }
                        ]
                    },
                    { prop: 'tanggalBergabung', label: 'Tanggal Bergabung', itemType: 'date', placeholder: '__-__-____',
                        rules: [
                            { required: true, type: 'date', message: 'Pilih Tanggal Bergabung', trigger: 'change' }
                        ]
                    },
                    { prop: 'jenisKelamin', label: 'Jenis Kelamin', itemType: 'radio',
                        rules: [
                            { required: true, message: 'Pilih Jenis Kelamin', trigger: 'change' }
                        ],
                        options: [
                            { label: 'L' },
                            { label: 'P' }
                        ]
                    },
                    { prop: 'agama', label: 'Agama', itemType: 'select',
                        options: [
                            { label: 'Islam', value: 'Islam' },
                            { label: 'Kristen', value: 'Kristen' },
                            { label: 'Budha', value: 'Budha' },
                            { label: 'Hindu', value: 'Hindu' }
                        ],
                        rules: [
                            { required: true, message: 'Pilih Agama', trigger: 'change' }
                        ]
                    },
                    { prop: 'statusPerkawinan', label: 'Status Perkawinan', itemType: 'select',
                        options: [
                            { label: 'Belum Menikah', value: 'BM' },
                            { label: 'Menikah 0 Anak', value: 'M0' },
                            { label: 'Menikah 1 Anak', value: 'M1' },
                            { label: 'Menikah 2 Anak', value: 'M2' },
                            { label: 'Menikah 3 Anak', value: 'M3' }
                        ],
                        rules: [
                            { required: true, message: 'Pilih Status Perkawinan', trigger: 'change' }
                        ]
                    },
                    { prop: 'telepon', label: 'Telepon',
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
            row.tanggalLahir = new Date(row.tanggalLahir)
            row.tanggalBergabung = new Date(row.tanggalBergabung)
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
                                tempatLahir: form.model.tempatLahir,
                                tanggalLahir: moment(new Date(form.model.tanggalLahir)).format('YYYY-MM-DD'),
                                tanggalBergabung: moment(new Date(form.model.tanggalBergabung)).format('YYYY-MM-DD'),
                                jenisKelamin: form.model.jenisKelamin,
                                agama: form.model.agama,
                                statusPerkawinan: form.model.statusPerkawinan,
                                telepon: form.model.telepon
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
                                    tempatLahir: form.model.tempatLahir,
                                    tanggalLahir: moment(new Date(form.model.tanggalLahir)).format('YYYY-MM-DD'),
                                    tanggalBergabung: moment(new Date(form.model.tanggalBergabung)).format('YYYY-MM-DD'),
                                    jenisKelamin: form.model.jenisKelamin,
                                    agama: form.model.agama,
                                    statusPerkawinan: form.model.statusPerkawinan,
                                    telepon: form.model.telepon
                                }
                            }
                        })
                        if(data.karyawanUpdate) {
                            form.resetFields();
                            this.isEdit = false;
                            this.editRow = '';
                            this.$Notice.success({
                                title: 'Sukses',
                                desc: `Data karyawan dengan nomor "${data.karyawanUpdate.no}" berhasil diperbaharui`
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
