var aeriesURL;
function loadClassesWithData(data) {
	if(loadedFaux)
		return;
  chrome.storage.local.get({
    lastBlob: '',
  }, function(items) {
		var compCheck = false;
		var lastBlob = items.lastBlob;
		if(lastBlob.length > 0) {
			//compare blobs!
			compCheck = true;
		}
		$(".lds-css").remove();
		$('#grades').removeClass('hidden');
		var date = new Date();
		var day = date.getDate();
		var month = date.getMonth()+1;
		var year = date.getFullYear();
		if(day<10) {
		    day = '0'+day
		} 
		if(month<10) {
		    month = '0'+month
		} 
		var dateString = month + '/' + day + '/' + year;
		$('#headText').text(dateString);
		var i = 0;
		data.forEach(function(thisEle){
			var newClass = $($('template#class').prop('content')).clone().find('tr');
			$('#period', newClass).removeAttr('id').text(thisEle.Period);
			$('#classname', newClass).removeAttr('id').text(thisEle.CourseName);
			$('#grade', newClass).text(thisEle.CurrentMarkAndScore);
			$('#updated', newClass).removeAttr('id').text("("+thisEle.LastUpdated+")");
			$('#grades').append(newClass);
			if(compCheck) {
				var compBlob = lastBlob[i];
				if(thisEle.CurrentMarkAndScore != compBlob.CurrentMarkAndScore) {
					//grade changed from last check!
					$('#grade', newClass).text($('#grade', newClass).text() + " was " + compBlob.Percent);
					$(newClass).addClass('changed');
				}
			}
			$('#grade', newClass).removeAttr('id');
		  chrome.storage.local.set({
		    lastBlob: data
		  }, function() {});
			i++;
		});
	});
}
function login(user, pass) {
	return $.ajax({
		url: aeriesURL+'LoginParent.aspx',
		method: 'POST',
		data: 'checkCookiesEnabled=true&checkMobileDevice=false&checkStandaloneMode=false&checkTabletDevice=false&portalAccountUsername='+user+'&portalAccountPassword='+pass+'&portalAccountUsernameLabel=&submit=',
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		}
	});
}
function logOutUser(resetWho) {
  chrome.storage.local.set({
    [resetWho]: ""
  }, function() {
	  if (chrome.runtime.openOptionsPage) {
	    chrome.runtime.openOptionsPage();
	  } else {
	    window.open(chrome.runtime.getURL('options.html'));
	  }
		window.close();
	});
}
function fetchClass() {
	return $.ajax({
			url: aeriesURL+'Widgets/ClassSummary/GetClassSummary?IsProfile=True',
			method: 'GET'
		});
}
//Called when initial fetch fails.
var loadedFaux = 0; //cancel load if fauxing
function bootSequence_phase2() {
	if(loadedFaux)
		return;
  chrome.storage.local.get({
    aeriesid: '',
    user: '',
    pass: ''
  }, function(items) {
		if(loadedFaux)
			return;
		if(items.aeriesid == '') {
			logOutUser("aeries");
			return;
		}
		login(items.user, items.pass).done(function() {
			if(loadedFaux)
				return;
			fetchClass().done(function(data){
				if(loadedFaux)
					return;
				if(!Array.isArray(data) || (data.length > 10 && data.length <= 0)) {
					logOutUser("pass");
					return;
				}
				loadClassesWithData(data);
			}).fail(function() {
				$('#headText').text("Network Error");
			})
		
		});
  });
}
function fetchCalc(method) {
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendRequest(tab.id, {fetchGrade: true}, method);
	});
}
function renderFromData(data) {
	data.forEach(function(thisEle){
		var newCat = $($('template#cat').prop('content')).clone().find('tr');
		if(thisEle.name != "Overall") {
			$('#category', newCat).removeAttr('id').text(thisEle.name);
			$('#weight', newCat).removeAttr('id').text(thisEle.weight);
			$('#score', newCat).removeAttr('id').text(thisEle.points);
			$('#outOf', newCat).removeAttr('id').text(thisEle.of);
		} else {
			$('#category', newCat).removeAttr('id').text(thisEle.name);
			$('#weight', newCat).removeAttr('id').text("");
			$('#score', newCat).removeAttr('id').text("");
			$('#outOf', newCat).removeAttr('id').text("");
		}
		$('#percent', newCat).removeAttr('id').text((thisEle.grade * 100).toFixed(2)+"%");
		$('#calc').append(newCat);
	});
	$('body').css('height', 'auto'); //bugfix
}
function loadFaux() {
	loadedFaux = 1;
	addFaux("1");
	$('body').css('min-height', 0);
	$('.footer a').attr('href', "javascript:addFaux(0)");
	$('.footer #sis').text("+ Add Fake Assignment");
	$('#headText').text("Grade Calculator");
	$(".lds-css").remove();
	//create fake table
	$('#calc').removeClass('hidden');
	fetchCalc(function(res) {
		//render
		renderFromData(res);
	});
}
function addFaux(param) {
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendRequest(tab.id, {addNewFaux: param}, null);
	});
}
$(function() {
	//Boot sequence:
	// Try to load page
	// If fails, log in then load page
	// If fails, prompt user for login.
	chrome.tabs.getSelected(null, function(tab) {
		if(tab.url) {
		 if(tab.url.toLowerCase().includes("/student/gradebookdetails.aspx")) {
			 loadFaux();
		 }
	 }
  });
  $('body').on('click', 'a', function(){
		if($(this).attr('href') == "javascript:addFaux(0)")
			addFaux(0);
		else
    	chrome.tabs.create({url: $(this).attr('href')});
    return false;
  });
  chrome.storage.local.get({
    aeriesid: '',
    user: '',
    pass: ''
  }, function(items) {
		aeriesURL = "https://" +items.aeriesid + ".asp.aeries.net/student/";
		if(loadedFaux)
			return;
		if(aeriesURL == "") {
			logOutUser("aeries");
			return;
		}
		$('.footer a').attr('href', aeriesURL);
		fetchClass().done(function(data){
			if(!Array.isArray(data) || (data.length > 10 && data.length <= 0)) {
				bootSequence_phase2();
				return;
			}
			loadClassesWithData(data);
		}).fail(function(err) {
			$('#headText').text("Network Error");
		});
	});
});
