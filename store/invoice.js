export const state = () => ({
  bundles: undefined
})

export const getters = {
  bundles: state => state.bundles
}

export const actions = {
  async loadBundles ({ commit }, { sortBy, sortDesc, page, itemsPerPage }) {
    return new Promise((resolve, reject) => {
      this.$axios.get(`/invoice/bundles`, {
        params: {
          sort_by: sortBy,
          sort_desc: sortDesc,
          page,
          per_page: itemsPerPage
        }
      })
      .then(response => {
        commit('setBundles', response.data.data)
        resolve(response.data.data)
      })
      .catch(error => {
        reject(error)
      })
    })
  },
}

export const mutations = {
  setBundles: (state, data) => state.bundles = data
}
