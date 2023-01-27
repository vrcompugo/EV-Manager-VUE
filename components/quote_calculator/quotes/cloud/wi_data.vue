<template>
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