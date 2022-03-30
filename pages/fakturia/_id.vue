<style lang="scss" scoped>
  table th {
    text-align: left;
    padding: 0 1em 0 0;
  }
  table td {
    padding: 0 1em 0 0;
  }

</style>


<template>
  <div class="layout vertical" style="max-height: 100%; padding: 1em">
    <v-overlay :value="loading">
      <v-progress-circular
        indeterminate
        color="primary"
      ></v-progress-circular>
    </v-overlay>

    <v-snackbar v-model="errorSnack">
      {{ errorMessage }}
      <v-btn text @click="errorSnack = false">
        Schließen
      </v-btn>
    </v-snackbar>

    <div v-if="deal.data && deal.data.error">{{ deal.data.error }}</div>
    <div v-if="deal.deals">
      Bitte Hauptauftrag auswählen
      <table>
        <tr>
          <th>Bezeichnung</th>
          <th>Ist Consumer</th>
          <th>Ist eCloud</th>
          <th>Ist Wärmecloud</th>
          <th>Cloudtyp</th>
        </tr>
        <tr v-for="subdeal in deal.deals" :key="subdeal.id" @click="setMaster(subdeal)">
          <td>{{ subdeal.title }}</td>
          <td>{{ subdeal.is_cloud_consumer }}</td>
          <td>{{ subdeal.is_cloud_ecloud }}</td>
          <td>{{ subdeal.is_cloud_heatcloud }}</td>
          <td>{{ subdeal.cloud_type }}</td>
        </tr>
      </table>
    </div>
    <div v-if="deal.id">
      <Cloud v-if="deal.category_id === '15'" :deal="deal" :dealId="dealId" @loading="loading = true" @error="showError" @success="loading = false" />
      <Contracting v-if="deal.category_id === '68' || deal.category_id === '70'" :deal="deal" @loading="loading = true" @error="showError" @success="loading = false" />
    </div>
  </div>
</template>

<script>
import Cloud from '~/components/fakturia/Cloud/Cloud'
import Contracting from '~/components/fakturia/Contracting/Contracting'

export default {

  components: {
    Cloud,
    Contracting
  },

  async asyncData({ params }) {
    return { dealId: params.id }
  },

  async fetch ({ store, params }) {
    this.loading = true
    await store.dispatch('fakturia/loadDealData', {
      dealId: params.id
    })
    this.loading = false
  },

  data(){
    return {
      loading: false,
      errorSnack: false,
      errorMessage: ''
    }
  },

  computed: {
    deal: function () { return this.$store.getters['fakturia/dealData'] },
  },

  methods: {
    async reload () {
      this.loading = true
      await this.$store.dispatch('fakturia/loadDealData', {
        dealId: this.deal.id
      })
      .catch (error => this.showError(error))
      this.loading = false
    },
    async setMaster (deal) {
      this.loading = true
      await this.$store.dispatch('fakturia/setMasterDeal', {
        dealId: deal.id
      })
      .catch (error => this.showError(error))
      this.loading = false
    },
    showError (error) {
      this.errorMessage = 'Unbekannter Server Fehler'
      if (error.response && error.response.data) {
        this.errorMessage = error.response.data.message
      }
      this.errorSnack = true
      this.loading = false
    }
  }
}
</script>
