<template>
	<div>
		<sheader :title="title"></sheader>
		<div class="">
			123
		</div>
		<sfooter></sfooter>
	</div>
</template>

<script>
import sheader from './components/sheader.vue' 
import sfooter from './components/sfooter.vue'
export default {
	data () {
		return {
			title:'首页'
		}
	},
	components:{
		sheader,
		sfooter
	}
}

</script>

<style scoped>
	
</style>