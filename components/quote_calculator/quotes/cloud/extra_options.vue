<template>
  <div>
    <div class="section" v-if="!['followup_quote', 'interim_quote', 'no-pv'].includes(data['cloud_quote_type'])">
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
                {'value':'L','label':'L'},
                {'value':'XL','label':'XL'}
              ]"
              @input="calculateCloud"
              style="max-width: 14em;"
              item-text="label"
              item-value="value"></v-select>
            <div v-if="data.extra_options_wwwp_variant == 'L'">mind. Deckenhöhe 1,80 Meter und Maximal für 4 Personen</div>
            <div v-if="data.extra_options_wwwp_variant == 'XL'">Decknhöhe mind. 2,10 Meter und Maximal für 6 Personen</div>
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

    <div class="section" v-if="!['followup_quote', 'interim_quote', 'no-pv'].includes(data['cloud_quote_type'])">
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
                {'value':'L','label':'L'},
                {'value':'XL','label':'XL'}
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
              @input="calculateCloud"></AddressForm>
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
</template>


<script>
import {formatNumber, formatPrice} from '~/plugins/formatNumber'

export default {

  components: {
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
    emitInput(){
      this.$emit('input', {})
    },
    calculateCloud () {
      this.$emit('calculateCloud')
    },
    formatNumber(number, digits) {
      // legacy
      return formatNumber(number, digits)
    },
    formatPrice(number, digits) {
      // legacy
      return formatPrice(number, digits)
    },
    formChanged () {
      // legacy
    }
  }

}
</script>