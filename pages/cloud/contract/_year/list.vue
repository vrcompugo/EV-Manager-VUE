<style scoped>
  th {padding: 0 0.3em;}
  td {padding: 0 0.3em; border-left: 1px solid #ddd;border-bottom: 1px solid #ddd;}
  tr.green td {
    background: #A5D6A7;
  }
</style>
<template>
  <div>
    Cloud Abrechnung {{ year }}
    <table cellspacing="0">
      <tr>
        <th>Vertragsnummer</th>
        <th>Rechnungsnummer</th>
        <th>Zählernummer</th>
        <th>von</th>
        <th>bis</th>
        <th>Verbrauch</th>
        <th>Hat Lichtcloud</th>
        <th>Hat Cloud Nummer</th>
        <th>smartme#</th>
        <th>smartmeval</th>
        <th>usage</th>
        <th>sherpaval</th>
        <th>heat</th>
        <th>ecloud</th>
        <th>consumers</th>
        <th>emove</th>
        <th>gen</th>
        <th></th>
      </tr>
      <tr v-for="(contract, index) in contracts" :key="index" :class="status(contract)">
        <td>{{ contract.contract_number }}</td>
        <td>{{ contract.invoice_number }}</td>
        <td>{{ contract.power_meter_number }}</td>
        <td style="text-align: right">{{ contract.begin | dateFormat }}</td>
        <td style="text-align: right">{{ contract.end | dateFormat }}</td>
        <td style="text-align: right">{{ contract.usage }}</td>
        <td style="text-align: right">{{ contract.has_lightcloud }}</td>
        <td style="text-align: right">{{ contract.has_cloud_number }}</td>
        <td style="text-align: right">{{ contract.has_smartme_number }}</td>
        <td style="text-align: right">{{ contract.has_smartme_number_values }}</td>
        <td style="text-align: right">{{ contract.has_correct_usage }}</td>
        <td style="text-align: right">{{ contract.has_sherpa_values }}</td>
        <td style="text-align: right">{{ contract.has_heatcloud }}</td>
        <td style="text-align: right">{{ contract.has_ecloud }}</td>
        <td style="text-align: right">{{ contract.has_consumers }}</td>
        <td style="text-align: right">{{ contract.has_emove }}</td>
        <td style="text-align: right">{{ contract.is_generated }}</td>
        <td style="text-align: right"><v-btn @click="checkContract(contract.contract_number)" small>Check Data</v-btn></td>
      </tr>
    </table>
    <v-snackbar v-model="errorSnack">
      {{ errorMessage }}
      <v-btn text @click="errorSnack = false">
        Schließen
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
export default {

  async asyncData({ $axios, params, route }) {
    return {
      year: params.year
    }
  },

  mounted () {
    this.reload()
  },

  data(){
    return {
      loading: false,
      errorSnack: false,
      errorMessage: ''
    }
  },

  computed: {
    contracts: function () { return this.$store.getters['cloud_contract/contracts'] }
  },

  methods: {
    async reload () {
      this.loading = true
      await this.$store.dispatch('cloud_contract/loadContracts',{ year: this.year })
        .catch (error => this.showError(error))
      this.loading = false
    },
    async checkContract (contract_number) {
      this.loading = true
      await this.$store.dispatch('cloud_contract/checkContractData',{ contractNumber: contract_number, year: this.year })
        .catch (error => this.showError(error))
      this.loading = false
      this.reload()
    },
    status (contract) {
      console.log(contract.has_correct_usage)
      if (
        contract.has_lightcloud === true &&
        contract.has_cloud_number === true &&
        contract.has_smartme_number === true &&
        contract.has_smartme_number_values === true &&
        contract.has_correct_usage === "true" &&
        contract.has_sherpa_values === true &&
        contract.has_heatcloud === false &&
        contract.has_ecloud === false &&
        contract.has_consumers === false &&
        contract.has_emove === false
      ) {
        return "green"
      } else {
        return ""
      }
    },
    showError (error) {
      this.errorMessage = 'Unbekannter Server Fehler'
      if (error.response && error.response.data) {
        this.errorMessage = error.response.data.message
      }
      if (error.response && error.response.data) {
        this.errorMessage = error.response.data.message
      }
      this.errorSnack = true
    }
  }
}
</script>
