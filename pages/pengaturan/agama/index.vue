<template>
    <div>
        <agama/>
    </div>
</template>

<script>
import Agama from '@/components/pengaturan/agama';
export default {
  middleware: 'auth',
  meta: {
    guard: 'personalia',
  },
  components: {
    Agama,
  },
};
</script>
