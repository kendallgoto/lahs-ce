chrome.runtime.sendMessage('LOADEDBELL', function(response) {
    if(response == "yes") {
		var link = document.createElement('link');
		link.href =  chrome.extension.getURL('/css/bell.css');
		link.rel = 'stylesheet';
		document.documentElement.insertBefore(link, null);
    }
});
