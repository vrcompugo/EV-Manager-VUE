<style lang="scss" scoped>
  table {
    th {
      background-color: #dddddd;
      text-align: left;
      font-weight: normal;
      font-size: 0.9em;
    }
    th, td {
      padding: 0.2rem 0.5rem;
    }
    tr.inactive {
      background: red;
    }
  }
</style>


<template>
  <div class="layout vertical" style="max-height: 100%;">
    <div v-if="listError">
      {{ errorMessage }}
    </div>
    <div v-else>
      <table cellspacing="0">
        <tr>
          <th></th>
          <th>Mitarbeiter</th>
          <th>Letzte Zuordnung</th>
          <th>Zyklus Zuordnungen</th>
          <th>Zyklus Monat</th>
          <th>max. Zuordnungen/Monat</th>
          <th>PLZ Gebiet</th>
        </tr>
        <tr v-for="user in users" :key="user.ID" :class="user.ACTIVE || 'inactive'">
          <td><v-btn @click="openEditDialog(user)" small>Bearbeiten</v-btn></td>
          <td>{{ user.NAME }} {{ user.LAST_NAME }}</td>
          <td>{{ user.association.last_assigned | dateTimeFormat }}</td>
          <td>{{ user.association.current_cycle_count }}</td>
          <td>{{ user.association.current_cycle_index }}</td>
          <td>{{ user.association.max_leads }}</td>
          <td><div style="white-space: nowrap; width: 30em; overflow: auto;">{{ user.association.data.join(", ") }}</div></td>
        </tr>
      </table>
    </div>


    <v-dialog
      v-model="editUserDialog"
      width="500"
      modal
    >
      <v-card v-if="editUser">
        <v-card-title class="headline grey lighten-2" primary-title >
          {{ editUser.NAME }} {{ editUser.LAST_NAME }} bearbeiten
        </v-card-title>

        <v-card-text>
          <v-text-field
            v-model="editUser.association.max_leads"
            type="number"
            step="1"
            label="max. Zuordnungen/Monat"></v-text-field>
          <v-textarea
            v-model="editUser.association.rawData"
            label="PLZ-Liste"></v-textarea>
        </v-card-text>
        <div v-if="editErrorMessage">
          {{ editErrorMessage }}
        </div>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="secondary"
            text
            @click="editUserDialog = false"
          >
            Abbrechen
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="storeUserData"
            :disabled="loading"
            :loading="loading"
          >
            Speichern
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import { cloneDeep } from 'lodash'

export default {

  components: {
  },

  mounted(){
    this.reload()
  },

  data(){
    return {
      "editUserDialog": false,
      "users": [],
      "editUser": undefined,
      "listError": false,
      "errorMessage": "",
      "editErrorMessage": ""
    }
  },

  computed: {
  },

  methods: {
    async reload() {
      this.loading = true
      try{
        const response = await this.$axios.get(`/users/sales_users`)
        this.users = response.data.data
      } catch (err) {
        this.listError = true
        if(err.response.data.message){
          this.errorMessage = err.response.data.message
        } else {
          this.errorMessage = err.message
        }
      }
      this.loading = false
    },
    openEditDialog (user) {
      if(user.association.data) {
        user.association.rawData = user.association.data.join("\n")
      } else {
        user.association.rawData = ""
      }
      this.editUser = user
      this.editUserDialog = true
    },
    async storeUserData () {
      if (this.editUser.association.rawData == "") {
        this.editUser.association.data = []
      }else{
        let data = this.editUser.association.rawData.split("\n")
        for(let i=0; i < data.length; i++) {
          data[i] = data[i].trim()
        }
        this.editUser.association.data = data
      }
      this.loading = true
      try{
        const response = await this.$axios.post(`/users/sales_users`, this.editUser)
        const editUser = response.data.data
        for(let i=0; i < this.users.length; i++) {
          if(this.users[i]["ID"] == editUser["ID"]){
            this.users[i] = cloneDeep(editUser)
          }
        }
        this.editUserDialog = false
      } catch (err) {
        if(err.response.data.message){
          this.editErrorMessage = err.response.data.message
        } else {
          this.editErrorMessage = err.message
        }
      }
      this.loading = false
    }
  }
}
</script>
