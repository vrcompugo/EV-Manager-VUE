export const state = () => ({
  pageTitle: "",
  pageIcon: "",
  snackbars: []
})

export const getters = {
  page: state => state,
  snackbars: state => state.snackbars
}

export const actions = {

  setPageTitle ({ commit, state }, data) {
    commit('setPageTitle', data)
  },

  addSnackbar ({ commit, state }, {text}) {
    const snackbar = {text, showing: true, id: Math.random()}
    setTimeout(() => {
      commit('deleteSnackbar', snackbar.id)
    }, 10000)
    commit('addSnackbar', snackbar)
  },

  deleteSnackbar ({ commit, state }, id) {
    commit('deleteSnackbar', id)
  }

}

export const mutations = {
  setPageTitle: (state, {pageTitle, pageIcon}) => {
    state.pageTitle = pageTitle
    state.pageIcon = pageIcon
  },
  addSnackbar: (state, snackbar) => state.snackbars.push(snackbar),
  deleteSnackbar: (state, id) =>
    (state.snackbars = state.snackbars.filter(item => item.id !== id)),
}
