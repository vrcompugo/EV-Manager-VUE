<style lang="scss">
  .v-text-field.align-right input {
    text-align: right;
  }
  .v-text-field.align-right label {
    left: auto;
    right: 0
  }
  table {
    margin-right: 3em;
  }
  table th,
  table td {
    padding-right: 1em;
  }
</style>

<template>
  <div style="text-align: right;">
    <div class="layout horizontal">
      <v-text-field
        v-model="usage"
        label="Verbrauch pro Jahr"
        suffix="kWh"
        type="number"
        step="1"
        style="margin-right: 1em"
        class="align-right"
        @input="calculate" />
      <v-text-field
        v-model="costPerKwh"
        label="Preis pro kWh"
        suffix="€"
        type="number"
        step="0.001"
        style="margin-right: 1em"
        class="align-right"
        @input="calculate" />
      <v-text-field
        v-model="currentCostPerYear"
        label="Kosten pro Jahr"
        suffix="€"
        type="number"
        style="margin-right: 1em"
        @input="calculate"
        class="align-right"
        disabled />
      <v-text-field
        v-model="increaseRate"
        label="Steigerung pro Jahr"
        suffix="%"
        type="number"
        step="0.01"
        style="margin-right: 1em"
        class="align-right"
        @input="calculate" />
      <v-text-field
        v-model="currentCostPerMonth"
        label="Kosten pro Monat"
        suffix="€"
        type="number"
        step="1"
        style="margin-right: 1em"
        class="align-right"
        @input="calculate"
        disabled  />
    </div>
    <div class="layout horizontal">
      <v-text-field
        v-model="currentCostPerYear"
        label="Kosten pro Jahr"
        suffix="€"
        type="number"
        style="margin-right: 1em"
        class="align-right"
        @input="calculate"
        disabled />
      <v-text-field
        v-model="increaseRate"
        label="Steigerung pro Jahr"
        suffix="%"
        type="number"
        step="0.5"
        style="margin-right: 1em"
        class="align-right"
        @input="calculate" />
      <v-text-field
        v-model="costOver10Years"
        label="Kosten über 10 Jahre"
        suffix="€"
        type="number"
        style="margin-right: 1em"
        class="align-right"
        @input="calculate"
        disabled />
      <v-text-field
        v-model="costOver20Years"
        label="Kosten über 20 Jahre"
        suffix="€"
        type="number"
        style="margin-right: 1em"
        class="align-right"
        @input="calculate"
        disabled />
      <v-text-field
        v-model="costOver30Years"
        label="Kosten über 30 Jahre"
        suffix="€"
        type="number"
        style="margin-right: 1em"
        class="align-right"
        @input="calculate"
        disabled />
      <v-text-field
        v-model="averageCostPerMonth"
        label="Durchschnittliche monatliche Kosten (20 Jahre)"
        suffix="€"
        type="number"
        style="margin-right: 1em"
        class="align-right"
        @input="calculate"
        disabled />
    </div>
    <div class="layout horizontal" style="justify-content: flex-start">
      <div>
        <table>
          <tr>
            <th></th>
            <th>Strompreis</th>
          </tr>
          <tr v-for="cost, index in costPerYear.slice(0, 10)" :key="index">
            <td>Jahr {{ index + 1 }}</td>
            <td>{{ cost | formatPrice  }}</td>
          </tr>
          <tr>
            <td></td>
            <td>{{ costOver10Years | formatPrice }}</td>
          </tr>
        </table>
      </div>
      <div>
        <table>
          <tr>
            <th></th>
            <th>Strompreis</th>
          </tr>
          <tr v-for="cost, index in costPerYear.slice(10, 20)" :key="index">
            <td>Jahr {{ index + 11 }}</td>
            <td>{{ cost | formatPrice }}</td>
          </tr>
          <tr>
            <td></td>
            <td>{{ costOver20Years2 | formatPrice }}</td>
          </tr>
        </table>
      </div>
      <div>
        <table>
          <tr>
            <th></th>
            <th>Strompreis</th>
          </tr>
          <tr v-for="cost, index in costPerYear.slice(20, 30)" :key="index">
            <td>Jahr {{ index + 21 }}</td>
            <td>{{ cost | formatPrice  }}</td>
          </tr>
          <tr>
            <td></td>
            <td>{{ costOver30Years2 | formatPrice }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {

  data(){
    return {
      usage: 4500,
      costPerKwh: 0.3,
      increaseRate: 4.5,
      costPerYear: [],
      costOver10Years: 0,
      costOver20Years: 0,
      costOver20Years2: 0,
      costOver30Years: 0,
      costOver30Years2: 0,
      averageCostPerMonth: 0
    }
  },

  computed: {
    currentCostPerYear: function () { return Math.round(this.usage * this.costPerKwh * 100) / 100 },
    currentCostPerMonth: function () { return Math.round(this.currentCostPerYear / 12 * 100) / 100 }
  },

  mounted () {
    this.calculate()
  },

  methods: {
    calculate () {
      this.costPerYear = []
      this.costOver10Years = 0
      this.costOver20Years = 0
      this.costOver20Years2 = 0
      this.costOver30Years = 0
      this.costOver30Years2 = 0
      this.averageCostPerMonth = 0
      let currentPrice = this.currentCostPerYear
      for (let i = 0; i < 30; i++){
        currentPrice = currentPrice * (1 + this.increaseRate / 100)
        if (i < 10) {
          this.costOver10Years = this.costOver10Years + currentPrice
        }
        if (i < 20) {
          this.costOver20Years = this.costOver20Years + currentPrice
          if (i >= 10) {
            console.log(i)
            this.costOver20Years2 = this.costOver20Years2 + currentPrice
          }
        }
        this.costOver30Years = this.costOver30Years + currentPrice
        if (20 <= i) {
          this.costOver30Years2 = this.costOver30Years2 + currentPrice
        }
        this.costPerYear.push(currentPrice)
      }

      this.costOver10Years = Math.round(this.costOver10Years * 100) / 100
      this.costOver20Years = Math.round(this.costOver20Years * 100) / 100
      this.costOver20Years2 = Math.round(this.costOver20Years2 * 100) / 100
      this.costOver30Years = Math.round(this.costOver30Years * 100) / 100
      this.costOver30Years2 = Math.round(this.costOver30Years2 * 100) / 100
      this.averageCostPerMonth = Math.round(this.costOver20Years / 20 / 12 * 100) / 100
    }
  }

}
</script>
