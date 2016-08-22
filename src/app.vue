<template>
	<div>
		<sheader :raction="raction" :laction="laction" :title="titlestr"></sheader>
		<router-view keep-alive></router-view>
		<sfooter></sfooter>
	</div>
</template>

<script>
import store from './vuex/store'
import { modifyTitle } from './vuex/actions'
import sheader from './components/sheader.vue' 
import sfooter from './components/sfooter.vue'
export default {
	store,
	data () {
		return {
			title:'首页',
			raction:'',
			laction:''
		}
	},
	components:{
		sheader,
		sfooter
	},
	vuex:{
		getters:{
			titlestr : state => state.title
		}
	}
}

</script>

<style scoped>
/*	.scontent{
		height: 100%;
		width: 100%;
		position: relative;
		padding: 50px 0;
		overflow-y: auto;
	}*/
</style>