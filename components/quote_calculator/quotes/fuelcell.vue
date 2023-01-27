<template>
  <div class="main-content flex-1">
    <div v-if="data.has_bluegen_quote">
      <h2>Brennstoffzellen</h2>
      <v-select
        label="Wirkungsart"
        ref="bluegen_type"
        :rules="rules.required"
        v-model="data.bluegen_type" :items="[
          {'value':'bluegen','label':'BlueGen: ca: 14000 kWh Strom / 5500 kWh Wärme'},
          {'value':'bluegen_home','label':'Blue Gen Home ca: 9000 kWh Strom, 3000 kWh Wärme'},
          {'value':'electa300','label':'eLecta300 bei 25000 kWh Wärme Verbrauch (170m2 Wohnhaus 2003) 6000 kWh Stromerzeugung'}
        ]"
        @input="calculateCloud"
        style="margin-left: 1em"
        item-text="label"
        item-value="value"></v-select>
      <v-text-field
        ref="bluegen_cell_count"
        :rules="rules.required"
        v-model="data.bluegen_cell_count"
        @blur="calculateCloud"
        label="Anzahl Brennstoffzellen"
        style="margin-right: 1em"></v-text-field>
      <v-checkbox
        v-if="data.bluegen_type !== 'electa300'"
        v-model="data.add_bluegen_storage"
        @change="calculateCloud"
        label="Mit Multifunktionsspeicher"
        style="margin: 0" />
    </div>
  </div>
</template>

<script>

export default {

  components: {
  },

  props: [
    'id',
    'data',
    'calculated',
    'select_options'
  ],

  computed: {
  },

  data(){
    return {
      histories__: [],
      editId: 0,
      rules: {
        requiredBoolean: value => value !== undefined || 'Pflichteingabe',
        required:  value => !!value || 'Pflichteingabe',
      }
    }
  },

  mounted () {
  },

  methods: {
    validate () {
      this.$nextTick(() => {
        let found = false
        for (let field in this.$refs) {
          let element = this.$refs[field]
          if(Array.isArray(element)){
            element = element[0]
          }
          if(element !== undefined && element._isVue && !element.validate()){
            found = true
          }
        }
        this.data.is_valid_fuelcell = !found
      })
    },
    calculateCloud () {
      this.validate()
      this.$emit('calculateCloud')
    },
  }

}
</script>