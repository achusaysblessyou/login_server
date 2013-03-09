var dispCanvas, dispCtx, 
drawCanvas, drawCtx,
clrButton,
mouseDown = false,
tools = {},
tool,
pencilButton,
rectangleButton,
circleButton,
blackButton,
blueButton,
redButton,
lineThicknessBox,
colorBox,
buggyCircle = false,
buggyCircleButton,
debug = false,
currentTool = 'pencil'; //defaults tool to pencil tool

function initialize() {

	/*********************** Tools Declarations *********************/

    //======================== Pencil ============================
    tools.pencil = function () {
        var tool = this;
        // This is called when you start holding down the mouse button.
    	// This starts the pencil drawing.
	    this.mousedown = function (event) {
            drawCtx.beginPath();
	    	drawCtx.moveTo(event.x, event.y)
	    	mouseDown = true;
	    };

	    // This function is called every time you move the mouse. 
	    //	only runs if mouse is down
		this.mousemove = function (event) {
			if (mouseDown) {
				drawCtx.lineTo(event.x, event.y);
     			drawCtx.stroke();
       			canvasUpdate();
			}
		};

		// This is called when you release the mouse button.
	    this.mouseup = function (event) {
	    	if (mouseDown) {
                if(event.x < 100) event.x = 0;
                if(event.y < 100) event.y = 0;
	    		tool.mousemove(event);
	    		mouseDown = false;
	    	}
	    };

	    this.mouseout = function(event) {
            console.log(event.x + ' ' + event.y);
	    	document.getElementById('canvas-coord-message').innerHTML = "";	
    	    tool.mouseup(event);
            mouseDown = false;
    	};

    	this.changeColor = function(color) {
    		drawCtx.strokeStyle = color;
    	}
	};

	//======================== Rectangle ============================
	tools.rectangle = function () {
        var tool = this;

        this.mousedown = function (event) {
            if(mouseDown) {
                tool.mouseup(event);
            } else {
                mouseDown = true;
                tool.x0 = event.x;
                tool.y0 = event.y;
            }
	    };

	    this.mousemove = function (event) {
	    	if (!mouseDown) {
	    		return;
	    	}
	    	var x = Math.min(event.x,  tool.x0),
	    	y = Math.min(event.y,  tool.y0),
	    	w = Math.abs(event.x - tool.x0),
	    	h = Math.abs(event.y - tool.y0);

	    	drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);

	    	if (!w || !h) {
	    		return;
	    	}

	    	drawCtx.strokeRect(x, y, w, h);
	    };

	    this.mouseup = function (event) {
	    	if (mouseDown) {
	    		tool.mousemove(event);
	    		mouseDown = false;
	    		canvasUpdate();
	    	}
	    };

    	this.changeColor = function(color) {
    		drawCtx.strokeStyle = color;
    	}
  	};

    //======================== Circle ============================
    tools.circle = function () {
        var tool = this;

        this.mousedown = function (event) {
            if(mouseDown) {
                //if user went outside canvas while drawing, let them continue
                tool.mouseup(event);
            } else {
                mouseDown = true;
                tool.x0 = event.x;
                tool.y0 = event.y;
            }
        };

        this.mousemove = function (event) {
            if (!mouseDown) {
                return;
            }

            midX = (tool.x0 + event.x) / 2
            midY = (tool.y0 + event.y) / 2

            radius = Math.sqrt(Math.pow(event.x - midX,2) + Math.pow(event.y - midY,2));

            drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);

            if(!buggyCircle) drawCtx.beginPath();
            drawCtx.arc(midX, midY, radius, 0, Math.PI * 2, false);
            drawCtx.stroke();
            //drawCtx.strokeRect(x, y, w, h);
        };

        this.mouseup = function (event) {
            if (mouseDown) {
                tool.mousemove(event);
                mouseDown = false;
                canvasUpdate();
            }
        };

        this.changeColor = function(color) {
            drawCtx.strokeStyle = color;
        }
    };



    dispCanvas = document.getElementById('myCanvas');
    dispCtx = dispCanvas.getContext("2d");
    clrButton = document.getElementById('clear-button');
    blackButton = document.getElementById('black-button');
    blueButton = document.getElementById('blue-button');
    redButton = document.getElementById('red-button');
    lineThicknessBox = document.getElementById("line-thickness-box");
    colorBox = document.getElementById("color-box");
    pencilButton = document.getElementById("pencil-button")
    rectangleButton = document.getElementById("rectangle-button");
    circleButton = document.getElementById("circle-button");
    buggyCircleButton = document.getElementById("buggy-circle-button");
    debugButton = document.getElementById("debug-button");


    //Create the "drawCanvas" - the canvas which we draw on, and then copy
    // onto dispCanvas
    var cnvsContainer = dispCanvas.parentNode;
    drawCanvas = document.createElement('canvas');
    drawCanvas.id = "drawCanvas";
    drawCanvas.width = dispCanvas.width;
    drawCanvas.height = dispCanvas.height;
    cnvsContainer.appendChild(drawCanvas);
    drawCtx = drawCanvas.getContext('2d');
    drawCanvas.style = "position:absolute;top: 1px; left: 1px;"
    drawCtx.lineCap = "round"; //set line cap to round
    drawCtx.lineJoin = "round"; //set line join to be round (no more jaggies)

    drawCanvas.addEventListener('mouseover', handleEvent, false);
    drawCanvas.addEventListener('mouseout', handleEvent, false);
    drawCanvas.addEventListener('mousedown', handleEvent, false);
    drawCanvas.addEventListener('mousemove', handleEvent, false);
    drawCanvas.addEventListener('mouseup',   handleEvent, false);

    //Activate default tool:
    tool = new tools[currentTool]();

    //This function draws the "drawing" layer onto the background layer
    function canvasUpdate() {
        dispCtx.drawImage(drawCanvas,0,0);
        clearCanvas(drawCtx);
    }

    function clearCanvas(context) {
    	context.clearRect(0,0,dispCanvas.width, dispCanvas.height)
	}

    function handleEvent(event) {
    	//console.log(event.type);
        //get the x and y offset in terms of the canvas, two ways
        // to support multiple browsers (offset doesn't work with firefox)
        if(event.offsetX) { //for Chrome/Opera
            event.x = event.offsetX;
            event.y = event.offsetY;
        }
        else if(event.layerX) { //For Firefox
            event.x = event.layerX;
            event.y = event.layerY;
        }

        var funcToCall = tool[event.type];
        if(funcToCall) {//check if it's valid
        	funcToCall(event)
        } else {
        	if(debug) console.log(currentTool + " has no associated function " + event.type);
        }
    }

    clrButton.onclick = function() { 
        clearCanvas(dispCtx); 
        clearCanvas(drawCtx); 
        return false;
    };

    pencilButton.onclick = function() {
		currentTool = "pencil";
		tool = new tools[currentTool]();
        return false;
    };

    rectangleButton.onclick = function() {
		currentTool = "rectangle";
		tool = new tools[currentTool]();
        return false;
    };

    circleButton.onclick = function() {
        buggyCircle = false;
        currentTool = "circle";
        tool = new tools[currentTool]();
        return false;
    };

    buggyCircleButton.onclick = function() {
        //lets you play with the buggy circle
        buggyCircle = true;
        currentTool = "circle";
        tool = new tools[currentTool]();
        return false;
    }

    blackButton.onclick = function() {
		tool.changeColor('#000000');
		return false;
	};

	blueButton.onclick = function () {
		tool.changeColor('#0000FF');
		return false;
	};

	redButton.onclick = function () {
		tool.changeColor('#FF0000');
		return false;
	};

	colorBox.onkeydown = function (event) {
		if(event.keyCode == 13) { //only check for enter
			tool.changeColor(colorBox.value);
			colorBox.value = "Color: #000000";
			return false; //return false on enter (else canvas cleared)
		}
	};

    //this button works the same for circle rectangle and pencil
    lineThicknessBox.onkeydown = function (event) {
        if(event.keyCode == 13) { //only check for enter
            drawCtx.lineWidth = parseInt(lineThicknessBox.value);
            lineThicknessBox.value = "Line Thickness";
            return false; //return false on enter (else canvas cleared)
        }
        //no return for other key presses, else key press doesn't happen
    };

    debugButton.onclick = function () {
        debug = !debug;
        if(debug) {
            debugButton.value = "Debug On (look at console)";
        } else {
            debugButton.value = "Debug Off";
        }
        return false;
    };
}

