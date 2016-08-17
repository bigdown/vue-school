<template>
	<header>
		<div class="wid20 left">{{{ laction }}}</div>
		<div class="wid60">{{ title }}</div>
		<div class="wid20 right">{{{ raction }}}</div>
	</header>
</template>

<script>
export default {
	props: {
		title: String,
		laction: String,
		raction: String
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
		z-index: 10;
	}
	header > div{
		float: left;
		display: block;
		height: 50px;
		line-height: 50px;
	}
	.wid20{
		width: 20%;
		box-sizing: border-box;
	}
	.wid60{
		width: 60%;
	}
	.left{
		text-align: left;
		padding-left: 10px;
	}
	.right{
		text-align: right;
		padding-right: 10px;
	}
</style>