<template>
    <div>
        <daftar/>
    </div>
</template>

<script>
import Daftar from '@/components/karyawan/daftar'
export default {
    middleware: ['auth'],
    meta: {
        guard: 'personalia'
    },
    components: {
        Daftar
    }
}
</script>
