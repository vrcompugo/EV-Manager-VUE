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
              :select_options="select_options"
              @calculateCloud="calculateCloud" />
          </v-stepper-content>

          <v-stepper-content step="2">
            <Financing
              :id="id"
              :data="data"
              :calculated="calculated"
              :select_options="select_options"
              @calculateCloud="calculateCloud" />
          </v-stepper-content>

          <v-stepper-content step="3">
            <ExtraOptions
              :id="id"
              :data="data"
              :calculated="calculated"
              :select_options="select_options"
              @calculateCloud="calculateCloud" />
          </v-stepper-content>

          <v-stepper-content step="4">
            <PVSystem
              :id="id"
              :data="data"
              :calculated="calculated"
              :select_options="select_options"
              :possible_storage_sizes="possible_storage_sizes"
              :pv_modules_selections="pv_modules_selections"
              @calculateCloud="calculateCloud" />
          </v-stepper-content>

          <v-stepper-content step="5">
            <Pictures
              :id="id"
              :data="data"
              @calculateCloud="calculateCloud" />
          </v-stepper-content>

          <v-stepper-content step="6">
            <WIData
              :id="id"
              :data="data"
              :calculated="calculated"
              :select_options="select_options"
              @calculateCloud="calculateCloud" />
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
import ExtraOptions from '~/components/quote_calculator/quotes/cloud/extra_options'
import PVSystem from '~/components/quote_calculator/quotes/cloud/pv_system'
import Pictures from '~/components/quote_calculator/quotes/cloud/pictures'
import WIData from '~/components/quote_calculator/quotes/cloud/wi_data'
import {formatNumber, formatPrice} from '~/plugins/formatNumber'

export default {

  components: {
    Usage,
    ExtraOptions,
    Financing,
    PVSystem,
    WIData,
    Pictures
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