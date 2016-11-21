// game.js
// Ryan Stonebraker
// Created: 10/13/2016
// Last Updated: 11/20/2016
// A Ninja performs simple physics in an interactive physics-demonstrating game.

// TODO make sim x position of target building a random value between a min/max
// distance, make game stop if ninja goes below screen, make ninja appear to run,
// if hits target, show you win, move on to next level, ALSO test acceleration
// and velocity and how matches real physics

var nCtx;
var bgCtx;
var ninjacanvas;
var bgcanvas;

var game = {
  "width" : 400,
  "height" : 250,
  "fps" : 50,
  "level" : 1,
  "spacePressed" : 0,
  "initialContact" : false,
  "jump" : 1,
  "xKeySpeed" : 15,
  "yKeySpeed" : 20,
  "startX" : 10,
  "nScale" : 1,
  "bgScale" : 1,
  "nScaled" : false,
  "bgScaled" : false
}

var key = {
  "up" : "W".charCodeAt(),
  "down" : "S".charCodeAt(),
  "left" : "A".charCodeAt(),
  "right" : "D".charCodeAt(),
  "space" : " ".charCodeAt()
}

window.Game = {};

(function (){
var _ninja = {
  img : {
    std : "img/ninja.svg"
  },
  width : 35 * game.nScale,
  height : 78 * game.nScale,
  offset : {
    x : -12,
    y : 0
  },
  name : "ninja"
}

var ninja = new object (_ninja.img.std, _ninja.width, _ninja.height);

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
    bgCtx = bgcanvas.getContext("2d");

    nCtx.clearRect(0, 0, game.width, game.height);
  }

  this.refresh ();

  window.addEventListener('keydown', this.keys.bind(this), true);
}

screen.prototype.drawObject = function (obj, offsetX, offsetY, bg)
{
  if (!offsetX)
    offsetX = 0;
  if (!offsetY)
    offsetY = 0;
  if (!bg)
    nCtx.drawImage(obj.img, obj.xPos + offsetX, obj.yPos + offsetY);
  else
    bgCtx.drawImage(obj.img, obj.xPos + offsetX, obj.yPos + offsetY);
}

// shiftX should ONLY be used in a non looping context such as outside screen
screen.prototype.pseudoCamera = function (velocity, shiftX)
{
  if (!shiftX)
    shiftX = 0;
  switch (game.level)
  {
    case 1:
      _building1.xPos += shiftX;
      _building2.xPos += shiftX;
      if (velocity == 0)
      {
        _building1.velocity.x = _building1.simVelocity.x;
        _building2.velocity.x = _building2.simVelocity.x;
        _background.velocity.x = _background.simVelocity.x;
      }
      else
      {
        _building1.velocity.x = velocity + _building1.simVelocity.x;
        _building2.velocity.x = velocity + _building2.simVelocity.x;
        _background.velocity.x = velocity/10 + _background.simVelocity.x;
      }
      break;
  }
}

if (game.level == 1)
{
var _building1 = new object ("img/building1.svg", 467, 179);
_building1.yPos = game.height - 150;
_building1.xPos = -300;
_building1.simX = _building1.xPos;
_building1.name = "b1";
var _building2 = new object ("img/target.svg", 150, 300);
_building2.yPos = game.height - 75;
_building2.xPos = 500;
_building2.simX = _building2.xPos;
_building2.name = "b2";
_building2.kineticFriction = 0.5;
var _background = new object ("img/BG.svg", 800, 400);
_background.yPos = 0;
_background.xPos = -50;
_background.name = "bg";

ninja.simX = 50;
ninja.yPos = _building1.tY - ninja.height;

screen.prototype.pseudoCamera(0, game.startX);
}
screen.prototype.arena1 = function ()
{
  if (!game.nScaled)
  {
  nCtx.scale(game.nScale, game.nScale);
  ninja.width *= game.nScale;
  ninja.height *= game.nScale;
  game.nScaled = true;
  }

  if (!game.bgScaled)
  {
    bgCtx.scale (game.bgScale, game.bgScale);
    _building1.width *= game.bgScale;
    _building1.height *= game.bgScale;
    game.bgScaled = true;
  }

  var drawBG = true;
  var drawN = false;
  this.drawObject (_building1, -15, -15, drawN);
  this.drawObject (_building2, 0, -18, drawN);
  this.drawObject (_background, 0, 0, drawBG);

  var scr2RX = _building2.xPos + _building2.width;
  var scrNRX = ninja.xPos + ninja.width;
  var xGap = 50;
  if (scrNRX <= _building2.xPos -15 || ninja.xPos >= scr2RX)
  {
  var startLine = {x: ninja.xPos + ninja.width + xGap,
                   y: ninja.yPos + ninja.height/2};

  nCtx.fillStyle = "white";
  nCtx.font = "15px Verdana";
  if (ninja.xPos >= scr2RX)
  {
    startLine.x = ninja.xPos - xGap - 20;
    var distance = (_building2.lX + _building2.width/2) - ninja.rX;
    distance = Math.round(distance);
    nCtx.fillText(distance + "m", ninja.xPos - 15 - xGap, ninja.yPos + ninja.height/2);
  }
  else
  {
    var distance = (_building2.lX + _building2.width/2) - ninja.rX;
    distance = Math.round(distance)/10; // 10 px = 1 m
    nCtx.fillText(distance + "m", scrNRX + 5, ninja.yPos + ninja.height/2);
  }

  var endLine = {x: _building2.xPos + _building2.width/2,
                 y: _building2.yPos - 30};
  nCtx.strokeStyle = "white";
  nCtx.beginPath();
  nCtx.moveTo(startLine.x,startLine.y);
  nCtx.lineTo(endLine.x, endLine.y);
  nCtx.lineWidth = 3;
  nCtx.stroke();
  }

  ninja.elasticity = 0.1;
  ninja.acceleration.y = 15;
  kinematic (_building1, game.fps);
  kinematic (_building2, game.fps);
  kinematic (_background, game.fps);

  kinematic.prototype.detectCollision (ninja, _building1, game.fps);
  kinematic.prototype.detectCollision (ninja, _building2, game.fps);
}

screen.prototype.refresh = function ()
{
  var self = this;
  setTimeout(function() {requestAnimationFrame(function(){self.refresh();})},
             1000/game.fps);

  nCtx.clearRect (0, 0, game.width, game.height);
  bgCtx.clearRect (0, 0, game.width, game.height);
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
    this.pseudoCamera(-ninja.simVelocity.x);
  }
  else if (ninja.tR.x + game.fps/1000 * ninja.simVelocity.x >= game.width - 50)
  {
    ninja.xPos = game.width - 50 - ninja.width;
    ninja.velocity.x = 0;
    this.pseudoCamera(-ninja.simVelocity.x);
  }

  if (ninja.simVelocity.x > 0 && ninja.acceleration.x > 0)
    ninja.acceleration.x -= 5;
  else if (ninja.simVelocity.x < 0 && ninja.acceleration.x < 0) {
    ninja.acceleration.x += 5;
  }
  if (Math.abs(ninja.simVelocity.x) <= 1)
    ninja.acceleration.x = 0;

  this.drawObject(ninja, _ninja.offset.x, _ninja.offset.y);
  physpane();
}

screen.prototype.keys = function (evt)
{
  switch (evt.keyCode)
  {
    case key.left:
      if (ninja.contact)
      {
        ninja.simVelocity.x -= game.xKeySpeed;
        ninja.acceleration.x = -5;
        if (ninja.xPos > game.width/2 - 150 && ninja.contact)
        {
          ninja.velocity.x = ninja.simVelocity.x;
          this.pseudoCamera(0);
        }
      break;
      }
    case key.right:
      if (ninja.contact)
      {
        ninja.acceleration.x = 5;
        ninja.simVelocity.x += game.xKeySpeed;
        if (ninja.tR.x < game.width/2 + 150 && ninja.contact)
        {
          ninja.velocity.x = ninja.simVelocity.x;
          this.pseudoCamera(0);
        }
      }
      break;
    case key.space:
      if (game.spacePressed == 0 && ninja.contact && ninja.interact == 3)
      {
        game.initialContact = true;
      }
      else if (game.spacePressed == game.jump-1 && (!ninja.contact || ninja.interact))
        game.initialContact = false;
      if(game.spacePressed < game.jump && game.initialContact)
      {
        ++game.spacePressed;
        ninja.velocity.y = -game.yKeySpeed;
      }
      evt.preventDefault();
      break;
  }
}
  Game.screen = screen;
})();
