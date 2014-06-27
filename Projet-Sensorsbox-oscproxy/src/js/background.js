chrome.app.runtime.onLaunched.addListener(function(){
	chrome.app.window.create('dist/build.html');
});
