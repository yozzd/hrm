<template>
    <div>
        <Row>
        Manage User
        <data-table :data="userAll" :filter-options="filterOptions" :columns="columns" :loading="$apollo.loading" @on-selection-change="handleSelectionChange">
        </data-table>
        </Row>
    </div>
</template>

<script>
import { USER_ALL, USER_CREATE, USER_DELETE, USER_UPDATE } from '@/apollo/queries/user'
import DataTable from '@/components/data-table'

export default {
    components: {
        DataTable
    },
    apollo: {
        userAll: {
            query: USER_ALL
        }
    },
    data() {
        return {
            userAll: [],
            filterOptions: {
                select: {
                    options: [
                        { value: 'username', label: 'Username' },
                        { value: 'role', label: 'Role' }
                    ]
                }
            },
            columns: [
                { type: 'selection', width: 40, align: 'center' },
                { type: 'index', width: 60, align: 'center' },
                { title: 'Username', key: 'username' },
                { title: 'Role', key: 'role' }
            ]
        }
    },
    methods: {
        handleSelectionChange(arr) {
            console.log(arr)
        }
    }
}
</script>
