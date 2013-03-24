$(document).ready(function() {
    $('#anmelden').bind('click', function() {
			$.ajax({
			 	type: "POST"
				,url: "http://localhost:3000/login"
				,dataType: 'jsonp'
				,contentType : 'application/x-www-form-urlencoded'
				,data:{ 
					username: $('#username').val()
					,password: CryptoJS.MD5($('#password').val()).toString()
				}
				,jsonp: '_jsonp'
			,jsonpCallback: 'jsonpCallback'
			,success: function(data){
				if(data.already != undefined){
					getUserData();
				}else{
					if(data.login == true){
						getUserData();
					}else{
						alert("du bist nicht eingeloggt");
					}
				}
				}
			});
	});
});

function getUserData(){
	$.ajax({
		 	type: "POST"
			,url: "http://localhost:3000/db/getUserData"
			,dataType: 'jsonp'
			,contentType : 'application/x-www-form-urlencoded'
			,jsonp: '_jsonp'
		,jsonpCallback: 'jsonpCallback'
		,success: function(data){
			if($('.userData').length == 0){
				$('body').append('<div id="userData" class="userData"></div>');
			}
			var sdata = "<h1>User Data</h1>"
			sdata+= "<h2>PLZ</h2>" + "<p class='editable' id='plz'>" + data.plz + "</p>";
			sdata+= "<h2>Strasse</h2>" + "<p class='editable' id='street'>" + data.street + "</p>";
			sdata+= "<h2>Hausnummer</h2>" + "<p class='editable' id='hnr'>" + data.hnr + "</p>";
			sdata+= "<h2>Produkte:</h2>";
			$.each(data.products,function(k,v){
				sdata+= "<h3>" + v.name + "</h3><p class='editable' id='" + v.name + "'>" + v.text + "</p>";
			});
			$("#userData").html(sdata);
			makeEditable();
		}
	});
}
function makeEditable(){
	$('.editable').bind('click', function() {
			var id = $(this).attr('id');
			$(this).replaceWith("<input id='" + id + "' type='text' value='" + $(this).text() + "'>");
			var _this = $("#"+id);
			_this.keydown(function(event){
				if (event.which == 13) {
					$.ajax({
					 	type: "POST"
						,url: "http://localhost:3000/db/updateUser"
						,dataType: 'jsonp'
						,contentType : 'application/x-www-form-urlencoded'
						,data:{ 
							key: id
							,value: _this.val()
						}
						,jsonp: '_jsonp'
						,jsonpCallback: 'jsonpCallback'
						,success: function(data){
							alert(data);
							_this.replaceWith("<p class='editable' id='" + id + "'>" + _this.val() + "</p>");
						}
					});
				}
			});
	});
}
