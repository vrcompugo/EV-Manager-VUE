export const state = () => ({
  user: undefined,
})

export const getters = {
  user: state => state.user,

  checkBookkeepingRights: (state) => {
    if (state.user === undefined) {
      return false
    }
    let result = false
    if (state.user.id === 48){
      return true
    }
    const departments = ["Innendienst", "After Sales ???", "After Sales Neu", "Buchhaltung", "Extern IT Unterstützung", "KeSO"]
    for(let i=0; i<departments.length; i++){
      if (state.user.bitrix_department.indexOf(departments[i]) >= 0){
        return true
      }
    }
    return false
  },
  checkCloudRights: (state) => {
    if (state.user === undefined) {
      return false
    }
    let result = false
    if (state.user.id === 48){
      return true
    }
    console.log(state.user)
    const departments = ["efi-Strom (Cloud)", "e360 (Cloud)", "Extern IT Unterstützung", "KeSO"]
    for(let i=0; i<departments.length; i++){
      if (state.user.bitrix_department.indexOf(departments[i]) >= 0){
        return true
      }
    }
    return false
  },
  checkMitteRights: (state) => {
    if (state.user === undefined) {
      return false
    }
    let result = false
    if (state.user.bitrix_department.indexOf("energiezentrum-mitte EXTERN") >= 0){
      return true
    }
    return false
  }
}

export const actions = {

  setUser ({ commit }, user) {
    commit('setUser', user)
  },

}

export const mutations = {
  setUser: (state, user) => state.user = user
}



