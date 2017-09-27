var aeriesURL;
function loadClassesWithData(data) {
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
	console.log('foreach');
	data.forEach(function(thisEle){
		console.log(thisEle);
		var newClass = $($('template#class').prop('content')).clone().find('tr');
		$('#period', newClass).removeAttr('id').text(thisEle.Period);
		$('#classname', newClass).removeAttr('id').text(thisEle.CourseName);
		$('#grade', newClass).removeAttr('id').text(thisEle.CurrentMarkAndScore);
		$('#updated', newClass).removeAttr('id').text("("+thisEle.LastUpdated+")");
		console.log(newClass);
		$('#grades').append(newClass);
	});
}
function login(user, pass) {
	return $.ajax({
		url: 'https://mvla.asp.aeries.net/Student/LoginParent.aspx',
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
	    // New way to open options pages, if supported (Chrome 42+).
	    chrome.runtime.openOptionsPage();
	  } else {
	    // Reasonable fallback.
	    window.open(chrome.runtime.getURL('options.html'));
	  }
		window.close();
	});
}
function fetchClass() {
	return $.ajax({
			url: 'https://mvla.asp.aeries.net/student/Widgets/ClassSummary/GetClassSummary?IsProfile=True',
			method: 'GET'
		});
}
function promptForPassword() {

}
//Called when initial fetch fails.
function bootSequence_phase2() {
  chrome.storage.local.get({
    aeries: '',
    user: '',
    pass: ''
  }, function(items) {
		if(items.aeries == '') {
			logOutUser("aeries");
			return;
		}
		login(items.user, items.pass).done(function() {
			console.log('authed');
			fetchClass().done(function(data){
				if(!Array.isArray(data) || (data.length > 10 && data.length <= 0)) {
					console.log('failed w/ auth');
					logOutUser("pass");
					return;
				}
				console.log('success');
				loadClassesWithData(data);
			}).fail(function() {
				$('#headText').text("Network Error");
			})
		
		});
  });
}
$(function() {
	//loaded!
	/*
	if(chrome.storage.local.get('sis-pass') != "") {
		//password needed!
		promptForPassword();
		return;
	}
	*/
	//Boot sequence:
	// Try to load page
	// If fails, log in then load page
	// If fails, prompt user for login.
  $('body').on('click', 'a', function(){
    chrome.tabs.create({url: $(this).attr('href')});
    return false;
  });
  chrome.storage.local.get({
    aeries: '',
    user: '',
    pass: ''
  }, function(items) {
		aeriesURL = items.aeries;
		if(aeriesURL == null) {
			logOutUser("aeries");
			return;
		}
		console.log("trying no-auth");
		fetchClass().done(function(data){
			console.log(data);
			if(!Array.isArray(data) || (data.length > 10 && data.length <= 0)) {
				console.log('failed - authing')
				bootSequence_phase2();
				return;
			}
			console.log('success')
			loadClassesWithData(data);
		}).fail(function(err) {
			//TODO: check internet connectivity.
			$('#headText').text("Network Error");
			//bootSequence_phase2();
		});
	});
});
