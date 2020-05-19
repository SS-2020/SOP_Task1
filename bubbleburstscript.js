let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
var dx = 0.5,dy = 0.5;
var sc=0;	
var rate=150;
var felix=2;
canvas.width=canvas.offsetWidth;
canvas.height=canvas.offsetHeight;
let circlearray = [];
let area = 0;
let x, y;
color=["blue","red","green","yellow"];
best=[];
var secondsLabel = document.getElementById("sec");
var sec=0;
var ss;
var AUD=document.querySelector('.burst');
function setsec()
{
    ++sec;
    secondsLabel.innerHTML = sec;
	if(!(sec%80))
		document.querySelector("#gauntlet").style.display="block";
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
		document.querySelector('.over').play();
        clearInterval(this.interval);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		document.querySelector(".gamescreen").innerHTML="";
		ctx.font = '48px serif';
		ctx.fillText("Game Over!   Your Score is:"+sc,150,220);
		var ct = document.querySelector("#score").innerHTML;
		if(ct>0)
			best.push(ct);
        update();
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

    return Math.floor(Math.random() * (max - min + 1) + min);

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

    const xDist = x2 - x1;
	const yDist = y2 - y1;
	return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));

}

function circle(x, y, dx, dy, radius , color) {
    this.x = x;
    this.y = y;
	this.color = color;
    this.velocity = {
        x: dx,
        y: dy,
    }
    this.radius = radius;
	this.clck=0;
    this.draw = function() {
	if(this.color=='rb')
	{
		ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#9400D3";
        ctx.fill("evenodd");
		ctx.closePath();
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius/2, 0, Math.PI * 2);
        ctx.fillStyle = "#8B0000";
        ctx.fill();
        ctx.closePath();
	}
	else
	{	
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
	}
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
    if (game.frameNo == 1 || everyinterval(rate)) {
		radius=randomIntFromRange(15, 25);
        x = randomIntFromRange(radius, canvas.width - radius);
        y = randomIntFromRange(radius, canvas.height - radius);
		j = randomIntFromRange(0, 3);
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
		if(game.frameNo % 500)
			circlearray.push(new circle(x, y, dx, dy, radius, color[j]));
		else
			circlearray.push(new circle(x, y, dx, dy, radius, 'rb'));
    }
    for (i = 0; i < circlearray.length; i += 1) {
        circlearray[i].update(circlearray);
    }
     if (area>=(0.35*canvas.width*canvas.height))
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
        if(distance(mouse.x,mouse.y,circlearray[i].x,circlearray[i].y) -  circlearray[i].radius <0)
		{
			if(circlearray[i].color=='rb')
			{
				circlearray[i].clck++;
				if(circlearray[i].clck == 5)
				{
				AUD.play();
				circlearray.splice(i,1);
				sc+=5;
				area-=Math.PI*circlearray[i].radius*circlearray[i].radius;
				document.querySelector("#score").innerHTML=sc;
				break;
				}
			}
			else
			{
				AUD.play();
				circlearray.splice(i,1);
				sc+=1;
				area-=Math.PI*circlearray[i].radius*circlearray[i].radius;
				document.querySelector("#score").innerHTML=sc;
				break;
			}
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
	document.querySelector("#Liquidluck").style.display="block";
	document.querySelector("#NoOfLl").style.display="block";
}

window.onload
{
 	best=JSON.parse(localStorage.getItem("best"));
 	if(!best)
    {
 		document.querySelector("#Bs").innerHTML="nil";
 		best=[];
 	}
  	else
 	{
 		document.querySelector("#Bs").innerHTML=best[0];
 	}
}

function Felix() {
    felix--;
    if (felix >= 0) {
        var t = 5;
        var duration = setInterval(function() {
            t--;
            rate = 300;
            if (t < 0) {
                clearInterval(time);
                rate = 150;
            }
        }, 1000)
	document.querySelector("#NoOfLl").innerHTML=felix+"";
    } 
}

function clearhalf()
{
	AUD.play();
	document.querySelector("#gauntlet").style.display="none";
	for (let i = 0; i < circlearray.length; i++) {
        circlearray.splice(i, 1);
        area -= Math.PI * radius * radius;
        if (i == (circlearray.length) / 2)
			break;
    }
}

var lgt=best.length;

function sortbest()
{
 	var lgt=best.length;
 	for(var i=0;i<lgt;i++)
	{
 		var si=parseFloat(best[i]);
 		for(var j=0;j<i;j++)
		{
       		var sj=parseFloat(best[j]);
        	if(si>sj)
         	{
         		var tp=best[i];
        		best[i]=best[j];
        		best[j]=tp;
        	}
    	}
  	}
}

function update()
{
  	sortbest();
   	var str=JSON.stringify(best);
	localStorage.setItem("best",str);
}

var l=5,t="";
if(lgt<5)
	l=lgt;

for(var i=0;i<l;i++)
{ 
	t+=best[i];
	if(i!=l-1)
	  t+=",";
}
document.querySelector("#Bs").innerHTML=t;
        