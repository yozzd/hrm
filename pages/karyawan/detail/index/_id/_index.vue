<template>
    <div>
        <personal v-if="$route.params.index === 'personal'" />
        <alamat v-else-if="$route.params.index === 'alamat'" />
    </div>
</template>

<script>
import Personal from '@/components/karyawan/detail/personal'
import Alamat from '@/components/karyawan/detail/alamat'

export default {
    middleware: ['auth'],
    meta: {
        guard: 'personalia'
    },
    components: {
        Personal,
        Alamat
    }
}
</script>
