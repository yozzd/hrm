<template>
    <div>
        <toolbar :id="$route.params.id" />

        <Row type="flex" :gutter="20" class="main">
        <Col :xs="7" :sm="7" :md="6" :lg="5">
        <sidebar :navs="navs" />
        </Col>
        <Col :xs="17" :sm="17" :md="18" :lg="19">
        <nuxt-child :key="$route.params.id" />
        </Col>
        </Row>
    </div>
</template>

<script>
import Sidebar from '@/components/sidebar'
import Toolbar from '@/components/karyawan/toolbar'

export default {
    components: {
        Sidebar,
        Toolbar
    },
    data() {
        return {
            navs: [
                { title: 'Detail', icon: 'idcard',
                    items: [
                        { title: 'Personal', path: 'personal'},
                        { title: 'Alamat', path: 'alamat'}
                    ]
                },
                { title: 'Employment', icon: 'solution',
                    items: [
                        { title: 'Job', path: 'job' },
                        { title: 'Status', path: 'status' }
                    ]
                }
            ]
        }
    }
}
</script>

<style scoped>
.main.ivu-row-flex {
    margin-top: 10px;
}
</style>
