import {createRouter, createWebHashHistory} from 'vue-router'
import Home from '../components/pages/Home.vue';
import About from '../components/pages/About.vue';
import Trace from '../components/Trace.vue';

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