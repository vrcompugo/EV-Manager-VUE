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
</style>


<template>
  <div class="layout vertical" style="max-height: 100%;">

    <div class="flex-1" style="overflow: auto;">
      <div class="layout horizontal wrap">
        <div style="flex: 10 0 310px;">
          <div class="layout vertical wrap flex-1">
            <div class="layout horizontal quote_selection">
              <div style="text-align: left; max-width: 8em; min-width: 8em;">Angebote für:</div>
              <div><v-checkbox v-model="data.has_pv_quote" @change="calculateCloud" label="Cloud/PV" style="margin: 0;" /></div>
              <div><v-checkbox v-model="data.has_roof_reconstruction_quote" @change="calculateCloud" label="Dachsanierung" style="margin: 0" /></div>
              <div><v-checkbox v-model="data.has_heating_quote" @change="calculateCloud" label="Heizung" style="margin: 0" /></div>
              <div><v-checkbox v-model="data.has_bluegen_quote" @change="calculateCloud" label="BlueGen" style="margin: 0" /></div>
            </div>
            <div class="main-content flex-1">
              <div v-if="data.has_pv_quote">
                <v-stepper v-model="stepper">
                  <v-stepper-header>

                    <v-stepper-step :complete="stepper > 1" step="1" editable>
                      Verbrauchsdaten
                    </v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step :complete="stepper > 3" step="3" editable>
                      Zusatzoptionen
                    </v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step :complete="stepper > 4" step="4" editable>
                      PV-Anlage
                    </v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step step="6" editable>
                      WI-Anpassung
                    </v-stepper-step>
                  </v-stepper-header>

                  <v-stepper-items>

                    <v-stepper-content step="1">
                      <div class="layout horizontal wrap">
                        <div class="section" style="padding-bottom: 0">
                          <div class="section">
                            <h2>Verbrauch Lichtstrom</h2>
                            <div class="layout horizontal">
                              <v-text-field
                                ref="power_meter_number"
                                v-model="data.power_meter_number"
                                :rules="[rules.required_for_order]"
                                @keyup="formChanged"
                                label="Haupt Zählernummer"
                                style="margin-right: 1em"></v-text-field>
                              <div class="flex">
                                <v-text-field
                                  ref="power_usage"
                                  v-model="data.power_usage"
                                  :rules="[rules.required]"
                                  @keyup.enter="calculateCloud"
                                  @blur="calculateCloud"
                                  label="Verbrauch in kWh"
                                  class="align-right"
                                  suffix="kWh"
                                  type="number"
                                  step="1"></v-text-field>
                              </div>
                            </div>
                            <small>mehr kWh werden mit {{ formatNumber(calculated.lightcloud_extra_price_per_kwh * 100, 2) }} Cent kWh abgerechnet</small>
                          </div>
                        </div>
                        <div class="section" :disabled="true">
                          <h3>Wärmecloud</h3>
                          <small><b>Voraussetzung:</b> 2ter Zähler / Wärmezähler und Konzept 8</small>
                          <div class="layout horizontal">
                            <v-text-field
                              v-model="data.heatcloud_power_meter_number"
                              @input="formChanged"
                              label="Wärmecloud Zählernummer"
                              style="margin-right: 1em"></v-text-field>
                            <div>
                              <v-text-field v-model="data.heater_usage" @keyup.enter="calculateCloud" @blur="calculateCloud" label="Verbrauch in kWh" class="align-right" suffix="kWh" type="number" step="1"></v-text-field>
                            </div>
                          </div>
                          <small>mehr kWh werden mit {{ formatNumber(calculated.heatcloud_extra_price_per_kwh * 100, 2) }} Cent abgerechnet</small>
                        </div>
                        <div class="section" :disabled="true">
                          <h3>E.Cloud</h3>
                          <small><b>Voraussetzung:</b> Gasheizung</small>
                          <v-text-field v-model="data.ecloud_usage" @keyup.enter="calculateCloud" @blur="calculateCloud" label="Gas Verbrauch in kWh" class="align-right" suffix="kWh" type="number" step="1"></v-text-field>
                          <small>mehr kWh werden mit {{ formatNumber(calculated.ecloud_extra_price_per_kwh * 100, 2) }} Cent kWh Gas abgerechnet</small>
                        </div>
                      </div>
                    </v-stepper-content>

                    <v-stepper-content step="2">
                      <b>Dachflächen</b>
                      <div v-for="(roof, index) in data.roofs" :key="index">
                        <div class="layout horizontal center">
                          <v-text-field
                            v-model="roof.label"
                            @input="formChanged"
                            label="Bezeichnung"
                            style="flex: 0 0 12em; margin-right: 1em"></v-text-field>
                          <v-checkbox
                            label="ist Flachdach"
                            style="margin: 0 1em"
                            @change="roof.direction = 'west_east'; calculateCloud()"
                            v-model="roof.is_flat"/>
                          <v-select
                            v-if="!roof.is_flat"
                            v-model="roof.direction" :items="[
                              {'value':'north','label':'Nord'},
                              {'value':'north_west_east','label':'Nord West/Ost'},
                              {'value':'north_south','label':'Nord/Süd'},
                              {'value':'west_east','label':'West/Ost'},
                              {'value':'south_west_east','label':'Süd West/Ost'},
                              {'value':'south','label':'Süd'}
                            ]"
                            @change="calculateCloud()"
                            style="flex: 0 1 8em;"
                            item-text="label"
                            item-value="value"></v-select>
                          <v-text-field
                            v-model="roof.sqm"
                            @input="calculateCloud"
                            @blur="$refs.pv_kwp.validate(true)"
                            label="Fläche"
                            suffix="m²"
                            step="0.01"
                            type="number"
                            class="align-right"
                            style="flex: 0 0 12em; margin: 0 1em;"></v-text-field>
                          <v-text-field
                            v-model="roof.pv_count_modules"
                            @input="calculateCloud"
                            @blur="$refs.pv_kwp.validate(true)"
                            label="Anzahl Module"
                            step="1"
                            type="number"
                            class="align-right"
                            style="flex: 0 1 8em;"></v-text-field>
                          <svg @click="data.roofs.splice(index, 1); calculateCloud()" xmlns="http://www.w3.org/2000/svg" style="margin-left: 1em" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                        </div>
                      </div>
                      <div>
                        <v-btn @click="data.roofs.push({}); calculateCloud()" style="margin-right: 1em">Hinzufügen</v-btn>
                        <v-btn @click="set_max_coverage">Maximale Belegung</v-btn>
                        <v-btn @click="set_optimized_coverage">Optimierte Belegung</v-btn>
                      </div>
                    </v-stepper-content>

                    <v-stepper-content step="3">

                      <div class="section">
                        <h3>Extra Pakete</h3>
                        <div class="layout horizontal wrap">
                          <div class="flex">
                            <v-checkbox
                              label="Technik &amp; Service Paket"
                              style="margin-right: 1em"
                              @change="calculateCloud"
                              v-model="data.extra_options"
                              value="technik_service_packet" />
                          </div>
                          <!--<div class="flex">
                            <v-checkbox
                              label="e.move.ZOE"
                              style="margin-right: 1em"
                              @change="calculateCloud"
                              v-model="data.extra_options"
                              value="emove.zoe" />
                          </div>-->
                          <div class="flex">
                            <v-checkbox
                              label="Steuerliche Beratung"
                              style="margin-right: 1em"
                              @change="calculateCloud"
                              v-model="data.extra_options"
                              value="tax_consult" />
                          </div>
                          <div class="flex">
                            <v-checkbox
                              label="Wärmepumpe"
                              style="margin-right: 1em"
                              @change="calculateCloud"
                              v-model="data.extra_options"
                              value="wwwp" />
                            <div v-if="data.extra_options.indexOf('wwwp') >= 0">
                              <v-select
                                label="Variante"
                                v-model="data.extra_options_wwwp_variant" :items="[
                                  {'value':'ecoSTAR taglio 100','label':'ecoSTAR taglio 100'},
                                  {'value':'ecoSTAR taglio 180','label':'ecoSTAR taglio 180'},
                                  {'value':'ecoSTAR 310 compact','label':'ecoSTAR 310 compact'}
                                ]"
                                @input="calculateCloud"
                                style="max-width: 14em;"
                                item-text="label"
                                item-value="value"></v-select>
                            </div>
                          </div>
                          <div class="flex">
                            <v-checkbox
                              label="Solaredge"
                              style="margin-right: 1em"
                              @change="calculateCloud"
                              v-model="data.extra_options"
                              value="solaredge" />
                          </div>
                          <div class="flex">
                            <v-checkbox
                              label="Neuer Zählerschrank"
                              style="margin-right: 1em"
                              @change="calculateCloud"
                              v-model="data.extra_options"
                              value="new_power_closet" />
                          </div>
                          <div class="flex">
                            <v-checkbox
                              label="NotstromBox SENEC"
                              style="margin-right: 1em"
                              @change="calculateCloud"
                              v-model="data.extra_options"
                              value="emergency_power_box" />
                          </div>
                          <div class="flex">
                            <v-checkbox
                              label="Wallbox"
                              style="margin-right: 1em"
                              @change="calculateCloud"
                              v-model="data.extra_options"
                              value="wallbox" />
                            <div v-if="data.extra_options.indexOf('wallbox') >= 0">
                              <v-select
                                label="Variante"
                                v-model="data.extra_options_wallbox_variant" :items="[
                                  {'value':'11kW','label':'11kW Variante'},
                                  {'value':'22kW','label':'22kW Variante'}
                                ]"
                                @input="calculateCloud"
                                style="max-width: 9em;"
                                item-text="label"
                                item-value="value"></v-select>
                              <v-text-field
                                v-model="data.extra_options_wallbox_count"
                                @keyup.enter="calculateCloud"
                                @blur="calculateCloud"
                                label="Anzahl Wallboxen"
                                class="align-right"
                                style="max-width: 9em;"
                                type="number"
                                step="1"></v-text-field>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="section">
                        <h3>Extra Optionen</h3>
                        <div class="layout horizontal wrap">
                          <div class="flex">
                            <v-checkbox
                              label="Technik &amp; Service Paket"
                              style="margin-right: 1em"
                              @change="calculateCloud"
                              v-model="data.extra_options_zero"
                              value="technik_service_packet" />
                          </div>
                          <!--<div class="flex">
                            <v-checkbox
                              label="e.move.ZOE"
                              style="margin-right: 1em"
                              @change="calculateCloud"
                              v-model="data.extra_options_zero"
                              value="emove.zoe" />
                          </div>-->
                          <div class="flex">
                            <v-checkbox
                              label="Steuerliche Beratung"
                              style="margin-right: 1em"
                              @change="calculateCloud"
                              v-model="data.extra_options_zero"
                              value="tax_consult" />
                          </div>
                          <div class="flex">
                            <v-checkbox
                              label="Wärmepumpe"
                              style="margin-right: 1em"
                              @change="calculateCloud"
                              v-model="data.extra_options_zero"
                              value="wwwp" />
                            <div v-if="data.extra_options_zero.indexOf('wwwp') >= 0">
                              <v-select
                                label="Variante"
                                v-model="data.extra_options_wwwp_variant" :items="[
                                  {'value':'ecoSTAR taglio 100','label':'ecoSTAR taglio 100'},
                                  {'value':'ecoSTAR taglio 180','label':'ecoSTAR taglio 180'},
                                  {'value':'ecoSTAR 310 compact','label':'ecoSTAR 310 compact'}
                                ]"
                                @input="calculateCloud"
                                style="max-width: 14em;"
                                item-text="label"
                                item-value="value"></v-select>
                            </div>
                          </div>
                          <div class="flex">
                            <v-checkbox
                              label="Solaredge"
                              style="margin-right: 1em"
                              @change="calculateCloud"
                              v-model="data.extra_options_zero"
                              value="solaredge" />
                          </div>
                          <div class="flex">
                            <v-checkbox
                              label="Neuer Zählerschrank"
                              style="margin-right: 1em"
                              @change="calculateCloud"
                              v-model="data.extra_options_zero"
                              value="new_power_closet" />
                          </div>
                          <div class="flex">
                            <v-checkbox
                              label="NotstromBox SENEC"
                              style="margin-right: 1em"
                              @change="calculateCloud"
                              v-model="data.extra_options_zero"
                              value="emergency_power_box" />
                          </div>
                          <div class="flex">
                            <v-checkbox
                              label="Wallbox"
                              style="margin-right: 1em"
                              @change="calculateCloud"
                              v-model="data.extra_options_zero"
                              value="wallbox" />
                            <div v-if="data.extra_options_zero.indexOf('wallbox') >= 0">
                              <v-select
                                label="Variante"
                                v-model="data.extra_options_wallbox_variant" :items="[
                                  {'value':'11kW','label':'11kW Variante'},
                                  {'value':'22kW','label':'22kW Variante'}
                                ]"
                                @input="calculateCloud"
                                style="max-width: 9em;"
                                item-text="label"
                                item-value="value"></v-select>
                              <v-text-field
                                v-model="data.extra_options_wallbox_count"
                                @keyup.enter="calculateCloud"
                                @blur="calculateCloud"
                                label="Anzahl Wallboxen"
                                class="align-right"
                                style="max-width: 9em;"
                                type="number"
                                step="1"></v-text-field>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="layout horizontal wrap flex-1">
                        <div class="section">
                          <h3>Extra Consumer</h3>
                          <small>Falls eine Wärmecloud baulich nicht möglich ist, kann ein entsprechender Consumer angelegt werden.</small>
                          <div v-for="(consumer, index) in data.consumers" :key="index">
                            <div class="layout horizontal center">
                              <v-text-field
                                :ref="'consumer_power_meter_number_' + index"
                                :rules="[rules.required_for_order]"
                                v-model="consumer.power_meter_number"
                                @input="formChanged"
                                label="Consumer Zählernummer"
                                style="flex: 0 0 12em; margin-right: 1em"></v-text-field>
                              <v-text-field v-model="consumer.usage" label="Verbrauch" @keyup.enter="calculateCloud" @blur="calculateCloud" class="flex-1 align-right" suffix="kWh" type="number" step="1"></v-text-field>
                              <svg @click="data.consumers.splice(index, 1); calculateCloud()" xmlns="http://www.w3.org/2000/svg" style="margin-left: 1em" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                            </div>
                            <AddressForm
                                :ref="'consumer_address_' + index"
                                v-model="consumer.address"
                                @input="formChanged"></AddressForm>
                          </div>
                          <div class="align-right">
                            <v-btn v-if="data.consumers.length < 5" @click="data.consumers.push({'usage':0, 'address': {}}); calculateCloud()">Hinzufügen</v-btn>
                            <small v-if="data.consumers.length >= 5">Max. 3 zusätzliche Consumer</small>
                          </div>
                          <small>mehr kWh werden mit {{ formatNumber(calculated.consumercloud_extra_price_per_kwh * 100, 2) }} Cent kWh abgerechnet</small>
                        </div>

                        <div class="section">
                          <h3>eMove</h3>
                          <v-radio-group  v-model="data.emove_tarif" @change="calculateCloud">
                            <v-radio value="none">
                              <template v-slot:label>
                                Kein eMove Tarif
                              </template>
                            </v-radio>
                            <v-radio value="emove Tarif Hybrid" disabled>
                              <template v-slot:label>
                                <div class="layout horizontal">
                                  <div class="flex-1">
                                    emove Tarif Hybrid<br>
                                    <small>
                                      Tanken ausserhalb der Home Area<br>
                                      Je Tankvorgang DC oder AC 6,90€
                                    </small>
                                  </div>
                                  <div style="padding-left: 1em">mtl. 9,99€</div>
                                </div>
                              </template>
                            </v-radio>
                            <v-radio value="emove.drive I">
                              <template v-slot:label>
                                <div class="layout horizontal">
                                  <div class="flex-1">
                                    emove.drive I<br>
                                    <small>
                                      empfohlen bis ca. 8.000 km / Jahr<br>
                                      Laden Sie 500 kWh in der Home Area, und 1.000 kWh out of Home Area
                                    </small>
                                  </div>
                                  <div style="padding-left: 1em">3 kWp</div>
                                  <div style="padding-left: 1em">mtl. 9,99€</div>
                                </div>
                              </template>
                            </v-radio>
                            <v-radio value="emove.drive II">
                              <template v-slot:label>
                                <div class="layout horizontal">
                                  <div class="flex-1">
                                    emove.drive II<br>
                                    <small>
                                      empfohlen bis ca. 12.000 km / Jahr<br>
                                      Laden Sie 1.000 kWh in der Home Area, und 1.000 kWh out of Home Area
                                    </small>
                                  </div>
                                  <div style="padding-left: 1em">4 kWp</div>
                                  <div style="padding-left: 1em">mtl. 14,99€</div>
                                </div>
                              </template>
                            </v-radio>
                            <v-radio value="emove.drive III">
                              <template v-slot:label>
                                <div class="layout horizontal">
                                  <div class="flex-1">
                                    emove.drive III<br>
                                    <small>
                                      empfohlen bis ca. 20.000 km / Jahr<br>
                                      Laden Sie 2.000 kWh in der Home Area, und 3.000 kWh out of Home Area
                                    </small>
                                  </div>
                                  <div style="padding-left: 1em">6,5 kWp</div>
                                  <div style="padding-left: 1em">mtl. 19,99€</div>
                                </div>
                              </template>
                            </v-radio>
                            <v-radio value="emove.drive ALL">
                              <template v-slot:label>
                                <div class="layout horizontal">
                                  <div class="flex-1">
                                    emove.drive ALL<br>
                                    <small>
                                      empfohlen bis ca. 25.000 km / Jahr<br>
                                      Laden Sie 2.500 kWh in der Home Area, und 6.000 kWh out of Home Area
                                    </small>
                                  </div>
                                  <div style="padding-left: 1em">7 kWp</div>
                                  <div style="padding-left: 1em">mtl. 39,99€</div>
                                </div>
                              </template>
                            </v-radio>
                          </v-radio-group>
                        </div>
                      </div>
                    </v-stepper-content>
                    <v-stepper-content step="4">
                      <div class="section">
                        <h2>PV-Anlage</h2>

                        <div class="layout vertical flex-1">
                          <div>
                            <small>
                              Benötigte PV-Anlage
                            </small>
                            <div class="kwp-bar layout horizontal">
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
                          </div>
                          <div>
                            <small>
                              geplante PV-Anlage
                            </small>
                            <div class="kwp-bar layout horizontal">
                              <div
                                v-if="Number(data.pv_kwp) > 0"
                                :style="`background-color: #43A047; flex: 1 1 ${Number(data.pv_kwp) / calculated.max_kwp * 100}%`">
                                PV-Anlage {{ formatNumber(data.pv_kwp, 2)}}kWp</div>
                              <div
                                v-if="Number(data.pv_kwp) === 0 || data.pv_kwp === undefined || data.pv_kwp === ''"
                                :style="`background-color: #43A047; flex: 1 1 100%`">
                                Benötigte PV-Anlage {{ formatNumber(calculated.min_kwp, 2)}}kWp</div>
                              <div
                                v-if="calculated.kwp_extra < 0 && calculated.kwp_extra / calculated.max_kwp * -100 > 0.012"
                                :style="`background-color: #E53935; flex: 1 1 ${calculated.kwp_extra / calculated.max_kwp * -100}%`">
                                Minderverbau {{ formatNumber(-calculated.kwp_extra, 2) }}kWp
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="layout horizontal">
                          <v-select
                            label="Modulart"
                            v-model="data.module_type" :items="select_options.module_type_options"
                            @change="changeKWP"
                            style="flex: 0 1 8em; margin-right: 1em;"
                            item-text="label"
                            item-value="value"></v-select>
                          <v-text-field
                            v-model="data.pv_count_modules"
                            disabled="disabled"
                            @input="changePVModules"
                            @blur="calculateCloud"
                            label="Anzahl Module"
                            class="flex-1 align-right"
                            style="margin-right: 1em;"
                            type="number"
                            step="1"></v-text-field>
                          <v-text-field
                            ref="pv_kwp"
                            v-model="data.pv_kwp"
                            @blur="changeKWP"
                            label="geplante Größe"
                            class="flex-1 align-right"
                            suffix="kWp"
                            type="number"
                            step="0.01"></v-text-field>
                          <v-text-field
                            v-model="data.pv_sqm"
                            disabled="disabled"
                            label="benötigte Dachfläche"
                            class="flex-1 align-right"
                            style="margin-left: 1em;"
                            suffix="m²"
                            type="number"
                            step="0.01"></v-text-field>
                          <v-select
                            v-model="data.investment_type" :items="[
                              {'value':'financing','label':'Finanzierung'},
                              {'value':'cash','label':'Barkauf'}
                            ]"
                            @input="formChanged"
                            style="flex: 0 1 10em; margin-left: 1em;"
                            item-text="label"
                            item-value="value"></v-select>
                        </div>
                        <b>Dachflächen</b>

                        <div v-for="(roof, index) in data.roofs" :key="index">
                          <div class="layout horizontal center">
                            <v-text-field
                              v-model="roof.label"
                              @input="formChanged"
                              label="Bezeichnung"
                              style="flex: 0 0 12em; margin-right: 1em"></v-text-field>
                            <v-checkbox
                              label="ist Flachdach"
                              style="margin: 0 1em"
                              @change="roof.direction = 'west_east'; calculateCloud()"
                              v-model="roof.is_flat"/>
                            <v-select
                              v-if="!roof.is_flat"
                              v-model="roof.direction" :items="[
                                {'value':'north','label':'Nord'},
                                {'value':'north_west_east','label':'Nord West/Ost'},

                                {'value':'west_east','label':'West/Ost'},
                                {'value':'south_west_east','label':'Süd West/Ost'},
                                {'value':'south','label':'Süd'}
                              ]"
                              @change="calculateCloud()"
                              style="flex: 0 1 8em;"
                              item-text="label"
                              item-value="value"></v-select>
                            <v-text-field
                              v-model="roof.sqm"
                              @input="validateModules"
                              label="Fläche"
                              suffix="m²"
                              step="0.01"
                              type="number"
                              class="align-right"
                              style="flex: 0 0 12em; margin: 0 1em;"></v-text-field>
                            <v-text-field
                              :ref="`roof_v_count_modules_${index}`"
                              v-model="roof.pv_count_modules"
                              @input="countModules"
                              label="Anzahl Module"
                              step="1"
                              type="number"
                              class="align-right"
                              style="flex: 0 1 8em;"></v-text-field>
                            <svg @click="data.roofs.splice(index, 1); calculateCloud()" xmlns="http://www.w3.org/2000/svg" style="margin-left: 1em" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                          </div>
                        </div>
                        <div>
                          <v-btn @click="addRoof" style="margin-right: 1em">Hinzufügen</v-btn>
                          <v-btn @click="set_max_coverage">Maximale Belegung</v-btn>
                          <v-btn @click="set_optimized_coverage">Cloud Belegung</v-btn>
                          <v-btn @click="set_zero_coverage">ZERO Belegung</v-btn>
                        </div>

                      </div>
                    </v-stepper-content>

                    <!--<v-stepper-content step="5">
                      <div class="layout horizontal wrap">
                        <div class="section" style="padding-bottom: 0">
                          <div class="section">
                            <h2>Verbrauch Lichtstrom</h2>
                            <div class="layout horizontal">
                              <v-text-field
                                ref="power_meter_number"
                                v-model="data.power_meter_number"
                                :rules="[rules.required_for_order]"
                                @keyup="formChanged"
                                label="Haupt Zählernummer"
                                style="margin-right: 1em"></v-text-field>
                              <div class="flex">
                                <v-text-field
                                  ref="power_usage"
                                  v-model="data.power_usage"
                                  :rules="[rules.required]"
                                  @keyup.enter="calculateCloud"
                                  @blur="calculateCloud"
                                  label="Verbrauch in kWh"
                                  class="align-right"
                                  suffix="kWh"
                                  type="number"
                                  step="1"></v-text-field>
                                <small>mehr kWh werden mit {{ formatNumber(calculated.lightcloud_extra_price_per_kwh * 100, 2) }} Cent kWh abgerechnet</small>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="section" :disabled="true">
                            <h3>Wärmecloud</h3>
                            <small><b>Voraussetzung:</b> 2ter Zähler / Wärmezähler und Konzept 8</small>
                            <div class="layout horizontal">
                              <v-text-field
                                v-model="data.heatcloud_power_meter_number"
                                @input="formChanged"
                                label="Wärmecloud Zählernummer"
                                style="margin-right: 1em"></v-text-field>
                              <div>
                                <v-text-field v-model="data.heater_usage" @keyup.enter="calculateCloud" @blur="calculateCloud" label="Verbrauch in kWh" class="align-right" suffix="kWh" type="number" step="1"></v-text-field>
                                <small>mehr kWh werden mit {{ formatNumber(calculated.heatcloud_extra_price_per_kwh * 100, 2) }} Cent abgerechnet</small>
                              </div>
                            </div>
                          </div>
                          <div class="section" :disabled="true">
                            <h3>E.Cloud</h3>
                            <small><b>Voraussetzung:</b> Gasheizung</small>
                            <v-text-field v-model="data.ecloud_usage" @keyup.enter="calculateCloud" @blur="calculateCloud" label="Gas Verbrauch in kWh" class="align-right" suffix="kWh" type="number" step="1"></v-text-field>
                            <small>mehr kWh werden mit {{ formatNumber(calculated.ecloud_extra_price_per_kwh * 100, 2) }} Cent kWh Gas abgerechnet</small>
                          </div>

                      </div>
                      <div class="section" style="padding-bottom: 0">

                        <div class="section">
                          <h3>Extra Pakete</h3>
                          <div class="layout horizontal wrap">
                            <div class="flex">
                              <v-checkbox
                                label="Technik &amp; Service Paket"
                                style="margin-right: 1em"
                                @change="calculateCloud"
                                v-model="data.extra_options"
                                value="technik_service_packet" />
                            </div>
                            <div class="flex">
                              <v-checkbox
                                label="Wärmepumpe"
                                style="margin-right: 1em"
                                @change="calculateCloud"
                                v-model="data.extra_options"
                                value="wwwp" />
                              <div v-if="data.extra_options.indexOf('wwwp') >= 0">
                                <v-select
                                  label="Variante"
                                  v-model="data.extra_options_wwwp_variant" :items="[
                                    {'value':'ecoSTAR taglio 100','label':'ecoSTAR taglio 100'},
                                    {'value':'ecoSTAR taglio 180','label':'ecoSTAR taglio 180'},
                                    {'value':'ecoSTAR 310 compact','label':'ecoSTAR 310 compact'}
                                  ]"
                                  @input="calculateCloud"
                                  style="max-width: 14em;"
                                  item-text="label"
                                  item-value="value"></v-select>
                              </div>
                            </div>
                            <div class="flex">
                              <v-checkbox
                                label="Solaredge"
                                style="margin-right: 1em"
                                @change="calculateCloud"
                                v-model="data.extra_options"
                                value="solaredge" />
                            </div>
                            <div class="flex">
                              <v-checkbox
                                label="Neuer Zählerschrank"
                                style="margin-right: 1em"
                                @change="calculateCloud"
                                v-model="data.extra_options"
                                value="new_power_closet" />
                            </div>
                            <div class="flex">
                              <v-checkbox
                                label="NotstromBox SENEC"
                                style="margin-right: 1em"
                                @change="calculateCloud"
                                v-model="data.extra_options"
                                value="emergency_power_box" />
                            </div>
                            <div class="flex">
                              <v-checkbox
                                label="Wallbox"
                                style="margin-right: 1em"
                                @change="calculateCloud"
                                v-model="data.extra_options"
                                value="wallbox" />
                              <div v-if="data.extra_options.indexOf('wallbox') >= 0">
                                <v-select
                                  label="Variante"
                                  v-model="data.extra_options_wallbox_variant" :items="[
                                    {'value':'11kW','label':'11kW Variante'},
                                    {'value':'22kW','label':'22kW Variante'}
                                  ]"
                                  @input="calculateCloud"
                                  style="max-width: 9em;"
                                  item-text="label"
                                  item-value="value"></v-select>
                                <v-text-field
                                  v-model="data.extra_options_wallbox_count"
                                  @keyup.enter="calculateCloud"
                                  @blur="calculateCloud"
                                  label="Anzahl Wallboxen"
                                  class="align-right"
                                  style="max-width: 9em;"
                                  type="number"
                                  step="1"></v-text-field>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="layout horizontal wrap flex-1">
                          <div class="section">
                            <h3>Extra Consumer</h3>
                            <small>Falls eine Wärmecloud baulich nicht möglich ist, kann ein entsprechender Consumer angelegt werden.</small>
                            <div v-for="(consumer, index) in data.consumers" :key="index">
                              <div class="layout horizontal center">
                                <v-text-field
                                  :ref="'consumer_power_meter_number_' + index"
                                  :rules="[rules.required_for_order]"
                                  v-model="consumer.power_meter_number"
                                  @input="formChanged"
                                  label="Consumer Zählernummer"
                                  style="flex: 0 0 12em; margin-right: 1em"></v-text-field>
                                <v-text-field v-model="consumer.usage" label="Verbrauch" @keyup.enter="calculateCloud" @blur="calculateCloud" class="flex-1 align-right" suffix="kWh" type="number" step="1"></v-text-field>
                                <svg @click="data.consumers.splice(index, 1); calculateCloud()" xmlns="http://www.w3.org/2000/svg" style="margin-left: 1em" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                              </div>
                              <AddressForm
                                  :ref="'consumer_address_' + index"
                                  v-model="consumer.address"
                                  @input="formChanged"></AddressForm>
                            </div>
                            <div class="align-right">
                              <v-btn v-if="data.consumers.length < 5" @click="data.consumers.push({'usage':0, 'address': {}}); calculateCloud()">Hinzufügen</v-btn>
                              <small v-if="data.consumers.length >= 5">Max. 3 zusätzliche Consumer</small>
                            </div>
                            <small>mehr kWh werden mit {{ formatNumber(calculated.consumercloud_extra_price_per_kwh * 100, 2) }} Cent kWh abgerechnet</small>
                          </div>

                          <div class="section">
                            <h3>eMove</h3>
                            <v-radio-group  v-model="data.emove_tarif" @change="calculateCloud">
                              <v-radio value="none">
                                <template v-slot:label>
                                  Kein eMove Tarif
                                </template>
                              </v-radio>
                              <v-radio value="emove Tarif Hybrid" disabled>
                                <template v-slot:label>
                                  <div class="layout horizontal">
                                    <div class="flex-1">
                                      emove Tarif Hybrid<br>
                                      <small>
                                        Tanken ausserhalb der Home Area<br>
                                        Je Tankvorgang DC oder AC 6,90€
                                      </small>
                                    </div>
                                    <div style="padding-left: 1em">mtl. 9,99€</div>
                                  </div>
                                </template>
                              </v-radio>
                              <v-radio value="emove.drive I">
                                <template v-slot:label>
                                  <div class="layout horizontal">
                                    <div class="flex-1">
                                      emove.drive I<br>
                                      <small>
                                        empfohlen bis ca. 8.000 km / Jahr<br>
                                        Laden Sie 500 kWh in der Home Area, und 1.000 kWh out of Home Area
                                      </small>
                                    </div>
                                    <div style="padding-left: 1em">3 kWp</div>
                                    <div style="padding-left: 1em">mtl. 9,99€</div>
                                  </div>
                                </template>
                              </v-radio>
                              <v-radio value="emove.drive II">
                                <template v-slot:label>
                                  <div class="layout horizontal">
                                    <div class="flex-1">
                                      emove.drive II<br>
                                      <small>
                                        empfohlen bis ca. 12.000 km / Jahr<br>
                                        Laden Sie 1.000 kWh in der Home Area, und 1.000 kWh out of Home Area
                                      </small>
                                    </div>
                                    <div style="padding-left: 1em">4 kWp</div>
                                    <div style="padding-left: 1em">mtl. 14,99€</div>
                                  </div>
                                </template>
                              </v-radio>
                              <v-radio value="emove.drive III">
                                <template v-slot:label>
                                  <div class="layout horizontal">
                                    <div class="flex-1">
                                      emove.drive III<br>
                                      <small>
                                        empfohlen bis ca. 20.000 km / Jahr<br>
                                        Laden Sie 2.000 kWh in der Home Area, und 3.000 kWh out of Home Area
                                      </small>
                                    </div>
                                    <div style="padding-left: 1em">6,5 kWp</div>
                                    <div style="padding-left: 1em">mtl. 19,99€</div>
                                  </div>
                                </template>
                              </v-radio>
                              <v-radio value="emove.drive ALL">
                                <template v-slot:label>
                                  <div class="layout horizontal">
                                    <div class="flex-1">
                                      emove.drive ALL<br>
                                      <small>
                                        empfohlen bis ca. 25.000 km / Jahr<br>
                                        Laden Sie 2.500 kWh in der Home Area, und 6.000 kWh out of Home Area
                                      </small>
                                    </div>
                                    <div style="padding-left: 1em">7 kWp</div>
                                    <div style="padding-left: 1em">mtl. 39,99€</div>
                                  </div>
                                </template>
                              </v-radio>
                            </v-radio-group>
                          </div>
                        </div>
                      </div>
                      <div class="section">
                        <h2>PV-Anlage</h2>

                        <div class="layout vertical flex-1">
                          <div>
                            <small>
                              Benötigte PV-Anlage
                            </small>
                            <div class="kwp-bar layout horizontal">
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
                          </div>
                          <div>
                            <small>
                              geplante PV-Anlage
                            </small>
                            <div class="kwp-bar layout horizontal">
                              <div
                                v-if="Number(data.pv_kwp) > 0"
                                :style="`background-color: #43A047; flex: 1 1 ${Number(data.pv_kwp) / calculated.max_kwp * 100}%`">
                                PV-Anlage {{ formatNumber(data.pv_kwp, 2)}}kWp</div>
                              <div
                                v-if="Number(data.pv_kwp) === 0 || data.pv_kwp === undefined || data.pv_kwp === ''"
                                :style="`background-color: #43A047; flex: 1 1 100%`">
                                Benötigte PV-Anlage {{ formatNumber(calculated.min_kwp, 2)}}kWp</div>
                              <div
                                v-if="calculated.kwp_extra < 0 && calculated.kwp_extra / calculated.max_kwp * -100 > 0.012"
                                :style="`background-color: #E53935; flex: 1 1 ${calculated.kwp_extra / calculated.max_kwp * -100}%`">
                                Minderverbau {{ formatNumber(-calculated.kwp_extra, 2) }}kWp
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="layout horizontal">
                          <v-select
                            label="Modulart"
                            v-model="data.module_type" :items="select_options.module_type_options"
                            @change="changeKWP"
                            style="flex: 0 1 8em; margin-right: 1em;"
                            item-text="label"
                            item-value="value"></v-select>
                          <v-text-field
                            v-model="data.pv_count_modules"
                            disabled="disabled"
                            @input="changePVModules"
                            @blur="calculateCloud"
                            label="Anzahl Module"
                            class="flex-1 align-right"
                            style="margin-right: 1em;"
                            type="number"
                            step="1"></v-text-field>
                          <v-text-field
                            ref="pv_kwp"
                            v-model="data.pv_kwp"
                            @blur="changeKWP"
                            label="geplante Größe"
                            class="flex-1 align-right"
                            :rules="[rules.pv_kwp_limit]"
                            suffix="kWp"
                            type="number"
                            step="0.01"></v-text-field>
                          <v-text-field
                            v-model="data.pv_sqm"
                            disabled="disabled"
                            label="benötigte Dachfläche"
                            class="flex-1 align-right"
                            style="margin-left: 1em;"
                            suffix="m²"
                            type="number"
                            step="0.01"></v-text-field>
                          <v-select
                            v-model="data.investment_type" :items="[
                              {'value':'financing','label':'Finanzierung'},
                              {'value':'cash','label':'Barkauf'}
                            ]"
                            @input="formChanged"
                            style="flex: 0 1 10em; margin-left: 1em;"
                            item-text="label"
                            item-value="value"></v-select>
                        </div>
                        <b>Dachflächen</b>

                        <div v-for="(roof, index) in data.roofs" :key="index">
                          <div class="layout horizontal center">
                            <v-text-field
                              v-model="roof.label"
                              @input="formChanged"
                              label="Bezeichnung"
                              style="flex: 0 0 12em; margin-right: 1em"></v-text-field>
                            <v-checkbox
                              label="ist Flachdach"
                              style="margin: 0 1em"
                              @change="roof.direction = 'west_east'; calculateCloud()"
                              v-model="roof.is_flat"/>
                            <v-select
                              v-if="!roof.is_flat"
                              v-model="roof.direction" :items="[
                                {'value':'north','label':'Nord'},
                                {'value':'north_west_east','label':'Nord West/Ost'},
                                {'value':'north_south','label':'Nord/Süd'},
                                {'value':'west_east','label':'West/Ost'},
                                {'value':'south_west_east','label':'Süd West/Ost'},
                                {'value':'south','label':'Süd'}
                              ]"
                              @change="calculateCloud()"
                              style="flex: 0 1 8em;"
                              item-text="label"
                              item-value="value"></v-select>
                            <v-text-field
                              v-model="roof.sqm"
                              @input="calculateCloud"
                              @blur="$refs.pv_kwp.validate(true)"
                              label="Fläche"
                              suffix="m²"
                              step="0.01"
                              type="number"
                              class="align-right"
                              style="flex: 0 0 12em; margin: 0 1em;"></v-text-field>
                            <v-text-field
                              v-model="roof.pv_count_modules"
                              @input="calculateCloud"
                              @blur="$refs.pv_kwp.validate(true)"
                              label="Anzahl Module"
                              step="1"
                              type="number"
                              class="align-right"
                              style="flex: 0 1 8em;"></v-text-field>
                            <svg @click="data.roofs.splice(index, 1); calculateCloud()" xmlns="http://www.w3.org/2000/svg" style="margin-left: 1em" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                          </div>
                        </div>
                        <div>
                          <v-btn @click="addRoof" style="margin-right: 1em">Hinzufügen</v-btn>
                          <v-btn @click="set_max_coverage">Maximale Belegung</v-btn>
                          <v-btn @click="set_optimized_coverage">Cloud Belegung</v-btn>
                        </div>

                      </div>

                      <div class="section">
                        <h2>Anpassungen WI</h2>
                        <div
                          class="layout horizontal"
                          style="padding-top: 2em">
                          <div class="flex">
                            <v-slider
                              v-model="data.price_increase_rate"
                              @input="formChanged"
                              min="4.75"
                              max="7.75"
                              step="0.25"
                              thumb-label="always"></v-slider>
                            <div style="margin-top: -1em; padding-left: 0.5em">Preissteigerung</div>
                          </div>
                          <div class="flex">
                            <v-slider
                              v-model="data.inflation_rate"
                              @input="formChanged"
                              min="1.5"
                              max="3.5"
                              step="0.25"
                              thumb-label="always"></v-slider>
                            <div style="margin-top: -1em; padding-left: 0.5em">Inflation</div>
                          </div>
                        </div>
                        <br>
                        <div class="layout horizontal">
                          <v-text-field
                            ref="conventional_power_usage_per_year"
                            v-model="data.conventional_power_usage_per_year"
                            @input="calculatePowerCost('usage')"
                            @blur="calculateCloud"
                            label="Stromverbrauch lt. Rechnung/Jahr"
                            class="align-right"
                            :rules="[rules.required]"
                            suffix="kWh"
                            type="number"
                            step="0.01"
                            style="margin-right: 1em"></v-text-field>
                          <v-text-field
                            ref="conventional_power_cost_per_year"
                            v-model="data.conventional_power_cost_per_year"
                            @input="calculatePowerCost('cost_year')"
                            @blur="calculateCloud"
                            :rules="[rules.required]"
                            label="Butto Stromkosten lt. Rechnung/Jahr"
                            class="align-right"
                            suffix="€"
                            type="number"
                            step="0.01"
                            style="margin-right: 1em"></v-text-field>
                          <v-text-field
                            v-model="data.conventional_power_cost_per_kwh"
                            @input="calculatePowerCost('cost_kwh')"
                            @blur="calculateCloud"
                            label="Strompreis pro kWh"
                            class="align-right"
                            suffix="Cent"
                            type="number"
                            disabled
                            step="0.5"></v-text-field>
                        </div>
                        <div v-if="data.heater_usage > 0">
                          <br>
                          <div class="layout horizontal">
                            <v-text-field
                              ref="conventional_heat_usage_per_year"
                              v-model="data.conventional_heat_usage_per_year"
                              @input="calculateHeatCost('usage')"
                              @blur="calculateCloud"
                              label="Wärmestromverbrauch lt. Rechnung/Jahr"
                              class="align-right"
                              :rules="[rules.required]"
                              suffix="kWh"
                              type="number"
                              step="0.01"
                              style="margin-right: 1em"></v-text-field>
                            <v-text-field
                              ref="conventional_heat_cost_per_year"
                              v-model="data.conventional_heat_cost_per_year"
                              @input="calculateHeatCost('cost_year')"
                              @blur="calculateCloud"
                              label="Butto Wärmestromkosten lt. Rechnung/Jahr"
                              class="align-right"
                              :rules="[rules.required]"
                              suffix="€"
                              type="number"
                              step="0.01"
                              style="margin-right: 1em"></v-text-field>
                            <v-text-field
                              ref="gas_usage"
                              v-model="data.conventional_heat_cost_per_kwh"
                              @input="calculateHeatCost('cost_kwh')"
                              @blur="calculateCloud"
                              label="Wärmestrompreis pro kWh"
                              class="align-right"
                              suffix="Cent"
                              type="number"
                              disabled
                              step="0.5"></v-text-field>
                          </div>
                        </div>
                        <div v-if="data.ecloud_usage > 0">
                          <br>
                          <div class="layout horizontal">
                            <v-text-field
                              ref="conventional_gas_usage_per_year"
                              v-model="data.conventional_gas_usage_per_year"
                              @input="calculateGasCost('usage')"
                              @blur="calculateCloud"
                              label="Gasverbrauch lt. Rechnung/Jahr"
                              class="align-right"
                              :rules="[rules.required]"
                              suffix="kWh"
                              type="number"
                              step="0.01"
                              style="margin-right: 1em"></v-text-field>
                            <v-text-field
                              ref="conventional_gas_cost_per_year"
                              v-model="data.conventional_gas_cost_per_year"
                              @input="calculateGasCost('cost_year')"
                              @blur="calculateCloud"
                              label="Butto Gaskosten lt. Rechnung/Jahr"
                              class="align-right"
                              :rules="[rules.required]"
                              suffix="€"
                              type="number"
                              step="0.01"
                              style="margin-right: 1em"></v-text-field>
                            <v-text-field
                              ref="gas_usage"
                              v-model="data.conventional_gas_cost_per_kwh"
                              @input="calculateGasCost('cost_kwh')"
                              @blur="calculateCloud"
                              label="Gaspreis pro kWh"
                              class="align-right"
                              suffix="Cent"
                              type="number"
                              disabled
                              step="0.5"></v-text-field>
                          </div>
                        </div>
                      </div>
                    </v-stepper-content>-->

                    <v-stepper-content step="6">
                      <div class="section">
                        <h2>Anpassungen WI</h2>
                        <div
                          class="layout horizontal"
                          style="padding-top: 2em">
                          <div class="flex">
                            <v-slider
                              v-model="data.price_increase_rate"
                              @input="formChanged"
                              min="4.75"
                              max="7.75"
                              step="0.25"
                              thumb-label="always"></v-slider>
                            <div style="margin-top: -1em; padding-left: 0.5em">Preissteigerung</div>
                          </div>
                          <div class="flex">
                            <v-slider
                              v-model="data.inflation_rate"
                              @input="formChanged"
                              min="1.5"
                              max="3.5"
                              step="0.25"
                              thumb-label="always"></v-slider>
                            <div style="margin-top: -1em; padding-left: 0.5em">Inflation</div>
                          </div>
                          <div class="flex">
                            <v-slider
                              v-model="data.financing_rate"
                              @input="formChanged"
                              min="0"
                              max="5"
                              step="0.01"
                              thumb-label="always"></v-slider>
                            <div style="margin-top: -1em; padding-left: 0.5em">Finanzierungs Zinssatz</div>
                          </div>
                          <div class="flex">
                            <v-slider
                              v-model="data.runtime"
                              @input="formChanged"
                              min="30"
                              max="35"
                              step="5"
                              thumb-label="always"></v-slider>
                            <div style="margin-top: -1em; padding-left: 0.5em">Prognose für </div>
                          </div>
                        </div>
                        <br>
                        <div class="layout horizontal">
                          <v-text-field
                            ref="conventional_power_usage_per_year"
                            v-model="data.conventional_power_usage_per_year"
                            @input="calculatePowerCost('usage')"
                            @blur="calculateCloud"
                            label="Stromverbrauch lt. Rechnung/Jahr"
                            class="align-right"
                            :rules="[rules.required]"
                            suffix="kWh"
                            type="number"
                            step="0.01"
                            style="margin-right: 1em"></v-text-field>
                          <v-text-field
                            ref="conventional_power_cost_per_year"
                            v-model="data.conventional_power_cost_per_year"
                            @input="calculatePowerCost('cost_year')"
                            @blur="calculateCloud"
                            :rules="[rules.required]"
                            label="Butto Stromkosten lt. Rechnung/Jahr"
                            class="align-right"
                            suffix="€"
                            type="number"
                            step="0.01"
                            style="margin-right: 1em"></v-text-field>
                          <v-text-field
                            v-model="data.conventional_power_cost_per_kwh"
                            @input="calculatePowerCost('cost_kwh')"
                            @blur="calculateCloud"
                            label="Strompreis pro kWh"
                            class="align-right"
                            suffix="Cent"
                            type="number"
                            disabled
                            step="0.5"></v-text-field>
                        </div>
                        <div v-if="data.heater_usage > 0">
                          <br>
                          <div class="layout horizontal">
                            <v-text-field
                              ref="conventional_heat_usage_per_year"
                              v-model="data.conventional_heat_usage_per_year"
                              @input="calculateHeatCost('usage')"
                              @blur="calculateCloud"
                              label="Wärmestromverbrauch lt. Rechnung/Jahr"
                              class="align-right"
                              :rules="[rules.required]"
                              suffix="kWh"
                              type="number"
                              step="0.01"
                              style="margin-right: 1em"></v-text-field>
                            <v-text-field
                              ref="conventional_heat_cost_per_year"
                              v-model="data.conventional_heat_cost_per_year"
                              @input="calculateHeatCost('cost_year')"
                              @blur="calculateCloud"
                              label="Butto Wärmestromkosten lt. Rechnung/Jahr"
                              class="align-right"
                              :rules="[rules.required]"
                              suffix="€"
                              type="number"
                              step="0.01"
                              style="margin-right: 1em"></v-text-field>
                            <v-text-field
                              ref="gas_usage"
                              v-model="data.conventional_heat_cost_per_kwh"
                              @input="calculateHeatCost('cost_kwh')"
                              @blur="calculateCloud"
                              label="Wärmestrompreis pro kWh"
                              class="align-right"
                              suffix="Cent"
                              type="number"
                              disabled
                              step="0.5"></v-text-field>
                          </div>
                        </div>
                        <div v-if="data.ecloud_usage > 0">
                          <br>
                          <div class="layout horizontal">
                            <v-text-field
                              ref="conventional_gas_usage_per_year"
                              v-model="data.conventional_gas_usage_per_year"
                              @input="calculateGasCost('usage')"
                              @blur="calculateCloud"
                              label="Gasverbrauch lt. Rechnung/Jahr"
                              class="align-right"
                              :rules="[rules.required]"
                              suffix="kWh"
                              type="number"
                              step="0.01"
                              style="margin-right: 1em"></v-text-field>
                            <v-text-field
                              ref="conventional_gas_cost_per_year"
                              v-model="data.conventional_gas_cost_per_year"
                              @input="calculateGasCost('cost_year')"
                              @blur="calculateCloud"
                              label="Butto Gaskosten lt. Rechnung/Jahr"
                              class="align-right"
                              :rules="[rules.required]"
                              suffix="€"
                              type="number"
                              step="0.01"
                              style="margin-right: 1em"></v-text-field>
                            <v-text-field
                              ref="gas_usage"
                              v-model="data.conventional_gas_cost_per_kwh"
                              @input="calculateGasCost('cost_kwh')"
                              @blur="calculateCloud"
                              label="Gaspreis pro kWh"
                              class="align-right"
                              suffix="Cent"
                              type="number"
                              disabled
                              step="0.5"></v-text-field>
                          </div>
                        </div>
                      </div>
                    </v-stepper-content>
                  </v-stepper-items>
                </v-stepper>
                <br>
                <br>
              </div>
              <div v-if="data.has_roof_reconstruction_quote">
                <div class="section">
                  <h2>Dachsanierung</h2>
                  <div class="layout horizontal wrap">
                    <v-text-field
                      v-model="data.reconstruction_sqm"
                      @blur="calculateCloud"
                      label="zu sanierende Dachfläche"
                      class="align-right"
                      suffix="m²"
                      type="number"
                      step="0.01"
                      style="margin-left: 1em"></v-text-field>
                    <v-select
                      label="Dachtyp"
                      v-model="data.reconstruction_roof_type" :items="[
                        {'value':'flat','label':'Flachdach'},
                        {'value':'saddle','label':'Satteldach'}
                      ]"
                      @input="calculateCloud"
                      style="margin-left: 1em"
                      item-text="label"
                      item-value="value"></v-select>
                    <v-checkbox
                      label="mit Dämmung"
                      style="margin-left: 1em"
                      @change="calculateCloud"
                      v-model="data.reconstruction_extra_options"
                      value="with_insulation" />
                    <v-checkbox
                      label="Asbest Entsorgung einrechnen"
                      style="margin-left: 1em"
                      @change="calculateCloud"
                      v-model="data.reconstruction_extra_options"
                      value="with_asbest_removable" />
                  </div>
                </div>
              </div>
              <div v-if="data.has_heating_quote">
                <div class="section">
                  <h2>Heizungsanlage</h2>
                  <div class="layout horizontal wrap">
                    <v-select
                      label="Alter Heizungstyp"
                      v-model="data.old_heating_type" :items="[
                        {'value':'flat','label':'Gas'},
                        {'value':'oil','label':'Öl'},
                        {'value':'heatpump','label':'Wärmepumpe'},
                        {'value':'pellez','label':'Pellet'},
                        {'value':'electro','label':'Elektro'},
                        {'value':'nightofen','label':'Nachtspeicheröfen'},
                        {'value':'other','label':'Sonstige'},
                      ]"
                      @input="calculateCloud"
                      style="margin-left: 1em"
                      item-text="label"
                      item-value="value"></v-select>
                    <v-select
                      label="Gewünschter Heizungstyp"
                      v-model="data.new_heating_type" :items="[
                        {'value':'oil','label':'Öl'},
                        {'value':'gas','label':'Gas'},
                        {'value':'heatpump','label':'Wärmepumpe'}
                      ]"
                      @input="calculateCloud"
                      style="margin-left: 1em"
                      item-text="label"
                      item-value="value"></v-select>
                    <v-text-field
                      v-model="data.heating_quote_usage"
                      @blur="calculateCloud"
                      label="Verbrauch in der letzten Heizperiode"
                      class="align-right"
                      suffix="kWh"
                      type="number"
                      step="0.01"
                      style="margin-left: 1em"></v-text-field>
                    <v-text-field
                      v-model="data.heating_quote_sqm"
                      @blur="calculateCloud"
                      label="Zu beheizende Fläche"
                      class="align-right"
                      suffix="m²"
                      type="number"
                      step="0.01"
                      style="margin-left: 1em"></v-text-field>
                    <v-checkbox
                      label="Solarthermie anbieten"
                      style="margin-left: 1em"
                      @change="calculateCloud"
                      v-model="data.heating_quote_extra_options"
                      value="solarthermie" />
                  </div>
                  <div class="layout horizontal wrap">
                    <v-select
                      label="Baujahr Haus (Dämmwert)"
                      v-model="data.heating_quote_house_build" :items="[
                        {'value':'1940-196','label':'1940-1969'},
                        {'value':'1970-1979','label':'1970-1979'},
                        {'value':'1980-1999','label':'1980-1999'},
                        {'value':'2000-2015','label':'2000-2015'},
                        {'value':'2016 und neuer','label':'2016 und neuer'}
                      ]"
                      @input="calculateCloud"
                      style="margin-left: 1em"
                      item-text="label"
                      item-value="value"></v-select>
                    <v-select
                      label="Heizkörpertyp"
                      v-model="data.heating_quote_radiator_type" :items="[
                        {'value':'floor_heating','label':'Fussbodenheizug ausschliesslich'},
                        {'value':'mixed','label':'Fussbodenheizung und Heizkörper'},
                        {'value':'radiator_heating','label':'Nur Heizkörper'}
                      ]"
                      @input="calculateCloud"
                      style="margin-left: 1em"
                      item-text="label"
                      item-value="value"></v-select>
                    <v-select
                      label="Warmwasser Aufbereitung"
                      v-model="data.heating_quote_warm_water_type" :items="[
                        {'value':'heater','label':'Heizung macht Warmwasser'},
                        {'value':'separate','label':'Warmwasser wird derzeit anders hergestellt'}
                      ]"
                      @input="calculateCloud"
                      style="margin-left: 1em"
                      item-text="label"
                      item-value="value"></v-select>
                  </div>
                </div>
              </div>
              <div v-if="data.has_bluegen_quote">
                <h2>BlueGen Brennstoffzellen</h2>
                <v-text-field
                  v-model="data.bluegen_cell_count"
                  @keyup="calculateCloud"
                  label="Anzahl Brennstoffzellen"
                  style="margin-right: 1em"></v-text-field>
                <v-checkbox v-model="data.add_bluegen_storage" @change="calculateCloud" label="Mit Multifunktionsspeicher" style="margin: 0" />
              </div>

              <div>
                <div class="section">
                  <h2>Allgemeine Angaben</h2>
                  <v-checkbox
                    label="Nur Gesamtpreis in Angeboten anzeigen"
                    style="margin-left: 1em"
                    v-model="data.only_show_total_price" />
                  <v-text-field
                    v-model="data.extra_notes"
                    label="ergänzende Angaben für den Innendienst"
                    hint="Diese Eingabe wird nicht im Vertrag zu sehen sein, hier kann eine Information für den Innendienst eingestellt werden"></v-text-field>
                  <v-text-field
                    v-if="data.has_pv_quote"
                    v-model="data.special_conditions_pv_quote"
                    label="Sonderkonditionen PV-Angebot im Kaufvertrag/Angebot sichtbar"
                    hint="Vereinbarungen sind im Kaufvertrag/Angebot sichtbar"></v-text-field>
                  <v-text-field
                    v-if="data.has_heating_quote"
                    v-model="data.special_conditions_heating_quote"
                    label="Sonderkonditionen Heizungsangebot im Kaufvertrag/Angebot sichtbar"
                    hint="Vereinbarungen sind im Kaufvertrag/Angebot sichtbar"></v-text-field>
                  <v-text-field
                    v-if="data.has_roof_reconstruction_quote"
                    v-model="data.special_conditions_roof_reconstruction_quote"
                    label="Sonderkonditionen Dachsanierungsangebot im Kaufvertrag/Angebot sichtbar"
                    hint="Vereinbarungen sind im Kaufvertrag/Angebot sichtbar"></v-text-field>
                  <v-text-field
                    v-if="data.has_bluegen_quote"
                    v-model="data.special_conditions_bluegen_quote"
                    label="Sonderkonditionen Dachsanierungsangebot im Kaufvertrag/Angebot sichtbar"
                    hint="Vereinbarungen sind im Kaufvertrag/Angebot sichtbar"></v-text-field>
                </div>
              </div>
            </div>
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
              <div style="font-size: 1.3em;">Übersicht Kosten</div>
              <div v-if="data.has_pv_quote">
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
                <br>
                <hr />
                <br>
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
        <v-btn v-if="pdf_order_confirmation_link && checkBookkeepingRights()" :href="pdf_order_confirmation_link" style="margin-left: 1em" target="_blank">Auftragsbestätigung</v-btn>
        <v-btn :href="mapsLink" style="margin-left: 1em" target="_blank">Maps</v-btn>
        <v-btn v-if="!is_sent && !pdf_link" @click="storeOffer" :loading="loading" style="margin-left: 1em">Neues Angebot erzeugen</v-btn>
        <v-btn v-if="pdf_summary_link" @click="uploads_dialog = true" style="margin-left: 1em">Dateiuploads</v-btn>
        <v-btn v-if="pdf_summary_link" @click="pdf_dialog = true" style="margin-left: 1em">PDFs</v-btn>
        <v-btn v-if="!is_sent && pdf_link" :disabled="form_dirty" @click.stop="openOrderConfirmDialog" style="margin-left: 1em">Verbindlich Bestellen</v-btn>
        <v-btn v-if="is_sent" disabled style="margin-left: 1em">Bereits bestellt</v-btn>
      </div>
    </div>

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
            <v-btn v-if="pdf_quote_summary_link" :href="pdf_quote_summary_link" target="_blank" style="margin-left: 1em; margin-bottom: 0.5em">Angebote öffnen</v-btn>
          </div>
          <div>
            <v-btn v-if="pdf_contract_summary_link" :href="pdf_contract_summary_link" target="_blank" style="margin-left: 1em; margin-bottom: 0.5em">Vertragsunterlagen öffnen</v-btn>
          </div>
          <div>
            <v-btn v-if="pdf_datasheets_link" :href="pdf_datasheets_link" target="_blank" style="margin-left: 1em; margin-bottom: 0.5em">Datenblätter öffnen</v-btn>
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
          <div class="h3">
            <v-btn :href="data.upload_link_contract" target="_blank" style="margin-left: 1em; margin-bottom: 0.5em">Vertragsunterlagen</v-btn>
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
      v-model="confirm_order_dialog"
      width="500"
      :modal="confirm_order_dialog_modal"
    >
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title >
          Verbindlich Bestellen
        </v-card-title>

        <v-card-text>
          <ConfirmOrderDialog v-model="confirmData" :data="data" :error="confirm_error" :progress="confirm_progress" :loading="confirmData.loading"></ConfirmOrderDialog>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="secondary"
            text
            @click="confirm_order_dialog = false"
          >
            Abbrechen
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="orderOffer"
            :disabled="confirmData.loading"
            :loading="confirmData.loading"
          >
            Verbindlich Bestellen
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import AddressForm from '~/components/address/form'

export default {

  components: {
    AddressForm
  },

  mounted(){
    this.calculateCloud()
  },

  data(){
    return {
      "stepper": 1,
      "original_data": undefined,
      "form_dirty": false,
      "loading": false,
      "uploads_dialog": false,
      "pdf_dialog": false,
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
      rules: {
        required: value => !!value || 'Required.',
        required_for_order:  value => {
          if(this.order_process){
            return !!value || 'Required.'
          }
          return true
        },
        pv_kwp_limit: value => {
          let max_sqm = 0
          this.data.roofs.forEach(roof => max_sqm += Number(roof.sqm))
          return max_sqm >= Number(this.data.pv_sqm) || "Größe der Anlage durch Dachfläche nicht begrenzt."
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

  async asyncData({ $axios, params }) {
    //if(!context.$auth.user){
    //}
    const data = {
      "id": params.id,
      "loading": false,
      "form_dirty": false,
      "confirm_order_dialog": false,
      "generate_wi_dialog": false,
      "offer_number": "new",
      "pdf_link": undefined,
      "pdf_summary_link": undefined,
      "pdf_contract_summary_link": undefined,
      "pdf_datasheets_link": undefined,
      "pv_efficiancy_min": "",
      "pv_efficiancy_max": "",
      "pdf_wi_link": undefined,
      "is_sent": false,
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
        "financing_rate": 3.79,
        "consumers": [],
        "roofs": [],
        "extra_options": [],
        "extra_options_zero": [],
        "reconstruction_extra_options": [],
        "heating_quote_extra_options": [],
        "extra_offers": [],
        "address": {}
      },
      "calculated": {}
    }
    try {
      const offerData = await $axios.get(`/quote_calculator/${params.id}`)

      if(offerData) {
        data["pdf_summary_link"] = offerData.data.data.pdf_summary_link
        data["pdf_quote_summary_link"] = offerData.data.data.pdf_quote_summary_link
        data["pdf_contract_summary_link"] = offerData.data.data.pdf_contract_summary_link
        data["pdf_datasheets_link"] = offerData.data.data.pdf_datasheets_link
        if (offerData.data.data.pdf_order_confirmation_link) {
          data["pdf_order_confirmation_link"] = offerData.data.data.pdf_order_confirmation_link
        }
        data["is_sent"] = offerData.data.data.is_sent
        data["data"] = offerData.data.data.data
        data["data"]["module_type"] = offerData.data.data.data["module_type"]
        if (offerData.data.data.cloud_number) {
          data["data"]["cloud_number"] = offerData.data.data.cloud_number
        }
        data["original_data"] = JSON.parse(JSON.stringify(offerData.data.data.data))
        data["calculated"] = offerData.data.data.calculated
        data["products"] = offerData.data.data.products
        data["contact"] = offerData.data.data.contact
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

  computed: {
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
    }
  },

  methods: {
    checkBookkeepingRights(){
      let result = false
      const departments = ["Innendienst", "After Sales ???", "After Sales Neu", "Buchhaltung", "Extern IT Unterstützung", "KeSO"]
      for(let i=0; i<departments.length; i++){
        if (this.$auth.user.bitrix_department.indexOf(departments[i]) >= 0){
          return true
        }
      }
      return false
    },
    reloadProducts () {
      this.$axios.post("/quote_calculator/reload_products")
    },
    validateModules () {
    },
    addRoof() {
      this.data.roofs.push({ direction: 'west_east' })
      if (this.data.roofs.length > 3){
        if (this.data.extra_options.indexOf('solaredge') < 0) {
          this.data.extra_options.push('solaredge')
        }
      }
      this.calculateCloud()
    },
    changeKWP(){
      this.data.module_kwp = this.select_options.module_type_options.find(element => element.value === this.data.module_type);
      if(this.data.module_kwp){
        this.data.pv_count_modules = Math.ceil(Number(this.data.pv_kwp) / this.data.module_kwp.kWp)
        this.changePVModules()
        this.calculateCloud()
      }
    },
    changePVModules(){
      this.data.module_kwp = this.select_options.module_type_options.find(element => element.value === this.data.module_type);
      if(this.data.module_kwp){
        this.data.pv_kwp = Math.round(Number(this.data.pv_count_modules) * this.data.module_kwp.kWp * 100) / 100
        this.data.pv_sqm = Math.round(Number(this.data.pv_count_modules) * Number(this.data.module_kwp.qm) * 100) / 100
      }
    },
    countModules() {
      let possible_modules = 0
      for (let roof of this.data.roofs) {
        possible_modules += Number(roof.pv_count_modules)
      }
      this.data.pv_count_modules = possible_modules
      this.changePVModules()
      this.calculateCloud()
    },
    set_max_coverage () {
      this.data.module_kwp = this.select_options.module_type_options.find(element => element.value === this.data.module_type);
      let possible_modules = 0
      for (let roof of this.data.roofs) {
        let flat_multiplicator = 1
        if (roof.is_flat) {
          flat_multiplicator = 0.925
        }
        roof.pv_count_modules = Math.floor(Number(roof.sqm) / (Number(this.data.module_kwp.qm) * flat_multiplicator))
        possible_modules += roof.pv_count_modules
      }
      this.data.pv_count_modules = possible_modules
      this.changePVModules()
      this.calculateCloud()
    },
    set_optimized_coverage () {
      this.data.module_kwp = this.select_options.module_type_options.find(element => element.value === this.data.module_type);
      let needed_pv_count_modules = Math.ceil(Number(this.calculated.min_kwp) / this.data.module_kwp.kWp)
      let possible_modules = 0
      for (let roof of this.data.roofs) {
        let flat_multiplicator = 1
        if (roof.is_flat) {
          flat_multiplicator = 0.925
        }
        roof.pv_count_modules = Math.floor(Number(roof.sqm) / (Number(this.data.module_kwp.qm) * flat_multiplicator))
        if (possible_modules + roof.pv_count_modules > needed_pv_count_modules) {
          roof.pv_count_modules = needed_pv_count_modules - possible_modules
          possible_modules = needed_pv_count_modules
          break
        } else {
          possible_modules += roof.pv_count_modules
        }
      }
      this.data.pv_count_modules = possible_modules
      this.changePVModules()
      this.calculateCloud()
    },
    set_zero_coverage () {
      this.data.module_kwp = this.select_options.module_type_options.find(element => element.value === this.data.module_type);
      let needed_pv_count_modules = Math.ceil(Number(this.calculated.min_zero_kwp) / this.data.module_kwp.kWp)
      let possible_modules = 0
      for (let roof of this.data.roofs) {
        let flat_multiplicator = 1
        if (roof.is_flat) {
          flat_multiplicator = 0.925
        }
        roof.pv_count_modules = Math.floor(Number(roof.sqm) / (Number(this.data.module_kwp.qm) * flat_multiplicator))
        if (possible_modules + roof.pv_count_modules > needed_pv_count_modules) {
          roof.pv_count_modules = needed_pv_count_modules - possible_modules
          possible_modules = needed_pv_count_modules
          break
        } else {
          possible_modules += roof.pv_count_modules
        }
      }
      this.data.pv_count_modules = possible_modules
      this.changePVModules()
      this.calculateCloud()
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
    calculatePowerCost(trigger){
      switch(trigger){
        case 'usage':
        case 'cost_year':
          if(Number(this.data.conventional_power_cost_per_year) > 0 && Number(this.data.conventional_power_usage_per_year) > 0){
            this.data.conventional_power_cost_per_kwh = Math.round((this.data.conventional_power_cost_per_year / this.data.conventional_power_usage_per_year * 100) * 100) / 100
          }
          break
        case 'cost_kwh':
          if(Number(this.data.conventional_power_cost_per_year) > 0){
            this.data.conventional_power_usage_per_year = Math.round(this.data.conventional_power_cost_per_year / (this.data.conventional_power_cost_per_kwh / 100))
          }
          break
      }
    },
    calculateHeatCost(trigger){
      switch(trigger){
        case 'usage':
        case 'cost_year':
          if(Number(this.data.conventional_heat_cost_per_year) > 0 && Number(this.data.conventional_heat_usage_per_year) > 0){
            this.data.conventional_heat_cost_per_kwh = Math.round((this.data.conventional_heat_cost_per_year / this.data.conventional_heat_usage_per_year * 100) * 100) / 100
          }
          break
        case 'cost_kwh':
          if(Number(this.data.conventional_heat_cost_per_year) > 0){
            this.data.conventional_heat_usage_per_year = Math.round(this.data.conventional_heat_cost_per_year / (this.data.conventional_heat_cost_per_kwh / 100))
          }
          break
      }
    },
    calculateGasCost(trigger){
      switch(trigger){
        case 'usage':
        case 'cost_year':
          if(Number(this.data.conventional_gas_cost_per_year) > 0 && Number(this.data.conventional_gas_usage_per_year) > 0){
            this.data.conventional_gas_cost_per_kwh = Math.round((this.data.conventional_gas_cost_per_year / this.data.conventional_gas_usage_per_year * 100) * 100) / 100
          }
          break
        case 'cost_kwh':
          if(Number(this.data.conventional_gas_cost_per_year) > 0){
            this.data.conventional_gas_usage_per_year = Math.round(this.data.conventional_gas_cost_per_year / (this.data.conventional_gas_cost_per_kwh / 100))
          }
          break
      }
    },
    detectChange(value, original, mainkey){
      switch(typeof value){
        case "object":
          let result = false
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
    formChanged(){
      if(this.original_data != undefined){
        this.form_dirty = this.detectChange(this.data, this.original_data)
      }
    },
    calculateCloud(){
      this.changeRoofDirection()
      this.changePVModules()
      this.$axios.post(`/quote_calculator/${this.id}/calculate`, this.data).then(response => {
        this.calculated = response.data.data.calculated
        this.products = response.data.data.products
        this.roof_reconstruction_quote = response.data.data.roof_reconstruction_quote
        this.heating_quote = response.data.data.heating_quote
        this.bluegen_quote = response.data.data.bluegen_quote
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
      if(this.data.power_usage === undefined || this.data.power_usage === ''){
        this.$refs["power_usage"].validate(true)
        this.$refs["power_usage"].focus()
        return
      }
      this.loading = true
      try {
        const response = await this.$axios.put(`/quote_calculator/${this.id}`, this.data)
        this.data = response.data.data.data

        if (this.data["has_pv_quote"]) {
          const response3 = await this.$axios.put(`/quote_calculator/${this.id}/pv_pdf`, this.data)
          const response2 = await this.$axios.put(`/quote_calculator/${this.id}/cloud_pdfs`, this.data)
        }

        if (this.data["has_heating_quote"]) {
          const response4 = await this.$axios.put(`/quote_calculator/${this.id}/heating_pdf`, this.data)
        }

        if (this.data["has_roof_reconstruction_quote"]) {
          const response5 = await this.$axios.put(`/quote_calculator/${this.id}/roof_reconstruction_pdf`, this.data)
        }

        if (this.data["has_bluegen_quote"]) {
          const response_bluegen = await this.$axios.put(`/quote_calculator/${this.id}/bluegen_pdf`, this.data)
        }

        const response6 = await this.$axios.put(`/quote_calculator/${this.id}/quote_summary_pdf`, this.data)
        this.pdf_quote_summary_link = response6.data.data.pdf_quote_summary_link

        const response7 = await this.$axios.put(`/quote_calculator/${this.id}/datasheets_pdf`, this.data)
        this.pdf_datasheets_link = response7.data.data.pdf_datasheets_link

        const response8 = await this.$axios.put(`/quote_calculator/${this.id}/summary_pdf`, this.data)
        this.pdf_summary_link = response8.data.data.pdf_summary_link
        if (response8.data.data.pdf_order_confirmation_link) {
          this.pdf_order_confirmation_link = response8.data.data.pdf_order_confirmation_link
        }

        if (this.data["has_pv_quote"]) {
          const response9 = await this.$axios.put(`/quote_calculator/${this.id}/contract_summary_pdf`, this.data)
          this.pdf_contract_summary_link = response9.data.data.pdf_contract_summary_link
        }
        this.form_dirty = false
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
            this.pdf_wi_link = response.data.data.pdf_wi_link
            this.is_sent = response.data.data.is_sent
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
    }
  }
}
</script>
