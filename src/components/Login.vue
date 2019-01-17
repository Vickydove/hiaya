<template>
    <div>
        <img :src="yinghuozhisenUrl" class="img">
        <h1>登录界面</h1>
        <div class="login">
            <el-form ref="loginForm" :model="users" :rules="rules" label-width="80px"> 
                <el-form-item label=" 用户名" prop="name">
                    <el-input v-model="users.name" type="text" placeholder="请输入用户名"></el-input>
                </el-form-item>
               <el-form-item label="密码" prop="pass">
                   <el-input v-model="users.pass" type="password" placeholder="请输入密码"></el-input>
               </el-form-item>
               <el-form-item>
                   <el-button type="primary" @click="login">登录</el-button>
               </el-form-item>
            </el-form>
        </div> 
        <div class="account">
            <el-button type="text" @click="changepassword">忘记密码？</el-button>
        </div>    
        <div class="register">
            还没有账号？<el-button type="text" @click="registerUser">点击注册</el-button>
        </div>   
    </div>
</template>
<script>
export default {
    data(){
        return{
            yinghuozhisenUrl:require("../assets/萤火之森.jpeg"),
            users:{},
            rules:{
                name:[{required:true,message:'用户名不能为空',trigger:'blur'}],
                pass:[{required:true,message:'密码不能为空',trigger:'blur'}]
            }
        }
    },
    methods:{
        login:function(){
            this.$refs.loginForm.validate((valid)=>{ //登录表单验证
                if(valid){
                    this.$http.get('/api/getValue', {
                        params: {name: this.users.name}//判断用户名是否存在
                    }).then( (res) => {
                        console.log('res', res);
                        if(this.users.pass == res.data[0].pass){//验证密码是否正确
                           this.$store.dispatch('login',this.users).then(()=>{ //通过dispatch来调用action中的login方法
                            this.$router.replace('/main')
                            })
                        }else{
                            this.$message({
                                type:'error',
                                message:'密码错误',
                                showClose:true
                            }) 
                        }
                    }).catch(()=>{
                        this.$message.info('用户名不存在，请输入正确的账号')
                    })
                }else{
                    return false
                }
            })
        },
        registerUser:function(){//若还无账号，则点击跳转到注册界面
            this.$router.replace('/register')
        },
        changepassword:function(){
            this.$router.replace('./changepassword')
        }
    }
}
</script>
<style scoped>
.account{
    margin-left: 60%;
    width:20%;
    text-align: right;
}
.login{
    margin-left:25%;
    width: 50% ;
}
.register{
    margin-left: 60%;
    width:20%;
    text-align: right;
}
.img{
    width:50%
}
h1{
    margin:1% 0;
}
</style>
