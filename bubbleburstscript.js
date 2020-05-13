let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
var dx = 0.5,dy = 0.5;
var sc=0;	
canvas.width=canvas.offsetWidth;
canvas.height=canvas.offsetHeight;
let circlearray = [];
let area = 0;
let x, y;


var secondsLabel = document.getElementById("sec");
var sec=0;
var ss;

function setsec()
{
    ++sec;
    secondsLabel.innerHTML = sec;
}
	
var game = {
    start: function() {
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 10);
		ss=setInterval(setsec,1000);

    },
    clear: function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
    stop: function() {
        clearInterval(this.interval);
		document.querySelector(".gamescreen").innerHTML="";
		alert("Game Over! Your Score is:"+sc);
    }
}
function pausegame()
{
	el=document.querySelector("#pause");
	if(el.innerHTML=="PAUSE")
	{
		clearInterval(game.interval);
		el.innerHTML="PLAY";
		clearInterval(ss);
	}
	else if(el.innerHTML=="PLAY")
	{
		game.interval = setInterval(updateGameArea, 10);
		el.innerHTML="PAUSE";
		ss=setInterval(setsec,1000);
	}

}
var mouse = {
    x: null,
    y: null,
}

function randomIntFromRange(min, max) {

    return Math.floor(Math.random() * (max - min + 1) + min)

}

function rotate(velocity, angle) {

    const rotatedVelocities = {

        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),

        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)

    };

    return rotatedVelocities;

}
// Collision between balls are resolved 

function resolveCollision(particle, otherParticle) {

    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;

    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;

    const yDist = otherParticle.y - particle.y;


    // Prevent accidental overlap of particles

    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles

        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Velocity before equation

        const u1 = rotate(particle.velocity, angle);

        const u2 = rotate(otherParticle.velocity, angle);

        const v1 = { x:  u2.x , y: u1.y };

        const v2 = { x:  u1.x , y: u2.y };

        // Final velocity 

        const vFinal1 = rotate(v1, -angle);

        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities 

        particle.velocity.x = vFinal1.x;

        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;

        otherParticle.velocity.y = vFinal2.y;

    }

}

function distance(x1, y1, x2, y2) {

    const xDist = x2 - x1
	const yDist = y2 - y1
	return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))

}

function circle(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.velocity = {
        x: dx,
        y: dy,
    }
    this.radius = radius;
    this.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.closePath();
	}

    this.update = function(circlearray) {
        this.draw();
        for (let i = 0; i < circlearray.length; i++) {
            if (this === circlearray[i]) continue;
            if (distance(this.x, this.y, circlearray[i].x, circlearray[i].y) - 2 * this.radius <= 0) {
                resolveCollision(this, circlearray[i]);
            }
        }


        if (this.x + this.radius > canvas.width || this.x < this.radius)
            this.velocity.x = -this.velocity.x;
        if (this.y + this.radius > canvas.height || this.y < this.radius)
            this.velocity.y = -this.velocity.y;

        this.x += this.velocity.x;
        this.y += this.velocity.y;

    }
}
var u=0,v=0;
function updateGameArea() {
    game.clear();
    u=u+1;	
    game.frameNo += u;
    if (game.frameNo == 1 || everyinterval(150)) {
		radius=randomIntFromRange(15, 20);
        x = randomIntFromRange(radius, canvas.width - radius);
        y = randomIntFromRange(radius, canvas.height - radius);
        if (circlearray.length > 1) {
            for (let i = 0; i < circlearray.length; i++) {
                if (distance(x, y, circlearray[i].x, circlearray[i].y) - 2 * radius < 0) {
                    x = randomIntFromRange(radius, canvas.width - radius);
                    y = randomIntFromRange(radius, canvas.height - radius);
                    i = -1;
                }

            }
        }
        area += (Math.PI * radius * radius);
		dx=-dx;
		dy=-dy;
        circlearray.push(new circle(x, y, dx, dy, radius));
    }
    for (i = 0; i < circlearray.length; i += 1) {
        circlearray[i].update(circlearray);
    }
     if (area>=(0.4*canvas.width*canvas.height))
	 {
		v+=0.01;
		console.log('1');
		if(v>=10)
		{
			game.stop();
			clearInterval(setsec);
		}
	 }
	 else
	 {	 
		v=0;
		console.log('0');
	 }
}

window.addEventListener('click', function(e) {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
    for (i = 0; i < circlearray.length; i += 1) {
        if(distance(mouse.x,mouse.y,circlearray[i].x,circlearray[i].y) <= circlearray[i].radius)
		{
			circlearray.splice(i,1);
			sc+=5;
			document.querySelector("#score").innerHTML=sc;
		}
    }
})

function everyinterval(n) {
    if ((game.frameNo / n) % 1 == 0) { return true; }
    return false;
}

function playgame()
{
	game.start();
	document.querySelector("#playit").style.display="none";
	document.querySelector("#pause").style.display="block";
	document.querySelector("#replay").style.display="block";
}
