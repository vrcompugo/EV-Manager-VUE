<template>
  <nuxt />
</template>

<script>
import { mapGetters } from 'vuex'

export default {}
</script>

<style lang="scss">
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  height: 100vh;
  overflow: auto;
}
body {
  padding: 0;
  margin: 0;
  height: 100vh;
  display: flex;
  overflow: auto;
}
#__nuxt, #__layout {
  display: flex;
  flex: 1
}
a {
  color: #666666;
  &:hover {
    color: #AD1457;
  }
}
</style>
