export const state = () => ({
  contract: undefined,
  contracts: []
  })

  export const getters = {
    contract: state => state.contract,
    contracts: state => state.contracts
  }

  export const actions = {
    async loadContractData ({ commit }, { contractNumber, forceReload }) {
      return new Promise((resolve, reject) => {
        let promise
        if (forceReload) {
          promise =  this.$axios.post(`/cloud2/contract/${contractNumber}`)
        } else {
          promise =  this.$axios.get(`/cloud2/contract/${contractNumber}`)
        }
        promise.then(response => {
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
    async generateAnnualStatement ({ commit }, { year, contractNumber, statement }) {
      return new Promise((resolve, reject) => {
        this.$axios.post(`/cloud2/contract/${contractNumber}/annual_statement/${year}`, statement)
        .then(response => {
          commit('setContract', response.data.data)
          resolve(response.data.data)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    async addCounterValue ({ commit }, { counter }) {
      return new Promise((resolve, reject) => {
        if (counter.id) {
          this.$axios.put(`/cloud2/contract/counter_values/${counter.id}`, { counter })
          .then(response => {
            resolve(response.data.data)
          })
          .catch(error => {
            reject(error)
          })
        }else{
          this.$axios.post(`/cloud2/contract/counter_values`, { counter })
          .then(response => {
            resolve(response.data.data)
          })
          .catch(error => {
            reject(error)
          })
        }
      })
    },
    async deleteCounterValue ({ commit }, { counter }) {
      return new Promise((resolve, reject) => {
        this.$axios.delete(`/cloud2/contract/counter_values/${counter.id}`)
        .then(response => {
          resolve(response.data.data)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    async storeManuellData ({ commit }, { contractNumber, year, data }) {
      return new Promise((resolve, reject) => {
        console.log(contractNumber, year, data)
        this.$axios.put(`/cloud2/contract/${contractNumber}/annual_statement/${year}/manuell_data`, { data })
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
    setContract: (state, data) => state.contract = data,
    setContracts: (state, data) => state.contracts = data
  }
