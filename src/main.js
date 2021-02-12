import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import axios from 'axios'
import loadsh from 'loadsh'
import * as echarts from 'echarts'
import moment from 'moment'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.less'
import '../public/static/theme/infographic'
import '../public/static/theme/macarons'
import '../public/static/theme/roma'
import '../public/static/theme/shine'

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
Vue.prototype._ = loadsh

axios.defaults.baseURL = "http://localhost:8383/static/data"
Vue.prototype.$http = axios
Vue.prototype.$moment = moment
Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
