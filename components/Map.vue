<template>
  <div class="h-100">
    <LMap
        ref="map"
        :zoom="zoom"
        max-zoom="20"
        :center="center"
        :use-global-leaflet="false"
    >
      <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
          layer-type="base"
          name="OpenStreetMap"
      />
    </LMap>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  const zoom = ref(18);

  const props = defineProps({
    center: {
      type: Array,
      default: [7.230838, 3.436566]
    },
  });
</script>

<style scoped>

</style>