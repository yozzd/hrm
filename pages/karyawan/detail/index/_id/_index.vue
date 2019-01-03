<template>
    <div>
        <personal v-if="$route.params.index === 'personal'" />
        <alamat v-else-if="$route.params.index === 'alamat'" />
        <keluarga v-else-if="$route.params.index === 'keluarga'" />
    </div>
</template>

<script>
import Personal from '@/components/karyawan/detail/personal'
import Alamat from '@/components/karyawan/detail/alamat'
import Keluarga from '@/components/karyawan/detail/keluarga'

export default {
    middleware: ['auth'],
    meta: {
        guard: 'personalia'
    },
    components: {
        Personal,
        Alamat,
        Keluarga
    }
}
</script>
