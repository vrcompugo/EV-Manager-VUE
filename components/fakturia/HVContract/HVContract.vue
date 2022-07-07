<template>
  <div>
    <h2>Abo</h2>
    <ContractNumber :deal="deal" @loading="$emit('loading')" @error="$emit('error', $event)" @success="$emit('success')" />

    <br>
    Hauptauftrag: <a :href="deal.link" target="_blank">{{ deal.title }}</a><br>
    Vertragsbeginn: {{ deal.begindate | dateFormat }}<br>
    <br>
    <div v-if="deal.contract_number !== undefined && deal.contract_number !== null && deal.contract_number !== ''">
      <ItemList :deal="deal" @loading="$emit('loading')" @error="$emit('error', $event)" @success="$emit('success')" />
      <br>
      <FakturiaData :deal="deal" @loading="$emit('loading')" @error="$emit('error', $event)" @success="$emit('success')" />
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
    }
  }

}
</script>