<template>
    <div>
    <div class="date">

        <!-- 年份 月份 -->
        <div class="month">
            <i class="el-icon-arrow-left" @click="pickPre(currentYear,currentMonth)"></i>
            <i>{{ currentYear }} 年 {{ currentMonth }} 月</i>
            <i class="el-icon-arrow-right" @click="pickNext(currentYear,currentMonth)"></i>
        </div>
        <!-- 星期 -->
        <ul class="weekdays">
            <li>一</li>
            <li>二</li>
            <li>三</li>
            <li>四</li>
            <li>五</li>
            <li style="color:#0A0A0A">六</li>
            <li style="color:#0A0A0A">日</li>
        </ul>
        <!-- 日期 -->
        <div class="bodyDiv">
        <ul class="days" v-for="(value,index1) in daysUL">
        <li @click="pick(day,index+index1*7)" v-for="(day, index) in value" :class="[{'ban':isBan[index+index1*7]},{'xiu':isXiu[index+index1*7]}]" >
            <!--本月-->
            <span v-if="day.getMonth()+1 != currentMonth" class="other-month" :class="{'selected':isSelected[index+index1*7]}">{{ day.getDate() }}</span>
            <span v-else :class="{'selected':isSelected[index+index1*7]}">
          <!--今天-->
          <span v-if="day.getFullYear() == new Date().getFullYear() && day.getMonth() == new Date().getMonth() && day.getDate() == new Date().getDate()" class="active">{{ day.getDate() }}</span>
          <span v-else>{{ day.getDate() }}</span>
          </span>
        </li>

    </ul>
        </div>
        <hr style="height:2px;border:none;border-top:2px dotted #185598;" />
    </div>
    <div class="button">
        <div><el-button type="primary" size="large" @click="returnNow()">返回本月</el-button></div>
        <div><el-button type="primary" size="large" @click="setRestOrWork('R')">设置为节假日</el-button></div>
        <div><el-button type="primary" size="large" @click="setRestOrWork('W')">设置为工作日</el-button></div>
        <div><el-button type="primary" size="large" @click="cancel()">取消</el-button></div>
    </div>
    </div>
</template>

<script>
    import { calendarMsgService } from './CalendarMsgService'
    export default {
        name: 'date',

        data () {
            return {
                currentYear: 1970,   // 年份
                currentMonth: 1,  // 月份
                currentDay: 1,    // 日期
                currentWeek: 1,    // 星期
                firstWeek:1,
                days: [],
                daysUL:[],
                params:{
                    selectDay:'',
                    type:''
                },
                isSelected:[],
                isBan:[],
                isXiu:[],
                restDays:{
                    year:'',
                    month:'',
                    day:'',
                    resttype:'',
                    restdate:''
                },
                restDaysList:[],
                banList:[],
                xiuList:[],
                selectIndex:''
            }
        },

        created () {
            this.initData(null)
        },

        methods: {
            //格式化日期
            formatDate (year, month, day) {
                const y = year
                let m = month
                if (m < 10) m = `0${m}`
                let d = day
                if (d < 10) d = `0${d}`
                return `${y}-${m}-${d}`
            },

            initData (cur) {
                debugger;
                let date = ''
                if (cur) {
                    date = new Date(cur)
                } else {
                    date = new Date()
                }
                this.currentDay = date.getDate()          // 今日日期 几号
                this.currentYear = date.getFullYear()       // 当前年份
                this.currentMonth = date.getMonth() + 1    // 当前月份
                this.currentWeek = date.getDay() // 1...6,0   // 今天是星期几

                //当前月的第一天是星期几
                date.setDate(1);
                this.firstWeek = date.getDay();

                if (this.firstWeek === 0) {
                    this.firstWeek = 7;
                }
                const str = this.formatDate(this.currentYear, this.currentMonth, 1)// 今日日期 年-月-日
                this.days.length = 0

                // 今天是周日，放在第一行第7个位置，前面6个 这里默认显示一周，如果需要显示一个月，则第二个循环为 i<= 42- this.firstWeek
                for (let i = this.firstWeek - 1; i >= 0; i -= 1) {
                    const d = new Date(str)
                    d.setDate(d.getDate() - i)
                    this.days.push(d)
                }
                //处理1号是星期天为 7 的情况， 为7天就直接放在daysUL里
                if (this.days.length % 7 === 0){
                    this.daysUL.push(this.days);
                    this.days = [];
                }

                for (let i = 1; i <= 42 - this.firstWeek; i += 1) {
                    const d = new Date(str);
                    d.setDate(d.getDate() + i);
                    this.days.push(d);        //一个 days 就是一行7天  daysUL 就是个数组，里面有六个days  就是六行42天
                    if (this.days.length % 7 === 0){
                        this.daysUL.push(this.days);
                        this.days = [];   //清空重新存放天数
                    }
                }
                //调后台接口，获取当前年，当前月的 班休时间
                calendarMsgService.getRestDays({currentYear:this.currentYear,currentMonth:this.currentMonth}).then(res => {
                    if (res.code === 0){
                        debugger;
                        this.restDaysList = res.content;
                        this.dealResult(this.currentYear,this.currentMonth);
                    }
                })
            },
            setRestOrWork(type) {
                if (this.onlySelect()) {
                    this.params.type = type;
                    debugger;
                    calendarMsgService.addRestDays(this.params).then(res => {
                        if (res.code === 0) {
                            this.$message({
                                message: '设置成功！',
                                type: 'success'
                            })
                            if (type == 'R'){
                                this.isXiu[this.selectIndex] = true;
                            }
                            if (type == 'W'){
                                this.isBan[this.selectIndex] = true;
                            }
                        } else {
                            this.$message({
                                message: res.msg,
                                type: 'error'
                            })
                        }
                        this.params.selectDay = '';
                        this.params.type = '';
                    })

                }
            },
            cancel() {
                if (this.onlySelect()) {
                    calendarMsgService.cancelRestDays(this.params).then(res => {
                        if (res.code === 0) {
                            this.$message({
                                message: '取消成功！',
                                type: 'success'
                            })
                            this.isXiu[this.selectIndex] = false;
                            this.isBan[this.selectIndex] = false;
                        } else {
                            this.$message({
                                message: res.msg,
                                type: 'error'
                            })
                        }
                        this.params.selectDay = '';
                        this.params.type = '';
                    })
                }
            },

            // 上一個月   传入当前年份和月份
            pickPre (year, month) {
                this.daysUL = [];
                this.isSelected = [];
                const d = new Date(this.formatDate(year, month, 1))
                d.setDate(0)
                this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1))
                calendarMsgService.getRestDays({currentYear:this.currentYear,currentMonth:this.currentMonth}).then(res => {
                    if (res.code === 0){
                        debugger;
                        this.restDaysList = res.content;
                        this.dealResult(this.currentYear,this.currentMonth);
                    }
                })
            },

            // 下一個月   传入当前年份和月份
            pickNext (year, month) {
                this.daysUL = [];
                this.isSelected = [];
                const d = new Date(this.formatDate(year, month, 1))
                d.setDate(42)
                this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
                //当点击下个月的时候，才会去拿该月的休息或者工作日的日期，而不是一下子都拿出来
                calendarMsgService.getRestDays({currentYear:this.currentYear,currentMonth:this.currentMonth}).then(res => {
                    if (res.code === 0){
                        debugger;
                        this.restDaysList = res.content;
                        this.dealResult(this.currentYear,this.currentMonth);
                    }
                })
            },
            //算法
            dealResult(currentYear,currentMonth){
                debugger;
                this.banList = [];  //把当前月的 工作日 放在一起
                this.xiuList = [];  //把当前月的 休息日 放在一起
                this.isBan = [];    //设置标识，来确定用什么样的背景图
                this.isXiu = [];
                let zhouji = new Date(this.formatDate(currentYear, currentMonth, 1)).getDay(); //被查找的月份 1 号是星期几
                if (zhouji === 0){  // 0 就是星期天
                    zhouji = 7;
                }
                for (let i = 0; i<this.restDaysList.length;i++){
                    this.restDays = this.restDaysList[i];
                    if (this.restDays.resttype === 'W') {
                        let ban = this.restDays.day - 1 + (zhouji - 1);//重要算法，算出班日，在几号位
                        this.banList.push(ban);
                    }
                    if (this.restDays.resttype === 'R'){
                        let xiu = this.restDays.day - 1 + (zhouji - 1);//重要算法，算出休息日，在几号位
                        this.xiuList.push(xiu);
                    }
                }
                for (let m = 0; m < 42; m++) {    // banlist 里面放置的都是在日历上处于几号位，而不是工作日的日期，
                    let nothave = true;           // 所以得把这些位置号拎出来，给它们于不同的样式
                    for (let k = 0; k < this.banList.length; k++) {
                        if (m == this.banList[k]) {
                            this.isBan.push(true);
                            nothave = false;
                            break;
                        }
                    }
                    if (nothave) {
                        this.isBan.push(false);
                    }

                }
                for (let n = 0; n < 42; n++) {   // 同上，来处理休息日
                    let nothave = true;
                    for (let k = 0; k < this.xiuList.length; k++) {
                        if (n == this.xiuList[k]) {
                            this.isXiu.push(true);
                            nothave = false;
                            break;
                        }
                    }
                    if (nothave) {
                        this.isXiu.push(false);
                    }

                }

            },
            returnNow(){
                this.daysUL = [];
                this.initData(null);
            },
            // 当前选择日期
            pick (date,index) {
                debugger;
                this.selectIndex = index;
                this.isSelected = [];
                this.params.selectDay = this.formatDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
                for (let i = 0; i < 42; i++) {
                    if (index == i) {
                        this.isSelected.push(true);
                        continue;
                    }
                    this.isSelected.push(false);
                }
            },
            onlySelect(){
                debugger;
                if(this.params.selectDay === ''){
                    this.$message({
                        message: '请选择日期',
                        type: 'warning'
                    })
                    return false;
                }
                return true;
            }
        },
    }

</script>

<style scoped>
    .date {
        height: 150px;
        width:1000px;
        color: #333;
        float: left;
    }
    .button{
        float: left;
        margin-left:110px;
        margin-top:120px;
    }
    .button>div{
        margin-top:70px;

    }
    .month {
        font-size: 24px;
        text-align: center;
        margin-top: 20px;
    }

    .weekdays {
        background-color: #20A0FF;
        opacity: 0.6;
        display: flex;
        font-size: 28px;
        margin-top: 20px;
    }

    .days {
        display: flex;
    }

    li {
        flex: 1;
        font-size: 35px;
        width:50px;
        list-style-type:none;
        text-align: center;
        margin-top: 5px;
        line-height:  60px;
        cursor:pointer;
    }
    .selected{
        display: inline-block;
        width: 60px;
        height: 60px;
        color: #fff;
        border-radius: 70%;
        background-color: #1E90FF;
    }
    .ban{
        background-image: url(image/ban.jpg);
    }
    .xiu{
        background-image: url(./image/xiu.jpg);
        background-repeat: no-repeat;
    }
    .active {
        display: inline-block;
        width: 60px;
        height: 60px;
        color: #fff;
        border-radius: 50%;
        background-color: #324057;

    }
    i{
        margin-right:30px;
        cursor:pointer
    }

    .other-month {
        color: #EEC591;
    }

</style>