<template>
    <div>
        <img :src="yinghuozhisenUrl" class="img">
        <h1>修改密码</h1>
        <div class="changePassword">
            <el-form ref="changePasswordForm" :model="users" :rules="rules" label-width="80px"> 
                <el-form-item label=" 用户名" prop="name">
                    <el-input v-model="users.name" type="text" placeholder="请输入用户名"></el-input>
                </el-form-item>
               <el-form-item label="密码" prop="pass">
                   <el-input v-model="users.pass" type="password" placeholder="请输入密码"></el-input>
               </el-form-item>
               <el-form-item>
                   <el-button type="primary" @click="changePassword">确定</el-button>
                   <el-button  @click="cancle">取消</el-button>
               </el-form-item>
            </el-form>
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
        changePassword:function(){//修改用户密码
            this.$refs.changePasswordForm.validate((valid)=>{
                if(valid){
                    this.$http.get('/api/getValue', {
                        params: {name: this.users.name}//判断用户名是否存在
                    }).then((res)=>{
                        if(this.users.pass != res.data[0].pass){//判断密码与之前是否一致
                            this.$http.post('/api/updateValue', {
                                name: this.users.name, pass: this.users.pass
                            }).then((res)=>{
                                this.$msgbox.confirm('修改成功，是否重新登录','confirm').then((res)=>{
                                    this.$router.replace('/login')
                                }).catch(()=>{
                                    this.$message.info('不返回登录界面')
                                })
                            })
                        }else{
                            this.$message.info('密码不能与之前一样')
                        }
                    }).catch(()=>{
                        this.$message.error('用户名不存在')
                    })
                }else{
                    this.$message.error('用户名或密码不能为空')
                }
            })
        },
        cancle:function(){
            this.users.name=''
            this.users.pass=''
            this.$msgbox.confirm('取消修改，返回登录界面么？','cancle').then((res)=>{
                this.$router.replace('/login')
            }).catch(()=>{
                this.$message.info('不返回登录界面')
            })
        }
    }
}
</script>
<style scoped>
.changePassword{
    margin-left:25%;
    width: 50% ;
}
.img{
    width:50%
}
h1{
    margin:1% 0;
}
</style>
