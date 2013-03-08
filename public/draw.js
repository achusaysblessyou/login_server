var prevX = -1,
prevY = -1,
canvas, ctx, 
tempCanvas, tempCtx,
clrButton,
mouseDown = 0,
counter = 0,
sizeBigger;


function initialize() {
    canvas = document.getElementById('myCanvas');
    clrButton = document.getElementById('clear-button');
    ctx = canvas.getContext("2d");
    sizeBigger = document.getElementById('size-bigger-button');
    
    //Add temporary Canvas for shape drawing:
    var cnvsContainer = canvas.parentNode;
    tempCanvas = document.createElement('canvas');
    tempCanvas.id = "tempCanvas";
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    function canvasUpdate() {
        ctx.drawImage(tempCanvas);
        tempCtx.clearCanvas(tempCtx);
    }

    canvas.onmousemove = function(event) {
        var x, y;

        //get the x and y offset in terms of the canvas, two ways
        // to support multiple browsers (offset doesn't work with firefox)
        if(event.offsetX) { //for Chrome/Opera
            x = event.offsetX;
            y = event.offsetY;
        }
        else if(event.layerX) { //For Firefox
            x = event.layerX;
            y = event.layerY;
        }
        document.getElementById('canvas-coord-message').innerHTML = "x: " + x + " y: " + y;
        if(mouseDown == 1) {
            drawLine(x,y);
        }
    }

    canvas.onmouseover = function(event) {
        if(mouseDown == 1) {
            drawLine(event);
        }
    };

    canvas.onmouseout = function(event) {
        console.log(ctx.lineWidth);
        /* //Tried to solve the cursor fly off the screen and not draw complete line, 
        //but that can't be helped and intros a "kick back" when the cursor goes to another window quickly
        if(event.offsetX) { //for Chrome/Opera
            x = event.offsetX;
            y = event.offsetY;
        }
        else if(event.layerX) { //For Firefox
            x = event.layerX;
            y = event.layerY;
        }
        if(mouseDown == 1) {
            drawLine(x,y);
        }
        */


        document.getElementById('canvas-coord-message').innerHTML = "";	
        prevX = prevY = -1;
        ctx.stroke(); //<-- finish drawing when mouse button moved outside the canvas
        ctx.stroke();
        ctx.stroke();
        ctx.stroke();
        mouseDown = 0;
    };

    clrButton.onclick = function(){ 
        clearCanvas(ctx) 
    };

    sizeBigger.onclick = function() {
        console.log("click: " + ctx.lineWidth);
        ctx.lineWidth = 25;
        return false;
    };


    canvas.addEventListener('mousedown', function() {
        ctx.beginPath();
        mouseDown = 1;
    }, false);

    canvas.addEventListener('mouseup', function() {
        prevX = prevY = -1;
        ctx.stroke(); //<-- finish drawing when mouse button is lifted
        ctx.stroke();
        ctx.stroke();
        ctx.stroke();
        mouseDown = 0;
    }, false);

}


/************* function cnvs_clearCanvas *************
* This function clears the canvas object by first
*/
function clearCanvas(context) {
    prevX = -1;
    prevY = -1;
    // this essentially fills the rectangle the size of canvas to white
    //context.fillStyle = "#FFFFFF"
    //context.fillRect(0,0,canvas.width, canvas.height)
    context.clearRect(0,0,canvas.width, canvas.height)
    /* This is a bad idea
    canvas.width = canvas.width;
    var ctx=canvas.getContext("2d");
    ctx.moveTo(0,0);
    */
}

//This is how to draw a circle
function fillCircle(x, y, radius, fillColor) {
    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fill();
};

var count = 0;

function drawLine(x,y) {
    
    //this is to draw a bunch of circles for "line"
    /*var radius = 10;
    fillCircle(x,y,radius, '#FF0000');//*/

    //this is to draw a bunch of rectangles for a "line"
    //ctx.fillRect(x,y,5,5);

    //This tries to stop aliasing
    /*if(count == 10) {
        ctx.fillStyle = '#FF0000'   //<-- this colors the shape
        ctx.strokeStyle = '#FF0000' //<-- this colors strokes (and the outlines of stuff)
        ctx.stroke();
        count = 0;
    } else count++;
    //*/


    
    //This actually draws a line, and the count stuff is to prevent aliasing
    if(prevX > -1 && prevY > -1) {
        ctx.strokeStyle = '#000000'
        ctx.lineTo(x,y);
        //increasing count helps with aliasing, 
        // but as count goes up, you need to draw more at every count pixels
        if(count == 10) { 
            ctx.stroke();
            count = 0;
        } else count++;
    }
    prevX = x;
    prevY = y;
    //*/
}

function drawRectangle() {
    ;
}