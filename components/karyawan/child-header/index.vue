<template>
    <div>
        <Row type="flex" class="header">
        <Badge :text="data.no" type="primary"></Badge>
        <h3>{{ data.nama }}</h3>
        </Row>
    </div>
</template>

<script>
export default {
    props: {
        data: Object
    }
}
</script>

<style scoped>
.header.ivu-row-flex {
    padding: 10px 0;
    border-bottom: 1px dashed #cccccc;
}
.header.ivu-row-flex > h3 {
    margin-left: 10px;
}
</style>
