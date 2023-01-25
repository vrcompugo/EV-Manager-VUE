<template>
  <div class="main-content flex-1">
    <div v-if="data.has_heating_quote">
      <h2>Heizungsanlage</h2>
      <div v-if="data.heating_quote_house_build_year >= 2001" style="margin: 0.2em 1em; padding: 0.2em 0.5em; background-color: #D32F2F; color: #fff">Eine volle 40% Bafa-Förderung kann nicht erreicht werden, bei einem Baujahr neuer als 2001</div>
      <div class="layout horizontal wrap" style="align-items: center;">
        <v-select
          label="Hausart"
          v-model="data.heating_quote_house_type" :items="[
            {'value':'Einfamilienhaus','label':'Einfamilienhaus'},
            {'value':'Mehrfamilienhaus','label':'Mehrfamilienhaus'}
          ]"
          @input="calculateCloud"
          style="margin-left: 1em; max-width: 14em"
          item-text="label"
          item-value="value"></v-select>
        <v-select
          label="Baujahr"
          v-model="data.heating_quote_house_build_year" :items="buildyears"
          @input="calculateUsageHeating();"
          style="margin-left: 1em; max-width: 14em"
          item-text="label"
          item-value="value"></v-select>
        <v-select
          label="Dämmwert"
          v-model="data.heating_quote_house_build" :items="[
            {'value':'1940-1969','label':'1940-1969'},
            {'value':'1970-1979','label':'1970-1979'},
            {'value':'1980-1999','label':'1980-1999'},
            {'value':'2000-2015','label':'2000-2015'},
            {'value':'2016 und neuer','label':'2016 und neuer'},
            {'value':'new_building','label':'Neubau'}
          ]"
          @input="calculateUsageHeating();"
          style="margin-left: 1em; max-width: 14em"
          item-text="label"
          item-value="value"></v-select>
        <v-select
          v-if="data.heating_quote_house_build !== 'new_building'"
          label="Alter Heizungstyp"
          v-model="data.old_heating_type" :items="[
            {'value':'gas','label':'Gas'},
            {'value':'oil','label':'Öl'},
            {'value':'heatpump','label':'Wärmepumpe'},
            {'value':'pellez','label':'Pellet'},
            {'value':'electro','label':'Elektro'},
            {'value':'nightofen','label':'Nachtspeicheröfen'},
            {'value':'other','label':'Sonstige'},
          ]"
          @input="calculateUsageHeating();"
          style="margin-left: 1em; width: 7em"
          item-text="label"
          item-value="value"></v-select>
        <v-select
          v-if="data.heating_quote_house_build !== 'new_building'"
          label="Baujahr alte Heizung"
          v-model="data.heating_quote_old_heating_build" :items="[
            {'value':'2-6_years','label':'2-6 Jahre'},
            {'value':'7-12_years','label':'7-12 Jahre'},
            {'value':'older','label':'Über 12 Jahre'}
          ]"
          @input="calculateUsageHeating();"
          style="margin-left: 1em; width: 7em"
          item-text="label"
          item-value="value"></v-select>
        <v-select
          label="Gewünschter Heizungstyp"
          v-model="data.new_heating_type" :items="[
            {'value': 'gas', 'label': 'Gas'},
            {'value': 'heatpump', 'label':' Wärmepumpe'},
            {'value': 'hybrid_gas', 'label':' Hybrid Gas/WP'}
          ]"
          @input="calculateUsageHeating();"
          style="margin-left: 1em; width: 8em;"
          item-text="label"
          item-value="value"></v-select>
        <v-text-field
          v-if="data.old_heating_type === 'oil'"
          v-model="data.heating_quote_usage_oil"
          @input="data.heating_quote_usage_old = data.heating_quote_usage_oil * 10; calculateUsageHeating()"
          @blur="calculateCloud"
          label="Verbrauch in der letzten Heizperiode"
          class="align-right"
          suffix="Liter"
          type="number"
          step="0.01"
          style="margin-left: 1em; width: 8em;"></v-text-field>
        <v-text-field
          v-if="data.old_heating_type !== 'oil' && data.heating_quote_house_build !== 'new_building'"
          v-model="data.heating_quote_usage_old"
          @input="calculateUsageHeating"
          label="Verbrauch in der letzten Heizperiode"
          class="align-right"
          suffix="kWh"
          type="number"
          step="0.01"
          style="margin-left: 1em; width: 8em;"></v-text-field>
        <v-text-field
          v-if="data.new_heating_type !== 'hybrid_gas'"
          v-model="data.heating_quote_usage"
          @blur="addHeatingToCloud();calculateCloud();"
          label="Neuer Verbrauch"
          class="align-right"
          suffix="kWh"
          type="number"
          step="0.01"
          style="margin-left: 1em; width: 10em;"></v-text-field>
        <v-text-field
          v-if="data.new_heating_type === 'hybrid_gas'"
          v-model="data.heating_quote_usage_gas"
          @blur="addHeatingToCloud();calculateCloud();"
          label="Neuer Verbrauch (Gas)"
          class="align-right"
          suffix="kWh"
          type="number"
          step="0.01"
          style="margin-left: 1em; width: 8em;"></v-text-field>
        <v-text-field
          v-if="data.new_heating_type === 'hybrid_gas'"
          v-model="data.heating_quote_usage_wp"
          @blur="addHeatingToCloud();calculateCloud();"
          label="Neuer Verbrauch (WP)"
          class="align-right"
          suffix="kWh"
          type="number"
          step="0.01"
          style="margin-left: 1em; width: 8em;"></v-text-field>
        <v-btn
          v-if="data.heating_quote_house_build === 'new_building'"
          @click="estimateNewUsage"
          style="margin-left: 1em;"
          small
          >Verbrauch schätzen</v-btn>
      </div>
      <div class="layout horizontal wrap">
        <v-text-field
          v-model="data.heating_quote_sqm"
          @blur="calculateCloud"
          label="Zu beheizende Fläche"
          class="align-right"
          suffix="m²"
          type="number"
          step="1"
          style="margin-left: 1em"></v-text-field>
        <v-select
          label="Heizkörpertyp"
          v-model="data.heating_quote_radiator_type" :items="[
            {'value':'floor_heating','label':'Fussbodenheizug ausschliesslich'},
            {'value':'mixed','label':'Fussbodenheizung und Heizkörper'},
            {'value':'radiator_heating','label':'Nur Heizkörper'}
          ]"
          @input="calculateCloud"
          style="margin-left: 1em; max-width: 14em"
          item-text="label"
          item-value="value"></v-select>
        <v-select
          label="Warmwasser Aufbereitung"
          v-model="data.heating_quote_warm_water_type" :items="[
            {'value':'heater','label':'Heizung macht Warmwasser'},
            {'value':'separate','label':'Warmwasser wird derzeit anders hergestellt'}
          ]"
          @input="calculateCloud"
          style="margin-left: 1em; max-width: 14em"
          item-text="label"
          item-value="value"></v-select>
        <v-select
          label="Zirkulationspumpe"
          v-model="data.heating_quote_circulation_pump" :items="[
            {'value': false,'label': 'Nein'},
            {'value': true,'label': 'Ja'}
          ]"
          @input="calculateCloud"
          style="margin-left: 1em; max-width: 14em"
          item-text="label"
          item-value="value"></v-select>
        <v-text-field
          label="Anzahl Heizkörper"
          v-model="data.heating_quote_radiator_count"
          @input="calculateCloud"
          type="number"
          style="margin-left: 1em; max-width: 14em;"
          step="1"></v-text-field>
        <v-text-field
          label="Anzahl Duschen"
          v-model="data.heating_quote_shower_count"
          @input="calculateCloud"
          type="number"
          style="margin-left: 1em; max-width: 14em;"
          step="1"></v-text-field>
        <v-text-field
          label="Anzahl Badewannen"
          v-model="data.heating_quote_bathtub_count"
          @input="calculateCloud"
          type="number"
          style="margin-left: 1em; max-width: 14em;"
          step="1"></v-text-field>
        <v-text-field
          label="Personen im Haushalt"
          v-model="data.heating_quote_people"
          @input="calculateUsageHeating();"
          style="margin-left: 1em; max-width: 14em;"
          type="number"
          step="1"></v-text-field>
      </div>
      <b>Solarthermie</b>
      <div class="layout horizontal wrap" style="justify-content: flex-start">
        <div>
          <v-checkbox
            label="vorhande Solartherme einbinden"
            style="margin-right: 1em"
            @change="calculateCloud"
            v-model="data.heating_quote_extra_options"
            value="connect_existing_solarthermie" />
        </div>
        <div>
          <v-checkbox
            label="vorhande Solartherme demontieren"
            style="margin-right: 1em"
            @change="calculateCloud"
            v-model="data.heating_quote_extra_options"
            value="remove_existing_solarthermie" />
        </div>
        <div>
          <v-checkbox
            label="neue Solartherme einbinden"
            style="margin-right: 1em"
            @change="calculateCloud"
            v-model="data.heating_quote_extra_options"
            value="new_solarthermie" />
          <div v-if="data.heating_quote_extra_options.indexOf('new_solarthermie') >= 0">
            <v-select
              label="Solarthermie Set ausählen"
              v-model="data.heating_quote_new_solarthermie_type" :items="[
                {'value':'10','label':'Solarthermie Set (10)'},
                {'value':'11','label':'Solarthermie Set (11)'}
              ]"
              @input="calculateCloud"
              style="margin-left: 1em"
              item-text="label"
              item-value="value"></v-select>
          </div>
        </div>
      </div>
      <b>Extra Optionen</b>
      <div class="layout horizontal wrap" style="justify-content: flex-start">
        <div v-if="data.new_heating_type == 'heatpump'">
          <v-checkbox
            label="Fundament für Wärmepumpe"
            style="margin-right: 1em"
            @change="calculateCloud"
            v-model="data.heating_quote_extra_options"
            value="build_platform" />
        </div>
        <div>
          <v-checkbox
            label="Ausbau der alten Heizung ohne Tanks"
            style="margin-right: 1em"
            @change="calculateCloud"
            v-model="data.heating_quote_extra_options"
            value="deconstruct_old_heater" />
        </div>
        <div v-if="data.new_heating_type == 'gas'">
          <v-checkbox
            label="Renewable Ready (20% Förderung möglich) "
            style="margin-right: 1em"
            @change="calculateCloud"
            v-model="data.heating_quote_extra_options"
            value="renewable_ready" />
        </div>
        <div>
          <v-checkbox
            label="Aussen-Schornstein"
            style="margin-right: 1em"
            @change="calculateCloud"
            v-model="data.heating_quote_extra_options"
            value="outside_chimney" />
          <div v-if="data.heating_quote_extra_options.indexOf('outside_chimney') >= 0">
            <v-text-field
              label="Höhe in Meter"
              v-model="data.heating_quote_extra_options_extra_outside_chimney_height"
              @input="calculateCloud"
              style="max-width: 14em;"
              step="1"></v-text-field>
          </div>
        </div>
        <div v-if="data.new_heating_type == 'heatpump' || data.new_heating_type == 'hybrid_gas'">
          <v-checkbox
            label="Kein Ablauf im Raum der WP vorhanden"
            style="margin-right: 1em"
            @change="calculateCloud"
            v-model="data.heating_quote_extra_options"
            value="no_drain" />
        </div>
        <div v-if="data.new_heating_type == 'heatpump' || data.new_heating_type == 'hybrid_gas'">
          <v-checkbox
            label="grössere Warmwasser Anforderung"
            style="margin-right: 1em"
            @change="calculateCloud"
            v-model="data.heating_quote_extra_options"
            value="extra_warm_water" />
          <div v-if="data.heating_quote_extra_options.indexOf('extra_warm_water') >= 0">
            <v-text-field
              label="Anzahl"
              v-model="data.heating_quote_extra_options_extra_warm_water_count"
              @input="calculateCloud"
              style="max-width: 14em;"
              step="1"></v-text-field>
          </div>
        </div>
        <div v-if="data.new_heating_type != 'heatpump' || data.new_heating_type == 'hybrid_gas'">
          <v-checkbox
            label="Heizungspufferspeicher"
            style="margin-right: 1em"
            @change="calculateUsageHeating();"
            v-model="data.heating_quote_extra_options"
            value="bufferstorage" />
        </div>
        <div class="flex" v-if="!data.has_pv_quote">
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
        <div v-if="data.new_heating_type == 'heatpump' && data.has_pv_quote">
          <v-checkbox
            label="Keine Wärmecloud gewünscht"
            style="margin-right: 1em"
            @change="calculateUsageHeating();"
            v-model="data.no_heatcloud" />
        </div>
      </div>
      <h2>Finanzierung</h2>
      <div class="layout horizontal">
        <v-select
          v-model="data.investment_type_heating" :items="[
            {'value':'financing','label':'Finanzierung'},
            {'value':'cash','label':'Barkauf'}
          ]"
          @input="formChanged"
          style="flex: 0 1 10em; margin-left: 1em;"
          item-text="label"
          item-value="value"></v-select>
        <v-select
          v-if="data.investment_type_heating == 'financing'"
          v-model="data.financing_bank_heating" :items="[
            {'value':'energie360','label':'über Energie360'},
            {'value':'ownbank','label':'Hausbank'}
          ]"
          @input="calculateCloud"
          style="flex: 0 1 10em; margin-left: 1em;"
          item-text="label"
          item-value="value"></v-select>
        <v-text-field
          v-if="data.investment_type_heating == 'financing'"
          v-model="data.loan_upfront_heating"
          @input="formChanged"
          label="Anzahlung"
          suffix="€"
          style="flex: 0 0 12em; margin-left: 1em; margin-right: 1em"></v-text-field>
      </div>
      <div class="flex" v-if="data.investment_type_heating == 'financing'">
        <v-slider
          :disabled="data.financing_bank_heating == 'energie360'"
          v-model="data.financing_rate_heating"
          @input="formChanged"
          min="0"
          max="8"
          step="0.01"
          thumb-label="always"></v-slider>
        <div style="margin-top: -1em; padding-left: 0.5em">Finanzierungs Zinssatz</div>
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
    'select_options'
  ],

  computed: {
  },

  data(){
    return {
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