export function getDate(date){//时间格式转换显示
    let arr = date.split('-')
    let day = parseInt(arr[2].split('T')[0])
    if(parseInt(arr[1]) == '2'){//2
        if((parseInt(arr[0])%4 == 0 && parseInt(arr[0])%100 != 0) || parseInt(arr[0])% 400 == 0){//闰年
            if(day < 10){
                arr[2] = '0' + (day + 1)
            }else if(day < 29){
                arr[2] = day + 1
            }else{
                arr[1] = '3'
                arr[2] = '0' + 1
            }
        }else{//不是闰年
            if(day < 10){
                arr[2] = '0' + (day + 1)
            }else if(day < 28){
                arr[2] = day +1
            }else{
                arr[1] = '3'
                arr[2] = '0' + 1
            }
        }
    }else if(parseInt(arr[1]) == '12'){//12
        if(day < 10){
            arr[2] = '0' + (day + 1)
        }else if(day < 31){
            arr[2] = day + 1
        }else{
            arr[0] = parseInt(arr[0]) + 1
            arr[1] = '1'
            arr[2] = '0' + 1
        }
    }else if((parseInt(arr[1]) < 8 && parseInt(arr[1])%2 == 1) || parseInt(arr[1]) == '8' || parseInt(arr[1]) == '10'){// 1 3 5 7 8 10
        if(day < 10){
            arr[2] = '0' + (day + 1)
        }else if(day < 31){
            arr[2] = day + 1
        }else{
            arr[1] = parseInt(arr[1]) + 1
            arr[2] = '0' + 1
        }
    }else {//4 6 9 11
        if(day < 10){
            arr[2] = '0' + (day + 1)
        }else if (day < 30){
            arr[2] = day + 1
        }else{
            arr[1] = parseInt(arr[1]) + 1
            arr[2] = '0' + 1
        }
    }
    date = arr[0] + '-' + arr[1] + '-' + arr[2]
    return date
}

// export function getHeight(){//高度
//     let height = 500;

// }