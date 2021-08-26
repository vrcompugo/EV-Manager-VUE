<template>
  <span>
    Vertragsnummer: {{ contract_number }}
    <v-btn @click="createContractNumber" v-if="contract_number === ''" small>Vertragsnummer erzeugen</v-btn>
  </span>
</template>

<script>
export default {

  props: {
    deal: {
      type: Object,
      default: undefined,
      required: true
    }
  },

  computed: {
    contract_number () {
      let result
      if (this.deal.category_id === "15") {
        result = this.deal.cloud_contract_number
      }
      if (this.deal.category_id === "68") {
        result = this.deal.service_contract_number
      }
      if (this.deal.category_id === "70") {
        result = this.deal.service_contract_number
      }
      if (result === undefined || result === null || result === 'None') {
        return ''
      }
      return result
    }
  },

  methods: {
    async createContractNumber () {
      this.loading = true
      await this.$store.dispatch('fakturia/createContractNumber', {
        dealId: this.deal.id
      })
      .catch (error => this.showError(error))
      this.reload()
      this.loading = false
    }
  }
}
</script>