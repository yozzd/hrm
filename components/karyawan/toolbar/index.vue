<template>
    <div>
        <Row type="flex" justify="end">
        <Select v-model="select" filterable class="jumpSelect" @on-change="handleOnChange">
            <Option v-for="(item, itemIndex) in karyawanAll" :key="itemIndex" :value="item.id" :label="item.nama">
            <span>{{ item.nama }}</span>
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
import { KARYAWAN_ALL_ID } from '@/apollo/queries/karyawan'
import _ from 'lodash'

export default {
    props: {
        id: String
    },
    apollo: {
        karyawanAll: {
            query: KARYAWAN_ALL_ID
        }
    },
    data() {
        return {
            karyawanAll: [],
            select: '',
            disabledPrevious: false,
            disabledNext: false,
        }
    },
    computed: {
        toPrevious() {
            const idx = this.findIndex(this.id)
            if(this.karyawanAll[idx-1]) {
                this.select = this.karyawanAll[idx].id
                return `/karyawan/detail/${this.karyawanAll[idx-1].id}/personal`
            }
        },
        toNext() {
            const idx = this.findIndex(this.id)
            if(this.karyawanAll[idx+1]) {
                this.select = this.karyawanAll[idx].id
                return `/karyawan/detail/${this.karyawanAll[idx+1].id}/personal`
            }
        }
    },
    methods: {
        findIndex(id) {
            return _.findIndex(this.karyawanAll, o => {
                return o.id === id
            })
        },
        handleOnChange(id) {
            this.$router.push(`/karyawan/detail/${id}/personal`)
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
