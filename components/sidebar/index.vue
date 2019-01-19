<template>
    <div>
        <Menu
            :active-name="$route.params.index"
            :open-names="['0']"
            :accordion="true"
            width="100%">
            <Submenu v-for="(nav, i) in navs" :key="i" :name="`${i}`">
            <template slot="title">
                <Icon :custom="`iconfont icon-${nav.icon}`" size="18" />
                <span>{{ nav.title }}</span>
            </template>
            <MenuItem
                v-for="(item, k) in nav.items"
                :key="k"
                :name="item.path"
                :to="item.path">{{ item.title }}</MenuItem>
            </Submenu>
        </Menu>
    </div>
</template>

<script>
export default {
    props: {
        navs: {
            type: Array
        }
    }
}
</script>

<style scoped>
/deep/ .ivu-menu-light {
    background: transparent;
}
/deep/ .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
    background: #e6f7ff;
}
</style>
