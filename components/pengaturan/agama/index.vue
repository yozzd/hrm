<template>
    <div>
        <crumb :data="breadcrumb"/>

        <Row>
        <data-table
            :data="agamaAll"
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
            title="Tambah Agama"
            width="300"
            v-if="isCreate"
            :value="isCreate"
            :form-options="formOptions"
            :errors="errors"
            @cancel="handleCancel"
            @action="handleSave"
            @on-close="handleOnClose"
            save-button />

        <drawer
            title="Edit Agama"
            width="300"
            v-if="isEdit"
            :value="isEdit"
            :form-options="formOptions"
            :edit-row="editRow"
            :errors="errors"
            @cancel="handleCancel"
            @action="handleEdit"
            @on-close="handleOnClose" />
        </Row>
    </div>
</template>

<script>
import {
  AGAMA_ALL,
  AGAMA_CREATE,
  AGAMA_UPDATE,
  AGAMA_DELETE,
} from '@/apollo/queries/agama';
import Crumb from '@/components/crumb';
import DataTable from '@/components/data-table';
import Drawer from '@/components/drawer';
import errorHandler from '@/apollo/config/errorHandler';

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
        { label: 'Agama' },
      ],
      agamaAll: [],
      multipleSelection: [],
      cachedMultipleSelection: [],
      isCreate: false,
      isEdit: false,
      errors: [],
      filterOptions: {
        select: {
          options: [{ value: 'label', label: 'Agama' }],
        },
      },
      columns: [
        { type: 'selection', width: 40, align: 'center' },
        { title: '#', width: 60, align: 'center', slot: 'reIndex' },
        { title: 'Agama', key: 'label', sortable: true },
        {
          title: 'Aksi',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'dashed',
                    size: 'small',
                  },
                  on: {
                    click: () => {
                      this.show('edit', params.row);
                    },
                  },
                },
                'Edit',
              ),
            ]);
          },
        },
      ],
      formOptions: {
        forms: [
          {
            prop: 'label',
            label: 'Agama',
            rules: [
              {
                required: true,
                message: 'Agama tidak boleh kosong',
                trigger: 'blur',
              },
            ],
          },
        ],
      },
    };
  },
  apollo: {
    agamaAll: {
      query: AGAMA_ALL,
    },
  },
  methods: {
    handleSelectionChange(arr) {
      this.multipleSelection = arr.map(v => ({ id: v.id }));
      this.cachedMultipleSelection = arr;
    },
    show(action, row) {
      if (action === 'create') {
        this.isCreate = true;
      } else {
        this.isEdit = true;
        this.editRow = row;
      }
    },
    handleOnClose() {
      this.isCreate = false;
      this.isEdit = false;
    },
    handleCancel(form) {
      this.isCreate = false;
      this.isEdit = false;
      this.errors = [];
      form.resetFields();
    },
    handleSave(form) {
      this.errors = [];
      form.validate(async valid => {
        if (valid) {
          try {
            const { data } = await this.$apollo.mutate({
              mutation: AGAMA_CREATE,
              variables: {
                label: form.model.label,
                value: this.agamaAll.length,
              },
              update: (store, { data: { agamaCreate } }) => {
                const data = store.readQuery({ query: AGAMA_ALL });
                data.agamaAll.push(agamaCreate);
                store.writeQuery({ query: AGAMA_ALL, data });
              },
              optimisticResponse: {
                __typename: 'Mutation',
                agamaCreate: {
                  __typename: 'AgamaType',
                  id: -1,
                  label: form.model.label,
                  value: this.agamaAll.length,
                },
              },
            });
            if (data.agamaCreate) {
              form.resetFields();
              this.isCreate = false;
              this.$Notice.success({
                title: 'Success',
                desc: `Agama "${data.agamaCreate.label}" berhasil ditambahkan`,
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
    handleEdit(form) {
      this.errors = [];
      form.validate(async valid => {
        if (valid) {
          try {
            const { data } = await this.$apollo.mutate({
              mutation: AGAMA_UPDATE,
              variables: {
                id: this.editRow.id,
                label: form.model.label,
              },
              update: (store, { data: { agamaUpdate } }) => {
                const data = store.readQuery({
                  query: AGAMA_ALL,
                });
                const merge = _.merge(
                  data,
                  _.merge(data.agamaAll, agamaUpdate),
                );
                store.writeQuery({
                  query: AGAMA_ALL,
                  data: merge,
                });
              },
              optimisticResponse: {
                __typename: 'Mutation',
                agamaUpdate: {
                  __typename: 'AgamaType',
                  id: this.editRow.id,
                  label: form.model.label,
                  value: -1,
                },
              },
            });
            if (data.agamaUpdate) {
              form.resetFields();
              this.isEdit = false;
              this.editRow = '';
              this.$Notice.success({
                title: 'Success',
                desc: `Data berhasil diperbaharui`,
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
              mutation: AGAMA_DELETE,
              variables: {
                delete: this.multipleSelection,
              },
              update: async function(store, { data: { agamaDelete } }) {
                const data = store.readQuery({ query: AGAMA_ALL });
                _.pullAllBy(data.agamaAll, agamaDelete, 'id');
                store.writeQuery({ query: AGAMA_ALL, data });
              },
              optimisticResponse: {
                __typename: 'Mutation',
                agamaDelete: this.cachedMultipleSelection,
              },
            });
            if (data.agamaDelete) {
              await this.$Modal.remove();
              this.multipleSelection = [];
              this.$Notice.success({
                title: 'Deleted',
                desc: 'Data succesfully deleted',
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
