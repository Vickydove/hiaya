<template>
<div>
    <img :src="ghoulUrl" class="img">
    <h1>注册界面</h1>
    <div class="register">
        <el-form ref="registerForm" :model="users" :rules="rules" label-width="80px"> 
            <el-form-item label=" 用户名" prop="name">
                <el-input v-model="users.name" type="text" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pass">
                <el-input v-model="users.pass" type="password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="register">注册</el-button>
                <el-button  @click="cancle">取消</el-button>
            </el-form-item>
        </el-form>
    </div> 
    <!-- <div class="">
        <el-input v-model="inpContent"></el-input>
        <el-input v-model="inpCount"></el-input>
        <el-button type="primary" @click="getValue">获取数据</el-button>
        <el-button type="primary" @click="setValue">添加数据</el-button>
    </div> -->
</div>
</template>

<script>
// import { valid } from 'semver';
export default {
    data(){
        return{
            // inpContent: '',
            // inpCount:1,
            ghoulUrl:require("../assets/ghoul.jpeg"),
            users:{},
            rules:{
                name:[{required:true,message:'用户名不能为空',trigger:'blur'}],
                pass:[{required:true,message:'密码不能为空',trigger:'blur'}]
            }
        }
    },
    methods:{
        register:function(){
            this.$refs.registerForm.validate(valid=>{
                if(valid){
                    this.$http.post('/api/setValue', {
                        name: this.users.name,
                        pass: this.users.pass
                    }).then( (res) => {
                        console.log('res', res);
                        this.$msgbox.confirm('注册成功，返回登录界面么？','commit').then((res)=>{
                            this.$router.replace('/login')
                        }).catch(()=>{
                            this.$message.info('不返回登录界面')
                        })
                    })
                }else{
                    this.$message.error('用户名或密码不能为空')
                }
            })
        },
        cancle:function(){
            this.users.name=''
            this.users.pass=''
            this.$msgbox.confirm('取消注册，返回登录界面么？','cancle').then((res)=>{
                this.$router.replace('/login')
            }).catch(()=>{
                this.$message.info('不返回登录界面')
            })
        }
        // getValue() {
        // // axios.get('/', {params: ''})
        //     this.$http.get('/api/getValue', {
        //         params: {id: this.inpCount}
        //     }).then( (res) => {
        //         console.log('res', res);
        //         this.inpContent = res.data[0].name;
        //     })
        // },
        // setValue() {
        // // axios.post('/', {})
        //     this.$http.post('/api/setValue', {
        //         id: parseInt(this.inpCount), name: this.inpContent
        //     }).then( (res) => {
        //         console.log('res', res);
        //     })
        // }
    }
    
}
</script>

<style scoped>
.register{
    margin-left:25%;
    width: 50% ;
}
.img{
    width: 50%
}
</style>
  