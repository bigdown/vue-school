<template>
	<div v-bind:style="stylehome" v-touch:pan="onPan" v-touch:panend="onPanEnd" v-touch-options:pan="{ direction: 'vertical', threshold: 0 }">
		<p>home</p>
		<p>home</p>
		<p>home</p>
		<p>home</p>
		<p>home</p>
		<p>home</p>
		<p>home</p>
		<p>home</p>
		<p>home</p>
		<p>home</p>
		<p>home</p>
		<p>home</p>
		<p>home</p>
		<p>home</p>
		<p>home</p>
		<p>home</p>
		<p>home</p>
		<p>home</p>
		<p>home</p>
		<p>home6</p>
		<p>home1</p>
		<p>home2</p>
	</div>
</template>

<script>
import store from './vuex/store'
import { modifyTitle } from './vuex/actions'
import sheader from './components/sheader.vue' 
import sfooter from './components/sfooter.vue'
export default {
	store,
	data(){
		return {
			stylehome:{
				position: 'absolute',
				left: 0,
				right: 0,
				bottom: '51px',
				top: '51px',
				background:'#EEE',
				overflow: 'auto'
			}
		}
	},
	methods:{
		onPan:function(e){
	    	console.log(e.deltaY)
	    	// this.stylehome.top = (51+e.deltaY) + 'px'
	    	// http://192.168.173.1/query_home.php
	    },
	    onPanEnd:function(e){
	    	console.log('end')
	    	// this.stylehome.top = '51px'
	    }	
	},
	vuex:{
		actions:{
			modifyTitle
		}
	},
	route:{
		data:function(transient){
			this.modifyTitle('首页')
		}
	}
}
</script>

<style scoped>

</style>