"use strict"

/**
 * 函数转Promise
 */
function promisify(fn) {
  return function(param = {}) {
    return new Promise((resolve, reject) => {
      param.success = function(res) {
        // 返回后台数据
        resolve(res)
      }
      param.fail = function(err) {
        reject(err)
      }
      fn(param)
    })
  }
}

/**
 * 函数转Promise, 返回数组[result, error], 不抛出异常
 */
function promisifyWithArr(fn) {
  return function(param = {}) {
    return new Promise(resolve => {
      param.success = function(res) {
        // 返回后台数据
        resolve([res, null])
      }
      param.fail = function(err) {
        resolve([null, err])
      }
      fn(param)
    })
  }
}

/**
 * Promise超时
 */
function withTimeout(fn, timeout = 3000) {
  return Promise.race([
    fn,
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('超时')
      }, timeout)
    })
  ])
}

/**
 * Promise超时, 返回数组[result, error], 不抛出异常
 */
function withTimeoutWithArr(fn, timeout = 3000) {
  return Promise.race([
    fn,
    new Promise(resolve => {
      setTimeout(() => {
        resolve([null, '超时'])
      }, timeout)
    })
  ])
}

/**
 * 展示弹窗
 */
function showToast(message, time = 3000, icon = 'none') {
  if(typeof message !== 'string') {
    try {
      message = JSON.stringify(message)
    } catch(e) {
      message = '失败'
    }
  }
  uni.showToast({
    title: message,
    icon: icon,
    duration: time,
    fail: (err) => {
      console.error('showToastFail:', err)
    }
  })
}

function setStorage(obj, showTip = false) {
  for(const key in obj) {
    uni.setStorage({
      key: key,
      data: obj[key],
      fail: (err) => {
        console.error(`保存${key}失败`, err)
        if(showTip) {
          showToast(`保存${key}失败`)
        }
      }
    })
  }
}

const FnUtil = {
  promisify,
  promisifyWithArr,
  withTimeout,
  withTimeoutWithArr,
  showToast,
  setStorage
}

module.exports = FnUtil

export default FnUtil