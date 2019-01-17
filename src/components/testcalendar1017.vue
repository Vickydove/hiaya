<template>
    <div>
        <h-row class="date">
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
                        <span v-else :class="[{'Both':Both[index+index1*7]},{'Neither':Neither[index+index1*7]},{'onlyApply':onlyApply[index+index1*7]},{'onlyRedeem':onlyRedeem[index+index1*7]},{'selected':isSelected[index+index1*7]}]">{{ day.getDate() }}</span>
                        <!--今天-->
                        <!-- <span :class="[{'Both':Both[index+index1*7]},{'Neither':Neither[index+index1*7]},{'onlyApply':onlyApply[index+index1*7]},{'onlyRedeem':onlyRedeem[index+index1*7]}]">{{ day.getDate() }}</span> -->
                        </span>
                    </li>
                </ul>
            </div>
        </h-row>
        <h-row>
            <h-button class="button0" type="ghost" size="large" @click="set('Both')">申赎日</h-button>
            <h-button class="button" type="ghost" size="large" @click="set('Neither')">非申赎日</h-button>
            <h-button class="button" type="ghost" size="large" @click="set('onlyApply')">仅申购日</h-button>
            <h-button class="button" type="ghost" size="large" @click="set('onlyRedeem')">仅赎回日</h-button>
        </h-row>
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
                BothList:[],//临时申赎表
                Neither:[],//非申赎日
                NeitherList:[],//临时申赎表非申赎日表
                onlyApply:[],//仅申购日
                onlyApplyList:[],//临时申赎表仅申购日表
                onlyRedeem:[],//仅赎回日
                onlyRedeemList:[],//临时申赎表仅赎回日表
                selectIndex:'',//选中的日期
                allSelecteList:[],//所有信息，按照月份分开的
                sendList:[{BothList:[]},{NeitherList:[]},{onlyApplyList:[]},{onlyRedeemList:[]}]//发送到后台的列表
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

            initData (cur) {//初始化数据
                let date = ''
                if (cur) {
                    date = new Date(cur)
                } else {
                    date = new Date()
                }
                //当前月的第一天是星期几
                date.setDate(1);
                this.currentYear = date.getFullYear()       // 当前年份
                this.currentMonth = date.getMonth() + 1    // 当前月份
                this.currentWeek = date.getDay() // 1...6,0   // 今天是星期几
                this.firstWeek = date.getDay();
                if (this.firstWeek === 0) {
                    this.firstWeek = 7;
                }
                const str = this.formatDate(this.currentYear, this.currentMonth, 1)// 今日日期 年-月-日
                this.days.length = 0

                //判断是5行还是6行抑或是4行
                let flag = new Date(str)
                flag.setDate(flag.getDate()+35 - this.firstWeek)
                if(flag.getDate() < 7){//第六行第一个数
                    //最后一行不显示
                    flag.setDate(new Date(str).getDate() + 6-this.firstWeek)
                    if(flag.getDate() > 7){//第一行最后一个数
                        this.grey_flag = 0
                        this.dayBeginNumber = 0
                        this.dayEndNumber = 35
                    }else{
                        this.grey_flag = 1
                        this.dayBeginNumber = 0
                        this.dayEndNumber = 35
                    }
                }else{//第一行最后一个数
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
                    }
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
            set(type) {//设置
                if(type == 'Both'){
                    let flag = 0
                    this.Both[this.selectIndex] = true
                    this.isSelected.push(false)
                    this.BothList.push(this.formatDate(this.currentYear,this.currentMonth,this.currentDay))//存入临时表
                    for(let item of this.sendList[0].BothList){
                        if(item == this.formatDate(this.currentYear,this.currentMonth,this.currentDay)){
                            flag = 1
                            break
                        }
                    }
                    if(flag == 0){
                        this.sendList[0].BothList.push(this.formatDate(this.currentYear,this.currentMonth,this.currentDay))//存入最终发送表
                    }
                }else if(type == 'Neither'){
                    let flag = 0
                    this.Neither[this.selectIndex] = true
                    this.isSelected.push(false)
                    this.NeitherList.push(this.formatDate(this.currentYear,this.currentMonth,this.currentDa))
                    for(let item of this.sendList[1].NeitherList){
                        if(item == this.formatDate(this.currentYear,this.currentMonth,this.currentDay)){
                            flag = 1
                            break
                        }
                    }
                    if(flag == 0){
                        this.sendList[1].NeitherList.push(this.formatDate(this.currentYear,this.currentMonth,this.currentDa))
                    }
                }else if (type == 'onlyApply'){
                    let flag = 0
                    this.onlyApply[this.selectIndex] = true
                    this.isSelected.push(false)
                    this.onlyApplyList.push(this.formatDate(this.currentYear,this.currentMonth,this.currentDay))
                    for(let item of this.sendList[2].onlyApplyList){
                        if(item == this.formatDate(this.currentYear,this.currentMonth,this.currentDay)){
                            flag = 1
                            break
                        }
                    }
                    if(flag == 0){
                        this.sendList[2].onlyApplyList.push(this.formatDate(this.currentYear,this.currentMonth,this.currentDay))
                    }
                }else{
                    let flag = 0
                    this.onlyRedeem[this.selectIndex] = true
                    this.isSelected.push(false)
                    this.onlyRedeemList.push(this.formatDate(this.currentYear,this.currentMonth,this.currentDay))
                    for(let item of this.sendList[3].onlyRedeemList){
                        if(item == this.formatDate(this.currentYear,this.currentMonth,this.currentDay)){
                            flag = 1
                            break
                        }
                    }
                    if(flag == 0){
                        this.sendList[3].onlyRedeemList.push(this.formatDate(this.currentYear,this.currentMonth,this.currentDay))
                    }
                } 
            },
            cancel() {
                if (this.onlySelect()) {
                   
                }
            },

            // 上一個月   传入当前年份和月份
            pickPre (year, month) {
                if(this.BothList != [] || this.NeitherList != [] || this.onlyApplyList != [] || this.onlyRedeemList != []){
                    let flagAppend = 0//判断是否新增
                    for(let item of this.allSelecteList){
                        if(this.currentYear == item.year && this.currentMonth == item.month){
                            item.BothList = this.BothList
                            item.NeitherList = this.NeitherList
                            item.onlyApplyList = this.onlyApplyList
                            item.onlyRedeemList = this.onlyRedeemList
                            flagAppend = 1
                            break
                        }
                    }
                    if(flagAppend == 0){
                        let item = {
                            year : this.currentYear,
                            month : this.currentMonth,
                            BothList : this.BothList,
                            NeitherList: this.NeitherList,
                            onlyApplyList : this.onlyApplyList,
                            onlyRedeemList : this.onlyRedeemList
                        }
                        this.allSelecteList.push(item)
                    }
                }
                // setDate(0); 上月最后一天
                // setDate(-1); 上月倒数第二天
                // setDate(dx) 参数dx为 上月最后一天的前后dx天
                this.daysUL = []
                this.isSelected = []
                this.BothList = []
                this.NeitherList = []
                this.onlyApplyList = []
                this.onlyRedeemList = []
                this.Both = []
                this.Neither = []
                this.onlyApply = []
                this.onlyRedeem = []
                const d = new Date(this.formatDate(year, month, 1))
                d.setDate(0)
                this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1))
            },

            // 下一個月   传入当前年份和月份
            pickNext (year, month) {
                if(this.BothList != [] || this.NeitherList != [] || this.onlyApplyList != [] || this.onlyRedeemList != []){
                    let flagAppend = 0//判断是否新增
                    for(let item of this.allSelecteList){
                        if(this.currentYear == item.year && this.currentMonth == item.month){
                            item.BothList = this.BothList
                            item.NeitherList = this.NeitherList
                            item.onlyApplyList = this.onlyApplyList
                            item.onlyRedeemList = this.onlyRedeemList
                            flagAppend = 1
                            break
                        }
                    }
                    if(flagAppend == 0){
                        let item = {
                            year : this.currentYear,
                            month : this.currentMonth,
                            BothList : this.BothList,
                            NeitherList: this.NeitherList,
                            onlyApplyList : this.onlyApplyList,
                            onlyRedeemList : this.onlyRedeemList
                        }
                        this.allSelecteList.push(item)
                    }
                }
                this.daysUL = [];
                this.isSelected = [];
                this.BothList = []
                this.NeitherList = []
                this.onlyApplyList = []
                this.onlyRedeemList = []
                this.Both = []
                this.Neither = []
                this.onlyApply = []
                this.onlyRedeem = []
                const d = new Date(this.formatDate(year, month, 1))
                d.setDate(42)
                this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
                //当点击下个月的时候，才会去拿该月的休息或者工作日的日期，而不是一下子都拿出来
               
            },
            // 当前选择日期
            pick (date,index) {
                this.currentDay = date.getDate()   // 今日日期 几号
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
            this.initData("2017-04")
        },
    }

</script>

<style>
.button{
    margin-left:15px;
    margin-top:20px;
}
.button0{
    margin-left:20px;
    margin-top:20px;
}
.weekdays {
    display: flex;
}

.days {
    display: flex;
}

.weekdays li,.days li{
    font-size: 14px;
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
    background-color:  rgb(240, 209, 34);
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
    background-color:  rgb(143, 20, 192);
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

 .arrow2{
    float: right;
    margin-right: 10%;
    width: 5%;
    color:gray;
    cursor:pointer;
} 
.arrow1{
    margin-left: 55%;
    width: 5%;
    color: gray;
    cursor:pointer;
}
.year-month{
    width: 20%;
    float: left;
    margin-left: 2%
}
.date{
    margin-top: 20px;
}
.month{
    font-size: 14px;
    margin-bottom: 20px;
}
</style>