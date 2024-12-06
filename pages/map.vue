<template>
  <div>
    <client-only>
      <YandexMap
        :coordinates="coordinates"
        :detailed-controls="detailedControls"
        :controls="controls"
        map-type="map"
        zoom="15"
        @click="setCardPosition"
      >
      <YandexMarker
          marker-id="1"
          :coordinates="markerPosition"
          :options="customMarkerOptions"
        />
    </YandexMap>
    </client-only>
  </div>
</template>
<script setup>
import { YandexMap, YandexMarker } from 'vue-yandex-maps'
const coordinates = [41.310556488839886, 69.28115345657882];
const controls = ["fullscreenControl"];
const detailedControls = { zoomControl: { position: { right: 10, top: 50 } } };
const markerPosition = ref([]);
const customMarkerOptions = {
  iconLayout: "default#image", // Use an image for the marker
  iconImageHref: "https://cdn-icons-png.flaticon.com/512/5193/5193688.png", // Custom image URL
  iconImageSize: [32, 32], // Size of the marker
  iconImageOffset: [-16, -32], // Offset for better alignment
};
function setCardPosition(event) {
  // Update your card position logic here
  markerPosition.value=event.get("coords")
  console.log("Card position",event.get("coords"))
}
</script>

<style>
.yandex-container {
  height: 400px;
}
</style>
