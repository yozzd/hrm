<template>
    <div>
        <Row type="flex" class="breadcrumb">
        <Breadcrumb>
        <BreadcrumbItem
            v-for="(item, index) in data"
            :key="index"
            :to="item.to">{{item.label}}</BreadcrumbItem>
        </Breadcrumb>
        </Row>
    </div>
</template>

<script>
export default {
  props: {
    data: Array,
  },
};
</script>

<style scoped>
.breadcrumb.ivu-row-flex {
  padding: 0 0 10px;
  border-bottom: 1px dashed #cccccc;
}
</style>
