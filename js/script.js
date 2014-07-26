$(function() {
	var mouseX = 0;
	var mouseY = 0;
	var averageY = 200;
	var openMouth = false;
	var rightMouseButtonPressed = false;
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");	
	
	function resizeCanvas() {
		canvas.width = $(".container").width();
		draw();
	}

	resizeCanvas();
	
	function reset(){
		LPosX = (canvas.width/2)-150;
		LPosY = 200;			
		RPosX = (canvas.width/2)+150;
		RPosY = 200;
	}
	
	var LPosX = (canvas.width/2)-150;
	var LPosY = 200;			
	var RPosX = (canvas.width/2)+150;
	var RPosY = 200;

	function draw(){
		var colorBackgroundEyes = localStorage.getItem('color-background-eyes');
		var colorEyes = localStorage.getItem('color-eyes');
		var colorBackgroundScreen = localStorage.getItem('color-background-screen');
		var colorBackgroundScreen = localStorage.getItem('color-background-screen');
		var colorBackgroundMouth = localStorage.getItem('color-background-mouth');
		var colorBorderMouth = localStorage.getItem('color-border-mouth');
		
		//Define background color
		$("body").css("background-color",colorBackgroundScreen);
		
		ctx.clearRect (0 , 0 , canvas.width,600 );
		ctx.fillStyle = colorBackgroundEyes;	
		ctx.beginPath();
		ctx.arc((canvas.width/2)-150, 200, 100, 0, 2 * Math.PI, false);
		ctx.arc((canvas.width/2)+150, 200, 100, 0, 2 * Math.PI, false);
		ctx.fill();
		
		ctx.beginPath();
		ctx.fillStyle = colorEyes;
		ctx.arc(LPosX, LPosY, 50, 0, 2 * Math.PI, false);
		ctx.arc(RPosX, RPosY, 50, 0, 2 * Math.PI, false);
		ctx.fill();
		
		//Draw mouth
		if(openMouth){
			ctx.beginPath();
			ctx.arc((canvas.width/2), 430, 100, 0, Math.PI, false);
			ctx.closePath();
			ctx.lineWidth = 5;
			ctx.fillStyle = colorBackgroundMouth;
			ctx.fill();
			ctx.strokeStyle = colorBorderMouth;
			ctx.stroke();					
		}else{
			ctx.beginPath();
			ctx.lineWidth = 5;
			ctx.moveTo((canvas.width/2)-100, 430);
			ctx.lineTo((canvas.width/2)+100, 430);
			ctx.strokeStyle = colorBorderMouth;
			ctx.stroke();
		}
	}	

	function positionLeftEye(){
		var y = averageY - mouseY;
		var x = ($( "canvas" ).offset().left)+(canvas.width/2-150)-mouseX;
			
		LPosX = (canvas.width/2-150) - (50 * x) / Math.sqrt(x*x+y*y);
		LPosY = 200 - (50 * y) / Math.sqrt(x*x+y*y);
	}

	function positionRightEye(){
		var y = averageY - mouseY;
		var x = ($( "canvas" ).offset().left)+(canvas.width/2+150)-mouseX;
		RPosX = (canvas.width/2+150) - (50 * x) / Math.sqrt(x*x+y*y);
		RPosY = 200 - (50 * y) / Math.sqrt(x*x+y*y);
	}
	
	$( window ).resize(function() {
		resizeCanvas();	
		reset();
		draw();			
	});
	
	resizeCanvas();

	//Remove context menu when user click with right button
	$(document).bind("contextmenu",function(e){
		return false;
	});
	
	if(typeof(Storage) !== "undefined") {
		if(localStorage.getItem("color-background-screen") === null){
			localStorage.setItem("color-background-screen", "#1aff5a");
		}
		if(localStorage.getItem("color-background-eyes") === null){
			localStorage.setItem("color-background-eyes", "#ffffff");
		}
		if(localStorage.getItem("color-eyes") === null){
			localStorage.setItem("color-eyes", "black");
		}
		if(localStorage.getItem("color-background-mouth") === null){
			localStorage.setItem("color-background-mouth", "red");
		}
		if(localStorage.getItem("color-border-mouth") === null){
			localStorage.setItem("color-border-mouth", "#000000");
		}		
	} else {
		alert("Sorry! No Web Storage support");
	}
	
	//Create colorspickers
	$('.colorpicker-color-eyes').colorpicker();
	$('.colorpicker-color-background-eyes').colorpicker();
	$('.colorpicker-color-background-screen').colorpicker();
	$('.colorpicker-color-background-mouth').colorpicker();
	$('.colorpicker-color-border-mouth').colorpicker();
	
	$( ".container" ).mousemove(function( event ) {
		if(rightMouseButtonPressed){
			return
		}
			
		mouseX = event.pageX;
		mouseY = event.pageY;	
	
		positionLeftEye();
		positionRightEye();
		
		draw();
	}).mousedown(function(event) {
		if(event.target.nodeName == "A"){
			return
		}
		if(event.which == 3){
			reset();
			rightMouseButtonPressed = ! rightMouseButtonPressed;
		}else if(event.which == 1){
			openMouth = true;
		}
		draw();
	}).mouseup(function(event) {
		openMouth = false;
		draw();
	});	
	
	function loadColorsInColorPicker(key,color){
		$(".colorpicker-"+key).colorpicker('setValue', localStorage.getItem(key));
		$("#input-"+key).val(localStorage.getItem(key));
		$(".colorpicker-"+key).colorpicker().on('changeColor', function(ev){
			localStorage.setItem(key, ev.color.toHex());
			draw();
		});
	}
	
	$('#changeColorModal').on('show.bs.modal', function () {
		loadColorsInColorPicker("color-eyes",localStorage.getItem("color-eyes"));
		loadColorsInColorPicker("color-background-eyes",localStorage.getItem("color-background-eyes"));
		loadColorsInColorPicker("color-background-screen",localStorage.getItem("color-background-screen"));		
		loadColorsInColorPicker("color-background-mouth",localStorage.getItem("color-background-mouth"));		
		loadColorsInColorPicker("color-border-mouth",localStorage.getItem("color-border-mouth"));		
	})	

	draw();
});	