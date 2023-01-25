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
</style>

<template>
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
            Refresh {{ calculated.min_kwp_refresh | formatNumber(2) }}kWp
          </div>
          <div
            v-if="calculated.min_kwp_emove > 0"
            :style="`background-color: #0097A7; flex: 1 1 ${calculated.min_kwp_emove / calculated.max_kwp * 100}%`">
            eMove {{ calculated.min_kwp_emove | formatNumber(2) }}kWp
          </div>
          <div
            v-if="calculated.min_kwp_light > 0"
            :style="`background-color: #FDD835; color: #333; flex: 1 1 ${calculated.min_kwp_light / calculated.max_kwp * 100}%`">
            Lichtstrom {{ calculated.min_kwp_light | formatNumber(2) }}kWp
          </div>
          <div
            v-if="calculated.min_kwp_heatcloud > 0"
            :style="`background-color: #F4511E; flex: 1 1 ${calculated.min_kwp_heatcloud / calculated.max_kwp * 100}%`">
            Wärmecloud {{ calculated.min_kwp_heatcloud | formatNumber(2) }}kWp
          </div>
          <div
            v-if="calculated.min_kwp_ecloud > 0"
            :style="`background-color: #F4511E; flex: 1 1 ${calculated.min_kwp_ecloud / calculated.max_kwp * 100}%`">
            eCloud {{ calculated.min_kwp_ecloud | formatNumber(2) }}kWp
          </div>
          <div
            v-if="calculated.min_kwp_consumer > 0"
            :style="`background-color: #009688; flex: 1 1 ${calculated.min_kwp_consumer / calculated.max_kwp * 100}%`">
            Consumer {{ calculated.min_kwp_consumer | formatNumber(2) }}kWp
          </div>
          <div
            v-if="calculated.kwp_extra > 0 && calculated.kwp_extra / calculated.max_kwp * 100 > 0.012"
            :style="`background-color: #43A047; flex: 1 1 ${calculated.kwp_extra / calculated.max_kwp * 100}%`">
            Mehrverbau {{ calculated.kwp_extra | formatNumber(2) }}kWp
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
            PV-Anlage {{ data.pv_kwp | formatNumber(2) }}kWp</div>
          <div
            v-if="Number(data.pv_kwp) === 0 || data.pv_kwp === undefined || data.pv_kwp === ''"
            :style="`background-color: #43A047; flex: 1 1 100%`">
            Benötigte PV-Anlage {{ calculated.min_kwp | formatNumber(2)}}kWp</div>
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
    <v-text-field @change="calculateCloud" label="Solaredge Designer Link" ref="solaredge_designer_link" v-model="data.solaredge_designer_link" :rules="[rules.required]"/><br />
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
</template>



<script>
import RoofHeaderForm from '~/components/quote_calculator/quotes/cloud/roof_header'
import RoofForm from '~/components/quote_calculator/quotes/cloud/roof_detail'
export default {

  components: {
    RoofForm,
    RoofHeaderForm
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
          if(element !== undefined && element._isVue && !element.validate()){
            found = true
          }
        }
        this.data.is_valid_pv_system = !found
      })
    },
    emitInput(){
      this.$emit('input', {})
    },
    calculateCloud () {
      this.validate()
      this.$emit('calculateCloud')
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
    formChanged () {
      // legacy
    }
  }

}
</script>