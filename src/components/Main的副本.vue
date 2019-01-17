<!-- 主页面-->
<template>
<div>
    <el-row >
        <el-col :span="5" class="menuTip" :style="{height:height+'px'}">
            <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-submenu index="1">
                <template slot="title">
                <i class="el-icon-location"></i>
                <span>阅读计划</span>
                </template>
                <el-menu-item index="1-1"><router-link to="/novelPlan">小说</router-link></el-menu-item>
            </el-submenu>
            </el-menu>
            <el-button class="logout"  @click="logout">退出登录</el-button>
        </el-col>
        <el-col :span="19" class="right" :style="{height:height+'px'}">
            <router-view></router-view>
        </el-col>
    </el-row>
</div>
</template>

<script>
import novelPlan from './novelPlan'
export default {
    data(){
        return{
            height:0,
        }
    },
    methods: {
        logout:function(){//退出登录
            this.$store.dispatch('logout').then(()=>{
                this.$router.replace('/login')
            })
        },
    },
    components:{
        novelPlan
    },
    mounted(){
        let that = this
        that.height = document.documentElement.clientHeight - 20
    },
}
</script>
<style >
.menuTip{
    background-color:aliceblue
}
.right{
    background-color:azure;
    background:url('../assets/yi.jpeg') no-repeat center center ;
    background-size: cover;  /* 让背景图基于容器大小伸缩 */
    /* background-attachment: fixed; */
}
a,a.router-link-exact-active.router-link-active{
    text-decoration: none;
    color:rgb(255, 255, 255);
}

.logout{
    margin-top: 100%;
    background-color:rgb(107, 107, 221);
    color:aliceblue
}
</style>

