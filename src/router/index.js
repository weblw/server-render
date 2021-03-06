import Vue from 'vue'
import Router from 'vue-router'

// 页面
import Index from '@/components/Index'
import Detail from '@/components/Detail'

Vue.use(Router)

// 导出的应当是Router实例工厂函数
export function createRouter(){
  return new Router({
    mode:'history',
    routes:[
      {path:'/',component:Index},
      {path:'/detail',component:Detail},
    ]
  })
}