<template>
  <div class="main-content flex-1">
    <h2>Elektroinstallation</h2>
    <div v-if="data.has_pv_quote">
      <div class="layout horizontal wrap">
        <v-select
          label="Gebäudeart"
          ref="tab_building_type"
          :rules="[rules.required]"
          v-model="data.tab_building_type" :items="[
            'Einzelhaus',
            'Doppelhaus',
            'Scheune / Schuppen',
            'Garage',
          ]"
          @change="calculateCloud"
          style="max-width: 14em; margin-right: 1em"></v-select>
      </div>

      <div>
        <div class="radio-group-label">Besteht eine Oberleitung:</div>
        <v-radio-group ref="oberleitung_vorhanden" v-model="data.oberleitung_vorhanden" class="no-margin" row :rules="[rules.requiredBoolean]" @change="calculateCloud">
          <v-radio :value="true" label="Ja" />
          <v-radio :value="false" label="Nein" />
        </v-radio-group>
      </div>

      <div>
        <div class="radio-group-label">Als Kabelkanal aussen am Haus soll folgende Farbe verwendet werden:</div>
        <v-radio-group ref="kabelkanal_color" v-model="data.kabelkanal_color" class="no-margin" :rules="[rules.required]" @change="calculateCloud">
          <v-radio value="Weiss" label="Weiss" />
          <v-radio value="Braun" label="Braun" />
          <v-radio value="Weiss & Braun" label="Weiss & Braun" />
          <v-radio value="keines von beiden, der Kanal wird bauseits gestellt" label="keines von beiden, der Kanal wird bauseits gestellt" />
        </v-radio-group>
      </div>

      <v-select
        label="Keller mit Außenzugang"
        ref="tab_has_cellar_external_entrance"
        :rules="[rules.requiredBoolean]"
        v-model="data.tab_has_cellar_external_entrance" :items="[
          {label: 'Ja', value: true},
          {label: 'Nein', value: false}
        ]"
        @change="calculateCloud"
        style="max-width: 14em;"
        item-text="label"
        item-value="value"></v-select>
      <div>
        <div class="radio-group-label">Blitzschutz vorhanden:</div>
        <v-radio-group ref="lightning_protection" v-model="data.lightning_protection" class="no-margin" row :rules="[rules.requiredBoolean]" @change="calculateCloud">
          <v-radio :value="true" label="Ja" />
          <v-radio :value="false" label="Nein" />
        </v-radio-group>
      </div>
      <div class="layout horizontal" v-if="data.lightning_protection">
        <div class="radio-group-label">Blitzschutz soll demontiert werden: zusätzlicher Kostenaufwand: 290€</div>
        <v-radio-group ref="lightning_protection_removal" v-model="data.lightning_protection_removal" class="no-margin" row :rules="[rules.requiredBoolean]" @change="calculateCloud">
          <v-radio :value="true" label="Ja" />
          <v-radio :value="false" label="Nein" />
        </v-radio-group>
      </div>
      <div class="layout horizontal" v-if="data.lightning_protection">
        <div class="radio-group-label">Blitzschutz soll integriert werden: Ja zusätzlicher Kostenaufwand: 1.200€</div>
        <v-radio-group ref="lightning_protection_installation" v-model="data.lightning_protection_installation" class="no-margin" row :rules="[rules.requiredBoolean]" @change="calculateCloud">
          <v-radio :value="true" label="Ja" />
          <v-radio :value="false" label="Nein" />
        </v-radio-group>
      </div>
      <div v-if="data.lightning_protection && !data.lightning_protection_removal && !data.lightning_protection_installation">
        Blitzschutz wird bauseits in die Pv Anlage integriert.
      </div>
      <b>Zählernummern</b><br>
      <v-checkbox v-model="data.is_new_building" label="Es handelt sich um einen Neubau" style="margin: 0" @change="calculateCloud" />
      <div v-if="!data.is_new_building">
        <div class="layout horizontal">
          <v-text-field
            ref="power_meter_number"
            v-model="data.power_meter_number"
            :rules="[rules.required]"
            @blur="calculateCloud"
            label="Haupt Zählernummer"
            style="margin-right: 1em"></v-text-field>
          <v-text-field
            ref="main_malo_id"
            v-model="data.main_malo_id"
            :rules="[rules.required]"
            @blur="calculateCloud"
            label="Haupt Malo ID"
            style="margin-right: 1em"></v-text-field>
        </div>
        <v-text-field
          v-if="data.heater_usage > 0"
          v-model="data.heatcloud_power_meter_number"
          ref="heatcloud_power_meter_number"
          :rules="[rules.required]"
          @blur="calculateCloud"
          label="Wärmecloud Zählernummer"
          style="margin-right: 1em"></v-text-field>
      </div>
      <div v-for="(consumer, index) in data.consumers" :key="index">
        <div class="layout horizontal">
          <v-text-field
            v-model="consumer.power_meter_number"
            @blur="calculateCloud"
            label="Consumer Zählernummer"
            style="flex: 0 0 12em; margin-right: 1em"></v-text-field>
          <v-text-field
            v-model="consumer.malo_id"
            @blur="calculateCloud"
            label="Consumer Malo ID"
            style="margin-right: 1em"></v-text-field>
        </div>
      </div>
      <div v-if="!data.is_new_building">
        <b>Extra Zähler</b>
        <div class="layout horizontal">
          <v-text-field
            v-model="data.power_meter_number_extra1_label"
            @blur="calculateCloud"
            label="Weiterer Zähler Bezeichnung"
            style="margin-right: 1em"></v-text-field>
          <v-text-field
            v-model="data.power_meter_number_extra1"
            @blur="calculateCloud"
            label="Zählernummer"
            style="margin-right: 1em"></v-text-field>
        </div>
        <div class="layout horizontal">
          <v-text-field
            v-model="data.power_meter_number_extra2_label"
            @blur="calculateCloud"
            label="Weiterer Zähler Bezeichnung"
            style="margin-right: 1em"></v-text-field>
          <v-text-field
            v-model="data.power_meter_number_extra2"
            @blur="calculateCloud"
            label="Zählernummer"
            style="margin-right: 1em"></v-text-field>
        </div>
      </div>
    </div>
    <div>
      <v-select
        label="Zählerzusammenlegung gewünscht"
        ref="tab_zahlerzusammenlegung"
        :rules="[rules.requiredBoolean]"
        v-model="data.tab_zahlerzusammenlegung" :items="[
          {label: 'Ja', value: true},
          {label: 'Nein', value: false}
        ]"
        @change="calculateCloud"
        style="max-width: 14em;"
        item-text="label"
        item-value="value"></v-select>
      <div class="layout horizontal wrap">
        <v-text-field label="alte Nebenzählernummer 1" v-model="data.tab_extra_counter_number1" style="margin-right: 1em" v-if="data.tab_zahlerzusammenlegung" @blur="calculateCloud" />
        <v-text-field label="alte Nebenzählernummer 2" v-model="data.tab_extra_counter_number2" style="margin-right: 1em" v-if="data.tab_zahlerzusammenlegung" @blur="calculateCloud" />
        <v-text-field label="alte Nebenzählernummer 3" v-model="data.tab_extra_counter_number3" style="margin-right: 1em" v-if="data.tab_zahlerzusammenlegung" @blur="calculateCloud" />
      </div>
      <br />

    </div>
    <div class="layout horizontal wrap">
      <v-select
        label="Standort HAK"
        ref="tab_hak_position"
        :rules="[rules.required]"
        v-model="data.tab_hak_position" :items="[
          'Keller',
          'Aussen',
          'Dachboden',
          'anderes Gebäude'
        ]"
        @change="calculateCloud"
        style="max-width: 14em;margin-right: 1em"></v-select>
      <v-select
        label="Entfernung HAK zum Zählerschrank"
        ref="tab_distance_hak"
        :rules="[rules.required]"
        v-model="data.tab_distance_hak" :items="[
          'bis 5m',
          '5-10m',
          '10-15m',
          'über 20m'
        ]"
        @change="calculateCloud"
        style="max-width: 14em;margin-right: 1em; margin-left: 1em"></v-select>
        <v-text-field label="Höhe des Raums mit Zählerschrank" v-model="data.tab_roomheight_power_cabinet" suffix="cm" />
    </div>
    <div>
      <b>Extra Stromverbraucher</b>
      <v-checkbox
        label="Eine Wärmepumpe ist vorhanden"
        style="margin: 0"
        v-model="data.tab_power_usage_options"
        @change="calculateCloud"
        value="Eine Wärmepumpe ist vorhanden" />
      <v-checkbox
        label="Elektro Heizungen sind vorhanden"
        style="margin: 0"
        v-model="data.tab_power_usage_options"
        @change="calculateCloud"
        value="Elektro Heizungen sind vorhanden" />
      <v-checkbox
        label="Durchlauferhitzer sind vorhanden"
        style="margin: 0"
        v-model="data.tab_power_usage_options"
        @change="calculateCloud"
        value="Durchlauferhitzer sind vorhanden" />
      <v-checkbox
        label="Pool ist vorhanden"
        style="margin: 0"
        v-model="data.tab_power_usage_options"
        @change="calculateCloud"
        value="Pool ist vorhanden" />
      <v-checkbox
        label="Sauna ist vorhanden"
        style="margin: 0"
        v-model="data.tab_power_usage_options"
        @change="calculateCloud"
        value="Sauna ist vorhanden" />
      <v-checkbox
        label="grosse Werkgeräte, mit Starkstrom z.B.: Kreissäge, Schweissgerät vorhanden"
        style="margin: 0"
        v-model="data.tab_power_usage_options"
        @change="calculateCloud"
        value="grosse Werkgeräte, mit Starkstrom z.B.: Kreissäge, Schweissgerät vorhanden" />
      <v-checkbox
        label="Wallbox ist vorhanden"
        style="margin: 0"
        v-model="data.tab_power_usage_options"
        @change="calculateCloud"
        value="Wallbox ist vorhanden" />
      <v-checkbox
        label="Wasserpumpe/Brunnen ist vorhanden"
        style="margin: 0"
        v-model="data.tab_power_usage_options"
        @change="calculateCloud"
        value="Wasserpumpe/Brunnen ist vorhanden" />
    </div>
    <v-select
      v-if="data.tab_power_usage_options && data.tab_power_usage_options.length > 0"
      label="kWh Gesamtleistung (Großverbraucher)"
      ref="tab_power_usage_total_power"
      :rules="[rules.required]"
      v-model="data.tab_power_usage_total_power" :items="[
        'bis 11kWh',
        '11-15 kWh',
        '15-20 kWh',
        '20-25 kWh'
      ]"
      @change="calculateCloud"
      style="max-width: 14em;margin-right: 1em"
      item-text="label"
      item-value="value"></v-select>
    <v-select
      v-if="data.extra_options.indexOf('wallbox') >= 0"
      label="Wallbox Montageort"
      ref="wallbox_mountpoint"
      :rules="[rules.required]"
      v-model="data.wallbox_mountpoint" :items="[
        'In der Garage ',
        'Carport',
        'Hausfassade',
        'Außenwand Garage'
      ]"
      @change="calculateCloud"
      style="max-width: 14em;margin-right: 1em"
      item-text="label"
      item-value="value"></v-select>
    <b style="font-size: 1.1em">Elektrik-Bilder</b>
    <div class="layout horizontal wrap">
      <FileUpload ref="zahlerschrank_offen" required label="Zählerschrank offen" filekey="zahlerschrank_offen" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" @input="calculateCloud"/>
      <FileUpload ref="zahlerschrank_geschlossen" required label="Zählerschrank Umgebung" filekey="zahlerschrank_geschlossen" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" @input="calculateCloud" />
      <FileUpload ref="zahlerschrank_typshild" required label="Typenschild Zählerschrank" filekey="zahlerschrank_typshild" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" @input="calculateCloud" />
    </div>
    <div class="layout horizontal wrap">
      <FileUpload ref="hak_innen" required label="Hausanschluss (HAK)" filekey="hak_innen" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" @input="calculateCloud" />
      <FileUpload ref="zahlerschrank_zahlernummer" v-if="!data.is_new_building" label="Hauptzähler mit lesbarer Zählernummer" filekey="zahlerschrank_zahlernummer" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" required @input="calculateCloud" />
      <FileUpload v-if="!data.is_new_building && data.heater_usage > 0" label="Wärmezähler mit lesbarer Zählernummer" filekey="zahlerschrank_warmezahlernummer" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" @input="calculateCloud" />
      <FileUpload v-if="!data.is_new_building && data.power_meter_number_extra1_label || data.power_meter_number_extra1" label="Extra Zähler 1 mit lesbarer Zählernummer" filekey="zahlerschrank_zahlernummer1" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" @input="calculateCloud" />
      <FileUpload v-if="!data.is_new_building && data.power_meter_number_extra2_label || data.power_meter_number_extra2" label="Extra Zähler 2 mit lesbarer Zählernummer" filekey="zahlerschrank_zahlernummer2" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" @input="calculateCloud" />
    </div>
    <b>Raum für mögliche Aufstellorte (Speicher, Wechselrichter, neuer Zählerschrank)</b>
    <div class="layout horizontal wrap">
      <FileUpload ref="aufstellort1" required label="Aufstellort 1" filekey="aufstellort1" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" @input="calculateCloud" />
      <FileUpload ref="aufstellort2" required label="Aufstellort 2" filekey="aufstellort2" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" @input="calculateCloud" />
      <FileUpload label="Panoramaaufnahme" filekey="panorama" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" @input="calculateCloud" />
    </div>
    <b>Kabelweg / Erdweg von Garage, Scheune usw.</b>
    <div class="layout horizontal wrap">
      <FileUpload ref="kabelweg1" required label="Kabelweg 1" filekey="kabelweg1" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" @input="calculateCloud" />
      <FileUpload ref="kabelweg2" required label="Kabelweg 2" filekey="kabelweg2" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" @input="calculateCloud" />
      <FileUpload label="Kabelweg 3" filekey="kabelweg3" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" @input="calculateCloud" />
      <FileUpload label="Kabelweg 4" filekey="kabelweg4" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" @input="calculateCloud" />
      <FileUpload label="Kabelweg 5" filekey="kabelweg5" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" @input="calculateCloud" />
      <FileUpload label="Kabelweg 6" filekey="kabelweg6" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" @input="calculateCloud" />
    </div>
    <div v-if="data.extra_options.indexOf('wallbox') >= 0">
      <b>Kabelwege / Platz für Wallbox </b>
      <div class="layout horizontal wrap">
        <FileUpload label="Kabelweg Wallbox 1" filekey="kabelweg_wallbox_1" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" @input="calculateCloud" />
        <FileUpload label="Kabelweg Wallbox 2" filekey="kabelweg_wallbox_2" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" @input="calculateCloud" />
      </div>
    </div>
    <b>Sonstige Bilder (andere Besonderheiten)</b>
    <div class="layout horizontal wrap">
      <FileUpload label="Bereits vorhandene Wallbox" filekey="vorhandene_wallbox" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" @input="calculateCloud" />
      <FileUpload label="Große Verbraucher" filekey="große_verbraucher" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" @input="calculateCloud" />
      <FileUpload label="Bereits bestehende PV - Anlage ( mit Typenschild)" filekey="bereits_bestehende_pv" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" @input="calculateCloud" />
      <FileUpload label="Falls vorhanden Grundriss (Bei Neubau immer!)" filekey="grundriss" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" @input="calculateCloud" />
    </div>
  </div>
</template>


<script>
import FileUpload from '~/components/quote_calculator/fileupload'

export default {

  components: {
    FileUpload
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
          if(element !== undefined && element._isVue && !element.validate()){
            found = true
          }
        }
        console.log(this.$refs)
        this.data.is_valid_electric = !found
      })
    },
    calculateCloud () {
      this.validate()
      this.$emit('calculateCloud')
    }
  }

}
</script>