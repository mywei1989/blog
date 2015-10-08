var _this = this;
exports.sortObj=function(arr,key,dir){
  key=key||'id';
  dir=dir||'asc';
  if (arr.length == 0) return [];
  var left = new Array();
  var right = new Array();
  var pivot = arr[0][key];//分割值
  var pivotObj = arr[0];//存储值
  if(dir==='asc'){//升序
    for (var i = 1; i < arr.length; i++) {
      arr[i][key] < pivot ? left.push(arr[i]): right.push(arr[i]);
    }
  }else{//降序
    for (var i = 1; i < arr.length; i++) {
      arr[i][key] > pivot ? left.push(arr[i]): right.push(arr[i]);
    }
  }
  return _this.sortObj(left,key,dir).concat(pivotObj, _this.sortObj(right,key,dir));
};

exports.formatMonth = function(month){
  var formatStr = month;
  switch(month){
    case 1:
      formatStr = '一月';
    break;
    case 2:
      formatStr = '二月';
    break;
    case 3:
      formatStr = '三月';
    break;
    case 4:
      formatStr = '四月';
    break;
    case 5:
      formatStr = '五月';
    break;
    case 6:
      formatStr = '六月';
    break;
    case 7:
      formatStr = '七月';
    break;
    case 8:
      formatStr = '八月';
    break;
    case 9:
      formatStr = '九月';
    break;
    case 10:
      formatStr = '十月';
    break;
    case 11:
      formatStr = '十一月';
    break;
    case 12:
      formatStr = '十二月';
    break;
    default:
      formatStr = '-_-';
    break;
  }
  return formatStr;
};