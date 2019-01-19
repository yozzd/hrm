<template>
    <div>
        <Row type="flex" class="info-table">
        <table v-if="data">
            <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
                <td>{{ row.label }}</td>
                <template v-if="data[row.prop]">
                    <td v-if="row.render">
                        <strong>{{ row.render(data[row.prop]) }}</strong>
                    </td>
                    <td v-else><strong>{{ data[row.prop] }}</strong></td>
                </template>
                <template v-else>
                    <td><strong>-</strong></td>
                </template>
            </tr>
            <slot name="append" />
        </table>
        </Row>
    </div>
</template>

<script>

export default {
    props: {
        data: {
            type: Object
        },
        rows: {
            type: Array
        }
    }
}
</script>

<style scoped>
.info-table {
    margin-top: 10px;
}
.info-table > table > tr > td {
    padding: 5px 0;
}
.info-table > table > tr > td:first-child {
    text-align: right;
}
.info-table > table > tr > td:last-child {
    padding-left: 20px;
}
/deep/ .ivu-btn-small {
    margin-left: 20px;
}
</style>
