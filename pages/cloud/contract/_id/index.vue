<style scoped>
    .box {
        border: 1px solid #ccc;
        padding: 1em;
        margin: 0 0 1em;
    }
    .description {
        max-width: 400px;
    }
    .description .label {
        display: block;
        border-bottom: 1px dashed #ccc;
        font-weight: bold;
    }
</style>
<template>
  <div v-if="contract">
    <v-btn @click="reload">reload</v-btn>
    <div class="box">
        <h3>Anlageninformationen:</h3>
        Angebotsnummer: {{ contract.cloud.cloud_number }}<br>
        Größe PV Anlage: {{ contract.pv_system.pv_kwp | formatNumber }} kWp<br>
        Smart.me Zählernummer: {{ contract.pv_system.smartme_number }}<br>
        Zählernummer: {{ contract.pv_system.power_meter_number }}<br>
        MaloID: {{ contract.pv_system.malo_id }}<br>
        Netzbetreiber: {{ contract.pv_system.netprovider }}<br>
        Adresse: {{ contract.pv_system.street }} {{ contract.pv_system.street_nb }}, {{ contract.pv_system.zip }} {{ contract.pv_system.city }}<br>
        <div v-for="item in contract.pv_system.usages" :key="item.year">
            Verbrauch {{ item.year }}: {{ item.usage | formatNumber }} kWh ({{ item.start_date | dateFormat }} - {{ item.end_date | dateFormat }})<br>
        </div>
    </div>
    <div class="box">
        <h3>Cloud Produkte</h3>
        <div class="layout horizontal" v-if="contract.lightcloud">
            <div class="statusicon">{{ contract.lightcloud.status }}</div>
            <div class="description flex">
                <div class="label">Lichtstrom</div>
                <div style="padding-left: 1em">
                    geplanter Verbrauch: {{ contract.lightcloud.usage }}<br>
                    Lieferbeginn: {{ contract.lightcloud.delivery_begin | dateFormat }}<br>
                    Vertragsende: {{ contract.lightcloud.cancelation_due_date | dateFormat  }}<br>
                </div>
            </div>
            <div class="price_net"><b>Preis</b></div>
            <div class="price_brutto"><b>Preis</b></div>
        </div>
        <div class="layout horizontal" v-if="contract.heatcloud">
            <div class="statusicon">{{ contract.heatcloud.status }}</div>
            <div class="description flex">
                <div class="label">Wärmecloud</div>
                <div style="padding-left: 1em">
                    geplanter Verbrauch: {{ contract.heatcloud.usage }}<br>
                    Lieferbeginn: {{ contract.heatcloud.delivery_begin | dateFormat }}<br>
                    Vertragsende: {{ contract.heatcloud.cancelation_due_date | dateFormat  }}<br>
                </div>
            </div>
            <div class="price_net"><b>Preis</b></div>
            <div class="price_brutto"><b>Preis</b></div>
        </div>
        <div class="layout horizontal" v-if="contract.ecloud">
            <div class="statusicon">{{ contract.ecloud.status }}</div>
            <div class="description flex">
                <div class="label">E.Cloud</div>
                <div style="padding-left: 1em">
                    geplanter Verbrauch: {{ contract.ecloud.usage }} kWh<br>
                    Lieferbeginn: {{ contract.ecloud.delivery_begin | dateFormat }}<br>
                    Vertragsende: {{ contract.ecloud.cancelation_due_date | dateFormat  }}<br>
                </div>
            </div>
            <div class="price_net"><b>Preis</b></div>
            <div class="price_brutto"><b>Preis</b></div>
        </div>
        <div class="layout horizontal" v-if="contract.consumers.length > 0">
          <div v-for="consumer in contract.consumers" :key="consumer.power_meter_number">
            <div class="statusicon">{{ contract.ecloud.status }}</div>
            <div class="description flex">
                <div class="label">E.Cloud</div>
                <div style="padding-left: 1em">
                    geplanter Verbrauch: {{ contract.ecloud.usage }} kWh<br>
                    Lieferbeginn: {{ contract.ecloud.delivery_begin | dateFormat }}<br>
                    Vertragsende: {{ contract.ecloud.cancelation_due_date | dateFormat  }}<br>
                </div>
            </div>
            <div class="price_net"><b>Preis</b></div>
            <div class="price_brutto"><b>Preis</b></div>
          </div>
        </div>
        <div class="layout horizontal" v-if="contract.emove">
            <b>eMove</b>
        </div>
      <v-btn @click="generateAnnualStatement">Abrechnung 2021 erstellen</v-btn>
      <div v-if="contract.annualStatements">
        <v-btn v-for="statment in contract.annualStatements" :key="statment.year" :href="statment.pdf_link" target="_blank">Abrechnung {{statment.year}} öffnen</v-btn>
      </div>
    </div>

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
      contractNumber: params.id
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
    contract: function () { return this.$store.getters['cloud_contract/contract'] }
  },

  methods: {
    async reload () {
      this.loading = true
      await this.$store.dispatch('cloud_contract/loadContractData', {
        contractNumber: this.contractNumber
      })
      .catch (error => this.showError(error))
      this.loading = false
    },
    async generateAnnualStatement () {
      this.loading = true
      await this.$store.dispatch('cloud_contract/generateAnnualStatement', {
        year: 2021,
        contractNumber: this.contractNumber
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
    }
  }
}
</script>
