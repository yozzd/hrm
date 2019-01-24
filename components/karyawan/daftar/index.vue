<template>
    <div>
        <crumb :data="breadcrumb"/>

        <Row>
        <data-table
            :data="karyawanAll"
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
            title="Tambah Karyawan"
            width="300"
            v-if="isCreate"
            :value="isCreate"
            :form-options="createForm"
            :errors="errors"
            @cancel="handleCancel"
            @action="handleSave"
            @on-close="handleOnClose"
            save-button />
        </Row>
    </div>
</template>

<script>
import {
  KARYAWAN_ALL,
  KARYAWAN_CREATE,
  KARYAWAN_DELETE,
} from '@/apollo/queries/karyawan';
import { AGAMA_ALL } from '@/apollo/queries/agama';
import { jenisKelamin, statusPernikahan } from '@/apollo/queries/options';
import * as _ from 'lodash';
import Crumb from '@/components/crumb';
import DataTable from '@/components/data-table';
import Drawer from '@/components/drawer';
import errorHandler from '@/apollo/config/errorHandler';
import moment from 'moment';

export default {
  components: {
    Crumb,
    DataTable,
    Drawer,
  },
  data() {
    return {
      breadcrumb: [
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Daftar Karyawan' },
      ],
      karyawanAll: [],
      multipleSelection: [],
      cachedMultipleSelection: [],
      isCreate: false,
      errors: [],
      filterOptions: {
        select: {
          options: [
            { value: 'no', label: 'No Karyawan' },
            { value: 'nama', label: 'Nama Karyawan' },
          ],
        },
      },
      columns: [
        { type: 'selection', width: 50, align: 'center', fixed: 'left' },
        {
          title: '#',
          width: 60,
          align: 'center',
          slot: 'reIndex',
          fixed: 'left',
        },
        {
          title: 'No Karyawan',
          width: 140,
          sortable: true,
          fixed: 'left',
          render: (h, params) => {
            return h('div', [
              h(
                'nuxt-link',
                {
                  props: {
                    to: `detail/${params.row.id}/personal`,
                  },
                },
                params.row.no,
              ),
            ]);
          },
        },
        {
          title: 'Nama Karyawan',
          width: 200,
          sortable: true,
          fixed: 'left',
          render: (h, params) => {
            return h('div', [
              h(
                'nuxt-link',
                {
                  props: {
                    to: `detail/${params.row.id}/personal`,
                  },
                },
                params.row.nama,
              ),
            ]);
          },
        },
        {
          title: 'Tempat Lahir',
          width: 180,
          render: (h, params) => {
            return h('div', [h('span', params.row.personal.tempatLahir)]);
          },
        },
        {
          title: 'Tanggal Lahir',
          width: 180,
          render: (h, params) => {
            return h('div', [
              h(
                'span',
                moment(new Date(params.row.personal.tanggalLahir)).format(
                  'DD-MM-YYYY',
                ),
              ),
            ]);
          },
        },
        {
          title: 'Tanggal Bergabung',
          width: 180,
          render: (h, params) => {
            return h('div', [
              h(
                'span',
                moment(new Date(params.row.personal.tanggalBergabung)).format(
                  'DD-MM-YYYY',
                ),
              ),
            ]);
          },
        },
        {
          title: 'Jenis Kelamin',
          minWidth: 180,
          render: (h, params) => {
            return h('div', [h('span', params.row.personal.jenisKelamin)]);
          },
        },
      ],
    };
  },
  apollo: {
    karyawanAll: {
      query: KARYAWAN_ALL,
    },
    agamaAll: {
      query: AGAMA_ALL,
    },
  },
  computed: {
    createForm() {
      return {
        forms: [
          {
            prop: 'no',
            label: 'No Karyawan',
            itemType: 'mask',
            mask: 'A.####',
            placeholder: '_.____',
            rules: [
              {
                required: true,
                message: 'No Karyawan tidak boleh kosong',
                trigger: 'blur',
              },
              {
                min: 6,
                message: 'No Karyawan minimal 6 karakter',
                trigger: 'blur',
              },
            ],
          },
          {
            prop: 'nama',
            label: 'Nama Karyawan',
            rules: [
              {
                required: true,
                message: 'Nama Karyawan tidak boleh kosong',
                trigger: 'blur',
              },
            ],
          },
          {
            prop: 'tempatLahir',
            label: 'Tempat Lahir',
            rules: [
              {
                required: true,
                message: 'Tempat Lahir tidak boleh kosong',
                trigger: 'blur',
              },
            ],
          },
          {
            prop: 'tanggalLahir',
            label: 'Tanggal Lahir',
            itemType: 'date',
            placeholder: '__-__-____',
            rules: [
              {
                required: true,
                type: 'date',
                message: 'Pilih Tanggal Lahir',
                trigger: 'change',
              },
            ],
          },
          {
            prop: 'tanggalBergabung',
            label: 'Tanggal Bergabung',
            itemType: 'date',
            placeholder: '__-__-____',
            rules: [
              {
                required: true,
                type: 'date',
                message: 'Pilih Tanggal Bergabung',
                trigger: 'change',
              },
            ],
          },
          {
            prop: 'jenisKelamin',
            label: 'Jenis Kelamin',
            itemType: 'radio',
            options: jenisKelamin.options,
            rules: [
              {
                required: true,
                message: 'Pilih Jenis Kelamin',
                trigger: 'change',
              },
            ],
          },
          {
            prop: 'agama',
            label: 'Agama',
            itemType: 'select',
            options: this.agamaAll,
            filterable: true,
            //            rules: [
            //              { required: true, message: 'Pilih Agama', trigger: 'change' },
            //            ],
          },
          {
            prop: 'statusPernikahan',
            label: 'Status Pernikahan',
            itemType: 'select',
            options: statusPernikahan.options,
            filterable: true,
            rules: [
              {
                required: true,
                message: 'Pilih Status Pernikahan',
                trigger: 'change',
              },
            ],
          },
          {
            prop: 'alamatSekarang',
            dotProp: 'personal.alamatSekarang',
            label: 'Alamat Sekarang',
            type: 'textarea',
            autosize: { minRows: 3 },
            rules: [
              {
                required: true,
                message: 'Alamat Sekarang tidak boleh kosong',
                trigger: 'blur',
              },
            ],
          },
          {
            prop: 'alamatKTP',
            dotProp: 'personal.alamatKTP',
            label: 'Alamat Kartu Tanda Penduduk',
            type: 'textarea',
            autosize: { minRows: 3 },
            rules: [
              {
                required: true,
                message: 'Alamat Kartu Tanda Penduduk tidak boleh kosong',
                trigger: 'blur',
              },
            ],
          },
          {
            prop: 'telepon',
            label: 'Telepon',
            rules: [
              {
                required: true,
                message: 'Nomor Telepon tidak boleh kosong',
                trigger: 'blur',
              },
            ],
          },
        ],
      };
    },
  },
  methods: {
    handleSelectionChange(arr) {
      this.multipleSelection = arr.map(v => ({ id: v.id }));
      this.cachedMultipleSelection = arr;
    },
    show(action) {
      this.isCreate = true;
    },
    handleOnClose() {
      this.isCreate = false;
    },
    handleCancel(form) {
      this.isCreate = false;
      this.errors = [];
      form.resetFields();
    },
    handleSave(form) {
      this.errors = [];
      form.validate(async valid => {
        if (valid) {
          try {
            const { data } = await this.$apollo.mutate({
              mutation: KARYAWAN_CREATE,
              variables: {
                no: form.model.no,
                nama: form.model.nama,
                personal: {
                  tempatLahir: form.model.tempatLahir,
                  tanggalLahir: moment(
                    new Date(form.model.tanggalLahir),
                  ).format('YYYY-MM-DD'),
                  tanggalBergabung: moment(
                    new Date(form.model.tanggalBergabung),
                  ).format('YYYY-MM-DD'),
                  jenisKelamin: form.model.jenisKelamin,
                  agama: form.model.agama,
                  statusPernikahan: form.model.statusPernikahan,
                  alamatSekarang: form.model.alamatSekarang,
                  alamatKTP: form.model.alamatKTP,
                  telepon: form.model.telepon,
                },
              },
              update: (store, { data: { karyawanCreate } }) => {
                const data = store.readQuery({ query: KARYAWAN_ALL });
                data.karyawanAll.push(karyawanCreate);
                store.writeQuery({ query: KARYAWAN_ALL, data });
              },
              optimisticResponse: {
                __typename: 'Mutation',
                karyawanCreate: {
                  __typename: 'KaryawanType',
                  id: -1,
                  no: form.model.no,
                  nama: form.model.nama,
                  personal: {
                    __typename: 'KaryawanPersonalType',
                    tempatLahir: form.model.tempatLahir,
                    tanggalLahir: moment(
                      new Date(form.model.tanggalLahir),
                    ).format('YYYY-MM-DD'),
                    tanggalBergabung: moment(
                      new Date(form.model.tanggalBergabung),
                    ).format('YYYY-MM-DD'),
                    jenisKelamin: form.model.jenisKelamin,
                    agama: form.model.agama,
                    statusPernikahan: form.model.statusPernikahan,
                    alamatSekarang: form.model.alamatSekarang,
                    alamatKTP: form.model.alamatKTP,
                    telepon: form.model.telepon,
                  },
                },
              },
            });
            if (data.karyawanCreate) {
              form.resetFields();
              this.isCreate = false;
              this.$Notice.success({
                title: 'Sukses',
                desc: `Karyawan dengan nomor "${
                  data.karyawanCreate.no
                }" berhasil ditambahkan`,
              });
            }
          } catch (err) {
            this.errors = errorHandler(err);
          }
        } else {
          return false;
        }
      });
    },
    handleDelete() {
      try {
        this.$Modal.confirm({
          title: 'PERHATIAN',
          content:
            '<p>Tindakan ini akan menghapus data secara permanen. Lanjutkan?</p>',
          okText: 'YA',
          cancelText: 'BATAL',
          loading: true,
          onOk: async () => {
            const { data } = await this.$apollo.mutate({
              mutation: KARYAWAN_DELETE,
              variables: {
                delete: this.multipleSelection,
              },
              update: async function(store, { data: { karyawanDelete } }) {
                const data = store.readQuery({ query: KARYAWAN_ALL });
                _.pullAllBy(data.karyawanAll, karyawanDelete, 'id');
                store.writeQuery({ query: KARYAWAN_ALL, data });
              },
              optimisticResponse: {
                __typename: 'Mutation',
                karyawanDelete: this.cachedMultipleSelection,
              },
            });
            if (data.karyawanDelete) {
              await this.$Modal.remove();
              this.multipleSelection = [];
              this.$Notice.success({
                title: 'Sukses',
                desc: 'Data berhasil dihapus',
              });
            }
          },
        });
      } catch (err) {
        this.errors = errorHandler(err);
      }
    },
  },
};
</script>
