	/*
	*	描述实现的功能：依赖 jquery.js  raphael.js  qexCircle.css
	*
	*	创建一个圆环 ： 圆环的创建和倒计时分离，调用createCricle(option) ，返回该圆环
	*	倒计时 ：调用cricleCount(option)不会创建圆环，只改变圆环状态； 有两种方式，增加倒计时 && 减少倒计时 
	*/ 


	/*
	*  创建圆环参数：$.fn.circleCountDown.createCricle(option);
	*
	*  @params Object 配置指引：
	*  		    parent:  		 Object    圆环进度的容器对象   
	            w:         		 Number    圆环父级容器宽度
	            R:      		 Number    圆环半径大小
	            sW:     		 Number    圆环宽度
	            bgColor: 		 String    圆环背景色
	            color:   		 String    圆环前景色
	            startProgressPos Number    圆环初始位置 100是最大值，默认0 【非必须】
	*
	*
	*  倒计时参数：$.fn.circleCountDown.cricleCount(option);
	*
	*  @params Object 配置指引：
				cricle:         Object    创建的圆环 
	*  		    parent:  		Object    圆环进度的容器对象   
	            totalTime: 		Number    总的倒计时时间 单位s
				remainTime:     Number    剩余时间  单位s
	            startTime: 		String    开始时间 时间戳ms 默认0 【非必须】
	            endTime:   		String    结束时间 时间戳ms 默认0 【非必须】
	            currentTime: 	String    当前时间 时间戳ms 默认0 【非必须】
	            endTxt:         String    倒计时结束后显示的文案
	            animateType:    String    圆环动画形式：add 圆环递增形式，cut 圆环递减形式，默认add 【非必须】
	            timeTxtAlign:   String    圆环里文案显示方式： vertical只能显示分秒 默认水平 horizontal就是横向排列可以显示到天【非必须】
	            callBack        Function  倒计时结束后，回调函数【非必须】
	            changeTime      Number    倒计时还剩多少秒，就变颜色 ，非必传，不传默认不会变色【非必须】
	            changeColor     String     倒计时还剩changeTime秒时，圆环变成什么颜色 默认#ff6600【非必须】
	*
	*
	*/

	(function($) {
		$.fn.circleCountDown = (function(){

			function CountDown(option){
				console.log(option)
				this.oCircle = option.cricle; 									      // 圆环
				this.oWrap = option.parent; 									      // 承载圆环容器
				this.totalTime = option.totalTime;	   							      // 总的时间s
				this.remainTime = option.remainTime;							      // 剩余时间 = 结束时间 - 开始时间s
				this.startTime = option.startTime || 0;							      // 开始时间 时间戳ms
				this.endTime = option.endTime || 0;								      // 结束时间 时间戳ms
				this.currentTime = option.currentTime || 0;						      // 当前时间 时间戳ms
				this.animateType = option.animateType || 'add';					      // 倒计时动画类型 add cut
				this.endTxt = option.endTxt || '已结束';							      // 倒计时结束文字
				this.changeTime = option.changeTime || -1000; 					      // 剩余多长时间改变颜色
				this.changeColor = option.changeColor || '#ff6600';				      // 剩余x秒后，变成的颜色
    
				this.countMoveScale = 100/this.totalTime; 					          // 圆环倒计时每秒运动的距离
				this.startRmainTime = (this.currentTime - this.startTime)/1000;       // 还剩多久才开始s
				this.pastTime = this.totalTime - this.remainTime;   		          // 圆环倒计时已经过去的时间
				this.addNowTotalTime = this.pastTime*this.countMoveScale || 0.0001;   // 增加类型 的当前
				this.cutNowTotalTime = this.remainTime*this.countMoveScale || 0.0001; // 减少类型 的当前				
				this.callBack = option.callBack || null; 						      // 倒计时结束，回调函数
				this.timeTxtAlign  = option.timeTxtAlign ||'horizontal'; 		      // 文字对齐方式
				this.oTxt = $('<div class="process-txt"></div>');
				this.oWrap.append(this.oTxt);

				this.beforeStart();

			}

			CountDown.prototype = {

				beforeStart: function(){
					var _this = this;
					// 错误处理
					if(this.totalTime<this.remainTime){
						console.log('总时间不能大于剩余时间');
						return;
					}

					// 剩余时间为0
					if(this.remainTime<=0){
						this.oWrap.find(this.oTxt ).html(this.endTxt);
						return;
					}

					// 是否开始倒计时
					if(this.startRmainTime > 0){

						// 倒计时未开始
						this.oWrap.find(this.oTxt ).html('等待启动');
						var startTimer = setInterval(function(){  
							_this.startRmainTime --;
							console.log(_this.startRmainTime)
							if(_this.startRmainTime <=0){
								clearInterval(startTimer);
								_this.startCount();
							}
						},1000)
					}else{
						this.startCount();
					}
				},

				// 开始倒计时
				startCount: function(){
					
					if(this.animateType =='cut'){
						this.changeStatus(this.cutNowTotalTime,this.remainTime);
						this.cutCountDown();
					}else{
						this.changeStatus(this.addNowTotalTime,this.remainTime);
						this.addCountDown();

					}
				},

				// 增加方式的倒计时
				addCountDown: function() {
					this.coutMove(this.addNowTotalTime, 'add');
				},

				// 减少方式的倒计时
				cutCountDown: function() {
					this.coutMove(this.cutNowTotalTime, 'cut');
				},

				// 倒计时公共fn
				coutMove: function(nowTotalTime, type){

            		var _this = this;
            		var startT = new Date().getTime();
					var countD = 0;
					function fixedCount(){
						// 进度条加减运算
						if(type == 'add'){
							nowTotalTime += _this.countMoveScale;
						}else{
							nowTotalTime -= _this.countMoveScale;
						}
						
						_this.remainTime--;
						// 结束时，修复计算误差直接到终点
            			if(_this.remainTime == 0){
            				if(type == 'add'){
            					nowTotalTime = 100;
            				}else{
            					nowTotalTime= 0;
            				}	
            			}
            			_this.changeStatus(nowTotalTime,_this.remainTime);
            			if(_this.remainTime == 0){
							setTimeout(function(){
								_this.callBack  && _this.callBack();
							},50)
            				_this.oWrap.find(_this.oTxt).html(_this.endTxt);
            			}else{
            				countD ++;
							var offset = new Date().getTime() - (startT + countD*1000);
							var nextT = 1000 - offset;
							if(nextT < 0){ nextT = 0; }
							setTimeout(fixedCount,nextT);
            			}
						
					}

					setTimeout(fixedCount,1000);

				},

				// 改变状态
				changeStatus: function(num,remainTime) {
	
					var R = this.oCircle.attr('arc')[2];

					this.oWrap.find(this.oTxt).html(this.formatTime(remainTime));
					this.oCircle.animate({
							arc: [num, 100, R]
						}, 0, ">")

					// 剩下x秒后，改变颜色
					if((remainTime <= this.changeTime) && this.changeColor){ 
						this.oCircle.attr('stroke', this.changeColor);
					}
					
				},

				// 组合时间文本
				formatTime : function (time){
					var result;
					
					if(this.timeTxtAlign == "vertical"){
						var minutes = parseInt(time/60);
						var second = time%60;
						result =  "<span>"+minutes+"<i>分</i></span>" + "<span>"+second+"<i>秒</i></span>";

					}else{
						var day = parseInt(time/86400);
						time = time%86400;
						var hours = parseInt(time/3600);
						time = time%3600;
						var minutes = parseInt(time/60);
						var second = time%60;
						result = (day>0 ? day + '天':'') + (hours>0 ? hours + '时':'') + minutes +'分' + second + '秒';
					}

					return result;
				}
			}


			/*
			*  圆环倒计时
			*/ 
			function cricleCount(option){
				new CountDown(option);

			}


			/*
			*  创建一个圆环
			*/ 
			function createCricle (option){
				option = $.extend({
					parent: null,
					w: 75,
					R: 30,
					sW: 20,
					color: "#3080ec",
					bgColor:"#e5e5e5",
					startProgressPos: 0.0001
				}, option);
	
				var parent = option.parent;
				if (!parent) return false;		
	
				var w = option.w,
					R = option.R,
					sW = option.sW,
					color = option.color,
					bgColor = option.bgColor,
					startProgressPos = option.startProgressPos;
	
				var paper = Raphael(parent[0], w, w); // svg 画布大小
				parent.css("width", w + "px");
				// 定义画圆环的路径的属性
				paper.customAttributes.arc = function(b, c, R) {
					var d = 360 / c * b,
						a = (90 - d) * Math.PI / 180,
						x = w / 2 + R * Math.cos(a),
						y = w / 2 - R * Math.sin(a),
						path;
					if (c == b) {
						path = [
							["M", w / 2, w / 2 - R],
							["A", R, R, 0, 1, 1, w / 2 - 0.01, w / 2 - R]
						]
					} else {
						path = [
							["M", w / 2, w / 2 - R],
							["A", R, R, 0, +(d > 180), 1, x, y]
						]
					}
					return {
						path: path
					}
				};
		
				// // 画背景圆环
				var f = paper.path().attr({
					stroke: bgColor,
					"stroke-width": sW
				}).attr({
						arc: [100, 100, R]
				});
		
				// // 画前景圆环
				var g = paper.path().attr({
					stroke: color,
					"stroke-width": sW
				}).attr({
					stroke: "#0088cc",
					arc: [startProgressPos, 100, R]
				});
	
				return g;
			}

			// 返回
			return {
				createCricle : createCricle,
				cricleCount : cricleCount
			}

		})()
	})(jQuery);