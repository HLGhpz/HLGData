import Vue from 'vue'
import VueRouter from 'vue-router'
import EchartsPage from '../views/EchartsPage'
import MoviePage from '../views/MoviePage'
import BTCPage from '../views/BTCPage'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/btc'
  },
  {
    path: '/echarts',
    component: EchartsPage
  },
  {
    path: '/movie',
    component: MoviePage
  },
  {
    path: '/btc',
    component: BTCPage
  }
]

const router = new VueRouter({
  routes
})

export default router
