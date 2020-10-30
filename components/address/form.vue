<style lang="scss" scoped>

</style>


<template>
  <div>
    <v-text-field v-model="value.company" label="Firma"></v-text-field>
    <div class="layout horizontal">
      <v-text-field
        ref="firstname"
        :rules="[rules.required]"
        v-model="value.firstname"
        @blur="$emit('input', value)"
        label="Vorname"
        style="margin-right: 0.5em"></v-text-field>
      <v-text-field
        ref="lastname"
        :rules="[rules.required]"
        v-model="value.lastname"
        @blur="$emit('input', value)"
        label="Nachname"
        style="margin-left: 0.5em"></v-text-field>
    </div>
    <div class="layout horizontal">
      <v-text-field
        ref="street"
        :rules="[rules.required]"
        v-model="value.street"
        @blur="$emit('input', value)"
        style="flex: 2; margin-right: 0.5em"
        label="Straße"></v-text-field>
      <v-text-field
        ref="street_nb"
        :rules="[rules.required]"
        v-model="value.street_nb"
        @blur="$emit('input', value)"
        style="flex: 1; margin-left: 0.5em"
        label="Hausnummer"></v-text-field>
    </div>
    <div class="layout horizontal">
      <v-text-field
        ref="zip"
        :rules="[rules.required]"
        v-model="value.zip"
        @blur="$emit('input', value)"
        label="PLZ"
        style="flex: 1; max-width: 10em; margin-right: 0.5em"></v-text-field>
      <v-text-field
        ref="city"
        :rules="[rules.required]"
        v-model="value.city"
        @blur="$emit('input', value)"
        label="Ort"
        style="flex: 1; margin-left: 0.5em"></v-text-field>
    </div>

  </div>
</template>

<script>

export default {

  props: ['value'],

  data(){
    return {
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
    focus(){

    }
  }

}
</script>
