<template>
    <div>
        <Menu mode="horizontal" theme="dark" active-name="$route.path">
            <div class="navbar-logo">App</div>
            <div class="navbar-nav">
                <MenuItem name="1" v-if="$auth.state.loggedIn"><Icon type="ios-speedometer-outline" size="18"></Icon>Dashboard</MenuItem>
            </div>
        </Menu>
    </div>
</template>

<style scoped>
.navbar-nav {
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
}
.navbar-logo{
    font-size: 18px;
    font-weight: bold;
    color: #ffffff;
    float: left;
}
</style>
