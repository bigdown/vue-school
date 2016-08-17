<template>
	<footer>
		<div v-link="{ path: '/app/home' }" class="home"></div>
		<div v-link="{ path: '/app/message' }" class="message"></div>
		<div v-link="{ path: '/app/clame' }" class="clame"></div>
		<div v-link="{ path: '/app/line' }" class="line"></div>
	</footer>
</template>

<script>
	

</script>

<style scoped>
	footer{
		position: fixed;
		height: 50px;
		line-height: 50px;
		bottom: 0;
		left: 0;
		right: 0;
		background: #FFF;
		/*opacity: 0.5;*/
		text-align: center;
		color: #FFF;
		border-top: 1px solid #DDD;
		z-index: 10;
	}
	footer div{
		width: 25%;
		float: left;
		border: none;
		display: inline-block;
		height: 50px;
		line-height: 50px;
		text-align: center;
		cursor: pointer;
	}
	.home{
		background: url(../assets/home.png) center center no-repeat; 
		-webkit-filter:grayscale(1);
	}
	.clame{
		background: url(../assets/clame.png) center center no-repeat;
		-webkit-filter:grayscale(1);
	}
	.message{
		background: url(../assets/message.png) center center no-repeat;
		-webkit-filter:grayscale(1);
	}
	.line{
		background: url(../assets/line.png) center center no-repeat;
		-webkit-filter:grayscale(1);
	}
	.v-link-active{
		-webkit-filter:grayscale(0);
	}
</style>