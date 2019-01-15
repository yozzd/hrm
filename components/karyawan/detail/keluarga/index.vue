<template>
    <div>
        <child-header :data="karyawanDetail"></child-header>
        <data-table :data="karyawanDetail.keluarga" :filter-options="filterOptions" :columns="columns" :loading="$apollo.loading" @on-selection-change="handleSelectionChange">
            <ButtonGroup slot="action">
            <Button type="primary" custom-icon="iconfont icon-plus" @click="show('create')">TAMBAH</Button>
            <Button type="error" custom-icon="iconfont icon-delete" :disabled="!multipleSelection.length" @click="handleDelete">HAPUS</Button>
            </ButtonGroup>
        </data-table>

        <drawer title="Tambah Keluarga" width="300" v-if="isCreate" :value="isCreate" :form-options="formOption" :errors="errors" @cancel="handleCancel" @action="handleSave" @on-close="handleOnClose" save-button />
        <drawer title="Edit Keluarga" width="300" v-if="isEdit" :value="isEdit" :form-options="formOption" :edit-row="editRow" :errors="errors" @cancel="handleCancel" @action="handleEdit" @on-close="handleOnClose" />
    </div>
</template>

<script>
import {
    KARYAWAN_KELUARGA,
    KARYAWAN_CREATE_KELUARGA,
    KARYAWAN_UPDATE_KELUARGA,
    KARYAWAN_DELETE_KELUARGA } from '@/apollo/queries/karyawan'
import { pendidikan, jenisKelamin, hubunganKeluarga } from '@/apollo/queries/options'
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
            karyawanDetail: {
                keluarga: []
            },
            multipleSelection: [],
            cachedMultipleSelection: [],
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
                { type: 'selection', width: 50, align: 'center', fixed: 'left' },
                { title: '#', width: 60, align: 'center', slot: 'reIndex', fixed: 'left' },
                { title: 'Nama', key: 'nama', sortable: true, width: 180, fixed: 'left' },
                { title: 'Hubungan Keluarga', key: 'hubunganKeluarga', width: 180 },
                { title: 'Jenis Kelamin', key: 'jenisKelamin', width: 180 },
                { title: 'Tempat Lahir', key: 'tempatLahir', width: 180 },
                { title: 'Tanggal Lahir', key: 'tanggalLahir', width: 180,
                    render: (h, params) => {
                        return h('div', [
                            h('span', moment(new Date(params.row.tanggalLahir)).format('DD-MM-YYYY'))
                        ])
                    }
                },
                { title: 'Pendidikan', key: 'pendidikan', width: 180,
                    render: (h, params) => {
                        const p = _.reduce(pendidikan.options, (r, v, k) => {
                            r[v.value] = v.label
                            return r
                        }, {})
                        return h('div', [
                            h('span', p[params.row.pendidikan])
                        ])
                    }
                },
                { title: 'Pekerjaan', key: 'pekerjaan', width: 180 },
                { title: 'Alamat', key: 'alamat', width: 300 },
                { title: 'Aksi', key: 'action', width: 100, align: 'center', fixed: 'right',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'dashed',
                                    size: 'small'
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
        }
    },
    computed: {
        formOption() {
            return {
                forms: [
                    { prop: 'nama', label: 'Nama',
                        rules: [
                            { required: true, message: 'Nama tidak boleh kosong', trigger: 'blur' }
                        ]
                    },
                    { prop: 'hubunganKeluarga', label: 'Hubungan Keluarga', itemType: 'select', options: hubunganKeluarga.options, filterable: true,
                        rules: [
                            { required: true, message: 'Nama tidak boleh kosong', trigger: 'blur' }
                        ]
                    },
                    { prop: 'jenisKelamin', label: 'Jenis Kelamin', itemType: 'radio', options: jenisKelamin.options,
                        rules: [
                            { required: true, message: 'Pilih Jenis Kelamin', trigger: 'change' }
                        ],
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
                    { prop: 'pendidikan', label: 'Pendidikan', itemType: 'select', options: pendidikan.options, filterable: true,
                        rules: [
                            { required: true, message: 'Pilih Pendidikan', trigger: 'change' }
                        ]
                    },
                    { prop: 'pekerjaan', label: 'Pekerjaan',
                        rules: [
                            { required: true, message: 'Pekerjaan tidak boleh kosong', trigger: 'blur' }
                        ]
                    },
                    { prop: 'alamat', label: 'Alamat', itemType: 'autocomplete',
                        data: [this.karyawanDetail.personal.alamat],
                        rules: [
                            { required: true, message: 'Alamat tidak boleh kosong', trigger: 'blur' }
                        ]
                    }
                ]
            }
        }
    },
    methods: {
        handleSelectionChange(arr) {
            this.multipleSelection = arr.map(v => ({ id: v.id }))
            this.cachedMultipleSelection = arr
        },
        show(action, row) {
            if(action === 'create') {
                this.isCreate = true
            } else {
                row.tanggalLahir = new Date(row.tanggalLahir)
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
                                const merge = _.merge(data, _.merge(data.karyawanDetail.keluarga, karyawanKeluargaCreate.keluarga))
                                store.writeQuery({
                                    query: KARYAWAN_KELUARGA,
                                    variables: { id: this.$route.params.id },
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
                                desc: `Data karyawan "${this.karyawanDetail.no}" berhasil diperbaharui`
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
                                karyawanKeluargaDelete: this.cachedMultipleSelection
                            }
                        })
                        if(data.karyawanKeluargaDelete) {
                            await this.$Modal.remove()
                            this.multipleSelection = []
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
        },
        handleEdit(form) {
            this.errors = []
            form.validate(async (valid) => {
                if(valid) {
                    try {
                        const { data } = await this.$apollo.mutate({
                            mutation: KARYAWAN_UPDATE_KELUARGA,
                            variables: {
                                id: this.$route.params.id,
                                keluarga: {
                                    id: this.editRow.id,
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
                            update: (store, { data: { karyawanKeluargaUpdate } }) => {
                                const data = store.readQuery({
                                    query: KARYAWAN_KELUARGA,
                                    variables: {
                                        id: this.$route.params.id
                                    }
                                })
                                const merge = _.merge(data, _.merge(data.karyawanDetail.keluarga, karyawanKeluargaUpdate.keluarga))
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
                                karyawanKeluargaUpdate: {
                                    __typename: 'KaryawanType',
                                    id: this.$route.params.id,
                                    keluarga: [{
                                        __typename: 'KaryawanKeluargaType',
                                        id: this.editRow.id,
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
                        if(data.karyawanKeluargaUpdate) {
                            form.resetFields()
                            this.isEdit = false
                            this.editRow = ''
                            this.$Notice.success({
                                title: 'Sukses',
                                desc: `Data karyawan "${this.karyawanDetail.no}" berhasil diperbaharui`
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
