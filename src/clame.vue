<template>
	<div>
		<p>1222223</p>
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

		}
	},
	methods:{

	},
	vuex:{
		actions:{
			modifyTitle
		}
	},
	route:{
		data:function(transient){
			this.modifyTitle('clame')
		}
	}
}
</script>

<style scoped>

</style>