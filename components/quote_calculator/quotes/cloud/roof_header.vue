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
</style>
<template>
  <div class="roof_detail">
    <div class="layout horizontal center">
      <v-text-field
        v-model="roofs[index].label"
        @click="preventBubble"
        :rules="[rules.required]"
        label="Bezeichnung"
        style="flex: 0 0 12em; margin-right: 1em"></v-text-field>
      <v-select
        v-if="!roofs[index].is_flat"
        v-model="roofs[index].direction" :items="[
          {'value':'north','label':'Nord'},
          {'value':'north_west_east','label':'Nord West/Ost'},
          {'value':'west_east','label':'West/Ost'},
          {'value':'south_west_east','label':'Süd West/Ost'},
          {'value':'south','label':'Süd'}
        ]"
        label="Modulausrichtung"
        :rules="[rules.required]"
        @change="emitInput(); validate()"
        @click="preventBubble"
        style="flex: 0 1 8em;"
        item-text="label"
        item-value="value"></v-select>
      <v-text-field
        :ref="`roof_v_count_modules_${index}`"
        v-model="roofs[index].pv_count_modules"
        @change="emitInput(); validate()"
        @click="preventBubble"
        label="Anzahl Module"
        step="1"
        type="number"
        class="align-right"
        :rules="[rules.required]"
        style="flex: 0 1 8em;margin-left: 1em"></v-text-field>
      <v-select
        v-if="!['followup_quote', 'interim_quote', 'no-pv'].includes(data['cloud_quote_type'])"
        v-model="roofs[index].roof_type"
        :items="[
          'Sattel',
          'Pult',
          'Walm',
          'Schopfwalm',
          'Zelt',
          'Mansard',
          'Halle',
          'Garage',
          'Flachdach'
        ]"
        label="Dachtyp"
        @change="emitInput(); validate()"
        :rules="[rules.required]"
        @click="preventBubble"
        style="width: 8em;margin-left: 1em;">
      </v-select>
      <v-text-field
        v-if="!['followup_quote', 'interim_quote', 'no-pv'].includes(data['cloud_quote_type'])"
        ref="traufhohe"
        label="Traufhöhe"
        v-model="roofs[index].traufhohe"
        @change="emitInput(); validate()"
        @click="preventBubble"
        suffix="m"
        type="number"
        step="0.01"
        :rules="[rules.required]"
        style="flex: 0 1 7em;margin-left: 1em" />

      <v-icon @click="preventBubble($event); deleteRoof(index)" style="margin-left: 2em">mdi-delete</v-icon>


      <v-icon v-if="!roofs[index].is_valid" style="color:#D32F2F;">mdi-close</v-icon>
      <v-icon v-if="roofs[index].is_valid" style="color:#2E7D32;">mdi-check</v-icon>
    </div>
  </div>
</template>

<script>
export default {

  props: [
    'data',
    'roofs',
    'index'
  ],

  data(){
    return {
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
        if (this.roofs[this.index] === undefined) {
          return
        }
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
        this.roofs[this.index].is_valid_header = !found
        if (!['followup_quote', 'interim_quote', 'no-pv'].includes(this.data['cloud_quote_type'])) {
          this.roofs[this.index].is_valid = this.roofs[this.index].is_valid_body && this.roofs[this.index].is_valid_header
        }else{
          this.roofs[this.index].is_valid = this.roofs[this.index].is_valid_header
        }
      })
    },
    emitInput(){
      this.validate()
      this.$emit('input', {})
    },
    preventBubble (e) {
      e.stopPropagation()
    },
    deleteRoof (index) {
      this.$confirm('<div style="padding: 1em 1em 0 1em; font-size: 1.4em">Wirklich löschen?</div>').then(res => {
        if(res){
          this.roofs.splice(index, 1);
          this.emitInput();
        }
      })
    }
  }

}
</script>