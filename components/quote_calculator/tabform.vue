<style lang="scss">
  .tabform .image-placeholder {
    display: inline-block;
    width: 19em;
    height: 11em;
    background-color: #cccccc;
  }
</style>
<template>
  <div class="tabform">
    <h4>Gebäudebeschreibung</h4>

    <div class="layout horizontal wrap">
      <v-select
        label="Gebäudeart"
        v-model="data.tab_building_type" :items="[
          'Einzelhaus',
          'Reihenhaus',
          'Mehrfamilienhaus',
        ]"
        @input="calculateCloud"
        style="max-width: 14em; margin-right: 1em"></v-select>
      <v-select
        label="Keller mit Außenzugang"
        v-model="data.tab_has_cellar_external_entrance" :items="[
          {label: 'Ja', value: true},
          {label: 'Nein', value: false}
        ]"
        @input="calculateCloud"
        style="max-width: 14em;"
        item-text="label"
        item-value="value"></v-select>
    </div>

    <h4>Elektroinstallation</h4>
    <div>
      <v-select
        label="Zählerzusammenlegung gewünscht"
        v-model="data.tab_zahlerzusammenlegung" :items="[
          {label: 'Ja', value: true},
          {label: 'Nein', value: false}
        ]"
        @input="calculateCloud"
        style="max-width: 14em;"
        item-text="label"
        item-value="value"></v-select><br />
      <div class="layout horizontal wrap">
        <v-text-field label="alte Hauptzählernummer" v-model="data.tab_main_counter_number" style="margin-right: 1em" />
        <v-text-field label="alte Nebenzählernummer 1" v-model="data.tab_extra_counter_number1" style="margin-right: 1em" v-if="data.tab_zahlerzusammenlegung" />
        <v-text-field label="alte Nebenzählernummer 2" v-model="data.tab_extra_counter_number2" style="margin-right: 1em" v-if="data.tab_zahlerzusammenlegung" />
        <v-text-field label="alte Nebenzählernummer 3" v-model="data.tab_extra_counter_number3" style="margin-right: 1em" v-if="data.tab_zahlerzusammenlegung" />
      </div>
      <br />
      <v-text-field label="Höhe des Raums mit Zählerschrank" v-model="data.tab_roomheight_power_cabinet" suffix="cm" /><br />
    </div>
    <div class="layout horizontal wrap">
      <v-select
        label="Standort HAK"
        v-model="data.tab_hak_position" :items="[
          'Keller',
          'Aussen',
          'Flur',
          'EG',
          'DG'
        ]"
        @input="calculateCloud"
        style="max-width: 14em;margin-right: 1em"
        item-text="label"
        item-value="value"></v-select>
      <v-text-field label="Entfernung HAK zum Zählerschrank in Meter" v-model="data.tab_distance_hak" style="" suffix="m" /><br />
    </div>
    <div>
      <b>Extra Stromverbraucher</b>
      <v-checkbox
        label="Eine Wärmepumpe ist vorhanden"
        style="margin: 0"
        v-model="data.tab_power_usage_options"
        value="Eine Wärmepumpe ist vorhanden" />
      <v-checkbox
        label="Elektro Heizungen sind vorhanden"
        style="margin: 0"
        v-model="data.tab_power_usage_options"
        value="Elektro Heizungen sind vorhanden" />
      <v-checkbox
        label="Durchlauferhitzer sind vorhanden"
        style="margin: 0"
        v-model="data.tab_power_usage_options"
        value="Durchlauferhitzer sind vorhanden" />
      <v-checkbox
        label="Pool ist vorhanden"
        style="margin: 0"
        v-model="data.tab_power_usage_options"
        value="Pool ist vorhanden" />
      <v-checkbox
        label="Sauna ist vorhanden"
        style="margin: 0"
        v-model="data.tab_power_usage_options"
        value="Sauna ist vorhanden" />
      <v-checkbox
        label="grosse Werkgeräte, mit Starkstrom z.B.: Kreissäge, Schweissgerät vorhanden"
        style="margin: 0"
        v-model="data.tab_power_usage_options"
        value="grosse Werkgeräte, mit Starkstrom z.B.: Kreissäge, Schweissgerät vorhanden" />
    </div>

    <h4>Bilder</h4>
    <b>Hausfront (wenn möglich Gesamtansicht)</b>
    <div class="layout horizontal wrap">
      <FileUpload label="Hausfront 1" filekey="hausfront1" filetype="jpg" path="Dachbilder" required v-model="data" :id="id" style="margin-right: 1em" />
      <FileUpload label="Hausfront 2" filekey="hausfront2" filetype="jpg" path="Dachbilder" required v-model="data" :id="id" style="margin-right: 1em" />
      <FileUpload label="Hausfront 3" filekey="hausfront3" filetype="jpg" path="Dachbilder" required v-model="data" :id="id" style="margin-right: 1em" />
      <FileUpload label="SolarEdge 3D Ansicht" filekey="solaredge" filetype="pdf" path="Dachbilder" required v-model="data" :id="id" style="margin-right: 1em" />
    </div>
    <b>Gartenansicht</b>
    <div class="layout horizontal wrap">
      <FileUpload label="Gartenansicht 1" filekey="gartenansicht1" filetype="jpg" path="Dachbilder" required v-model="data" :id="id" style="margin-right: 1em" />
      <FileUpload label="Gartenansicht 2" filekey="gartenansicht2" filetype="jpg" path="Dachbilder" required v-model="data" :id="id" style="margin-right: 1em" />
      <FileUpload label="Gartenansicht 3" filekey="gartenansicht3" filetype="jpg" path="Dachbilder" required v-model="data" :id="id" style="margin-right: 1em" />
    </div>
    <b style="font-size: 1.1em">Dachbilder</b><br>
    <b>Dachflächen und Ortgang (Drohnenaufnahmen, wenn vorhanden ansonsten Google Ansicht)</b>
    <div class="layout horizontal wrap">
      <FileUpload label="Dachfläche 1" filekey="dachflache1" filetype="jpg" path="Dachbilder" required v-model="data" :id="id" style="margin-right: 1em" />
      <FileUpload label="Dachfläche 2" filekey="dachflache2" filetype="jpg" path="Dachbilder" required v-model="data" :id="id" style="margin-right: 1em" />
      <FileUpload label="Ortgang 1" filekey="ortgang1" filetype="jpg" path="Dachbilder" required v-model="data" :id="id" style="margin-right: 1em" />
      <FileUpload label="Ortgang 2" filekey="ortgang2" filetype="jpg" path="Dachbilder" required v-model="data" :id="id" style="margin-right: 1em" />
    </div>
    <b style="font-size: 1.1em">Dachbeschaffenheit (innen)</b><br />
    <b>Sparrenansicht und Dicke der Sparren</b>
    <div class="layout horizontal wrap">
      <FileUpload label="Dach innen 1" filekey="dachinnen1" filetype="jpg" path="Dachbilder" required v-model="data" :id="id" style="margin-right: 1em" />
      <FileUpload label="Dach innen 2" filekey="dachinnen2" filetype="jpg" path="Dachbilder" required v-model="data" :id="id" style="margin-right: 1em" />
      <FileUpload label="Dach innen 3" filekey="dachinnen3" filetype="jpg" path="Dachbilder" v-model="data" :id="id" style="margin-right: 1em" />
      <FileUpload label="Dach innen 4" filekey="dachinnen4" filetype="jpg" path="Dachbilder" v-model="data" :id="id" style="margin-right: 1em" />
    </div>
    <b>Dachziegeln mit Zollstockmaße</b>
    <div class="layout horizontal wrap">
      <FileUpload label="Dachziegeln 1" filekey="dachziegel1" filetype="jpg" path="Dachbilder" required v-model="data" :id="id" style="margin-right: 1em" />
      <FileUpload label="Dachziegeln 2" filekey="dachziegel2" filetype="jpg" path="Dachbilder" v-model="data" :id="id" style="margin-right: 1em" />
    </div>
    <b style="font-size: 1.1em">Elektrik-Bilder</b>
    <div class="layout horizontal wrap">
      <FileUpload label="Zählerschrank offen" filekey="zahlerschrank_offen" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" />
      <FileUpload label="Zählerschrank geschlossen (von weitem)" filekey="zahlerschrank_geschlossen" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" />
      <FileUpload label="Typenschild Zählerschrank" filekey="zahlerschrank_typshild" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" />
    </div>
    <div class="layout horizontal wrap">
      <FileUpload label="Zähler mit lesbarer Zählernummer" filekey="zahlerschrank_zahlernummer" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" />
      <FileUpload label="Hausanschluss (HAK) innen" filekey="hak_innen" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" />
      <FileUpload label="Hausanschluss (HAK) außen" filekey="hak_aussen" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" />
    </div>
    <b>Raum für mögliche Aufstellorte (Speicher, Wechselrichter, neuer Zählerschrank)</b>
    <div class="layout horizontal wrap">
      <FileUpload label="Aufstellort 1" filekey="aufstellort1" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" />
      <FileUpload label="Aufstellort 2" filekey="aufstellort2" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" />
      <FileUpload label="Panoramaaufnahme" filekey="panorama" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" />
    </div>
    <b>Kabelweg / Erdweg von Garage, Scheune usw.</b>
    <div class="layout horizontal wrap">
      <FileUpload label="Kabelweg 1" filekey="kabelweg1" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" />
      <FileUpload label="Kabelweg 2" filekey="kabelweg2" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" />
      <FileUpload label="Kabelweg 3" filekey="kabelweg3" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" />
      <FileUpload label="Kabelweg 4" filekey="kabelweg4" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" />
    </div>
    <b>Kabelwege / Platz für Wallbox </b>
    <div class="layout horizontal wrap">
      <FileUpload label="Kabelweg Wallbox 1" filekey="kabelweg_wallbox_1" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" />
      <FileUpload label="Kabelweg Wallbox 2" filekey="kabelweg_wallbox_2" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" />
    </div>
    <b>Sonstige Bilder (andere Besonderheiten)</b>
    <div class="layout horizontal wrap">
      <FileUpload label="Bereits vorhandene Wallbox" filekey="vorhandene_wallbox" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" />
      <FileUpload label="Große Verbraucher" filekey="große_verbraucher" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" />
      <FileUpload label="Bereits bestehende PV - Anlage ( mit Typenschild)" filekey="bereits_bestehende_pv" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" />
      <FileUpload label="Falls vorhanden Grundriss (Bei Neubau immer!)" filekey="grundriss" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id" style="margin-right: 1em" />
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
    'data'
  ],

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
    calculateCloud () {
      this.$emit('calculateCloud')
    },
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
        this.data.tab_is_valid = !found
      })
    }
  }

}
</script>