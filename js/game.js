// game.js
// Ryan Stonebraker
// Created: 10/13/2016
// Last Updated: 11/15/2016
// A Ninja performs simple physics in an interactive physics-demonstrating game.

var nCtx;
var bgCtx;
var ninjacanvas;
var bgcanvas;

var game = {
  "width" : 400,
  "height" : 250,
  "fps" : 50,
  "level" : 1
}

var key = {
  "up" : "W".charCodeAt(),
  "down" : "S".charCodeAt(),
  "left" : "A".charCodeAt(),
  "right" : "D".charCodeAt(),
  "space" : " ".charCodeAt(),
  "spacePressed" : 0
}

var _ninja = {
  img : {
    std : "img/ninja.svg"
  },
  width : 77,
  height : 100
}

var ninja = new object (_ninja.img.std, _ninja.width, _ninja.height);
ninja.xPos = game.width/2 - _ninja.width/2;
ninja.yPos = game.height - _ninja.height;

function screen (ninjadiv, bgdiv)
{
  if (!ninjadiv)
    return null;

  this.ninjaCanvas = ninjadiv;
  this.bgCanvas = bgdiv;
  // TODO make background canvas

  ninjacanvas = this.ninjaCanvas;
  bgcanvas = this.bgCanvas;

  if (ninjacanvas.getContext)
  {
    nCtx = ninjacanvas.getContext("2d");
    //bgCtx = bgcanvas.getContext("2d");

    nCtx.fillStyle= "white";
    nCtx.fillRect(0, 0, game.width, game.height);
  }

  this.makeNinja (ninja.xPos, ninja.yPos);

  this.refresh ();

  window.addEventListener('keydown', this.keys.bind(this), true);
}

screen.prototype.makeNinja = function (x, y)
{
  nCtx.fillRect (0, 0, game.width, game.height);
  nCtx.drawImage(ninja.img, x, y);
}

// TODO use arena1 prototype to add arena1 bg, special props
screen.prototype.arena1 = function ()
{

    var _building1 = new object(0, 3*game.width/8, 100);
    _building1.yPos = game.height;

    ninja.elasticity = 0.3;

  //  if (!ninja.velocity.y)
  //    game.spacePressed = 0;

    ninja.acceleration.y = 9.81;
    kinematic.prototype.detectCollision (ninja, _building1, game.fps);
}

screen.prototype.refresh = function ()
{
  var self = this;
  setTimeout(function() {requestAnimationFrame(function(){self.refresh();})}, 1000/game.fps);

  switch (game.level)
  {
    case 1:
      this.arena1();
      break;
  }
  kinematic (ninja, game.fps);


  this.makeNinja(ninja.xPos, ninja.yPos);
  physpane();
}

screen.prototype.keys = function (evt)
{
  switch (evt.keyCode)
  {
    case key.left:
      ninja.xPos -= 30;
      break;
    case key.right:
      ninja.xPos += 30;
      break;
    case key.space:
      //if(game.spacePressed < 2)
    //  {
      //  ++game.spacePressed;
        ninja.velocity.y += -20;
    //  }
      evt.preventDefault();
      break;
  }
}
