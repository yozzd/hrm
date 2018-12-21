<template>
    <div>
        <el-row>
            <user/>
        </el-row>
    </div>
</template>

<script>
import User from '@/components/manage/user'
export default {
    middleware: 'auth',
    components: {
        User
    },
    meta: {
        guard: 'admin'
    }
}
</script>
