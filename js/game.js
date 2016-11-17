// game.js
// Ryan Stonebraker
// Created: 10/13/2016
// Last Updated: 11/16/2016
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
  "spacePressed" : 0
}

var key = {
  "up" : "W".charCodeAt(),
  "down" : "S".charCodeAt(),
  "left" : "A".charCodeAt(),
  "right" : "D".charCodeAt(),
  "space" : " ".charCodeAt(),
  "spacePressed" : 0
}

window.Game = {};

(function (){
var _ninja = {
  img : {
    std : "img/ninja.svg"
  },
  width : 77,
  height : 100
}

var ninja = new object (_ninja.img.std, _ninja.width, _ninja.height);
ninja.xPos = 0;
ninja.yPos = 0;

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

    nCtx.clearRect(0, 0, game.width, game.height);
  }

  this.drawObject (ninja);

  this.refresh ();

  window.addEventListener('keydown', this.keys.bind(this), true);
}

screen.prototype.drawObject = function (obj, offsetX, offsetY)
{
  if (!offsetX)
    offsetX = 0;
  if (!offsetY)
    offsetY = 0;
  //nCtx.fillRect (0, 0, game.width, game.height);
  nCtx.drawImage(obj.img, obj.xPos + offsetX, obj.yPos + offsetY);
}

var _building1 = new object("img/building1.svg", 467, 179);
_building1.yPos = game.height - 100;
_building1.xPos = -300;

screen.prototype.arena1 = function ()
{
    this.drawObject (_building1, 0, -15);

    ninja.elasticity = 0.1;

    ninja.acceleration.y = 15;
    kinematic (_building1, game.fps);
    kinematic.prototype.detectCollision (ninja, _building1, game.fps);
}

screen.prototype.refresh = function ()
{
  var self = this;
  setTimeout(function() {requestAnimationFrame(function(){self.refresh();})}, 1000/game.fps);

  nCtx.clearRect(0, 0, game.width, game.height);
  switch (game.level)
  {
    case 1:
      this.arena1();
      break;
  }
  kinematic (ninja, game.fps);

  if (ninja.contact)
    game.spacePressed = 0;

  if (ninja.xPos + game.fps/1000 * ninja.simVelocity.x <= 50)
  {
    ninja.xPos = 50;
    ninja.velocity.x = 0;
    _building1.velocity.x = -ninja.simVelocity.x;
  }
  else if (ninja.tR.x + game.fps/1000 * ninja.simVelocity.x >= game.width - 50)
  {
    ninja.xPos = game.width - 50 - ninja.width;
    ninja.velocity.x = 0;
    _building1.velocity.x = -ninja.simVelocity.x;
  }

  this.drawObject(ninja);
  physpane();
}

screen.prototype.keys = function (evt)
{
  switch (evt.keyCode)
  {
    case key.left:
      ninja.simVelocity.x -= 10;
      if (ninja.xPos > game.width/2 - 150)
      {
        ninja.velocity.x = ninja.simVelocity.x;
        _building1.velocity.x = 0;
      }
      else
      {
        _building1.velocity.x = -ninja.simVelocity.x;
        ninja.velocity.x = 0;
      }
      break;
    case key.right:
      ninja.simVelocity.x += 10;
      if (ninja.tR.x < game.width/2 + 150)
      {
        ninja.velocity.x = ninja.simVelocity.x;
        _building1.velocity.x = 0;
      }
      else
      {
        _building1.velocity.x = -ninja.simVelocity.x;
        ninja.velocity.x = 0;
      }
      break;
    case key.space:
      if(game.spacePressed < 2)
      {
        ++game.spacePressed;
        ninja.velocity.y = -20;
      }
      evt.preventDefault();
      break;
  }
}
  Game.screen = screen;
})();
