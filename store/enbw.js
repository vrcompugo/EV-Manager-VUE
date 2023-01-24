export const state = () => ({
})

export const getters = {
}

export const actions = {
  async uploadContract ({ commit }, deal) {
    return new Promise((resolve, reject) => {
      return this.$axios.post(`/enbw/contract`, deal)
        .then(response => {
          resolve(response.data.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

export const mutations = {
}
