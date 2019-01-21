<template>
    <div>
        <personal v-if="$route.params.index === 'personal'" />
        <keluarga v-else-if="$route.params.index === 'keluarga'" />
        <kontak v-else-if="$route.params.index === 'kontak'" />
        <karyawan-image v-else-if="$route.params.index === 'image'" />
    </div>
</template>

<script>
import Personal from '@/components/karyawan/detail/personal';
import Keluarga from '@/components/karyawan/detail/keluarga';
import Kontak from '@/components/karyawan/detail/kontak';
import KaryawanImage from '@/components/karyawan/detail/image';

export default {
  middleware: ['auth'],
  meta: {
    guard: 'personalia',
  },
  components: {
    Personal,
    Keluarga,
    Kontak,
    KaryawanImage,
  },
};
</script>
