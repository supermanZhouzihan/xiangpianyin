import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'home',
  //   component: HomeView
  // },
  {
    path: '/',
    name: 'Index',
    component: () => import(/* webpackChunkName: "about" */ '../views/index.vue')
  },
  {
    path: '/signIn',
    name: 'signIn',
    component: () => import(/* webpackChunkName: "about" */ '../views/signIn.vue')
  },

]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
