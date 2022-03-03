import Vue from 'vue'
import moment from '@/plugins/moment-ja'

Vue.filter('format-datetime', function (value) {
  let date = moment(value)
  if (date === 'Invalid date') {
    date = '-'
  }
  return date.format('YYYY/MM/DD HH:mm')
})
Vue.filter('format-date', function (value) {
  let date = moment(value).format('YYYY/MM/DD')
  if (date === 'Invalid date') {
    date = '-'
  }
  return date
})
Vue.filter('format-Sdate', function (value) {
  let date = moment(value).format('MM/DD')
  if (date === 'Invalid date') {
    date = '-'
  }
  return date
})
Vue.filter('format-month', function (value) {
  let date = moment(value).format('YYYY/MM')
  if (date === 'Invalid date') {
    date = '-'
  }
  return date
})
Vue.filter('format-time', function (value) {
  let date = moment(value).format('HH:mm')
  if (date === 'Invalid date') {
    date = value
  }
  return date
})
Vue.filter('miliSecToTime', function (ms) {
  if (typeof ms !== 'number') {
    return ms
  }
  const h = String(Math.floor(ms / (1000 * 60 * 60)))
  const m = ('00' + Math.floor((ms - h * (1000 * 60 * 60)) / 60000)).slice(-2)
  return h + ':' + m
})
Vue.filter('format-amount', function (amount) {
  if (typeof amount !== 'number') {
    console.log('not A number:' + amount)
    return amount
  }
  return amount.toLocaleString()
})
