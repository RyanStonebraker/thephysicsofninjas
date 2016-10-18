// game.js
// Ryan Stonebraker
// 10/13/2016
// A Ninja performs simple physics in an interactive physics-demonstrating game.

var ctx;
var canvas;

var game = {
  "width" : 400,
  "height" : 250,
  "fps" : 50,
  "level" : 1,
  "applyTime" : 0,
  "counter" : 0,
  get secTime () {
    return this.counter/1000;
  }
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
  "mass" : 100,
  "multiplier" : 0,
  "gravityConst" : 0,
  "angle" : 0,
  "applied_force" : 0,
  "contact" : true,
  get rads ()
  {
    return this.angle * Math.PI/180;
  },
  "position" : {
    "x" : 0,
    "y" : 0
  },
  "velocity" : {
    "x" : 0,
    "y" : 0
  },
  "acceleration" : {
    "x" : 0,
    "y" : 0
  },
  "net_force" : {
    "x" : 0,
    "y" : 0
  }
}
// start position at center bottom
ninja.position.x = game.width/2 - ninja.width/2;
ninja.position.y = game.height - ninja.height;

ninja.img.src = "img/ninja.svg";

function mainGame ()
{
  canvas = document.getElementById("gameCanvas");

  if (canvas.getContext)
  {
    ctx = canvas.getContext("2d");
    ctx.fillStyle= "white";
    ctx.fillRect(0, 0, game.width, game.height);
  }

  makeNinja (ninja.position.x, ninja.position.y);

  refresh ();

  window.addEventListener('keydown', keys, true);
}

function makeNinja (x, y)
{
  ctx.fillRect (0, 0, game.width, game.height);
  ctx.drawImage(ninja.img, x, y);
}

function refresh ()
{
  setTimeout(function() {requestAnimationFrame(refresh);}, 1000/game.fps);


  switch (game.level)
  {
    case 1:
      arena1 (ninja, game.secTime);

      break;
  }

  move (ninja, game.secTime);

  makeNinja(ninja.position.x, ninja.position.y);
  physpane();

  if (ninja.position.y = game.height - ninja.height)
    ninja.contact = true;
  else if (ninja.position.y < game.height - ninja.height)
    ninja.contact = false;

  if (game.counter >= game.applyTime/(1000/game.fps))
    game.counter -= game.applyTime/(1000/game.fps);
  else if (game.counter < game.applyTime/(1000/game.fps) && game.counter >= 0)
  {
    game.counter = 0;
    ninja.applied_force = 0;
  }
  console.log("Y Force" + ninja.net_force.y);
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
      if (ninja.position.y == (game.height - ninja.height))
        {
          game.applyTime = 1000;
          game.counter = 1000;
          ninja.applied_force = ninja.multiplier*ninja.mass*ninja.gravityConst;
        }
      evt.preventDefault();
      break;
  }
}
