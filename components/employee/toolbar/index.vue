<template>
    <div>
        <Row type="flex" justify="end">
        <ButtonGroup>
        <Button type="dashed" custom-icon="iconfont icon-left" @click="handlePrevious" :disabled="disabledPrevious"></Button>
        <Button type="dashed" custom-icon="iconfont icon-right" @click="handleNext" :disabled="disabledNext"></Button>
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
            disabledPrevious: false,
            disabledNext: false,
        }
    },
    methods: {
        findIndex(id) {
            return _.findIndex(this.employeeAll, o => {
                return o.id === id
            })
        },
        handlePrevious() {
            const idx = this.findIndex(this.id)
            if(this.employeeAll[idx-1]) {
                this.disabledNext = false
                this.$router.push(`/employee/detail/${this.employeeAll[idx-1].id}/personal`)
            } else {
                this.disabledPrevious = true
            }
        },
        handleNext() {
            const idx = this.findIndex(this.id)
            if(this.employeeAll[idx+1]) {
                this.disabledPrevious = false
                this.$router.push(`/employee/detail/${this.employeeAll[idx+1].id}/personal`)
            } else {
                this.disabledNext = true
            }
        }
    }
}
</script>
