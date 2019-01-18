<template>
    <div>
        <profil />
    </div>
</template>

<script>
import Profil from '@/components/profil'
export default {
    middleware: ['auth'],
    meta: {
        guard: 'user'
    },
    components: {
        Profil
    }
}
</script>
