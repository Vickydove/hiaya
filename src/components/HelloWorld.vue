<template>
  <div class="hello">
    <img :src="yinghuozhisenUrl">
    <h1>{{ msg }}</h1>
    <button @click="toLogin"></button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      yinghuozhisenUrl:require("../assets/萤火之森.jpeg"),
      msg: 'Welcome to Your Home'
    }
  },
  methods:{
    toLogin:function(){
      this.$router.replace('/login')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

</style>
