<template>
    <div>
        <Menu mode="horizontal" theme="dark" :active-name="$route.path" @on-select="handleSelect">
            <div class="navbar-logo">App</div>
            <div class="navbar-nav">
                <MenuItem name="/dashboard" to="/dashboard" v-if="$auth.state.loggedIn"><Icon custom="iconfont icon-dashboard" size="18"></Icon>Dashboard</MenuItem>
                <Submenu name="pengaturan" v-if="$auth.hasRole('personalia')">
                <template slot="title">
                    <Icon custom="iconfont icon-wrench" size="18" />
                    Pengaturan
                </template>
                <MenuItem name="/pengaturan/user" to="/pengaturan/user" v-if="$auth.hasRole('root')"><Icon custom="iconfont icon-user" size="18" />User</MenuItem>
                </Submenu>
                <Submenu name="karyawan" v-if="$auth.hasRole('personalia')">
                <template slot="title">
                    <Icon custom="iconfont icon-team" size="18" />
                    Karyawan
                </template>
                <MenuItem name="/karyawan/daftar" to="/karyawan/daftar"><Icon custom="iconfont icon-orderedlist" size="18" />Daftar</MenuItem>
                </Submenu>
                <Submenu name="3" v-if="$auth.state.loggedIn">
                <template slot="title">
                    <Icon custom="iconfont icon-user" size="18" />
                    {{ $auth.state.user.username }}
                </template>
                <MenuItem name="3-1"><Icon custom="iconfont icon-setting" size="18" />Profile</MenuItem>
                <MenuItem name="logout"><Icon custom="iconfont icon-logout" size="18" />Logout</MenuItem>
                </Submenu>
            </div>
        </Menu>
    </div>
</template>

<script>
export default {
    methods: {
        handleSelect(name) {
            if(name === 'logout') {
                this.$auth.logout()
            }
        }
    }
}
</script>

<style scoped>
.navbar-nav {
    float: right;
}
.navbar-logo{
    font-size: 18px;
    font-weight: bold;
    color: #ffffff;
    float: left;
}
</style>
