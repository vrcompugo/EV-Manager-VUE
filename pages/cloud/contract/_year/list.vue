<style scoped>
  th {padding: 0 0.3em;}
  td {padding: 0 0.3em; border-left: 1px solid #ddd;border-bottom: 1px solid #ddd;}
</style>
<template>
  <div>
    <h1>Cloud Abrechnung {{ year }}</h1>
    <v-btn :href="`/vue/cloud/contract/${year}/list?token=${$route.query.token}`" target="_blank" style="margin-right: 1em">
      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
    </v-btn>
    <v-btn @click="checkAllContractData()" small>Check All</v-btn>
    <v-btn @click="generateAllContracts()" small>Generate All</v-btn>
    <table cellspacing="0">
      <tr>
        <th>Vertragsnummer</th>
        <th>Cloud Nummer</th>
        <th>Rechnungsnummer</th>
        <th>Zählernummer</th>
        <th>von</th>
        <th>bis</th>
        <th>Verbrauch</th>
        <th>Hat Lichtcloud</th>
        <th>Hat Vertragsbegin</th>
        <th>Hat Cloud Nummer</th>
        <th>smartme#</th>
        <th>smartmeval</th>
        <th>usage</th>
        <th>sherpaval</th>
        <th>heat</th>
        <th>smartmeheat#</th>
        <th>smartmeheatval</th>
        <th>ecloud</th>
        <th>consumers</th>
        <th>emove</th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
      <tr style="white-space: nowrap" v-for="(contract, index) in contracts" :key="index" :class="status(contract)">
        <td>{{ contract.contract_number }}</td>
        <td>{{ contract.cloud_number }}</td>
        <td>{{ contract.invoice_number }}</td>
        <td>{{ contract.power_meter_number }}</td>
        <td style="text-align: right">{{ contract.begin | dateFormat }}</td>
        <td style="text-align: right">{{ contract.end | dateFormat }}</td>
        <td style="text-align: right">{{ contract.usage }}</td>
        <td style="text-align: right">{{ contract.has_lightcloud }}</td>
        <td style="text-align: right">{{ contract.has_begin_date }}</td>
        <td style="text-align: right">{{ contract.has_cloud_number }}</td>
        <td style="text-align: right">{{ contract.has_smartme_number }}</td>
        <td style="text-align: right">{{ contract.has_smartme_number_values }}</td>
        <td style="text-align: right">{{ contract.has_correct_usage }}</td>
        <td style="text-align: right">{{ contract.has_sherpa_values }}</td>
        <td style="text-align: right">{{ contract.has_heatcloud }}</td>
        <td style="text-align: right">{{ contract.has_smartme_number_heatcloud }}</td>
        <td style="text-align: right">{{ contract.has_smartme_number_heatcloud_values }}</td>
        <td style="text-align: right">{{ contract.has_ecloud }}</td>
        <td style="text-align: right">{{ contract.has_consumers }}</td>
        <td style="text-align: right">{{ contract.has_emove }}</td>
        <td style="text-align: right"><v-btn @click="status(contract)" small>Manuelle Data</v-btn></td>
        <td style="text-align: right"><v-btn @click="openManuallData(contract)" small>Manuelle Data</v-btn></td>
        <td style="text-align: right"><v-btn @click="checkContract(contract.contract_number)" small>Check Data</v-btn></td>
        <td style="text-align: right"><v-btn @click="generateAnnualStatement(contract.contract_number)" small>Abrechnung erzeugen</v-btn></td>
        <td style="text-align: right"><v-btn v-if="contract.pdf_file_link" :href="contract.pdf_file_link" target="_blank" small>Abrechnung öffnen</v-btn></td>
      </tr>
    </table>
    <v-dialog
      v-model="manuellDialog"
      width="800"
      modal
    >
      <v-card v-if="editContract">
        <v-card-title class="headline grey lighten-2" primary-title >
          {{ editContract.contract_number }} bearbeiten
        </v-card-title>

        <v-card-text>
          <v-text-field
            v-model="editContract.manuell_data.extra_price_per_kwh"
            class="align-right"
            suffix="€"
            type="number"
            step="0.01"
            label="Strompreis Mehrverbrauch überschreiben"></v-text-field>
          <v-text-field
            v-if="editContract.has_correct_usage !== 'true' || editContract.manuell_data.senec_cloud_usage"
            v-model="editContract.manuell_data.senec_cloud_usage"
            class="align-right"
            suffix="kWh"
            type="number"
            step="1"
            label="Senec Netzbezug"></v-text-field>
          <v-text-field
            v-if="editContract.has_correct_usage !== 'true' || editContract.manuell_data.senec_storage_usage"
            v-model="editContract.manuell_data.senec_storage_usage"
            class="align-right"
            suffix="kWh"
            type="number"
            step="1"
            label="Senec Akku-Entnahme"></v-text-field>
          <v-text-field
            v-if="editContract.has_correct_usage !== 'true' || editContract.manuell_data.senec_direct_usage"
            v-model="editContract.manuell_data.senec_direct_usage"
            class="align-right"
            suffix="kWh"
            type="number"
            step="1"
            label="Senec Direktverbrauch"></v-text-field>

          <v-text-field
            v-if="editContract.has_heatcloud || editContract.manuell_data.heatcloud_usage"
            v-model="editContract.manuell_data.heatcloud_usage"
            class="align-right"
            suffix="kWh"
            type="number"
            step="1"
            label="Verbrauch Wärmecloud-Zähler"></v-text-field>

          <v-text-field
            v-if="editContract.has_ecloud || editContract.manuell_data.ecloud_usage"
            v-model="editContract.manuell_data.ecloud_usage"
            class="align-right"
            suffix="kWh"
            type="number"
            step="1"
            label="Verbrauch E.Cloud"></v-text-field>

          <v-text-field
            v-if="editContract.has_consumers"
            v-model="editContract.manuell_data.consumer1_usage"
            class="align-right"
            suffix="kWh"
            type="number"
            step="1"
            label="Verbrauch Consumer 1"></v-text-field>

          <v-text-field
            v-if="editContract.has_consumers"
            v-model="editContract.manuell_data.consumer2_usage"
            class="align-right"
            suffix="kWh"
            type="number"
            step="1"
            label="Verbrauch Consumer 2"></v-text-field>

          <v-text-field
            v-if="editContract.has_consumers"
            v-model="editContract.manuell_data.consumer3_usage"
            class="align-right"
            suffix="kWh"
            type="number"
            step="1"
            label="Verbrauch Consumer 3"></v-text-field>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="secondary"
            text
            @click="manuellDialog = false"
          >
            Abbrechen
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="storeManuellData"
            :disabled="loading"
            :loading="loading"
          >
            Speichern
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="errorSnack">
      {{ errorMessage }}
      <v-btn text @click="errorSnack = false">
        Schließen
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'

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
      manuellDialog: false,
      editContract: null,
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
    async checkAllContractData () {
      this.loading = true
      for (let i = 0; i < this.contracts.length; i++) {
        await this.$store.dispatch('cloud_contract/checkContractData',{ contractNumber: this.contracts[i].contract_number, year: this.year })
          .catch (error => this.showError(error))
        await this.sleep(1000)
      }
      this.loading = false
      this.reload()
    },
    async generateAllContracts () {
      this.loading = true
      for (let i = 0; i < this.contracts.length; i++) {
        if (this.status(this.contracts[i]) === 'green') {
          await this.$store.dispatch('cloud_contract/generateAnnualStatement',{ contractNumber: this.contracts[i].contract_number, year: this.year })
            .catch (error => this.showError(error))
          await this.sleep(1000)
        }
      }
      this.loading = false
      this.reload()
    },
    async generateAnnualStatement (contractNumber) {
      this.loading = true
      await this.$store.dispatch('cloud_contract/generateAnnualStatement', {
        year: this.year,
        contractNumber: contractNumber
      })
      .catch (error => this.showError(error))
      this.loading = false
      this.reload()
    },
    openManuallData (contract) {
      this.editContract = cloneDeep(contract)
      this.manuellDialog = true
    },
    async storeManuellData () {
      this.loading = true
      await this.$store.dispatch('cloud_contract/storeManuellData', {
        year: this.year,
        contract: this.editContract
      })
      .catch (error => this.showError(error))
      this.loading = false
      this.manuellDialog = false
    },
    sleep (ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    status (contract) {
      if (
        contract.has_lightcloud === true &&
        contract.has_cloud_number === true &&
        contract.has_begin_date === true &&
        contract.has_smartme_number === true &&
        contract.has_smartme_number_values === true &&
        contract.has_correct_usage === "true" &&
        contract.has_heatcloud === false &&
        contract.has_ecloud === false &&
        contract.has_consumers === false
      ) {
        return "green"
      } else if (
        contract.has_lightcloud === true &&
        contract.has_cloud_number === true &&
        contract.has_begin_date === true &&
        contract.has_smartme_number === true &&
        contract.has_smartme_number_values === true &&
        contract.has_correct_usage === "true"
      ) {
        return "yellow"
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
