var canvas, ctx, BB, offsetX, offsetY, lastX, lastY, firstDraw;

window.onload = function(){
	
	canvas = document.getElementById("drawing");
	canvas.width = canvasWidth;
	canvas.height = document.body.clientHeight;
	ctx = canvas.getContext("2d");
	BB = canvas.getBoundingClientRect();
	offsetX = BB.left;
	offsetY = BB.top;

	firstDraw = true;

	lastX = -1;
	lastY = -1;

	drawImage();
}

function drawLine(currentX, currentY){
	var mouseX = currentX - offsetX;
    var mouseY = currentY - offsetY;

	ctx.beginPath();

	//move pointer to correct location
	if(lastX > -1 && lastY > -1){
		ctx.moveTo(lastX, lastY);
	}
	else{
		ctx.moveTo(mouseX, mouseY);
	}

	//if first draw, draw green circle
	if(firstDraw){
		ctx.strokeStyle="green";
		ctx.arc(mouseX, mouseY, 10, 0, 2 * Math.PI);
		ctx.fillStyle = "green";
		ctx.fill();

		firstDraw = false;
	}
	else{
		ctx.strokeStyle="black";	
	}
    
    ctx.lineTo(mouseX, mouseY);
    ctx.stroke();

    lastX = mouseX;
    lastY = mouseY;
}

function drawImage(){

	var previousPoint;

	//draw all points
	for(var pointCount = 0; pointCount < tracking.length; pointCount++){
		
		var point = tracking[pointCount];

		if(pointCount > 1){
			if(point.time - previousPoint.time > 100){
				//the user halted for more than a second before moving to the new point, so draw blue circle
				ctx.strokeStyle="blue";
				var circleSize = (point.time - previousPoint.time)/100;
				if(circleSize < 5){circleSize = 5;}
				ctx.arc(lastX, lastY, circleSize, 0, 2 * Math.PI);
				ctx.stroke();
			}
		}

		//draw line from previous point to new point
		drawLine(point.x, point.y);

		//save the previous point
		previousPoint = point;
	}

	//draw end circle
	ctx.strokeStyle="red";
	ctx.arc(lastX, lastY, 10, 0, 2 * Math.PI);
	ctx.fillStyle = "red";
	ctx.fill();
}