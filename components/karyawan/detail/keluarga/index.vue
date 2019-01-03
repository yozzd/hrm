<template>
    <div>
        <child-header v-if="karyawanDetail" :data="karyawanDetail"></child-header>

        <data-table v-if="karyawanDetail" :data="karyawanDetail.keluarga" :filter-options="filterOptions" :columns="columns" :loading="$apollo.loading" @on-selection-change="handleSelectionChange">
            <ButtonGroup slot="action">
            <Button type="primary" custom-icon="iconfont icon-plus" @click="show('create')">TAMBAH</Button>
            <Button type="error" custom-icon="iconfont icon-delete" :disabled="!multipleSelection.length" @click="handleDelete">HAPUS</Button>
            </ButtonGroup>
        </data-table>

        <drawer title="Tambah Keluarga" width="300" v-if="isCreate" :value="isCreate" :form-options="createForm" :errors="errors" @cancel="handleCancel" @action="handleSave" @on-close="handleOnClose" save-button />
    </div>
</template>

<script>
import { KARYAWAN_KELUARGA, KARYAWAN_CREATE_KELUARGA, KARYAWAN_DELETE_KELUARGA } from '@/apollo/queries/karyawan'
import Drawer from '@/components/drawer'
import DataTable from '@/components/data-table'
import ChildHeader from '@/components/karyawan/child-header'
import errorHandler from '@/apollo/config/errorHandler'
import moment from 'moment'

export default {
    components: {
        Drawer,
        DataTable,
        ChildHeader
    },
    apollo: {
        karyawanDetail: {
            query: KARYAWAN_KELUARGA,
            variables() {
                return {
                    id: this.$route.params.id
                }
            }
        }
    },
    data() {
        return {
            multipleSelection: [],
            isCreate: false,
            isEdit: false,
            errors: [],
            filterOptions: {
                select: {
                    options: [
                        { value: 'nama', label: 'Nama' }
                    ]
                }
            },
            columns: [
                { type: 'selection', width: 40, align: 'center' },
                { title: '#', width: 60, align: 'center', slot: 'reIndex' },
                { title: 'Nama', key: 'nama', sortable: true },
                { title: 'Hubungan Keluarga', key: 'hubunganKeluarga' },
                { title: 'Jenis Kelamin', key: 'jenisKelamin' },
                { title: 'Tempat Lahir', key: 'tempatLahir' },
                { title: 'Tanggal Lahir', key: 'tanggalLahir',
                    render: (h, params) => {
                        return h('div', [
                            h('span', moment(new Date(params.row.tanggalLahir)).format('DD-MM-YYYY'))
                        ])
                    }
                },
                { title: 'Pendidikan', key: 'pendidikan',
                    render: (h, params) => {
                        const pendidikan = {
                            'BB': 'Belum Bersekolah',
                            'TK': 'TK',
                            'SD': 'SD',
                            'SMP': 'SMP',
                            'SMP': 'SMP',
                            'SMA': 'SMA',
                            'S1': 'S1',
                            'S2': 'S2',
                            'S3': 'S3'
                        }
                        return h('div', [
                            h('span', pendidikan[params.row.pendidikan])
                        ])
                    }
                },
                { title: 'Pekerjaan', key: 'pekerjaan' },
                { title: 'Alamat', key: 'alamat' },
            ],
            createForm: {
                forms: [
                    { prop: 'nama', label: 'Nama',
                        rules: [
                            { required: true, message: 'Nama tidak boleh kosong', trigger: 'blur' }
                        ]
                    },
                    { prop: 'hubunganKeluarga', label: 'Hubungan Keluarga',
                        rules: [
                            { required: true, message: 'Nama tidak boleh kosong', trigger: 'blur' }
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
                    { prop: 'pendidikan', label: 'Pendidikan', itemType: 'select',
                        options: [
                            { label: 'Belum Bersekolah', value: 'BB' },
                            { label: 'TK', value: 'TK' },
                            { label: 'SD', value: 'SD' },
                            { label: 'SMP', value: 'SMP' },
                            { label: 'SMA', value: 'SMA' },
                            { label: 'S1', value: 'S1' },
                            { label: 'S2', value: 'S2' },
                            { label: 'S3', value: 'S3' }
                        ],
                        rules: [
                            { required: true, message: 'Pilih Pendidikan', trigger: 'change' }
                        ]
                    },
                    { prop: 'pekerjaan', label: 'Pekerjaan' },
                    { prop: 'alamat', label: 'Alamat' },
                ]
            },
            editForm: {}
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
        handleSave(form) {
            this.errors = []
            form.validate(async (valid) => {
                if(valid) {
                    try {
                        const { data } = await this.$apollo.mutate({
                            mutation: KARYAWAN_CREATE_KELUARGA,
                            variables: {
                                id: this.$route.params.id,
                                keluarga: {
                                    nama: form.model.nama,
                                    hubunganKeluarga: form.model.hubunganKeluarga,
                                    jenisKelamin: form.model.jenisKelamin,
                                    tempatLahir: form.model.tempatLahir,
                                    tanggalLahir: moment(new Date(form.model.tanggalLahir)).format('YYYY-MM-DD'),
                                    pendidikan: form.model.pendidikan,
                                    pekerjaan: form.model.pekerjaan,
                                    alamat: form.model.alamat
                                }
                            },
                            update: (store, { data: { karyawanKeluargaCreate } }) => {
                                const data = store.readQuery({
                                    query: KARYAWAN_KELUARGA,
                                    variables: { id: this.$route.params.id }
                                })
                                const merge = _.merge(data, _.merge(data.karyawanDetail.keluargs, karyawanKeluargaCreate.keluarga))
                                store.writeQuery({
                                    query: KARYAWAN_KELUARGA,
                                    variables: {
                                        id: this.$route.params.id
                                    },
                                    data: merge
                                })
                            },
                            optimisticResponse: {
                                __typename: 'Mutation',
                                karyawanKeluargaCreate: {
                                    __typename: 'KaryawanType',
                                    id: this.$route.params.id,
                                    keluarga: [{
                                        __typename: 'KaryawanKeluargaType',
                                        id: -1,
                                        nama: form.model.nama,
                                        hubunganKeluarga: form.model.hubunganKeluarga,
                                        jenisKelamin: form.model.jenisKelamin,
                                        tempatLahir: form.model.tempatLahir,
                                        tanggalLahir: moment(new Date(form.model.tanggalLahir)).format('YYYY-MM-DD'),
                                        pendidikan: form.model.pendidikan,
                                        pekerjaan: form.model.pekerjaan,
                                        alamat: form.model.alamat
                                    }]
                                }
                            }
                        })
                        if(data.karyawanKeluargaCreate) {
                            form.resetFields()
                            this.isCreate = false
                            this.$Notice.success({
                                title: 'Sukses',
                                desc: `Data karyawan dengan nomor "${this.karyawanDetail.no}" berhasil diperbaharui`
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
                    title: 'PERHATIAN',
                    content: '<p>Tindakan ini akan menghapus data secara permanen. Lanjutkan?</p>',
                    okText: 'YA',
                    cancelText: 'BATAL',
                    loading: true,
                    onOk: async () => {
                        const { data } = await this.$apollo.mutate({
                            mutation: KARYAWAN_DELETE_KELUARGA,
                            variables: {
                                id: this.$route.params.id,
                                delete: this.multipleSelection
                            },
                            update: async function (store, { data: { karyawanKeluargaDelete } }) {
                                const data = store.readQuery({
                                    query: KARYAWAN_KELUARGA,
                                    variables: { id: this.$nuxt.$route.params.id }
                                })
                                _.pullAllBy(data.karyawanDetail.keluarga, karyawanKeluargaDelete, 'id')
                                store.writeQuery({
                                    query: KARYAWAN_KELUARGA,
                                    variables: { id: this.$nuxt.$route.params.id },
                                    data
                                })
                            },
                            optimisticResponse: {
                                __typename: 'Mutation',
                                karyawanKeluargaDelete: this.karyawanDetail
                            }
                        })
                        if(data.karyawanKeluargaDelete) {
                            await this.$Modal.remove()
                            this.$Notice.success({
                                title: 'Sukses',
                                desc: 'Data berhasil dihapus'
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
