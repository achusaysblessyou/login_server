var prevX, prevY,
dispCanvas, dispCtx, 
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
colorSelector,
buggyCircle = false,
buggyCircleButton,
debug = false,
currentTool = 'pencil'; //defaults tool to pencil tool

var browser,
//need canvas position for non-FF browsers
canvTop = 0, //offset for X
canvLeft = 0; //offset for Y

function initialize() {

    /*********************** Tools Declarations *********************/

    //======================== Pencil ============================
    tools.pencil = function () {
        var tool = this;
        // This is called when you start holding down the mouse button.
        // This starts the pencil drawing.
        this.mousedown = function (event) {
            drawCtx.beginPath();
            drawCtx.moveTo(event.relx, event.rely)
            mouseDown = true;
        };

        // This function is called every time you move the mouse. 
        //  only runs if mouse is down
        this.mousemove = function (event) {
            if (mouseDown) {
                if(debug) console.log("calling " + currentTool+ ":" + event.type + " with mousedown, drawing at " +event.relx + " " + event.rely);
                drawCtx.lineTo(event.relx, event.rely);
                prevX = event.relx;
                prevY = event.rely;
                drawCtx.stroke();
                canvasUpdate();
            }
        };

        // This is called when you release the mouse button.
        this.mouseup = function (event) {
            if (mouseDown) {
                //if(event.relx < 100) event.relx = 0;
                //if(event.rely < 100) event.rely = 0;
                tool.mousemove(event);
                mouseDown = false;
            }
        };

        this.mouseout = function(event) {
            if(debug) console.log("exit coords mouseout: " + event.relx + ' ' + event.rely);
            document.getElementById('canvas-coord-message').innerHTML = ""; 
            event.relx = prevX;
            event.rely = prevY;
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
                tool.x0 = event.relx;
                tool.y0 = event.rely;
            }
        };

        this.mousemove = function (event) {
            if (!mouseDown) {
                return;
            }
            var x = Math.min(event.relx,  tool.x0),
            y = Math.min(event.rely,  tool.y0),
            w = Math.abs(event.relx - tool.x0),
            h = Math.abs(event.rely - tool.y0);

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
                tool.x0 = event.relx;
                tool.y0 = event.rely;
            }
        };

        this.mousemove = function (event) {
            if (!mouseDown) {
                return;
            }

            midX = (tool.x0 + event.relx) / 2
            midY = (tool.y0 + event.rely) / 2

            radius = Math.sqrt(Math.pow(event.relx - midX,2) + Math.pow(event.rely - midY,2));

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
    //colorBox = document.getElementById("color-box"); //<- depricated by colorSelector
    colorSelector = document.getElementById("color-selector");
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
    drawCanvas.style.border = "1px solid #FF0000";
    console.log(drawCanvas.style);
    cnvsContainer.appendChild(drawCanvas);
    drawCtx = drawCanvas.getContext('2d');
    drawCtx.lineCap = "round"; //set line cap to round
    drawCtx.lineJoin = "round"; //set line join to be round (no more jaggies)

    drawCanvas.addEventListener('mouseover', handleEvent, false);
    drawCanvas.addEventListener('mouseout', handleEvent, false);
    drawCanvas.addEventListener('mousedown', handleEvent, false);
    drawCanvas.addEventListener('mousemove', handleEvent, false);
    drawCanvas.addEventListener('mouseup',   handleEvent, false);

    //Detect browser:
    if('MozBoxSizing' in document.documentElement.style) {
        browser = "firefox"
    } else if(Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0) {
        browser = "safari"
    } else if(!!(window.chrome && chrome.webstore && chrome.webstore.install)) {
        browser = "chrome"
    } else if('msTransform' in document.documentElement.style) {
        browser = "ie"
    } else {
        browser = "unknown browser"
    }


    //called the first time, and every time the display canvas changes
    function windowResize() {
        //set the drawCanvas' position to absolute and top & left to 0
        // this is because the display canvas has been centered, and to put the 
        // drawing canvas over it, we need to find the offset from 0,0
        drawCanvas.style.position = "absolute"
        drawCanvas.style.top = "0px";
        drawCanvas.style.left = "0px";

        //find the offset of the display canvas to position the drawing canvas and
        // in chrome/safari use the offset to offset event.x and event.y to draw right
        canvLeft = 0, canvTop = 0, temp = dispCanvas;
        if (temp.offsetParent) {
            do {
                canvLeft += temp.offsetLeft;
                canvTop += temp.offsetTop;
            } while (temp = temp.offsetParent);
        }
     
        //move canvas to the right by canvLeft pixels
        //shift if left by 8, because something adds a 8 pixel shift
        drawCanvas.style.left = canvLeft - 8 + "px";
    }

    //set up canvas once
    windowResize();
    console.log(dispCanvas.style);
    console.log(drawCanvas.style);

    //Activate default tool:
    tool = new tools[currentTool]();



    //This function draws the "drawing" layer onto the background layer
    function canvasUpdate() {
        /*if(browser == "chrome") {
            var img = new Image();
            img.src = drawCanvas.toDataURL();
            dispCtx.drawImage(img,0,0)
        } else */
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
        if(browser == "chrome" || browser == "safari") { //for Chrome/Opera
            //we cant use event.x and event.y because in chrome (at least), x and y
            // are part of the event obj and is == offsetX and offsetY... and can't
            // be modified (I learned the hardway)
            /* 
            console.log("event.x " + event.x + " event.y " + event.y);
            event.x = event.offsetX - canvLeft;
            event.y = event.offsetY - canvTop;
            console.log("in here" + event.x + " " + event.y);
            */

            event.relx = event.offsetX //- canvLeft;
            event.rely = event.offsetY //- canvTop;
        }
        else if(browser = "firefox" || browser == "ie") { //For Firefox
            //layer provided by firefox gives us the relative position
            event.relx = event.layerX;
            event.rely = event.layerY;
        }

        var funcToCall = tool[event.type];
        if(funcToCall) {//check if it's valid
            //if(debug) console.log("calling " + currentTool+ ":" + event.type)
            funcToCall(event)
        } else {
            if(debug) console.log(currentTool + " has no associated function " + event.type);
        }
    }

    window.onresize = function() {
        if(debug) console.log("canvas is resizing");
        windowResize();
    };

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

    /* //deprecated by colorSelector
    colorBox.onkeydown = function (event) {
        if(event.keyCode == 13) { //only check if key press is enter
            tool.changeColor(colorBox.value);
            colorBox.value = "Color: #000000";
            return false; //return false on enter (else canvas cleared)
        }
    };*/

    colorSelector.onchange= function (event) {
        console.log("in here" + colorSelector.value)
        tool.changeColor(colorSelector.value);
        //return false; //return false on enter (else canvas cleared)
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
            console.log("browser is: " + browser);
            if(canvTop) console.log("canvTop: " + canvTop + " canvLeft: " + canvLeft);
        } else {
            debugButton.value = "Debug Off";
        }
        return false;
    };
}

