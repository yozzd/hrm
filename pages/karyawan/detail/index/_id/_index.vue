<template>
    <div>
        <personal v-if="$route.params.index === 'personal'" />
        <keluarga v-else-if="$route.params.index === 'keluarga'" />
        <karyawan-image v-else-if="$route.params.index === 'image'" />
    </div>
</template>

<script>
import Personal from '@/components/karyawan/detail/personal'
import Keluarga from '@/components/karyawan/detail/keluarga'
import KaryawanImage from '@/components/karyawan/detail/image'

export default {
    middleware: ['auth'],
    meta: {
        guard: 'personalia'
    },
    components: {
        Personal,
        Keluarga,
        KaryawanImage
    }
}
</script>
