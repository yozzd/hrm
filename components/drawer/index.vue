<template>
    <div>
        <Drawer
            :title="title"
            :value="value"
            :width="width"
            :formOptions="formOptions"
            :mask-closable="false"
            :styles="styles"
            @on-close="() => emitEventHandler('on-close')">
            <Form ref="form" :model="params">
                <FormItem
                    v-for="(form, index) in formOptions.forms" :key="index"
                    :label="form.label"
                    :prop="form.prop"
                    :rules="form.rules || []">
                <Input
                    v-if="form.itemType === 'input' || form.itemType === undefined"
                    v-model="params[form.modelValue]"
                    :type="form.type"
                    :autosize="form.autosize"
                    :disabled="form.disabled"
                    :placeholder="form.placeholder" />
                <Input
                    v-else-if="form.itemType === 'mask'"
                    v-model="params[form.modelValue]"
                    :type="form.type"
                    v-mask="form.mask"
                    :readonly="form.readonly"
                    :disabled="form.disabled"
                    :placeholder="form.placeholder" />
                <Select
                    v-else-if="form.itemType === 'select'"
                    v-model="params[form.modelValue]"
                    :filterable="form.filterable"
                    :disabled="form.disabled"
                    :placeholder="form.placeholder"
                    style="width: 100%;">
                    <Option
                        v-for="(option, optionIndex) in form.options" :key="optionIndex"
                        :value="(typeof option === 'object') ? option[form.valueKey || 'value'] : option"
                        :label="(typeof option === 'object') ? option[form.labelKey || 'label'] : option">
                    </Option>
                </Select>
                <DatePicker
                    v-else-if="form.itemType === 'date'"
                    v-model="params[form.modelValue]"
                    type="date"
                    v-mask="'##-##-####'"
                    format="dd-MM-yyyy"
                    :placeholder="form.placeholder"
                    :disabled="form.disabled"
                    :readonly="form.readonly"
                    :clearable="false"
                    style="width: 100%;">
                </DatePicker>
                <RadioGroup
                    v-else-if="form.itemType === 'radio'"
                    v-model="params[form.modelValue]"
                    type="button"
                    style="width: 100%;">
                <Radio
                    v-for="(option, optionIndex) in form.options" :key="optionIndex"
                    :label="option.label">
                </Radio>
                </RadioGroup>
                </FormItem>
            </Form>
            <Alert type="error" v-if="errors.length" v-for="(error, errorIndex) in errors" :key="errorIndex">
            {{ error }}
            </Alert>
            <div class="drawer-footer">
                <Button style="margin-right: 8px" @click="() => emitEventHandler('cancel', $refs.form)" custom-icon="iconfont icon-close">BATAL</Button>
                <Button type="primary" @click="() => emitEventHandler('action', $refs.form)" custom-icon="iconfont icon-save">
                    {{saveButton ? 'SIMPAN' : 'UPDATE'}}
                </Button>
            </div>
        </Drawer>
    </div>
</template>

<script>
export default {
    props: {
        title: String,
        width: String,
        saveButton: {
            type: Boolean,
            default: false
        },
        value: {
            type: Boolean,
            default: false
        },
        formOptions: {
            type: Object
        },
        errors: {
            type: Array
        },
        editRow: {
            type: Object
        }
    },
    data () {
        const { forms } = this.$props.formOptions
        const row = this.$props.editRow
        const params = {}
        const rules = {}
        forms.forEach((v, i) => {
            const propType = typeof v.prop
            if (propType === 'string') {
                v.modelValue = v.prop
                params[v.prop] = !row ? '' : v.dotProp ? v.itemType === 'date' ? new Date(_.get(row, v.dotProp)) : _.get(row, v.dotProp) : v.itemType === 'date' ? new Date(row[v.prop]) : row[v.prop]
                rules[v.prop] = v.rules
            }
        })
        return {
            params,
            rules,
            styles: {
                height: 'calc(100% - 55px)',
                overflow: 'auto',
                paddingBottom: '53px',
                position: 'static'
            }
        }
    },
    methods: {
        emitEventHandler(event) {
            this.$emit(event, ...Array.from(arguments).slice(1))
        }
    }
}
</script>
<style>
.drawer-footer {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
    z-index: 4;
}
</style>
