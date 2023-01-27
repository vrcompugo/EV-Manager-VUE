<template>
  <div class="layout horizontal wrap">
    <div class="section" style="padding-bottom: 0">
      <div class="section">
        <h2>Finanzierung</h2>
        <div class="layout horizontal">
          <v-select
            v-model="data.investment_type" :items="[
              {'value':'financing','label':'Finanzierung'},
              {'value':'cash','label':'Barkauf'}
            ]"
            @input="calculateCloud"
            style="flex: 0 1 10em; margin-left: 1em;"
            item-text="label"
            item-value="value"></v-select>
          <v-select
            v-if="data.investment_type == 'financing'"
            v-model="data.financing_bank" :items="[
              {'value':'energie360','label':'über Energie360'},
              {'value':'ownbank','label':'Hausbank'}
            ]"
            @input="calculateCloud"
            style="flex: 0 1 10em; margin-left: 1em;"
            item-text="label"
            item-value="value"></v-select>
          <v-text-field
            v-if="data.investment_type == 'financing'"
            v-model="data.loan_upfront"
            @input="calculateCloud"
            label="Anzahlung"
            suffix="€"
            style="flex: 0 0 12em; margin-left: 1em; margin-right: 1em"></v-text-field>
        </div>
        <div class="flex" v-if="data.investment_type == 'financing'">
          <v-slider
            :disabled="data.financing_bank == 'energie360'"
            v-model="data.financing_rate"
            @input="calculateCloud"
            min="0"
            max="8"
            step="0.01"
            thumb-label="always"></v-slider>
          <div style="margin-top: -1em; padding-left: 0.5em">Finanzierungs Zinssatz</div>
        </div>
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