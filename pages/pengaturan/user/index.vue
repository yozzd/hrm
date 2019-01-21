<template>
    <div>
        <user/>
    </div>
</template>

<script>
import User from '@/components/pengaturan/user';
export default {
  middleware: 'auth',
  components: {
    User,
  },
  meta: {
    guard: 'admin',
  },
};
</script>
