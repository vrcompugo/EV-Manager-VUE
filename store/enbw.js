export const state = () => ({
})

export const getters = {
}

export const actions = {
  async getTarifs ({ commit }, { deal }) {
    return new Promise((resolve, reject) => {
      this.$axios.get(`/enbw/tarif/${deal.id}`)
        .then(response => {
          resolve(response.data.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  async uploadContract ({ commit }, {deal, contractFile, tarif, isTerminated}) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("contract_file", contractFile);
      formData.append("deal_id", deal["id"]);
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
