export const state = () => ({
})

export const getters = {
}

export const actions = {
  async uploadContract ({ commit }, {deal, contractFile}) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("contract_file", contractFile);
      formData.append("deal_id", deal["id"]);
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
