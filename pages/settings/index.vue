<style lang="scss" scoped>
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>


<template>
  <div class="main-content">
    <v-tabs fixed-tabs v-model="tab" style="flex: 0">
      <v-tab key="offer_settings">
        Angebotseinstellungen
      </v-tab>
      <v-tab key="calendar_settings">
        Kalendereinstellungen
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" style="flex: 1">
      <v-tab-item key="offer_settings">
        <OfferSettings></OfferSettings>
      </v-tab-item>
      <v-tab-item key="calendar_settings">
        <div>Kommt noch</div>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>



<script>
import OfferSettings from '~/components/settings/OfferSettings'

export default {

  components: {
    OfferSettings
  },
  data () {
      return {
        tab: null
      }
    }
}
</script>
