<style lang="scss" scoped>

</style>


<template>
  <div class="main-content">
    Jetzt im Reiter Fakturia (beta)
  </div>
</template>



<script>

export default {

  components: {
  },
  data () {
    return {
      loading_contact_number: false
    }
  },
  async asyncData(context) {
    const data = {
      "order_id": context.query.order_id
    }
    return data
  },
  methods: {
    generateContractNumber(){
      this.loading_contact_number = true
      this.$axios.post(`/bitrix24/cloud_data/generate_contract_number/${this.order_id}`).then(response => {
        console.log("success", response)
      }).catch(error => {
        this.error = true
      }).finally(() => {
        this.loading_contact_number = false
      })
    },
    sherpa_link(){
      const token = this.$auth.getToken("local")
      return `/bitrix24/cloud_data/sherpa_export/${this.order_id}/${token}`
    }
  }
}
</script>
