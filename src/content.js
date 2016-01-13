// content.js


/* To override the default window.alert 
 * so that chrome doesnot asks to open a new popup.
 * Cannot simply override due to sandboxing of extentions
 */
location.href="javascript: window.alert = function(x) {console.log(x)};";

/* The submit event dont fire if popup is allowed
 * so the extension wont work
 */
var form = document.forms['frmHTTPClientLogin'];

form.addEventListener('submit',function(evt){
	evt.preventDefault();
	username = form['username'].value;
	password = form['password'].value;

	if(typeof timeouts !== 'undefined')
	{
		for (var i=0; i<timeouts.length; i++) {
			clearTimeout(timeouts[i]);
		}
	}

	var body = document.getElementsByTagName('body')[0];
	body.style.width = '70%';

	var html = document.getElementsByTagName('html')[0];
	html.style.display = 'flex';

	if(!(iUsage = document.getElementById('iUsage')))
	{
		iUsage = document.createElement('div');
		iUsage.setAttribute('id','iUsage')
		iUsage.style.width = '30%';
		iUsage.style.padding = '50px'
		iUsage.style.color = "#336699";
		html.appendChild(iUsage);
	}

	timeouts = [];
	function getBalance() {
		var xhr = new XMLHttpRequest();
		xhr.open('GET','https://172.22.2.2/corporate/webpages/myaccount/AccountStatus.jsp?popup=0');
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4 && xhr.status === 200) {
				xml = xhr.responseText;
				var x = document.createElement('div');
				x.innerHTML = xml;
				var tds = x.getElementsByTagName('td');
				var totalData = parseFloat(tds[60].innerHTML);
				var remainingData = parseFloat(tds[64].innerHTML);

				iUsage.innerHTML = "<h3>Total Daily Data: "+ totalData+" MB </h3><h3>Remaining Data: "+ remainingData+" MB </h3>";
			}
		}
		xhr.send();
		timeouts.push(setTimeout(getBalance,10000));
	}

	var xhr = new XMLHttpRequest();
	xhr.open('POST','https://172.22.2.2/corporate/Controller');
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4 && xhr.status === 200) {
			getBalance();
		}
	};
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send("mode=451&json=%7B%22username%22%3A%22"+ username +"%22%2C%22password%22%3A%22"+ password +"%22%2C%22languageid%22%3A%221%22%2C%22browser%22%3A%22Chrome_47%22%7D&__RequestType=ajax");
	
});
