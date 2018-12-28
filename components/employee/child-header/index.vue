<template>
    <div>
        <Row type="flex" class="header">
        <h3>{{ data.name }} - {{ data.no }}</h3>
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
</style>
