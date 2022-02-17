export const state = () => ({
  contract: undefined
  })

  export const getters = {
    contract: state => state.contract
  }

  export const actions = {
    async loadContractData ({ commit }, { contractNumber }) {
      return new Promise((resolve, reject) => {
        this.$axios.get(`/cloud2/contract/${contractNumber}`)
        .then(response => {
          commit('setContract', response.data.data)
          resolve(response.data.data)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    async generateAnnualStatement ({ commit }, { year, contractNumber }) {
      return new Promise((resolve, reject) => {
        this.$axios.post(`/cloud2/contract/${contractNumber}/annual_statement/${year}`)
        .then(response => {
          commit('setContract', response.data.data)
          resolve(response.data.data)
        })
        .catch(error => {
          reject(error)
        })
      })
    }
  }

  export const mutations = {
    setContract: (state, data) => state.contract = data
  }
