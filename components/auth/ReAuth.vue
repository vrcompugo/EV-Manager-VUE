<template></template>

<script>

export default {
  data() {
    return {
      "timeout": undefined
    }
  },
  created() {
    this.timeout = setTimeout(this.reauth, 120000)
  },
  methods: {
    reauth(){
      this.$auth.fetchUser().then(user => {
        if(user && user.token){
          console.log("reauth done")
          this.$auth.setUserToken(user.token)
          this.timeout = setTimeout(this.reauth, 120000)
        }
      })
    }
  }
}
</script>
