<style lang="scss" scoped>

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
