<template>
    <div>
        <Layout>
        <Header>
            <Navbar/>
        </Header>
        <Content>
            <nuxt/>
        </Content>
        <Footer>
            <IFooter/>
        </Footer>
        </Layout>
    </div>
</template>

<script>
import Navbar from '@/components/navbar'
import IFooter from '@/components/footer'
export default {
    components: {
        Navbar,
        IFooter
    }
}
</script>

