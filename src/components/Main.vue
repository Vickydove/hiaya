<template>
    <div>
        <div class="date">
            <!-- 年份 月份 -->
            <div class="month">
                <li class="year-month">
                    <span class="choose-year">{{ currentYear }}年</span>
                    <span class="choose-month">{{ currentMonth }}月</span>
                </li>
                <li class="arrow1" @click="pickPre(currentYear,currentMonth)">∧</li>
                <li class="arrow2" @click="pickNext(currentYear,currentMonth)">∨</li>
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
            <div class="bodyDiv">
                <ul class="days" v-for="(value,index1) in daysUL">
                    <li @click="pick(day,index+index1*7)" v-for="(day, index) in value">
                        <!--本月-->
                        <span v-if="day.getMonth()+1 != currentMonth" class="other-month" :class="{'selected':isSelected[index+index1*7]}">{{ day.getDate() }}</span>
                        <span v-else :class="{'selected':isSelected[index+index1*7]}">
                    <!--今天-->
                    <span :class="[{'Both':Both[index+index1*7]},{'Neither':Neither[index+index1*7]},{'onlyApply':onlyApply[index+index1*7]},{'onlyRedeem':onlyRedeem[index+index1*7]}]">{{ day.getDate() }}</span>
                    </span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="button">
            <div><el-button type="primary" size="large" @click="set('Both')">申赎日</el-button></div>
            <div><el-button type="primary" size="large" @click="set('Neither')">非申赎日</el-button></div>
            <div><el-button type="primary" size="large" @click="set('onlyApply')">仅申购日</el-button></div>
            <div><el-button type="primary" size="large" @click="set('onlyRedeem')">仅赎回日</el-button></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'date',

        data () {
            return {
                currentYear: 1970,   // 年份
                currentMonth: 1,  // 月份
                currentDay: 1,    // 日期
                currentWeek: 1,    // 星期
                firstWeek:1,
                dayBeginNumber:'',//开始
                dayEndNumber:'',//结束
                grey_flag:'',//灰色第一行显示与否
                days: [],
                daysUL:[],
                params:{
                    selectDay:'',
                    type:'',
                },
                isSelected:[],
                Both:[],//申赎日
                Neither:[],//非申赎日
                onlyApply:[],//仅申购日
                onlyRedeem:[],//仅赎回日
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
                let date = ''
                if (cur) {
                    date = new Date(cur)
                } else {
                    date = new Date()
                }
                //当前月的第一天是星期几
                date.setDate(1);
                this.currentDay = date.getDate()          // 今日日期 几号
                this.currentYear = date.getFullYear()       // 当前年份
                this.currentMonth = date.getMonth() + 1    // 当前月份
                this.currentWeek = date.getDay() // 1...6,0   // 今天是星期几
                this.firstWeek = date.getDay();
                if (this.firstWeek === 0) {
                    this.firstWeek = 7;
                }
                const str = this.formatDate(this.currentYear, this.currentMonth, 1)// 今日日期 年-月-日
                this.days.length = 0

                //判断是5行还是6行
                let flag = new Date(str)
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
                    const d = new Date(str)
                    d.setDate(1 - i)
                    if(this.grey_flag == 1){
                        this.days.push(d);//将日期放入data 中的days数组 供页面渲染使用
                    }else{

                    }
                    // this.days.push(d)
                }
                for (let i = this.dayBeginNumber; i < this.dayEndNumber - this.firstWeek; i++) {
                    const d = new Date(str);
                    d.setDate(d.getDate() + i);
                    this.days.push(d);        //一个 days 就是一行7天  daysUL 就是个数组，里面有六个days  就是六行42天
                    if (this.days.length % 7 === 0){
                        this.daysUL.push(this.days);
                        this.days = [];   //清空重新存放天数
                    }
                }
                
            },
            set(type) {
                if(type == 'Both'){
                    this.Both[this.selectIndex] = true
                    console.log(this.Both)
                }else if(type == 'Neither'){
                    this.Neither[this.selectIndex] = true
                    console.log(this.Neither)
                }else if (type == 'onlyApply'){
                    this.onlyApply[this.selectIndex] = true
                }else{
                    this.onlyRedeem[this.selectIndex] = true
                }              
            },
            cancel() {
                if (this.onlySelect()) {
                   
                }
            },

            // 上一個月   传入当前年份和月份
            pickPre (year, month) {
                // setDate(0); 上月最后一天
                // setDate(-1); 上月倒数第二天
                // setDate(dx) 参数dx为 上月最后一天的前后dx天
                this.daysUL = [];
                this.isSelected = [];
                const d = new Date(this.formatDate(year, month, 1))
                d.setDate(0)
                this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1))
            },

            // 下一個月   传入当前年份和月份
            pickNext (year, month) {
                this.daysUL = [];
                this.isSelected = [];
                const d = new Date(this.formatDate(year, month, 1))
                d.setDate(42)
                this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
                //当点击下个月的时候，才会去拿该月的休息或者工作日的日期，而不是一下子都拿出来
               
            },
            //算法
            dealResult(currentYear,currentMonth){
                this.banList = [];  //把当前月的 工作日 放在一起
                this.xiuList = [];  //把当前月的 休息日 放在一起
                this.Both = [];    //设置标识，来确定用什么样的背景图
                this.Neither = [];
                let zhouji = new Date(this.formatDate(currentYear, currentMonth, 1)).getDay(); //被查找的月份 1 号是星期几
                if (zhouji === 0){  // 0 就是星期天
                    zhouji = 7;
                }
                for (let i = 0; i<this.restDaysList.length;i++){
                    this.restDays = this.restDaysList[i];
                    if (this.restDays.resttype === 'W') {
                        let Both = this.restDays.day - 1 + (zhouji - 1);//重要算法，算出班日，在几号位
                        this.banList.push(Both);
                    }
                    if (this.restDays.resttype === 'R'){
                        let Neither = this.restDays.day - 1 + (zhouji - 1);//重要算法，算出休息日，在几号位
                        this.xiuList.push(Neither);
                    }
                }
                for (let m = 0; m < 42; m++) {    // banlist 里面放置的都是在日历上处于几号位，而不是工作日的日期，
                    let nothave = true;           // 所以得把这些位置号拎出来，给它们于不同的样式
                    for (let k = 0; k < this.banList.length; k++) {
                        if (m == this.banList[k]) {
                            this.Both.push(true);
                            nothave = false;
                            break;
                        }
                    }
                    if (nothave) {
                        this.Both.push(false);
                    }

                }
                for (let n = 0; n < 42; n++) {   // 同上，来处理休息日
                    let nothave = true;
                    for (let k = 0; k < this.xiuList.length; k++) {
                        if (n == this.xiuList[k]) {
                            this.Neither.push(true);
                            nothave = false;
                            break;
                        }
                    }
                    if (nothave) {
                        this.Neither.push(false);
                    }

                }

            },
            // 当前选择日期
            pick (date,index) {
                this.selectIndex = index;
                this.isSelected = [];
                this.params.selectDay = this.formatDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
                console.log(date,this.params.selectDay)
                for (let i = 0; i < 42; i++) {
                    if (index == i) {
                        this.isSelected.push(true);
                        continue;
                    }
                    this.isSelected.push(false);
                }
            },
            onlySelect(){
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
        created () {
            this.initData(null)
        },
    }

</script>

<style>
.button{
    float: left;
    margin-left:110px;
    margin-top:120px;
}
.button>div{
    margin-top:70px;

}

.weekdays {
    display: flex;
}

.days {
    display: flex;
}

li {
    width: 13.6%;
    list-style-type:none;
    text-align: center;
    cursor:pointer;
    line-height:25px;
}
.selected{
    display: inline-block;
    width: 25px;
    height: 25px;
    /* color: #fff; */
    border-radius: 70%;
    background-color: rgba(208, 222, 236, 0.5);
}
.Neither{
    display: inline-block;
    width: 25px;
    height: 25px;
    color: #fff;
    border-radius: 70%;
    background-color:  rgb(209, 228, 42);
}
.Both {
    display: inline-block;
    width: 25px;
    height: 25px;
    color: #fff;
    border-radius: 70%;
    background-color:  #1E90FF;
}
.onlyApply{
    display: inline-block;
    width: 25px;
    height: 25px;
    color: #fff;
    border-radius: 70%;
    background-color:  rgb(70, 3, 97);
}
.onlyRedeem{
    display: inline-block;
    width: 25px;
    height: 25px;
    color: #fff;
    border-radius: 70%;
    background-color: red;
}
.other-month,.year-month {
    color:grey;
} 
.month li{
    display: inline-block
}
.arrow1{
    margin-right: -55%;
    width: 5%;
    color: gray
}
 .arrow2{
    float: right;
    margin-right: 10%;
    width: 5%;
    color:gray
} 
.year-month{
    float: left;
    margin-left: 6%
}
</style>