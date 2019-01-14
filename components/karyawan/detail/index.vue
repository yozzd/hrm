<template>
    <div>
        <crumb v-if="breadcrumb" :data="breadcrumb"/>

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
import { KARYAWAN_ONE_ID } from '@/apollo/queries/karyawan'
import Crumb from '@/components/crumb'
import Sidebar from '@/components/sidebar'
import Toolbar from '@/components/karyawan/toolbar'

export default {
    components: {
        Crumb,
        Sidebar,
        Toolbar
    },
    apollo: {
        karyawanDetail: {
            query: KARYAWAN_ONE_ID,
            variables() {
                return {
                    id: this.$route.params.id
                }
            }
        }
    },
    data() {
        return {
            karyawanDetail: [],
            navs: [
                { title: 'Detail', icon: 'idcard',
                    items: [
                        { title: 'Personal', path: 'personal'},
                        { title: 'Alamat', path: 'alamat'},
                        { title: 'Keluarga', path: 'keluarga'},
                        { title: 'Image', path: 'image'}
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
    },
    computed: {
        breadcrumb() {
            return [
                { label: 'Dashboard', to: '/dashboard'},
                { label: 'Daftar Karyawan', to: '/karyawan/daftar' },
                { label: `${this.karyawanDetail.nama}` }
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
