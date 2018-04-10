var webPage = require('webpage');
var page = webPage.create();
var system = require('system');
var urladvice = "http://in4325.local/makeDrawing.php?id=" + system.args[1];
console.log(urladvice);
page.viewportSize = { width: 414, height: 400};
page.open(urladvice, function start(status) {
	console.log('status? ' + status);
	console.log(system.args[1]);
  page.render('/Sites/IN4325/screenshots/' + system.args[1] + '.jpeg', {format: 'jpeg', quality: '100'});
  phantom.exit();
});