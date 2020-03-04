<template>
  <div class="main-content">
    <div><form action="/Email/List" method="post" class="ajaxform" data-target="#main">
                                <input type="hidden" name="data[style]" value="grouped"><input type="hidden" name="data[type]" value="read"><input type="hidden" name="data[user_id]" value="2"><input type="hidden" name="data[fulltext]" value="">
			<div class="datapair datapair-select datapair-style ">
				<label for="select_style" style="display: none;">Gruppiert</label>
				<select id="select_style" name="data[style]"><option value="plain">Nach Datum</option><option value="grouped" selected="selected">Gruppiert</option></select>

			</div>
			<div class="datapair datapair-select datapair-type ">
				<label for="select_type" style="display: none;">Trash</label>
				<select id="select_type" name="data[type]"><option value="">Alle</option><option value="unread">Ungelesen</option><option value="read" selected="selected">Gelesen</option><option value="spam">Spam</option><option value="trash">Trash</option></select>

			</div>
			<div class="datapair datapair-text datapair-fulltext ">
				<label for="text_fulltext">Suche</label>
				<input type="text" id="text_fulltext" name="data[fulltext]" value="">

			</div>                <button type="submit">Filtern</button>

                <span style="padding-left: 2em">Voreingestellte Filter:</span>
                <a href="#" class="button email-filter" data-type="unread" data-fulltext="">Ungelesen</a>
                <a href="#" class="button email-filter" data-type="unread" data-fulltext="Informationsanfrage www.permanentline.de:">Informationsanfrage P-Line</a><a href="#" class="button email-filter" data-type="unread" data-fulltext="Informationsanfrage www.labina24.de:">Informationsanfrage Labina24</a><a href="#" class="button email-filter" data-type="unread" data-fulltext="Labina24: Neue Bestellung Nr. #">Bestellungen</a><a href="#" class="button email-filter" data-type="" data-fulltext="Willkommen,">Anmeldung Shopsystem</a>            </form></div>
    <div class="layout horizontal" style="overflow: auto;">
      <div class="list">
        <v-simple-table fixed-header>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Gelesen</th>
                <th class="text-left"></th>
                <th class="text-left">Betreff/Datum</th>
                <th class="text-left"></th>
                <th class="text-left"></th>
                <th class="text-left"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="email in emails" :key="email.id" @click="openEmail(email)">
                <th class="text-left">G GA</th>
                <th class="text-left">D</th>
                <th class="text-left" style="font-weight: normal;">
                  <div>
                    <span v-for="(tmp, external) in email.externalAddresses" :key="external">
                      {{ external }},
                    </span>
                  </div>
                  <div style="float:right;">{{ email.date}}</div>
                  <span style="font-size: 1.4em;">{{ email.subject}}</span>
                </th>
                <th class="text-left">a</th>
                <th class="text-left">a</th>
                <th class="text-left">a</th>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </div>
      <div class="detail"><iframe :src="'/Email/Detail/' + selected_id" frameborder="0"></iframe></div>
    </div>
  </div>
</template>

<script>

export default {
  auth: false,

  data() {
    return {
      selected_id: 0,
      headers: [
        {
          text: 'Datum',
          align: 'start',
          value: 'date',
        },
        {
          text: 'Betreff',
          value: 'subject',
        },
        {
          text: 'Anhänge',
          value: 'hasAttachments',
        }
      ]
    }
  },

  async asyncData({ $axios }) {
    const emails = await $axios.$post(
      '/api/v2/Email/Journal',
      {
        "values": {},
        "options": {}
      },
      {
        headers: { 'Content-Type': 'application/json' }
      })
    console.log(emails)
    return { emails }
  },

  methods: {
    openEmail: function(email){
      this.selected_id = email.id;
    }
  }
}
</script>

<style lang="scss" scoped>
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.detail,
.list {
  background: #ffffff;
  border-radius: 5px;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.5);
  margin: 0.5em
}
.detail {
  display: flex;
  flex: 1;
}
.list {
  flex: 1;
  overflow: auto;
}
iframe {
  flex: 1;
}
.text-left {
  text-align: left;
}
tbody tr {
  cursor: pointer;
}
</style>
