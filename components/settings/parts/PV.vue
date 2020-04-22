<template>
  <div>
    <b>Basisartikel Konfiguration</b>


    <b>Auswahlmöglichkeiten Zusatzartikel</b>
    <div>
      <v-card v-for="(product, index) in pv_settings.optional_products" :key="product.label" style="margin-bottom: 1em;">
        <div style="flex: 1">
          <div class="spaced-horizontal">
            <v-text-field
              label="Bezeichnung"
              v-model="product.label"></v-text-field>
            <v-text-field
              label="Sortierung"
              type="number"
              v-model="product.order"></v-text-field>
            <v-checkbox
              v-model="product.has_options"
              label="Hat Optionen"
              v-if="!product.has_special_packet_variants"></v-checkbox>
            <v-checkbox
              v-model="product.has_special_packet_variants"
              label="Hat Spezial Paket Varianten"
              v-if="!product.has_options"></v-checkbox>
          </div>
          <div class="spaced-horizontal" v-if="product.has_special_packet_variants">
            <v-card v-for="(subproduct, index2) in product.variants" :key="subproduct.label" style="margin-bottom: 1em; min-width: 400px">
              <div>
                <v-text-field
                  label="Paket Von"
                  type="number"
                  v-model="subproduct.paket_range_start"></v-text-field>
                <v-text-field
                  label="Paket Bis"
                  type="number"
                  v-model="subproduct.paket_range_end"></v-text-field>
                <v-text-field
                  label="Artikel"
                  v-model="subproduct.product_link"></v-text-field>
                <v-text-field
                  label="Artikelordner"
                  v-model="subproduct.product_folder"></v-text-field>
                <v-text-field
                  label="Extra qm"
                  type="number"
                  v-model="subproduct.extra_qm"></v-text-field>
              </div>
              <v-btn @click="product.variants.splice(index2, 1)" style="margin-left: 1em"><v-icon>mdi-delete</v-icon></v-btn>
            </v-card>
            <v-btn @click="product.variants.push({})"><v-icon>mdi-plus</v-icon></v-btn>
          </div>
          <div class="spaced-horizontal" v-if="!product.has_options && !product.has_special_packet_variants">
            <v-text-field
              label="Artikel"
              v-model="product.product_link"></v-text-field>
            <v-text-field
              label="Artikelordner"
              v-model="product.product_folder"></v-text-field>
            <v-checkbox v-model="product.is_packet_relative" label="Ist abhängig vom gewählten Paket"></v-checkbox>
          </div>
          <div class="spaced-horizontal" v-if="product.has_options">
            <v-card v-for="(subproduct, index2) in product.options" :key="subproduct.label" style="margin-bottom: 1em; min-width: 400px">
              <div>
                <v-text-field
                  label="Artikel"
                  v-model="subproduct.product_link"></v-text-field>
                <v-text-field
                  label="Artikelordner"
                  v-model="subproduct.product_folder"></v-text-field>
                <v-checkbox v-model="subproduct.is_selected" label="Ist Standard"></v-checkbox>
                <v-checkbox v-model="subproduct.is_packet_relative" label="Ist abhängig vom gewählten Paket"></v-checkbox>
              </div>
              <v-btn @click="product.options.splice(index2, 1)" style="margin-left: 1em"><v-icon>mdi-delete</v-icon></v-btn>
            </v-card>
            <v-btn @click="product.options.push({})"><v-icon>mdi-plus</v-icon></v-btn>
          </div>
          Immer im Angebot hinzufügen?
          <v-radio-group v-model="product.include_always" row>
            <v-radio label="Nein" value=""></v-radio>
            <v-radio label="Als 0-Produkt" value="top"></v-radio>
            <v-radio label="Als Zubehör" value="bottom"></v-radio>
          </v-radio-group>
          Verfügbar bei Modulen?
          <v-radio-group v-model="product.for_modules" row>
            <v-radio label="Alle" value=""></v-radio>
            <v-radio label="280W" value="280"></v-radio>
            <v-radio label="390W" value="390"></v-radio>
          </v-radio-group>
        </div>
        <v-btn @click="pv_settings.optional_products.splice(index, 1)"><v-icon>mdi-delete</v-icon></v-btn>
      </v-card>
      <v-btn @click="pv_settings.optional_products.push({'variants':[], 'options':[]})"><v-icon>mdi-plus</v-icon></v-btn>
    </div>
  </div>
</template>


<script>

export default {

  props: ["pv_settings"]

}

</script>
