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
import { KARYAWAN_ALAMAT, KARYAWAN_UPDATE_ALAMAT} from '@/apollo/queries/karyawan'
import Drawer from '@/components/drawer'
import InfoTable from '@/components/info-table'
import ChildHeader from '@/components/karyawan/child-header'
import errorHandler from '@/apollo/config/errorHandler'

export default {
    components: {
        Drawer,
        InfoTable,
        ChildHeader
    },
    apollo: {
        karyawanDetail: {
            query: KARYAWAN_ALAMAT,
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
                { prop: 'perumahan', label: 'Perumahan' },
                { prop: 'blok', label: 'Blok' },
                { prop: 'noP', label: 'No' },
                { prop: 'rt', label: 'RT' },
                { prop: 'rw', label: 'RW' },
                { prop: 'kelurahan', label: 'Kelurahan' },
                { prop: 'kecamatan', label: 'Kecamatan' },
                { prop: 'kota', label: 'Kota' }
            ],
            editForm: {
                forms: [
                    { prop: 'perumahan', label: 'Perumahan' },
                    { prop: 'blok', label: 'Blok' },
                    { prop: 'noP', label: 'No' },
                    { prop: 'rt', label: 'RT' },
                    { prop: 'rw', label: 'RW' },
                    { prop: 'kelurahan', label: 'Kelurahan' },
                    { prop: 'kecamatan', label: 'Kecamatan' },
                    { prop: 'kota', label: 'Kota' }
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
                            mutation: KARYAWAN_UPDATE_ALAMAT,
                            variables: {
                                id: this.editRow.id,
                                perumahan: form.model.perumahan,
                                blok: form.model.blok,
                                noP: form.model.noP,
                                rt: form.model.rt,
                                rw: form.model.rw,
                                kelurahan: form.model.kelurahan,
                                kecamatan: form.model.kecamatan,
                                kota: form.model.kota
                            },
                            update: (store, { data: { karyawanUpdate } }) => {
                                const data = store.readQuery({
                                    query: KARYAWAN_ALAMAT,
                                    variables: {
                                        id: this.$route.params.id
                                    }
                                })
                                const merge = _.merge(data, _.merge(data.karyawanDetail, karyawanUpdate))
                                store.writeQuery({
                                    query: KARYAWAN_ALAMAT,
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
                                    perumahan: form.model.perumahan,
                                    blok: form.model.blok,
                                    noP: form.model.noP,
                                    rt: form.model.rt,
                                    rw: form.model.rw,
                                    kelurahan: form.model.kelurahan,
                                    kecamatan: form.model.kecamatan,
                                    kota: form.model.kota
                                }
                            }
                        })
                        if(data.karyawanUpdate) {
                            form.resetFields();
                            this.isEdit = false;
                            this.editRow = '';
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
        }
    }
}
</script>
