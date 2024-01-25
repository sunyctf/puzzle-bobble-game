/*
 * @Author: your name
 * @Date: 2021-08-26 16:40:52
 * @LastEditTime: 2021-10-06 16:05:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \案例d:\BaiduNetdiskDownload\张卓的前端学习作业\JS部分_作业\张卓_js_210826\js\common.js
 */


/**
 * @description: 获取元素对象下标
 * @param {Object} item
 * @return {Number} 元素对象下标
 * @Date: 2021-08-26 17:03:07
 */
function getElementIdx (item) {
  var elements = item.parentNode.children;
  for (var i = 0, len = elements.length; i < len; i++) {
    if (item === elements[i]) {
      return i;
    }
  }
}


/**
 * @description: 设置任意的标签中间的任意文本内容 兼容
 * @param {Object} element
 * @param {String} text 要设置的文本信息
 * @return {*} 不return 直接改变对象文本属性
 * @Date: 2021-08-26 16:53:14
 */
function setInnerText (element,text) {
  var key = element.textContent == "undefined" ? 'innerText' : 'textContent';
  element[key] = text;
  // 判断浏览器是否支持这个属性
  // if (typeof element.textContent == "undefined") {//不支持
  //   element.innerText = text;
  // } else {//支持这个属性
  //   element.textContent = text;
  // }
}


/**
 * @description: 获取元素实际样式 兼容
 * @param {Object} obj 元素
 * @param {String} attr 样式名
 * @return {String} 一个对应实际样式的字符串
 * @Date: 2021-08-26 16:54:46
 */
function getStyle (obj, attr) {
  return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, null)[attr];
}
  //判断浏览器是否支持 .currentStyle 方式获取
  //支持则使用 .currentStyle 方式获取对应的 attr 属性值
  //不支持则使用 getComputedStyle 方式获取 obj 对应的 attr 属性值
  //null: 指定一个要匹配的伪元素的字符串。必须对普通元素省略（或null）

/**
 * @description: 设置元素样式
 * @param {Object} 元素对象
 * @param {Object} 建立一个对象用来储存css样式名
 * @return {*} 
 * @Date: 2021-08-31 17:45:00
 */
function setStyle (dom, css) {
  for (var key in css) {
    dom['style'][key] = css[key];
  }
}

/**
 * @description: 获取元素节点
 * @param {Object} ele 元素对象
 * @return {Node}  对应一个或多个元素的节点
 * @Date: 2021-08-26 17:00:47
 */
function $ (ele) {
  return document.querySelector(ele);
}
function $$ (ele) {
  return document.querySelectorAll(ele);
}


/**
 * @description: 设置监听和解除监听 兼容
 * @param {Object} element 需要监听的DOM对象
 * @param {String} type 事件类型 click mouseover
 * @param {Function} fn 监听绑定的回调函数
 * @param {Boolean} capture true 捕获阶段监听 false 冒泡阶段监听
 * @return {JSON} "remove": Function 返回一个用于解除监听的函数
 * @Date: 2021-08-26 17:04:32
 */
function addEventListener (element, type, fn, capture) {
  if (element.addEventListener) {
    //标准浏览器写法
    element.addEventListener(type, fn, capture);
  } else if (element.attachEvent) {
    //IE兼容写法
    element.attachEvent("on" + type, fn);
  } else {
    //on绑定写法
    element["on" + type] = fn;
  }
    return {
    'remove': function () {
      if (element.removeEventListener) {
        element.removeEventListener(type, fn, false);
      } else if (element.detachEvent) {
        element.detachEvent("on" + type, fn);
      } else {
        element["on" + type] = null;
      }
    }
  }
}


/**
 * @description: 获取元素到body的距离
 * @param {Object} element 元素对象
 * @return {Array}  返回x和y方向上的距离
 * @Date: 2021-08-28 21:42:47
 */
function getposition(element) {
  var pos = {
    left: 0,
    top: 0
  }
  while(element.offsetParent){
    pos.left += element.offsetLeft ;
    pos.top += element.offsetTop;
    element = element.offsetParent;
    pos.left += element.clientLeft;
    pos.top += element.clientTop;
  }
  return pos;
}

/**
 * @description:事件分流函数 
 * @param {e} e
 * @param {map} 事件map对象,其中属性名为事件类名
 * @return {*} no return
 * @Date: 2021-09-04 15:11:27
 */
function tag(e, map) {
  e = e || window.event;
  if (map[e.target.className] && 
  typeof map[e.target.className] === "function") {
    map[e.target.className](e);
  }
}

/**
 * @description: 动画函数
 * @param {Element} ele
 * @param {Object} json
 * @param {Function} callback
 * @return {*}
 * @Date: 2021-09-04 15:28:53
 */
function animate (ele, json, callback) {
  clearInterval(ele.time);//保证每一次都只有一个定时器在运行
  var toggle = false;
  var currLeft = parseInt(getStyle(ele, 'left'));
  ele.time = setInterval(function () {
    //每次定时循环都暂且认为他们都可以达到最终结果
    toggle = true;
    for (var key in json) {
      if (key === 'zIndex') {
        ele.style[key] = json[key];
        continue;
      }
      var target = parseInt(json[key])
      curr = parseInt(getStyle(ele, key));
      speed = (target - curr) / 10;
      speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
      if (curr === target) {
        //width 先到了指定值了 定时器结束了 
        ele.style[key] = target + 'px';
      }
      ele.style[key] = curr + speed + 'px';
      if (curr !== target) {
        //只要有某一个属性的值不到指定结果 关闭锁
        toggle = false;
      }
    }
    if (toggle) {
      clearInterval(ele.time);
      callback && callback();
    }
  }, 1000 / 60);
}

/**
 * @description: 
 * @param {*} ele
 * @param {*} styleJson
 * @param {*} time
 * @param {*} speed
 * @param {*} callback
 * @return {*}
 * @Date: 2021-10-04 14:43:34
 */
function animate ({ ele, styleJson = {}, time = 300, speed = 'linear', callback } = {}) {
  ele.style.transition = `${time}ms ${speed}`;
  setStyle(ele, styleJson);
  ele.addEventListener('transitionend', end, false);
  function end () {
    callback && callback();
    ele.removeEventListener('transitionend', end);
    ele.style.transition = '';
  }
}

