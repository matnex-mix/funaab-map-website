<script setup lang="ts">
  const appConfig = useAppConfig()

  const search = ref('')
  const searchKey = ref('')

  const { data: artifacts, status: artifactStatus } = await useFetch('/api/places', {
    query: {
      search: searchKey
    }
  })

  const searchPlaces = () => {
    searchKey.value = search.value
  }

</script>

<template>
  <div>
    <div class="d-flex" style="height: 100vh; width: 100vw;">
      <div class="text-center p-3 p-lg-4" style="max-width: 400px; width: 30%; overflow-y: auto;">
        <img height="100" width="100" src="../public/images/logo.png" class="img-thumbnail" alt="FUNAAB Logo" />

        <h3 class="text-success mb-5 mt-3">{{ appConfig.name }}</h3>

        <BInputGroup>
          <BFormInput id="search-input" :placeholder="`Search ${appConfig.name}.`" v-model="search" trim />
          <template #append>
            <BButton variant="primary" @click="searchPlaces">Search</BButton>
          </template>
        </BInputGroup>

        <div class="mt-4 mt-lg-5 text-start text-secondary">
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
                v-for="(place, i) in artifacts"
                class="mb-3"
                :title="place.title"
                :img-src="place.medias[0]"
                :img-alt="`Placeholder Image - ${place.title}`"
                img-top
                tag="article"
            >
              <BCardText class="text-truncate">
                {{ place.description }}
              </BCardText>
            </BCard>
          </BOverlay>
        </div>
      </div>

      <div class="flex-grow-1">
        <Map />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>