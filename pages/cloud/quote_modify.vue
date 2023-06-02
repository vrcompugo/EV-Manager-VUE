<style scoped>
  .code-editor .code-area > textarea {
    color: #000 !important;
  }
</style>
<template>
  <div style="padding: 1em;">
    <v-text-field
      v-model="quoteNumber"
      label="Angebotsnummer" />
    <v-btn
      color="primary"
      @click="getQuote">
      Angebotsdaten laden
    </v-btn>
    <v-btn
      v-if="quote"
      color="primary"
      :href="quote.pdf_link" target="_blank">
      PDF öffnen
    </v-btn>
    <div v-if="quote">
      <div class="layout horizontal">
        <div class="flex" style="margin-right: 1em;">
          <b>Data</b>
          <v-textarea v-model="quote.data_txt" rows="20" />
        </div>
        <div class="flex">
          <b>Kalkulation</b>
          <v-textarea v-model="quote.calculated_txt" rows="20" />
        </div>
      </div>
    </div>
    <v-btn
      v-if="quote"
      color="primary"
      @click="storeQuote">
      Speichern
    </v-btn>

    <v-snackbar v-model="errorSnack">
      {{ errorMessage }}
      <v-btn text @click="errorSnack = false">
        Schließen
      </v-btn>
    </v-snackbar>

    <v-overlay :value="loading">
      <v-progress-circular
        indeterminate
        color="primary"
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
export default {


  mounted () {
  },

  data(){
    return {
      quote: null,
      quoteNumber: '',
      loading: false,
      errorSnack: false,
      errorMessage: ''
    }
  },

  methods: {
    getQuote () {
      this.loading = true
      this.$axios.get('/offers/v2/' + this.quoteNumber)
        .then((response) => {
          this.quote = response.data.data
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          this.errorSnack = true
          this.errorMessage = error.response.data.message
        })
    },
    storeQuote () {
      this.loading = true
      this.$axios.put('/offers/v2/' + this.quoteNumber, this.quote)
        .then((response) => {
          this.quote = response.data.data
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          this.errorSnack = true
          this.errorMessage = error.response.data.message
        })
    }
  }
}
</script>
