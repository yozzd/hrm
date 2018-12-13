<template>
    <section class="container">
        <div>
            <logo />
            <h1 class="title">
                hrm
            </h1>
            <h2 class="subtitle">
                Welcome to the iView + Nuxt.js template
            </h2>
            <div class="links">
                <Button type="primary" target="_blank" to="https://nuxtjs.org/">Documentation</Button>
                <Button target="_blank" to="https://github.com/nuxt/nuxt.js">GitHub</Button>
                <Button target="_blank" to="https://www.iviewui.com/">iView</Button>
            </div>
        </div>
    </section>
</template>

<script>
import Logo from '~/components/Logo.vue'
export default {
    components: {
        Logo
    }
}
</script>
