export const state = () => ({
  user: undefined,
})

export const getters = {
  user: state => state.user,

  checkAdminRights: (state) => {
    if (state.user === undefined) {
      return false
    }
    let result = false
    const users = [
      '15', // Andreas
      '1703', // Vladi
      '1705' // Jessi
    ];
    return users.indexOf('' + state.user.bitrix_user_id) >= 0
  },
  checkBookkeepingRights: (state) => {
    if (state.user === undefined) {
      return false
    }
    let result = false
    if (state.user.id === 48){
      return true
    }
    // list of departments with admin rights
    const departments = ["Innendienst", "After Sales ???", "After Sales Neu", "Buchhaltung", "Extern IT Unterstützung", "KeSO", "ProIntra"]
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
    const departments = ["efi-Strom (Cloud)", "e360 (Cloud)", "Extern IT Unterstützung", "KeSO", "ProIntra"]
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



