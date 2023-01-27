<template>
  <div class="main-content flex-1">
    <div v-if="data.has_roof_reconstruction_quote">
      <div class="main-content flex-1">
        <h2>Dachsanierung</h2>
        <div class="layout horizontal wrap">
          <v-text-field
            :rules="rules.required"
            ref="reconstruction_sqm"
            v-model="data.reconstruction_sqm"
            @blur="calculateCloud"
            label="zu sanierende Dachfläche"
            class="align-right"
            suffix="m²"
            type="number"
            step="0.01"
            style="margin-left: 1em"></v-text-field>
          <v-select
            label="Dachtyp"
            :rules="rules.required"
            ref="reconstruction_roof_type"
            v-model="data.reconstruction_roof_type" :items="[
              {'value':'flat','label':'Flachdach'},
              {'value':'saddle','label':'Satteldach'}
            ]"
            @input="calculateCloud"
            style="margin-left: 1em"
            item-text="label"
            item-value="value"></v-select>
          <v-checkbox
            label="mit Dämmung"
            style="margin-left: 1em"
            @change="calculateCloud"
            v-model="data.reconstruction_extra_options"
            value="with_insulation" />
        </div>
        <b>Extra Optionen</b>
        <div class="layout horizontal wrap" style="justify-content: flex-start">
          <div>
            <v-checkbox
              label="Abfallentsorgung"
              style="margin-right: 1em"
              @change="calculateCloud"
              v-model="data.reconstruction_extra_options"
              value="trash_management" />
            <div v-if="data.reconstruction_extra_options.indexOf('trash_management') >= 0">
              <v-text-field
                label="Menge"
                v-model="data.reconstruction_extra_options_trash_management_amount"
                @input="calculateCloud"
                suffix="kg"
                style="max-width: 10em;"
                step="1"></v-text-field>
            </div>
          </div>
          <div>
            <v-checkbox
              label="Abnehmen des Schneefanges"
              style="margin-right: 1em"
              @change="calculateCloud"
              v-model="data.reconstruction_extra_options"
              value="remove_snowstop" />
              <div v-if="data.reconstruction_extra_options.indexOf('remove_snowstop') >= 0">
                <v-text-field
                  label="Anzahl"
                  v-model="data.reconstruction_extra_options_extra_remove_snowstop_count"
                  @input="calculateCloud"
                  style="max-width: 10em;"
                  step="1"></v-text-field>
              </div>
          </div>
          <div>
            <v-checkbox
              label="Alte Dachrinne und Fallrohr abnehmen"
              style="margin-right: 1em"
              @change="calculateCloud"
              v-model="data.reconstruction_extra_options"
              value="remove_rain_pipe" />
              <div v-if="data.reconstruction_extra_options.indexOf('remove_rain_pipe') >= 0">
                <v-text-field
                  label="Länge"
                  v-model="data.reconstruction_extra_options_extra_remove_rain_pipe_count"
                  @input="calculateCloud"
                  suffix="m"
                  style="max-width: 10em;"
                  step="1"></v-text-field>
              </div>
          </div>
          <div>
            <v-checkbox
              label="Asbestzementplatten abnehmen und entsorgen"
              style="margin-right: 1em"
              @change="calculateCloud"
              v-model="data.reconstruction_extra_options"
              value="remove_asbest" />
          </div>
          <div>
            <v-checkbox
              label="Ausstiegsfenster ausbauen und entsorgen"
              style="margin-right: 1em"
              @change="calculateCloud"
              v-model="data.reconstruction_extra_options"
              value="remove_exit_window" />
            <div v-if="data.reconstruction_extra_options.indexOf('remove_exit_window') >= 0">
              <v-text-field
                label="Anzahl"
                v-model="data.reconstruction_extra_options_extra_remove_exit_window_count"
                @input="calculateCloud"
                style="max-width: 14em;"
                step="1"></v-text-field>
            </div>
          </div>
          <div>
            <v-checkbox
              label="Kamin komplett abnehmen und entsorgen"
              style="margin-right: 1em"
              @change="calculateCloud"
              v-model="data.reconstruction_extra_options"
              value="remove_chimney" />
            <div v-if="data.reconstruction_extra_options.indexOf('remove_chimney') >= 0">
              <v-text-field
                label="Anzahl"
                v-model="data.reconstruction_extra_options_extra_remove_chimney_count"
                @input="calculateCloud"
                style="max-width: 14em;"
                step="1"></v-text-field>
            </div>
          </div>
          <div>
            <v-checkbox
              label="Neue Dachrinne aus Zinkblech"
              style="margin-right: 1em"
              @change="calculateCloud"
              v-model="data.reconstruction_extra_options"
              value="new_rain_pipe" />
            <div v-if="data.reconstruction_extra_options.indexOf('new_rain_pipe') >= 0">
              <v-text-field
                label="Länge"
                v-model="data.reconstruction_extra_options_extra_new_rain_pipe_count"
                @input="calculateCloud"
                suffix="m"
                style="max-width: 14em;"
                step="1"></v-text-field>
            </div>
          </div>
          <div>
            <v-checkbox
              label="Sat Anlage Versetzen"
              style="margin-right: 1em"
              @change="calculateCloud"
              v-model="data.reconstruction_extra_options"
              value="move_sat" />
            <div v-if="data.reconstruction_extra_options.indexOf('move_sat') >= 0">
              <v-text-field
                label="Anzahl"
                v-model="data.reconstruction_extra_options_extra_move_sat_count"
                @input="calculateCloud"
                style="max-width: 14em;"
                step="1"></v-text-field>
            </div>
          </div>
          <div>
            <v-checkbox
              label="Schornstein verschiefern"
              style="margin-right: 1em"
              @change="calculateCloud"
              v-model="data.reconstruction_extra_options"
              value="chimney_reconstruction" />
            <div v-if="data.reconstruction_extra_options.indexOf('chimney_reconstruction') >= 0">
              <v-text-field
                label="Anzahl"
                v-model="data.reconstruction_extra_options_extra_chimney_reconstruction_count"
                @input="calculateCloud"
                style="max-width: 14em;"
                step="1"></v-text-field>
            </div>
          </div>
          <div>
            <v-checkbox
              label="Wohndachfenster ausbauen und entsorgen"
              style="margin-right: 1em"
              @change="calculateCloud"
              v-model="data.reconstruction_extra_options"
              value="remove_window" />
            <div v-if="data.reconstruction_extra_options.indexOf('remove_window') >= 0">
              <v-text-field
                label="Anzahl"
                v-model="data.reconstruction_extra_options_extra_remove_window_count"
                @input="calculateCloud"
                style="max-width: 14em;"
                step="1"></v-text-field>
            </div>
          </div>
          <div>
            <v-checkbox
              label="Wohndachfenster einbauen"
              style="margin-right: 1em"
              @change="calculateCloud"
              v-model="data.reconstruction_extra_options"
              value="new_window" />
            <div v-if="data.reconstruction_extra_options.indexOf('new_window') >= 0">
              <v-text-field
                label="Anzahl"
                v-model="data.reconstruction_extra_options_extra_new_window_count"
                @input="calculateCloud"
                style="max-width: 14em;"
                step="1"></v-text-field>
            </div>
          </div>
        </div>
      </div>
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
          if(element !== undefined && element._isVue && !element.validate(true)){
            found = true
          }
        }
        this.data.is_valid_roof = !found
      })
    },
    calculateCloud () {
      this.validate()
      this.$emit('calculateCloud')
    }
  }

}
</script>