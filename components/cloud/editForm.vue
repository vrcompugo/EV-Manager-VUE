<style lang="scss" scoped>

</style>


<template>
  <div>
    {{ value.last_update }}
    <div class="productlist layout horizontal" v-if="value">
      <div>
        <b>Lichtcloud</b><br />
        <v-btn small v-if="!value.lightcloud" @click="value.lightcloud = {}; $forceUpdate(); $emit('input', value)">Anlegen</v-btn>
        <div v-else>
          <v-btn small @click="delete value.lightcloud; $forceUpdate(); $emit('input', value)">Entfernen</v-btn>
          <v-text-field
            v-model="value.lightcloud.usage"
            @blur="$emit('input', value)"
            label="Verbrauch"
            suffix="kWh"
            style="margin-right: 0.5em"></v-text-field>
          <v-checkbox v-model="value.lightcloud.cloud_price_overwrite" @click="$forceUpdate();" label="Preis überschreiben"></v-checkbox>
          <v-text-field
            v-if="value.lightcloud.cloud_price_overwrite"
            v-model="value.lightcloud.cloud_price"
            type="number"
            step="0.01"
            suffix="€"
            @blur="$emit('input', value)"
            label="Produktpreis (brutto)"
            style="margin-right: 0.5em"></v-text-field>
          <v-checkbox v-model="value.lightcloud.min_kwp_overwrite" @click="$forceUpdate();" label="kWp überschreiben"></v-checkbox>
          <v-text-field
            v-if="value.lightcloud.min_kwp_overwrite"
            v-model="value.lightcloud.min_kwp"
            type="number"
            step="0.01"
            @blur="$emit('input', value)"
            label="min. kWp"
            style="margin-right: 0.5em"></v-text-field>
          <v-checkbox v-model="value.lightcloud.extra_price_per_kwh_overwrite" @click="$forceUpdate();" label="Mehrverbrauch überschreiben"></v-checkbox>
          <v-text-field
            v-if="value.lightcloud.extra_price_per_kwh_overwrite"
            v-model="value.lightcloud.extra_price_per_kwh"
            type="number"
            step="0.0001"
            @blur="$emit('input', value)"
            label="Mehrverbrauch"
            suffix="€/kWh"
            style="margin-right: 0.5em"></v-text-field>
        </div>
      </div>
      <div>
        <b>Wärmecloud</b><br />
        <v-btn small v-if="!value.heatcloud" @click="value.heatcloud = {}; $forceUpdate(); $emit('input', value)">Anlegen</v-btn>
        <div v-else>
          <v-btn small @click="delete value.heatcloud; $forceUpdate(); $emit('input', value)">Entfernen</v-btn>
          <v-text-field
            v-model="value.heatcloud.usage"
            @blur="$emit('input', value)"
            label="Verbrauch"
            suffix="kWh"
            style="margin-right: 0.5em"></v-text-field>
          <v-checkbox v-model="value.heatcloud.cloud_price_overwrite" @click="$forceUpdate();" label="Preis überschreiben"></v-checkbox>
          <v-text-field
            v-if="value.heatcloud.cloud_price_overwrite"
            v-model="value.heatcloud.cloud_price"
            type="number"
            step="0.01"
            suffix="€"
            @blur="$emit('input', value)"
            label="Produktpreis (brutto)"
            style="margin-right: 0.5em"></v-text-field>
          <v-checkbox v-model="value.heatcloud.min_kwp_overwrite" @click="$forceUpdate();" label="kWp überschreiben"></v-checkbox>
          <v-text-field
            v-if="value.heatcloud.min_kwp_overwrite"
            v-model="value.heatcloud.min_kwp"
            type="number"
            step="0.01"
            @blur="$emit('input', value)"
            label="min. kWp"
            style="margin-right: 0.5em"></v-text-field>
          <v-checkbox v-model="value.heatcloud.extra_price_per_kwh_overwrite" @click="$forceUpdate();" label="Mehrverbrauch überschreiben"></v-checkbox>
          <v-text-field
            v-if="value.heatcloud.extra_price_per_kwh_overwrite"
            v-model="value.heatcloud.extra_price_per_kwh"
            type="number"
            step="0.0001"
            @blur="$emit('input', value)"
            label="Mehrverbrauch"
            suffix="€/kWh"
            style="margin-right: 0.5em"></v-text-field>
        </div>
      </div>
      <div>
        <b>eCloud</b><br />
        <v-btn small v-if="!value.ecloud" @click="value.ecloud = {cloud_price_overwrite: false}; $forceUpdate(); $emit('input', value)">Anlegen</v-btn>
        <div v-else>
          <v-btn small @click="delete value.ecloud; $forceUpdate(); $emit('input', value)">Entfernen</v-btn>
          <v-text-field
            v-model="value.ecloud.usage"
            @blur="$emit('input', value)"
            label="Verbrauch"
            suffix="kWh"
            style="margin-right: 0.5em"></v-text-field>
          <v-checkbox v-model="value.ecloud.cloud_price_overwrite" @click="$forceUpdate();" label="Preis überschreiben"></v-checkbox>
          <v-text-field
            v-if="value.ecloud.cloud_price_overwrite"
            v-model="value.ecloud.cloud_price"
            type="number"
            step="0.01"
            suffix="€"
            @blur="$emit('input', value)"
            label="Produktpreis (brutto)"
            style="margin-right: 0.5em"></v-text-field>
          <v-checkbox v-model="value.ecloud.min_kwp_overwrite" @click="$forceUpdate();" label="kWp überschreiben"></v-checkbox>
          <v-text-field
            v-if="value.ecloud.min_kwp_overwrite"
            v-model="value.ecloud.min_kwp"
            type="number"
            step="0.01"
            @blur="$emit('input', value)"
            label="min. kWp"
            style="margin-right: 0.5em"></v-text-field>
          <v-checkbox v-model="value.ecloud.extra_price_per_kwh_overwrite" @click="$forceUpdate();" label="Mehrverbrauch überschreiben"></v-checkbox>
          <v-text-field
            v-if="value.ecloud.extra_price_per_kwh_overwrite"
            v-model="value.ecloud.extra_price_per_kwh"
            type="number"
            step="0.0001"
            @blur="$emit('input', value)"
            label="Mehrverbrauch"
            suffix="€/kWh"
            style="margin-right: 0.5em"></v-text-field>
        </div>
      </div>
      <div>
        <b>Consumer</b><br />
        <v-btn small @click="value.consumers.push({}); $forceUpdate(); $emit('input', value)">Anlegen</v-btn>
        <div v-for="(consumer, index) in value.consumers" :key="index">
          <v-btn small @click="delete value.consumers.splice(index, 1); $forceUpdate(); $emit('input', value)">Entfernen</v-btn>
          <v-text-field
            v-model="consumer.usage"
            @blur="$emit('input', value)"
            label="Verbrauch"
            suffix="kWh"
            style="margin-right: 0.5em"></v-text-field>
        </div>
        <v-checkbox v-model="value.consumer_cloud_price_overwrite" @click="$forceUpdate();" label="Preis überschreiben"></v-checkbox>
        <v-text-field
          v-if="value.consumer_cloud_price_overwrite"
          v-model="value.consumer_cloud_price"
          type="number"
          step="0.01"
          suffix="€"
          @blur="$emit('input', value)"
          label="Produktpreis (brutto)"
          style="margin-right: 0.5em"></v-text-field>
        <v-checkbox v-model="value.consumer_extra_price_per_kwh_overwrite" @click="$forceUpdate();" label="Mehrverbrauch überschreiben"></v-checkbox>
        <v-text-field
          v-if="value.consumer_extra_price_per_kwh_overwrite"
          v-model="value.consumercloud_extra_price_per_kwh"
          type="number"
          step="0.0001"
          @blur="$emit('input', value)"
          label="Mehrverbrauch"
          suffix="€/kWh"
          style="margin-right: 0.5em"></v-text-field>
      </div>
    </div>

  </div>
</template>

<script>
import { cloneDeep } from 'lodash'

export default {

  props: [
    'config'
  ],

  data(){
    return {
      value: {},
      validation: false,
      rules: {
        required: value => {
          if(!this.validation){
            return true
          }
          return !!value || 'Required.'
        }
      },
    }
  },

  watch: {
    config: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        this.convert()
      }
    }
  },

  methods: {
    validate(){
      this.validation = true
      let found = false
      for (let field in this.$refs) {
        let element = this.$refs[field]
        if(!element.validate(true)){
          if(!found){
            element.focus()
          }
          found = true
        }
      }
      this.validation = false
      return !found
    },
    convert(){
      this.value = cloneDeep(this.config)
      this.value.consumer_cloud_price = 0
      for (let i in this.value.consumers) {
        this.value.consumer_cloud_price = this.value.consumer_cloud_price + this.value.consumers[i].cloud_price
        this.value.consumercloud_extra_price_per_kwh = this.value.consumers[i].extra_price_per_kwh
      }
    }
  }

}
</script>
