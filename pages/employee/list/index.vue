<template>
    <div>
        <list/>
    </div>
</template>

<script>
import List from '@/components/employee/list'
export default {
    middleware: ['auth'],
    meta: {
        guard: 'personalia'
    },
    components: {
        List
    }
}
</script>
