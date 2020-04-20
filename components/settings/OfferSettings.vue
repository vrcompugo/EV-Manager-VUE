<style lang="scss">
  .ck-editor__editable_inline {
    min-height: 500px;
  }
  .spaced-horizontal {
    display: flex;
    justify-content: flex-start;

  }
  .spaced-horizontal > * {
    max-width: 15em;
    margin-right: 1em;
  }
  .v-card {
    display: flex;
    align-items: center;
    padding: 0.6em 0.6em 0;
  }
</style>


<template>
  <div>
    <v-btn @click="saveSettings">Speichern</v-btn>
    <br>
    <br>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header>Wirtschaftlichkeitsrechnung</v-expansion-panel-header>
        <v-expansion-panel-content>
          <WI :wi_settings="settings.wi_settings"></WI>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>PV Angebot</v-expansion-panel-header>
        <v-expansion-panel-content>
          <PV :pv_settings="settings.pv_settings"></PV>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>Cloud Angebot</v-expansion-panel-header>
        <v-expansion-panel-content>
          <Cloud :settings="settings.cloud_settings"></Cloud>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <br>
    <v-btn @click="saveSettings">Speichern</v-btn>
  </div>
</template>



<script>
import WI from '~/components/settings/parts/WI'
import PV from '~/components/settings/parts/PV'
import Cloud from '~/components/settings/parts/Cloud'

export default {

  components: {
    WI,
    PV,
    Cloud
  },

  attached(){
    console.log("attached")
  },
  watch: {
    last_check: {
      immediate: true,
      handler() {
        this.$axios
          .get("/settings/pv-settings")
          .then(response => {
            this.settings = response.data.data.data
          })
      }
    }
  },

  data() {
    return {
      settings: {}
    }

  },


  methods: {
    saveSettings(){
      this.settings.pv_settings.optional_products.sort((a, b) => {
        if(a.order < b.order){
          return -1
        }
        if(a.order > b.order){
          return 1
        }
        return 0
      })
      this.$axios
        .put("/settings/pv-settings", {
          "section": "pv-settings",
          "data": this.settings
        })
        .then(response => {
          this.settings = response.data.data.data
        })
    }
  }
}
</script>
