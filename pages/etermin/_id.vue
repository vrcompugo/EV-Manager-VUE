<style lang="scss" scoped>
  table tr th {
    text-align: left;
  }
  table tr th,
  table tr td {
    padding: 0.2em 0.4em;
  }
</style>


<template>
  <div>
    <h2>eTermin</h2>

    <table>
      <tr>
        <th>Begin</th>
        <th>Ende</th>
        <th>Kommentar</th>
      </tr>
      <tr v-for="event in events" :key="event.id">
        <td>{{ getFormattedDate(event.begin) }}</td>
        <td>{{ getFormattedDate(event.end) }}</td>
        <td>{{ event.comment }}</td>
      </tr>
    </table>
  </div>
</template>



<script>
import { convertToLocalISOString } from '~/components/calendar/date_column_convertion'

export default {
  components: {
  },
  async asyncData(context) {
    const data = {
      "id": context.params.id,
      "token": context.query.token,
      "events": []
    }
    console.log(data)
    const events = await context.$axios.get(`/bitrix24/etermin/events/${data["id"]}`, undefined, {
      "authorization": data["token"]
    })
    if (events) {
      data["events"] = events.data.items
    }
    return data
  },

  methods: {
    getFormattedDate(date) {
      var date_object = new Date(date)
      return date_object.toLocaleDateString('de-DE', {year: 'numeric', month: '2-digit', day: '2-digit'})
    }
  }
}
</script>
