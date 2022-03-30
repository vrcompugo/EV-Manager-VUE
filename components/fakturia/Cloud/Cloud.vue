<template>
  <div>
    <h2>Cloud Abo</h2>
    Cloud Angebotsnummer: {{ deal.cloud_number }}<br>
    Cloud <ContractNumber :deal="deal" @loading="$emit('loading')" @error="$emit('error', $event)" @success="$emit('success')" /><br>
    Hauptauftrag: <a :href="deal.link" target="_blank">{{ deal.title }}</a><br>
    Lieferbegin: {{ deal.cloud_delivery_start | dateTimeFormat }}<br>
    <v-btn :href="sherpa_link()" target="_blank">Sherpa Excel runterladen</v-btn><br>
    <br>
    <div v-if="deal.cloud_contract_number !== undefined && deal.cloud_contract_number !== null && deal.cloud_contract_number !== ''">
      <ItemList :deal="deal" @loading="$emit('loading')" @error="$emit('error', $event)" @success="$emit('success')" />
      <div v-if="deal.unassigend_deals && deal.unassigend_deals.length > 0">
        <b>Aufträge ohne Zuordnung:</b><br>
        <div class="cloud_deals">
          <table>
            <tr>
              <th>Bezeichnung</th>
              <th>Ist Consumer</th>
              <th>Ist eCloud</th>
              <th>Ist Wärmecloud</th>
              <th>Cloudtyp</th>
            </tr>
            <tr v-for="subdeal in deal.unassigend_deals" :key="subdeal.id">
              <td><a :href="subdeal.link" target="_blank">{{ subdeal.title }}</a></td>
              <td>{{ subdeal.is_cloud_consumer }}</td>
              <td>{{ subdeal.is_cloud_ecloud }}</td>
              <td>{{ subdeal.is_cloud_heatcloud }}</td>
              <td>{{ subdeal.cloud_type }}</td>
            </tr>
          </table>
        </div>
      </div>
      <br>
      <FakturiaData :deal="deal" @loading="$emit('loading')" @error="$emit('error', $event)" @success="$emit('success')" />
      <div style="padding-bottom: 2em" v-if="deal.fakturia">
        <br>
        <h2>Jahres-Abrechnung:</h2>
        <b>Vorauszahlungen 2021:</b><br>
        <div v-for="(item, index) in deal.fakturia.invoices" :key="index" class="invoice">
          <div class="layout horizontal">
            <div style="flex: 0 0 10em">{{ item.number }}</div>
            <div>{{ item.amountGross | formatPrice }}</div>
          </div>
        </div>
        <br>
        <b>Verbräuchsdaten 2021:</b><br>
        ...<br>
        <br>
        <b>Prognose 2021:</b><br>
        ...<br>
        <br>

        <b>Vorauszahlungen 2020:</b><br>
        ...<br>
        <br>
        <b>Verbräuchsdaten 2020:</b><br>
        ...<br>
        <br>
        <b>Abrechnung 2020:</b><br>
        ...<br>

      </div>
    </div>
  </div>
</template>

<script>
import ContractNumber from '~/components/fakturia/ContractNumber'
import FakturiaData from '~/components/fakturia/FakturiaData/FakturiaData.vue'
import ItemList from '~/components/fakturia/ItemList/ItemList.vue'

export default {

  components: {
    ContractNumber,
    FakturiaData,
    ItemList
  },

  props: {
    deal: {
      type: Object,
      default: undefined,
      required: true
    },
    dealId: {
      type: String,
      default: undefined,
      required: false
    }
  },

  methods: {
    sherpa_link(){
      const token = this.$auth.getToken("local")
      return `/fakturia/${this.dealId}/sherpa_export?token=${token}`
    }
  }

}
</script>