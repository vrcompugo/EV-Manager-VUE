<style lang="scss" scoped>

</style>


<template>
  <div class="layout vertical" style="max-height: 100%;">
    <div v-if="deal.id">
      <h2>Cloud Abo</h2>
      Cloud Angebotsnummer: {{ deal.cloud_number }}<br>
      Cloud Vertragsnummer: {{ deal.cloud_contract_number }}<br>
      <br>
      <b>Bitrix Status:</b><br>
      Hauptauftrag: <a :href="deal.main_deal.link" target="_blank">{{ deal.main_deal.title }}</a><br>
      <div class="cloud_products">
        <div v-for="(item, index) in deal.deals" :key="index">
          <b>{{ item.cloud_type }}</b><br>
          Lieferbegin: {{ item.cloud_delivery_start | dateTimeFormat }}<br>
          Bitrix-Auftrag: <a :href="item.link" target="_blank">{{ item.title }}</a>
        </div>
      </div>
      <br>
      <b>Fakturia:</b><br>
      Vertragsnummer: {{ deal.cloud_number }}<br>
      Vertragsabschluss: -<br>
      Kündigungsdatum: -<br>
      Vertragsende: -<br>
      Zahlungsinterval: 1 Monat<br>
      Abos:<br>
      <div v-for="(item, index) in deal.fakturia_items" :key="index">
        <b>{{ item.label }}</b><br>
      </div>


      <br>
      <b>Cloud Config:</b><br>
      <div class="cloud_products">
        <div v-for="(item, index) in deal.items" :key="index">
          <b>{{ item.label }}</b><br>
          <div v-html="item.description"></div>
        </div>
      </div>
    </div>
    <div v-else>
      <div v-if="deal.error">
        {{ deal.error }}
      </div>
      <div v-else>
        Cloud Daten nicht gefunden
      </div>
    </div>
  </div>
</template>

<script>

export default {

  components: {
  },

  async fetch ({ store, params }) {
    await store.dispatch('fakturia/loadDealData', {
      dealId: params.id
    })
  },

  data(){
    return {
    }
  },

  computed: {
    deal: function () { return this.$store.getters['fakturia/dealData'] },
  },

  methods: {
    async reload () {
      this.fetch()
    }
  }
}
</script>
