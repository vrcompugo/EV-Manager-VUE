<style lang="scss" scoped>
  table th {
    text-align: left;
    padding: 0 1em 0 0;
  }
  table td {
    padding: 0 1em 0 0;
  }

</style>


<template>
  <div class="layout vertical" style="max-height: 100%; padding: 1em">
    <v-snackbar v-model="errorSnack">
      {{ errorMessage }}
      <v-btn text @click="errorSnack = false">
        Schließen
      </v-btn>
    </v-snackbar>

    <div>
      <h1>Belegexport</h1>
      <v-data-table
        v-if="bundles"
        :headers="headers"
        :items="bundles['items']"
        :items-per-page="100"
        :options.sync="options"
        :server-items-length="bundles['total']"
        :loading="loadingBundles"
        :footer-props="{ 'items-per-page-options': [100, 200, 300]}"
        dense
        class="elevation-1"
      >
        <template v-slot:[`item.kw`]="{ item }">
          <span style="white-space: nowrap">
            KW {{ item.kw }} - {{ item.year }}
          </span>
        </template>
        <template v-slot:[`item.download_link`]="{ item }">
          <span style="white-space: nowrap">
            <a :href="item.download_link" target="_blank">Download</a>
          </span>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
export default {

  components: {
  },

  mounted () {
    this.reload()
  },

  data () {
    return {
      loadingBundles: false,
      errorSnack: false,
      errorMessage: '',
      options: { sortBy: ['kw'], sortDesc: [true], page: 1, itemsPerPage: 100 },
      headers: [
        {
          text: 'Kalenderwoche',
          align: 'start',
          value: 'kw'
        },
        {
          text: 'Anzahl Datensätze',
          align: 'start',
          value: 'items_count'
        },
        {
          text: 'Downloadlink',
          align: 'start',
          sortable: false,
          value: 'download_link'
        },
        {
          text: 'Kommentar',
          align: 'start',
          sortable: false,
          value: 'comment'
        }
      ]
    }
  },

  computed: {
    bundles: function () { return this.$store.getters['invoice/bundles'] },
  },

  watch: {
    options: {
      handler () {
        this.reload()
      },
      deep: true
    }
  },

  methods: {
    async reload () {
      this.loading = true
      await this.$store.dispatch('invoice/loadBundles', this.options)
      .catch (error => this.showError(error))
      this.loading = false
    },
    showError (error) {
      this.errorMessage = 'Unbekannter Server Fehler'
      if (error.response && error.response.data) {
        this.errorMessage = error.response.data.message
      }
      this.errorSnack = true
      this.loading = false
    }
  }
}
</script>
