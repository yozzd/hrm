<template>
    <div>
        <personal v-if="$route.params.index === 'personal'" />
        <Address v-else-if="$route.params.index === 'address'" />
    </div>
</template>

<script>
import Personal from '@/components/employee/detail/personal'
import Address from '@/components/employee/detail/address'

export default {
    components: {
        Personal,
        Address
    }
}
</script>
