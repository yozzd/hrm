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
import _ from 'lodash'
import { userRoles } from '@/auth/auth.roles'

const roles = _.reduce(_.slice(userRoles, 0, userRoles.length - 1), (r, v, k) => {
    const obj = {
        value: v,
        label: _.capitalize(v)
    }
    r.push(obj)
    return r
}, [])

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
                        { value: 'username', label: 'Username' }
                    ]
                }
            },
            columns: [
                { type: 'selection', width: 40, align: 'center' },
                { title: '#', width: 60, align: 'center', slot: 'reIndex' },
                { title: 'Username', key: 'username', sortable: true },
                { title: 'Role', key: 'role',
                    render: (h, params) => {
                        return h('div', [
                            h('span', _.capitalize(params.row.role))
                        ]);
                    },
                    filters: roles,
                    filterMethod (value, row) {
                        return row.role.indexOf(value) > -1;
                    }
                }
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
