<template>
  <div class="h-100">
    <LMap
        ref="map"
        :zoom="zoom"
        :max-zoom="20"
        :min-zoom="16"
        :center="center"
        :use-global-leaflet="true"
        :max-bounds="bounds"
    >
      <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          d-attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
          layer-type="base"
          name="OpenStreetMap"
      />

<!--      <LTileLayer-->
<!--        url="http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"-->
<!--        :subdomains="['mt0','mt1','mt2','mt3']"-->
<!--      />-->

      <LMarker v-for="(point, i) in points" :lat-lng="[point.lat, point.lng]" :title="point.title">
        <LPopup>
          {{ point.description ? (point.description.substring(0, 37).trim() + '...') : point.title }}
          <div class="mt-3">
            <BButton size="sm" variant="success" @click="$emit('onViewPlace', point)">
              view
            </BButton>
          </div>
        </LPopup>
      </LMarker>
      <LCircleMarker
          v-if="userLocation"
          :lat-lng="userLocation"
          :radius="10"
          :color="'var(--bs-primary)'"
      />
      <LCircleMarker
          v-if="routes"
          :lat-lng="routes[0]"
          :radius="6"
          :color="'green'"
      />
      <LCircleMarker
          v-if="routes"
          :lat-lng="routes[routes.length - 1]"
          :radius="6"
          :color="'green'"
      />
      <LPolyline
          v-if="routes"
          :lat-lngs="routes"
          color="green"
      />
    </LMap>
  </div>
</template>

<script setup lang="ts">
  import L from 'leaflet'
  import { ref, onMounted } from 'vue';

  const zoom = ref(18);
  const defaultCenter = [7.230838, 3.436566];

  const center = computed(() => props.userLocation ? props.userLocation : defaultCenter)

  const props = defineProps({
    userLocation: {
      type: Array,
      default: null
    },
    bounds: {
      type: Array,
      default: [[7.239244, 3.428511], [7.217929, 3.454283]]
    },
    points: {
      type: Array,
      default: []
    },
    routes: {
      type: Array,
      default: []
    }
  });

  const events = defineEmits([
      'onViewPlace'
  ])
</script>

<style scoped>
</style>