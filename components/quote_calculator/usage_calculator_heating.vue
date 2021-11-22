<template>
  <div>
    <div v-if="data.usageCalculationHeating">
      <h3>Heutiger Verbrauch</h3>
      <div v-if="data.old_heating_type === 'oil'">
        <v-text-field
          v-model="data.usageCalculationHeating.old_liter_oil"
          label="Verbrauch in der letzten Heizperiode"
          class="align-right"
          suffix="Liter"
          type="number"
          step="0.01"
          @input="data.usageCalculationHeating.old_kwh = data.usageCalculationHeating.old_liter_oil * 10; calculate()"></v-text-field>
        Ergibt einen Verbrauch von {{ data.usageCalculationHeating.old_kwh }} kWh
      </div>
      <div v-else>
        <v-text-field
          v-model="data.usageCalculationHeating.old_kwh"
          label="Verbrauch in der letzten Heizperiode"
          class="align-right"
          suffix="kWh"
          type="number"
          step="0.01"
          @input="calculate"></v-text-field>
      </div>

      <h3>Neuer Verbrauch</h3>
      <div v-if="data.old_heating_type === 'oil' || data.old_heating_type === 'gas'">
        <div v-if="data.new_heating_type === 'heatpump'">
          Beim Ersetzen Ihrer alten Gas oder Öl-Anlage durch eine moderne Wärmepumpe reduziert sich ihr Verbrauch wie folgt:
          {{ data.usageCalculationHeating.old_kwh }} -27% / 3.75 = {{ data.usageCalculationHeating.value }} kWh
        </div>
        <div v-if="data.new_heating_type === 'hybrid_gas'">
          Beim Ersetzen Ihrer alten Gas oder Öl-Anlage durch eine moderne Gas-Wärmepumpe Hybridheizung reduziert sich ihr Verbrauch wie folgt:
          {{ data.usageCalculationHeating.old_kwh }} -27% = {{ data.usageCalculationHeating.value }} kWh
        </div>
      </div>
      <div v-if="data.old_heating_type === 'heatpump'">
        Beim ersetzen einer Wärmepumpe die älter ist als 14 Jahre:
        {{ data.usageCalculationHeating.old_kwh }} -25% = {{ data.usageCalculationHeating.value }} kWh
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["data"],

  methods: {
    calculate () {
      if (this.data.old_heating_type === 'oil' || this.data.old_heating_type === 'gas') {
        if (this.data.new_heating_type === 'heatpump') {
          this.data.usageCalculationHeating.value = (this.data.usageCalculationHeating.old_kwh * 0.73) / 3.75
        }
        if (this.data.new_heating_type === 'hybrid_gas') {
          this.data.usageCalculationHeating.value = this.data.usageCalculationHeating.old_kwh * 0.73
        }
      }
      if (this.data.old_heating_type === 'heatpump') {
        this.data.usageCalculationHeating.value = this.data.usageCalculationHeating.old_kwh * 0.75
      }
      this.data.usageCalculationHeating.value = Math.round(this.data.usageCalculationHeating.value)
      this.$emit("input", this.data.usageCalculationHeating)
    },
  }
};
</script>