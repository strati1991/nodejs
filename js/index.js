$(document).ready(function() {
	$(function() {
    	$( "#slider" ).slider({
	      orientation: "horizontal",
	      range: "min",
	      max: 200,
	      value: 10,
	      change: sliderChange,
	      slide: sliderValue
    	});
  	});
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
	$('#plz').keypress(function(event) {
		if ( event.which == 13 ) {
     		getProducerByFilter({plz: $('#plz').val(),distance: $( "#slider" ).slider( "value" ) / 10});
   		}
	});
});

function sliderChange(){
	getProducerByFilter({distance: $( "#slider" ).slider( "value" )/10})
}
function sliderValue(){
	$("#sliderValue").html($( "#slider" ).slider( "value" )/10);
}

function getProducerByFilter(data){
	$.ajax({
		 	type: "POST"
			,url: "http://localhost:3000/db/getProducerByFilter"
			,dataType: 'jsonp'
			,contentType : 'application/x-www-form-urlencoded'
			,data: data
			,jsonp: '_jsonp'
			,jsonpCallback: 'jsonpCallback'
			,success: function(data){
				$(".producerData").remove();
				if(data.length >0){
					$('body').append('<div id="producerData" class="producerData"></div>');
					var sdata = "";
					$.each(data, function(s, item) {
	    				sdata+= "<div class=producer><h1>" + item.username + "</h1>"
						sdata+= "<h2>PLZ</h2>" + "<p class='editable' id='plz'>" + item.plz + "</p>";
						sdata+= "<h2>Strasse</h2>" + "<p class='editable' id='street'>" + item.street + "</p>";
						sdata+= "<h2>Hausnummer</h2>" + "<p class='editable' id='hnr'>" + item.hnr + "</p>";
						sdata+= "<h2>Produkte:</h2>";
						$.each(item.products,function(i, product){
							sdata+= "<h3>" + product.name + "</h3><p id='" + product.name + "'>" + product.text + "</p>";
						});
						sdata+= "</div>";
					});
					$("#producerData").html(sdata);
				}
				
			}
	});
}
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
				$('body').append('<div id="userMap" class="userMap"></div>');
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
			$("#userMap").html('<iframe width="425" height="350" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="http://maps.google.de/?ie=UTF8&q=' + data.loc.lat + "+" + data.loc.lng +'&output=embed"></iframe>');
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
