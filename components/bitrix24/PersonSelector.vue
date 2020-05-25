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
        :clearable="clearable"
        chips
        item-text="Description"
        item-value="id"
        return-object
        cache-items
        :multiple="multiple"
      ></v-autocomplete>
  </div>
</template>

<script>
export default {
  props: ["label", "value", "multiple", "clearable"],

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

      if(this.entries.length == 0){
        if(this.value){
          if(Array.isArray(this.value)){
            this.entries = this.value
            this.model = this.value
          }else{
            if(this.value.id > 0){
              this.entries = [this.value]
              this.model = this.value
            }
          }
        }
      }
      return this.entries.map(entry => {
        const Description = entry.name
        return Object.assign({}, entry, { Description })
      })
    },
  },

  watch: {
    search (val) {

      // Items have already been requested
      if (this.isLoading) return
      if (!val) return

      this.isLoading = true

      this.$axios
        .get(`/users/?q=fulltext: *${val}*`)
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
