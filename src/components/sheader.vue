<template>
	<header>
		{{ title }}
	</header>
</template>

<script>
export default {
	props: {
		title: String
	}
}

</script>

<style scoped>
	header{
		position: fixed;
		height: 50px;
		line-height: 50px;
		top: 0;
		left: 0;
		right: 0;
		background: #828282;
		/*opacity: 0.5;*/
		text-align: center;
		color: #FFF;
		border-bottom: 1px solid #DDD;
	}
	
</style>