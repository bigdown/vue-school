import Vue from 'vue'
import VueRouter from 'vue-router'
import VueTouch from 'vue-touch'
import VueResource from 'vue-resource'
// import css from './default.css'

Vue.use(VueRouter)
Vue.use(VueTouch)
Vue.use(VueResource)
Vue.http.options.emulateHTTP = true
Vue.http.options.emulateJSON = true


var router = new VueRouter({
	hashbang: true,
	history: false,
	saveScrollPosition: true,
	transitionOnLoad: true
})

router.beforeEach((transition) => {
    if (transition.to.auth) {
        transition.next()
    } else {
        if(localStorage.getItem('token') == "123"){
            transition.next()
        }else{
            router.go('/login')
            transition.next()
        }
    }
})

router.map({
	'/login':{
    	component: function (resolve) {
            require(['./login.vue'], resolve)
        },
        auth:true
	},
    '/home':{
    	component: function (resolve) {
            require(['./home.vue'], resolve)
        },
        auth:true
    }
})
router.redirect({
  '*': '/home'
})

var InitApp = Vue.extend({
})

// router.start(Vue.extend(App), '#app');
router.start(InitApp,'#app')
