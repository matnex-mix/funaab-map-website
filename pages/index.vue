<script setup lang="ts">
  import {onMounted, computed} from "vue"
  import { Loader } from "@googlemaps/js-api-loader"
  import {Buffer} from "unenv/runtime/node/buffer/_buffer";
  import from = Buffer.from;

  const appConfig = useAppConfig()

  const search = ref('')
  const searchKey = ref('')
  const selectedPoint = ref(null)
  const showModal = ref(true)
  const watchId = ref(0)
  const currentUserPosition = ref(null);

  const { data: artifacts, status: artifactStatus } = await useFetch('/api/places', {
    query: {
      search: searchKey
    }
  })

  const searchPlaces = () => {
    // searchKey.value = search.value
  }

  const show = true;

  const directionMode = ref(false);
  const fromPoint = ref(null);
  const toPoint = ref(null);
  const selectedMode = ref('DRIVING');
  const routes = ref([]);
  const loading = ref(false);

  let directionsService;

  let directionOptions = computed(() => {
    const rf = artifacts.value.map((e) => { return {value: [e.lat, e.lng], text: e.title}; });
    if( currentUserPosition.value ) rf.unshift({value: [currentUserPosition.value.latitude, currentUserPosition.value.longitude], text: 'Current Position'});

    return rf;
  })

  const filteredArtifacts = computed(() => {
    // console.log(artifacts.value);
    return artifacts.value?.filter((e) => !search.value || e.title.toLowerCase().indexOf(search.value) != -1 || e.description.toLowerCase().indexOf(search.value) != -1)
  })

  const getDirections  = async (e) => {
    selectedPoint.value = null;
    directionMode.value = true;

    loading.value = true;

    const from = fromPoint.value ?? [37.7699298, -122.4469157]
    const to = toPoint.value ?? [37.7683909618184, -122.51089453697205]

    var request = {
      origin: new google.maps.LatLng(from[0], from[1]),
      destination: new google.maps.LatLng(to[0], to[1]),
      travelMode: google.maps.TravelMode[selectedMode.value]
    };

    console.log(request);

    directionsService.route(request, function(response, status) {
      console.log(response);
      if (status == 'OK') {
        routes.value = response.routes[0].overview_path.map((e) => [e.lat(), e.lng()])
        // directionsRenderer.setDirections(response);
      }

      loading.value = false;
    });
  }

  onMounted(() => {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition((pos) => {
      currentUserPosition.value = pos.coords;

      console.log("Your current position is:");
      console.log(`Latitude : ${pos.coords.latitude}`);
      console.log(`Longitude: ${pos.coords.longitude}`);
      console.log(`More or less ${pos.coords.accuracy} meters.`);
    }, error, options);
    watchId.value = navigator.geolocation.watchPosition((pos) => {
      currentUserPosition.value = pos.coords;

      console.log("Your current position is:");
      console.log(`Latitude : ${pos.coords.latitude}`);
      console.log(`Longitude: ${pos.coords.longitude}`);
      console.log(`More or less ${pos.coords.accuracy} meters.`);
    }, error, options);

    const loader = new Loader({
      apiKey: import.meta.env.VITE_APP_GOOGLE_MAP_KEY,
      version: "quarterly",
      libraries: ["routes"]
    });

    loader.load().then(async () => {
      const { Map } = await google.maps.importLibrary("maps");

      directionsService = new google.maps.DirectionsService();
    });
  })

</script>

<template>
  <div>
    <div class="d-flex" style="height: 100vh; width: 100vw;">
      <div class="text-center p-3 p-lg-4" style="max-width: 400px; width: 30%; overflow-y: auto;">
        <img height="100" width="100" src="../public/images/logo.png" class="img-thumbnail" alt="FUNAAB Logo" />

        <h3 class="text-success mb-5 mt-3">{{ appConfig.name }}</h3>

        <form v-if="!directionMode" @submit.prevent="searchPlaces">
          <BInputGroup>
            <BFormInput id="search-input" :placeholder="`Search ${appConfig.name}.`" v-model="search" trim />
            <template #append>
              <BButton variant="success" type="submit">Search</BButton>
            </template>
          </BInputGroup>
        </form>

        <div v-if="directionMode" class="text-start mt-4">
          <label class="mb-2">Mode of Travel:</label>
          <BFormSelect v-model="selectedMode" :options="['DRIVING', 'TRANSIT', 'BICYCLING', 'WALKING']"></BFormSelect>

          <div class="mb-2">&nbsp;</div>

          <label class="mb-2">Start Point:</label>
          <BFormSelect v-model="fromPoint" :options="directionOptions" />

          <div class="mb-2">&nbsp;</div>

          <label class="mb-2">Destination:</label>
          <BFormSelect v-model="toPoint" :options="directionOptions.filter((e) => e.value != fromPoint)" />

          <BButton @click="getDirections" variant="success" class="mt-4 w-100 mb-3">
            Get Directions
          </BButton>
          <br/>
          <BButton @click="directionMode = false; routes = [];" class="w-100" variant="link-danger">
            Close
          </BButton>
        </div>
        <div v-else class="mt-4 mt-lg-5 text-start text-secondary">
          <h6 v-if="search" class="mb-4">Search Results</h6>

          <BOverlay
              :show="artifactStatus == 'pending'"
              spinner-variant="primary"
              spinner-type="grow"
              spinner-small
              rounded="sm"
              no-center
          >
            <template #overlay>
              <div class="text-center" style="margin-top: 100px;">
                <BSpinner type="grow" variant="success" />
              </div>
            </template>
            <BCard
                v-for="(place, i) in filteredArtifacts"
                class="mb-3"
                :title="place.title"
                :img-src="place.medias[0]"
                :img-alt="`Placeholder Image - ${place.title}`"
                img-top
                tag="article"
                @click="selectedPoint = place"
            >
              <BCardText class="text-truncate">
                {{ place.description }}
              </BCardText>
            </BCard>
          </BOverlay>
        </div>
      </div>

      <div class="flex-grow-1">
        <ClientOnly>
          <BOverlay :show="loading" rounded="lg" class="h-100 w-100">
            <Map :points="artifacts" :routes="routes" :user-location="currentUserPosition ? [currentUserPosition.latitude, currentUserPosition.longitude] : null" @on-view-place="place => selectedPoint = place" />
          </BOverlay>
        </ClientOnly>
      </div>

      <BModal v-if="selectedPoint" v-model="showModal" centered size="xl" :hide-footer="true" :hide-header="true" :no-close-on-backdrop="true">
        <div class="row">
          <div class="col-12 col-lg-5">
            <h3>{{ selectedPoint.title }}</h3>
            <p>{{ selectedPoint.description }}</p>

            <BButton @click="fromPoint = [selectedPoint.lat, selectedPoint.lng]; getDirections(null);" variant="success" class="me-2">
              Get directions
            </BButton>
            <BButton variant="secondary" @click="selectedPoint = null;">
              Close
            </BButton>
          </div>
          <div class="col-12 col-lg-7">
            <BCarousel controls indicators fade ride="carousel">
              <BCarouselSlide v-for="(url, i) in selectedPoint.medias" :img-src="url" :alt="selectedPoint.title" />
            </BCarousel>
          </div>
        </div>
      </BModal>
    </div>
  </div>
</template>

<style scoped>

</style>