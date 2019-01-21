<template>
    <div>
        <dashboard />
    </div>
</template>

<script>
import Dashboard from '@/components/dashboard';
export default {
  middleware: ['auth'],
  meta: {
    guard: 'user',
  },
  components: {
    Dashboard,
  },
};
</script>
