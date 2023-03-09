<style lang="scss">
  .image-placeholder {
    display: inline-block;
    width: 19em;
    height: 11em;
    background-color: #cccccc;
  }
  .file-upload {
    margin-bottom: 1em;
  }
</style>


<template>
  <div v-if="data">
    <div style="padding: 0.4em 0.8em;">
      <div style="font-weight: bold; font-size: 1.3em;">{{ contact.first_name }} {{ contact.last_name }}</div>
      <div>{{ contact.street }} {{ contact.street_nb }} {{ contact.zip }} {{ contact.city }}</div>
      <br>
      <div v-if="data.has_pv_quote">
        <v-expansion-panels style="margin-bottom: 8px;">
          <v-expansion-panel>
            <v-expansion-panel-header>
              <b style="font-size: 1.1em">PV-Bilder</b>
            </v-expansion-panel-header>
            <v-expansion-panel-content style="text-align: center; justify-content: center;">
              <b>Hausfront (wenn möglich Gesamtansicht)</b>
              <FileUpload ref="hausfront1" label="Hausfront 1" filekey="hausfront1" filetype="jpg" path="Dachbilder" required v-model="data" :id="id" @input="calculateCloud"  />
              <FileUpload ref="hausfront2" label="Hausfront 2" filekey="hausfront2" filetype="jpg" path="Dachbilder" required v-model="data" :id="id" @input="calculateCloud"  />
              <FileUpload label="Hausfront 3" filekey="hausfront3" filetype="jpg" path="Dachbilder" v-model="data" :id="id" @input="calculateCloud"  />
              <b>Gartenansicht</b>
              <FileUpload ref="gartenansicht1" label="Rückseite 1" filekey="gartenansicht1" filetype="jpg" path="Dachbilder" required v-model="data" :id="id" @input="calculateCloud"  />
              <FileUpload label="Rückseite 2" filekey="gartenansicht2" filetype="jpg" path="Dachbilder" v-model="data" :id="id" @input="calculateCloud"  />
              <FileUpload label="Rückseite 3" filekey="gartenansicht3" filetype="jpg" path="Dachbilder" v-model="data" :id="id" @input="calculateCloud"  />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

        <b>Dachflächen</b>
        <v-expansion-panels>
          <v-expansion-panel v-for="(roof, index) in data.roofs" :key="index">
            <v-expansion-panel-header>
              {{ index + 1 }}: {{ roof.label }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <FileUpload label="Dach von Vorne" :filekey="`dachflache${index+1}_1`" samplefile="dachflache1.jpg" filetype="jpg" path="Dachbilder" v-model="data" :id="id"  @input="calculateCloud" />
              <FileUpload label="Dach von der Seite" :filekey="`dachflache${index+1}_2`" samplefile="dachflache2.jpg"  filetype="jpg" path="Dachbilder" v-model="data" :id="id"  @input="calculateCloud" />
              <FileUpload label="Dach von Hinten" :filekey="`dachflache${index+1}_3`" samplefile="dachflache3.jpg"  filetype="jpg" path="Dachbilder" v-model="data" :id="id"  @input="calculateCloud" />
              <FileUpload label="Sparrenansicht und Dicke der Sparren" :filekey="`dachflache${index+1}_4`" samplefile="dachinnen3.jpg" filetype="jpg" path="Dachbilder" v-model="data" :id="id"  @input="calculateCloud" />
              <FileUpload v-if="index == 0" label="SolarEdge 3D Ansicht" filekey="solaredge" filetype="pdf" path="Dachbilder" v-model="data" :id="id"  @input="calculateCloud" />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>

      <div v-if="data.has_pv_quote || data.has_heating_quote || data.has_bluegen_quote">
        <v-expansion-panels style="margin-top: 8px;">
          <v-expansion-panel>
            <v-expansion-panel-header>
              <b style="font-size: 1.1em">Elektrik-Bilder</b>
            </v-expansion-panel-header>
            <v-expansion-panel-content style="text-align: center; justify-content: center;">
              <FileUpload ref="zahlerschrank_offen" required label="Zählerschrank offen" filekey="zahlerschrank_offen" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id"  @input="calculateCloud" class="file-upload" />
              <FileUpload ref="zahlerschrank_geschlossen" required label="Zählerschrank Umgebung" filekey="zahlerschrank_geschlossen" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id"  @input="calculateCloud" class="file-upload" />
              <FileUpload ref="zahlerschrank_typshild" required label="Typenschild Zählerschrank" filekey="zahlerschrank_typshild" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id"  @input="calculateCloud" class="file-upload" />

              <FileUpload ref="hak_innen" required label="Hausanschluss (HAK)" filekey="hak_innen" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id"  @input="calculateCloud" class="file-upload" />
              <FileUpload ref="zahlerschrank_zahlernummer" v-if="!data.is_new_building" label="Hauptzähler mit lesbarer Zählernummer" filekey="zahlerschrank_zahlernummer" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id"  required @input="calculateCloud" class="file-upload" />
              <FileUpload v-if="!data.is_new_building && data.heater_usage > 0" label="Wärmezähler mit lesbarer Zählernummer" filekey="zahlerschrank_warmezahlernummer" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id"  @input="calculateCloud" class="file-upload" />
              <FileUpload v-if="!data.is_new_building && data.power_meter_number_extra1_label || data.power_meter_number_extra1" label="Extra Zähler 1 mit lesbarer Zählernummer" filekey="zahlerschrank_zahlernummer1" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id"  @input="calculateCloud" class="file-upload" />
              <FileUpload v-if="!data.is_new_building && data.power_meter_number_extra2_label || data.power_meter_number_extra2" label="Extra Zähler 2 mit lesbarer Zählernummer" filekey="zahlerschrank_zahlernummer2" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id"  @input="calculateCloud" class="file-upload" />

              <b>Raum für mögliche Aufstellorte (Speicher, Wechselrichter, neuer Zählerschrank)</b>
              <FileUpload ref="aufstellort1" required label="Aufstellort 1" filekey="aufstellort1" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id"  @input="calculateCloud" class="file-upload" />
              <FileUpload ref="aufstellort2" required label="Aufstellort 2" filekey="aufstellort2" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id"  @input="calculateCloud" class="file-upload" />
              <FileUpload label="Panoramaaufnahme" filekey="panorama" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id"  @input="calculateCloud" class="file-upload" />
              <b>Kabelweg / Erdweg von Garage, Scheune usw.</b>
              <FileUpload ref="kabelweg1" required label="Kabelweg 1" filekey="kabelweg1" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id"  @input="calculateCloud" class="file-upload" />
              <FileUpload ref="kabelweg2" required label="Kabelweg 2" filekey="kabelweg2" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id"  @input="calculateCloud" class="file-upload" />
              <FileUpload label="Kabelweg 3" filekey="kabelweg3" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id"  @input="calculateCloud" class="file-upload" />
              <FileUpload label="Kabelweg 4" filekey="kabelweg4" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id"  @input="calculateCloud" class="file-upload" />
              <FileUpload label="Kabelweg 5" filekey="kabelweg5" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id"  @input="calculateCloud" class="file-upload" />
              <FileUpload label="Kabelweg 6" filekey="kabelweg6" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id"  @input="calculateCloud" class="file-upload" />
              <div v-if="data.extra_options && data.extra_options.indexOf('wallbox') >= 0">
                <b>Kabelwege / Platz für Wallbox </b>
                <FileUpload label="Kabelweg Wallbox 1" filekey="kabelweg_wallbox_1" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id"  @input="calculateCloud" class="file-upload" />
                <FileUpload label="Kabelweg Wallbox 2" filekey="kabelweg_wallbox_2" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id"  @input="calculateCloud" class="file-upload" />
              </div>
              <b>Sonstige Bilder (andere Besonderheiten)</b>
              <FileUpload label="Bereits vorhandene Wallbox" filekey="vorhandene_wallbox" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id"  @input="calculateCloud" class="file-upload" />
              <FileUpload label="Große Verbraucher" filekey="große_verbraucher" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id"  @input="calculateCloud" class="file-upload" />
              <FileUpload label="Bereits bestehende PV - Anlage ( mit Typenschild)" filekey="bereits_bestehende_pv" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id"  @input="calculateCloud" class="file-upload" />
              <FileUpload label="Falls vorhanden Grundriss (Bei Neubau immer!)" filekey="grundriss" filetype="jpg" path="Elektrik-Bilder" v-model="data" :id="id"  @input="calculateCloud" class="file-upload" />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </div>
  </div>
</template>

<script>
import FileUpload from '~/components/quote_calculator/fileupload'

export default {
  auth: false,

  components: {
    FileUpload
  },

  mounted(){
  },

  async asyncData({ $auth, params, $axios }) {
    const data = {
      "token": params.token
    }
    const quoteData = await $axios.get(`/quote_calculator/uploader/${params.token}`)
    data.data = quoteData.data.data.data
    data.contact = quoteData.data.data.contact
    data.id = quoteData.data.data.id
    $auth.setUserToken(params.token)
    return data
  },

  data(){
    return {
      data: undefined,
    }
  },

  methods: {
    calculateCloud () {
      this.$axios.post(`/quote_calculator/${this.id}/uploader_store`, this.data).then(response => {
        data.data = response.data.data
      })
    }
  }

}
</script>
