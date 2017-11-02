var observeDOM = (function(){
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
        eventListenerSupported = window.addEventListener;
    return function(obj, callback){
        if( MutationObserver ){
            var obs = new MutationObserver(function(mutations, observer){
                if( mutations[0].addedNodes.length || mutations[0].removedNodes.length ) 
                    callback();
            });
            obs.observe( obj, { attributes:false, childList:true, subtree:false });
        }
    };
})();
$(function() {
	var maxTimeout = 0;
	var loadObserveOnce = 0;
	var waitLoad = setInterval(function() {
		maxTimeout++;
		if(maxTimeout > 65)
			clearInterval(waitLoad);
		if($('.gHz6xd').length > 0) {
			if(!loadObserveOnce) {
				observeDOM(document.getElementsByClassName('JwPp0e')[0], function() {
					addGearBar();
					loadLAHSBell()
					loadCustoms();
				});
				observeDOM(document.getElementsByClassName('DShyMc-AaTFfe')[0], function() {
					loadCustoms(); //toolbar
				});
				loadObserveOnce = 1;
			}
			addGearBar();
			loadLAHSBell()
			loadCustoms();
			clearInterval(waitLoad);
		}
	}, 150);
	var persistentTime = setInterval(function() {
		if($('.gHz6xd').length > 0) {
			loadLAHSBell()
		}
	}, 15000)
});
function addGearBar() {
	if($('.gHz6xd:contains("")').length > 0) //gear icon
		return;
	$('.JwPp0e').children().each(function(indx, thisEle){
		var bottomBar = $(thisEle).children().eq(2);
		console.log(bottomBar);
		var newBtn = bottomBar.children().first().clone(false).appendTo(bottomBar);
		$('content .DPvwYc', newBtn).html("&#xE8B8;");
		$('div', newBtn).first().attr('data-tooltip', "Class Settings");
		$('div a', newBtn).click(function() {
			openClassSettings(indx);
		});
		$('div a', newBtn).attr('href', '#');
	});
	
}
function openClassSettings(eleIndx) {
	console.log("open settings on "+eleIndx);
	var $targetCourse = $('.JwPp0e').children().eq(eleIndx);
	var courseID = $targetCourse.attr('data-course-id');
	console.log("course: "+courseID);
	openClassConsole($targetCourse, courseID);
}
function openClassConsole(obj, cid) {
	target = {};
	target['lahsce'+cid] = [];
	var data;
    chrome.storage.sync.get(target, function(items) {
		data = items['lahsce'+cid];
		console.log(data);
		if(data == undefined || data.length == 0) {
			data = {
					"unify": false,
					"showPic": true,
					"name": "",
					"period": "",
					"bg": false
				};
		}
		//create popup
		$('<div class="coverBG" id="pop">\
			<div class="covPop">\
				<div class="header">\
					<h3>Class ID #<span class="classid"></span>\
				</div>\
				<div class="body">\
					<div class="formSet">\
						<div class="label">Class Name: </div>\
						<div class="oObKMd D0lNj"><div class="O98Lj" style=""><div id="className" class="LsqTRb Lzdwhd-AyKMt tgNIJf-Wvd9Cc Yiql6e editable" tabindex="0" role="textbox" g_editable="true" contenteditable="plaintext-only"></div></div></div>\
					</div>\
					<div class="formSet">\
						<div class="label">Class Period Title: </div>\
						<div class="oObKMd D0lNj"><div class="O98Lj" style=""><div id="periodNum" class="LsqTRb Lzdwhd-AyKMt tgNIJf-Wvd9Cc Yiql6e editable" tabindex="0" role="textbox" g_editable="true" contenteditable="plaintext-only"></div></div></div>\
					</div>\
					<div class="formSet">\
						<div class="label">Show picture: </div>\
						<div id="showPic" class="LsSwGf q9cOh i9xfbb N2RpBe switchSet" role="checkbox"><div class="hh4xKf MLPG7"></div><div class="YGFwk MbhUzd"></div><div class="rbsY8b"><div class="E7QdY espmsb"></div></div></div>\
					</div>\
					<div class="formSet">\
						<div class="label">Unified Color: </div>\
						<div id="unifyColor" class="LsSwGf q9cOh i9xfbb switchSet" role="checkbox"><div class="hh4xKf MLPG7"></div><div class="YGFwk MbhUzd"></div><div class="rbsY8b"><div class="E7QdY espmsb"></div></div></div>\
					</div>\
					<div class="formSet">\
						<div class="label">Hide background: </div>\
						<div id="bgEnable" class="LsSwGf q9cOh i9xfbb switchSet" role="checkbox"><div class="hh4xKf MLPG7"></div><div class="YGFwk MbhUzd"></div><div class="rbsY8b"><div class="E7QdY espmsb"></div></div></div>\
					</div>\
				</div>\
				<div class="footer">\
					<div class="saveBtn"><button id="save">Save</button></div>\
					<div class="cancelBtn"><button id="cancel">Cancel</button></div>\
				</div>\
			</div>\
		</div>').prependTo('body');
		$('.classid', '#pop').text(cid);
		$('.switchSet').click(function() {
			$(this).toggleClass('N2RpBe');
		});
		$('.cancelBtn').click(function() {
			$('#pop').remove();
		});
		$('.saveBtn').click(function() {
			var newData = {};
			newData['unify'] = $('#unifyColor').hasClass('N2RpBe');
			newData['showPic'] = $('#showPic').hasClass('N2RpBe');
			newData['name'] = $('#className').text();
			newData['period'] = $('#periodNum').text();
			newData['bg'] = $('#bgEnable').hasClass('N2RpBe');
			target = {};
			console.log('lahsce'+cid);
			target['lahsce'+cid] = newData;
		    chrome.storage.sync.set(target, function() {
				$('#pop').remove();
				loadCustoms();
			});
		});
		console.log(data);
		if("unify" in data && data['unify'] == true) {
			$('#unifyColor').addClass('N2RpBe');
		}
		if("bg" in data && data['bg'] == true) {
			$('#bgEnable').addClass('N2RpBe');
		}
		if("showPic" in data && data['showPic'] == false) {
			$('#showPic').removeClass('N2RpBe');
		}
		if("name" in data && data['name'] == "") {
			$('#className', '#pop').text($('.nk37z.YVvGBb', '[data-course-id="'+cid+'"]').text())
		} else {
			$('#className', '#pop').text(data['name']);
		}
		if("period" in data && data['period'] == "") {
			$('#periodNum', '#pop').text($('.nk37z.YVvGBb', '[data-course-id="'+cid+'"]').next().text())
		} else {
			$('#periodNum', '#pop').text(data['period']);
		}
	});
}
function loadCustoms() {
	$('.JwPp0e').children().each(function(indx, thisEle){
		var cid = $(thisEle).attr('data-course-id');
		var target = {};
		target['lahsce'+cid] = [];
	    chrome.storage.sync.get(target, function(items) {
			var data = items['lahsce'+cid];
			if(!(('lahsce'+cid) in items) || items['lahsce'+cid] == undefined || items['lahsce'+cid].length == 0) {
				return true;
			}
			if($('.nk37z.YVvGBb', thisEle).text() != data['name'])
				$('.nk37z.YVvGBb', thisEle).text(data['name']);
			if($('.nk37z.YVvGBb', thisEle).next().text() != data['period'])
				$('.nk37z.YVvGBb', thisEle).next().text(data['period']);
			if(!data['showPic'])
				$('.PNzAWd', thisEle).hide();
			else
				$('.PNzAWd', thisEle).show();
			if(data['unify']) {
				$('.w23God', thisEle).css('background-color', '#6d6d6d');
			}
			else {
				$('.w23God', thisEle).css('background-color', '');
			}
			if(!data['bg']) {
				$('.OjOEXb', thisEle).show();
			} else {
				$('.OjOEXb', thisEle).hide();
			}
		});
	});
	$('.Qks78e.QRiHXd').each(function(indx, thisEle){
		var classC = $(thisEle).attr('class').split(' ');
		for(var i = 0; i < classC.length; i++) {
			if(classC[i].indexOf('DShyMc') != -1) {
				//this is the classcode!
				var classC = classC[i];
				var cid = $('.'+classC).first().attr('data-course-id');
				var target = {};
				target['lahsce'+cid] = [];
			    chrome.storage.sync.get(target, function(items) {
					var data = items['lahsce'+cid];
					if(!(('lahsce'+cid) in items) || items['lahsce'+cid] == undefined || items['lahsce'+cid].length == 0) {
						return true;
					}
					if($('.vHZOhb.YVvGBb', thisEle).text() != data['name'])
						$('.UISY8d-Tvm9db', thisEle).text(data['name'].charAt(0));
					if($('.vHZOhb.YVvGBb', thisEle).text() != data['name'])
						$('.vHZOhb.YVvGBb', thisEle).text(data['name']);
					if($('.udxSmc.YVvGBb', thisEle).next().text() != data['period'])
						$('.udxSmc.YVvGBb', thisEle).next().text(data['period']);
				});
				return true;
			}
		}
	});
}
var globalSch = "";
var globalTrg = "";
var globalTime = 0;
function loadWithSchedule(schedule, result) {
	var target = "* "+schedule;
	var position = result.indexOf(target);
	var end = result.indexOf("*", position+1);
	var sched = result.substring(position, end).trim();
	var shift = -1;
	var last = -1;
	var m = new Date();
	var seconds = m.getSeconds() + m.getHours()*3600 + m.getMinutes()*60;
	var tclass = "";
	sched = sched + "\n";
	while(true) {
		shift = sched.indexOf("\n", shift+1);
		if(shift == -1)
			break;
		var string = sched.substring(last, shift);
		last = shift;
		
		//in this line!
		//time:
		var writtenTime = string.substring(0, string.indexOf(" "));
		//parsing the second-time of our string easily
		var fullString = "2017-8-28 " + writtenTime + ":00";
		var targetTime = (Date.parse(fullString) - Date.parse("2017-8-28")) / 1000;
		if(seconds > targetTime) {
			tclass = string.substring(string.indexOf(" ")+1);
		}
	}
	tclass = tclass.trim().replace("{", "").replace("}", "").replace("Passing to ", '').replace("Period ", ''); //if we're passing, just jump ahead and highlight the next class.
	console.log(tclass);
	if(tclass == "")
		return;
	//find our class w this current period
	$('.gHz6xd.active').removeClass('active');
	$('.gHz6xd .YVvGBb:nth-child(2):contains("'+tclass+'")').first().addClass('active');
}
function loadLAHSBell() {
	if(globalSch != "") { //cached call!
		if(new Date() - globalTime < 1800*1000 ) {
			loadWithSchedule(globalTrg, globalSch);
			return;
		}
	}
	//the bell schedule api is broken up into a lot of different pieces and mostly calculated server side, so we're going to replicate it.
	
	//essentially, we're building a micro-build of countdown.zone from scratch and pulling from its api.
	//we need schedule list and calendar
	//first, let's find what day we're on
	$.ajax('https://countdown.zone/api/data/lahs/calendar?_v='+new Date().getTime()).done(function(result) {
		//result contains our calendar list
		//if our current date (11/11/2016) is in the list, use THAT schedule. (contents after "11/11/2016 ", with ()s removed)
		//if not, our current date is found in the default week list (use same filtering process, but day of week is number starting at 0 for sunday)
		var m = new Date();
		var dateString = ("0" + (m.getUTCMonth()+1)).slice(-2) + "/" + ("0" + m.getUTCDate()).slice(-2)+ "/" + m.getUTCFullYear();
		var day = m.getDay();
		var whereIs = result.indexOf(dateString);
		var target = "";
		if(whereIs != -1) {
			//special schedule today!
			target = result.substring(whereIs, result.indexOf("\n", whereIs));
		}
		else {
			//normal
			target = result.substring(result.indexOf(day), result.indexOf("\n", result.indexOf(day)));
		}
		//schedule:
		var stopAt = target.length;
		if(target.indexOf("(") != -1)
			stopAt = target.indexOf("(");
		var schedule = target.substring(target.indexOf(" ")+1, stopAt-1); 
		schedule.trim();
		$.ajax('https://countdown.zone/api/data/lahs/schedules?_v='+new Date().getTime()).done(function(result) {
			globalSch = result;
			globalTime = new Date();
			globalTrg = schedule;
			loadWithSchedule(schedule, result);
		});
		
	});
}