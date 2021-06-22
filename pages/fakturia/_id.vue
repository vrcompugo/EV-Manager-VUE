<style lang="scss" scoped>
  table th {
    text-align: left;
    padding: 0 1em 0 0;
  }
  table td {
    padding: 0 1em 0 0;
  }
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
  <div class="layout vertical" style="max-height: 100%; padding: 1em">

    <div v-if="deal.data && deal.data.error">{{ deal.data.error }}</div>
    <div v-if="deal.deals">
      Bitte Hauptauftrag auswählen
      <table>
        <tr>
          <th>Bezeichnung</th>
          <th>Ist Consumer</th>
          <th>Ist eCloud</th>
          <th>Ist Wärmecloud</th>
          <th>Cloudtyp</th>
        </tr>
        <tr v-for="subdeal in deal.deals" :key="subdeal.id" @click="setMaster(subdeal)">
          <td>{{ subdeal.title }}</td>
          <td>{{ subdeal.is_cloud_consumer }}</td>
          <td>{{ subdeal.is_cloud_ecloud }}</td>
          <td>{{ subdeal.is_cloud_heatcloud }}</td>
          <td>{{ subdeal.cloud_type }}</td>
        </tr>
      </table>
    </div>
    <div v-if="deal.id">
      <h2>Cloud Abo</h2>
      Cloud Angebotsnummer: {{ deal.cloud_number }}<br>
      Cloud Vertragsnummer: {{ deal.cloud_contract_number }}
      <v-btn @click="createContractNumber" v-if="deal.cloud_contract_number === undefined || deal.cloud_contract_number === null || deal.cloud_contract_number === ''" small>Vertragsnummer erzeugen</v-btn>
      <br>
      Hauptauftrag: <a :href="deal.link" target="_blank">{{ deal.title }}</a><br>
      Lieferbegin: {{ deal.cloud_delivery_start | dateTimeFormat }}<br>
      <br>
      <b>Posten</b><br>
      <div class="cloud_products">
        <v-expansion-panels>
          <v-expansion-panel v-for="(list, listIndex) in deal.item_lists" :key="listIndex">
            <v-expansion-panel-header>
              Gültig von {{ list.start | dateFormat }}
              <span v-if="deal.item_lists.length - 1 > listIndex" style="padding-left: 0.3em">bis {{ deal.item_lists[listIndex + 1].start | dateFormat }}</span>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div v-for="(item, index) in list.items" :key="index" class="product">
                <div>{{ index + 1 }}</div>
                <div>
                  {{ item.type }}
                  <div v-if="item.deal">
                    <v-icon color="green" large>mdi-check</v-icon>
                  </div>
                  <div v-if="!item.deal && item.type != 'text' && item.type != 'emove'">
                    <v-icon color="red" large>mdi-close</v-icon>
                  </div>
                </div>
                <div>
                  <small>
                    <div v-if="item.label"><b>{{ item.label }}</b></div>
                    <div v-html="item.description"></div>
                  </small>
                </div>
                <div>
                  <div v-if="item.deal">
                    Bitrix-Auftrag: <a :href="item.deal.link" target="_blank">{{ item.deal.title }}</a>
                  </div>
                  <div v-if="!item.deal && item.type != 'text' && item.type != 'emove'">
                    Kein Bitrix Auftrag gefunden. <v-btn small @click="startEditItem(listIndex, index)">Jetzt auswählen</v-btn>
                    <div v-if="isEditItem(listIndex, index)">
                      <b>Aufträge ohne Zuordnung:</b><br>
                      <div v-if="deal.unassigend_deals.length > 0">
                        <div class="cloud_deals">
                          <table>
                            <tr>
                              <th>Bezeichnung</th>
                              <th>Ist Consumer</th>
                              <th>Ist eCloud</th>
                              <th>Ist Wärmecloud</th>
                              <th>Cloudtyp</th>
                            </tr>
                            <tr v-for="subdeal in deal.unassigend_deals" :key="subdeal.id">
                              <td><a href="#" @click.prevent="assignSubDeal(subdeal.id, index)">{{ subdeal.title }}</a></td>
                              <td>{{ subdeal.is_cloud_consumer }}</td>
                              <td>{{ subdeal.is_cloud_ecloud }}</td>
                              <td>{{ subdeal.is_cloud_heatcloud }}</td>
                              <td>{{ subdeal.cloud_type }}</td>
                            </tr>
                          </table>
                        </div>
                      </div>
                      <div v-else>
                        Kein Weiteren Aufträge gefunden
                      </div>
                      <div style="text-align: right">
                        <v-btn small @click="stopEditItem(listIndex, index)">Abbrechen</v-btn>
                      </div>
                    </div>
                  </div>
                  <div v-if="item.type != 'text'">
                    <div v-if="!isEditItem2(listIndex, index)">
                      <div>
                        abgedeckter Jahresverbrauch: {{ item.usage }} kWh <v-icon @click="startEditItem2(listIndex, index)">mdi-pencil</v-icon>
                      </div>
                      <div v-if="item.type == 'emove'">
                        abgedeckter Jahresverbrauch (out of Home): {{ item.usage_outside }} kWh <v-icon @click="startEditItem2(listIndex, index)">mdi-pencil</v-icon>
                      </div>
                    </div>
                    <div v-if="isEditItem2(listIndex, index)" class="layout horizontal">
                      <v-text-field label="abgedeckter Jahresverbrauch" v-model="newUsage" suffix="kWh" class="flex" />
                      <v-text-field v-if="item.type == 'emove'" label="abgedeckter Jahresverbrauch (out of Home)" v-model="newUsageOutside" suffix="kWh" style="margin-left: 1em" />
                      <v-icon @click="stopEditItem2(listIndex, index)" style="margin-left: 1em">mdi-content-save</v-icon>
                    </div>
                  </div>
                </div>
                <div style="text-align: right;"><div v-if="item.total_price != 0">{{ item.total_price | formatPrice }}</div></div>
              </div>
              <div v-if="(new Date(list.start)) >= (new Date())" style="text-align: right">
                <v-btn @click="deleteItemsList(listIndex)">Löschen</v-btn>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
      <div v-if="!deal.fakturia_id">
        <v-btn @click="editDeal">Bearbeiten</v-btn>
      </div>
      <br>
      <div v-if="deal.unassigend_deals.length > 0">
        <b>Aufträge ohne Zuordnung:</b><br>
        <div class="cloud_deals">
          <table>
            <tr>
              <th>Bezeichnung</th>
              <th>Ist Consumer</th>
              <th>Ist eCloud</th>
              <th>Ist Wärmecloud</th>
              <th>Cloudtyp</th>
            </tr>
            <tr v-for="subdeal in deal.unassigend_deals" :key="subdeal.id">
              <td><a :href="subdeal.link" target="_blank">{{ subdeal.title }}</a></td>
              <td>{{ subdeal.is_cloud_consumer }}</td>
              <td>{{ subdeal.is_cloud_ecloud }}</td>
              <td>{{ subdeal.is_cloud_heatcloud }}</td>
              <td>{{ subdeal.cloud_type }}</td>
            </tr>
          </table>
        </div>
      </div>
      <br>
      <div style="padding-bottom: 2em">
        <br>
        <b>Fakturia:</b><br>
        Vertragsnummer: {{ deal.fakturia.contract_number }}<br>
        Vertragsabschluss: {{ deal.fakturia.delivery_begin | dateFormat }}<br>
        Kündigungsdatum: -<br>
        Vertragsende: -<br>
        Zahlungsinterval: 1 Monat<br>
        IBAN: {{ deal.fakturia.iban }}<br>
        BIC: {{ deal.fakturia.bic }}<br>
        Inhaber: {{ deal.fakturia.owner }}<br>
        <br>
        <div class="cloud_products">
          <div v-for="(item, index) in deal.fakturia.items_to_update" :key="index" class="product">
            <div>{{ index + 1 }}</div>
            <div>{{ item.type }}</div>
            <div>
              <small>
                <div v-if="item.label"><b>{{ item.label }}</b></div>
                <div v-html="item.description"></div>
              </small>
            </div>
            <div>
            </div>
            <div style="text-align: right;"><div v-if="item.total_price != 0">{{ item.total_price | formatPrice }}</div></div>
          </div>
        </div>
        <v-btn v-if="deal.cloud_delivery_start && (deal.fakturia_contract_number === undefined || deal.fakturia_contract_number === '')" @click="exportFakturia">An Fakturia senden</v-btn>
      </div>

      <v-dialog v-model="editDialog" width="800">
        <v-card v-if="newItemsList">
          <v-card-title class="headline grey lighten-2" primary-title >
            {{ deal.cloud_contract_number }} bearbeiten
          </v-card-title>

          <v-card-text>
            <ItemsForm ref="itemsForm" v-model="newItemsList" />
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="secondary"
              text
              @click="editDialog = false"
            >
              Abbrechen
            </v-btn>
            <v-btn
              color="primary"
              text
              @click="storeItems"
              :disabled="loading"
              :loading="loading"
            >
              Speichern
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import ItemsForm from '~/components/deal/ItemsForm'

export default {

  components: {
    ItemsForm
  },

  async fetch ({ store, params }) {
    await store.dispatch('fakturia/loadDealData', {
      dealId: params.id
    })
  },

  data(){
    return {
      newItemsList: undefined,
      editDialog: false,
      edited_items: {},
      edited2_items: '',
      loading: false,
      newUsage: 0,
      newUsageOutside: 0
    }
  },

  computed: {
    deal: function () { return this.$store.getters['fakturia/dealData'] },
  },

  methods: {
    async reload () {
      this.fetch()
    },
    createContractNumber () {
      this.$store.dispatch('fakturia/createContractNumber', {
        dealId: deal.id
      })
    },
    setMaster (deal) {
      this.$store.dispatch('fakturia/setMasterDeal', {
        dealId: deal.id
      })
    },
    assignSubDeal (subDealId, itemIndex) {
      this.$store.dispatch('fakturia/assignSubDeal', {
        dealId: this.deal.id,
        subDealId: subDealId,
        itemIndex: itemIndex
      })
    },
    editDeal () {
      this.newItemsList = {
        start: '',
        end: '',
        items: cloneDeep(this.deal.item_lists[this.deal.item_lists.length - 1].items)
      }
      this.editDialog = true
      if (this.$refs.itemsForm) {
        this.$refs.itemsForm.reload()
      }
    },
    startEditItem (listIndex, index) {
      if (this.edited_items[listIndex]) {
        this.edited_items[listIndex] = []
      }
      this.edited_items[listIndex].push(index)
    },
    isEditItem (listIndex, index) {
      return this.edited_items[listIndex] && this.edited_items[listIndex].indexOf(index) >= 0
    },
    stopEditItem (listIndex, index) {
      this.edited_items[listIndex].splice(this.edited_items.indexOf(index), 1)
    },
    startEditItem2 (listIndex, index) {
      this.newUsage = this.deal.item_lists[listIndex].items[index].usage
      this.newUsageOutside = this.deal.item_lists[listIndex].items[index].usage_outside
      this.edited2_items = `${listIndex}-${index}`
    },
    isEditItem2 (listIndex, index) {
      return this.edited2_items === `${listIndex}-${index}`
    },
    async stopEditItem2 (listIndex, index) {
      await this.$store.dispatch('fakturia/storeItem', {
        deal: this.deal,
        listIndex: listIndex,
        index: index,
        newUsage: this.newUsage,
        newUsageOutside: this.newUsageOutside
      })
      this.edited2_items = ''
    },
    async storeItems () {
      this.loading = true
      await this.$store.dispatch('fakturia/storeItems', {
        deal: this.deal,
        newItemsList: this.newItemsList
      })
      this.loading = false
      this.editDialog = false
    },
    async deleteItemsList (listIndex) {
      this.loading = true
      await this.$confirm('<div style="padding: 1em 1em 0 1em; font-size: 1.4em">Wirklich löschen?</div>').then(res => {
        if(res){
          this.$store.dispatch('fakturia/deleteItems', {
            deal: this.deal,
            listIndex: listIndex
          })
        }
      })
      this.loading = false
    },
    async exportFakturia () {
      await this.$store.dispatch('fakturia/export', {
        deal: this.deal
      })
    }
  }
}
</script>
