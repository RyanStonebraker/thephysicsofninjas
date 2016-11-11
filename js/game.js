// game.js
// Ryan Stonebraker
// Created: 10/13/2016
// Last Updated: 11/10/2016
// A Ninja performs simple physics in an interactive physics-demonstrating game.

var nCtx;
var bgCtx;
var ninjacanvas;
var bgcanvas;

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
  "up" : "W".charCodeAt(),
  "down" : "S".charCodeAt(),
  "left" : "A".charCodeAt(),
  "right" : "D".charCodeAt(),
  "space" : " ".charCodeAt()
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

function screen (ninjadiv, bgdiv)
{
  if (!ninjadiv)
    return null;

  this.ninjaCanvas = ninjadiv;
  this.bgCanvas = bgdiv;

  ninjacanvas = this.ninjaCanvas;
  bgcanvas = this.bgCanvas;

  if (ninjacanvas.getContext)
  {
    nCtx = ninjacanvas.getContext("2d");
    //bgCtx = bgcanvas.getContext("2d");

    nCtx.fillStyle= "white";
    nCtx.fillRect(0, 0, game.width, game.height);
  }

  this.makeNinja (ninja.position.x, ninja.position.y);

  this.refresh ();

  window.addEventListener('keydown', this.keys.bind(this), true);
}

screen.prototype.makeNinja = function (x, y)
{
  nCtx.fillRect (0, 0, game.width, game.height);
  nCtx.drawImage(ninja.img, x, y);
}

screen.prototype.refresh = function ()
{
  var self = this;
  setTimeout(function() {requestAnimationFrame(function(){self.refresh();})}, 1000/game.fps);


  switch (game.level)
  {
    case 1:
      arena1 (ninja, game.secTime);

      break;
  }

  move (ninja, game.secTime);

  this.makeNinja(ninja.position.x, ninja.position.y);
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
}

screen.prototype.keys = function (evt)
{
  switch (evt.keyCode)
  {
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
