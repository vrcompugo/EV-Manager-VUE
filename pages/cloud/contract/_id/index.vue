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
    <div class="layout horizontal">
      <div class="flex">
        <v-btn @click="reload">reload</v-btn>
      </div>
      <div v-if="user.id === 107 || user.id === 356 || user.id === '356' ">
        <v-btn :href="`/vue/cloud/quote_modify?token=${token}`" target="_blank">Angebote editieren</v-btn>
        <v-btn :href="`/vue/cloud/import?token=${token}`" target="_blank">Sherpa Daten importieren</v-btn>
      </div>
    </div>
    <div v-if="contract.errors">
        <div v-for="error in contract.errors" :key="error.code">
          {{ error.message }}
        </div>
    </div>
    <div v-if="contract.pv_system">
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
          <v-btn @click="addCustomConfig">Neue Custom-Config</v-btn>
        </div>
        <div v-for="config in contract.configs" :key="config.cloud_number" class="box">
          <div style="display: grid; grid-template-columns: auto auto;justify-content: start;">
            <div class="label">Gültig ab:</div>
            <div><b>{{ config.delivery_begin | dateFormat }}</b></div>
            <div v-if="config.delivery_end" class="label">Gekündigt zum:</div>
            <div v-if="config.delivery_end"><b>{{ config.delivery_end | dateFormat }}</b></div>
            <div class="label">Konfiguration:</div>
            <div>
              <a :href="config.pdf_link" target="_blank"><b>{{ config.cloud_number }}</b></a>
              <span v-if="config.old_cloud_number">(zuvor {{ config.old_cloud_number }})</span>
              <v-btn small v-if="config.old_cloud_number" @click="editConfig(config)">Bearbeiten</v-btn>
            </div>

            <div class="label">Gesamtpreis:</div>
            <div>
              <div style="display: grid; grid-template-columns: auto auto">
                <div>(netto)&nbsp;</div> <div style="text-align: right">{{ config.cloud_price_incl_refund_net | formatPrice}}</div>
                <div>(brutto)&nbsp;</div> <div style="text-align: right">{{ config.cloud_price_incl_refund | formatPrice}}</div>
              </div>
            </div>

          </div>
          <div class="productlist layout horizontal">
            <div>
              <b>Lichtcloud</b><br>
              <div v-if="config.lightcloud">
                SmartMe Zähler: {{ config.lightcloud.smartme_number }}<br>
                <div v-if="config.lightcloud.additional_smartme_numbers && config.lightcloud.additional_smartme_numbers.length > 0">
                  zus. SmartMe Zählernummern: <span v-for="number in config.lightcloud.additional_smartme_numbers" :key="number">{{ number }} </span>
                </div>
                Zählernummer: {{ config.lightcloud.power_meter_number }}<br>
                <div v-if="config.lightcloud.additional_power_meter_numbers && config.lightcloud.additional_power_meter_numbers.length > 0">
                  zus. Zählernummern: <span v-for="number in config.lightcloud.additional_power_meter_numbers" :key="number">{{ number }} </span>
                </div>
                Produktpreis: (brutto) {{ config.lightcloud.cloud_price | formatPrice }}<br>
                Verbrauch: {{ config.lightcloud.usage }} kWh<br>
                benötigte kWp: {{ config.lightcloud.min_kwp | formatNumber }} kWp<br>
                Lieferbeginn: {{ config.lightcloud.delivery_begin | dateFormat }}<br>
                Mehrverbrauch: {{ (config.lightcloud.extra_price_per_kwh * 100) | formatNumber }} Cent/kWh<br>
                Bitrix Auftrag: <a v-if="config.lightcloud.deal" :href="'https://keso.bitrix24.de/crm/deal/details/' + config.lightcloud.deal.id + '/'" target="_blank">Link</a>
              </div>
              <div v-else>- nicht bestellt -</div>
              <div>
                <b>eMove</b><br>
                <div v-if="config.emove">
                  Tarif: {{ config.emove.tarif }}<br>
                  Produktpreis: {{ config.emove.cloud_price | formatPrice }}<br>
                  Verbrauch Zuhause: {{ config.emove.usage | formatNumber(0) }} kWh<br>
                  Verbrauch Außer Haus: {{ config.emove.usage_outside | formatNumber(0) }} kWh<br>
                </div>
                <div v-else>- nicht bestellt -</div>
              </div>
            </div>
            <div>
              <b>Wärmecloud</b><br>
              <div v-if="config.heatcloud">
                SmartMe Zähler: {{ config.heatcloud.smartme_number }}<br>
                <div v-if="config.heatcloud.additional_smartme_numbers && config.heatcloud.additional_smartme_numbers.length > 0">
                  zus. SmartMe Zählernummern: <span v-for="number in config.heatcloud.additional_smartme_numbers" :key="number">{{ number }} </span>
                </div>
                Zählernummer: {{ config.heatcloud.power_meter_number }}<br>
                <div v-if="config.heatcloud.additional_power_meter_numbers && config.heatcloud.additional_power_meter_numbers.length > 0">
                  zus. Zählernummern: <span v-for="number in config.heatcloud.additional_power_meter_numbers" :key="number">{{ number }} </span>
                </div>
                Produktpreis: (brutto) {{ config.heatcloud.cloud_price | formatPrice }}<br>
                Verbrauch: {{ config.heatcloud.usage }} kWh<br>
                benötigte kWp: {{ config.heatcloud.min_kwp | formatNumber }} kWp<br>
                Lieferbeginn: {{ config.heatcloud.delivery_begin | dateFormat }}<br>
                Mehrverbrauch: {{ (config.heatcloud.extra_price_per_kwh * 100) | formatNumber }} Cent/kWh<br>
                Bitrix Auftrag: <a v-if="config.heatcloud.deal" :href="'https://keso.bitrix24.de/crm/deal/details/' + config.heatcloud.deal.id + '/'" target="_blank">Link</a>
              </div>
              <div v-else>- nicht bestellt -</div>
            </div>
            <div>
              <b>eCloud</b><br>
              <div v-if="config.ecloud">
                Zählernummer: {{ config.ecloud.power_meter_number }}<br>
                <div v-if="config.ecloud.additional_power_meter_numbers && config.ecloud.additional_power_meter_numbers.length > 0">
                  zus. Zählernummern: <span v-for="number in config.ecloud.additional_power_meter_numbers" :key="number">{{ number }} </span>
                </div>
                Produktpreis: (brutto) {{ config.ecloud.cloud_price | formatPrice }}<br>
                Verbrauch: {{ config.ecloud.usage }} kWh<br>
                benötigte kWp: {{ config.ecloud.min_kwp | formatNumber }} kWp<br>
                Lieferbeginn: {{ config.ecloud.delivery_begin | dateFormat }}<br>
                Mehrverbrauch: {{ (config.ecloud.extra_price_per_kwh * 100) | formatNumber }} Cent/kWh<br>
                Bitrix Auftrag: <a v-if="config.ecloud.deal" :href="'https://keso.bitrix24.de/crm/deal/details/' + config.ecloud.deal.id + '/'" target="_blank">Link</a>
              </div>
              <div v-else>- nicht bestellt -</div>
            </div>
            <div>
              <div v-if="config.consumers.length > 0">
                <div v-for="(consumer, index) in config.consumers" :key="consumer.label">
                  <b>Consumer {{ index + 1 }}</b><br>
                  Zählernummer: {{ consumer.power_meter_number }}<br>
                  <div v-if="consumer.additional_power_meter_numbers && consumer.additional_power_meter_numbers.length > 0">
                    zus. Zählernummern: <span v-for="number in consumer.additional_power_meter_numbers" :key="number">{{ number }} </span>
                  </div>
                  Produktpreis: (brutto) {{ consumer.cloud_price | formatPrice }}<br>
                  Verbrauch: {{ consumer.usage }} kWh<br>
                  Lieferbeginn: {{ consumer.delivery_begin | dateFormat }}<br>
                  Bitrix Auftrag: <a v-if="consumer.deal" :href="'https://keso.bitrix24.de/crm/deal/details/' + consumer.deal.id + '/'" target="_blank">Link</a>
                </div>
                Mehrverbrauch: {{ (config.consumer_data.extra_price_per_kwh * 100) | formatNumber }} Cent/kWh<br>
              </div>
              <div v-else>
                <b class="flex">Consumer</b><br>
                - nicht bestellt -
              </div>
            </div>
            <div>
              <b>Cashback</b><br>
              Minderverbrauch: {{ (config.cashback_price_per_kwh * 100) | formatNumber }} Cent/kWh<br>
              <b>Cashback eCloud</b><br>
              Minderverbrauch: {{ (config.ecloud_cashback_price_per_kwh * 100) | formatNumber }} Cent/kWh
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
                <tr v-for="item in contract.invoices_credit_notes" :key="item.number">
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

        <div v-for="annualStatement in contract.annual_statements" :key="annualStatement.year" style="margin-bottom: 2em">
          <h4>{{ annualStatement.year }}</h4>
          <div v-if="!annualStatement.data">
            Keine Abrechnung vorhanden
          </div>
          <div v-else>
            <!--
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
            -->
            Bitrix Auftrag: <a v-if="annualStatement.deal" :href="'https://keso.bitrix24.de/crm/deal/details/' + annualStatement.deal.id + '/'" target="_blank">Link ({{ annualStatement.deal.status }})</a><br>
            Abrechnungs PDF: <a v-if="annualStatement.pdf_link" :href="annualStatement.pdf_link" target="_blank">Link</a><br>
            <br>
            <div class="label">Gesamtpreis:</div>
            <div>
              <div style="display: grid; grid-template-columns: 5em 8em">
                <div>(netto)&nbsp;</div> <div style="text-align: right">{{ annualStatement.data.to_pay_net | formatPrice}}</div>
                <div>(brutto)&nbsp;</div> <div style="text-align: right">{{ annualStatement.data.to_pay | formatPrice}}</div>
              </div>
            </div>

            <b>Abzurechnende Cloud Konfigurationen</b>
            <div v-for="config in annualStatement.data.configs" :key="config.cloud_number" class="box">
              Angebotsnummer: <div><a :href="config.pdf_link" target="_blank"><b>{{ config.cloud_number }}</b></a></div>
              <div class="productlist layout horizontal">
                <div>
                  <div class="layout horizontal">
                    <b class="flex">Lichtcloud</b>
                  </div>
                  <div v-if="config.lightcloud">
                    SmartMe Zähler: {{ config.lightcloud.smartme_number }}<br>
                    <div v-if="config.lightcloud.additional_smartme_numbers && config.lightcloud.additional_smartme_numbers.length > 0">
                      zus. SmartMe Zählernummern: <span v-for="number in config.lightcloud.additional_smartme_numbers" :key="number">{{ number }} </span>
                    </div>
                    Zählernummer: {{ config.lightcloud.power_meter_number }}<br>
                    <div v-if="config.lightcloud.additional_power_meter_numbers && config.lightcloud.additional_power_meter_numbers.length > 0">
                      zus. Zählernummern: <span v-for="number in config.lightcloud.additional_power_meter_numbers" :key="number">{{ number }} </span>
                    </div>
                    benötigte kWp: {{ config.lightcloud.min_kwp | formatNumber }} kWp<br>
                    Mehrverbrauch: {{ (config.lightcloud.extra_price_per_kwh * 100) | formatNumber }} Cent/kWh<br>
                    Abrechnungsbeginn: {{ config.lightcloud.delivery_begin | dateFormat }}<br>
                    Abrechnungsende: {{ config.lightcloud.delivery_end | dateFormat }}<br>
                    <b>eMove</b><br>
                    <div v-if="config.emove">

                    </div>
                    <div v-else>- nicht bestellt -</div>
                    abgedeckter Verbrauch: {{ config.lightcloud.allowed_usage | formatNumber }} kWh<br>
                    tatsächlicher Verbrauch: {{ config.lightcloud.actual_usage | formatNumber }} kWh<br>
                    - davon Netzbezug: {{ config.lightcloud.actual_usage_net | formatNumber }} kWh<br>
                    Differenz Verbrauch: {{ config.lightcloud.total_extra_usage | formatNumber }} kWh<br>
                    <div v-if="config.lightcloud.total_extra_usage >= 0">Nachzahlung: {{ config.lightcloud.total_extra_price | formatPrice }}</div>
                    <div v-else>Auszahlung: {{ config.lightcloud.total_extra_price | formatPrice }}</div>
                    Vorauszahlungen Soll: {{ config.lightcloud.total_cloud_price_incl_refund | formatPrice }}
                  </div>
                </div>
                <div>
                  <div class="layout horizontal">
                    <b class="flex">Wärmecloud</b>
                  </div>
                  <div v-if="config.heatcloud">
                    SmartMe Zähler: {{ config.heatcloud.smartme_number }}<br>
                    <div v-if="config.heatcloud.additional_smartme_numbers && config.heatcloud.additional_smartme_numbers.length > 0">
                      zus. SmartMe Zählernummern: <span v-for="number in config.heatcloud.additional_smartme_numbers" :key="number">{{ number }} </span>
                    </div>
                    Zählernummer: {{ config.heatcloud.power_meter_number }}<br>
                    <div v-if="config.heatcloud.additional_power_meter_numbers && config.heatcloud.additional_power_meter_numbers.length > 0">
                      zus. Zählernummern: <span v-for="number in config.heatcloud.additional_power_meter_numbers" :key="number">{{ number }} </span>
                    </div>
                    Mehrverbrauch: {{ (config.heatcloud.extra_price_per_kwh * 100) | formatNumber }} Cent/kWh<br>
                    benötigte kWp: {{ config.heatcloud.min_kwp | formatNumber }} kWp<br>
                    Abrechnungsbeginn: {{ config.heatcloud.delivery_begin | dateFormat }}<br>
                    Abrechnungsende: {{ config.heatcloud.delivery_end | dateFormat }}<br>
                    abgedeckter Verbrauch: {{ config.heatcloud.allowed_usage | formatNumber }} kWh<br>
                    tatsächlicher Verbrauch: {{ config.heatcloud.actual_usage | formatNumber }} kWh<br>
                    - davon Netzbezug: {{ config.heatcloud.actual_usage_net | formatNumber }} kWh<br>
                    Differenz Verbrauch: {{ config.heatcloud.total_extra_usage | formatNumber }} kWh<br>
                    <div v-if="config.heatcloud.total_extra_usage >= 0">Nachzahlung: {{ config.heatcloud.total_extra_price | formatPrice }}</div>
                    <div v-else>Auszahlung: {{ config.heatcloud.total_extra_price | formatPrice }}</div>
                    Vorauszahlungen Soll: {{ config.heatcloud.total_cloud_price_incl_refund | formatPrice }}
                  </div>
                  <div v-else>- nicht bestellt -</div>
                </div>
                <div>
                  <div class="layout horizontal">
                    <b class="flex">eCloud</b>
                  </div>
                  <div v-if="config.ecloud">
                    Zählernummer: {{ config.ecloud.power_meter_number }}<br>
                    <div v-if="config.ecloud.additional_power_meter_numbers && config.ecloud.additional_power_meter_numbers.length > 0">
                      zus. Zählernummern: <span v-for="number in config.ecloud.additional_power_meter_numbers" :key="number">{{ number }} </span>
                    </div>
                    Verbrauch: {{ config.ecloud.usage }} kWh<br>
                    Lieferbeginn: {{ config.ecloud.delivery_begin | dateFormat }}<br>
                    benötigte kWp: {{ config.ecloud.min_kwp | formatNumber }} kWp<br>
                    Mehrverbrauch: {{ (config.ecloud.extra_price_per_kwh * 100) | formatNumber }} Cent/kWh<br>
                    Abrechnungsbeginn: {{ config.ecloud.delivery_begin | dateFormat }}<br>
                    Abrechnungsende: {{ config.ecloud.delivery_end | dateFormat }}<br>
                    abgedeckter Verbrauch: {{ config.ecloud.allowed_usage | formatNumber }} kWh<br>
                    tatsächlicher Verbrauch: {{ config.ecloud.actual_usage | formatNumber }} kWh<br>
                    Differenz Verbrauch: {{ config.ecloud.total_extra_usage | formatNumber }} kWh<br>
                    <div v-if="config.ecloud.total_extra_usage >= 0">Nachzahlung: {{ config.ecloud.total_extra_price | formatPrice }}</div>
                    <div v-else>Auszahlung: {{ config.ecloud.total_extra_price | formatPrice }}</div>
                    Vorauszahlungen Soll: {{ config.ecloud.total_cloud_price_incl_refund | formatPrice }}
                  </div>
                  <div v-else>- nicht bestellt -</div>
                </div>
                <div>
                  <div v-if="config.consumers.length > 0">
                    <div v-for="(consumer, index) in config.consumers" :key="consumer.label">
                      <b>Consumer {{ index + 1 }}</b><br>
                      Zählernummer: {{ consumer.power_meter_number }}<br>
                      <div v-if="consumer.additional_power_meter_numbers && consumer.additional_power_meter_numbers.length > 0">
                        zus. Zählernummern: <span v-for="number in consumer.additional_power_meter_numbers" :key="number">{{ number }} </span>
                      </div>
                      Abrechnungsbeginn: {{ consumer.delivery_begin | dateFormat }}<br>
                      Abrechnungsende: {{ consumer.delivery_end | dateFormat }}<br>
                      abgedeckter Verbrauch: {{ consumer.allowed_usage | formatNumber }} kWh<br>
                      tatsächlicher Verbrauch: {{ consumer.actual_usage | formatNumber }} kWh<br>
                      Differenz Verbrauch: {{ consumer.total_extra_usage | formatNumber }} kWh<br>
                      <div v-if="consumer.total_extra_usage >= 0">Nachzahlung: {{ consumer.total_extra_price | formatPrice }}</div>
                      <div v-else>Auszahlung: {{ consumer.total_extra_price | formatPrice }}</div>
                      Vorauszahlungen Soll: {{ consumer.total_cloud_price_incl_refund | formatPrice }}
                    </div>
                    Mehrverbrauch: {{ (config.consumer_data.extra_price_per_kwh * 100) | formatNumber }} Cent/kWh<br>
                  </div>
                  <div v-else>
                    <b class="flex">Consumer</b><br>
                    - nicht bestellt -
                  </div>
                </div>
                <div>
                  <div class="layout horizontal">
                    <b class="flex">Cashback</b>
                  </div>
                  Minderverbrauch: {{ (config.cashback_price_per_kwh * 100) | formatNumber }} Cent/kWh<br>
                  <b>Cashback eCloud</b><br>
                  Minderverbrauch: {{ (config.ecloud_cashback_price_per_kwh * 100) | formatNumber }} Cent/kWh
                </div>
              </div>
            </div>
            Vorauszahlungen {{ annualStatement.year }} Soll: {{ annualStatement.data.total_cloud_price_incl_refund | formatPrice }}<br>
            Vorauszahlungen {{ annualStatement.year }} Haben: {{ annualStatement.data.pre_payments_total | formatPrice }}<br>
            <br>
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
                <th>Manuell</th>
                <th style="text-align: right;">Datum</th>
                <th style="text-align: right;">Wert</th>
                <th style="text-align: right;">Datum</th>
                <th style="text-align: right;">Wert</th>
                <th style="text-align: right;">Verbrauch</th>
              </tr>
              <tr v-for="counter in annualStatement.data.counters" :key="counter.number">
                <td>{{ counter.number }}</td>
                <td>{{ counter.type }} </td>
                <td>{{ counter.origin }} </td>
                <td style="text-align: right;">{{ counter.start_date | dateFormat }}</td>
                <td style="text-align: right;"><span v-if="counter.start_estimated">*</span>{{ counter.start_value | formatNumber(0) }} kWh</td>
                <td style="text-align: right;">{{ counter.end_date | dateFormat }}</td>
                <td style="text-align: right;"> <span v-if="counter.end_estimated">*</span>{{ counter.end_value | formatNumber(0) }} kWh</td>
                <td style="text-align: right;">{{ counter.usage | formatNumber(0) }} kWh</td>
              </tr>
            </table>
            <small>* geschätzter Wert auf Basis von bekannten Zählerständen</small>
            <br>
            <br>
            <table>
              <tr>
                <th>Zählernummer</th>
                <th>Herkunft</th>
                <th style="text-align: right;">Datum</th>
                <th style="text-align: right;">Wert</th>
                <th>&nbsp;</th>
                <th>&nbsp;</th>
              </tr>
              <tr v-for="counter in annualStatement.data.available_values" :key="counter.number + counter.date">
                <td>{{ counter.number }}</td>
                <td>{{ counter.origin }}</td>
                <td style="text-align: right;">{{ counter.date | dateFormat }}</td>
                <td style="text-align: right;">{{ counter.value | formatNumber(0) }} kWh</td>
                <td>&nbsp;</td>
                <td>{{ accountLabels[counter.account] }} {{ counter.device_label }}</td>
              </tr>
              <tr v-for="counter in annualStatement.data.manuell_counter_values" :key="counter.number + counter.date">
                <td>{{ counter.number }}</td>
                <td>{{ counter.origin }}</td>
                <td style="text-align: right;">{{ counter.date | dateFormat }}</td>
                <td style="text-align: right;">{{ counter.value | formatNumber(0) }} kWh</td>
                <td>
                  <v-btn small icon @click="editedCounter = cloneDeep(counter)"><v-icon>mdi-pencil</v-icon></v-btn>
                  <v-btn small icon @click="deleteCounter(counter, annualStatement.year)"><v-icon>mdi-delete</v-icon></v-btn>
                </td>
                <td>&nbsp;</td>
              </tr>
            </table>
            <div class="layout horizontal" style="flex: 0; justify-content: flex-start; align-items: center">
              <v-text-field label="Zählernummer" v-model="editedCounter.number" style="flex: 0 1 12em; margin-right: 1em" />
              <v-text-field label="Ursprung" v-model="editedCounter.origin" style="flex: 0 1 12em; margin-right: 1em" />
              <v-text-field label="Stand Datum" type="date" v-model="editedCounter.date" style="flex: 0 1 12em; margin-right: 1em" />
              <v-text-field label="Stand Wert" type="number" step="1" class="right" v-model="editedCounter.value" suffix="kWh" style="flex: 0 1 12em; margin-right: 1em" />
              <v-btn v-if="!editedCounter.id" @click="editStatement = annualStatement; storeCounterValue()" small>Zählerwert manuell hinzufügen</v-btn>
              <v-btn v-if="editedCounter.id" @click="editStatement = annualStatement; storeCounterValue()" small>Speichern</v-btn>
              <v-btn v-if="editedCounter.id" @click="editedCounter = {}" small>Abbrechen</v-btn>
            </div>
            <div v-if="manuellData && manuellData[annualStatement.year]">
              <div class="layout horizontal" style="flex: 0; justify-content: flex-start; align-items: center">
                <v-text-field label="Mehrverbrauch Lichtcloud" v-model="manuellData[annualStatement.year].lightcloud_extra_price_per_kwh" type="number" step="0.01" suffix="Cent/kWh" class="right" style="flex: 0 1 12em; margin-right: 1em" />
                <v-text-field label="Mehrverbrauch Wärmecloud" v-model="manuellData[annualStatement.year].heatcloud_extra_price_per_kwh" type="number" step="0.01" suffix="Cent/kWh" class="right"  style="flex: 0 1 12em; margin-right: 1em" />
                <v-text-field label="Mehrverbrauch eCloud" v-model="manuellData[annualStatement.year].ecloud_extra_price_per_kwh" type="number" step="0.01" suffix="Cent/kWh" class="right"  style="flex: 0 1 12em; margin-right: 1em" />
                <v-text-field label="Mehrverbrauch Consumer" v-model="manuellData[annualStatement.year].consumer_extra_price_per_kwh" type="number" step="0.01" suffix="Cent/kWh" class="right"  style="flex: 0 1 12em; margin-right: 1em" />
                <v-text-field label="Cashback" v-model="manuellData[annualStatement.year].cashback_price_per_kwh" type="number" step="0.01" suffix="Cent/kWh" class="right"  style="flex: 0 1 12em; margin-right: 1em" />
                <v-text-field label="Cashback eCloud" v-model="manuellData[annualStatement.year].ecloud_cashback_price_per_kwh" type="number" step="0.01" suffix="Cent/kWh" class="right"  style="flex: 0 1 12em; margin-right: 1em" />
              </div>
              <div class="layout horizontal">
                <v-checkbox label="Netzbezug ausblenden" v-model="manuellData[annualStatement.year].hide_netusage" style="margin-right: 1em"></v-checkbox>
                <v-checkbox label="Zähler Zeitbegrenzung umgehen" v-model="manuellData[annualStatement.year].skip_counter_date_range_limiter" style="margin-right: 1em"></v-checkbox>
                <v-checkbox label="Netzbezug nur schätzen" v-model="manuellData[annualStatement.year].estimate_netusage" style="margin-right: 1em"></v-checkbox>
                <v-text-field
                  label="Angenommener Autarkiegrad Lichtcloud"
                  v-model="manuellData[annualStatement.year].assumed_autocracy_lightcloud" type="number" step="1" suffix="%" class="right"  style="flex: 0 1 12em; margin-right: 1em" />
                <div v-if="contract.main_deal.measuring_concept === 'parallel_concept'">
                  <v-select
                    v-model="manuellData[annualStatement.year].parallel_concept_counter" :items="[
                      {'value':'','label':'Netzbezugszähler nutzen (Standard)'},
                      {'value':'smartme','label':'Smartme Zähler nutzen'}
                    ]"
                    label="Paralleles Messkonzept Zählerauswahl"
                    item-text="label"
                    item-value="value"></v-select>
                </div>
                <div v-else>
                  <v-text-field
                    label="Angenommener Autarkiegrad Wärmecloud"
                    v-model="manuellData[annualStatement.year].assumed_autocracy_heatcloud" type="number" step="1" suffix="%" class="right"  style="flex: 0 1 12em; margin-right: 1em" />
                </div>
              </div>
              <div class="layout horizontal">
                <v-checkbox label="korrigierte Zeitraumberechnung" v-model="manuellData[annualStatement.year].corrected_datediff" style="margin-right: 1em"></v-checkbox>
                <v-checkbox label="Zeitraum abhängige 250kwh" v-model="manuellData[annualStatement.year].corrected_250kwh" style="margin-right: 1em"></v-checkbox>
              </div>
              <div class="layout horizontal">
                <v-text-field label="Gutschrift Bezeichnung" v-model="manuellData[annualStatement.year].extra_credit_label"  style="flex: 1; margin-right: 1em" />
                <v-text-field label="Gutschriftswert" v-model="manuellData[annualStatement.year].extra_credit_value" type="number" step="0.01" suffix="€" class="right"  style="flex: 0 1 12em; margin-right: 1em" />
              </div>
              <div class="layout horizontal">
                <v-text-field label="Gutschrift Bezeichnung" v-model="manuellData[annualStatement.year].extra_credit_label2"  style="flex: 1; margin-right: 1em" />
                <v-text-field label="Gutschriftswert" v-model="manuellData[annualStatement.year].extra_credit_value2" type="number" step="0.01" suffix="€" class="right"  style="flex: 0 1 12em; margin-right: 1em" />
              </div>
              <v-textarea
                label="Kommentarfeld"
                v-model="manuellData[annualStatement.year].comment"
              ></v-textarea><br>
              <v-btn @click="storeManuellData(annualStatement.year)" small>Speichern</v-btn>
            </div>
            <br>
            <div v-if="annualStatement.data.errors && annualStatement.data.errors.length > 0">
              <b>Abrechnung hat Fehler:</b><br>
              <div v-for="error in annualStatement.data.errors" :key="error">
                {{ error }}
              </div>
              <br>
            </div>
            <div v-if="annualStatement.data.warnings && annualStatement.data.warnings.length > 0">
              <b>Abrechnung hat Warnungen:</b><br>
              <div v-for="warning in annualStatement.data.warnings" :key="warning">
                {{ warning }}
              </div>
              <br>
            </div>
          </div>
          <v-btn @click="generateAnnualStatement(annualStatement.year)" style="margin-right: 1em">Daten neuladen</v-btn>
          <v-btn :disabled="!(annualStatement.data && annualStatement.data.errors && annualStatement.data.errors.length === 0 && annualStatement.deal && (annualStatement.deal.status === 'Abrechnung 2022' || annualStatement.deal.status === 'Neu' || annualStatement.deal.status === 'Abrechnungskorrektur erzeugen' || annualStatement.deal.status === 'Senec Werte-Abfrage BSH' || annualStatement.deal.status === 'Altvertrag manuelle bearbeitung' || annualStatement.deal.status === 'Spezialkunde' || annualStatement.deal.status === 'Orgamaxx Kunde' || annualStatement.deal.status === 'Consumer Daten erfragen' || annualStatement.deal.status === 'Senec Wert gemeldet'))" @click="generateAnnualStatementPDF(annualStatement.year)" style="margin-right: 1em">PDF erzeugen</v-btn>
          <!--<v-btn  @click="generateAnnualStatementPDF(annualStatement.year)" style="margin-right: 1em">PDF erzeugen</v-btn>-->
          <v-btn :disabled="!(annualStatement.data && annualStatement.data.errors && annualStatement.data.errors.length === 0 && annualStatement.deal && (annualStatement.deal.status === 'Neu'))" @click="generateAnnualStatement(annualStatement.year)">verschicken</v-btn>
        </div>
      </div>
      <br>

      <div class="box">
          <h3>Anlageninformationen:</h3>
          Größe PV Anlage: {{ contract.pv_system.pv_kwp | formatNumber }} kWp<br>
          Größe Speicher: {{ contract.pv_system.storage_size | formatNumber }} kWh<br>
          MaloID: {{ contract.pv_system.malo_id }}<br>
          Netzbetreiber: {{ contract.pv_system.netprovider }}<br>
          Adresse: {{ contract.pv_system.street }} {{ contract.pv_system.street_nb }}, {{ contract.pv_system.zip }} {{ contract.pv_system.city }}<br>
      </div>
    </div>

    <v-dialog
      v-model="editDialog"
      width="1400"
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Cloud Angebot {{ editedConfigData.cloud_number }} bearbeiten
        </v-card-title>

        <v-card-text>
          <EditForm ref="configEditDialog" :config="editedConfigData" v-model="editedConfigData2"></EditForm>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn
            text
            @click="editDialog = false"
          >
            Abbrechen
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="storeConfig(); editDialog = false"
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

    <v-overlay :value="loading">
      <v-progress-circular
        indeterminate
        color="primary"
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import EditForm from '~/components/cloud/editForm.vue'

export default {

  components: {
    EditForm
  },

  async asyncData({ $auth, $axios, params, route }) {
    return {
      contractNumber: params.id,
      token: route.query.token,
      user: $auth.user
    }
  },

  mounted () {
    this.reload()
  },

  data(){
    return {
      accountLabels: {
        '': 'korbacher energiezentrum',
        '2': 'Smartme@korbacher-energiezentrum.de',
        '3': 'energie@360.de',
        '4': 'bsh@emu.de'
      },
      loading: false,
      errorSnack: false,
      errorMessage: '',
      editStatement: {},
      editedCounter: {},
      manuellData: {},
      editedConfigData: {},
      editedConfigData2: {},
      editDialog: false
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
      .then(contract => {
        this.manuellData = {}
        for(let i = 0; i < contract.annual_statements.length; i++) {
          if (contract.annual_statements[i].manuell_data) {
            this.manuellData[contract.annual_statements[i].year] = cloneDeep(contract.annual_statements[i].manuell_data)
          } else {
            this.manuellData[contract.annual_statements[i].year] = {}
          }
        }
        this.loading = false
      })
      .catch (error => this.showError(error))
    },
    editConfig (configData) {
      this.editDialog = true
      this.editedConfigData = configData
      if (this.$refs['configEditDialog']) {
        this.$refs['configEditDialog'].convert()
      }
    },
    async storeConfig () {
      this.editDialog = false
      this.loading = true
      await this.$store.dispatch('cloud_contract/storeCustomConfig', {
        contractNumber: this.contract.contract_number,
        configData: this.editedConfigData2
      })
      .then((response) => {
        this.loading = false
        this.reload(true)
      })
      .catch (error => this.showError(error))

    },
    async generateAnnualStatement (year) {
      this.loading = true
      await this.$store.dispatch('cloud_contract/generateAnnualStatement', {
        year: year,
        contractNumber: this.contract.contract_number
      })
      .catch (error => this.showError(error))
      this.loading = false
      this.reload(true)
    },
    async generateAnnualStatementPDF (year) {
      this.loading = true
      await this.$store.dispatch('cloud_contract/generateAnnualStatementPDF', {
        year: year,
        contractNumber: this.contract.contract_number
      })
      .catch (error => this.showError(error))
      this.loading = false
      this.reload(true)
    },
    async storeCounterValue () {
      this.loading = true
      await this.$store.dispatch('cloud_contract/addCounterValue', {
        counter: this.editedCounter
      })
      .then((response) => {
        this.loading = false
        this.generateAnnualStatement(this.editStatement.year)
        this.reload(true)
      })
      .catch (error => this.showError(error))
    },
    async storeManuellData(year) {
      this.loading = true
      await this.$store.dispatch('cloud_contract/storeManuellData', {
        year,
        contractNumber: this.contract.contract_number,
        data: this.manuellData[year]
      })
      .then((response) => {
        this.loading = false
        this.generateAnnualStatement(year)
        this.reload(true)
      })
      .catch (error => this.showError(error))
    },
    async addCustomConfig() {
      this.loading = true
      await this.$store.dispatch('cloud_contract/addCustomConfig', {
        contractNumber: this.contract.contract_number
      })
      .then((response) => {
        this.loading = false
        this.reload(true)
      })
      .catch (error => this.showError(error))
    },
    async deleteCounter (counter, year) {
      await this.$confirm('<div style="padding: 1em 1em 0 1em; font-size: 1.4em">Wirklich löschen?</div>').then(res => {
        if(res){
          this.loading = true
          this.$store.dispatch('cloud_contract/deleteCounterValue', { counter })
          .then((response) => {
            this.loading = false
            this.generateAnnualStatement(year)
            this.reload(true)
          })
          .catch (error => this.showError(error))
        }
      })
    },
    showError (error) {
      this.loading = false
      this.errorMessage = 'Unbekannter Server Fehler'
      if (error.response && error.response.data) {
        this.errorMessage = error.response.data.message
      }
      this.errorSnack = true
    },
    cloneDeep(value) {
      return cloneDeep(value)
    }
  }
}
</script>
