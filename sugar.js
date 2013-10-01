(function(window){
	window.sugar = {}; //定义全局对象;

	sugar.utils = {};  //sugar的工具函数集合;
	sugar.utils.getStyle = function(obj, attr){
		if(obj.currentStyle){
			return obj.currentStyle[obj, attr];
		}else{
			return getComputedStyle(obj, false)[attr];
		}
	}; // 获取元素属性;
	sugar.utils.setCss = function(obj, json){
		for(var i in json){
			obj.style[i] = json[i];
		}
	} //批量设置元素属性;
	sugar.utils.setAttr = function(obj, json){
		for(var i in json){
			obj[i] = json[i];
		}
	}
	sugar.utils.getByClassName = function(obj,name){
		var allEle = obj.getElementsByTagName('*');
		var arr = [];
		for(var i=0,len=allEle.length; i<len; i++){
			var arrClass = allEle[i].className.split(' ');
			for(var j=0; j<arrClass.length; j++){
				if(arrClass[j] == name){
					arr.push(allEle[i]);
				}
			}
		}
		return arr;
	} //通过类名获取元素;
	sugar.utils.pre = function(obj){
		while(obj.previousSibling.nodeType != 1 && obj.previousSibling.nodeName != 'ul'){
			obj = obj.previousSibling;
		}
		return obj;
	} //获取上一个非文本元素
	sugar.utils.next = function(obj){
		while(obj.nextSibling.nodeType != 1 && obj.previousSibling.nodeName != 'ul'){
			obj = obj.nextSibling;
		}
		return obj;
	} //获取下一个非文本元素;
	sugar.utils.addClass = function(obj, name){
		var oClass = obj.className;
		if(name.constructor == Array){
			for(var i=0,len=name.length; i<len; i++){
				oClass += ' ' + name[i];
			}
		}else if(typeof name == 'string'){
			oClass += ' ' + name;
		}
		obj.className = oClass;
	} //添加类名;
	sugar.utils.removeClass = function(obj, name){
		//name只支持string;
		var oClass = obj.className;
		var arrClass = oClass.split(' ');
		var arr = [];
		var newClass;
		for(var i=0,len=arrClass.length; i<len; i++){
			if(arrClass[i] != name){
				arr.push(arrClass[i]);
			}
		}
		newClass = arr.join(' ');
		obj.className = newClass;
	} //删除类名;
	sugar.utils.hasClass = function(obj, name){
		var oClass = obj.className;
		var arrClass = oClass.split(' ');
		for(var i=0;i<arrClass.length; i++){
			if(arrClass[i] == name){
				return true;
			}
		}
		return false;
	} //检测类名;
	sugar.utils.posX = function(elem){
		 return elem.offsetParent?elem.offsetLeft + sugar.utils.posX(elem.offsetParent):elem.offsetLeft; 
	} //返回元素相对文档位置;
	sugar.utils.posY = function(elem){
		 return elem.offsetParent?elem.offsetTop + sugar.utils.posY(elem.offsetParent):elem.offsetTop; 
	}

	sugar.gallery = function(obj){
		var getStyle = sugar.utils.getStyle;
		var setCss = sugar.utils.setCss;
		var setAttr = sugar.utils.setAttr;
		var addClass = sugar.utils.addClass;
		var removeClass = sugar.utils.removeClass;
		var hasClass = sugar.utils.hasClass;
		var getByClassName = sugar.utils.getByClassName; //设置命名依赖;

		var iCurrent = 0; //记录当前是第几张;
		var beDone = true; //记录是否运动完成;
		var oImg = obj.getElementsByTagName('img')[0];
		var currentImage = oImg;
		var oDiv = obj.parentNode;
		var aLi = obj.getElementsByTagName("li");
		var listBox = document.createElement('div');
		var preA = document.createElement('a');
		var nextA = document.createElement('a');
		var oFragment = document.createDocumentFragment(); //创建文档碎片，提高性能;
		setCss(obj, {"width": oImg.offsetWidth * aLi.length + 'px', "height": oImg.offsetHeight + 'px'});
		setCss(oDiv, {"width": oImg.offsetWidth + 'px', "height": oImg.offsetHeight + 'px'});
		setAttr(preA, {"className": "listButton preButton", "href": "#"});
		preA.style.height = 43 + 'px';
		preA.style.top = (oDiv.offsetHeight - parseInt(preA.style.height))/2 + 'px';
		nextA.className = 'nextButton listButton';
		nextA.href = "#";
		nextA.style.top = preA.style.top;
		listBox.className = "listBox listButton"; 
		for(var i=0,len=aLi.length; i<len; i++){
			var aA = document.createElement('a');
			aLi[i].className = 'list' + i;	
			aLi[i].style.left = oImg.offsetWidth * i + 'px';		
			aA.rel = 'listA' + i;
			aA.style.display = 'block';
			aA.href = '#';
			oFragment.appendChild(aA);
			aA.className = "listA";
		};
		listBox.appendChild(oFragment); // 添加a;
		listBox.style.width = aLi.length * 16 + 'px';
		listBox.style.left = (oDiv.offsetWidth - parseInt(listBox.style.width))/2 + 'px';
		oDiv.appendChild(listBox);
		oDiv.appendChild(preA);
		oDiv.appendChild(nextA);
		getByClassName(oDiv,'listA')[0].style.background = "url(img/bullets.png) no-repeat 0 -11px"; //为第一个圆点添加点击效果;
		DD_belatedPNG.fix('.listA'); //消除IE6下面的PNG不透明;
		DD_belatedPNG.fix('.sugar-gallery');
		DD_belatedPNG.fix('.listButton');

		var alistA = getByClassName(oDiv, 'listA');
		var preButton = getByClassName(oDiv, 'preButton')[0];
		var nextButton = getByClassName(oDiv, 'nextButton')[0];
		for(var i=0,len=alistA.length; i<len; i++){
			(function(){
				var iNow = i;
				alistA[iNow].onclick = function(){
					if(beDone){			
						for(var j=0,len=alistA.length; j<len; j++){
							alistA[j].style.background = "url(img/bullets.png) no-repeat 0 0";
						};//先清除所有的圆点点击效果;
						beDone = false;
						getByClassName(oDiv,'listA')[iNow].style.background = "url(img/bullets.png) no-repeat 0 -11px"
						sugar.animation.flexMove(obj, {"left": -(oDiv.offsetWidth * iNow)}, function(){
							beDone = true;
							iCurrent = iNow;
						})						
					}
				}
			})(); //设置闭包;
		}

		preButton.onclick = function(){
			preImg(currentImage); //运动到前一张;
		};

		nextButton.onclick = function(){
			nextImg(currentImage); //运动到后一张;
		}

		function nextImg(oImg){
			if(beDone){ //如果上一张运动完成，才可以继续下一次运动;
				beDone = false;
				getByClassName(oDiv,'listA')[iCurrent].style.background = "url(img/bullets.png) no-repeat 0 0";
				if(iCurrent == aLi.length -1){
					sugar.animation.flexMove(obj, {"left": 0}, function(){
						beDone = true;
					});
					iCurrent = 0;
					currentImage = aLi[iCurrent];
				}else{
					sugar.animation.flexMove(obj, {"left": obj.offsetLeft - oDiv.offsetWidth}, function(){
						beDone = true;
					});
					iCurrent ++;
					currentImage = aLi[iCurrent];
				}
				getByClassName(oDiv,'listA')[iCurrent].style.background = "url(img/bullets.png) no-repeat 0 -11px";
			}
		}

		function preImg(oImg){
			if(beDone){
				beDone = false;
				getByClassName(oDiv,'listA')[iCurrent].style.background = "url(img/bullets.png) no-repeat 0 0";
				if(iCurrent == 0){
					sugar.animation.flexMove(obj, {"left": -(obj.offsetWidth - oDiv.offsetWidth)}, function(){
						beDone = true;
					});
					iCurrent = aLi.length - 1;
				}else{
					sugar.animation.flexMove(obj, {"left": obj.offsetLeft + oDiv.offsetWidth}, function(){
						beDone = true;
					});
					iCurrent --;
				}
				getByClassName(oDiv,'listA')[iCurrent].style.background = "url(img/bullets.png) no-repeat 0 -11px";
			}
		}
	}; //sugar轮播图;

	sugar.animation = {};
	sugar.animation.flexMove = function(obj, json, fn){
		var getStyle = sugar.utils.getStyle;
		clearInterval(obj.timer);
		obj.timer = setInterval(function(){
			var bStop = true;
			for(var attr in json){
				var iCur;
				if(attr == 'opacity'){
					iCur = parseInt(parseFloat(getStyle(obj, attr))*100);
				}else{
					iCur = parseInt(getStyle(obj, attr));
				}

				var iSpeed = (json[attr] - iCur)/8;
				iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);

				if(json[attr]!=iCur) bStop = false;

				if(attr == 'opacity'){
					obj.style.opacity = (iCur + iSpeed) / 100;
					obj.style.filter = 'alpha(opacity:' + (iCur + iSpeed) + ')';
				}else{
					obj.style[attr] = iCur + iSpeed + 'px';
				}
			}
			if(bStop){
				clearInterval(obj.timer);
				if(fn) fn();
			}
		}, 1000/60);
	}
})(window, undefined);