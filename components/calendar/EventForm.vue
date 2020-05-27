<style lang="scss" scoped>
  .color-dot {
    border-radius: 3px;
    display: inline-block;
    color: #ffffff;
    padding: 0.2em 0.3em;
    font-size: 0.9em;
    min-width: 5em;
  }
  .v-radio {
    margin-right: 1em;
  }
</style>

<template>
  <div>
    <div>
      <v-text-field
        label="Bezeichnung"
        v-model="item.label" />
    </div>
    <div>
      <v-textarea
        label="Beschreibung"
        v-model="item.comment" />
    </div>
    <div style="display: flex; align-items: center;">
      <div style="margin-right: 1em;">Spezielle Farbe:</div>
      <v-radio-group v-model="item.color" row>
        <v-radio
          value="">
          <template v-slot:label>
            <div class="color-dot" style="border: 1px solid #333; color:#333;">Standard</div>
          </template>
        </v-radio>
        <v-radio
          color="#D32F2F"
          value="#D32F2F">
          <template v-slot:label>
            <div class="color-dot" style="background-color: #D32F2F">Rot</div>
          </template>
        </v-radio>
        <v-radio
          color="#7B1FA2"
          value="#7B1FA2">
          <template v-slot:label>
            <div class="color-dot" style="background-color: #7B1FA2">Purpur</div>
          </template>
        </v-radio>
        <v-radio
          color="#512DA8"
          value="#512DA8">
          <template v-slot:label>
            <div class="color-dot" style="background-color: #512DA8">Lila</div>
          </template>
        </v-radio>
        <v-radio
          color="#1976D2"
          value="#1976D2">
          <template v-slot:label>
            <div class="color-dot" style="background-color: #1976D2">Blau</div>
          </template>
        </v-radio>
        <v-radio
          color="#388E3C"
          value="#388E3C">
          <template v-slot:label>
            <div class="color-dot" style="background-color: #388E3C">Grün</div>
          </template>
        </v-radio>
        <v-radio
          color="#F57C00"
          value="#F57C00">
          <template v-slot:label>
            <div class="color-dot" style="background-color: #F57C00">Orange</div>
          </template>
        </v-radio>
        <v-radio
          color="#5D4037"
          value="#5D4037">
          <template v-slot:label>
            <div class="color-dot" style="background-color: #5D4037">Braun</div>
          </template>
        </v-radio>
      </v-radio-group>
    </div>
    <v-row no-gutters>
      <v-col cols="12" sm="6">
        <v-datetime-picker
          label="Anfangsdatum"
          clearText="Leeren"
          dateFormat="dd.MM.yyyy"
          :datePickerProps='{"color": "#1976D2", "locale": "de-de", "first-day-of-week": 1, "show-week": true}'
          :timePickerProps='{"color": "#1976D2", "format": "24hr"}'
          v-model="item.begin">
          <template v-slot:dateIcon>
            Datum
          </template>
          <template v-slot:timeIcon>
            Uhrzeit
          </template>
        </v-datetime-picker>
      </v-col>
      <v-col cols="12" sm="6">
        <v-datetime-picker
          label="Abschlussdatum"
          clearText="Leeren"
          dateFormat="dd.MM.yyyy"
          :datePickerProps='{"color": "#1976D2", "locale": "de-de", "first-day-of-week": 1, "show-week": true}'
          :timePickerProps='{"color": "#1976D2", "format": "24hr"}'
          v-model="item.end">
          <template v-slot:dateIcon>
            Datum
          </template>
          <template v-slot:timeIcon>
            Uhrzeit
          </template>
        </v-datetime-picker>
      </v-col>
    </v-row>
    <div v-if="item.as_task || (item.task && item.task.id)">
      <PersonSelector label="Verantwortliche Person" v-model="item.task.user" />
    </div>
    <div v-if="!(item.as_task || (item.task && item.task.id))">
      <PersonSelector label="Verantwortliche Person" v-model="item.user" />
    </div>

    <div>
      <OrderSelector label="Auftragsauswahl" v-model="item.order" />
    </div>
    <div v-if="!item.order">
      <CustomerSelector label="Kundenauswahl" v-model="item.customer" />
    </div>
    <v-checkbox
      v-model="item.as_task"
      label="Als Aufgabe anlegen"
      v-if="!item.task || !item.task.id" />

    <div v-if="item.as_task || (item.task && item.task.id)">
      <PersonSelector label="Mitwirkende Personen" clearable multiple v-model="item.task.members" />
    </div>
  </div>
</template>

<script>
import OrderSelector from '~/components/bitrix24/OrderSelector'
import CustomerSelector from '~/components/bitrix24/CustomerSelector'
import PersonSelector from '~/components/bitrix24/PersonSelector'

export default {
  props: ["item"],

  components: {
    OrderSelector,
    CustomerSelector,
    PersonSelector
  },

  data(){
    return {
      "begin_date": "2020-04-01",
      "begin_time": "10:00:00",
      "as_task": false,
      "show_begin": false,
      "show_end": false,
      "begin_dialog": false
    }
  }
}
</script>
