
# SVG圆环倒计时
圆环倒计时，支持圆环递增和递减两种动画方式，兼容ie8以上

#### 使用方法：

- 依赖

```
jquery.js，raphael.js
              
```

- 调用

```
html：
<div id="paper" class="processingbar"></div>


js：
// 创建一个圆环
var cricle3 = $.fn.circleCountDown.createCricle({
	parent: $('#paper3'),
	w: 180,
	R: 80,
	sW: 20,
	color: "#3080ec",
	bgColor:"#e5e5e5"
});

// 圆环倒计时
var option3 = {	
	cricle: cricle3, 			// 圆环
	parent: $('#paper3'),			// 承载圆环的容器
	totalTime: 100,	   			// 总的时间 s
	remainTime: 100,			// 剩余时间 = 结束时间 - 开始时间 s
	startTime: 1495785600000,		// 开始时间 ms
	endTime: 1495788300000,			// 结束时间 ms
	currentTime: 1495785601000,		// 当前时间 ms
	timeTxtAlign : 'vertical',
	changeTime: 90                  	// 剩余90秒，圆环改变颜色

}
$.fn.circleCountDown.cricleCount(option3);
              
```
