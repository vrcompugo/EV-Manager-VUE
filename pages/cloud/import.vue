<style scoped>
</style>
<template>
  <div>
    <v-file-input
      v-model="invoicesArchive"
      label="Sherpa Rechnungen Zip" />
    <v-btn @click="uploadInvoices">Upload Zip</v-btn>
    <v-snackbar v-model="errorSnack">
      {{ errorMessage }}
      <v-btn text @click="errorSnack = false">
        Schließen
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
export default {


  mounted () {
  },

  data(){
    return {
      invoicesArchive: null,
      loading: false,
      errorSnack: false,
      errorMessage: ''
    }
  },

  methods: {
    async uploadInvoices () {
      this.loading = true
      const formData = new FormData();
      formData.append("invoices", this.invoicesArchive);
      await this.$axios.post(`/cloud2/import`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then(response => {
          commit('setContract', response.data.data)
          resolve(response.data.data)
        })
        .catch (error => this.showError(error))
      this.loading = false
    },
    showError (error) {
      this.errorMessage = 'Unbekannter Server Fehler'
      if (error.response && error.response.data) {
        this.errorMessage = error.response.data.message
      }
      if (error.response && error.response.data) {
        this.errorMessage = error.response.data.message
      }
      this.errorSnack = true
    }
  }
}
</script>
