function save_options() {
  var aeries = document.getElementById('aeries').value;
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  chrome.storage.local.set({
    aeriesid: aeries,
    user: email,
    pass: password,
  }, function() {
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
		window.close();
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}
function restore_options() {
  chrome.storage.local.get({
    aeriesid: 'mvla',
    user: '',
    pass: ''
  }, function(items) {
	 	document.getElementById('aeries').value = items.aeriesid;
	  document.getElementById('email').value = items.user;
	  document.getElementById('password').value = items.pass;
		//https://stackoverflow.com/questions/30541436/focus-on-the-first-empty-input
		var input = document.getElementsByTagName('input');
		for (var i = 0, n = input.length; i < n; i = i + 1) {
		  if (!input[i].value) {
		    input[i].focus();
		    break;
		  }
		}		
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
