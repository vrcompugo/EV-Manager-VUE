import Vue from 'vue'
// const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
const daysShort = ['So.', 'Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.']

export function dateFormat (date, format) {
  let t
  const d = new Date(date)
  if (format === 'relative') {
    t = new Date()
    if (t.getDate() === d.getDate() && t.getMonth() === d.getMonth() && t.getFullYear() === d.getFullYear()) {
      return 'Heute'
    }
    t.setDate(t.getDate() - 1)
    if (t.getDate() === d.getDate() && t.getMonth() === d.getMonth() && t.getFullYear() === d.getFullYear()) {
      return 'Gestern'
    }
    t.setDate(t.getDate() - 1)
    if (t.getDate() === d.getDate() && t.getMonth() === d.getMonth() && t.getFullYear() === d.getFullYear()) {
      return 'Vorgestern'
    }
  }
  return daysShort[d.getDay()] + ' ' + ('0' + d.getDate()).substr(-2) + '.' + ('0' + (d.getMonth() + 1)).substr(-2) + '.' + d.getFullYear()
}

export function dateTimeFormat (date, format) {
  const d = new Date(date)
  return dateFormat(date, format) + ' ' + ('0' + d.getHours()).substr(-2) + ':' + ('0' + d.getMinutes()).substr(-2)
}

Vue.filter('dateTimeFormat', function (value) {
  if (value && value !== 'None') {
    return dateTimeFormat(value)
  } else {
    return ''
  }
})
