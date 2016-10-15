// game.js
// Ryan Stonebraker
// 10/13/2016
// A Ninja performs simple physics in an interactive physics-demonstrating game.

var ctx;
var canvas;

var setup = {
  "width" : 400,
  "height" : 250,
  "fps" : 30
}

var key = {
  "up" : 38,
  "down" : 40,
  "left" : 37,
  "right" : 39,
  "space" : 32
}

var ninja = {
  "img" : new Image (),
  "height" : 100,
  "width" : 77,
  "position" : {
    "x" : setup.width/2 - 77/2,
    "y" : setup.height - 100
  },
  "velocity" : {
    "x" : 0,
    "y" : 0
  },
  "acceleration" : {
    "x" : 0,
    "y" : 0
  }
}
ninja.img.src = "img/ninja.svg";

function game ()
{
  canvas = document.getElementById("gameCanvas");

  if (canvas.getContext)
  {
    ctx = canvas.getContext("2d");
    ctx.fillStyle= "white";
    ctx.fillRect(0, 0, setup.width, setup.height);
  }

  makeNinja (ninja.position.x, ninja.position.y);

  refresh ();

  window.addEventListener('keydown', keys, true);
}

function makeNinja (x, y)
{
  ctx.fillRect (0, 0, setup.width, setup.height);
  ctx.drawImage(ninja.img, x, y);
}

function physics ()
{
  // TODO implement velocity and acceleration
  gravity ();
}

function gravity ()
{
  if (ninja.position.y < 150)
  {
    ninja.position.y += setup.fps/10;
  }
}

function refresh ()
{
  setTimeout(function() {requestAnimationFrame(refresh);}, 1000/setup.fps)
  physics ();
  makeNinja(ninja.position.x, ninja.position.y);
}

function keys (evt)
{
  switch (evt.keyCode)
  {
    // TODO make upwards motion more fluid with setTimeout/requestAnimationFrame
    case key.left:
      ninja.position.x -= 30;
      break;
    case key.right:
      ninja.position.x += 30;
      break;
    case key.space:
      ninja.position.y -= 30;
      evt.preventDefault();
      break;
  }
}
