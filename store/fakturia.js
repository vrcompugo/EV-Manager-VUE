export const state = () => ({
    dealData: undefined
  })

  export const getters = {
    dealData: state => state.dealData
  }

  export const actions = {
    async loadDealData ({ commit }, { dealId }) {
      return new Promise((resolve, reject) => {
        this.$axios.get(`/fakturia/${dealId}`)
        .then(response => {
          commit('setDealData', response.data.data)
          resolve(response.data.data)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    async createContractNumber ({ commit }, { dealId }) {
      return new Promise((resolve, reject) => {
        this.$axios.post(`/fakturia/${dealId}/create_contract_number`)
        .then(response => {
          commit('setDealData', response.data.data)
          resolve(response.data.data)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    async setMasterDeal ({ commit }, { dealId }) {
      return new Promise((resolve, reject) => {
        this.$axios.post(`/fakturia/${dealId}/to_master`)
        .then(response => {
          commit('setDealData', response.data.data)
          resolve(response.data.data)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    async assignSubDeal ({ commit }, { dealId, subDealId, listIndex, itemIndex }) {
      return new Promise((resolve, reject) => {
        this.$axios.post(`/fakturia/${dealId}/item/${listIndex}/${itemIndex}/deal`, { sub_deal_id: subDealId })
        .then(response => {
          commit('setDealData', response.data.data)
          resolve(response.data.data)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    async storeItem ({ commit }, { deal, listIndex, index, newUsage, newUsageOutside }) {
      return new Promise((resolve, reject) => {
        this.$axios.put(`/fakturia/${deal.id}/item/${listIndex}/${index}`, { deal, newUsage, newUsageOutside })
        .then(response => {
          commit('setDealData', response.data.data)
          resolve(response.data.data)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    async storeItems ({ commit }, { deal, newItemsList }) {
      return new Promise((resolve, reject) => {
        this.$axios.post(`/fakturia/${deal.id}/item`, { deal, newItemsList })
        .then(response => {
          commit('setDealData', response.data.data)
          resolve(response.data.data)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    async deleteItems ({ commit }, { deal, listIndex }) {
      return new Promise((resolve, reject) => {
        this.$axios.delete(`/fakturia/${deal.id}/item/${listIndex}`)
        .then(response => {
          commit('setDealData', response.data.data)
          resolve(response.data.data)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    async export ({ commit }, { deal }) {
      return new Promise((resolve, reject) => {
        this.$axios.post(`/fakturia/${deal.id}/export`)
        .then(response => {
          commit('setDealData', response.data.data)
          resolve(response.data.data)
        })
        .catch(error => {
          reject(error)
        })
      })
    }
  }

  export const mutations = {
    setDealData: (state, data) => state.dealData = data
  }
