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
    .label {
      padding-right: 1em;
    }
    .productlist > div {
      padding: 0.5em 1em;
      border: 1px solid #aaa;
      border-left: none;
    }
    .productlist > div:first-child {
      border-left: 1px solid #aaa;
    }
    table td {
      padding: 0.2em 0.3em;
    }
</style>
<template>
  <div v-if="contract">
    <v-btn @click="reload">reload</v-btn><br>
    <br>
    <div class="box">
      <h3>Datenprüfung</h3>
      <!--<div>
        <v-icon>mdi-check</v-icon> Bankverbindung
      </div>
      <div>
        <v-icon>mdi-check</v-icon> Smartme Zähler Lichtstrom
      </div>
      <div>
        <v-icon>mdi-check</v-icon> Smartme Zähler Wärmestrom
      </div>-->
    </div>
    <br>
    <div class="box">
      <h3>Vertrag {{ contract.number }}</h3>

      <div class="layout horizontal">
        <h4 class="flex">Cloud Konfigurationen</h4>
      </div>
      <div v-for="config in contract.configs" :key="config.cloud_number" class="box">
        <div style="display: grid; grid-template-columns: auto auto;justify-content: start;">
          <div class="label">Gültig ab:</div>
          <div><b>{{ config.delivery_begin | dateFormat }}</b></div>
          <div class="label">Konfiguration:</div>
          <div><a :href="config.pdf_link" target="_blank"><b>{{ config.cloud_number }}</b></a></div>

          <div class="label">Gesamtpreis:</div>
          <div>
            <div style="display: grid; grid-template-columns: auto auto">
              <div>(netto)&nbsp;</div> <div style="text-align: right">{{ config.price_per_month_net | formatPrice}}</div>
              <div>(brutto)&nbsp;</div> <div style="text-align: right">{{ config.price_per_month | formatPrice}}</div>
            </div>
          </div>

        </div>
        <div class="productlist layout horizontal">
          <div>
            <b>Lichtcloud</b><br>
            <div v-if="config.lightcloud">
              SmartMe Zähler: {{ config.lightcloud.smartme_number }}<br>
              Zählernummer: {{ config.lightcloud.power_meter_number }}<br>
              Verbrauch: {{ config.lightcloud.usage }} kWh<br>
              Lieferbeginn: {{ config.lightcloud.delivery_begin | dateFormat }}<br>
              Mehrverbrauch: {{ (config.lightcloud.extra_price_per_kwh * 100) | formatNumber }} Cent/kWh<br>
              Bitrix Auftrag: <a v-if="config.lightcloud.deal" :href="'https://keso.bitrix24.de/crm/deal/details/' + config.lightcloud.deal.id + '/'" target="_blank">Link</a>
            </div>
            <div v-else>- nicht bestellt -</div>
          </div>
          <div>
            <b>Wärmecloud</b><br>
            <div v-if="config.heatcloud">
              SmartMe Zähler: {{ config.heatcloud.smartme_number }}<br>
              Zählernummer: {{ config.heatcloud.power_meter_number }}<br>
              Verbrauch: {{ config.heatcloud.usage }} kWh<br>
              Lieferbeginn: {{ config.heatcloud.delivery_begin | dateFormat }}<br>
              Mehrverbrauch: {{ (config.heatcloud.extra_price_per_kwh * 100) | formatNumber }} Cent/kWh<br>
              Bitrix Auftrag: <a v-if="config.heatcloud.deal" :href="'https://keso.bitrix24.de/crm/deal/details/' + config.heatcloud.deal.id + '/'" target="_blank">Link</a>
            </div>
            <div v-else>- nicht bestellt -</div>
          </div>
          <div>
            <b>eCloud</b><br>
            <div v-if="config.ecloud">

            </div>
            <div v-else>- nicht bestellt -</div>
          </div>
          <div>
            <b>eMove</b><br>
            <div v-if="config.emove">

            </div>
            <div v-else>- nicht bestellt -</div>
          </div>
          <div>
            <b>Consumer</b><br>
            <div v-if="config.consumers.length > 0">

            </div>
            <div v-else>- nicht bestellt -</div>
          </div>
          <div>
            <b>Cashback</b><br>
            Minderverbrauch: {{ (config.cashback_price_per_kwh * 100) | formatNumber }} Cent/kWh
          </div>
        </div>
      </div>
    </div>
    <br>
    <div class="box">
      <h3>Vorauszahlungen</h3>
      <div v-if="contract.fakturia">
        <div style="display: grid; grid-template-columns: auto auto;justify-content: start;">
          <div class="label">Status:</div>
          <div><a :href="`https://backoffice.fakturia.de/secure/tenant/Contract/ContractEdit.html?preload=${contract.fakturia.contractNumber}`" target="_blank">{{ contract.fakturia.contractStatus }}</a></div>
          <div class="label">Kundennummer:</div> <div><a :href="`https://backoffice.fakturia.de/secure/tenant/Customer/CustomerEdit.html?preload=${contract.fakturia.customerNumber}`" target="_blank">{{ contract.fakturia.customerNumber }}</a></div>
          <div class="label">Vertragsbegin:</div> <div>{{ contract.fakturia.issueDate | dateFormat }}</div>
          <div class="label">Nächste Rechnung:</div> <div>{{ contract.fakturia.nextBilling | dateFormat }}</div>
        </div>
        <div class="layout horizontal">
          <div>
            <b>Rechnungen/Gutschriften</b><br>
            <small>Achtung! Rechnungskorrekturen sind nicht aufgeführt</small>
            <table>
              <tr>
                <th>Datum</th>
                <th>Nummer</th>
                <th>netto</th>
                <th>brutto</th>
                <th>Bezahlt</th>
                <th>Storniert?</th>
              </tr>
              <tr v-for="item in contract.invoices" :key="item.number">
                <td>{{ item.date | dateFormat }}</td>
                <td>{{ item.number }}</td>
                <td>{{ item.amountNet }}</td>
                <td>{{ item.amountGross }}</td>
                <td>{{ item.amountPaid }}</td>
                <td>{{ item.canceled }}</td>
              </tr>
              <tr v-for="item in contract.credit_notes" :key="item.number">
                <td>{{ item.date | dateFormat }}</td>
                <td>{{ item.number }}</td>
                <td>{{ item.amountNet }}</td>
                <td>{{ item.amountGross }}</td>
                <td>{{ item.amountPaid }}</td>
                <td>{{ item.canceled }}</td>
              </tr>
            </table>
          </div>
          <div>
            <b>Kontobewegungen</b>
            <table>
              <tr>
                <th>Datum</th>
                <th>Typ</th>
                <th>Info</th>
                <th>Betrag</th>
              </tr>
              <tr v-for="item in contract.payments" :key="item.dateTime">
                <td>{{ item.dateTime | dateFormat }}</td>
                <td>{{ item.type }}</td>
                <td>{{ item.info }}</td>
                <td>{{ item.amount }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div v-else>Nicht bei Fakturia</div>
    </div>
    <br>

    <div class="box">
      <h3>Abrechnungen</h3>

      <div v-for="annualStatement in contract.annual_statements" :key="annualStatement.year">
        <h4>{{ annualStatement.year }}</h4>
        <div v-if="!annualStatement.data">
          Keine Abrechnung vorhanden
        </div>
        <div v-else>
          <div>
            <v-btn-toggle v-model="annualStatement.status" multiple>
              <v-btn value="has_status">
                Hat Status
              </v-btn>
              <v-btn value="is_generated">
                Ist erstellt
              </v-btn>
              <v-btn>
                In manueller Prüfung
              </v-btn>
              <v-btn>
                Ist verschickt
              </v-btn>
              <v-btn>
                Ist Abgerechnet
              </v-btn>
            </v-btn-toggle>
          </div>
          Bitrix Auftrag: <a v-if="annualStatement.deal" :href="'https://keso.bitrix24.de/crm/deal/details/' + annualStatement.deal.id + '/'" target="_blank">Link</a><br>
          Abrechnungs PDF: <a v-if="annualStatement.pdf_link" :href="annualStatement.pdf_link" target="_blank">Link</a><br>
          <br>
          <div class="label">Gesamtpreis:</div>
          <div>
            <div style="display: grid; grid-template-columns: auto auto">
              <div>(netto)&nbsp;</div> <div style="text-align: right">{{ annualStatement.to_pay_net | formatPrice}}</div>
              <div>(brutto)&nbsp;</div> <div style="text-align: right">{{ annualStatement.to_pay | formatPrice}}</div>
            </div>
          </div>
          <b>Produkte</b>
          <table>
            <tr>
              <th>Cloud Produkt/Abnahmestelle</th>
              <th>von</th>
              <th>bis</th>
              <th>abgedeckt</th>
              <th>ermittelt</th>
            </tr>
            <template v-for="product in annualStatement.data.products">
              <tr :key="product.number">
                <td>{{ product.label }}</td>
                <td>{{ product.start_date | dateformat }}</td>
                <td>{{ product.end_date | dateformat }}</td>
                <td>{{ product.allowed_usage | formatNumber(0) }}</td>
                <td>{{ product.usage | formatNumber(0) }}</td>
              </tr>
              <tr v-if="product.power_meter_usage > 0" :key="product.power_meter_number">
                <td>{{ product.label }}</td>
                <td>{{ product.power_meter_start_date | dateformat }}</td>
                <td>{{ product.power_meter_end_date | dateformat }}</td>
                <td>-</td>
                <td>{{ product.power_meter_usage | formatNumber(0) }}</td>
              </tr>
            </template>
          </table>
          <table>
            <tr>
              <th colspan="3">&nbsp;</th>
              <th colspan="2">Stand Alt</th>
              <th colspan="2">Stand Neu</th>
              <th>&nbsp;</th>
            </tr>
            <tr>
              <th>Zählernummer</th>
              <th>Zählerart</th>
              <th>Ablesegrund</th>
              <th style="text-align: right;">Datum</th>
              <th style="text-align: right;">Wert</th>
              <th style="text-align: right;">Datum</th>
              <th style="text-align: right;">Wert</th>
              <th style="text-align: right;">Verbrauch</th>
            </tr>
            <tr v-for="counter in annualStatement.data.counters" :key="counter.number + counter.zahlernummer">
              <td v-if="counter.sherpa_invoice_id">{{ counter.zahlernummer }} *</td>
              <td v-if="counter.sherpa_invoice_id">{{ counter.zahlerart }}</td>
              <td v-if="counter.sherpa_invoice_id">{{ counter.ablesegrund }}</td>
              <td v-if="counter.sherpa_invoice_id" style="text-align: right;">{{ counter.datum_stand_alt | dateformat }}</td>
              <td v-if="counter.sherpa_invoice_id" style="text-align: right;">{{ counter.stand_alt | formatNumber(0) }} kWh</td>
              <td v-if="counter.sherpa_invoice_id" style="text-align: right;">{{ counter.datum_stand_neu | dateFormat }}</td>
              <td v-if="counter.sherpa_invoice_id" style="text-align: right;">{{ counter.stand_neu | formatNumber() }} kWh</td>
              <td v-if="counter.sherpa_invoice_id" style="text-align: right;">{{ counter.verbrauch | formatNumber(0) }} kWh</td>
              <td v-if="counter.number">{{ counter.number }} **</td>
              <td v-if="counter.number">smartMe</td>
              <td v-if="counter.number"></td>
              <td v-if="counter.number" style="text-align: right;">{{ counter.start_date | dateformat }}</td>
              <td v-if="counter.number" style="text-align: right;">{{ counter.start_value | formatNumber(0) }} kWh</td>
              <td v-if="counter.number" style="text-align: right;">{{ counter.end_date | dateformat }}</td>
              <td v-if="counter.number" style="text-align: right;">{{ counter.end_value | formatNumber(0) }} kWh</td>
              <td v-if="counter.number" style="text-align: right;">{{ counter.usage | formatNumber(0) }} kWh</td>
            </tr>
          </table>
          <b>Manuelle Daten:</b><br>
          <div v-if="manuellData.year == annualStatement.year">
            <div v-for="(counter, index) in this.manuellData.counters" :key="index">
              <v-text-field v-model="counter.start_date" label="Stand Alt Datum" />
              <v-text-field v-model="counter.start_value" label="Stand Alt Wert" />
            </div>
          </div>
          <v-btn v-else @click="setManuellData(annualStatement)">überschreiben</v-btn>
        </div>
        <v-btn @click="generateAnnualStatement(annualStatement.year, annualStatement)">Abrechnung erzeugen</v-btn>
      </div>

    </div>
    <br>
    <!--<h3>Verbräuche</h3>
    <table  style="text-align: right">
      <tr>
        <td>Zählernummer</td>
        <td>Jan. (01)</td>
        <td>Feb. (02)</td>
        <td>Mrz. (03)</td>
        <td>Apr. (04)</td>
        <td>Mai (05)</td>
        <td>Jun. (06)</td>
        <td>Jul. (07)</td>
        <td>Aug. (08)</td>
        <td>Sep. (09)</td>
        <td>Okt. (10)</td>
        <td>Nov. (11)</td>
        <td>Dez. (12)</td>
        <td><b>Gesamt</b></td>
      </tr>
      <tr>
        <td colspan="14" style="text-align: left;">2021</td>
      </tr>
      <tr>
        <td>{{ contract.pv_system.smartme_number }}</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td colspan="14" style="text-align: left;">2022</td>
      </tr>
      <tr>
        <td>{{ contract.pv_system.smartme_number }}</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    </table>-->



    <div class="box">
        <h3>Anlageninformationen:</h3>
        Größe PV Anlage: {{ contract.pv_system.pv_kwp | formatNumber }} kWp<br>
        Größe Speicher: {{ contract.pv_system.storage_size | formatNumber }} kWh<br>
        MaloID: {{ contract.pv_system.malo_id }}<br>
        Netzbetreiber: {{ contract.pv_system.netprovider }}<br>
        Adresse: {{ contract.pv_system.street }} {{ contract.pv_system.street_nb }}, {{ contract.pv_system.zip }} {{ contract.pv_system.city }}<br>
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
import { cloneDeep } from 'lodash'

export default {

  async asyncData({ $axios, params, route }) {
    console.log(params)
    return {
      contractNumber: params.id
    }
  },

  mounted () {
    this.reload()
  },

  data(){
    return {
      manuellData: {},
      loading: false,
      errorSnack: false,
      errorMessage: ''
    }
  },

  computed: {
    contract: function () { return this.$store.getters['cloud_contract/contract'] }
  },

  methods: {
    async reload (forceReload) {
      this.loading = true
      await this.$store.dispatch('cloud_contract/loadContractData', {
        contractNumber: this.contractNumber,
        forceReload: forceReload
      })
      .catch (error => this.showError(error))
      this.loading = false
    },
    async generateAnnualStatement (year, statement) {
      console.log(year)
      this.loading = true
      await this.$store.dispatch('cloud_contract/generateAnnualStatement', {
        year: year,
        contractNumber: this.contract.contract_number,
        statement: statement
      })
      .catch (error => this.showError(error))
      this.loading = false
      this.reload()
    },
    setManuellData (annualStatement) {
      if(!annualStatement.manuell_data || !annualStatement.manuell_data.year) {
        this.manuellData = {
          year: annualStatement.year,
          counters: []
        }
        console.log(this.manuellData)
      } else {
        this.manuellData = cloneDeep(annualStatement.manuell_data)
      }
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
