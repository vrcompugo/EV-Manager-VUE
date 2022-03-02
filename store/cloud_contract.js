export const state = () => ({
  contract: undefined,
  contracts: []
  })

  export const getters = {
    contract: state => state.contract,
    contracts: state => state.contracts
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
    async loadContracts ({ commit }, { year }) {
      return new Promise((resolve, reject) => {
        this.$axios.get(`/cloud2/contract/${year}/list`)
        .then(response => {
          commit('setContracts', response.data.data)
          resolve(response.data.data)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    async checkContractData ({ commit }, { contractNumber, year }) {
      return new Promise((resolve, reject) => {
        this.$axios.get(`/cloud2/contract/${contractNumber}/check/${year}`)
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
    },
    async storeManuellData ({ commit }, { year, contract }) {
      return new Promise((resolve, reject) => {
        this.$axios.put(`/cloud2/contract/${contract.contract_number}/manuell_data/${year}`, { contract })
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
    setContract: (state, data) => state.contract = data,
    setContracts: (state, data) => state.contracts = data
  }
