<template>
  <div class="main-content flex-1">
    <h2>Allgemeine Angaben</h2>
    <v-checkbox
      v-if="data.only_show_total_price"
      label="Nur Gesamtpreis in Angeboten anzeigen"
      style="margin-left: 1em"
      @change="calculateCloud"
      v-model="data.only_show_total_price" />
    <v-checkbox
      label="Gewerbliches Angebot erzeugen"
      style="margin-left: 1em"
      @change="calculateCloud"
      v-model="data.is_commercial" />
    <div v-if="data.is_commercial" class="warning" style="padding: 1em">Achtung! Beim Kontakt muss die Adresse der Firma angegeben sein. Nicht der Aufbauort. Bei Abweisung bitte im Kommentar vermerken.</div>
    <div style="border: 2px solid #aaa; padding: 1em">
      <h2>Benötige Vertragsdaten</h2>
      <b>Kundendaten</b>
      <v-menu
        ref="datepickerMenu2"
        v-model="datepickerMenu2"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="data.birthdate"
            type="date"
            label="Geburtstag"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="data.birthdate"
          :active-picker.sync="activePicker"
          min="1910-01-01"
          @change="datePickerSave2"
        ></v-date-picker>
      </v-menu>

      <b>Bankdaten</b>
      <div class="layout horizontal">
        <v-text-field
          :rules="[rules.required]"
          ref="iban"
          v-model="data.iban"
          label="IBAN"
          @blur="calculateCloud"
          style="margin: 0"></v-text-field>
        <v-text-field
          :rules="[rules.required]"
          ref="bic"
          v-model="data.bic"
          label="BIC"
          @blur="calculateCloud"
          style="margin: 0 1em"></v-text-field>
        <v-text-field
          :rules="[rules.required]"
          ref="bankname"
          v-model="data.bankname"
          label="Name der Bank"
          @blur="calculateCloud"
          style="margin: 0"></v-text-field>
      </div>
      <b>Kommentar</b>
      <v-text-field
        v-model="data.extra_notes"
        @blur="calculateCloud"
        label="ergänzende Angaben für den Innendienst"
        hint="Diese Eingabe wird nicht im Vertrag zu sehen sein, hier kann eine Information für den Innendienst eingestellt werden"></v-text-field>
    </div>
    <br>
    <b>Sonderkonditionen</b>
    <v-text-field
      v-if="data.has_pv_quote"
      v-model="data.special_conditions_pv_quote"
      @blur="calculateCloud"
      label="Sonderkonditionen PV-Angebot im Kaufvertrag/Angebot sichtbar"
      hint="Vereinbarungen sind im Kaufvertrag/Angebot sichtbar"></v-text-field>
    <v-text-field
      v-if="data.has_heating_quote"
      v-model="data.special_conditions_heating_quote"
      @blur="calculateCloud"
      label="Sonderkonditionen Heizungsangebot im Kaufvertrag/Angebot sichtbar"
      hint="Vereinbarungen sind im Kaufvertrag/Angebot sichtbar"></v-text-field>
    <v-text-field
      v-if="data.has_roof_reconstruction_quote"
      v-model="data.special_conditions_roof_reconstruction_quote"
      @blur="calculateCloud"
      label="Sonderkonditionen Dachsanierungsangebot im Kaufvertrag/Angebot sichtbar"
      hint="Vereinbarungen sind im Kaufvertrag/Angebot sichtbar"></v-text-field>
    <v-text-field
      v-if="data.has_bluegen_quote"
      v-model="data.special_conditions_bluegen_quote"
      @blur="calculateCloud"
      label="Sonderkonditionen BlueGen im Kaufvertrag/Angebot sichtbar"
      hint="Vereinbarungen sind im Kaufvertrag/Angebot sichtbar"></v-text-field>
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
    'select_options'
  ],

  computed: {
  },

  data(){
    return {
      histories__: [],
      editId: 0,
      activePicker: null,
      datepickerMenu2: false,
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
          if(element !== undefined && field !== 'datepickerMenu2' && element._isVue && !element.validate()){
            found = true
          }
        }
        this.data.is_valid_customer_data = !found
      })
    },
    calculateCloud () {
      this.validate()
      this.$emit('calculateCloud')
    },
    datePickerSave2 (date) {
      this.$refs.datepickerMenu2.save(date)
      this.calculateCloud()
    }
  }

}
</script>