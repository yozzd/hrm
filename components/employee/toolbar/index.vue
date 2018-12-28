<template>
    <div>
        <Row type="flex" justify="end">
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
            disabledPrevious: false,
            disabledNext: false,
        }
    },
    computed: {
        toPrevious() {
            const idx = this.findIndex(this.id)
            if(this.employeeAll[idx-1]) {
                return `/employee/detail/${this.employeeAll[idx-1].id}/personal`
            }
        },
        toNext() {
            const idx = this.findIndex(this.id)
            if(this.employeeAll[idx+1]) {
                return `/employee/detail/${this.employeeAll[idx+1].id}/personal`
            }
        }
    },
    methods: {
        findIndex(id) {
            return _.findIndex(this.employeeAll, o => {
                return o.id === id
            })
        }
    }
}
</script>
