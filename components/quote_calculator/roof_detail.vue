<style lang="scss" scoped>
  .no-margin {
    margin: 0;
  }
</style>

<template>
  <div>
    <h3>1. Gebäudebeschreibung</h3>
    <v-radio-group v-model="radioGroup" row>
      <v-radio value="sattel">
        <template v-slot:label>
          Sattel
        </template>
      </v-radio>
      <v-radio value="pull">
        <template v-slot:label>
          Pull
        </template>
      </v-radio>
    </v-radio-group>
    <div class="layout horizontal">
      Blitzschutz vorhanden:
      <v-radio-group v-model="asd" class="no-margin" row>
        <v-radio :value="true" label="Ja" />
        <v-radio :value="false" label="Nein" />
      </v-radio-group>
    </div>
    <div class="layout horizontal">
      Blitzschutz soll demontiert werden: zusätzlicher Kostenaufwand: 290€
      <v-radio-group v-model="asd" class="no-margin" row>
        <v-radio :value="true" label="Ja" />
        <v-radio :value="false" label="Nein" />
      </v-radio-group>
    </div>
    <div class="layout horizontal">
      Blitzschutz soll integriert werden: Ja zusätzlicher Kostenaufwand: 1.200€
      <v-radio-group v-model="asd" class="no-margin" row>
        <v-radio :value="true" label="Ja" />
        <v-radio :value="false" label="Nein" />
      </v-radio-group>
    </div>
    <h3>2. Daten Belegungsfläche</h3>
    <div class="layout horizontal">
      image
      <div>
        <v-text-field label="Gebäudelänge" suffix="m" type="number" step="0.01" />
        <v-text-field label="Ortganglänge" suffix="m" type="number" step="0.01" />
        <v-text-field label="Anzahl Ziegel (vertikal)" type="number" step="1" />
        <v-text-field label="Dachübergang Traufe" suffix="m" type="number" step="0.01" />
        <v-text-field label="Traufhöhe" suffix="m" type="number" step="0.01" />
        <v-text-field label="Dachneigung" suffix="m" type="number" step="0.01" />
      </div>
    </div>
    <div>
      <div class="layout horizontal">
        image
        <div>
          <v-text-field label="Dachlänge" suffix="m" type="number" step="0.01" />
          <v-text-field label="Dachbreite" suffix="m" type="number" step="0.01" />
          <v-text-field label="Dachöhe" type="number" step="1" />
          <v-text-field label="Dachneigung" suffix="m" type="number" step="0.01" />
        </div>
      </div>
      <div class="layout horizontal">
        image
        <div>
          <b>Attika (falls vorhanden)</b>
          <v-text-field label="Höhe (h)" suffix="m" type="number" step="0.01" />
          <v-text-field label="Breite (b)" suffix="m" type="number" step="0.01" />
        </div>
      </div>
    </div>
    <h3>3. Dämmung &amp; Dacheindeckung</h3>
    <div class="columns">
      <v-radio-group v-model="radioGroup" row>
        <v-radio value="pull">
          <template v-slot:label>
            Keine Dämmung
          </template>
        </v-radio>
        <v-radio value="sattel">
          <template v-slot:label>
            Aufdachdämmung
          </template>
        </v-radio>
        <v-radio value="pull">
          <template v-slot:label>
            Zwischensparrendämmung
          </template>
        </v-radio>
      </v-radio-group>
    </div>
    <v-text-field label="Dämmstärke" suffix="mm" type="number" step="0.01" />
    <v-text-field label="Dämmmaterial" />
    <v-text-field label="Bemerkungen" />
    <div class="columns">
      <v-radio-group v-model="radioGroup" row>
        <v-radio value="pull">
          <template v-slot:label>
            Betonziegel (Frankfurter Pfanne)<br>
            Decklänge: 33,0 cm<br>
            Deckbreite: 30,0 cm
          </template>
        </v-radio>
        <v-radio value="sattel">
          <template v-slot:label>
            Tonziegel (Flachdachpfanne)<br>
            <v-text-field label="Decklänge" suffix="cm" type="number" step="0.01" /><br>
            Deckbreite: 24,3 cm
          </template>
        </v-radio>
        <v-radio value="pull">
          <template v-slot:label>
            Biberschwanz<br>
            Decklänge: 16,0 cm <br>
            Deckbreite: 18,0 cm<br>
          </template>
        </v-radio>
        <v-radio value="pull">
          <template v-slot:label>
            Schieferdeckung
          </template>
        </v-radio>
        <v-radio value="pull">
          <template v-slot:label>
            Sonstige
          </template>
        </v-radio>
        <v-radio value="pull">
          <template v-slot:label>
            Bitumenschindeln
          </template>
        </v-radio>
        <v-radio value="pull">
          <template v-slot:label>
            Wellblech
          </template>
        </v-radio>
        <v-radio value="pull">
          <template v-slot:label>
            Trapezblech<br>
            <v-text-field label="Dicke" hint="mindestens 0,75 mm" suffix="mm" type="number" step="0.01" />
          </template>
        </v-radio>
        <v-radio value="pull">
          <template v-slot:label>
            Sandwichelement<br>
            <v-text-field label="Typ" />
          </template>
        </v-radio>
        <v-radio value="pull">
          <template v-slot:label>
            Bitumendach
          </template>
        </v-radio>
        <v-radio value="pull">
          <template v-slot:label>
            Falzblech
          </template>
        </v-radio>
        <v-radio value="pull">
          <template v-slot:label>
            Foliendach
          </template>
        </v-radio>
        <v-radio value="pull">
          <template v-slot:label>
            Kiesschüttung
          </template>
        </v-radio>
      </v-radio-group>
    </div>
  </div>
</template>

<script>
export default {

  props: [
    'roofs',
    'index'
  ],

  data(){
    return {
      histories__: [],
      editId: 0
    }
  },
  mounted () {
  },

  methods: {
  }

}
</script>