<template>
    <Breadcrumb>
    <BreadcrumbItem v-for="(item, index) in data" :key="index" :to="item.to">{{item.label}}</BreadcrumbItem>
    </Breadcrumb>
</template>
<script>
export default {
    props: {
        data: Array
    }
}
</script>
