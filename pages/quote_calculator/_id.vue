<style lang="scss" scoped>
  .kwp-bar {
    box-shadow: 0 0 3px 0 rgba(0,0,0,0.5);
    margin: 0.2em 0;
  }
  .kwp-bar > div {
    color: #ffffff;
    padding: 0.8em 0.6em;
    font-size: 0.8em;
    margin-right: 0.2em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .kwp-bar > div:last-child {
    margin-right: 0;
  }
  .quote_selection > * {
    flex: 1;
    background-color: #eee;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    border-left: 1px solid #ccc;
    display: flex;
    align-items: center;
    padding: 0.5em 0;
  }
  .quote_selection > * > * {
    flex: 1;
    padding: 0;
    margin: 0;
    height: 1.6em;
  }
  .cart {
    background: #eeeeee;
    flex: 1 1 200px;

    .cart-inner {
      padding: 1em;
      position: sticky;
      top: 0;
      z-index: 80;
    }
    .h2 {
      font-weight: normal;
      font-size: 1.3em;
      margin-bottom: 0.3em;
    }
    .h3 {
      font-weight: normal;
      font-size: 1em;
    }
    .h4 {
      font-weight: normal;
      font-size: 0.9em;
      padding-left: 3em;
    }
    .value {
      text-align: right;
    }
  }
  .uploads {
    border-right: 1px solid #cccccc;
    border-left: 1px solid #cccccc;
  }
  .settings-tooltip {
    display: none;
    right: 0;
    background: #ffffff;
    box-shadow: 0 0 3px 0 rgba(0,0,0,0.5);
    position: absolute;
    padding: 0 0.4em;
    white-space: nowrap;
  }
  table th {
    text-align: left;
  }
  .notice {
    padding: 1em 0;
    color: #E53935;
  }
  .v-expansion-panel-header {
    padding: 0.7em 1em 0;
  }
  .v-expansion-panel {
    margin-bottom: 5px;
    margin-left: 1px;
  }
  .radio-image3 {
    height: 8em;
    margin-right: 1em;
    img {
      width: auto;
      height: 100%;
    }
  }
</style>
<style lang="scss">
  .image-placeholder {
    display: inline-block;
    width: 19em;
    height: 11em;
    background-color: #cccccc;
  }
</style>


<template>
  <div class="layout vertical" style="max-height: 100%;">

    <div class="flex-1" style="overflow: auto;">
      <div class="layout horizontal wrap">
        <div style="flex: 10 0 310px;">
          <div class="layout vertical wrap flex-1" v-if="data.assistant">
            <Assistant
              :id="id"
              :data="data"
              :calculated="calculated"
              :select_options="select_options"
              @calculateCloud="calculateCloud" />
          </div>
          <div class="layout vertical wrap flex-1" v-else>
            <div class="layout horizontal quote_selection">
              <div style="text-align: left; max-width: 8em; min-width: 8em;">Angebote für:</div>
              <div><v-checkbox v-model="data.has_pv_quote" @change="calculateCloud" label="Cloud/PV" style="margin: 0;" /></div>
              <div><v-checkbox v-model="data.has_roof_reconstruction_quote" @change="calculateCloud" label="Dachsanierung" style="margin: 0" /></div>
              <div><v-checkbox v-model="data.has_heating_quote" @change="addHeatingToCloud(); calculateCloud();" label="Heizung" style="margin: 0" /></div>
              <div><v-checkbox v-model="data.has_bluegen_quote" @change="calculateCloud" label="Brennstoffzellen" style="margin: 0" /></div>
            </div>
            <v-tabs class="flex-1" v-model="tab">
              <v-tab v-if="data.has_pv_quote">
                <div>
                  Cloud/PV
                  <v-icon v-if="!this.data.is_valid_cloud_pv" style="color:#D32F2F;">mdi-close</v-icon>
                  <v-icon v-if="this.data.is_valid_cloud_pv" style="color:#2E7D32;">mdi-check</v-icon>
                </div>
              </v-tab>
              <v-tab v-if="data.has_roof_reconstruction_quote">
                <div>
                  Dachsanierung
                  <v-icon v-if="!this.data.is_valid_roof" style="color:#D32F2F;">mdi-close</v-icon>
                  <v-icon v-if="this.data.is_valid_roof" style="color:#2E7D32;">mdi-check</v-icon>
                </div>
              </v-tab>
              <v-tab v-if="data.has_heating_quote">
                <div>
                  Heizung
                  <v-icon v-if="!this.data.is_valid_heating" style="color:#D32F2F;">mdi-close</v-icon>
                  <v-icon v-if="this.data.is_valid_heating" style="color:#2E7D32;">mdi-check</v-icon>
                </div>
              </v-tab>
              <v-tab v-if="data.has_bluegen_quote">
                <div>
                  Brennstoffzellen
                  <v-icon v-if="!this.data.is_valid_fuelcell" style="color:#D32F2F;">mdi-close</v-icon>
                  <v-icon v-if="this.data.is_valid_fuelcell" style="color:#2E7D32;">mdi-check</v-icon>
                </div>
              </v-tab>
              <v-tab v-if="data.has_pv_quote || data.has_heating_quote || data.has_bluegen_quote">
                <div>
                  Elektrik
                  <v-icon v-if="!this.data.is_valid_electric" style="color:#D32F2F;">mdi-close</v-icon>
                  <v-icon v-if="this.data.is_valid_electric" style="color:#2E7D32;">mdi-check</v-icon>
                </div>
              </v-tab>
              <v-tab>
                <div>
                  Kundendaten
                  <v-icon v-if="!this.data.is_valid_customer_data" style="color:#D32F2F;">mdi-close</v-icon>
                  <v-icon v-if="this.data.is_valid_customer_data" style="color:#2E7D32;">mdi-check</v-icon>
                </div>
              </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <v-tab-item key="pv" v-if="data.has_pv_quote">
                <Cloud
                  :id="id"
                  :data="data"
                  :calculated="calculated"
                  :select_options="select_options"
                  :possible_storage_sizes="possible_storage_sizes"
                  :pv_modules_selections="pv_modules_selections"
                  @calculateCloud="calculateCloud" />
              </v-tab-item>
              <v-tab-item key="roof_reconstruction" v-if="data.has_roof_reconstruction_quote">
                <Roof
                  :id="id"
                  :data="data"
                  :calculated="calculated"
                  :select_options="select_options"
                  @calculateCloud="calculateCloud" />
              </v-tab-item>
              <v-tab-item key="heating" v-if="data.has_heating_quote">
                <Heating
                  :id="id"
                  :data="data"
                  :calculated="calculated"
                  :select_options="select_options"
                  @calculateCloud="calculateCloud" />
              </v-tab-item>
              <v-tab-item key="bluegen" v-if="data.has_bluegen_quote">
                <Fuelcell
                  :id="id"
                  :data="data"
                  :calculated="calculated"
                  :select_options="select_options"
                  @calculateCloud="calculateCloud" />
              </v-tab-item>
              <v-tab-item key="electric" v-if="data.has_pv_quote || data.has_heating_quote || data.has_bluegen_quote">
                <Electric
                  :id="id"
                  :data="data"
                  :calculated="calculated"
                  :select_options="select_options"
                  @calculateCloud="calculateCloud" />
              </v-tab-item>
              <v-tab-item key="general">
                <CustomerData
                  :id="id"
                  :data="data"
                  :calculated="calculated"
                  :select_options="select_options"
                  @calculateCloud="calculateCloud" />
              </v-tab-item>
            </v-tabs-items>
          </div>
        </div>

        <div class="cart">
          <div class="cart-inner">
            <div v-if="calculated.invalid_form">
              <div style="font-size: 1.3em;">Ungültiges Formular!</div>
              <div v-for="error in calculated.errors" :key="error">
                {{ error }}
              </div>
            </div>
            <div v-if="!calculated.invalid_form">
              <div class="layout horizontal">
                <div style="font-size: 1.3em; flex: 1;">Übersicht Kosten</div>
                <div style="position: relative;">
                  <a href="#" @click="openHistoryDialog">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>
                  </a>
                  <a href="#" @click="showSettingTooltip = !showSettingTooltip">
                    <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><g><path d="M0,0h24v24H0V0z" fill="none"/><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></g></svg>
                  </a>
                  <div class="settings-tooltip" :style="showSettingTooltip && 'display: block;'" v-if="canShowInternals">
                    <v-checkbox label="Interner Modus" v-model="showInternals" />
                  </div>
                </div>
              </div>
              <div v-if="data.has_pv_quote">
                <div v-if="total_net > 0">
                  <br>
                  <hr />
                  <br>
                  <div class="h2">PV-Angebot</div>
                  <div v-if="products" class="products">
                    <v-checkbox label="Produkte anzeigen" v-model="showProducts" />
                    <table v-if="showProducts" >
                      <tr v-for="product in products" :key="product.id">
                        <td>{{ formatNumber(product.quantity, null) }}</td>
                        <td>{{ product.NAME }}</td>
                        <td class="align-right">{{ formatPrice(product.total_price) }}</td>
                      </tr>
                    </table>
                    <table>
                      <tr>
                        <td>Gesamtpreis Netto</td>
                        <td class="align-right">{{ formatPrice(total_net) }}</td>
                      </tr>
                      <tr>
                        <td>Gesamtpreis Brutto</td>
                        <td class="align-right">{{ formatPrice(total) }}</td>
                      </tr>
                    </table>
                  </div>
                </div>
                <br>
                <hr />
                <br>
                <div v-if="data.cloud_quote_type == 'synergy'">
                  <div class="h3">Synergie360 Betrag</div>
                  <div>
                    <div class="value" style="font-size: 1.2em">{{ formatPrice(calculated.synergy_monthly_today) }}</div>
                  </div>
                  <div v-if="calculated.conventional_cost_monthly_today > 0">
                    <div class="h3">mtl. Kosten ohne Synergie360-System</div>
                    <div class="value" style="color: #E53935">{{ formatPrice(calculated.conventional_cost_monthly_today) }}</div>
                  </div>
                </div>
                <div v-else>
                  <div class="h2">Cloud-Angebot</div>
                  <div v-if="data.cloud_number">
                    <div class="h2">Cloud Angebotsnummer</div>
                    <div class="value">{{ data.cloud_number }}</div>
                  </div>
                  <div class="h3">Cloud Betrag</div>
                  <div v-if="calculated.kwp_extra === 0">
                    <div class="value" style="font-size: 1.2em">{{ formatPrice(calculated.cloud_price) }}</div>
                  </div>
                  <div v-if="calculated.kwp_extra !== 0">
                    <div class="value">{{ formatPrice(calculated.cloud_price) }}</div>
                    <div class="h3" v-if="calculated.kwp_extra > 0">inkl. Mehrverbau</div>
                    <div class="h3" v-if="calculated.kwp_extra < 0">inkl. Mehrverbrauch</div>
                    <div class="value" style="font-size: 1.2em">{{ formatPrice(calculated.cloud_price_incl_refund) }}</div>
                  </div>
                  <div v-if="data.price_guarantee == '2_years' && Number(data.cloud_price_wish) > 0 && calculated.cloud_price_incl_refund > Number(data.cloud_price_wish)">
                    <div class="h3">Cloud Wunschbetrag</div>
                    <div class="value" style="font-size: 1.2em">{{ formatPrice(data.cloud_price_wish) }}</div>
                  </div>
                  <div v-if="calculated.conventional_price > 0">
                    <div class="h3">mtl. Kosten ohne Autark-System</div>
                    <div class="value" style="color: #E53935">{{ formatPrice(calculated.conventional_price) }}</div>
                  </div>
                </div>
                <br>
              </div>
              <div v-if="data.has_roof_reconstruction_quote">
                <br>
                <hr />
                <br>
                <div class="h2">Dachsanierung</div>
                <div v-if="products" class="products">
                  <v-checkbox label="Produkte anzeigen" v-model="showProductsRoofQuote" />
                  <table v-if="showProductsRoofQuote" >
                    <tr v-for="product in roof_reconstruction_quote.products" :key="product.id">
                      <td>{{ formatNumber(product.quantity, null) }}</td>
                      <td>{{ product.NAME }}</td>
                      <td class="align-right">{{ formatPrice(product.total_price) }}</td>
                    </tr>
                  </table>
                  <table>
                    <tr>
                      <td>Gesamtpreis Netto</td>
                      <td class="align-right">{{ formatPrice(roof_reconstruction_quote.total_net) }}</td>
                    </tr>
                    <tr>
                      <td>Gesamtpreis Brutto</td>
                      <td class="align-right">{{ formatPrice(roof_reconstruction_quote.total) }}</td>
                    </tr>
                  </table>
                </div>
              </div>
              <div v-if="data.has_heating_quote">
                <br>
                <hr />
                <br>
                <div class="h2">Heizungsangebot</div>
                <div v-if="products" class="products">
                  <v-checkbox label="Produkte anzeigen" v-model="showProductsHeatQuote" />
                  <table v-if="showProductsHeatQuote" >
                    <tr v-for="product in heating_quote.products" :key="product.id">
                      <td>{{ formatNumber(product.quantity, null) }}</td>
                      <td>{{ product.NAME }}</td>
                      <td class="align-right">{{ formatPrice(product.total_price) }}</td>
                    </tr>
                  </table>
                  <table>
                    <tr>
                      <td>Gesamtpreis Netto</td>
                      <td class="align-right">{{ formatPrice(heating_quote.total_net) }}</td>
                    </tr>
                    <tr>
                      <td>Gesamtpreis Brutto</td>
                      <td class="align-right">{{ formatPrice(heating_quote.total) }}</td>
                    </tr>
                  </table>
                </div>
              </div>
              <div v-if="data.has_bluegen_quote">
                <br>
                <hr />
                <br>
                <div class="h2">BlueGen-Angebot</div>
                <div v-if="products" class="products">
                  <v-checkbox label="Produkte anzeigen" v-model="showProductsBlueGenQuote" />
                  <table v-if="showProductsBlueGenQuote" >
                    <tr v-for="product in bluegen_quote.products" :key="product.id">
                      <td>{{ formatNumber(product.quantity, null) }}</td>
                      <td>{{ product.NAME }}</td>
                      <td class="align-right">{{ formatPrice(product.total_price) }}</td>
                    </tr>
                  </table>
                  <table>
                    <tr>
                      <td>Gesamtpreis Netto</td>
                      <td class="align-right">{{ formatPrice(bluegen_quote.total_net) }}</td>
                    </tr>
                    <tr>
                      <td>Gesamtpreis Brutto</td>
                      <td class="align-right">{{ formatPrice(bluegen_quote.total) }}</td>
                    </tr>
                  </table>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="actions">
        <v-btn :href="`/vue/quote_calculator/${id}?token=${$route.query.token}`" target="_blank" style="margin-right: 1em">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
        </v-btn>
        <v-btn @click="reloadProducts" style="margin-right: 1em">P</v-btn>
        <div class="kwp-bar layout horizontal" v-if="data.has_pv_quote">
          <div
            v-if="calculated.min_kwp_refresh > 0"
            :style="`background-color: #43A047; flex: 1 1 ${calculated.min_kwp_refresh / calculated.max_kwp * 100}%`">
            Refresh {{ formatNumber(calculated.min_kwp_refresh, 2) }}kWp
          </div>
          <div
            v-if="calculated.min_kwp_emove > 0"
            :style="`background-color: #0097A7; flex: 1 1 ${calculated.min_kwp_emove / calculated.max_kwp * 100}%`">
            eMove {{ formatNumber(calculated.min_kwp_emove, 2) }}kWp
          </div>
          <div
            v-if="calculated.min_kwp_light > 0"
            :style="`background-color: #FDD835; color: #333; flex: 1 1 ${calculated.min_kwp_light / calculated.max_kwp * 100}%`">
            Lichtstrom {{ formatNumber(calculated.min_kwp_light, 2) }}kWp
          </div>
          <div
            v-if="calculated.min_kwp_heatcloud > 0"
            :style="`background-color: #F4511E; flex: 1 1 ${calculated.min_kwp_heatcloud / calculated.max_kwp * 100}%`">
            Wärmecloud {{ formatNumber(calculated.min_kwp_heatcloud, 2) }}kWp
          </div>
          <div
            v-if="calculated.min_kwp_ecloud > 0"
            :style="`background-color: #F4511E; flex: 1 1 ${calculated.min_kwp_ecloud / calculated.max_kwp * 100}%`">
            eCloud {{ formatNumber(calculated.min_kwp_ecloud, 2) }}kWp
          </div>
          <div
            v-if="calculated.min_kwp_consumer > 0"
            :style="`background-color: #009688; flex: 1 1 ${calculated.min_kwp_consumer / calculated.max_kwp * 100}%`">
            Consumer {{ formatNumber(calculated.min_kwp_consumer, 2) }}kWp
          </div>
          <div
            v-if="calculated.kwp_extra > 0 && calculated.kwp_extra / calculated.max_kwp * 100 > 0.012"
            :style="`background-color: #43A047; flex: 1 1 ${calculated.kwp_extra / calculated.max_kwp * 100}%`">
            Mehrverbau {{ formatNumber(calculated.kwp_extra, 2) }}kWp
          </div>
        </div>
        <div v-if="data.has_pv_quote" style="padding-left: 0.5em">= {{ formatNumber(calculated.min_kwp, 2) }} kWp</div>
        <div class="flex-1"></div>
        <v-btn v-if="$auth.user.bitrix_department.indexOf('AEV Vertrieb GmbH') < 0" @click="adjustment_dialog = true" style="margin-left: 1em">Anpassungen</v-btn>
        <v-btn :href="mapsLink" style="margin-left: 1em" target="_blank">Maps</v-btn>
        <v-btn v-if="(!is_sent || checkCloudRights)" @click="storeOffer" :loading="loading" style="margin-left: 1em">Neues Angebot erzeugen</v-btn>
        <v-btn v-if="pdf_summary_link" @click="uploads_dialog = true" style="margin-left: 1em">Dateiuploads</v-btn>
        <v-btn v-if="pdf_quote_summary_link" @click="pdf_dialog = true" style="margin-left: 1em">PDFs</v-btn>
        <v-btn @click="links_dialog = true" style="margin-left: 1em">Links</v-btn>
        <v-btn v-if="pdf_commission_link && showInternals && $auth.user.bitrix_department.indexOf('energiezentrum-mitte EXTERN') < 0" :href="pdf_commission_link" target="_blank" style="margin-left: 1em;">Provision öffnen</v-btn>
        <!--<v-btn v-if="!is_sent && pdf_link" :disabled="form_dirty" @click.stop="openOrderConfirmDialog" style="margin-left: 1em">Verbindlich Bestellen</v-btn>-->
        <v-btn v-if="is_sent" disabled style="margin-left: 1em">Bereits bestellt</v-btn>
      </div>
    </div>

    <v-overlay v-if="loading" :value="loading">
      <div style="width: 80vw; max-width: 600px; min-width: 280px; background-color: rgba(255,255,255,0.9); border-radius: 5px; padding: 1em; color: #333; text-align: center">
        {{ this.loading_message }}
        <v-progress-linear :value="this.loading_percent" color="#1976D2"></v-progress-linear>
      </div>
    </v-overlay>

    <v-dialog
      v-model="links_dialog"
      width="500"
    >
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title >
          Links
        </v-card-title>

        <v-card-text>
          <table>
            <tr>
              <th>Link</th>
              <th>Hinweise</th>
            </tr>
            <tr>
              <td><a href="https://senec.com/de/bestellstrecke" target="_blank">Standard-Cloud</a></td>
              <td></td>
            </tr>
            <tr>
              <td><a href="https://pvspeicher.htw-berlin.de/unabhaengigkeitsrechner/" target="_blank">Autarkierechner</a></td>
              <td></td>
            </tr>
            <tr>
              <td><a href="https://mein-senec.de/auth/login" target="_blank">Speicher-Monitoring</a></td>
              <td>Zugangsdaten: demo2@senec.com / demo</td>
            </tr>
            <tr>
              <td><a href="https://monitoring.solaredge.com/solaredge-web/p/site/28898/#/dashboard" target="_blank">SolarEdge-Monitoring</a></td>
              <td></td>
            </tr>
            <tr>
              <td><a :href="`/vue/extras/cost-estimate?token=${token}`" target="_blank">Kostenrechner</a></td>
              <td></td>
            </tr>
          </table>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="links_dialog = false"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="pdf_dialog"
      width="500"
    >
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title >
          PDFs
        </v-card-title>

        <v-card-text>
          <div>
            <v-btn v-if="pdf_summary_link" :href="pdf_summary_link" target="_blank" style="margin-top: 0.5em; margin-left: 1em; margin-bottom: 0.5em">Energiekonzept öffnen</v-btn>
          </div>
          <div>
            <v-btn v-if="pdf_contract_summary_part4_file_link" :href="pdf_contract_summary_part4_file_link" target="_blank" style="margin-left: 1em; margin-bottom: 0.5em">Heizungskonzept öffnen</v-btn>
          </div>
          <div>
            <v-btn v-if="pdf_contract_summary_part4_1_file_link" :href="pdf_contract_summary_part4_1_file_link" target="_blank" style="margin-left: 1em; margin-bottom: 0.5em">Technischer Aufnahmebogen öffnen</v-btn>
          </div>
          <div>
            <v-btn v-if="pdf_quote_summary_link" :href="pdf_quote_summary_link" target="_blank" style="margin-left: 1em; margin-bottom: 0.5em">Angebote öffnen</v-btn>
          </div>
          <div>
            <v-btn v-if="pdf_contract_summary_link" :href="pdf_contract_summary_link" target="_blank" style="margin-left: 1em; margin-bottom: 0.5em">Vertragsunterlagen öffnen</v-btn>
          </div>
          <div>
            <v-btn v-if="pdf_datasheets_link" :href="pdf_datasheets_link" target="_blank" style="margin-left: 1em; margin-bottom: 0.5em">Datenblätter öffnen</v-btn>
          </div>
          <div v-if="pdf_contract_summary_part1_file_id">
            <div v-if="(new Date(quote_datetime.replace(' ', 'T'))) > (new Date()) - 60 * 60 * 1000 * 24 * 14 || id === '57224' || id === '68969' || id === '60456' || id === '39396' || id === '39772' || id === '39088' || id === '37828' || id === '43570' || id === '48766'">
              <div style="border-top: 1px solid #333; margin: 1em 0"></div>
              <div style="font-size: 1.2em">InSign Integration</div>
              <div v-if="insignData.url">
                Link: <a :href="insignData.url" target="_blank">Jetzt Unterzeichnen!</a><br>
              </div>
              <div v-if="insignData.is_sent">
                Daten wurden an {{ insignData.email }} versendet<br>
              </div>
              <div v-if="(!data.iban || !data.bic || !data.bankname || !data.birthdate)">
                Fehlende Daten bitte unter 'Kundendaten' ergänzen.
              </div>
              <div v-else class="layout horizontal center center">
                <v-btn @click="requestInsignData" :loading="insignLoading" style="margin: 0 1em 0 0">Vorort Daten abrufen</v-btn>
                <v-btn @click="sendInsignEmail" :loading="insignLoading" style="margin: 0">Per E-Mail senden</v-btn>
              </div>
            </div>
            <div v-else>
              Angebot zu alt für automatische Bearbeitung
            </div>
          </div>
          <div v-else>

            <div v-if="formsClean">
              <v-btn @click="generateContractFiles" :loading="loading" style="margin-left: 1em">Vertragsunterlagen erzeugen</v-btn>
            </div>
            <div v-else>
              <div>Unterschrift nur nach vollständiger Eingabe der Daten möglich.</div>
              {{ this.form_invalid_reason }}
            </div>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="pdf_dialog = false"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="uploads_dialog"
      width="500"
    >
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title >
          Dateiuploads
        </v-card-title>

        <v-card-text>
          <br>
          <div class="h3" v-if="data.has_pv_quote || data.has_roof_reconstruction_quote">
            <v-btn :href="data.upload_link_roof" target="_blank" style="margin-left: 1em; margin-bottom: 0.5em">Dachbilder</v-btn>
          </div>
          <div class="h3" v-if="data.has_pv_quote">
            <v-btn :href="data.upload_link_electric" target="_blank" style="margin-left: 1em; margin-bottom: 0.5em">Elektrik-Bilder</v-btn>
          </div>
          <div class="h3" v-if="data.has_heating_quote">
            <v-btn :href="data.upload_link_heating" target="_blank" style="margin-left: 1em; margin-bottom: 0.5em">Heizungsbilder</v-btn>
          </div>
          <div class="h3" v-if="data.has_pv_quote">
            <v-btn :href="data.upload_link_invoices" target="_blank" style="margin-left: 1em; margin-bottom: 0.5em">Rechnung vom bisherigem Anbieter</v-btn>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="uploads_dialog = false"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="adjustment_dialog"
      width="800"
      modal
    >
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title >
          Anpassungen
        </v-card-title>

        <v-card-text>
          <v-tabs class="flex-1" v-model="discount_tab">
            <v-tab key="pv" v-if="data.has_pv_quote">Cloud/PV</v-tab>
            <v-tab key="roof" v-if="data.has_roof_reconstruction_quote">Dachsanierung</v-tab>
            <v-tab key="heating" v-if="data.has_heating_quote">Heizung</v-tab>
            <v-tab key="bluegen" v-if="data.has_bluegen_quote">BlueGen</v-tab>
          </v-tabs>
          <v-tabs-items v-model="discount_tab">
            <v-tab-item key="pv" v-if="data.has_pv_quote">
              <br>
              <div v-if="showInternals && $auth.user.bitrix_department.indexOf('energiezentrum-mitte EXTERN') < 0">
                <h3 style="font-weight: bold;">Mehrerlös</h3>

                <div class="layout horizontal">
                  <v-text-field
                    label="in Prozent"
                    suffix="%"
                    type="number"
                    style="margin-right: 1em;"
                    v-model="data.pv_quote_price_increase_percent"
                    @input="data.pv_quote_price_increase_euro = Math.round(calculated.unchanged_total_net * (data.pv_quote_price_increase_percent / 100) * 100) / 100"
                    @blur="calculateCloud"
                  ></v-text-field>
                  <v-text-field
                    label="in Euro"
                    suffix="€"
                    type="number"
                    disabled
                    v-model="data.pv_quote_price_increase_euro"
                    @input="data.pv_quote_price_increase_percent = Math.round((data.pv_quote_price_increase_euro / calculated.unchanged_total_net) * 100 * 100) / 100"
                    @blur="calculateCloud"
                  ></v-text-field>
                </div>
              </div>

              <h3 style="font-weight: bold;">Nachlass</h3>
              <!-- <v-checkbox label="Sonderaktion Service &amp; Technik" v-model="data.pv_quote_special_offer_technik_service" @change="setSpecialOffer" /> -->
              <div class="layout horizontal">
                <v-text-field
                  label="in Prozent"
                  suffix="%" type="number"
                  style="margin-right: 1em;"
                  disabled
                  v-model="data.pv_quote_discount_percent"
                  @input="data.pv_quote_discount_euro = Math.round(calculated.discountable_subtotal_net * (data.pv_quote_discount_percent / 100) * 100) / 100"
                  @blur="calculateCloud"
                ></v-text-field>
                <v-text-field
                  label="in Euro"
                  suffix="€"
                  type="number"
                  v-model="data.pv_quote_discount_euro"
                  @input="data.pv_quote_discount_percent = Math.round((data.pv_quote_discount_euro / calculated.discountable_subtotal_net) * 100 * 100) / 100"
                  @blur="calculateCloud"
                ></v-text-field>
              </div>
              <div class="layout horizontal" style="text-align: center">
                <div class="flex">
                  <div>Alter Gesamtpreis Netto</div>
                  <div style="font-size: 2em">{{ formatPrice(calculated.after_increase_total_net) }}</div>
                </div>
                <div class="flex">
                  <div>Neuer Gesamtpreis Netto</div>
                  <div style="font-size: 2em">{{ formatPrice(total_net) }}</div>
                </div>
              </div>

              <div v-if="showInternals && $auth.user.bitrix_department.indexOf('energiezentrum-mitte EXTERN') < 0">
                <br>
                <h3 style="font-weight: bold;">Provisionskalkulation</h3>
                <br>
                <div class="layout horizontal" style="text-align: center">
                  <div class="flex">
                    <div>{{ formatNumber(calculated.effective_internal_discount_rate) }}%</div>
                    Gesamtpreis<br>
                    Provision
                  </div>
                  <div class="flex">
                    <div>Ohne Anpassungen</div>
                    {{ formatPrice(calculated.unchanged_total_net) }}<br>
                    {{ formatPrice(calculated.unchanged_commission_value) }}
                  </div>
                  <div class="flex">
                    <div>Gesamtprovision</div>
                    {{ formatPrice(calculated.commission_total_net) }}<br>
                    {{ formatPrice(calculated.commission_value) }}
                  </div>
                </div>
                <small>Kein Rechtsanspruch auf die Richtigkeit dieser Provisionsdarstellung</small>
              </div>
            </v-tab-item>
            <v-tab-item key="roof" v-if="data.has_roof_reconstruction_quote">
              <br>
              <div v-if="showInternals && $auth.user.bitrix_department.indexOf('energiezentrum-mitte EXTERN') < 0">
                <h3 style="font-weight: bold;">Mehrerlös</h3>

                <div class="layout horizontal">
                  <v-text-field
                    label="in Prozent"
                    suffix="%"
                    type="number"
                    style="margin-right: 1em;"
                    v-model="data.roof_reconstruction_quote_price_increase_percent"
                    @input="data.roof_reconstruction_quote_price_increase_euro = Math.round(roof_reconstruction_quote.calculated.unchanged_total_net * (data.roof_reconstruction_quote_price_increase_percent / 100) * 100) / 100"
                    @blur="calculateCloud"
                  ></v-text-field>
                  <v-text-field
                    label="in Euro"
                    suffix="€"
                    type="number"
                    disabled
                    v-model="data.roof_reconstruction_quote_price_increase_euro"
                    @input="data.roof_reconstruction_quote_price_increase_percent = Math.round((data.roof_reconstruction_quote_price_increase_euro / roof_reconstruction_quote.calculated.unchanged_total_net) * 100 * 100) / 100"
                    @blur="calculateCloud"
                  ></v-text-field>
                </div>
              </div>

              <h3 style="font-weight: bold;">Nachlass</h3>
              <div class="layout horizontal">
                <v-text-field
                  label="in Prozent"
                  suffix="%" type="number"
                  style="margin-right: 1em;"
                  disabled
                  v-model="data.roof_reconstruction_quote_discount_percent"
                  @input="data.roof_reconstruction_quote_discount_euro = Math.round(roof_reconstruction_quote.calculated.discountable_subtotal_net * (data.roof_reconstruction_quote_discount_percent / 100) * 100) / 100"
                  @blur="calculateCloud"
                ></v-text-field>
                <v-text-field
                  label="in Euro"
                  suffix="€"
                  type="number"
                  v-model="data.roof_reconstruction_quote_discount_euro"
                  @input="data.roof_reconstruction_quote_discount_percent = Math.round((data.roof_reconstruction_quote_discount_euro / roof_reconstruction_quote.calculated.discountable_subtotal_net) * 100 * 100) / 100"
                  @blur="calculateCloud"
                ></v-text-field>
              </div>
              <div class="layout horizontal" style="text-align: center">
                <div class="flex">
                  <div>Neuer Gesamtpreis Netto</div>
                  <div style="font-size: 2em">{{ formatPrice(roof_reconstruction_quote.calculated.after_increase_total_net) }}</div>
                </div>
                <div class="flex">
                  <div>Neuer Gesamtpreis Brutto</div>
                  <div style="font-size: 2em">{{ formatPrice(roof_reconstruction_quote.total_net) }}</div>
                </div>
              </div>

              <div v-if="showInternals && $auth.user.bitrix_department.indexOf('energiezentrum-mitte EXTERN') < 0">
                <br>
                <h3 style="font-weight: bold;">Provisionskalkulation</h3>
                <br>
                <div class="layout horizontal" style="text-align: center">
                  <div class="flex">
                    <div>{{ formatNumber(roof_reconstruction_quote.calculated.effective_internal_discount_rate) }}%</div>
                    Gesamtpreis<br>
                    Provision
                  </div>
                  <div class="flex">
                    <div>Ohne Anpassungen</div>
                    {{ formatPrice(roof_reconstruction_quote.calculated.unchanged_total_net) }}<br>
                    {{ formatPrice(roof_reconstruction_quote.calculated.unchanged_commission_value) }}
                  </div>
                  <div class="flex">
                    <div>Gesamtprovision</div>
                    {{ formatPrice(roof_reconstruction_quote.calculated.commission_total_net) }}<br>
                    {{ formatPrice(roof_reconstruction_quote.calculated.commission_value) }}
                  </div>
                </div>
                <small>Kein Rechtsanspruch auf die Richtigkeit dieser Provisionsdarstellung</small>
              </div>
            </v-tab-item>
            <v-tab-item key="heating" v-if="data.has_heating_quote">
              <br>
              <div v-if="showInternals && $auth.user.bitrix_department.indexOf('energiezentrum-mitte EXTERN') < 0">
                <h3 style="font-weight: bold;">Mehrerlös</h3>

                <div class="layout horizontal">
                  <v-text-field
                    label="in Prozent"
                    suffix="%"
                    type="number"
                    style="margin-right: 1em;"
                    v-model="data.heating_quote_price_increase_percent"
                    @input="data.heating_quote_price_increase_euro = Math.round(heating_quote.calculated.unchanged_total_net * (data.heating_quote_price_increase_percent / 100) * 100) / 100"
                    @blur="calculateCloud"
                  ></v-text-field>
                  <v-text-field
                    label="in Euro"
                    suffix="€"
                    type="number"
                    disabled
                    v-model="data.heating_quote_price_increase_euro"
                    @input="data.heating_quote_price_increase_percent = Math.round((data.heating_quote_price_increase_euro / heating_quote.calculated.unchanged_total_net) * 100 * 100) / 100"
                    @blur="calculateCloud"
                  ></v-text-field>
                </div>
              </div>

              <h3 style="font-weight: bold;">Nachlass</h3>
              <div class="layout horizontal">
                <v-text-field
                  label="in Prozent"
                  suffix="%" type="number"
                  style="margin-right: 1em;"
                  disabled
                  v-model="data.heating_quote_discount_percent"
                  @input="data.heating_quote_discount_euro = Math.round(heating_quote.calculated.discountable_subtotal_net * (data.heating_quote_discount_percent / 100) * 100) / 100"
                  @blur="calculateCloud"
                ></v-text-field>
                <v-text-field
                  label="in Euro"
                  suffix="€"
                  type="number"
                  v-model="data.heating_quote_discount_euro"
                  @input="data.heating_quote_discount_percent = Math.round((data.heating_quote_discount_euro / heating_quote.calculated.discountable_subtotal_net) * 100 * 100) / 100"
                  @blur="calculateCloud"
                ></v-text-field>
              </div>
              <div class="layout horizontal" style="text-align: center">
                <div class="flex">
                  <div>Neuer Gesamtpreis Netto</div>
                  <div style="font-size: 2em">{{ formatPrice(heating_quote.calculated.after_increase_total_net) }}</div>
                </div>
                <div class="flex">
                  <div>Neuer Gesamtpreis Brutto</div>
                  <div style="font-size: 2em">{{ formatPrice(heating_quote.total_net) }}</div>
                </div>
              </div>

              <div v-if="showInternals && $auth.user.bitrix_department.indexOf('energiezentrum-mitte EXTERN') < 0">
                <br>
                <h3 style="font-weight: bold;">Provisionskalkulation</h3>
                <br>
                <div class="layout horizontal" style="text-align: center">
                  <div class="flex">
                    <div>{{ formatNumber(heating_quote.calculated.effective_internal_discount_rate) }}%</div>
                    Gesamtpreis<br>
                    Provision
                  </div>
                  <div class="flex">
                    <div>Ohne Anpassungen</div>
                    {{ formatPrice(heating_quote.calculated.unchanged_total_net) }}<br>
                    {{ formatPrice(heating_quote.calculated.unchanged_commission_value) }}
                  </div>
                  <div class="flex">
                    <div>Gesamtprovision</div>
                    {{ formatPrice(heating_quote.calculated.commission_total_net) }}<br>
                    {{ formatPrice(heating_quote.calculated.commission_value) }}
                  </div>
                </div>
                <small>Kein Rechtsanspruch auf die Richtigkeit dieser Provisionsdarstellung</small>
              </div>
            </v-tab-item>
            <v-tab-item key="bluegen" v-if="data.has_bluegen_quote">
              <br>
              <div v-if="showInternals && $auth.user.bitrix_department.indexOf('energiezentrum-mitte EXTERN') < 0">
                <h3 style="font-weight: bold;">Mehrerlös</h3>

                <div class="layout horizontal">
                  <v-text-field
                    label="in Prozent"
                    suffix="%"
                    type="number"
                    style="margin-right: 1em;"
                    v-model="data.bluegen_quote_price_increase_percent"
                    @input="data.bluegen_quote_price_increase_euro = Math.round(bluegen_quote.calculated.unchanged_total_net * (data.bluegen_quote_price_increase_percent / 100) * 100) / 100"
                    @blur="calculateCloud"
                  ></v-text-field>
                  <v-text-field
                    label="in Euro"
                    suffix="€"
                    type="number"
                    disabled
                    v-model="data.bluegen_quote_price_increase_euro"
                    @input="data.bluegen_quote_price_increase_percent = Math.round((data.bluegen_quote_price_increase_euro / bluegen_quote.calculated.unchanged_total_net) * 100 * 100) / 100"
                    @blur="calculateCloud"
                  ></v-text-field>
                </div>
              </div>

              <h3 style="font-weight: bold;">Nachlass</h3>
              <div class="layout horizontal">
                <v-text-field
                  label="in Prozent"
                  suffix="%" type="number"
                  style="margin-right: 1em;"
                  disabled
                  v-model="data.bluegen_quote_discount_percent"
                  @input="data.bluegen_quote_discount_euro = Math.round(bluegen_quote.calculated.discountable_subtotal_net * (data.bluegen_quote_discount_percent / 100) * 100) / 100"
                  @blur="calculateCloud"
                ></v-text-field>
                <v-text-field
                  label="in Euro"
                  suffix="€"
                  type="number"
                  v-model="data.bluegen_quote_discount_euro"
                  @input="data.bluegen_quote_discount_percent = Math.round((data.bluegen_quote_discount_euro / bluegen_quote.calculated.discountable_subtotal_net) * 100 * 100) / 100"
                  @blur="calculateCloud"
                ></v-text-field>
              </div>
              <div class="layout horizontal" style="text-align: center">
                <div class="flex">
                  <div>Neuer Gesamtpreis Netto</div>
                  <div style="font-size: 2em">{{ formatPrice(bluegen_quote.calculated.after_increase_total_net) }}</div>
                </div>
                <div class="flex">
                  <div>Neuer Gesamtpreis Brutto</div>
                  <div style="font-size: 2em">{{ formatPrice(bluegen_quote.total_net) }}</div>
                </div>
              </div>

              <div v-if="showInternals && $auth.user.bitrix_department.indexOf('energiezentrum-mitte EXTERN') < 0">
                <br>
                <h3 style="font-weight: bold;">Provisionskalkulation</h3>
                <br>
                <div class="layout horizontal" style="text-align: center">
                  <div class="flex">
                    <div>{{ formatNumber(bluegen_quote.calculated.effective_internal_discount_rate) }}%</div>
                    Gesamtpreis<br>
                    Provision
                  </div>
                  <div class="flex">
                    <div>Ohne Anpassungen</div>
                    {{ formatPrice(bluegen_quote.calculated.unchanged_total_net) }}<br>
                    {{ formatPrice(bluegen_quote.calculated.unchanged_commission_value) }}
                  </div>
                  <div class="flex">
                    <div>Gesamtprovision</div>
                    {{ formatPrice(bluegen_quote.calculated.commission_total_net) }}<br>
                    {{ formatPrice(bluegen_quote.calculated.commission_value) }}
                  </div>
                </div>
                <small>Kein Rechtsanspruch auf die Richtigkeit dieser Provisionsdarstellung</small>
              </div>
            </v-tab-item>
          </v-tabs-items>

        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="adjustment_dialog = false">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="showHistoryDialog"
      width="500"
    >
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title >
          Angebotsversionen
        </v-card-title>

        <v-card-text>
          <HistorySelect ref="historySelector" :histories="histories" @refresh="reload" />
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="showHistoryDialog = false"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import HistorySelect from '~/components/quote_calculator/history_select'
import AddressForm from '~/components/address/form'
import FileUpload from '~/components/quote_calculator/fileupload'
import Cloud from '~/components/quote_calculator/quotes/cloud/index'
import Roof from '~/components/quote_calculator/quotes/roof'
import Heating from '~/components/quote_calculator/quotes/heating'
import Fuelcell from '~/components/quote_calculator/quotes/fuelcell'
import Electric from '~/components/quote_calculator/electric'
import CustomerData from '~/components/quote_calculator/customerdata'
import Assistant from '~/components/quote_calculator/assistant'

export default {

  components: {
    Cloud,
    Roof,
    Heating,
    Fuelcell,
    Electric,
    CustomerData,
    AddressForm,
    HistorySelect,
    FileUpload,
    Assistant
  },

  mounted(){
    this.$store.dispatch('quote_calculator/setUser', this.$auth.user)
    this.countModules()
    this.calculateCloud()
  },

  data(){
    return {
      "assistant": true,
      "editRoofDialog": false,
      "roofEditIndex": -1,
      "activePicker": null,
      "datepickerMenu": false,
      "datepickerMenu2": false,
      "usageCalculatorHeatingDialog": false,
      "token": "",
      "tab": 0,
      "loading_percent": 100,
      "loading_message": "",
      "discount_tab": undefined,
      "stepper": 1,
      "showSettingTooltip": false,
      "showInternals": false,
      "adjustment_dialog": false,
      "original_data": undefined,
      "form_dirty": false,
      "loading": false,
      "uploads_dialog": false,
      "pdf_dialog": false,
      "links_dialog": false,
      "confirm_order_dialog": false,
      "confirm_order_dialog_modal": false,
      "generate_wi_dialog": false,
      "order_process": false,
      "confirmData": {},
      "contact": {},
      "confirm_progress": 0,
      "min_storage_size": 0,
      "showProducts": false,
      "showProductsHeatQuote": false,
      "showProductsRoofQuote": false,
      "showProductsBlueGenQuote": false,
      "showHistoryDialog": false,
      "insignData": {},
      "extraData": {},
      rules: {
        required: value => !!value || 'Required.',
        required_for_order:  value => {
          if(this.order_process){
            return !!value || 'Required.'
          }
          return true
        },
        pv_kwp_limit: value => {
          return true
        },
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
      },
      "calculated": {
        "max_kwp": 0,
        "kwp_extra": 0,
        "min_kwp": 0,
        "min_kwp_light": 0,
        "min_kwp_heatcloud": 0,
        "min_kwp_emove": 0,
        "min_kwp_consumer": 0,
        "storage_size": 0,
        "cloud_price": 0,
        "cloud_price_incl_refund": 0,
        "cloud_price_light": 0,
        "cloud_price_heatcloud": 0,
        "cloud_price_emove": 0,
        "cloud_price_consumer": 0,
        "user_one_time_cost": 0
      },
      "products": []
    }
  },

  async asyncData({ $axios, params, route }) {
    //if(!context.$auth.user){
    //}
    const data = {
      "id": params.id,
      "deal_id": route.query.deal_id,
      "token": route.query.token,
      "loading": false,
      "quote_datetime": new Date(),
      "insignLoading": false,
      "showInternals": false,
      "form_dirty": false,
      "adjustment_dialog": false,
      "confirm_order_dialog": false,
      "generate_wi_dialog": false,
      "offer_number": "new",
      "pdf_link": undefined,
      "pdf_summary_link": undefined,
      "pdf_contract_summary_part1_file_id": undefined,
      "pdf_contract_summary_part4_file_link": undefined,
      "pdf_contract_summary_part4_1_file_link": undefined,
      "pdf_contract_summary_link": undefined,
      "pdf_datasheets_link": undefined,
      "pv_efficiancy_min": "",
      "pv_efficiancy_max": "",
      "pdf_wi_link": undefined,
      "contact": {},
      "confirm_error": "",
      "min_storage_size_options_full": [
        {'value': 5, 'label': '5 kWh'},
        {'value': 7.5, 'label': '7,5 kWh'},
        {'value': 10, 'label': '10 kWh'},
        {'value': 12.5, 'label': '12.5 kWh'},
        {'value': 15, 'label': '15 kWh'},
        {'value': 17.5, 'label': '17.5 kWh'},
        {'value': 20, 'label': '20 kWh'},
        {'value': 22.5, 'label': '22.5 kWh'},
        {'value': 25, 'label': '25 kWh'},
        {'value': 27.5, 'label': '27.5 kWh'},
        {'value': 30, 'label': '30 kWh'}
      ],
      "data": {
        "only_show_total_price": false,
        "financing_rate": 3.75,
        "financing_rate_heating": 3.75,
        "consumers": [],
        "roofs": [],
        "extra_options": ["technik_service_packet", "solaredge"],
        "extra_options_zero": [],
        "reconstruction_extra_options": [],
        "heating_quote_extra_options": [],
        "extra_offers": [],
        "address": {},
      },
      "calculated": {}
    }
    try {
      const offerData = await $axios.get(`/quote_calculator/${params.id}`)

      if(offerData) {
        if (offerData.data.data.histories) {
          data["histories"] = offerData.data.data.histories
        }
        data["pdf_summary_link"] = offerData.data.data.pdf_summary_link
        data["pdf_contract_summary_part1_file_id"] = offerData.data.data.pdf_contract_summary_part1_file_id
        data["pdf_contract_summary_part4_file_link"] = offerData.data.data.pdf_contract_summary_part4_file_link
        data["pdf_contract_summary_part4_1_file_link"] = offerData.data.data.pdf_contract_summary_part4_1_file_link
        data["pdf_commission_link"] = offerData.data.data.pdf_commission_link
        data["pdf_quote_summary_link"] = offerData.data.data.pdf_quote_summary_link
        data["pdf_contract_summary_link"] = offerData.data.data.pdf_contract_summary_link
        data["pdf_datasheets_link"] = offerData.data.data.pdf_datasheets_link
        if (offerData.data.data.pdf_order_confirmation_link) {
          data["pdf_order_confirmation_link"] = offerData.data.data.pdf_order_confirmation_link
        }else{
          data["pdf_order_confirmation_link"] = undefined
        }
        data["data"] = offerData.data.data.data
        data["assistant"] = true
        if (data["data"]["has_pv_quote"] || data["data"]["has_roof_reconstruction_quote"] || data["data"]["has_heating_quote"] || data["data"]["has_bluegen_quote"]){
          data["assistant"] = false
        }
        data["data"]["module_type"] = offerData.data.data.data["module_type"]
        if (offerData.data.data.cloud_number) {
          data["data"]["cloud_number"] = offerData.data.data.cloud_number
        }
        data["original_data"] = JSON.parse(JSON.stringify(offerData.data.data.data))
        data["calculated"] = offerData.data.data.calculated
        data["products"] = offerData.data.data.products
        data["contact"] = offerData.data.data.contact
        data["quote_datetime"] = offerData.data.data.quote_datetime
        data["roof_reconstruction_quote"] = offerData.data.data.roof_reconstruction_quote
        data["heating_quote"] = offerData.data.data.heating_quote
        if (offerData.data.data.bluegen_quote) {
          data["bluegen_quote"] = offerData.data.data.bluegen_quote
        }
        data["total_net"] = offerData.data.data.total_tax
        data["total"] = offerData.data.data.total
        data["select_options"] = offerData.data.data.select_options
        data["min_storage_size"] = offerData.data.data.calculated["min_storage_size"]
      }else{
        data["calculated"]["invalid_form"] = true
      }
    } catch (err) {
      data["calculated"]["invalid_form"] = true
      if (!data["calculated"]["errors"]) {
        data["calculated"]["errors"] = []
      }
      const result = err.response.data
      data["calculated"]["errors"].push(result.message)
    }
    return data
  },

  watch: {
    datepickerMenu (val) {
      val && setTimeout(() => (this.activePicker = 'YEAR'))
    },
    datepickerMenu2 (val) {
      val && setTimeout(() => (this.activePicker = 'YEAR'))
    },
  },

  computed: {
    formsClean () {
      if (this.data.has_pv_quote && !this.data.solaredge_designer_link) {
        this.form_invalid_reason = "Solaredge Designer Link fehlt"
        return false
      }
      if (this.data.has_pv_quote && !this.data.is_valid_cloud_pv) {
        this.form_invalid_reason = "Cloud/PV nicht vollständig"
        return false
      }
      if (this.data.has_roof_reconstruction_quote && !this.data.is_valid_roof) {
        this.form_invalid_reason = "Dachsanierung nicht vollständig"
        return false
      }
      if (this.data.has_heating_quote && !this.data.is_valid_heating) {
        this.form_invalid_reason = "Heizung nicht vollständig"
        return false
      }
      if (this.data.has_bluegen_quote && !this.data.is_valid_fuelcell) {
        this.form_invalid_reason = "Brennstoffzelle nicht vollständig"
        return false
      }
      if ((this.data.has_pv_quote || this.data.has_heating_quote || this.data.has_bluegen_quote) && !this.data.is_valid_electric) {
        this.form_invalid_reason = "Elektrik nicht vollständig"
        return false
      }
      if (!this.data.is_valid_customer_data) {
        this.form_invalid_reason = "Kundendaten nicht vollständig"
        return false
      }
      return true
    },
    checkAdminRights: function () { return this.$store.getters['quote_calculator/checkAdminRights'] },
    checkCloudRights: function () { return this.$store.getters['quote_calculator/checkCloudRights'] },
    checkBookkeepingRights: function () { return this.$store.getters['quote_calculator/checkBookkeepingRights'] },
    checkMitteRights: function () { return this.$store.getters['quote_calculator/checkMitteRights'] },
    buildyears () {
      const years = []
      for (let i=1900;i<(new Date().getFullYear());i++) {
        years.push({'value':i,'label':i})
      }
      return years
    },
    is_sent () {
      if (this.data.status_id === "WON" || this.data.status_id === "CONVERTED") {
        return true
      }
      return false
    },
    canShowInternals () {
      if (this.$auth.user.bitrix_department_ids) {
        if (this.$auth.user.bitrix_department_ids.indexOf(523) >= 0) {
          return false
        }
        if (this.$auth.user.bitrix_department_ids.indexOf(525) >= 0) {
          return false
        }
        if (this.$auth.user.bitrix_department_ids.indexOf(527) >= 0) {
          return false
        }
        if (this.$auth.user.bitrix_department_ids.indexOf(529) >= 0) {
          return false
        }
        if (this.$auth.user.bitrix_department_ids.indexOf(270) >= 0) {
          return false
        }
      }
      if (this.$auth.user.bitrix_department.indexOf('AEV Vertrieb GmbH') >= 0) {
        return false
      }
      if (this.$auth.user.bitrix_department.indexOf('T-Vertrieb (neu 2022)') >= 0) {
        return false
      }
      if (this.$auth.user.bitrix_department.indexOf('Team Schuster') >= 0) {
        return false
      }
      if (this.$auth.user.bitrix_department.indexOf('Extern IT Unterstützung') >= 0) {
        return true
      }
      return true
    },
    min_storage_size_options () {
      const sizes = this.min_storage_size_options_full.filter(option => option.value >= this.min_storage_size)
      return sizes
    },
    pv_effiancy_hint () {
      return `Mögliche Werte zwischen: ${this.pv_efficiancy_min} - ${this.pv_efficiancy_max}`
    },
    mapsLink () {
      if (!this.contact){
        return ""
      }
      return `https://www.google.com/maps/search/${this.contact.street} ${this.contact.street_nb} ${this.contact.zip} ${this.contact.city}`
    },
    pv_modules_selections () {
      if (this.checkCloudRights || this.checkBookkeepingRights){
        return this.select_options.module_type_options.concat(this.select_options.module_type_options_archive)
      }else{
        return this.select_options.module_type_options
      }
    },
    possible_storage_sizes () {
      const list = [{'value': 0 ,'label': `Automatische Auswahl`}]
      let possible_sizes = [5, 7.5, 10]
      if (this.data.cloud_quote_type == 'synergy'){
        possible_sizes = [4.2]
      }
      for(let i=8.4; i<=201.6; i=i+4.2) {
        possible_sizes.push(Math.round(i*10)/10)
      }
      let min = 5
      if (this.calculated["min_storage_size"]){
        min = this.calculated["min_storage_size"]
      }
      if (this.data.cloud_quote_type == 'synergy'){
        min = 0
      }
      possible_sizes = possible_sizes.filter(i => i >= min)
      for(let i=0; i<possible_sizes.length; i=i+1) {
        let label = `${possible_sizes[i]} kWh`
        if (possible_sizes[i] == 5 || possible_sizes[i] == 7.5 || possible_sizes[i] == 10) {
          label = `V2/V3 ${possible_sizes[i]} kWh`
        }
        list.push({'value': possible_sizes[i] ,'label': label})
      }
      return list
    }
  },

  methods: {
    async reload () {
      this.showHistoryDialog = false
      await this.$nuxt.refresh()
      this.calculateCloud()
    },
    addHeatingToCloud () {
      if (this.data.new_heating_type === 'hybrid_gas' || this.data.new_heating_type === 'gas') {
        this.data.heater_usage = this.data.heating_quote_usage_wp
        this.data.ecloud_usage = this.data.heating_quote_usage_gas
      } else {
        this.data.heater_usage = this.data.heating_quote_usage
        this.data.ecloud_usage = 0
      }
    },
    openHistoryDialog () {
      this.showHistoryDialog = !this.showHistoryDialog;
      if (this.$refs.historySelector) {
        this.$refs.historySelector.refresh()
      }
    },
    reloadProducts () {
      this.$axios.post("/quote_calculator/reload_products")
    },
    validateModules () {
    },
    setSpecialOffer () {
      console.log(this.data.pv_quote_special_offer_technik_service, this.data.extra_options.indexOf('technik_service_packet') < 0)
      if (this.data.pv_quote_special_offer_technik_service) {
        if (this.data.extra_options.indexOf('technik_service_packet') < 0) {
          this.data.extra_options.push('technik_service_packet')
        }
      }
      this.calculateCloud()
    },
    unsetSpecialOffer () {
      console.log(this.data.pv_quote_special_offer_technik_service, this.data.extra_options.indexOf('technik_service_packet') < 0)
      if (this.data.extra_options.indexOf('technik_service_packet') < 0) {
        this.data.pv_quote_special_offer_technik_service = false
      }
      this.calculateCloud()
    },
    changeKWP(){
      this.data.module_kwp = this.pv_modules_selections.find(element => element.value === this.data.module_type);
      if(this.data.module_kwp){
        this.data.pv_count_modules = Math.ceil(Number(this.data.pv_kwp) / this.data.module_kwp.kWp)
        this.changePVModules()
        this.calculateCloud()
      }
    },
    changePVModules(){
      this.data.module_kwp = this.pv_modules_selections.find(element => element.value === this.data.module_type);
    },
    countModules() {
      let possible_modules = 0
      let pv_kwp = 0
      if (!this.data.roofs) {
        this.data.roofs = []
      }
      for (let roof of this.data.roofs) {
        if(this.data.module_kwp){
          possible_modules += Number(roof.pv_count_modules)
          roof.pv_kwp_used = Number(roof.pv_count_modules) * this.data.module_kwp.kWp
          pv_kwp = pv_kwp + roof.pv_kwp_used
        }
      }
      this.data.pv_kwp = Math.round(pv_kwp * 100) / 100
      this.data.pv_count_modules = possible_modules
    },

    changeRoofDirection(){
      switch(this.data.roof_direction) {
        case 'north':
          this.pv_efficiancy_max = 600
          this.pv_efficiancy_min = 500
          break
        case 'north_west_east':
          this.pv_efficiancy_max = 750
          this.pv_efficiancy_min = 600
          break
        case 'north_south':
          this.pv_efficiancy_max = 800
          this.pv_efficiancy_min = 650
          break
        case 'west_east':
          this.pv_efficiancy_max = 900
          this.pv_efficiancy_min = 800
          break
        case 'south_west_east':
          this.pv_efficiancy_max = 950
          this.pv_efficiancy_min = 850
          break
        case 'south':
          this.pv_efficiancy_max = 1150
          this.pv_efficiancy_min = 950
          break
      }
      if(this.data.pv_efficiancy > this.pv_efficiancy_max){
        this.data.pv_efficiancy = this.pv_efficiancy_max
      }
      if(this.data.pv_efficiancy < this.pv_efficiancy_min){
        this.data.pv_efficiancy = this.pv_efficiancy_min
      }
    },
    detectChange(value, original, mainkey){
      switch(typeof value){
        case "object":
          let result = false
          if(value === undefined || value === null) {
            if (original !== undefined){
              return true
            } else {
              return false
            }
          }
          Object.keys(value).forEach(key => {
            if(original === undefined){
              result = true
            }else{
              if(this.detectChange(value[key], original[key], key) === true){
                result = true
              }
            }
          })
          return result
        default:
          if(value != original){
            return true
          }
          return false
      }
    },
    validateRoof (roof) {
      roof.is_valid = false
    },
    preventBubble (e) {
      e.stopPropagation()
    },
    formChanged(){
      if(this.original_data != undefined){
        this.form_dirty = this.detectChange(this.data, this.original_data)
      }
    },
    calculateCloud(){
      if (this.data.cloud_quote_type == 'synergy' && this.possible_storage_sizes.findIndex(element => element.value == this.data.overwrite_storage_size) < 0) {
        this.data.overwrite_storage_size = 0
      }
      this.changeRoofDirection()
      this.changePVModules()
      this.countModules()
      this.data["deal_id"] = this.deal_id
      if (this.data.financing_bank == 'energie360') {
        this.data.financing_rate = 5.09
      }
      if (this.data.financing_bank_heating == 'energie360') {
        this.data.financing_rate_heating = 5.09
      }
      if (this.data.heating_quote_people && this.data.heating_quote_people >= 5 && this.data.heating_quote_extra_options.indexOf('extra_warm_water') < 0) {
        this.data.heating_quote_extra_options.push("extra_warm_water");
      }
      this.$axios.post(`/quote_calculator/${this.id}/calculate`, this.data).then(response => {
        this.pdf_link = response.data.data.pdf_link
        this.pdf_wi_link = response.data.data.pdf_wi_link
        this.cloud_number = response.data.data.cloud_number
        this.pdf_summary_link = response.data.data.pdf_summary_link
        this.pdf_commission_link = response.data.data.pdf_commission_link
        this.pdf_datasheets_link = response.data.data.pdf_datasheets_link
        this.pdf_quote_summary_link = response.data.data.pdf_quote_summary_link
        this.pdf_contract_summary_link = response.data.data.pdf_contract_summary_link
        this.pdf_contract_summary_part1_file_id = response.data.data.pdf_contract_summary_part1_file_id
        this.pdf_contract_summary_part4_file_link = response.data.data.pdf_contract_summary_part4_file_link
        this.pdf_contract_summary_part4_1_file_link = response.data.data.pdf_contract_summary_part4_1_file_link
        this.calculated = response.data.data.calculated
        this.products = response.data.data.products
        this.roof_reconstruction_quote = response.data.data.roof_reconstruction_quote
        this.heating_quote = response.data.data.heating_quote
        this.bluegen_quote = response.data.data.bluegen_quote
        this.data = response.data.data.data
        this.total_net = response.data.data.total_net
        this.total = response.data.data.total
        this.min_storage_size = response.data.data.calculated.min_storage_size
      }).catch(err => {
        this.calculated["invalid_form"] = true
        if (!this.calculated["errors"]) {
          this.calculated["errors"] = []
        }
        const result = err.response.data
        this.calculated["errors"].push(result.message)
      })
      this.formChanged()
    },
    async storeOffer(reason){
      this.data["deal_id"] = this.deal_id
      if (this.data["has_pv_quote"]) {
        if(this.data.power_usage === undefined || this.data.power_usage === ''){
          this.$refs["power_usage"].validate(true)
          this.$refs["power_usage"].focus()
          return
        }
      }
      if (this.data["has_pv_quote"]) {
        for (let i = 0; i < this.data.roofs.length; i++) {
          if (!this.data.roofs[i].is_valid) {
            this.calculated["invalid_form"] = true
            if (!this.calculated["errors"]) {
              this.calculated["errors"] = []
            }
            this.calculated["errors"].push("Nicht alle Dachflächen korrigiert")
            return
          }
        }
      }
      this.loading = true
      try {
        this.loading_percent = 0
        this.loading_message = "Eingabedaten verarbeiten"
        const response = await this.$axios.put(`/quote_calculator/${this.id}`, this.data)
        if (response.data.status === "error") {
          this.calculated["invalid_form"] = true
          if (!this.calculated["errors"]) {
            this.calculated["errors"] = []
          }
          this.calculated["errors"].push(response.data.message)
        }
        this.data = response.data.data.data
        if (response.data.data.histories) {
          this.histories = response.data.data.histories
        }
        this.quote_datetime = response.data.data.quote_datetime
        if (response.data.data.select_options) {
          this.select_options = response.data.data.select_options
        }
        this.loading_percent = 100 / 11 * 1
        this.loading_message = "Stromverbräuche und Preissteigerungen kalkulieren"
        if (this.data["has_pv_quote"] && !['followup_quote', 'interim_quote', 'no-pv'].includes(this.data["cloud_quote_type"])) {
          const response3 = await this.$axios.put(`/quote_calculator/${this.id}/pv_pdf`, this.data)
        }
        this.loading_percent = 100 / 11 * 2
        this.loading_message = "PV Anlagen-Produktivität berechnen"
        if (this.data["has_pv_quote"]) {
          const response2 = await this.$axios.put(`/quote_calculator/${this.id}/cloud_pdfs`, this.data)
        }

        if (!['followup_quote', 'interim_quote', 'no-pv'].includes(this.data["cloud_quote_type"])) {
          this.loading_percent = 100 / 11 * 3
          this.loading_message = "Heizungs PDF erzeugen"
          if (this.data["has_heating_quote"]) {
            const response4 = await this.$axios.put(`/quote_calculator/${this.id}/heating_pdf`, this.data)
          }

          this.loading_percent = 100 / 10 * 4
          this.loading_message = "Dachsanierungs PDF erzeugen"
          if (this.data["has_roof_reconstruction_quote"]) {
            const response5 = await this.$axios.put(`/quote_calculator/${this.id}/roof_reconstruction_pdf`, this.data)
          }

          this.loading_percent = 100 / 10 * 5
          this.loading_message = "BlueGen PDF erzeugen"
          if (this.data["has_bluegen_quote"]) {
            const response_bluegen = await this.$axios.put(`/quote_calculator/${this.id}/bluegen_pdf`, this.data)
          }

          this.loading_percent = 100 / 10 * 6
          this.loading_message = "Kalkulations PDF erzeugen"
          const response_commission = await this.$axios.put(`/quote_calculator/${this.id}/commission_pdf`, this.data)
          this.pdf_commission_link = response_commission.data.data.pdf_commission_link
        } else {
          this.pdf_commission_link = undefined
        }
        this.pdf_datasheets_link = undefined
        this.pdf_contract_summary_link = undefined
        this.pdf_order_confirmation_link = undefined
        this.pdf_summary_link = undefined
        if (!['followup_quote', 'interim_quote'].includes(this.data["cloud_quote_type"])) {
          this.loading_percent = 100 / 10 * 7
          this.loading_message = "Datenblätter PDF erzeugen"
          const response7 = await this.$axios.put(`/quote_calculator/${this.id}/datasheets_pdf`, this.data)
          this.pdf_datasheets_link = response7.data.data.pdf_datasheets_link

          this.loading_percent = 100 / 10 * 8
          this.loading_message = "Angebotssammlung PDF erzeugen"
          const response6 = await this.$axios.put(`/quote_calculator/${this.id}/quote_summary_pdf`, this.data)
          this.pdf_quote_summary_link = response6.data.data.pdf_quote_summary_link

          this.loading_percent = 100 / 10 * 9
          this.loading_message = "Energiekonzept zusammenfassen"
          const response8 = await this.$axios.put(`/quote_calculator/${this.id}/summary_pdf`, this.data)
          this.pdf_summary_link = response8.data.data.pdf_summary_link
          this.pdf_contract_summary_part4_file_link = response8.data.data.pdf_contract_summary_part4_file_link
          if (response8.data.data.pdf_order_confirmation_link) {
            this.pdf_order_confirmation_link = response8.data.data.pdf_order_confirmation_link
          }
        }

        this.pdf_contract_summary_part1_file_id = undefined
        this.pdf_contract_summary_part4_1_file_link = undefined
        this.form_dirty = false
      } catch (error) {

      }
      this.loading = false
    },

    async generateContractFiles(reason){
      this.data["deal_id"] = this.deal_id
      if (this.data["has_pv_quote"]) {
        if(this.data.power_usage === undefined || this.data.power_usage === ''){
          this.$refs["power_usage"].validate(true)
          this.$refs["power_usage"].focus()
          return
        }
      }
      if (this.data["has_pv_quote"]) {
        for (let i = 0; i < this.data.roofs.length; i++) {
          if (!this.data.roofs[i].is_valid) {
            this.calculated["invalid_form"] = true
            if (!this.calculated["errors"]) {
              this.calculated["errors"] = []
            }
            this.calculated["errors"].push("Nicht alle Dachflächen korrigiert")
            return
          }
        }
      }
      this.loading = true
      try {
        this.loading_percent = 0

        if (!['followup_quote', 'interim_quote'].includes(this.data["cloud_quote_type"])) {

          this.loading_percent = 100 / 11 * 10
          this.loading_message = "Vertragsunterlagen PDF erzeugen"
          const response9 = await this.$axios.put(`/quote_calculator/${this.id}/contract_summary_pdf`, this.data)
          this.pdf_contract_summary_link = response9.data.data.pdf_contract_summary_link
          this.pdf_contract_summary_part1_file_id = response9.data.data.pdf_contract_summary_part1_file_id
          this.pdf_contract_summary_part4_1_file_link = response9.data.data.pdf_contract_summary_part4_1_file_link
        } else {
          this.pdf_datasheets_link = undefined
          this.pdf_summary_link = undefined
          this.pdf_order_confirmation_link = undefined
          this.pdf_contract_summary_link = undefined
          this.pdf_contract_summary_part1_file_id = undefined
          this.pdf_contract_summary_part4_1_file_link = undefined
        }
        this.form_dirty = false
      } catch (error) {

      }
      this.loading = false
    },
    async storeExtraData () {
      this.loading = true
      try {
        this.loading_percent = 0
        this.loading_message = "Eingabedaten verarbeiten"
        const response = await this.$axios.put(`/quote_calculator/${this.id}/extra_data`, this.data)
        this.data = response.data.data.data
        console.log(this.data)
      } catch (error) {
      }
      this.loading = false
    },
    formatPrice(number){
      return this.formatNumber(number, 2) + " €"
    },
    formatNumber(number, digits=2){
      if(number === undefined || number === ""){
        number = 0
      }
      number = Math.round(number * 100) / 100
      if (digits === null) {
        return number.toLocaleString('de-DE', {"minimumFractionDigits": 0, "maximumFractionDigits": 2})
      }
      return number.toLocaleString('de-DE', {"minimumFractionDigits": digits, "maximumFractionDigits": digits})
    },
    onProgress(percentCompleted){
      this.confirm_progress = percentCompleted
    },
    openOrderConfirmDialog(){
      let found = false
      this.order_process = true
      for (let field in this.$refs) {
        let element = this.$refs[field]
        if(Array.isArray(element)){
          element = element[0]
        }
        if(element !== undefined && element._isVue && !element.validate(true)){
          if(!found){
            element.focus()
          }
          found = true
        }
      }
      this.order_process = false
      if(!found){
        this.confirm_order_dialog = true
      }
    },
    orderOffer(){
      this.confirm_order_dialog_modal = true
      this.confirm_error = ""
      if(this.confirmData.signed_offer_pdf === undefined
        || this.confirmData.refund_transfer_pdf === undefined
        || this.confirmData.sepa_form === undefined
        || this.confirmData.old_power_invoice === undefined){
        this.confirm_error = "Alle Dateien müssen hochgeladen werden"
        return
      }
      this.confirmData.loading = true

      const formData = new FormData();
      formData.append("signed_offer_pdf", this.confirmData["signed_offer_pdf"]);
      formData.append("refund_transfer_pdf", this.confirmData["refund_transfer_pdf"]);
      formData.append("sepa_form", this.confirmData["sepa_form"]);
      formData.append("old_power_invoice", this.confirmData["old_power_invoice"]);
      if(this.confirmData["old_gas_invoice"]){
        formData.append("old_gas_invoice", this.confirmData["old_gas_invoice"]);
      }

      this.$axios.post(`/quote_calculator/offer/${this.offer_number}/upload`, formData, {
          headers: {'Content-Type': 'multipart/form-data'},
          onUploadProgress: (progressEvent) => {
            let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            this.confirm_progress = percentCompleted
            return percentCompleted;
          }
      }).then(response => {
        const data = response.data.data
        data["offer_number"] = this.offer_number
        if (data.signed_offer_pdf_id <= 0 || data.refund_transfer_pdf_id <= 0){
          this.confirm_error = "Die Dateien konnten nicht gespeichert werden."
          return
        }
        this.$axios.post("/quote_calculator/order", data).then(response => {
          this.$axios.get(`/quote_calculator/offer/${this.offer_number}`).then(response => {
            this.pdf_link = response.data.data.pdf_link
            this.pdf_summary_link = response.data.data.pdf_summary_link
            this.pdf_contract_summary_part1_file_id = response.data.data.pdf_contract_summary_part1_file_id
            this.pdf_wi_link = response.data.data.pdf_wi_link
            this.data = response.data.data.data
            this.calculated = response.data.data.calculated
          }).finally(() => {
            this.confirm_order_dialog = false
            this.confirm_order_dialog_modal = false
            this.confirmData.loading = false
          })
        }).catch(error => {
          if(error.message){
            this.confirm_error = error.message
          }
        })
      }).catch(error => {
        console.log(error)
        if(error.message){
          this.confirm_error = error.message
        }
      }).finally(() => {
          this.confirm_progress = 0
      })
    },
    async requestInsignData () {
      this.insignLoading = true
      try {
        const response = await this.$axios.post(`/quote_calculator/${this.id}/insign/data`, this.data)
        this.insignData = response.data.data
      } catch (error) {

      }
      this.insignLoading = false
    },
    async sendInsignEmail () {
      this.insignLoading = true
      try {
        const response = await this.$axios.post(`/quote_calculator/${this.id}/insign/email`, this.data)
        this.insignData = response.data.data
      } catch (error) {

      }
      this.insignLoading = false
    },
  }
}
</script>
