import {createRouter, createWebHashHistory} from 'vue-router'
import Home from '../components/Home.vue';
import Trace from '../components/Trace.vue';
import About from '../components/About.vue';

const routes = [{
  path: "/",
  component: Home,
  name: "Home"
}, {
  path: "/about",
  component: About,
  name: "About"
}, {
  path: "/trace/:id",
  component: Trace,
  name: "Trace"
}]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router;