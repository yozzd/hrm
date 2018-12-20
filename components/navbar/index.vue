<template>
    <div>
        <Menu mode="horizontal" theme="dark" :active-name="$route.path" @on-select="handleSelect">
            <div class="navbar-logo">App</div>
            <div class="navbar-nav">
                <MenuItem name="/dashboard" to="/dashboard" v-if="$auth.state.loggedIn"><Icon type="ios-speedometer-outline" size="18"></Icon>Dashboard</MenuItem>
                <Submenu name="3" v-if="$auth.state.loggedIn">
                <template slot="title">
                    <Icon type="ios-person-outline" size="18" />
                    {{ $auth.state.user.username }}
                </template>
                <MenuItem name="3-1"><Icon type="ios-person-outline" size="18" />Profile</MenuItem>
                <MenuItem name="logout"><Icon type="ios-log-out" size="18" />Logout</MenuItem>
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
