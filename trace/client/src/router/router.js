import {createRouter, createWebHashHistory} from 'vue-router'
import HelloWorld from '../components/HelloWorld.vue'
import About from '../components/About.vue'

const routes = [{
  path: "/", component: HelloWorld,
}, {
  path: "/about", component: About
}]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router;