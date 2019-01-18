<template>
    <div>
        <Row type="flex" justify="center">
        <Col span="6">
        <Card>
        <p slot="title">{{$auth.state.user.username}}</p>
        <a href="#" slot="extra" @click="show">Ubah Password</a>
        <p>Content of card</p>
        </Card>
        </Col>
        </Row>

        <drawer title="Ubah Password" width="300" v-if="isVisible" :value="isVisible" :form-options="formOptions" :errors="errors" @cancel="handleCancel" @action="handleSave" @on-close="handleOnClose" save-button />
    </div>
</template>

<script>
import { USER_CHANGE_PASSWORD } from '@/apollo/queries/user'
import Drawer from '@/components/drawer'
import errorHandler from '@/apollo/config/errorHandler'

export default {
    components: {
        Drawer
    },
    data() {
        return {
            isVisible: false,
            errors: [],
            formOptions: {
                forms: [
                    { prop: 'oldPassword', label: 'Password Lama', type: 'password',
                        rules: [
                            { required: true, message: 'Masukkan password lama anda', trigger: 'blur' },
                            { min: 6, message: 'Password minimal 6 karakter', trigger: 'blur' }
                        ]
                    },
                    { prop: 'newPassword', label: 'Password Baru', type: 'password',
                        rules: [
                            { required: true, message: 'Masukkan password baru anda', trigger: 'blur' },
                            { min: 6, message: 'Password minimal 6 karakter', trigger: 'blur' }
                        ]
                    }
                ]
            }
        }
    },
    methods: {
        show() {
            this.isVisible = true
        },
        handleOnClose() {
            this.isVisible = false
        },
        handleCancel(form) {
            this.isVisible = false
            this.errors = []
            form.resetFields()
        },
        handleSave(form) {
            this.error = []
            form.validate(async (valid) => {
                if(valid) {
                    try {
                        const { data } = await this.$apollo.mutate({
                            mutation: USER_CHANGE_PASSWORD,
                            variables: {
                                id: this.$auth.state.user.id,
                                oldPassword: form.model.oldPassword,
                                newPassword: form.model.newPassword
                            }
                        })
                        if(data.userChangePassword) {
                            form.resetFields();
                            this.isVisible = false
                            this.$Notice.success({
                                title: 'Success',
                                desc: `Password anda berhasil diperbaharui, silahkan logout dan login kembali dengan password yang baru`
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
