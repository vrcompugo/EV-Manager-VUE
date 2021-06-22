export const state = () => ({
    dealData: undefined
  })

  export const getters = {
    dealData: state => state.dealData
  }

  export const actions = {
    async loadDealData ({ commit }, { dealId }) {
      const response = await this.$axios.get(`/fakturia/${dealId}`)
      commit('setDealData', response.data.data)
    },
    async createContractNumber ({ commit }, { dealId }) {
      const response = await this.$axios.post(`/fakturia/${dealId}/create_contract_number`)
      commit('setDealData', response.data.data)
    },
    async setMasterDeal ({ commit }, { dealId }) {
      const response = await this.$axios.post(`/fakturia/${dealId}/to_master`)
      commit('setDealData', response.data.data)
    },
    async assignSubDeal ({ commit }, { dealId, subDealId, itemIndex }) {
      const response = await this.$axios.post(`/fakturia/${dealId}/item/${itemIndex}/deal`, { sub_deal_id: subDealId })
      commit('setDealData', response.data.data)
    },
    async storeItem ({ commit }, { deal, listIndex, index, newUsage, newUsageOutside }) {
      const response = await this.$axios.put(`/fakturia/${deal.id}/item/${listIndex}/${index}`, { deal, newUsage, newUsageOutside })
      commit('setDealData', response.data.data)
    },
    async storeItems ({ commit }, { deal, newItemsList }) {
      const response = await this.$axios.post(`/fakturia/${deal.id}/item`, { deal, newItemsList })
      commit('setDealData', response.data.data)
    },
    async deleteItems ({ commit }, { deal, listIndex }) {
      const response = await this.$axios.delete(`/fakturia/${deal.id}/item/${listIndex}`)
      commit('setDealData', response.data.data)
    },
    async export ({ commit }, { deal }) {
      const response = await this.$axios.post(`/fakturia/${deal.id}/export`)
      commit('setDealData', response.data.data)
    }
  }

  export const mutations = {
    setDealData: (state, data) => state.dealData = data
  }
