<template>
  <v-app>
    <nuxt />
  </v-app>
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
.v-application {
  flex: 1;
}
a {
  color: #666666;
  &:hover {
    color: #AD1457;
  }
}

.header {
  background: #43A047;
  padding: 1em;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: white;
  z-index: 100;
  background-color: #d7040b;



  svg {
    fill: white;
  }
  h1 {
    color: inherit;
    font-weight: normal;
    font-size: 1.4em;
  }

}
.main-content {
  padding: 1em;
  align-content: flex-start;

  h2 .v-label {
    font-weight: normal;
    font-size: 1.4em;
    margin-left: 0.2em;
  }
}
.actions {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  background: #BDBDBD;
  padding: 1em;
  text-align: right;
  align-items: center;
}
.section {
  padding-bottom: 3em;
  padding-right: 3em;
  min-width: 300px;
  flex: 1 0 30%;
}
h2 {
  font-weight: normal;
  font-size: 1.4em;
}
h3 {
  font-weight: normal;
}
.layout.horizontal {
  display: flex;
  flex-direction: row;
}
.layout.vertical {
  display: flex;
  flex-direction: column;
}
.layout.wrap {
  flex-wrap: wrap;
}
.layout.center {
  align-items: center;
}
.flex-1 {
  flex: 1;
}
.align-right {
  text-align: right;
}
.v-text-field.align-right{
  .v-text-field__slot {
    input {
      text-align: right;
    }
  }
}
.theme--light.v-input.error--text {
  label.v-label,
  input,
  .v-text-field__suffix,
  .error--text {
    color: red
  }
  .v-input__control > .v-input__slot:before,
  .v-input__control > .v-input__slot:after {
    border-color: red
  }
}
</style>
