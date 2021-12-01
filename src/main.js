import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueTour from 'vue-tour'

require('vue-tour/dist/vue-tour.css')
Vue.config.productionTip = false

Vue.use(VueTour)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
