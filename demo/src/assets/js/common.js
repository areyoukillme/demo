import moment from 'moment'
import CommonData from '@/common/data/index'

// 时间格式转化
/**
 * @param {string}  isHMS 是否加上时分秒
 * **/
const getTimeFormat = (time, format, type, isHMS) => {
  if (!time) return ''
  format = format !== null ? format : 'YYYY-MM-DD HH:mm:ss'
  let finalDate = ''
  if (isHMS) {
    finalDate = moment(time).format(format) + ((type === 0) ? '000000' : '235959')
  } else {
    finalDate = moment(time).format(format)
  }
  return finalDate
}

// 选择结束的开始时间
const chooseStartTime = (date) => {
  return {
    disabledDate (d) {
      return d.getTime() >= new Date(date)
    }
  }
}

// 选择开始的结束时间
const chooseStartEndTime = (date) => {
  return {
    disabledDate (d) {
      return (d && d.valueOf() < new Date(date) - 86400000) || (d.valueOf() > Date.now())
    }
  }
}

// 获取方式或者状态名
/**
 * @param {string} typeCode code名
 * @param {string} typeName 数组名
 * **/
const getTypeName = (typeCode, typeName) => {
  let typeArray = CommonData[typeName]
  for (var i = 0; i < typeArray.length; i++) {
    if (parseInt(typeArray[i].code) === parseInt(typeCode)) {
      return typeArray[i].name
    }
  }
  return ''
}

const getOperationAuth = (name, array) => {
  let tag = false
  array.forEach((v, i, o) => {
    if (name === v.name) {
      tag = v.checked
      return false
    }
  })
  return tag
}
// 获取按钮权限的个数
/**
 * @params {Array} array 权限数组
 * @params {String} excluedeName 不计算在统计中的按钮名称
 */
const getOperationNumber = (array, excludeName) => {
  let number = -1
  array.forEach((v, i, o) => {
    if ((!excludeName && v.checked) || (excludeName && v.name !== excludeName)) {
      number += 1
    }
  })
  return number
}
const windowToTop = () => {
  document.getElementById('container').scrollTop = 0
}
export default {
  getTimeFormat,
  getTypeName,
  chooseStartTime,
  chooseStartEndTime,
  getOperationAuth,
  getOperationNumber,
  windowToTop
}
