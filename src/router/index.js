import Vue from 'vue'
import VueRouter from 'vue-router'
import EchartsPage from '../views/EchartsPage'
import MoviePage from '../views/MoviePage'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/echarts'
  },
  {
    path: '/echarts',
    component: EchartsPage
  },
  {
    path: '/movie',
    component: MoviePage
  
  }
]

const router = new VueRouter({
  routes
})

export default router
