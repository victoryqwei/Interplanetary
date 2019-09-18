// HTML canvas shapes

function drawCircle(x, y, r, c, options) {
	if (!options)
		options = {};

	ctx.save();
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.fillStyle = c || 'red';
    ctx.globalAlpha = 1;
    if (options.glow)
    	ctx.shadowBlur = 100;
    if (options.glowColor)
		ctx.shadowColor = options.glowColor || 'aqua';
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.lineWidth = options.outlineWidth || 1;
    ctx.strokeStyle = options.outlineColor || 'black';
    if (options.outline)
    	ctx.stroke();
    ctx.closePath();
    ctx.restore();
}

function drawRectangle(x, y, w, h, c, options) {
	if (!options)
		options = {};

	ctx.save();
	ctx.translate(x, y);
	ctx.beginPath();
	ctx.rect(0, 0, w, h);
	ctx.fillStyle = c || 'grey';
	ctx.globalAlpha = 1;
	if (options.fill == undefined || options.fill)
		ctx.fill();
	ctx.strokeStyle = options.outlineColor || "black";
	ctx.lineWidth = options.outlineWidth || 1;
	if (options.outline)
		ctx.stroke();
	ctx.closePath();
	ctx.restore();
}

function drawRect(x, y, w, h, d, c) {
	ctx.translate(x, y)
	ctx.rotate(d);
	ctx.beginPath();

	ctx.rect(-w/2, -h/2, w, h);
	ctx.fillStyle = c || 'grey';
	ctx.globalAlpha = 1;
	ctx.fill();

	ctx.closePath();
	ctx.resetTransform();
}

function drawImage(img, x, y, w, h, angle) {
	ctx.translate(x, y);
	ctx.rotate(angle);
	ctx.drawImage(img, -w, -h, w*2, h*2);
	ctx.resetTransform();
}

function drawCircleImage(img, x, y, r, angle) {
	ctx.translate(x, y)
	ctx.rotate(angle);
	ctx.drawImage(img, -r, -r, r*2, r*2);
	ctx.resetTransform();
}

function drawLine(x1, y1, x2, y2, color, thickness) {
	ctx.beginPath();
	ctx.lineWidth = thickness;
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.strokeStyle = color || "black";
	ctx.stroke();
	ctx.closePath();
}

function drawText(text, x, y, font, color, align, baseline) {
	ctx.beginPath();
	ctx.font = font || "20px Arial";
	ctx.fillStyle = color || "red";
	ctx.textAlign = align || "default";
	ctx.textBaseline = baseline || "default";
	ctx.fillText(text, x, y);
	ctx.closePath();
}

function drawArrow(x1, y1, x2, y2, thickness, color, alpha, cap){
	ctx.beginPath();
	ctx.lineWidth = thickness || 2;
	ctx.strokeStyle = color || "black";
	ctx.globalAlpha = alpha || 1;
	ctx.lineCap = cap || "butt";
    var headlen = 10;   // length of head in pixels
    var angle = Math.atan2(y2-y1,x2-x1);
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x2-headlen*Math.cos(angle-Math.PI/6),y2-headlen*Math.sin(angle-Math.PI/6));
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2-headlen*Math.cos(angle+Math.PI/6),y2-headlen*Math.sin(angle+Math.PI/6));
    ctx.stroke();
    ctx.closePath();
    ctx.globalAlpha = 1;
}

// Math functions

function constrain(value, a, b) {
	if (value < a) {
		return a;
	} else if (value > b) {
		return b;
	} else {
		return value;
	}
}

function random(max, min) {
	return Math.random() * (max - min) + min;
}

function randInt(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}

function randn_bm() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

function dist(a, b) {
	return Math.sqrt(Math.pow(a.x-b.x, 2) + Math.pow(a.y-b.y, 2));
}

function round(value, decimalPlace) {
	var decimalPlace = (decimalPlace === undefined) ? 0 : decimalPlace;
	return Math.round( value * (10 ** decimalPlace)) / (10 ** decimalPlace)
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Color editor
const pSBC=(p,c0,c1,l)=>{
    let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
    if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
    if(!this.pSBCr)this.pSBCr=(d)=>{
        let n=d.length,x={};
        if(n>9){
            [r,g,b,a]=d=d.split(","),n=d.length;
            if(n<3||n>4)return null;
            x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
        }else{
            if(n==8||n==6||n<4)return null;
            if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
            d=i(d.slice(1),16);
            if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
            else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
        }return x};
    h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=pSBCr(c0),P=p<0,t=c1&&c1!="c"?pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
    if(!f||!t)return null;
    if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
    else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
    a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
    if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
    else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
}

// Collision detection helper
function circleCollidesRect ( circle, rect ) {
	
	var rectCenterX = rect.pos.x;
	var rectCenterY = rect.pos.y;

	var rectX = rectCenterX - rect.width / 2;
	var rectY = rectCenterY - rect.height / 2;

	var rectReferenceX = rectX;
	var rectReferenceY = rectY;
	
	// Rotate circle's center point back
	var unrotatedCircleX = Math.cos( rect.angle ) * ( circle.pos.x - rectCenterX ) - Math.sin( rect.angle ) * ( circle.pos.y - rectCenterY ) + rectCenterX;
	var unrotatedCircleY = Math.sin( rect.angle ) * ( circle.pos.x - rectCenterX ) + Math.cos( rect.angle ) * ( circle.pos.y - rectCenterY ) + rectCenterY;

	// Closest point in the rectangle to the center of circle rotated backwards(unrotated)
	var closestX, closestY;

	// Find the unrotated closest x point from center of unrotated circle
	if ( unrotatedCircleX < rectReferenceX ) {
		closestX = rectReferenceX;
	} else if ( unrotatedCircleX > rectReferenceX + rect.width ) {
		closestX = rectReferenceX + rect.width;
	} else {
		closestX = unrotatedCircleX;
	}
 
	// Find the unrotated closest y point from center of unrotated circle
	if ( unrotatedCircleY < rectReferenceY ) {
		closestY = rectReferenceY;
	} else if ( unrotatedCircleY > rectReferenceY + rect.height ) {
		closestY = rectReferenceY + rect.height;
	} else {
		closestY = unrotatedCircleY;
	}
 
	// Determine collision
	var collision = false;
	var distance = getDistance( unrotatedCircleX, unrotatedCircleY, closestX, closestY );
	
	if ( distance < circle.radius ) {
		collision = true;
	}
	else {
		collision = false;
	}

	return collision;
}

function getDistance( fromX, fromY, toX, toY ) {
	var dX = Math.abs( fromX - toX );
	var dY = Math.abs( fromY - toY );

	return Math.sqrt( ( dX * dX ) + ( dY * dY ) );
}

// Get screen pos

function getScreenPos(absolutePos, zoom) {
	return new Vector(
		absolutePos.x*zoom - rocket.pos.x*zoom + canvas.width/2, 
		absolutePos.y*zoom - rocket.pos.y*zoom + canvas.height/2);
}

// Game loop helper

class Loop {
	constructor(callback) {
		this.fps = 1000;
        this.now;
        this.then = Date.now();
        this.interval = 1000/fps;
        this.delta;
        this.fpsArray = [];
        this.averageArray;
	}

	loop() {

	}

	run() {
		requestAnimationFrame(loop);
		           
        now = Date.now();
        delta = now - then;
           
        if (delta > interval) {
            then = now - (delta % interval);
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            update();
    		draw();

            if (showFPS) {
            	// Get average frames per second with a 30 frame buffer
	              
	            fpsArray.push(1000/delta);
	            if (fpsArray.length > 30) {
	                fpsArray.shift();
	            }
	              
	            averageArray = fpsArray.reduce((a, b) => a + b, 0)/fpsArray.length;
	            // Draw the framerate top left of screen
	            ctx.beginPath();
	            ctx.font = "50px Arial";
	            ctx.fillStyle = "black";
	            ctx.fillText(Math.floor(averageArray), 20, 50);
	            ctx.closePath();
            } 
        }
	}
}