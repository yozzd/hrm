<template>
    <div>
        <child-header :data="karyawanDetail"></child-header>

        <data-table :data="karyawanDetail.kontak"
            :filter-options="filterOptions"
            :columns="columns"
            :loading="$apollo.loading"
            @on-selection-change="handleSelectionChange">
            <ButtonGroup slot="action">
            <Button
                type="primary"
                custom-icon="iconfont icon-plus"
                @click="show('create')">TAMBAH</Button>
            <Button
                type="error"
                custom-icon="iconfont icon-delete"
                :disabled="!multipleSelection.length"
                @click="handleDelete">HAPUS</Button>
            </ButtonGroup>
        </data-table>

        <drawer
            title="Tambah Kontak"
            width="300"
            v-if="isCreate"
            :value="isCreate"
            :form-options="formOption"
            :errors="errors"
            @cancel="handleCancel"
            @action="handleSave"
            @on-close="handleOnClose"
            save-button />
        <drawer
            title="Edit Kontak"
            width="300"
            v-if="isEdit"
            :value="isEdit"
            :form-options="formOption"
            :edit-row="editRow"
            :errors="errors"
            @cancel="handleCancel"
            @action="handleEdit"
            @on-close="handleOnClose" />
    </div>
</template>

<script>
import {
    KARYAWAN_KONTAK,
    KARYAWAN_CREATE_KONTAK,
    KARYAWAN_UPDATE_KONTAK } from '@/apollo/queries/karyawan'
import DataTable from '@/components/data-table'
import Drawer from '@/components/drawer'
import ChildHeader from '@/components/karyawan/child-header'
import { hubunganKeluarga } from '@/apollo/queries/options'
import errorHandler from '@/apollo/config/errorHandler'

export default {
    components: {
        DataTable,
        Drawer,
        ChildHeader
    },
    data() {
        return {
            karyawanDetail: {
                kontak: []
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
                { title: 'Telepon', key: 'telepon', width: 180 },
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
    apollo: {
        karyawanDetail: {
            query: KARYAWAN_KONTAK,
            variables() {
                return {
                    id: this.$route.params.id
                }
            }
        }
    },
    computed: {
        formOption() {
            const alamat = _.uniq([this.karyawanDetail.personal.alamatSekarang, this.karyawanDetail.personal.alamatKTP])
            return {
                forms: [
                    { prop: 'nama', label: 'Nama',
                        rules: [
                            { required: true, message: 'Nama tidak boleh kosong', trigger: 'blur' }
                        ]
                    },
                    { prop: 'hubunganKeluarga', label: 'Hubungan Keluarga', itemType: 'select', options: hubunganKeluarga.options, filterable: true,
                        rules: [
                            { required: true, message: 'Pilih Hubungan Keluarga', trigger: 'blur' }
                        ]
                    },
                    { prop: 'telepon', label: 'Telepon',
                        rules: [
                            { required: true, message: 'Telepon tidak boleh kosong', trigger: 'blur' }
                        ]
                    },
                    { prop: 'alamat', label: 'Alamat', itemType: 'autocomplete',
                        data: alamat,
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
                            mutation: KARYAWAN_CREATE_KONTAK,
                            variables: {
                                id: this.$route.params.id,
                                kontak: {
                                    nama: form.model.nama,
                                    hubunganKeluarga: form.model.hubunganKeluarga,
                                    telepon: form.model.telepon,
                                    alamat: form.model.alamat
                                }
                            },
                            update: (store, { data: { karyawanKontakCreate } }) => {
                                const data = store.readQuery({
                                    query: KARYAWAN_KONTAK,
                                    variables: { id: this.$route.params.id }
                                })
                                const merge = _.merge(data, _.merge(data.karyawanDetail.kontak, karyawanKontakCreate.keluarga))
                                store.writeQuery({
                                    query: KARYAWAN_KONTAK,
                                    variables: { id: this.$route.params.id },
                                    data: merge
                                })
                            },
                            optimisticResponse: {
                                __typename: 'Mutation',
                                karyawanKontakCreate: {
                                    __typename: 'KaryawanType',
                                    id: this.$route.params.id,
                                    kontak: [{
                                        __typename: 'KaryawanKontakType',
                                        id: -1,
                                        nama: form.model.nama,
                                        hubunganKeluarga: form.model.hubunganKeluarga,
                                        telepon: form.model.telepon,
                                        alamat: form.model.alamat
                                    }]
                                }
                            }
                        })
                        if(data.karyawanKontakCreate) {
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
        handleEdit(form) {
            this.errors = []
            form.validate(async (valid) => {
                if(valid) {
                    try {
                        const { data } = await this.$apollo.mutate({
                            mutation: KARYAWAN_UPDATE_KONTAK,
                            variables: {
                                id: this.$route.params.id,
                                kontak: {
                                    id: this.editRow.id,
                                    nama: form.model.nama,
                                    hubunganKeluarga: form.model.hubunganKeluarga,
                                    telepon: form.model.telepon,
                                    alamat: form.model.alamat
                                }
                            },
                            update: (store, { data: { karyawanKontakUpdate } }) => {
                                const data = store.readQuery({
                                    query: KARYAWAN_KONTAK,
                                    variables: {
                                        id: this.$route.params.id
                                    }
                                })
                                const merge = _.merge(data, _.merge(data.karyawanDetail.kontak, karyawanKontakUpdate.kontak))
                                store.writeQuery({
                                    query: KARYAWAN_KONTAK,
                                    variables: {
                                        id: this.$route.params.id
                                    },
                                    data: merge
                                })
                            },
                            optimisticResponse: {
                                __typename: 'Mutation',
                                karyawanKontakUpdate: {
                                    __typename: 'KaryawanType',
                                    id: this.$route.params.id,
                                    kontak: [{
                                        __typename: 'KaryawanKontakType',
                                        id: this.editRow.id,
                                        nama: form.model.nama,
                                        hubunganKeluarga: form.model.hubunganKeluarga,
                                        telepon: form.model.telepon,
                                        alamat: form.model.alamat
                                    }]
                                }
                            }
                        })
                        if(data.karyawanKontakUpdate) {
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
        },
        handleDelete() {}
    }
}
</script>
