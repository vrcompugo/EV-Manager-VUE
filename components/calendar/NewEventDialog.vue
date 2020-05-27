<template>
  <v-dialog v-model="dialog" max-width="1400" transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar color="#1976D2">
        <v-toolbar-title style="color: white;">Neuer Termin für {{ item.user.name }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <EventForm :item="item"></EventForm>
        <br>
        <hr>
        <br>
        <div style="text-align: right">
          <v-btn @click="dialog = false">
            Abbrechen
          </v-btn>
          <v-btn @click="save()" color="#1976D2" style="color: #ffffff">
            Speichern
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import EventForm from './EventForm'

export default {

  props: ["item"],

  data() {
    return {
      "dialog": false
    }
  },

  components: {
    EventForm
  },

  methods: {
    show(){
      this.dialog = true
    },
    save(){
      this.$emit('storeItem', {
        "item":this.item
      })
      this.dialog = false
    }
  }
}
</script>
