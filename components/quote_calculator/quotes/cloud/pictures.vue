<style lang="scss">
  .tabform .image-placeholder {
    display: inline-block;
    width: 19em;
    height: 11em;
    background-color: #cccccc;
  }
</style>
<template>
  <div class="tabform">

    <h4>Bilder</h4>
    <b>Hausfront (wenn möglich Gesamtansicht)</b>
    <div class="layout horizontal wrap">
      <FileUpload ref="hausfront1" label="Hausfront 1" filekey="hausfront1" filetype="jpg" path="Dachbilder" required v-model="data" :id="id" @input="calculateCloud" style="margin-right: 1em" />
      <FileUpload ref="hausfront2" label="Hausfront 2" filekey="hausfront2" filetype="jpg" path="Dachbilder" required v-model="data" :id="id" @input="calculateCloud" style="margin-right: 1em" />
      <FileUpload label="Hausfront 3" filekey="hausfront3" filetype="jpg" path="Dachbilder" v-model="data" :id="id" @input="calculateCloud" style="margin-right: 1em" />
    </div>
    <b>Gartenansicht</b>
    <div class="layout horizontal wrap">
      <FileUpload ref="gartenansicht1" label="Rückseite 1" filekey="gartenansicht1" filetype="jpg" path="Dachbilder" required v-model="data" :id="id" @input="calculateCloud" style="margin-right: 1em" />
      <FileUpload label="Rückseite 2" filekey="gartenansicht2" filetype="jpg" path="Dachbilder" v-model="data" :id="id" @input="calculateCloud" style="margin-right: 1em" />
      <FileUpload label="Rückseite 3" filekey="gartenansicht3" filetype="jpg" path="Dachbilder" v-model="data" :id="id" @input="calculateCloud" style="margin-right: 1em" />
    </div>
  </div>
</template>

<script>
import FileUpload from '~/components/quote_calculator/fileupload'

export default {

  components: {
    FileUpload
  },

  props: [
    'id',
    'data'
  ],

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
    calculateCloud () {
      this.validate()
      this.$emit('calculateCloud')
    },
    validate () {
      this.$nextTick(() => {
        let found = false
        for (let field in this.$refs) {
          let element = this.$refs[field]
          if(Array.isArray(element)){
            element = element[0]
          }
          if(element !== undefined && element._isVue && !element.validate(true)){
            found = true
          }
        }
        this.data.is_valid_pictures = !found
      })
    }
  }

}
</script>