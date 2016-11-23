// testEngine.js
// Ryan Stonebraker
// Created: 11/23/2016
// Demonstrates the kinematics engine.

var tCtx;
var tCvs;
var testFPS = 30;
var times = 1;

function testRun ()
{
  var tCvs = document.getElementById("testEng");
  if (tCvs.getContext)
  {
    tCtx = tCvs.getContext("2d");
  }
  refreshTest();
}

var ball = new object("img/ball.svg", 50, 50);
ball.yPos = 0;
ball.simX = 75;
ball.xPos = 75;
ball.acceleration.y = Math.random()*100 + 50;
ball.elasticity = 0.8;
ball.name = "ball";
var ground = new object(0, 200, 200);
ground.yPos = 200;
ground.xPos = 0;
ground.name = "ground";

function refreshTest()
{
  var that = this;
  setTimeout(function() {requestAnimationFrame(function(){that.refreshTest();})},
             1000/testFPS);

  tCtx.clearRect(0, 0, 200, 200);
  if (times % 2 == 0)
  {
    tCtx.arc(ball.xPos, ball.yPos,50,0,2*Math.PI);
    tCtx.stroke();
  }
  else
    tCtx.drawImage(ball.img, ball.xPos, ball.yPos);
  kinematic (ball, testFPS);
  kinematic.prototype.detectCollision (ball, ground, testFPS);

  if (Math.abs(ball.velocity.y) <= 2 && ball.contact || ball.yPos > 150)
  {
    ++times;
    if (times % 2 == 0)
    {
    var rndm = Math.round(Math.random()*3);
    if (rndm == 0)
      tCtx.strokeStyle = "white";
    else if (rndm == 1)
      tCtx.strokeStyle = "orange";
    else if (rndm == 2)
      tCtx.strokeStyle = "blue";
    else if (rndm == 3)
      tCtx.strokeStyle = "yellow";
    }
    ball.yPos = 0;
    ball.acceleration.y = Math.random()*100 + 50;
  }
}
