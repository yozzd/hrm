<template>
    <div>
        <Row type="flex" justify="space-around" align="middle" class="login">
        <Col :xs="12" :sm="12" :md="11" :lg="9">
        <p class="title">Welcome to <strong>App 1.0</strong></p>
        <p class="title-helper">A Modern Way To Manage Your Stone Age Brain</p>
        <p class="title-helper">Save Your Useless Time Now!</p>
        </Col>
        <Col :xs="9" :sm="9" :md="7" :lg="5">
        <div class="header">
            <h2>Log In to Your Account</h2>
        </div>
        <Alert type="error" v-if="error" @on-close="handleErrorClose" closable>{{error}}</Alert>
        <Form ref="form" :model="form" :rules="rules" @submit.native.prevent="handleSubmit('form')">
            <FormItem prop="username">
            <Input type="text" v-model="form.username" placeholder="Username">
            <Icon custom="iconfont icon-user" slot="prepend" size="16" />
            </Input>
            </FormItem>
            <FormItem prop="password">
            <Input type="password" v-model="form.password" placeholder="Password">
            <Icon custom="iconfont icon-lock" slot="prepend" size="16" />
            </Input>
            </FormItem>
            <FormItem>
            <Button custom-icon="iconfont icon-login" type="primary" html-type="submit" class="login-btn">Login</Button>
            </FormItem>
        </Form>
        </Col>
        </Row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                username: '',
                password: ''
            },
            rules: {
                username: [
                    { required: true, message: 'Enter your username', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: 'Enter your password', trigger: 'blur' }
                ]
            },
            error: ''
        }
    },
    methods: {
        handleSubmit(form) {
            this.error = ''
            this.$refs[form].validate(async (valid) => {
                if(valid) {
                    try {
                        await this.$auth.login({
                            username: this.form.username,
                            password: this.form.password
                        })
                    } catch(err) {
                        this.error = err.graphQLErrors[0].message
                    }
                } else {
                    return false
                }
            })
        },
        handleErrorClose() {
            this.error = ''
        }
    }
}
</script>

<style scoped>
.login {
    height: calc(100vh - 137px);
}
p.title {
    font-size: 28px;
}
p.title-helper {
    font-size: 14px;
}
p.title,
p.title-helper {
    color: #606266;
}
.header {
    margin: 20px 0 10px;
}
.header h2 {
    text-align: center;
}
.login-btn {
    float: right;
}
</style>

