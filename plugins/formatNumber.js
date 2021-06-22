import Vue from 'vue'


export function formatPrice (number) {
  return formatNumber(number, 2) + " €"
}

export function formatNumber (number, digits=2) {
  if(number === undefined || number === ""){
    number = 0
  }
  number = Math.round(number * 100) / 100
  if (digits === null) {
    return number.toLocaleString('de-DE', {"minimumFractionDigits": 0, "maximumFractionDigits": 2})
  }
  return number.toLocaleString('de-DE', {"minimumFractionDigits": digits, "maximumFractionDigits": digits})
}

Vue.filter('formatPrice', function (value) {
  if (value && value !== 'None') {
    return formatPrice(value)
  } else {
    return ''
  }
})

Vue.filter('formatNumber', function (value) {
  if (value && value !== 'None') {
    return formatNumber(value)
  } else {
    return ''
  }
})
