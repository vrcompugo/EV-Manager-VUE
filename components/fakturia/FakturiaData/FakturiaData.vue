<style>

</style>

<template>
  <div>
    <div style="padding-bottom: 2em" v-if="deal.fakturia">
      <br>
      <b>Fakturia:</b><br>

      Vertragsnummer: {{ deal.fakturia.contract_number }}<br>
      Abbrechungsbeginn: {{ deal.fakturia.delivery_begin | dateFormat }}<br>
      Kündigungsdatum: -<br>
      Vertragsende: -<br>
      <div v-if="deal.category_id === '70' || deal.category_id === '68'">
        Zahlungsinterval: 1 Jahr<br>
        Kündigungsfrist: 1 Jahr<br>
      </div>
      <div v-else>
        Zahlungsinterval: 1 Monat<br>
      </div>
      IBAN: {{ deal.fakturia.iban }}<br>
      BIC: {{ deal.fakturia.bic }}<br>
      Inhaber: {{ deal.fakturia.owner }}<br>
      Lastschriftmandat gültig seit: {{ deal.sepa_mandate_since | dateFormat }}
      <br>
      <div class="cloud_products">
      <div v-for="(item, index) in deal.fakturia.items_to_update" :key="index" class="product">
          <div>{{ index + 1 }}</div>
          <div>{{ item.type }}</div>
          <div>
          <small>
              <div v-if="item.label"><b>{{ item.label }}</b></div>
              <div v-html="item.description"></div>
          </small>
          </div>
          <div>
          </div>
          <div style="text-align: right;"><div v-if="item.total_price != 0">{{ item.total_price | formatPrice }}</div></div>
      </div>
      </div>
      <v-btn v-if="deal.fakturia_contract_number" :href="`https://backoffice.fakturia.de/secure/tenant/Contract/ContractEdit.html?preload=${deal.fakturia_contract_number}`" target="_blank">
      In Fakturia öffnen
      </v-btn>
      <v-btn v-if="isAbleToSend" @click="exportFakturia">An Fakturia senden</v-btn>
    </div>
  </div>
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
    isAbleToSend () {
      if (this.deal.category_id === "15") {
        return this.deal.cloud_delivery_start
      }
      if (this.deal.category_id === "176") {
        return this.deal.cloud_delivery_start
      }
      if (this.deal.category_id === "68") {
        return this.deal.activation_date
      }
      if (this.deal.category_id === "70") {
        return this.deal.activation_date
      }
      return false
    }
  },

  methods: {
    async exportFakturia () {
      this.$emit('loading')
      await this.$store.dispatch('fakturia/export', {
        deal: this.deal
      })
      .catch (error => this.$emit('error', error))
      this.$emit('success')
    },
  }
}
</script>