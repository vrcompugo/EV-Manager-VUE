<style lang="css" scoped>
  .assitant .v-btn-toggle {
    height: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
  .assitant .v-btn-toggle:not(.v-btn-toggle--dense) .v-btn.v-btn.v-size--default {
    min-height: 5em;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.6);
    margin: 1em;
    flex: 0 0 250px;
    white-space: normal;
  }
  .assitant .v-btn.v-size--small {
    margin-bottom: 0.4em;
  }
  .assitant .packet-list {
    padding: 1em;
    display: inline-block;
    border: 3px solid transparent
  }
  .assitant .packet-list.recommended {
    border: 3px solid #1B5E20
  }
</style>

<template>
  <div class="main-content assitant flex-1">
    <div style="text-align: right;"><v-btn @click="data.assistant = false; calculateCloud()">Überspringen</v-btn></div>
    <h2>Welches Angebot soll erstellt werden?</h2>
    <v-btn-toggle
      v-model="data.assitant_quote_type"
      variant="text"
    >
      <v-btn value="pv" @click="changeQuoteType('pv')">PV-Anlage</v-btn>
      <v-btn value="roof" @click="changeQuoteType('roof')">Dachsanierung</v-btn>
      <v-btn value="heating" @click="changeQuoteType('heating')">Heizung</v-btn>
      <v-btn value="fuelcell" @click="changeQuoteType('fuelcell')">Brennstoffzelle</v-btn>
    </v-btn-toggle>
    <div v-if="data.assitant_quote_type !== undefined">
      <div v-if="data.assitant_quote_type === 'pv'">
        <h2>Für welchen Kundentyp?</h2>
        <v-btn-toggle
          v-model="data.assitant_customer_type"
        >
          <v-btn value="1">
            1 Roter Kunde:<br>Alles unter Kontrolle
            <v-tooltip
              activator="parent"
              location="bottom"
            >
              asdsd sdc sdc
            </v-tooltip>
          </v-btn>
          <v-btn value="2">2 Gelber Kunde:<br>Das Leben genießen</v-btn>
          <v-btn value="3">3 Grüner Kunde:<br>Auf Nummer sicher</v-btn>
          <v-btn value="4">4 Der blaue Kunde:<br>Nur die Fakten zählen</v-btn>
        </v-btn-toggle>
        <div v-if="data.assitant_customer_type !== undefined">
          <h2>Paketgröße wählen?</h2>
          <v-btn-toggle
            v-model="data.assitant_package_type"
          >
            <div class="layout horizontal">
              <div class="flex" style="border-right: 1px solid #333; ">
                <div :class="(data.assitant_customer_type === '3' || data.assitant_customer_type === '4')?'packet-list recommended':'packet-list'">
                  <b>Cloud Pakete</b><br>
                  <v-btn @click="setPackage('S', 'cloud')" small>Paket S (3000kWh)</v-btn><br>
                  <v-btn @click="setPackage('M', 'cloud')" small>Paket M (4000kWh)</v-btn><br>
                  <v-btn @click="setPackage('L', 'cloud')" small>Paket L (5000kWh)</v-btn><br>
                  <v-btn @click="setPackage('XL', 'cloud')" small>Paket XL (6000kWh)</v-btn><br>
                  <v-btn @click="setPackage('XL-pro', 'cloud')" small>Paket XL-pro (7500kWh)</v-btn><br>
                  <v-btn @click="setPackage('XXL', 'cloud')" small>Paket XXL (9000kWh)</v-btn><br>
                  <v-btn @click="setPackage('XXXL', 'cloud')" small>Paket XXXL (11000kWh)</v-btn>
                </div>
              </div>
              <div class="flex" style="margin-left: 1em">
                <div :class="(data.assitant_customer_type === '1' || data.assitant_customer_type === '2')?'packet-list recommended':'packet-list'">
                  <b>Synergie360 Pakete</b><br>
                  <v-btn @click="setPackage('S')" small>Paket S (3000kWh)</v-btn><br>
                  <v-btn @click="setPackage('M')" small>Paket M (4000kWh)</v-btn><br>
                  <v-btn @click="setPackage('L')" small>Paket L (5000kWh)</v-btn><br>
                  <v-btn @click="setPackage('XL')" small>Paket XL (6000kWh)</v-btn><br>
                  <v-btn @click="setPackage('XL-pro')" small>Paket XL-pro (7500kWh)</v-btn><br>
                  <v-btn @click="setPackage('XXL')" small>Paket XXL (9000kWh)</v-btn><br>
                  <v-btn @click="setPackage('XXXL')" small>Paket XXXL (11000kWh)</v-btn>
                </div>
              </div>
            </div>
          </v-btn-toggle>
          <div v-if="data.assitant_package_type !== undefined" style="text-align: center;">
            <v-btn @click="data.assistant = false; calculateCloud()">Weiter</v-btn>
          </div>
        </div>
      </div>
      <div v-else style="text-align: center;">
        <v-btn @click="data.assistant = false; calculateCloud()">Weiter</v-btn>
      </div>
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
        },
        assitant_quote_type: undefined,
        assitant_customer_type: undefined,
        assitant_package_type: undefined,
      }
    },

    mounted () {
    },

    methods: {
      changeQuoteType (quote_type) {
        this.data.has_pv_quote = false
        this.data.has_heating_quote = false
        this.data.has_roof_reconstruction_quote = false
        this.data.has_bluegen_quote = false
        if (quote_type === 'pv') {
          this.data.has_pv_quote = true
        }
        if (quote_type === 'heating') {
          this.data.has_heating_quote = true
        }
        if (quote_type === 'roof') {
          this.data.has_roof_reconstruction_quote = true
        }
        if (quote_type === 'fuelcell') {
          this.data.has_bluegen_quote = true
        }
        this.calculateCloud()
      },
      setPackage (option, type) {
        let pv_modules = 0
        this.data.cloud_quote_type = "synergy"
        if (type === 'cloud') {
          this.data.cloud_quote_type = ""
        }
        switch(option) {
          case 'S':
            this.data.power_usage = 3000
            this.data.heater_usage = 0
            if (type === 'cloud') {
              this.data.overwrite_storage_size = 5
              pv_modules = 12
            } else {
              this.data.overwrite_storage_size = 0
              pv_modules = 14
            }
            break
          case 'M':
            this.data.power_usage = 4000
            this.data.heater_usage = 0
            if (type === 'cloud') {
              this.data.overwrite_storage_size = 5
              pv_modules = 18
            } else {
              this.data.overwrite_storage_size = 0
              pv_modules = 19
            }
            break
          case 'L':
            this.data.power_usage = 5000
            this.data.heater_usage = 0
            if (type === 'cloud') {
              this.data.overwrite_storage_size = 5
              pv_modules = 22
            } else {
              this.data.overwrite_storage_size = 0
              pv_modules = 24
            }
            break
          case 'XL':
            this.data.power_usage = 6000
            this.data.heater_usage = 0
            if (type === 'cloud') {
              this.data.overwrite_storage_size = 7.5
              pv_modules = 30
            } else {
              this.data.overwrite_storage_size = 0
              pv_modules = 28
            }
            break
          case 'XL-pro':
            this.data.power_usage = 7500
            this.data.heater_usage = 0
            if (type === 'cloud') {
              this.data.overwrite_storage_size = 7.5
              pv_modules = 38
            } else {
              this.data.overwrite_storage_size = 0
              pv_modules = 35
            }
            break
          case 'XXL':
            this.data.power_usage = 9000
            this.data.heater_usage = 0
            if (type === 'cloud') {
              this.data.overwrite_storage_size = 10
              pv_modules = 46
            } else {
              this.data.overwrite_storage_size = 0
              pv_modules = 42
            }
            break
          case 'XXXL':
            this.data.power_usage = 11000
            this.data.heater_usage = 0
            if (type === 'cloud') {
              this.data.overwrite_storage_size = 10
              pv_modules = 52
            } else {
              this.data.overwrite_storage_size = 0
              pv_modules = 52
            }
            break
        }
        if (pv_modules > 0) {
          if (this.data.roofs.length > 0){
            this.data.roofs[0]["pv_count_modules"] = pv_modules
            this.data.roofs[0]["direction"] = 'west_east'
            if (!this.data.roofs[0]["roof_type"]) {
              this.data.roofs[0]["roof_type"] = 'Sattel'
            }
            if (!this.data.roofs[0]["insulation_type"]) {
              this.data.roofs[0]["insulation_type"] = 'Zwischensparrendämmung'
            }
            if (!this.data.roofs[0]["label"]) {
              this.data.roofs[0]["label"] = 'Hauptdach'
            }
            if (!this.data.roofs[0]["roof_topping"]) {
              this.data.roofs[0]["roof_topping"] = 'Wellblech'
            }
            if (!this.data.roofs[0]["roof_type"]) {
              this.data.roofs[0]["roof_type"] = 'Sattel'
            }
            if (!this.data.roofs[0]["traufhohe"]) {
              this.data.roofs[0]["traufhohe"] = 5
            }
            this.data.roofs[0]["is_valid"] = true
            this.data.roofs[0]["is_valid_header"] = true
            this.data.roofs[0]["is_valid_body"] = true
          } else {
            this.data.roofs.push({
              direction: 'west_east',
              pv_count_modules: pv_modules,
              insulation_type: "Zwischensparrendämmung",
              label: "Hauptdach",
              roof_topping: "Wellblech",
              roof_type: "Sattel",
              traufhohe: 5,
              is_valid: true,
              is_valid_header: true,
              is_valid_body: true
            })
          }
        }
        this.calculateCloud()
      },
      calculateCloud () {
        this.$emit('calculateCloud')
      },
    }

  }
  </script>