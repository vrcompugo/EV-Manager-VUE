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
    }
  }

  export const mutations = {
    setDealData: (state, data) => state.dealData = data
  }
