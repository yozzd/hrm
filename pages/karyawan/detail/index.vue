<template>
    <div>
        <detail/>
    </div>
</template>

<script>
import Detail from '@/components/karyawan/detail'
export default {
    middleware: ['auth'],
    meta: {
        guard: 'personalia'
    },
    components: {
        Detail
    }
}
</script>
