import Vue from 'vue'
import Router from 'vue-router'
import Ordering from './views/Ordering.vue'
import DoneOrders from './views/DoneOrders.vue'
import Startpage from './views/Startpage.vue'
import Stock from './views/Stock.vue'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      meta: {
        title: 'Kraft Burgers',
      },
      name: 'ordering',
      component: Ordering
    },
    {
      path:'/start',
      meta: {
        title: 'Skrk'
      },
      name: 'startpage',
      component: Startpage
    },

    {
      path: '/kitchen',
      meta: {
        title: 'Kitchen',
      },
      name: 'kitchen',

      // route level code-splitting
      // this generates a separate chunk (read.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "read" */ './views/Kitchen.vue')
    },


    {
      path:'/DoneOrders',
      meta: {
        title: 'Done Orders'
      },
      name: DoneOrders,
      component: DoneOrders
    },

    {
      path:'/stock',
      meta: {
        title: 'stock'
      },
      name: Stock,
      component: Stock
    },


  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

export default router;
