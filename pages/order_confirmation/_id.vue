<style lang="scss" scoped>

</style>


<template>
  <div class="layout vertical" style="max-height: 100%;">
    <iframe :src="pdf_link" class="flex-1" style="border: none"></iframe>
    <div>
      <div class="actions">
        <div class="flex-1"></div>
        <v-btn v-if="checkBookkeepingRights()" @click="generateQuote" style="margin-left: 1em" :loading="loading">PDF neu erstellen</v-btn>
        <v-btn v-if="pdf_link && checkBookkeepingRights()" :href="pdf_link" style="margin-left: 1em" target="_blank">Link</v-btn>
      </div>
    </div>

  </div>
</template>

<script>

export default {

  components: {
  },

  mounted(){
    this.loadPDF()
  },

  data(){
    return {
      "id": undefined,
      "pdf_link": undefined,
      "data": {},
      "loading": false
    }
  },

  async asyncData({ $axios, params }) {
    const data = {
      "id": params.id,
    }
    return data
  },

  computed: {
  },

  methods: {
    checkBookkeepingRights(){
      let result = false
      const departments = ["Innendienst", "After Sales ???", "After Sales Neu", "Buchhaltung", "Extern IT Unterstützung", "KeSO", "Termine & Planung"]
      for(let i=0; i<departments.length; i++){
        if (this.$auth.user.bitrix_department.indexOf(departments[i]) >= 0){
          return true
        }
      }
      return false
    },
    loadPDF(){
      this.loading = true
      this.$axios.post(`/order_confirmation/${this.id}/PDF`, this.data).then(response => {
        this.pdf_link = response.data.data.pdf_link
        this.loading = false
      }).catch(err => {
        this.calculated["invalid_form"] = true
        if (!this.calculated["errors"]) {
          this.calculated["errors"] = []
        }
        const result = err.response.data
        this.calculated["errors"].push(result.message)
        this.loading = false
      })
    },
    generateQuote(){
      this.loading = true
      this.$axios.post(`/order_confirmation/${this.id}/generate`, this.data).then(response => {
        this.pdf_link = response.data.data.pdf_link
        this.loading = false
      }).catch(err => {
        this.calculated["invalid_form"] = true
        if (!this.calculated["errors"]) {
          this.calculated["errors"] = []
        }
        const result = err.response.data
        this.calculated["errors"].push(result.message)
        this.loading = false
      })
    }
  }
}
</script>
