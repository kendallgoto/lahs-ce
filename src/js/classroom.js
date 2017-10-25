$(function() {
	var waitLoad = setInterval(function() {
		if($('.gHz6xd').length > 0) {
			addGearBar();
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
		/*
		$('div', newBtn).removeAttr('jsaction').removeClass('jscontroller');
		var real = $('div', newBtn).get(0);
		var elClone = real.cloneNode(true);

		real.parentNode.replaceChild(elClone, real);
		*/
	});
	
}
function openClassSettings(eleIndx) {
	console.log("open settings on "+eleIndx);
	var $targetCourse = $('.JwPp0e').children().eq(eleIndx);
	var courseID = $targetCourse.attr('data-course-id');
	console.log("course: "+courseID);
	openClassConsole($targetCourse, courseID);
}
function populateClassConsole(course) {
	//get data from our store
	target = {};
	target['lahsce'+course] = [];
    chrome.storage.local.get(target, function(items) {
		return items['lahsce'+course];
	});
}
function openClassConsole(obj, cid) {
	
	var data = populateClassConsole(cid);
	
	//create popup
	$('<div class="coverBG" id="pop">\
		<div class="covPop">\
			<div class="header">\
				<h3>Class ID #<span class="classid"></span>\
			</div>\
			<div class="body">\
				\
			</div>\
			<div class="footer">\
				<div class="saveBtn"><button id="save">Save</button></div>\
			</div>\
		</div>\
	</div>').prependTo('body');
	
}