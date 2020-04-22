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
    <b>Laufzeiten</b>
    <v-text-field
      label="Kündigungsfrist"
      v-model="settings.notice_period"></v-text-field>
    <v-text-field
      label="Vertragslaufzeit"
      v-model="settings.contract_run_time"></v-text-field>
    <v-text-field
      label="garantierte Zero-Laufzeit für (a)"
      v-model="settings.guaranteed_run_time"></v-text-field>
    <br>
    <b>Consumer</b>
    <v-text-field
      label="Consumer Extra Basispreis"
      type="number"
      step="0.01"
      v-model="settings.consumer_base_cost"></v-text-field>
    <br>
    <b>Mehrverbrauch</b>
    <v-text-field
      label="Kosten pro kwh in Cent"
      type="number"
      step="0.01"
      v-model="settings.extra_kwh_cost"></v-text-field>

    <b>Extra Produkte</b>
    <div class="spaced-horizontal">
      <v-card v-for="(product, index) in settings.extra_products" :key="product.label" style="margin-bottom: 1em;">
        <div style="flex: 1">
          <v-text-field
            label="Bezeichnung"
            v-model="product.label"></v-text-field>
          <v-text-field
            label="Sortierung"
            type="number"
            v-model="product.order"></v-text-field>
          <v-text-field
            label="Artikel"
            v-model="product.product_link"></v-text-field>
          <v-text-field
            label="Artikelordner"
            v-model="product.product_folder"></v-text-field>
          Immer im Angebot hinzufügen?
          <v-radio-group v-model="product.include_always" row>
            <v-radio label="Als 1-Produkt" value="top-one"></v-radio>
            <v-radio label="Als 0-Produkt" value="top"></v-radio>
          </v-radio-group>
          <v-checkbox v-model="product.is_packet_relative" label="Ist abhängig vom gewählten Paket"></v-checkbox>
        </div>
        <v-btn @click="settings.extra_products.splice(index, 1)"><v-icon>mdi-delete</v-icon></v-btn>
      </v-card>
      <v-btn @click="settings.extra_products.push({})"><v-icon>mdi-plus</v-icon></v-btn>
    </div>
  </div>

</template>


<script>

export default {

  props: ["settings"]

}

</script>
