<template>
    <div>
        <dashboard />
    </div>
</template>

<script>
import Dashboard from '@/components/dashboard'
export default {
    middleware: ['auth'],
    components: {
        Dashboard
    },
    meta: {
        guard: 'user'
    }
}
</script>
