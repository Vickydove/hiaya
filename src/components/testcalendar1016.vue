<!-- 主页面-->
<template>
    <div id="calendar">
        <!-- 年月 -->
        <div class="month">
            <ul>
                <!--点击会触发pickpre函数，重新刷新当前日期 @click(vue v-on:click缩写) -->
                <li class="year-month">
                    <span class="choose-year">{{ currentYear }}年</span>
                    <span class="choose-month">{{ currentMonth }}月</span>
                </li>
                <li class="arrow1" @click="pickPre(currentYear,currentMonth)">∧</li>
                <li class="arrow2" @click="pickNext(currentYear,currentMonth)">∨</li>
            </ul>
        </div>
        <!-- 星期 -->
        <ul class="weekdays">
            <li>日</li>
            <li>一</li>
            <li>二</li>
            <li>三</li>
            <li>四</li>
            <li>五</li>
            <li>六</li>
        </ul>
        <!-- 日期 -->
        <ul class="days">
            <!-- 循环创建天 -->
            <li  v-for="dayobject in days" @click="changeColor(dayobject)">
            <!--如果不是本月  改变类名加灰色-->
                <span v-if="dayobject.day.getMonth()+1 != currentMonth" class="other-month">{{ dayobject.day.getDate() }}</span>
                <!--如果是本月-->
                <span v-else>
                    <span  :class="[{'applyOnly': applyOnly}]">{{ dayobject.day.getDate() }}</span>
                <!--判断是不是这一天-->
                    <!-- <span v-if="dayobject.day.getFullYear() == new Date().getFullYear() && dayobject.day.getMonth() == new Date().getMonth() && dayobject.day.getDate() == new Date().getDate()" class="active">{{ dayobject.day.getDate() }}</span>
                    <span v-else>{{ dayobject.day.getDate() }}</span> -->
                </span>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data(){
        return{
            currentDay:1,
            currentMonth:1,
            currentYear:1970,
            firstWeek:'',
            dayBeginNumber:'',//开始
            dayEndNumber:'',//结束
            grey_flag:'',//灰色第一行显示与否
            days:[],
            applyOnly:false,//仅申购日
        }
    },
    methods: {
        initData:function(curr){//初始化数据
            var date
            var leftcount=0
            if(curr){
                date = new Date(curr)
            }else{
                date = new Date()
            }
            //当前月的第一天是星期几
            date.setDate(1);            
            this.currentDay = date.getDate(); //今天的日期
            this.currentYear = date.getFullYear(); //当前年份
            this.currentMonth = date.getMonth() + 1; //当前月份
            this.firstWeek = date.getDay(); // 1...6,0 星期几
            if (this.firstWeek === 0) {
                this.firstWeek = 7;
            }

            var str = this.formatDate(this.currentYear, this.currentMonth, 1)// 今日日期 年-月-日
            this.days.length = 0
            
           
            // //初始化本周
            // if (this.days.length % 7 === 0){
            //     this.dayobject = {};
            // }
            //其他周
            let flag = new Date(str)//判断是5行还是6行
            flag.setDate(flag.getDate()+35 - this.firstWeek)
            if(flag.getDate() < 7){
                this.grey_flag = 1
                this.dayBeginNumber = 0
                this.dayEndNumber = 35
            }else{
                flag.setDate(new Date(str).getDate() + 6-this.firstWeek)
                if(flag.getDate() > 7){
                    this.dayBeginNumber = 0
                    this.dayEndNumber = 42
                    this.grey_flag = 0
                }else{
                    this.dayBeginNumber = 0
                    this.dayEndNumber = 42
                    this.grey_flag = 1
                }
            }
            // 今天是周日，放在第一行第1个位置，前面0个 这里默认显示一周，如果需要显示一个月，则第二个循环为 i<= 42- this.firstWeek
            for (let i = this.firstWeek; i > 0; i--) {
                var d = new Date(str);
                d.setDate(1 - i);
                var dayobject={a:false,b:false}; //用一个对象包装Date对象  以便为以后预定功能添加属性
                dayobject.day=d;
                if(this.grey_flag == 1){
                    this.days.push(dayobject);//将日期放入data 中的days数组 供页面渲染使用
                }else{

                }
            }
            for (let i = this.dayBeginNumber; i < this.dayEndNumber - this.firstWeek; i++) {
                var d = new Date(str);
                d.setDate(d.getDate() + i);
                var dayobject={};
                dayobject.day=d;
                this.days.push(dayobject);
                if (this.days.length % 7 === 0){
                    this.dayobject = {};   //清空重新存放天数
                }
            }
        },
        pickPre:function(year, month) {//上个月
            // setDate(0); 上月最后一天
            // setDate(-1); 上月倒数第二天
            // setDate(dx) 参数dx为 上月最后一天的前后dx天
            var d = new Date(this.formatDate(year , month , 1));
            d.setDate(0);
            this.initData(this.formatDate(d.getFullYear(),d.getMonth() + 1,1));
            },
        pickNext:function(year, month) {//下个月
            var d = new Date(this.formatDate(year , month , 1));
            d.setDate(42);
            this.initData(this.formatDate(d.getFullYear(),d.getMonth() + 1,1));
        },
        changeColor:function(str){
            console.log(str.day)
            this.applyOnly = true
        },
        // 返回 类似 2016-01-02 格式的字符串
        formatDate:function(year,month,day){
            var y = year;
            var m = month;
            if(m<10) m = "0" + m;
            var d = day;
            if(d<10) d = "0" + d;
            return y+"-"+m+"-"+d
        },
    },
    created(){
        this.initData(null)
    }
}

</script>
<style >
.weekdays,{
    white-space: nowrap
}
.weekdays li{
    width: 13%;
    display: inline-block
}
.weekdays{
    padding: 0
}
.days li{
    width: 13.6%;
    display: inline-block
}
.days{
    padding: 0
}
.month li{
    display: inline-block
}
.other-month,.year-month{
    color: gray
}
.year-month{
    float: left;
    margin-left: 3%
}
.arrow1{
    margin-right: 5%;
    color: gray
}
.arrow2{
    margin-right: -60%;
    color:gray
}
/* .active{
    color:blue
} */
.applyOnly{
    color: slateblue
}
</style>