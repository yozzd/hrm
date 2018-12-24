<template>
    <div>
        <Row type="flex" justify="space-between" class="toolbar">
        <Col :md="14" :lg="11">
        <Input v-model="filter" @keyup.enter="handleFilter" :placeholder="`Filter By ${cap(select)}`" class="filter">
        <Select v-model="select" slot="prepend" placeholder="Select">
            <Option
                v-for="item in filterOptions.select.options"
                :value="item.value"
                :label="item.label"
                :key="item.value">
            </Option>
        </Select>
        <Button slot="append" custom-icon="iconfont icon-search"></Button>
        </Input>
        </Col>
        <Col :md="6" :lg="5" style="text-align: right;">
        <slot name="action" />
        </Col>
        </Row>

        <Table ref="table"
               :columns="columns"
               :data="tableData"
               :loading="loading"
               size="small"
               @on-filter-change="handleFilterChange"
               @on-selection-change="selection => emitEventHandler('on-selection-change', selection)">
               <template slot-scope="{ index }" slot="reIndex">
                   {{ reIndex(index) }}
               </template>
        </Table>

        <Row type="flex" justify="end" class="pagination" v-if="showPagination">
        <Page
            :current="pagination.pageIndex"
            :total="total"
            :page-size="pagination.pageSize"
            :page-size-opts="pageSizes"
            @on-change="handleCurrentChange"
            @on-page-size-change="handleSizeChange"
            show-total
            show-elevator
            show-sizer>
        </Page>
        </Row>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Array
        },
        columns: {
            type: Array,
            required: true
        },
        filterOptions: {
            type: Object
        },
        showPagination: {
            type: Boolean,
            default: true
        },
        pageSizes: {
            type: Array,
            default: () => {
                return [10, 50, 100]
            }
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        const _this = this
        return {
            filter: '',
            select: _this.filterOptions.select.options[0].value,
            tableData: [],
            cacheLocalData: [],
            total: 0,
            pagination: {
                pageIndex: 1,
                pageSize: (() => {
                    const { pageSizes } = _this
                    if (pageSizes.length > 0) {
                        return pageSizes[0]
                    }
                    return 20
                })()
            }
        }
    },
    mounted() {
        const { data } = this
        this.loadLocalData(data)
        window.addEventListener('keyup', event => {
            if (event.keyCode === 13) {
                this.handleFilter()
            }
        })
    },
    watch: {
        data: function(value) {
            this.loadLocalData(value)
        }
    },
    methods: {
        cap(v) {
            const option = _.reduce(this.filterOptions.select.options, (r, v) => {
                r[v.value] = v.label
                return r
            }, {})
            return option[v]
        },
        reIndex(index) {
            return index + (this.pagination.pageIndex * this.pagination.pageSize - (this.pagination.pageSize - 1))
        },
        emitEventHandler(event) {
            this.$emit(event, ...Array.from(arguments).slice(1))
        },
        loadLocalData(data) {
            if (!data) {
                throw new Error(`You must set attribute 'data' and 'data' must be a array.`)
                return false
            }
            const cacheData = JSON.parse(JSON.stringify(data))
            this.cacheLocalData = cacheData
            if(!this.showPagination) {
                this.pagination.pageSize = cacheData.length
            }
            this.tableData = this.dataFilter(cacheData)
            this.total = cacheData.length
        },
        dataFilter(data) {
            const { pageIndex, pageSize } = this.pagination
            return data.filter((v, i) => {
                return i >= (pageIndex - 1) * pageSize && i < pageIndex * pageSize
            })
        },
        handleSizeChange(size) {
            this.pagination.pageSize = size
            this.dataFilterHandler()
        },
        handleCurrentChange(pageIndex) {
            this.pagination.pageIndex = pageIndex
            this.dataFilterHandler()
        },
        handleFilter(resetPageIndex = true) {
            if (resetPageIndex) {
                this.pagination.pageIndex = 1
            }
            this.dataFilterHandler()
        },
        dataFilterHandler() {
            const { cacheLocalData } = this
            if(this.filter) {
                const filterData = cacheLocalData.filter(o => {
                    let arrData = []
                    arrData.push(o[this.select].toLowerCase().indexOf(this.filter.toLowerCase()) !== -1)
                    return arrData.every(o => {
                        return o
                    })
                })
                this.tableData = this.dataFilter(filterData)
                this.total = filterData.length
            } else {
                this.tableData = this.dataFilter(cacheLocalData)
                this.total = cacheLocalData.length
            }
        },
        handleFilterChange(column) {
            const { cacheLocalData } = this
            if(column._filterChecked.length) {
                const roles = _.reduce(column.filters, (r, v, k) => {
                    r.push(v.value)
                    return r
                }, [])
                const pullAll = _.pullAll(roles, column._filterChecked)
                const reduceRoles = _.reduce(pullAll, (r, v, k) => {
                    const obj = {
                        role: v
                    }
                    r.push(obj)
                    return r
                }, [])
                const pullRoles = _.differenceBy(cacheLocalData, reduceRoles, 'role')
                this.tableData = this.dataFilter(pullRoles)
                this.total = pullRoles.length
            } else {
                this.tableData = this.dataFilter(cacheLocalData)
                this.total = cacheLocalData.length
            }
        }
    }
}
</script>

<style scoped>
.toolbar {
    padding: 10px 0;
    margin: 10px 0;
}
.pagination.ivu-row-flex.ivu-row-flex-end {
    margin-top: 10px;
}
.ivu-select {
    width: 120px;
}
.ivu-input-group {
    width: 450px;
}
/deep/ .ivu-input-group-prepend {
    text-align: left;
}
</style>
