<style>

</style>

<template>
  <div>
    {{ contractNumber }}
    {{ contract }}
    <v-btn @click="reload">load</v-btn>
  </div>
</template>

<script>
export default {

  async asyncData({ $axios, params, route }) {
    return {
      contractNumber: params.id
    }
  },

  mounted () {
    this.reload()
  },

  data(){
    return {
      loading: false,
      errorSnack: false,
      errorMessage: ''
    }
  },

  computed: {
    contract: function () { return this.$store.getters['cloud_contract/contract'] }
  },

  methods: {
    async reload () {
      this.loading = true
      await this.$store.dispatch('cloud_contract/loadContractData', {
        contractNumber: this.contractNumber
      })
      .catch (error => this.showError(error))
      this.loading = false
    }
  }
}
</script>
