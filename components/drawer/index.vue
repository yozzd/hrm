<template>
    <div>
        <Drawer
            :title="title"
            v-model="show"
            width="720"
            :formOptions="formOptions"
            :mask-closable="false"
            :styles="styles"
            @on-close="() => emitEventHandler('on-close')">
            <Alert type="error" v-if="errors.length">
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
            </Alert>
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
                    :disabled="form.disabled"
                    :placeholder="form.placeholder" />
                <Select
                    v-else-if="form.itemType === 'select'"
                    v-model="params[form.modelValue]"
                    :disabled="form.disabled"
                    :placeholder="form.placeholder"
                    style="width: 100%;">
                    <Option
                        v-for="(option, optionIndex) in form.options" :key="optionIndex"
                        :value="(typeof option === 'object') ? option[form.valueKey || 'value'] : option"
                        :label="(typeof option === 'object') ? option[form.labelKey || 'label'] : option">
                    </Option>
                </Select>
                </FormItem>
            </Form>
            <div class="demo-drawer-footer">
                <Button style="margin-right: 8px" @click="() => emitEventHandler('cancel', $refs.form)" custom-icon="iconfont icon-close">CANCEL</Button>
                <Button type="primary" @click="() => emitEventHandler('action', $refs.form)" custom-icon="iconfont icon-save">SAVE</Button>
            </div>
        </Drawer>
    </div>
</template>

<script>
export default {
    props: {
        title: String,
        visible: {
            type: Boolean,
            default: false
        },
        formOptions: {
            type: Object
        },
        errors: {
            type: Array
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
                params[v.prop] = !row ? '' : row[v.prop]
                rules[v.prop] = v.rules;
            }
        })
        return {
            show: this.visible,
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
        },
    }
}
</script>
<style>
.demo-drawer-footer{
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
}
</style>
