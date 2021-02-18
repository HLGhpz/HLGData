import Vue from 'vue'
import VueRouter from 'vue-router'
import EchartsPage from '../views/EchartsPage'
import BTCPage from '../views/03-比特币/BTCPage'
import MoviePage from '../views/02-电影数据/MoviePage'
import DiretorPage from '../views/02-电影数据/DirectorPage'
import ActorPage from '../views/02-电影数据/Actor'
import EUTradePage from '../views/04-欧盟贸易/EUTrade'
import HousePage from '../views/05-房价/House2'

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
  },
  {
    path: '/director',
    component: DiretorPage
  },
  {
    path: '/actor',
    component: ActorPage
  },
  {
    path: '/eu',
    component: EUTradePage
  },
  {
    path: '/house',
    component: HousePage
  }
]

const router = new VueRouter({
  routes
})

export default router
