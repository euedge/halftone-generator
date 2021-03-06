import Vue from 'vue'
import App from './App.vue'
import store from './store/index.js'
import firebase from 'firebase'
import {config} from './cfg/firebaseCfg.js'

Vue.config.productionTip = false
let a = firebase.initializeApp(config)
const db = firebase.database()

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')

export { db }
