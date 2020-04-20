

<template>
  <div>
    <b>Berechnungsgrundlage</b>

    <div class="spaced-horizontal">
      <v-text-field
        label="Paketgrenze für Gewerbliche Nutzung"
        v-model="wi_settings.paket_limit_commercial"
        type="number"
        step="5" ></v-text-field>
      <v-text-field
        label="Paketgrenze für EEG-Umlage"
        v-model="wi_settings.paket_limit_eeg"
        type="number"
        step="5" ></v-text-field>
    </div>
    <div class="spaced-horizontal">
      <v-text-field
        label="Grundgebühr Haushaltsstrom (Brutto)"
        v-model="wi_settings.conventional_base_cost_per_year"
        type="number"
        step="5" ></v-text-field>

      <v-text-field
        label="Zähler Strompreis (Brutto)"
        v-model="wi_settings.conventional_base_cost_per_kwh"
        type="number" ></v-text-field>
      <v-text-field
        label="Finanzierungs-Soll-Zinssatz"
        v-model="wi_settings.loan_interest_rate"
        type="number" ></v-text-field>
    </div>
    <div class="spaced-horizontal">
      <v-text-field
        label="EEG-Einspeisevergütung"
        v-model="wi_settings.eeg_refund_per_kwh"
        type="number" ></v-text-field>
      <v-text-field
        label="Einspeisevergütung nach Ablauf EEG"
        v-model="wi_settings.refund_per_kwh"
        type="number" ></v-text-field>
    </div>

    <b>Ertrag der PV-Anlage</b>
    <div class="spaced-horizontal">
      <v-text-field
        label="Nord"
        v-model="wi_settings.pv_efficiancy.north"
        type="number" ></v-text-field>
      <v-text-field
        label="West/Ost"
        v-model="wi_settings.pv_efficiancy.west_east"
        type="number"
        step="5" ></v-text-field>
      <v-text-field
        label="Süd"
        v-model="wi_settings.pv_efficiancy.south"
        type="number"
        step="5" ></v-text-field>
    </div>
    <b>Auswahlmöglichkeiten zur Laufzeit</b>
    <div class="spaced-horizontal">
      <v-card v-for="(price, index) in wi_settings.run_times" :key="price">
        <v-text-field
          label="Laufzeit"
          v-model="wi_settings.run_times[index]"
          type="number"
          step="5" ></v-text-field>
        <v-btn @click="wi_settings.run_times.splice(index, 1)"><v-icon>mdi-delete</v-icon></v-btn>
      </v-card>
      <v-btn @click="wi_settings.run_times.push({})"><v-icon>mdi-plus</v-icon></v-btn>
    </div>

    <br>
    <b>Auswahlmöglichkeiten zur Preissteigerung</b>
    <div class="spaced-horizontal">
      <v-card v-for="(price, index) in wi_settings.price_increases" :key="price">
        <v-text-field
          label="Preissteigerung"
          v-model="wi_settings.price_increases[index]"
          type="number" ></v-text-field>
        <v-btn @click="wi_settings.price_increases.splice(index, 1)"><v-icon>mdi-delete</v-icon></v-btn>
      </v-card>
      <v-btn @click="wi_settings.price_increases.push({})"><v-icon>mdi-plus</v-icon></v-btn>
    </div>

    <br>
    <b>Auswahlmöglichkeiten zur Inflation</b>
    <div class="spaced-horizontal">
      <v-card v-for="(price, index) in wi_settings.inflations" :key="price" style="display: flex; ">
        <v-text-field
          label="Inflation"
          v-model="wi_settings.inflations[index]"
          type="number" ></v-text-field>
        <v-btn @click="wi_settings.inflations.splice(index, 1)"><v-icon>mdi-delete</v-icon></v-btn>
      </v-card>
      <v-btn @click="wi_settings.inflations.push({})"><v-icon>mdi-plus</v-icon></v-btn>
    </div>
    <br>

    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header>Erläuterungen</v-expansion-panel-header>
        <v-expansion-panel-content>
          <ckeditor type="classic" v-model="wi_settings.disclaimer"></ckeditor>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>Wichtige Hinweise</v-expansion-panel-header>
        <v-expansion-panel-content>
          <ckeditor type="classic" v-model="wi_settings.important_notices"></ckeditor>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>


<script>

export default {

  props: ["wi_settings"]

}

</script>
