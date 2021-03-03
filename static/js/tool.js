/**
 * Created by zifayim on 2017/4/25.
 */
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

//判断所选周是否在所选时间范围
function judgeWeekdayInDate(weekdya, Sdate, Edate){
  var n = get_days(Sdate, Edate), w = get_weekday(Sdate), t = '_' + w;
  for (var i = 1; i < n; i++) {
    w++;
    if (w > 6) {
      w = 0;
    }
    t += '_' + w
  }
  return t.indexOf(weekdya);
}

//获取星期
function get_weekday(date) {
  return new Date(Date.parse(date.replace(/-/g, '/'))).getDay();
}

//获取日期
function get_days(Sdate, Edate){
  var d1 = new Date(Date.parse(Sdate.replace(/-/g, '/')))
    , d2 = new Date(Date.parse(Edate.replace(/-/g, '/')));
  d1 = new Date(Date.parse(d1.getFullYear() + '/' + (d1.getMonth() + 1) + '/' + d1.getDate()));
  d2 = new Date(Date.parse(d2.getFullYear() + '/' + (d2.getMonth() + 1) + '/' + d2.getDate()));
  return Math.ceil((d2.getTime() - d1.getTime()) / (24 * 60 * 60 * 1000) + 1);
}

//判断日期时间大小
function compareDateTime(startDate, endDate) {
  startDate = new Date(startDate).Format("yyyy-MM-dd hh:mm:ss");
  endDate = new Date(endDate).Format("yyyy-MM-dd hh:mm:ss");
  if (startDate.length > 0 && endDate.length > 0) {
    var startDateTemp = startDate.split(" ");
    var endDateTemp = endDate.split(" ");

    var arrStartDate = startDateTemp[0].split("-");
    var arrEndDate = endDateTemp[0].split("-");

    var arrStartTime = startDateTemp[1].split(":");
    var arrEndTime = endDateTemp[1].split(":");

    var allStartDate = new Date(arrStartDate[0], arrStartDate[1], arrStartDate[2], arrStartTime[0], arrStartTime[1], arrStartTime[2]);
    var allEndDate = new Date(arrEndDate[0], arrEndDate[1], arrEndDate[2], arrEndTime[0], arrEndTime[1], arrEndTime[2]);

    if (allStartDate.getTime() >= allEndDate.getTime()) {
      return false;
    } else {
      return true;
    }
  } else {
    alert("时间不能为空");
    return false;
  }
}

//判断时间大小
function compareTime(startTime, endTime) {
  if (startTime.length > 0 && endTime.length > 0) {
    var arrStartTime = startTime.split(":");
    var arrEndTime = endTime.split(":");

    var allStartDate = new Date(arrStartTime[0], arrStartTime[1]);
    var allEndDate = new Date(arrEndTime[0], arrEndTime[1]);

    if (allStartDate.getTime() >= allEndDate.getTime()) {
      return false;
    } else {
      return true;
    }
  }
}

function FormatDate(datetime) {
  return datetime == '' ? '' : new Date(datetime).Format("yyyy-MM-dd hh:mm:ss")
}

/*校验手机号*/
function isvalidPhone(str) {
  const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
  return reg.test(str)
};

/*
 * 监听页面滚动
 * flag true表示有fixed列
 * */
function watchScroll() {
  let flag = document.querySelector('.el-table__fixed-header-wrapper') ? true : false;
  let scrollTop = document.querySelector('.M_content').scrollTop;
  let tableTop = document.querySelector('.table-container') ? document.querySelector('.table-container').offsetTop : document.querySelector('.el-table').offsetTop;
  let tableWidth= document.querySelector('.el-table').offsetWidth;
  let headerWrapper = document.querySelector('.el-table__header-wrapper');
  let tableWrapper = document.querySelector('.el-table__body-wrapper');
  let fixHeaderWrapper = '';
  let fixedTable = '';
  if(flag) {
    fixHeaderWrapper = document.querySelector('.el-table__fixed-header-wrapper');
    fixedTable = document.querySelector('.el-table__fixed');
  }
  headerWrapper.style.width = tableWidth - 2 + 'px';
  if(scrollTop > tableTop) {
    headerWrapper.classList.add('header-fixed');
    tableWrapper.style.paddingTop = headerWrapper.offsetHeight + 'px';
    if(flag) {
      fixHeaderWrapper.classList.add('right-header-fixed');
      fixHeaderWrapper.style.width = fixedTable.offsetWidth + 'px';
      fixHeaderWrapper.style.top = headerWrapper.offsetTop;
    }
  }else {
    headerWrapper.classList.remove('header-fixed');
    tableWrapper.style.paddingTop = '0';
    if (flag) {
      fixHeaderWrapper.classList.remove('right-header-fixed');
    }
  }
}

/*表格checkbox禁止*/
function forbidUseCheckbox(flag) {
  let container = document.querySelector('.el-table__fixed-header-wrapper');
  let obj = document.querySelector('.table-checkbox-create');
  if(obj) {
    container.removeChild(obj);
  }
  if(flag) {
    let span = document.createElement('span');
    span.className='table-checkbox-create';
    container.appendChild(span);
  }
}

/*判断浏览器类型*/
function getWheelName() {
  return typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1 ? 'DOMMouseScroll' : 'mousewheel';
}

/*鼠标滚动表格左右移动*/
function watchMouseWheel(e) {
  let tableBodyWrapper = document.querySelector('.el-table__body-wrapper');
  let tableBody = document.querySelector('.el-table__body');
  let headerWrapper = document.querySelector('.el-table__header-wrapper');
  headerWrapper.style.width = tableBodyWrapper.offsetWidth + 'px';
  let scrollWidth = 50;
  let v = e.wheelDelta ? e.wheelDelta / 120 : -(e.detail || 0) / 3;
  if (tableBody.offsetWidth > tableBodyWrapper.offsetWidth) {
    v < 0 ? tableBodyWrapper.scrollLeft += scrollWidth : tableBodyWrapper.scrollLeft -= scrollWidth;
    e.preventDefault();
  }
}

export default {
  'judgeWeekdayInDate':judgeWeekdayInDate,
  'get_weekday':get_weekday,
  'get_days':get_days,
  'compareDateTime':compareDateTime,
  'compareTime':compareTime,
  'FormatDate': FormatDate,
  'watchScroll': watchScroll,
  'forbidUseCheckbox': forbidUseCheckbox,
  'isvalidPhone': isvalidPhone,
  'getWheelName': getWheelName,
  'watchMouseWheel': watchMouseWheel
}
