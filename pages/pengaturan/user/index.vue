<template>
    <div>
        <user/>
    </div>
</template>

<script>
import User from '@/components/pengaturan/user';
export default {
  middleware: 'auth',
  meta: {
    guard: 'root',
  },
  components: {
    User,
  },
};
</script>
