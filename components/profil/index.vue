<template>
    <div>
        <Row type="flex" justify="center">
        <Col span="8">
        <Card class="profil">
        <p slot="title">{{$auth.state.user.username}}</p>
        <a slot="extra" @click="show">Ubah Password</a>
        <table>
            <tr>
                <td>Role</td>
                <td>{{userDetail.role}}</td>
            </tr>
            <tr>
                <td>Aktif sejak</td>
                <td>{{created}}</td>
            </tr>
        </table>
        </Card>
        </Col>
        </Row>

        <drawer
            title="Ubah Password"
            width="300"
            v-if="isVisible"
            :value="isVisible"
            :form-options="formOptions"
            :errors="errors"
            @cancel="handleCancel"
            @action="handleSave"
            @on-close="handleOnClose"
            save-button />
    </div>
</template>

<script>
import { USER_DETAIL, USER_CHANGE_PASSWORD } from '@/apollo/queries/user'
import Drawer from '@/components/drawer'
import errorHandler from '@/apollo/config/errorHandler'
import moment from 'moment'
moment.locale('id')

export default {
    components: {
        Drawer
    },
    data() {
        return {
            userDetail: {
                role: '',
                createAt: ''
            },
            isVisible: false,
            errors: [],
            formOptions: {
                forms: [
                    { prop: 'oldPassword', label: 'Password Lama', type: 'password',
                        rules: [
                            { required: true, message: 'Masukkan password lama anda',
                                trigger: 'blur' },
                            { min: 6, message: 'Password minimal 6 karakter',
                                trigger: 'blur' }
                        ]
                    },
                    { prop: 'newPassword', label: 'Password Baru', type: 'password',
                        rules: [
                            { required: true, message: 'Masukkan password baru anda',
                                trigger: 'blur' },
                            { min: 6, message: 'Password minimal 6 karakter',
                                trigger: 'blur' }
                        ]
                    }
                ]
            }
        }
    },
    apollo: {
        userDetail: {
            query: USER_DETAIL,
            variables() {
                return {
                    id: this.$auth.state.user.id,
                }
            }
        }
    },
    computed: {
        created() {
            const { createdAt } = this.userDetail
            return moment(new Date(createdAt)).format('LLL')
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

<style scoped>
/deep/ .ivu-card-body {
    padding: 0;
}
.profil > .ivu-card-body > table {
    width: 100%;
}
.profil > .ivu-card-body > table > tr > td:last-child {
    text-align: right;
}
.profil > .ivu-card-body > table > tr > td {
    padding: 16px;
    border-top: 1px solid #dddddd;
}
.profil > .ivu-card-body > table > tr:first-child > td {
    border-top: 0;
}
</style>
