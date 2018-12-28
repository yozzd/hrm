<template>
    <div>
        <Row type="flex" justify="end">
        <Select v-model="select" filterable class="jumpSelect" @on-change="handleOnChange">
            <Option v-for="(item, itemIndex) in employeeAll" :key="itemIndex" :value="item.id" :label="item.name">
            <span>{{ item.name }}</span>
            <span style="float: right;">{{ item.no }}</span>
            </Option>
        </Select>
        <ButtonGroup>
        <Button type="dashed" custom-icon="iconfont icon-left" :to="toPrevious" :disabled="!toPrevious"></Button>
        <Button type="dashed" custom-icon="iconfont icon-right" :to="toNext" :disabled="!toNext"></Button>
        </ButtonGroup>
        </Row>
    </div>
</template>

<script>
import { EMPLOYEE_ALL_ID } from '@/apollo/queries/employee'
import _ from 'lodash'

export default {
    props: {
        id: String
    },
    apollo: {
        employeeAll: {
            query: EMPLOYEE_ALL_ID
        }
    },
    data() {
        return {
            employeeAll: [],
            select: '',
            disabledPrevious: false,
            disabledNext: false,
        }
    },
    computed: {
        toPrevious() {
            const idx = this.findIndex(this.id)
            if(this.employeeAll[idx-1]) {
                this.select = this.employeeAll[idx].id
                return `/employee/detail/${this.employeeAll[idx-1].id}/personal`
            }
        },
        toNext() {
            const idx = this.findIndex(this.id)
            if(this.employeeAll[idx+1]) {
                this.select = this.employeeAll[idx].id
                return `/employee/detail/${this.employeeAll[idx+1].id}/personal`
            }
        }
    },
    methods: {
        findIndex(id) {
            return _.findIndex(this.employeeAll, o => {
                return o.id === id
            })
        },
        handleOnChange(id) {
            this.$router.push(`/employee/detail/${id}/personal`)
        }
    }
}
</script>

<style scoped>
.jumpSelect {
    width: 250px;
    margin-right: 10px;
}
</style>
