<template>
  <div class="main-content flex-1">
    <div v-if="data">
      <v-stepper v-model="stepper">
        <v-stepper-header>

          <v-stepper-step :complete="stepper > 1" step="1" editable>
            <div>
              Verbrauchsdaten
              <v-icon v-if="!this.data.is_valid_pv_usage" style="color:#D32F2F;">mdi-close</v-icon>
              <v-icon v-if="this.data.is_valid_pv_usage" style="color:#2E7D32;">mdi-check</v-icon>
            </div>
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="stepper > 2" step="2" editable v-if="!['followup_quote', 'interim_quote', 'no-pv'].includes(data['cloud_quote_type'])">
            <div>
              Finanzierung
              <v-icon style="color:#2E7D32;">mdi-check</v-icon>
            </div>
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="stepper > 3" step="3" editable>
            <div>
              Zusatzoptionen
              <v-icon style="color:#2E7D32;">mdi-check</v-icon>
            </div>
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="stepper > 4" step="4" editable>
            <div>
              PV-Anlage
              <v-icon v-if="!this.data.is_valid_pv_system" style="color:#D32F2F;">mdi-close</v-icon>
              <v-icon v-if="this.data.is_valid_pv_system" style="color:#2E7D32;">mdi-check</v-icon>
            </div>
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="stepper > 5" step="5" editable v-if="!['followup_quote', 'interim_quote', 'no-pv'].includes(data['cloud_quote_type'])">
            <div>
              Bilder
              <v-icon v-if="!this.data.is_valid_pictures" style="color:#D32F2F;">mdi-close</v-icon>
              <v-icon v-if="this.data.is_valid_pictures" style="color:#2E7D32;">mdi-check</v-icon>
            </div>
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step step="6" editable v-if="!['followup_quote', 'interim_quote', 'no-pv'].includes(data['cloud_quote_type'])">
            <div>
              WI-Anpassung
              <v-icon style="color:#2E7D32;">mdi-check</v-icon>
            </div>
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

          <v-stepper-content step="2" v-if="!['followup_quote', 'interim_quote', 'no-pv'].includes(data['cloud_quote_type'])">
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

          <v-stepper-content step="5" v-if="!['followup_quote', 'interim_quote', 'no-pv'].includes(data['cloud_quote_type'])">
            <Pictures
              :id="id"
              :data="data"
              @calculateCloud="calculateCloud" />
          </v-stepper-content>

          <v-stepper-content step="6" v-if="!['followup_quote', 'interim_quote', 'no-pv'].includes(data['cloud_quote_type'])">
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
        this.data.is_valid_cloud_pv = this.data.is_valid_pv_system && this.data.is_valid_pv_usage && this.data.is_valid_pictures
      })
    },
    emitInput(){
      this.$emit('input', {})
    },
    calculateCloud () {
      this.validate()
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