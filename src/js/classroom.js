$(function() {
	var waitLoad = setInterval(function() {
		if($('.gHz6xd').length > 0) {
			addGearBar();
			loadCustoms();
			clearInterval(waitLoad);
		}
	}, 300);
});
function addGearBar() {
	if($('.gear').length > 0)
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
    chrome.storage.local.get(target, function(items) {
		data = items['lahsce'+cid];
		console.log(data);
		if(data == undefined || data.length == 0) {
			data = {
					"unify": false,
					"showPic": true,
					"name": "",
					"period": "",
					"bg": true
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
						<div id="showPic" class="LsSwGf q9cOh i9xfbb switchSet" role="checkbox"><div class="hh4xKf MLPG7"></div><div class="YGFwk MbhUzd"></div><div class="rbsY8b"><div class="E7QdY espmsb"></div></div></div>\
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
		    chrome.storage.local.set(target, function() {
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
		if("showPic" in data && data['showPic'] == true) {
			$('#showPic').addClass('N2RpBe');
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
	    chrome.storage.local.get(target, function(items) {
			var data = items['lahsce'+cid];
			console.log(items);
			if(!(('lahsce'+cid) in items) || items['lahsce'+cid] == undefined || items['lahsce'+cid].length == 0) {
				return true;
			}
			console.log('contin');
			$('.nk37z.YVvGBb', thisEle).text(data['name']);
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
}