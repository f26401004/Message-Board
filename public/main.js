///////// deal with the time. /////////

$(function startTime() {
	var today = new Date();
	var y = today.getUTCFullYear();
	var mon = today.getUTCMonth() + 1;
	var d = today.getUTCDate();
	var h = today.getHours();
	var m = today.getMinutes();
	var s = today.getSeconds();
	m = checkTime(m);
	s = checkTime(s);
	document.getElementById('time').innerHTML = '今天日期 : ' + y + '/' + mon + '/' + d + ' '+ h + ":" + m + ":" + s;
	var t = setTimeout(startTime, 500);
});

function checkTime(i) {
	if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
	return i;
}

////////// read all messages from database and add to the page. //////////
$(document).ready(
	$.ajax({
		type : "GET",
		url: "/list",
		data: {},
		datatype: "json",
		success: function(data) {
			// decode the string to json.
			var messages = JSON.parse(data);
			console.log(messages);
			for (var i = 0 ; i < messages.length ; ++i) {
				// add the message on the message board.
				var msgBlock = document.getElementById('msgBlock');
				// initialize the message DOM.
				var msg = document.createElement("div");
				msg.id = 'msg';
				var title = document.createElement("h3");
				title.innerHTML = '訊息 #' + (i + 1);
				var content = document.createElement("p");
				content.id = 'content';
				content.innerHTML = messages[i].msg;
				var timestamp = document.createElement("p");
				timestamp.id = 'timestamp';
				var formattedTime = new Date(messages[i].time);
				var y = formattedTime.getUTCFullYear();
				var mon = formattedTime.getUTCMonth() + 1;
				var d = formattedTime.getUTCDate();
				var h = formattedTime.getHours();
				var m = formattedTime.getMinutes();
				var s = formattedTime.getSeconds();
				m = checkTime(m);
				s = checkTime(s);
				timestamp.innerHTML = y + '/' + mon + '/' + d + ' '+ h + ":" + m + ":" + s;
				// add message DOM to the message board.
				msg.appendChild(title);
				msg.appendChild(content);
				msg.appendChild(timestamp);
				msgBlock.appendChild(msg);
			}
		}
	})
);

////////// dynamic background plugin. //////////
bubbly({
	colorStart: "#111",
	colorStop: "#422",
	bubbleFunc: () => `hsla(0, 100%, 50%, ${Math.random() * 0.1})`
});

////////// deal with the slide message effect. //////////
$(document).ready ( function(){
	// add the hover & click event to the whole message.
	$('#main #msgBlock #msg').hover(function(){
		$(this).addClass('title_on');
	}, function(){
		$(this).removeClass('title_on');
	}).click(function(){
		$(this).children('p').slideToggle();
	}).children('p').hide();
});


////////// deal with the slide bar. //////////
$(document).ready( function() {
	var $slidebar = $('#slidebar'),
	_top = $slidebar.offset().top;
	// when the window start scrolling.
	var $win = $(window).scroll( () => {
		// if window scroll top larger than slide bar top.
		if ($win.scrollTop() >= _top) {
			// fix the slide bar to the screen.
			if ($slidebar.css('position')!='fixed') {
				$slidebar.css({
					position: 'fixed',
					width: '16.06%',
					left: '62.35%',
					top: 0
				});
			}
		// put the slide bar to original location.
		} else {
			$slidebar.css({
				position: 'relative',
				width: '26%',
				left: '70%'
			});
		}
	});
});

///////// deal with the modal message box. /////////
var modal = document.getElementById('blackBack');
var btn = document.getElementById("send");
var span = document.getElementById("close");

// when the user clicks the button, open the modal 
btn.onclick = () => {
	modal.style.display = 'block';
}
// when the user clicks on <span> (x), close the modal
span.onclick = () => {
	modal.style.display = 'none';
}

// when the user clicks anywhere outside of the modal, close it
window.onclick = (event) => {
	if (event.target == modal) {
		modal.style.display = 'none';
	}
}

////////// deal with the secuirty. //////////

function stripscript(s) {
	// use regex to prevent some danger word in the message.
	var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&mdash;—|{}【】‘；：”“'。，、？]");
	var rs = "";  
	for (var i = 0; i < s.length; i++) {  
		rs = rs + s.substr(i, 1).replace(pattern, '');  
	}
	return rs;
}

function formsubmit () {
	var form = document.getElementById('form');	
	// decode the message.
	form.msgContent.value = stripscript(form.msgContent.value);
	// use ajax to send the request to the server.
	$.post('save', {msg: form.msgContent.value}, (error) => {
		// reset the form.
		form.reset();
		modal.style.display = 'none';
		// refreah the message block.
		location.reload(true);
	});
}

