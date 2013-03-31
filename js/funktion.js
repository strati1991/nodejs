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
					$("#login").remove();
					getUserData();
				}else{
					if(data.login == true){
						$("#login").remove();
						getUserData();
					}else{
						alert("du bist nicht eingeloggt");
					}
				}
				}
			});
	});

	$('#produzenten').bind('click',function(){
		hide("#plz_box",function(){
			getProducerByFilter({plz: $('#plz').val(),distance: $( "#slider" ).slider( "value" ) / 10});
			show("#produzenten_box",function(){

			});
		});
	});
});
function hide(selector,ready){
	$(selector).animate({ opacity: "0"}, 500, function(){
		$(selector).addClass('hidden');
		ready();
	});
}
function show(selector,ready){
	$(selector).removeClass('hidden');
	$(selector).animate({ opacity: "1"}, 500, function(){
		ready();
	});
}
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
				$("#producer_list").html('');
				if(data.length >0){
					var sdata = "";
					$.each(data, function(s, item) {
						sdata+= "<div class='producer'>";
	    				sdata+= "<name>" + item.username + "</name>";
						sdata+= "<address>" +item.street + "&nbsp;" + item.hnr+ "<br>" + item.plz +"&nbsp;" +item.town + "</address>";
						sdata+= "<products>";
						sdata+= "Produkte:<br>";
						$.each(item.products,function(i, product){
							sdata+= "<product><img title='" + product.name + "'src='img/" + product.name + ".svg'></product>";
						});
						sdata+= "</div>";
						sdata+= "</producer>";
					});
					$("#producer_list").html(sdata);
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
			var sdata = "<h1>Dein Profil</h1>";
			if(data.img == ""){
				sdata+= "<img id='img' class='editable-image' src='img/profile_alt.png' ><form method='post' action='http://localhost:3000/db/updateUser'><input id='file' type='file' style='display:none'></form>";
			} else {
				sdata+= "<img id='img' class='editable-image' src='" + data.img +  "' ><form method='post' action='http://localhost:3000/db/updateUser'><input id='file' type='file' style='display:none'></form>";
			}
			sdata+= "<h2>Adresse</h2>" + "<span class='editable' id='street'>" + data.street + "</span>&nbsp;";
			sdata+= "<span class='editable' id='hnr'>"  + data.hnr + "</span><br>";
			sdata+= "<span class='editable' id='plz'>" + data.plz + "</span>&nbsp;";
			sdata+= "<span class='editable' id='town'>" + data.town + "</span>";
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
	$('.editable').mouseover(function() {
		$(this).append("<img src='img/edit.png'>");
	});
	$('.editable').mouseleave(function() {
		$(this).find("img").remove();
	});
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
							_this.replaceWith("<span class='editable' id='" + id + "'>" + _this.val() + "</span>");
						}
					});
				}
			});
	});
	$('.editable-image').bind('click', function() {
		$("#file").trigger('click');
	});
	$('#file').change(function() {
		$('form').ajaxForm({
		}).submit();
	});
}
