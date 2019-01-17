import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Main from '@/components/Main'
import Register from '@/components/Register'
import ChangePassword from '@/components/ChangePassword'
import novelPlan from '@/components/novelPlan'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path:'/main',
      name:'Main',
      component:Main,
      children:[
        {
          path:'/novelplan',
          name:'novelPlan',
          component:novelPlan
        },
      ]
    },
    {
      path:'/login',
      name:'Login',
      component:Login
    },
    {
      path:'/register',
      name:'Register',
      component:Register
    },
    {
      path:'/changepassword',
      name:'ChangePassword',
      component:ChangePassword
    },
  ],
  mode:'history'
})
