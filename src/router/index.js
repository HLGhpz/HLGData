import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main'
import EchartsPage from '../views/EchartsPage'
import MoviePage from '../views/02-电影数据/MoviePage'
import DiretorPage from '../views/02-电影数据/DirectorPage'
import ActorPage from '../views/02-电影数据/Actor'
import BTCPage from '../views/03-比特币/BTCPage'
import EUTradePage from '../views/04-欧盟贸易/EUTrade'
import HousePage from '../views/05-房价/House'
import PopulationPage from '../views/06-人口/Population'
import FundPage from '../views/07-联合国会费/Fund'
import LanguagePage from '../views/08-编程语言/Language'
import DxoPhone from '../views/09-智能设备/DxoPhone'
import Lhy from '../views/02-电影数据/HiLhy'
import USADead from '../views/10-美国疫情/USADead'
import IndiaTrade from '../views/11-商贸数据/IndiaTrade'
import GDP from '../views/12-GDP数据/GDP'
import Subject from '../views/13-学科评估/Subject'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/main'
  },
  {
    path: '/main',
    component: Main
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
  },
  {
    path: '/population',
    component: PopulationPage
  }, {
    path: '/Fund',
    component: FundPage
  }, {
    path: '/language',
    component: LanguagePage
  }, {
    path: '/dxophone',
    component: DxoPhone
  },
  {
    path: '/lhy',
    component: Lhy
  },
  {
    path: '/usadead',
    component: USADead
  }, {
    path: '/IndiaTrade',
    component: IndiaTrade
  }, {
    path: '/gdp',
    component: GDP
  }, {
    path: '/subject',
    component: Subject
  }
]

const router = new VueRouter({
  routes
})

export default router
