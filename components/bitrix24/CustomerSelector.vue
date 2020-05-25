<style lang="scss" scoped>

</style>

<template>
  <div>
    <v-autocomplete
        v-model="model"
        :items="items"
        :loading="isLoading"
        :search-input.sync="search"
        :label="label"
        @input="emitInput"
        auto-select-first
        clearable
        dense
        chips
        hide-no-data
        hide-selected
        item-text="Description"
        item-value="id"
        return-object
      ></v-autocomplete>
  </div>
</template>

<script>
export default {
  props: ["label", "value"],

  data(){
    return {
      descriptionLimit: 60,
      entries: [],
      isLoading: false,
      model: null,
      search: null
    }
  },

  computed: {
    items () {
      if(this.entries.length == 0 && this.value){
        this.entries = [this.value]
        this.model = this.value
      }
      return this.entries.map(entry => {
        const Description = `${entry.company} - ${entry.firstname} ${entry.lastname}`
        return Object.assign({}, entry, { Description })
      })
    },
  },

  watch: {
    search (val) {

      // Items have already been requested
      if (this.isLoading) return

      this.isLoading = true

      this.$axios
        .get(`/customers/?q=fulltext: *${val}*`)
        .then(response => {
          this.count = response.data.total_count
          this.entries = response.data.data
        }).catch(response=>{
          console.log(response)
        })
        .finally(() => (this.isLoading = false))
    },
  },

  methods: {
    emitInput(){
      this.$emit('input', this.model)
    }
  }
}
</script>
