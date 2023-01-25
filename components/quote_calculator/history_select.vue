<style lang="scss" scoped>
  .item {
    padding: 0.2em 0;
    margin: 0.2em 0;
    border-bottom: 1px solid #ccc;
  }
  .item .version {
    line-height: 2em;
  }
  .item .item-actions {
    display: none;
  }
  .item:hover .item-actions {
    display: block;
  }
</style>

<template>
  <div>
    <div class="item layout horizontal center" v-for="(history, index) in histories__" :key="history.id">
      <div class="version" style="margin-right: 1em">
        Version {{ history.id }}
      </div>
      <div v-if="!isEdit(history)" @click="editHistory(history)" class="label flex">
        {{ history.label }} &nbsp;
      </div>
      <div v-if="isEdit(history)" class="label flex">
        <v-text-field label="Bezeichnung" v-model="history.label" @blur="storeHistoryLabel(history)" />
      </div>
      <div class="item-actions">
        <v-btn small @click="pushUpHistory(history)">
          <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><g><rect fill="none" height="24" width="24"/><path d="M16,18v2H8v-2H16z M11,7.99V16h2V7.99h3L12,4L8,7.99H11z"/></g></svg>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {

  props: [
    'histories'
  ],

  data(){
    return {
      histories__: [],
      editId: 0
    }
  },
  mounted () {
    this.refresh()
  },

  methods: {
    refresh () {
      this.histories__ = this.histories
    },
    isEdit (history) {
      return history.id === this.editId
    },
    editHistory (history) {
      console.log("edit", history)
      this.editId = history.id
    },
    async storeHistoryLabel (history) {
      try {
        const response = await this.$axios.put(`/quote_calculator/history/${history.id}`, history)
        history.label = response.data.data.label
      } catch (error) {
        history.label = ''
      }
      this.editId = 0
    },
    async pushUpHistory (history) {
      try {
        const response = await this.$axios.post(`/quote_calculator/history/${history.id}/push`)
      } catch (error) {
      }
      this.$emit("refresh")
    }
  }

}
</script>