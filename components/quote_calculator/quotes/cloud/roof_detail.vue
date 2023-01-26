<style lang="scss" scoped>
  .no-margin {
    margin: 0;
  }
  .radio-image {
    height: 4em;
    img {
      width: auto;
      height: 100%;
    }
  }
  .radio-image3 {
    height: 8em;
    img {
      width: auto;
      height: 100%;
    }
  }
  .radio-group-label {
    margin-top: 0.3em;
    margin-right: 1em;
  }
  h3 {
    font-size: 1.4em;
    margin: 1.5em 0 0.6em;
  }
</style>
<style lang="scss">
  .roof_detail .column-radio .v-radio {
    flex-direction: column;
    margin-bottom: 1em;
    margin-right: 2em;
  }
  .image-placeholder {
    display: inline-block;
    width: 19em;
    height: 11em;
    background-color: #cccccc;
  }
</style>
<template>
  <div class="roof_detail">
    <div class="layout horizontal">
      <div class="radio-image3"><img v-if="roofs[index].roof_topping" :src="`/static/tab/${roofs[index].roof_type.toLowerCase()}.jpeg`" style="margin-right: 1em" /></div>
      <div class="radio-image3"><img v-if="roofs[index].roof_topping" :src="`/static/tab/${roofs[index].roof_topping.toLowerCase()}.jpeg`" style="max-width: 210px;" /></div>
      <div>
        <v-select
          ref="roof_topping"
          v-model="roofs[index].roof_topping"
          :items="[
            'Betonziegel',
            'Tonziegel',
            'Biberschwanz',
            'Schieferdeckung',
            'Bitumenschindeln',
            'Wellblech',
            'Trapezblech',
            'Sandwichelement',
            'Falzblech',
            'Sonstige',
          ]"
          label="Dacheindeckung"
          @change="emitInput"
          :rules="[rules.required]"
          style="width: 12em">
        </v-select>
        <div v-if="roofs[index].roof_topping === 'Tonziegel' || roofs[index].roof_topping === 'Betonziegel' || roofs[index].roof_topping === 'Biberschwanz'">
          <v-text-field @change="emitInput" ref="decklange" label="Decklänge" v-model="roofs[index].decklange" suffix="cm" type="number" step="0.01" :rules="[rules.required]"/>
          <v-text-field @change="emitInput" ref="deckbreite" label="Deckbreite" v-model="roofs[index].deckbreite" suffix="cm" type="number" step="0.01" :rules="[rules.required]"/>
        </div>
        <v-select
          v-if="roofs[index].roof_topping === 'Tonziegel' || roofs[index].roof_topping === 'Betonziegel'"
          label="Befestigung"
          ref="roof_topping_fixture"
          v-model="roofs[index].roof_topping_fixture" :items="[
            'Verklebt',
            'Verschraubt',
            'Genagelt',
            'mit Sturmklammern',
            'ohne Befestigung verlegt',
          ]"
          @input="emitInput"
          :rules="[rules.required]"
          style="max-width: 14em;"
          item-text="label"
          item-value="value"></v-select>
        <div v-if="roofs[index].roof_topping === 'Trapezblech'">
          <v-text-field ref="trapezblech_thickness" label="Materialstärke" v-model="roofs[index].trapezblech_thickness" hint="mindestens 0,75 mm" suffix="mm" type="number" step="0.01" :rules="[rules.required]"/>
        </div>
        <div v-if="roofs[index].roof_topping === 'Sandwichelement'">
          <v-text-field ref="sandwichelement_thickness" label="Materialstärke" v-model="roofs[index].sandwichelement_thickness" suffix="mm" type="number" step="0.01" :rules="[rules.required]"/>
        </div>
      </div>
      <div class="radio-image3" v-if="roofs[index].insulation_type != 'Keine Dämmung'" style="margin-left: 2em"><img v-if="roofs[index].insulation_type" :src="`/static/tab/${roofs[index].insulation_type.replace('ä', 'a').toLowerCase()}.jpeg`" /></div>
      <div>
        <v-select
          ref="insulation_type"
          v-model="roofs[index].insulation_type"
          :items="[
            'Aufdachdämmung',
            'Zwischensparrendämmung',
            'Keine Dämmung'
          ]"
          label="Dämmung"
          :rules="[rules.required]"
          @change="emitInput()"
          style="width: 16em">
        </v-select>
        <div class="layout horizontal" v-if="roofs[index].insulation_type === 'Aufdachdämmung'">
          <v-text-field ref="insulation_thickness" label="Dämmstärke" v-model="roofs[index].insulation_thickness" :rules="[rules.required]" suffix="cm" type="number" step="0.01" style="margin-right: 1em" />
          <v-text-field ref="insulation_material" label="Dämmmaterial" v-model="roofs[index].insulation_material" :rules="[rules.required]" />
        </div>
      </div>
    </div>
    <div class="layout horizontal wrap">
      <FileUpload ref="dachflache1" label="Dach von Vorne" :filekey="`dachflache${index+1}_1`" samplefile="dachflache1.jpg" filetype="jpg" path="Dachbilder" v-model="data" :id="id" style="margin-right: 1em" required @input="emitInput" />
      <FileUpload ref="dachflache2" label="Dach von der Seite" :filekey="`dachflache${index+1}_2`" samplefile="dachflache2.jpg"  filetype="jpg" path="Dachbilder" v-model="data" :id="id" style="margin-right: 1em" required @input="emitInput" />
      <FileUpload ref="dachflache3" label="Dach von Hinten" :filekey="`dachflache${index+1}_3`" samplefile="dachflache3.jpg"  filetype="jpg" path="Dachbilder" v-model="data" :id="id" style="margin-right: 1em" required @input="emitInput" />
      <FileUpload ref="dachflache4" label="Sparrenansicht und Dicke der Sparren" :filekey="`dachflache${index+1}_4`" samplefile="dachinnen3.jpg" filetype="jpg" path="Dachbilder" v-model="data" :id="id" style="margin-right: 1em" required @input="emitInput" />
      <FileUpload ref="solaredge" v-if="index == 0" label="SolarEdge 3D Ansicht" filekey="solaredge" filetype="pdf" path="Dachbilder" v-model="data" :id="id" style="margin-right: 1em" required @input="emitInput" />
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
    'data',
    'roofs',
    'index'
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
        this.roofs[this.index].is_valid_body = !found
        this.roofs[this.index].is_valid = this.roofs[this.index].is_valid_body && this.roofs[this.index].is_valid_header
      })
    },
    emitInput(){
      this.validate()
      this.$emit('input', {})
    }
  }
}
</script>