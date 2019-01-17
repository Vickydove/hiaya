<!-- 小说阅读计划-->
<template>
<div>
    <h1>Plan</h1>
    <el-header>
        <el-row>
            <el-col :span='6'>
                <el-button type="danger" @click="edit('add')">添加</el-button>
            </el-col>
            <el-col :span='6'>
                <el-input v-model="condition" placeholder="请输入书名或作者"></el-input>
            </el-col>
            <el-col :span='6'>
                <el-select v-model="Type" placeholder="选择类型" >
                    <el-option v-for="item in typeList" :value="item.type" :key="item.type">{{item.type}}</el-option>
                </el-select>
            </el-col>
            <el-col :span="6">
                <el-button type="primary" @click="refreshPlan">刷新</el-button>
                <!-- <el-button type="warning" >导入</el-button> -->
                <el-button type="success" @click="exportExcel">导出</el-button>
            </el-col>
        </el-row>
    </el-header>
    <el-main>
        <el-row>
            <el-table 
                :data="data"
                stripe
                style="width:100%"
                class="plan">
                <!-- <el-table-column
                    type="selection">
                </el-table-column> -->
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline>
                            <el-form-item label="内容">
                                <span>{{props.row.content}}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="书名" prop="bookname" >
                </el-table-column>
                <el-table-column label="作者" prop="author">
                </el-table-column>
                <el-table-column label="完成状态" prop="statu">
                </el-table-column>
                <el-table-column label="计划阅读完时间" prop="finish_time">
                </el-table-column>
                <el-table-column 
                    label="操作"
                    width="150">
                    <template slot-scope="scope">
                        <el-button type="warning" size="small" @click="edit(scope.row)">编辑</el-button>
                        <el-button type="danger"  size="small" @click="deletePlan(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-dialog
            :title="title"
            :visible.sync = "addFormModel"
            width="35%">
            <el-form ref="addBookForm" :model="addBookForm" :rules="rules" label-width="100px">
                <el-form-item label="书名" prop="bookname" >
                    <el-select v-model="addBookForm.bookname" @change="booknameChange" :disabled="obj">
                        <el-option v-for="item in bookList" :value="item.bookname" :key="item.id">{{item.id}} {{item.bookname}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="作者" prop="author">
                    <el-select v-model="addBookForm.author" @change="authorChange">
                        <el-option v-for="item in authorList" :value="item.value" :key="item.value">{{item.value}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-input v-model="addBookForm.type"></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <el-input v-model="addBookForm.content"></el-input>
                </el-form-item>
                <el-form-item label="完成状态" prop="statu">
                    <el-select v-model="addBookForm.statu" >
                        <el-option v-for="item in status" :value="item.value" :key="item.value">{{item.value}} {{item.label}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="计划阅读完时间" prop="finish_time">
                    <el-date-picker placeholder="选择时间" v-model="addBookForm.finish_time" value-format="yyyy-MM-dd" format="yyyy 年 MM 月 dd 日"></el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" icon="search" @click="commit">确定</el-button>
                <el-button type="ghost" style="margin-left: 8px" icon="arefresh" @click="cancle">取消</el-button>
            </div>
        </el-dialog>
    </el-main>
</div>    
</template>

<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import {getDate} from '@/commonApi/common'
export default {
    data(){
        return{
            Type:'',
            condition:'',
            data:[],
            bookList:[],//书名
            authorList:[],//作者
            typeList:[],//类型
            addFormModel:false,//弹窗属性
            title:'',//弹窗标题
            obj:false,//记录是添加还是修改
            addBookForm:{},
            rules:{
                bookname:[{required:true,message:'书名不能为空',trigger:'blur'}],
                author:[{required:true,message:'作者不能为空',trigger:'blur'}],
                statu:[{required:true,message:'状态不能为空',trigger:'blur'}],
                finish_time:[{required:true,message:'阅读完时间不能为空',trigger:'blur'}],
                type:[{required:true,message:'类型不能为空',trigger:'blur'}]
            },
            status:[{value:0,label:'未读过'},{value:1,label:'正在'},{value:2,label:'已完成'}]
        }
    },
    methods:{
        edit:function(value){
            if(value == 'add'){//添加
                this.obj = false
                this.bookList = []
                this.$http.get('/api/getNovel').then((res)=>{
                    for(let i of res.data){
                        for(let j of this.data){
                            if(i.bookname == j.bookname){
                                i.canadd = '0'
                            }
                        }
                    }
                    for(let i of res.data){
                        if(i.canadd == '1'){
                            this.bookList.push(i)
                        }
                    }
                }).catch(()=>{
                    this.$message.error('书名查询出错')
                })
                this.addFormModel = true
                this.title = '添加'
            }else{//修改
                this.addBookForm = value
                for(let i of this.status){
                    if(i.label == value.statu){
                        this.addBookForm.statu = i.value
                    }
                }
                this.obj = true
                this.title='修改'
                this.addFormModel = true
            }
            
        },
        booknameChange:function(){//作者名称动态获取
            this.authorList = []
            for(let item of this.bookList){
                if(item.bookname == this.addBookForm.bookname){
                    let authorInfo = {
                        value:item.author
                    }
                    this.authorList.push(authorInfo)
                }
            }
        },
        authorChange:function(){//类型，内容根据名称和作者来定
            for(let item of this.bookList){
                if(this.addBookForm.author == item.author && this.addBookForm.bookname == item.bookname){
                    this.addBookForm.type = item.type
                    this.addBookForm.content = item.content
                    break
                }
            }
        },
        cancle:function(){//取消
            this.addFormModel = false
        },
        commit:function(){//提交
            this.$refs.addBookForm.validate((valid)=>{
                if(valid){
                    if(this.obj == false){//添加
                        this.$http.post('/api/setReadingPlan',{
                            bookname:this.addBookForm.bookname,
                            author:this.addBookForm.author,
                            finish_time:this.addBookForm.finish_time,
                            statu:this.addBookForm.statu,
                            type:this.addBookForm.type,
                            content:this.addBookForm.content
                        }).then((res)=>{
                            this.dataInfo()
                        }).catch(()=>{
                            this.$message.error('学习计划设置出错')
                        })
                        this.addFormModel = false
                        this.addBookForm.bookname = ''
                        this.addBookForm.author = ''
                        this.addBookForm.statu = ''
                        this.addBookForm.finish_time = ''
                        this.addBookForm.type = ''
                        this.addBookForm.content = ''
                    }else{//修改
                        this.$http.post('/api/updateReadingPlan',{
                            bookname:this.addBookForm.bookname,
                            author:this.addBookForm.author,
                            finish_time:this.addBookForm.finish_time,
                            statu:this.addBookForm.statu
                        }).then((res)=>{
                            this.dataInfo()
                        }).catch(()=>{
                            this.$message.error('修改学习计划设置出错')
                        })
                        this.addFormModel = false
                        this.addBookForm.bookname = ''
                        this.addBookForm.author = ''
                        this.addBookForm.statu = ''
                        this.addBookForm.finish_time = ''
                    }
                }else{
                    return false
                }
            })
        },
        deletePlan:function(value){//删除
            this.$http.post('/api/deleteReadingPlan',{
                bookname:value.bookname,
                author:value.author,
            }).then((res)=>{
                console.log(res)
                this.dataInfo()
            }).catch(()=>{
                this.$message.error('删除学习计划设置出错')
            })
        },
        dataInfo:function(){//读书计划
            this.$http.get('/api/getReadingPlan').then((res)=>{
                this.typeList = [{type:''}]
                for(let item of res.data){
                    for(let i of this.status){
                        if(item.statu == i.value){
                            item.statu = i.label
                            break
                        } 
                    }
                    item.finish_time = getDate(item.finish_time)
                    let list = {
                        type : item.type
                    }
                    this.typeList.push(list)
                }
                if(this.Type == '' && this.condition == ''){//初始化
                    this.data = res.data
                }else if(this.Type != '' && this.condition == ''){//选择类型
                    this.data = []
                    for(let item of res.data){
                        if(this.Type == item.type){
                            this.data.push(item)
                        }
                    }
                }else if(this.Type == '' && this.condition != ''){//选择书名或作者
                    this.data = []
                    for(let item of res.data){
                        if(item.bookname.indexOf(this.condition) != -1 || item.author.indexOf(this.condition) != -1){
                            this.data.push(item)
                        }
                    }
                }else if (this.Type != '' && this.condition != ''){//类型和作者共同决定
                    this.data = []
                    for(let item of res.data){
                        if(this.Type == item.type && (item.bookname.indexOf(this.condition) != -1 || item.author.indexOf(this.condition) != -1)){
                            this.data.push(item)
                        }
                    }
                }
            }).catch(()=>{
                this.$message.error('计划查询出错')
            })     
        },
        refreshPlan:function(){//根据条件刷新
            this.dataInfo()
        },
        exportExcel:function(){//导出
           /* generate workbook object from table */
           var wb = XLSX.utils.table_to_book(document.querySelector('.plan'))
            /* get binary string as output */
            var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
            try {
                FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '小说阅读计划.xlsx')
            } catch (e) { 
                if (typeof console !== 'undefined') console.log(e, wbout) 
            }
            return wbout
        },
    },
    created(){
        this.dataInfo()
    },
}
</script>

<style scoped>
h1{
    color: aliceblue;
}
</style>