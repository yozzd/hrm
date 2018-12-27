<template>
    <div>
        <Row type="flex" gutter="20">
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

export default {
    components: {
        Sidebar
    },
    data() {
        return {
            navs: [
                { title: 'Detail', icon: 'idcard',
                    items: [
                        { title: 'Personal', path: 'personal'},
                        { title: 'Address', path: 'address'}
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
