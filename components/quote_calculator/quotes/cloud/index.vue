<template>
  <div class="main-content flex-1">
    <div v-if="data">
      <v-stepper v-model="stepper">
        <v-stepper-header>

          <v-stepper-step :complete="stepper > 1" step="1" editable>
            Verbrauchsdaten
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="stepper > 2" step="2" editable v-if="!['followup_quote', 'interim_quote'].includes(data['cloud_quote_type'])">
            Finanzierung
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

          <v-stepper-step :complete="stepper > 5" step="5" editable>
            Bilder
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step step="6" editable v-if="!['followup_quote', 'interim_quote'].includes(data['cloud_quote_type'])">
            WI-Anpassung
          </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>

          <v-stepper-content step="1">
            <Usage
              :id="id"
              :data="data"
              :calculated="calculated"
              :select_options="select_options" />
          </v-stepper-content>

          <v-stepper-content step="2">
            <Financing
              :id="id"
              :data="data"
              :calculated="calculated"
              :select_options="select_options" />
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
                  <div v-if="data.extra_options.indexOf('technik_service_packet') >= 0">
                    <!--<v-checkbox
                      label="Service, Technik &amp; Garantie Paket Winter Highlight"
                      style="margin-right: 1em"
                      @change="calculateCloud"
                      v-model="data.extra_options"
                      value="technik_service_packet_autumn_extra" />
                    <v-checkbox
                      label="Service, Technik &amp; Garantie Paket Frühlings Highlight"
                      style="margin-right: 1em"
                      @change="calculateCloud"
                      v-model="data.extra_options"
                      value="technik_service_packet_spring_extra" />-->
                  </div>
                </div>
                <!--<div class="flex">
                  <v-checkbox
                    label="E.MW Upgrade"
                    style="margin-right: 1em"
                    @change="calculateCloud"
                    v-model="data.extra_options"
                    value="emw" />
                </div>
                <div class="flex">
                  <v-checkbox
                    label="e.move.ZOE"
                    style="margin-right: 1em"
                    @change="calculateCloud"
                    v-model="data.extra_options"
                    value="emove.zoe" />
                </div>
                <div class="flex">
                  <v-checkbox
                    label="Steuerliche Beratung"
                    style="margin-right: 1em"
                    @change="calculateCloud"
                    v-model="data.extra_options"
                    value="tax_consult" />
                </div>-->
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
                        {'value':'NIBE L','label':'L'},
                        {'value':'NIBE XL','label':'XL'}
                      ]"
                      @input="calculateCloud"
                      style="max-width: 14em;"
                      item-text="label"
                      item-value="value"></v-select>
                    <div v-if="data.extra_options_wwwp_variant == 'Nibe L'">mind. Deckenhöhe 1,80 Meter und Maximal für 4 Personen</div>
                    <div v-if="data.extra_options_wwwp_variant == 'Nibe XL'">Decknhöhe mind. 2,10 Meter und Maximal für 6 Personen</div>
                  </div>
                </div>
                <div class="flex">
                  <v-checkbox
                    label="Solaredge"
                    style="margin-right: 1em"
                    @change="calculateCloud"
                    v-model="data.extra_options"
                    value="solaredge"
                    disabled />
                </div>
                <div class="flex">
                  <v-checkbox
                    label="Neuer Zählerschrank"
                    style="margin-right: 1em"
                    @change="calculateCloud"
                    v-model="data.extra_options"
                    value="new_power_closet" />
                    <div v-if="data.extra_options.indexOf('new_power_closet') >= 0">
                      <v-select
                        label="Anzahl Zählerfelder"
                        v-model="data.extra_options_new_power_closet_size" :items="[
                          {'value':'2','label':'2 Zählerfelder'},
                          {'value':'3','label':'3 Zählerfelder'},
                          {'value':'4','label':'4 Zählerfelder'}
                        ]"
                        @input="calculateCloud"
                        style="max-width: 14em;"
                        item-text="label"
                        item-value="value"></v-select>
                    </div>
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
                        {'value':'11kW','label':'Heidelberg ECO Home 11 kw (nicht förderfähig)', disabled: true},
                        {'value':'control-11kW','label':'Heidelberg Energy Control 11 kW', disabled: true},
                        {'value':'senec-pro-11kW','label':'Wallbox SENEC pro S (11kW)'},
                        {'value':'senec-22kW','label':'Wallbox SENEC 22kW Pro', disabled: true}
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
                <div class="flex">
                  <v-checkbox
                    label="Kein Cloud Angebot"
                    style="margin-right: 1em"
                    @change="calculateCloud"
                    v-model="data.no_cloud" />
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
                    label="E.MW Upgrade"
                    style="margin-right: 1em"
                    @change="calculateCloud"
                    v-model="data.extra_options_zero"
                    value="emw" />
                </div>
                <div class="flex">
                  <v-checkbox
                    label="e.move.ZOE"
                    style="margin-right: 1em"
                    @change="calculateCloud"
                    v-model="data.extra_options_zero"
                    value="emove.zoe" />
                </div>
                <div class="flex">
                  <v-checkbox
                    label="Steuerliche Beratung"
                    style="margin-right: 1em"
                    @change="calculateCloud"
                    v-model="data.extra_options_zero"
                    value="tax_consult" />
                </div>-->
                <div class="flex">
                  <v-checkbox
                    label="Brauchwasserwärmepume"
                    style="margin-right: 1em"
                    @change="calculateCloud"
                    v-model="data.extra_options_zero"
                    value="wwwp" />
                  <div v-if="data.extra_options_zero.indexOf('wwwp') >= 0">
                    <v-select
                      label="Variante"
                      v-model="data.extra_options_wwwp_variant" :items="[
                        {'value':'NIBE L','label':'L'},
                        {'value':'NIBE XL','label':'XL'}
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
                    value="solaredge"
                    disabled />
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
                        {'value':'11kW','label':'Heidelberg ECO Home 11 kw (nicht förderfähig)'},
                        {'value':'control-11kW','label':'Heidelberg Energy Control 11 kW'},
                        {'value':'senec-pro-11kW','label':'Wallbox SENEC pro S (11kW)'},
                        {'value':'senec-22kW','label':'SENEC 11 bis 22 kW', disabled: true}
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
                      Minderverbau {{ -calculated.kwp_extra | formatNumber(2) }}kWp
                    </div>
                  </div>
                </div>
              </div>
              <div class="layout horizontal">
                <v-select
                  label="Modulart"
                  v-model="data.module_type" :items="pv_modules_selections"
                  @change="calculateCloud();"
                  style="flex: 0 1 8em; margin-right: 1em;"
                  item-text="label"
                  item-value="value"></v-select>
                <v-text-field
                  v-model="data.pv_count_modules"
                  disabled="disabled"
                  @blur="calculateCloud"
                  label="Anzahl Module"
                  class="flex-1 align-right"
                  style="margin-right: 1em;"
                  type="number"
                  step="1"></v-text-field>
                <v-text-field
                  ref="pv_kwp"
                  v-model="data.pv_kwp"
                  disabled="disabled"
                  @blur="calculateCloud"
                  label="geplante Größe"
                  class="flex-1 align-right"
                  suffix="kWp"
                  type="number"
                  step="0.01"></v-text-field>
                <v-select
                  v-model="data.overwrite_storage_size" :items="possible_storage_sizes"
                  label="Speichergröße überschreiben"
                  @change="calculateCloud"
                  style="flex: 0 1 8em; margin-left: 1em;"
                  item-text="label"
                  item-value="value"></v-select>
              </div>
              <v-text-field @change="calculateCloud" label="Solaredge Designer Link" v-model="data.solaredge_designer_link" :rules="[rules.required]"/><br />
              <b>Dachflächen</b>
              <v-expansion-panels>
                <v-expansion-panel v-for="(roof, index) in data.roofs" :key="index">
                  <v-expansion-panel-header>
                    <RoofHeaderForm :roofs="data.roofs" :index="index" @input="calculateCloud"></RoofHeaderForm>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <RoofForm :roofs="data.roofs" :index="index" :data="data" :id="id" @input="calculateCloud"></RoofForm>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
              <div>
                <v-btn @click="addRoof" style="margin-right: 1em">Hinzufügen</v-btn>
              </div>

            </div>
          </v-stepper-content>
          <v-stepper-content step="5">
            <div class="section">
              <h2>Bilder</h2>
              <TabForm :id="id" :data="data" />
            </div>
          </v-stepper-content>

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
                    min="3.75"
                    max="7.75"
                    step="0.25"
                    thumb-label="always"></v-slider>
                  <div style="margin-top: -1em; padding-left: 0.5em">Preissteigerung</div>
                </div>
                <div class="flex">
                  <v-slider
                    v-model="data.inflation_rate"
                    @input="formChanged"
                    min="1.0"
                    max="3.5"
                    step="0.01"
                    thumb-label="always"></v-slider>
                  <div style="margin-top: -1em; padding-left: 0.5em">Inflation</div>
                </div>
                <div class="flex">
                  <v-slider
                    v-model="data.runtime"
                    @input="formChanged"
                    min="25"
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
  </div>
</template>

<script>
import Usage from '~/components/quote_calculator/quotes/cloud/usage'
import Financing from '~/components/quote_calculator/quotes/cloud/financing'
import RoofHeaderForm from '~/components/quote_calculator/roof_header'
import RoofForm from '~/components/quote_calculator/roof_detail'
import TabForm from '~/components/quote_calculator/tabform'
import {formatNumber, formatPrice} from '~/plugins/formatNumber'

export default {

  components: {
    Usage,
    Financing,
    RoofHeaderForm,
    RoofForm,
    TabForm
  },

  props: [
    'id',
    'data',
    'calculated',
    'select_options',
    'possible_storage_sizes',
    'pv_modules_selections'
  ],

  computed: {
    checkCloudRights: function () { return this.$store.getters['quote_calculator/checkCloudRights'] },
    checkBookkeepingRights: function () { return this.$store.getters['quote_calculator/checkBookkeepingRights'] },
    checkMitteRights: function () { return this.$store.getters['quote_calculator/checkMitteRights'] }
  },

  data(){
    return {
      stepper: 1,
      histories__: [],
      editId: 0,
      rules: {
        requiredBoolean: value => value !== undefined || 'Pflichteingabe',
        required:  value => !!value || 'Pflichteingabe',
      }
    }
  },

  mounted () {
  },

  methods: {
    validate () {
      this.$nextTick(() => {
        let found = false
        for (let field in this.$refs) {
          let element = this.$refs[field]
          if(Array.isArray(element)){
            element = element[0]
          }
          if(element !== undefined && element._isVue && !element.validate(true)){
            found = true
          }
        }
        this.roofs[this.index].is_valid = !found
      })
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
    emitInput(){
      this.$emit('input', {})
    },
    calculateCloud () {
      this.$emit('calculateCloud')
    },
    formatNumber() {
      // legacy
      return formatNumber()
    },
    formatPrice() {
      // legacy
      return formatPrice()
    },
    formChanged () {
      // legacy
    }
  }

}
</script>