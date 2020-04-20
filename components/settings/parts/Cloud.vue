<template>
  <div>
    <b>Basisartikel Konfiguration</b>


    <b>Preisstaffeln</b>
    <div>
      <v-card v-for="(product, index) in settings.cloud_prices" :key="product.price" style="margin-bottom: 1em;">
        <div style="flex: 1">
          <v-text-field
            label="Paket Von"
            type="number"
            v-model="product.paket_range_start"></v-text-field>
          <v-text-field
            label="Paket Bis"
            type="number"
            v-model="product.paket_range_end"></v-text-field>
          <v-text-field
            label="Preis"
            type="number"
            step="0.01"
            v-model="product.price"></v-text-field>
        </div>
        <v-btn @click="settings.cloud_prices.splice(index, 1)"><v-icon>mdi-delete</v-icon></v-btn>
      </v-card>
      <v-btn @click="settings.cloud_prices.push({})"><v-icon>mdi-plus</v-icon></v-btn>
    </div>
    <b>Consumer</b>
    <v-text-field
      label="Consumer Extra Basispreis"
      type="number"
      step="0.01"
      v-model="settings.consumer_base_cost"></v-text-field>
  </div>
</template>


<script>

export default {

  props: ["settings"]

}

</script>
