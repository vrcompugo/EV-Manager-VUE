export const state = () => ({
})

export const getters = {
}

export const actions = {
  async getTarifs ({ commit }, { dealId }) {
    return new Promise((resolve, reject) => {
      this.$axios.get(`/enbw/tarif/${dealId}`)
        .then(response => {
          resolve(response.data.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  async uploadContract ({ commit }, {dealId, contractFile, tarif, isTerminated}) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("contract_file", contractFile);
      formData.append("deal_id", dealId);
      formData.append("tarif", tarif);
      formData.append("is_terminated", isTerminated);
      return this.$axios.post(
        '/enbw/contract',
        formData,
        {
          headers: {
          'Content-Type': 'multipart/form-data'
          }
        }
      )
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
