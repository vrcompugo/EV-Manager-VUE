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
    <h3>1. Gebäudebeschreibung</h3>
    <v-radio-group v-model="roofs[index].roof_type" row class="column-radio">
      <v-radio value="Sattel" class="column-radio">
        <template v-slot:label>
          <div style="text-align: center;">
            <div class="radio-image"><img src="/static/tab/sattel.jpeg" /></div>
            Sattel
          </div>
        </template>
      </v-radio>
      <v-radio value="Pult">
        <template v-slot:label>
          <div style="text-align: center;">
            <div class="radio-image"><img src="/static/tab/pult.jpeg" /></div>
            Pult
          </div>
        </template>
      </v-radio>
      <v-radio value="Walm">
        <template v-slot:label>
          <div style="text-align: center;">
            <div class="radio-image"><img src="/static/tab/walm.jpeg" /></div>
            Walm
          </div>
        </template>
      </v-radio>
      <v-radio value="Schopfwalm">
        <template v-slot:label>
          <div style="text-align: center;">
            <div class="radio-image"><img src="/static/tab/schopfwalm.jpeg" /></div>
            Schopfwalm
          </div>
        </template>
      </v-radio>
      <v-radio value="Zelt">
        <template v-slot:label>
          <div style="text-align: center;">
            <div class="radio-image"><img src="/static/tab/zelt.jpeg" /></div>
            Zelt
          </div>
        </template>
      </v-radio>
      <v-radio value="Mansard">
        <template v-slot:label>
          <div style="text-align: center;">
            <div class="radio-image"><img src="/static/tab/mansard.jpeg" /></div>
            Mansard
          </div>
        </template>
      </v-radio>
      <v-radio value="Halle">
        <template v-slot:label>
          <div style="text-align: center;">
            <div class="radio-image"><img src="/static/tab/halle.jpeg" /></div>
            Halle
          </div>
        </template>
      </v-radio>
      <v-radio value="Garage">
        <template v-slot:label>
          <div style="text-align: center;">
            <div class="radio-image"><img src="/static/tab/garage.jpeg" /></div>
            Garage
          </div>
        </template>
      </v-radio>
      <v-radio value="Flachdach">
        <template v-slot:label>
          <div style="text-align: center;">
            <div class="radio-image">&nbsp;</div>
            Flachdach
          </div>
        </template>
      </v-radio>
    </v-radio-group>
    <div class="layout horizontal">
      <div class="radio-group-label">Blitzschutz vorhanden:</div>
      <v-radio-group v-model="roofs[index].lightning_protection" class="no-margin" row>
        <v-radio :value="true" label="Ja" />
        <v-radio :value="false" label="Nein" />
      </v-radio-group>
    </div>
    <div class="layout horizontal" v-if="roofs[index].lightning_protection">
      <div class="radio-group-label">Blitzschutz soll demontiert werden: zusätzlicher Kostenaufwand: 290€</div>
      <v-radio-group v-model="roofs[index].lightning_protection_removal" class="no-margin" row>
        <v-radio :value="true" label="Ja" />
        <v-radio :value="false" label="Nein" />
      </v-radio-group>
    </div>
    <div class="layout horizontal" v-if="roofs[index].lightning_protection">
      <div class="radio-group-label">Blitzschutz soll integriert werden: Ja zusätzlicher Kostenaufwand: 1.200€</div>
      <v-radio-group v-model="roofs[index].lightning_protection_installation" class="no-margin" row>
        <v-radio :value="true" label="Ja" />
        <v-radio :value="false" label="Nein" />
      </v-radio-group>
    </div>
    <h3>2. Dacheindeckung</h3>
    <div class="columns">
      <v-radio-group v-model="roofs[index].roof_topping" row class="column-radio">
        <v-radio value="Betonziegel" v-if="!['Flachdach'].includes(roofs[index].roof_type)">
          <template v-slot:label>
            <div style="text-align: center;">
              <div class="radio-image3"><img src="/static/tab/betonziegel.jpeg" /></div>
              <div>
                <b>Betonziegel<br>(Frankfurter Pfanne)</b><br>
                Decklänge: 33,0 cm<br>
                Deckbreite: 30,0 cm
              </div>
            </div>
          </template>
        </v-radio>
        <v-radio value="Tonziegel" v-if="!['Flachdach'].includes(roofs[index].roof_type)">
          <template v-slot:label>
            <div style="text-align: center;">
              <div class="radio-image3"><img src="/static/tab/tonziegel.jpeg" /></div>
              <div>
                <b>Tonziegel<br>(Flachdachpfanne)</b><br>
                <v-text-field label="Decklänge" v-model="roofs[index].tonziegel_decklange" suffix="cm" type="number" step="0.01" />
                Deckbreite: 24,3 cm
              </div>
            </div>
          </template>
        </v-radio>
        <v-radio value="Biberschwanz" v-if="!['Flachdach'].includes(roofs[index].roof_type)">
          <template v-slot:label>
            <div style="text-align: center;">
              <div class="radio-image3"><img src="/static/tab/biberschwanz.jpeg" /></div>
              <div>
                <b>Biberschwanz</b><br>
                Decklänge: 16,0 cm <br>
                Deckbreite: 18,0 cm
              </div>
            </div>
          </template>
        </v-radio>
        <v-radio value="Schieferdeckung" v-if="!['Flachdach'].includes(roofs[index].roof_type)">
          <template v-slot:label>
            <div style="text-align: center;">
              <div class="radio-image3"><img src="/static/tab/schieferdeckung.jpeg" /></div>
              <div>
                <b>Schieferdeckung</b>
              </div>
            </div>
          </template>
        </v-radio>
        <v-radio value="Bitumenschindeln" v-if="!['Flachdach'].includes(roofs[index].roof_type)">
          <template v-slot:label>
            <div style="text-align: center;">
              <div class="radio-image3"><img src="/static/tab/bitumenschindeln.jpeg" /></div>
              <div>
                <b>Bitumenschindeln</b>
              </div>
            </div>
          </template>
        </v-radio>
        <v-radio value="Wellblech" v-if="!['Flachdach'].includes(roofs[index].roof_type)">
          <template v-slot:label>
            <div style="text-align: center;">
              <div class="radio-image3"><img src="/static/tab/wellblech.jpeg" style="padding: 2.2em 0;" /></div>
              <div>
                <b>Wellblech</b>
              </div>
            </div>
          </template>
        </v-radio>
        <v-radio value="Trapezblech" v-if="!['Flachdach'].includes(roofs[index].roof_type)">
          <template v-slot:label>
            <div style="text-align: center;">
              <div class="radio-image3"><img src="/static/tab/trapezblech.jpeg" style="padding: 2.2em 0;" /></div>
              <div>
                <b>Trapezblech</b><br>
                <v-text-field label="Dicke" v-model="roofs[index].trapezblech_thickness" hint="mindestens 0,75 mm" suffix="mm" type="number" step="0.01" />
              </div>
            </div>
          </template>
        </v-radio>
        <v-radio value="Sandwichelement" v-if="!['Flachdach'].includes(roofs[index].roof_type)">
          <template v-slot:label>
            <div style="text-align: center;">
              <div class="radio-image3"><img src="/static/tab/sandwichelement.jpeg" style="padding: 2.2em 0;" /></div>
              <div>
                <b>Sandwichelement</b><br />
                <v-text-field label="Typ" v-model="roofs[index].sandwichelement_type" />
              </div>
            </div>
          </template>
        </v-radio>
        <v-radio value="Falzblech" v-if="!['Flachdach'].includes(roofs[index].roof_type)">
          <template v-slot:label>
            <div style="text-align: center;">
              <div class="radio-image3"><img src="/static/tab/falzblech.jpeg" style="padding: 2.2em 0;" /></div>
              <div>
                <b>Falzblech</b>
              </div>
            </div>
          </template>
        </v-radio>
        <v-radio value="Bitumendach" v-if="['Flachdach'].includes(roofs[index].roof_type)">
          <template v-slot:label>
            <div style="text-align: center;">
              <div class="radio-image3"><img src="/static/tab/bitumendach.jpeg" /></div>
              <div>
                <b>Bitumendach</b>
              </div>
            </div>
          </template>
        </v-radio>
        <v-radio value="Foliendach" v-if="['Flachdach'].includes(roofs[index].roof_type)">
          <template v-slot:label>
            <div style="text-align: center;">
              <div class="radio-image3"><img src="/static/tab/foliendach.jpeg" /></div>
              <div>
                <b>Foliendach</b>
              </div>
            </div>
          </template>
        </v-radio>
        <v-radio value="Kiesschüttung" v-if="['Flachdach'].includes(roofs[index].roof_type)">
          <template v-slot:label>
            <div style="text-align: center;">
              <div class="radio-image3"><img src="/static/tab/kiesschuttung.jpeg" /></div>
              <div>
                <b>Kiesschüttung</b>
              </div>
            </div>
          </template>
        </v-radio>
        <v-radio value="Begrüntes Dach" v-if="['Flachdach'].includes(roofs[index].roof_type)">
          <template v-slot:label>
            <div style="text-align: center;">
              <div class="radio-image3"><img src="/static/tab/begruntes_dach.jpeg" /></div>
              <div>
                <b>Begrüntes Dach</b>
              </div>
            </div>
          </template>
        </v-radio>
        <v-radio value="Sonstige">
          <template v-slot:label>
            <div style="text-align: center;">
              <div class="radio-image3">&nbsp;</div>
              <div>
                <b>Sonstige</b>
              </div>
            </div>
          </template>
        </v-radio>
      </v-radio-group>
    </div>
    <h3>3. Daten Belegungsfläche</h3>
    <div class="layout horizontal" v-if="!['Flachdach'].includes(roofs[index].roof_type)">
      <div style="margin-right: 2em">
        <img src="/static/tab/flache_sattel.jpeg" />
      </div>
      <div class="layout horizontal">
        <div style="margin-right: 1em">
          <v-text-field label="Gebäudelänge" v-model="roofs[index].gebaudelange" suffix="m" type="number" step="0.01" />
          <v-text-field label="Ortganglänge" v-model="roofs[index].ortganglange" suffix="m" type="number" step="0.01" />
          <v-text-field label="Anzahl Ziegel (vertikal)" v-model="roofs[index].anzahl_ziegel" type="number" step="1" />
        </div>
        <div>
          <v-text-field label="Traufhöhe" v-model="roofs[index].traufhohe" suffix="m" type="number" step="0.01" />
          <v-text-field label="Dachneigung" v-model="roofs[index].dachneigung" suffix="°" type="number" step="0.01" />
        </div>
      </div>
    </div>
    <div v-if="['Flachdach'].includes(roofs[index].roof_type)">
      <div class="layout horizontal">
        <div style="margin-right: 2em">
          <img src="/static/tab/flache_flachdach.jpeg" />
        </div>
        <div>
          <div class="layout horizontal">
            <div style="margin-right: 1em">
              <v-text-field label="Dachlänge" v-model="roofs[index].dachlange" suffix="m" type="number" step="0.01" />
              <v-text-field label="Dachbreite" v-model="roofs[index].dachbreite" suffix="m" type="number" step="0.01" />
            </div>
            <div>
              <v-text-field label="Dachöhe" v-model="roofs[index].dachhohe" type="number" step="1" />
              <v-text-field label="Dachneigung" v-model="roofs[index].dachneigung" suffix="m" type="number" step="0.01" />
            </div>
          </div>
          <br />

          <div class="layout horizontal">
            <div style="margin-right: 2em">
              <b>Attika (falls vorhanden)</b><br />
              <img src="/static/tab/attika.jpeg" />
            </div>
            <div>
              <br />
              <v-text-field label="Höhe (h)" v-model="roofs[index].hohe" suffix="m" type="number" step="0.01" />
              <v-text-field label="Breite (b)" v-model="roofs[index].breite" suffix="m" type="number" step="0.01" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <h3>4. Dämmung</h3>
    <div class="columns">
      <v-radio-group v-model="roofs[index].insulation_type" row class="column-radio">
        <v-radio value="Aufdachdämmung" style="margin-right: 1em">
          <template v-slot:label>
            <div style="text-align: center;">
              <div class="radio-image2"><img src="/static/tab/aufdachdammung.jpeg" /></div>
              Aufdachdämmung
            </div>
          </template>
        </v-radio>
        <v-radio value="Zwischensparrendämmung" style="margin-right: 1em">
          <template v-slot:label>
            <div style="text-align: center;">
              <div class="radio-image2"><img src="/static/tab/zwichensparrendammung.jpeg" /></div>
              Zwischensparrendämmung
            </div>
          </template>
        </v-radio>
        <v-radio value="Keine Dämmung">
          <template v-slot:label>
            <div style="text-align: center;">
              Keine Dämmung
            </div>
          </template>
        </v-radio>
      </v-radio-group>
    </div>
    <div class="layout horizontal" v-if="roofs[index].insulation_type === 'Zwischensparrendämmung'">
      <v-text-field label="Dämmstärke" v-model="roofs[index].insulation_thickness" suffix="cm" type="number" step="0.01" style="margin-right: 1em" />
      <v-text-field label="Dämmmaterial" v-model="roofs[index].insulation_material" />
    </div>
    <v-text-field label="Bemerkungen" v-model="roofs[index].comment" />
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