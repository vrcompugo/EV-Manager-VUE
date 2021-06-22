<style lang="scss" scoped>
  .cloud_products .product {
    display: grid;
    grid-template-columns: 2em 7em 1fr 1fr 10em;
    padding: 0.5em;
    border-radius: 5px;
    box-shadow: 1px 1px 4px 0 rgba(0,0,0,0.5);
    margin-bottom: 0.5em;
  }
  .cloud_products .product a {
    color: inherit;
  }
  .cloud_products .product > div {
    padding-right: 1em;
  }
</style>

<template>
  <div>
    <div class="cloud_products" v-if="deal">
      <div v-for="(item, index) in deal.items" :key="index">
        <div class="product" v-if="edited_items.indexOf(index) < 0">
          <div>{{ index + 1 }}</div>
          <div>
            {{ item.type }}
          </div>
          <div>
            <small>
              <div v-if="item.label"><b>{{ item.label }}</b></div>
              <div v-html="item.description"></div>
            </small>
          </div>
          <div style="text-align: right;"><div v-if="item.total_price != 0">{{ item.total_price | formatPrice }}</div></div>
          <div style="text-align: right;"><v-icon @click="edited_items.push(index)">mdi-pencil</v-icon></div>
        </div>
        <div class="product" v-if="edited_items.indexOf(index) >= 0">
          <div>{{ index + 1 }}</div>
          <div>
            <v-select v-model="item.type" :items="typeOptions" label="Typ" @input="formChanged" />
          </div>
          <div>
            <small>
              <div v-if="item.label"><v-text-field v-model="item.label" @input="formChanged"  /></div>
              <v-textarea v-model="item.description" @input="formChanged" />
            </small>
          </div>
          <div style="text-align: right;">
            <v-text-field v-model="item.total_price" type="number" step="0.01" suffix="€" style="text-align: right" @input="formChanged" />
          </div>
          <div style="text-align: right;"><v-icon @click="edited_items.splice(edited_items.indexOf(index), 1)">mdi-content-save</v-icon></div>
        </div>
      </div>
      <v-btn @click="addItem">Neuer Posten</v-btn>
      <v-menu
        ref="datepickerMenu"
        v-model="datepickerMenu"
        :close-on-content-click="false"
        :return-value.sync="deal.start"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="deal.start"
            label="Gültig ab"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="deal.start"
          no-title
          scrollable
        >
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            @click="datepickerMenu = false"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            color="primary"
            @click="$refs.datepickerMenu.save(deal.start); formChanged()"
          >
            OK
          </v-btn>
        </v-date-picker>
      </v-menu>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'

export default {

  props: {
    value: {
      type: Object,
      default: () => {}
    }
  },

  data () {
    return {
      datepickerMenu: false,
      deal: () => {},
      edited_items: [],
      typeOptions: [
        { text: 'Lichtcloud', value: 'lightcloud' },
        { text: 'Wärmecloud', value: 'heatcloud' },
        { text: 'eCloud', value: 'ecloud' },
        { text: 'Consumer', value: 'consumer' },
        { text: 'eMove', value: 'emove' },
        { text: 'Text', value: 'text' }
      ]
    }
  },

  mounted () {
    this.reload()
  },

  methods: {
    reload () {
      this.deal = cloneDeep(this.value)
    },
    addItem () {
      this.deal.items.push({
        "type": "text",
        "label": "Neuer Posten",
        "description": "",
        "tax_rate": 19,
        "total_price": 0,
        "total_price_net": 0,
      })
      this.edited_items.push(this.deal.items.length - 1)
      this.formChanged()
    },
    formChanged () {
      this.$emit('input', this.deal)
    }
  }

}
</script>
