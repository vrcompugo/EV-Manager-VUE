<template>
  <div>
    <div class="layout horizontal wrap">
      <div class="section" style="padding-bottom: 0">
        <h3>Verbrauch Lichtstrom</h3>
        <small>&nbsp;</small>
        <v-text-field
          ref="power_usage"
          v-model="data.power_usage"
          :rules="[rules.required]"
          @keyup.enter="calculateCloud"
          @blur="calculateCloud"
          label="Verbrauch in kWh"
          class="align-right"
          suffix="kWh"
          type="number"
          step="1"></v-text-field>
        <v-text-field
          v-if="checkCloudRights || checkBookkeepingRights"
          v-model="data.power_extra_usage"
          @keyup.enter="calculateCloud"
          @blur="calculateCloud"
          label="Extra-Verbrauch in kWh"
          class="align-right"
          suffix="kWh"
          type="number"
          step="1"></v-text-field>
        <small>mehr kWh werden mit {{ (calculated.lightcloud_extra_price_per_kwh * 100) | formatNumber(2) }} Cent kWh abgerechnet</small><br>
      </div>
      <div class="section" :disabled="true" style="padding-bottom: 0">
        <h3>Wärmecloud</h3>
        <small><b>Voraussetzung:</b> 2ter Zähler / Wärmezähler und Konzept 8</small>
        <v-text-field :disabled="data.has_heating_quote" v-model="data.heater_usage" @keyup.enter="calculateCloud" @blur="calculateCloud" label="Verbrauch in kWh" class="align-right" suffix="kWh" type="number" step="1"></v-text-field>
        <small>mehr kWh werden mit {{ (calculated.heatcloud_extra_price_per_kwh * 100) | formatNumber(2) }} Cent abgerechnet</small>
      </div>
      <div class="section" :disabled="true" style="padding-bottom: 0">
        <h3>E.Cloud</h3>
        <small><b>Voraussetzung:</b> Gasheizung</small>
        <v-text-field :disabled="true" v-model="data.ecloud_usage" @keyup.enter="calculateCloud" @blur="calculateCloud" label="Gas Verbrauch in kWh" class="align-right" suffix="kWh" type="number" step="1"></v-text-field>
        <small>mehr kWh werden mit {{ (calculated.ecloud_extra_price_per_kwh * 100) | formatNumber(2) }} Cent kWh Gas abgerechnet</small>
      </div>
    </div>
    <br />

    <h3>Cloud Optionen</h3>
    <div class="layout horizontal wrap">
      <div style="margin-right: 1em">
        <v-radio-group v-model="data.cloud_quote_type" @change="calculateCloud" style="margin-top: 0.3em">
          <v-radio
            value=""
            label="Standard" />
          <v-radio
            value="no-cloud"
            label="Keine Cloud" />
          <v-radio
            disabled
            value="combination_quote"
            label="Cloud Kombinationsvertrag (nur 2 Jahre Laufzeit)" />
          <v-radio
            v-if="checkCloudRights || checkBookkeepingRights"
            value="followup_quote"
            label="Cloud Folgeangebot (nur 1 Jahr Laufzeit)" />
          <v-radio
            v-if="checkCloudRights || checkBookkeepingRights"
            value="interim_quote"
            label="Cloud Zwischenangebot (nur 1 Jahr Laufzeit)" />
        </v-radio-group>
      </div>
      <div style="margin-right: 1em">
        <v-select
          v-if="checkCloudRights || checkBookkeepingRights"
          label="Cloud Laufzeit"
          v-model="data.price_guarantee" :items="[
            {'value':'12_years','label':'12 Jahre'},
            {'value':'10_years','label':'10 Jahre'},
            {'value':'2_years','label':'2 Jahre'},
            {'value':'1_year','label':'1 Jahr'}
          ]"
          @input="calculateCloud"
          style="max-width: 14em;"
          item-text="label"
          item-value="value"></v-select>
        <v-select
          v-else
          label="Cloud Laufzeit"
          v-model="data.price_guarantee" :items="[
            {'value':'12_years','label':'12 Jahre'},
            {'value':'2_years','label':'2 Jahre'}
          ]"
          @input="calculateCloud"
          style="max-width: 14em;"
          item-text="label"
          item-value="value"></v-select>
      </div>
      <div v-if="checkCloudRights || checkBookkeepingRights">
        <v-radio-group v-model="data.old_price_calculation" @change="calculateCloud" style="margin-top: 0.3em">
          <v-radio
            value=""
            label="Standard" />
          <v-radio
            value="l2k3fblk3baxv55"
            label="Preisdefintion vor dem 16.12.2021" />
          <v-radio
            value="5EQnMQSgTFhK3AlS"
            label="Preisdefintion vor dem 28.02.2022" />
          <v-radio
            value="VOgcqFFeQLpV9cxOA02lzXdAYX"
            label="Preisdefintion vor dem 01.10.2022" />
          <v-radio
            value="CXRsAMcrJw7V9wTA4L5ELE8xJx9NVNo9"
            label="Preisdefintion vor dem 15.10.2022" />
          <v-radio
            value="oTv8BT9RzG3ms7QJcq7Y"
            label="Preisdefintion vor dem 25.02.2022" />
        </v-radio-group>
        <v-checkbox
          v-model="data.cloud_quote_heat_seperate"
          label="Wärmecloud gesondert ausweisen" />
      </div>
      <!--
      <div>
        <h3>Cloud.Refresh</h3>
        <v-checkbox
          label="Kunde hat Altanlage"
          style="margin-right: 1em"
          @change="calculateCloud"
          v-model="data.has_old_pv" />
        <div v-if="data.has_old_pv">
          <v-menu
            ref="datepickerMenu"
            v-model="datepickerMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="data.old_pv_build_date"
                type="date"
                label="Wann ist die Anlage in Betrieb gegangen"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="data.old_pv_build_date"
              :active-picker.sync="activePicker"
              min="1950-01-01"
              @change="datePickerSave"
            ></v-date-picker>
          </v-menu>
          <v-text-field
            v-model="data.old_pv_kwp"
            @blur="calculateCloud"
            label="Nennleistung der alten Anlage laut Einspeisevertrag"
            type="number"
            suffix="kWp"
            style="width: 26em; margin-right: 1em"></v-text-field>
        </div>
      </div>-->
    </div>
  </div>
</template>


<script>

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
          if(element !== undefined && element._isVue && !element.validate()){
            found = true
          }
        }
        this.data.is_valid_pv_usage = !found
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
      console.log('ads', this.$refs, this.data.is_valid_pv_usage)
      this.validate()
      this.$emit('calculateCloud')
    },
    datePickerSave (date) {
      this.$refs.datepickerMenu.save(date)
    }
  }

}
</script>