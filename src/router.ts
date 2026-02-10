import { createRouter, createWebHistory } from 'vue-router'
import Lander from './pages/Lander.vue'
import Contact from './pages/Contact.vue'
import NotFound from './pages/NotFound.vue'
import Cars from './pages/Cars.vue'

const routes = [
  { path: '/', name: 'home', component: Lander },
  { path: '/contact', name: 'contact', component: Contact },
  { path: '/cars', name: 'cars', component: Cars },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
]

const router = createRouter({
  history: createWebHistory('/'),
  routes,
})

// Handle GitHub Pages redirect
router.beforeEach((to, from, next) => {
  const isGitHubPages = window.location.hostname === 'davegraff.github.io'
  if (isGitHubPages && to.path === '/' && window.location.search) {
    const params = new URLSearchParams(window.location.search)
    const redirect = params.get('p')
    if (redirect) {
      // Check if the redirect path exists in our routes
      const validPaths = routes.map(route => route.path)
      const pathExists = validPaths.includes(redirect) || 
                        (redirect !== '/' && validPaths.some(path => 
                          path !== '/' && redirect.startsWith(path.replace('*', ''))))
      
      if (pathExists) {
        next(redirect)
        return
      } else {
        // Route doesn't exist, show 404 page
        next('/not-found')
        return
      }
    }
  }
  next()
})

export default router