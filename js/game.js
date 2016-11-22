// game.js
// Ryan Stonebraker
// Created: 10/13/2016
// Last Updated: 11/22/2016
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
  "totalLvls" : 1,
  "lives" : 3,
  "complete" : false,
  "continue" : false,
  "spacePressed" : 0,
  "initialContact" : false,
  "jump" : 1,
  "xKeySpeed" : 15,
  "yKeySpeed" : 20,
  "startX" : 10,
  "nScale" : 1,
  "bgScale" : 1,
  "nScaled" : false,
  "bgScaled" : false,
  outcome : {
    "win" : false,
    "lose" : false,
    "accuracy" : 0,
    "theoretical" : 0
  },
  reset : {
    arena1 : true
  }
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
  var _building1 = new object ("img/building1.svg", 452, 179);
  var _building2 = new object ("img/target.svg", 150, 300);
  var _background = new object ("img/BG.svg", 800, 400);

  screen.prototype.pseudoCamera(0, game.startX);
}

screen.prototype.arena1 = function (outcome)
{
  if (game.reset.arena1)
  {
    _building1.yPos = game.height - 150;
    _building1.xPos = -300;
    _building1.simX = _building1.xPos;
    _building1.simVelocity.x = 0;
    _building1.velocity.x = 0;
    _building1.velocity.y = 0;
    _building1.name = "b1";

    _building2.yPos = game.height - 75;
    _building2.xPos = 500;
    _building2.simX = _building2.xPos;
    _building2.simVelocity.x = 0;
    _building2.velocity.x = 0;
    _building2.velocity.y = 0;
    _building2.kineticFriction = 0.5;
    _building2.name = "b2";

    _background.yPos = 0;
    _background.xPos = -50;
    _background.simX = 0;
    _background.simVelocity.x = 0;
    _background.velocity.x = 0;
    _background.name = "bg";

    ninja.simX = 50;
    ninja.xPos = 50;
    ninja.yPos = _building1.tY - ninja.height;
    ninja.velocity.x = 0;
    ninja.simVelocity.x = 0;
    ninja.velocity.y = 0;

    // only execute once
    game.reset.arena1 = false;
  }
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
  this.drawObject (_building1, -30, -15, drawN);
  this.drawObject (_building2, 0, -18, drawN);
  this.drawObject (_background, 0, 0, drawBG);

  // **Begin Line Drawing to Target**
  var scr2RX = _building2.xPos + _building2.width;
  var scrNRX = ninja.xPos + ninja.width;

  // distance away from right side of ninja
  var xGap = 40;

  // only show line if not already at target
  if (scrNRX <= _building2.xPos -15 || ninja.xPos >= scr2RX)
  {
  // (x,y) of beginning path of line
  var startLine = {x: ninja.xPos + ninja.width + xGap,
                   y: ninja.yPos + ninja.height/2};

  nCtx.fillStyle = "white";
  nCtx.font = "15px Verdana";

  // if the ninja is past the target, make sure line and text is on left
  if (ninja.xPos >= scr2RX)
  {
    var distance = (_building2.lX + _building2.width/2) - ninja.rX;
    distance = Math.round(distance)/10;

    // change the gap between ninja and line if distance has a decimal
    if (distance % 1 != 0)
      xGap = 55;

    // change start x to left of ninja
    startLine.x = ninja.xPos - xGap - 20;
    nCtx.fillText(distance + "m", ninja.xPos - 15 - xGap, ninja.yPos + ninja.height/2);
  }
  // if ninja isn't to target yet, draw line and text on right
  else
  {
    var distance = (_building2.lX + _building2.width/2) - ninja.rX;
    distance = Math.round(distance)/10; // 10 px = 1 m

    if (distance % 1 != 0.0)
      xGap = 55;

    // make sure start line is to right of ninja and has possibly adjust xGap
    startLine.x = ninja.xPos + ninja.width + xGap;
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

  // **End Line Drawing to Target**

  ninja.elasticity = 0.1;
  ninja.acceleration.y = 15;
  kinematic (_building1, game.fps);
  kinematic (_building2, game.fps);
  kinematic (_background, game.fps);

  kinematic.prototype.detectCollision (ninja, _building1, game.fps);
  kinematic.prototype.detectCollision (ninja, _building2, game.fps);

  if (ninja.yPos >= game.height)
    outcome.lose = true;
  if (ninja.contact && ninja.contactSrc == "b2" && ninja.interact == 3)
  {
    outcome.win = true;
    outcome.accuracy = (Math.abs((_building2.simX+_building2.width/2)/10-
                            (ninja.simX+ninja.width/2)/10));
    outcome.theoretical = _building2.simX + _building2.width/2;
  }
}

screen.prototype.displayLives = function (rLives)
{
  var remaining = "";
  for (var i = 0; i < rLives; i++)
    remaining += "+";
  nCtx.font = "bold 20px Verdana";
  nCtx.fillStyle = "red";
  var lengthR = nCtx.measureText(remaining).width;
  nCtx.fillText(remaining, game.width - lengthR, 15);
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
      this.arena1(game.outcome);
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

  // call win/lose functions
  if (game.outcome.lose)
  {
    this.lost();
  }
  else if (game.outcome.win)
    this.won(game.outcome.accuracy, game.outcome.theoretical);

  this.displayLives(game.lives);

  physpane();
}

screen.prototype.won = function(acc, thr)
{
  game.complete = true;

  nCtx.font = "30px Verdana";
  var winTxt = "You Passed the Level!";
  var wWin = nCtx.measureText(winTxt).width;

  nCtx.fillStyle = "white";
  var brdr = 20;
  var txtH = 20;
  nCtx.fillRect(game.width/2 - wWin/2 - brdr, game.height/2 - txtH - brdr,
                wWin + 2*brdr, txtH + 25 + 2*brdr);

  nCtx.fillStyle = "blue";
  nCtx.fillText(winTxt, game.width/2 - wWin/2, game.height/2);
  nCtx.font = "12px Verdana";

  nCtx.fillStyle = "black";
  acc *= 10;
  var err = (acc/thr) * 100;
  var dstOff = "Distance Off: " + Math.round(acc)/10 + "m  Percent Error: " +
               Math.round(err)/100 + "%";
  var dstW = nCtx.measureText(dstOff).width;
  nCtx.fillText(dstOff, game.width/2 - dstW/2, game.height/2 + 20);

  var spc = "Press Space to Continue.";
  var spcW = nCtx.measureText(spc).width;
  nCtx.fillText(spc, game.width/2 - spcW/2, game.height/2 + 40);

  this.pseudoCamera(0);
  ninja.simVelocity.x = 0;
  ninja.velocity.x = 0;
  ninja.acceleration.x = 0;

  if (game.totalLvls - game.level <= 0)
  {
    nCtx.clearRect(0, 0, game.width, game.height);
    bgCtx.fillStyle = "white";
    bgCtx.fillRect(0, 0, game.width, game.height);

    var gmWn = "YOU WON!!!";
    nCtx.fillStyle = "lightblue";
    nCtx.font = "bold 50px Verdana";
    var wTxt = nCtx.measureText(gmWn).width;
    nCtx.fillText(gmWn, game.width/2 - wTxt/2, game.height/2);

    nCtx.fillStyle = "black";
    nCtx.font = "12px Verdana";

    nCtx.fillText(dstOff, game.width/2 - dstW/2, game.height/2 + 20);

    var cnt = "Press Space to Play Again.";
    var wCnt = nCtx.measureText(cnt).width;
    nCtx.fillText(cnt, game.width/2 - wCnt/2, game.height/2 + 40);
  }

  if (game.continue)
  {
    if (game.totalLvls - game.level > 0)
    {
      ++game.level;
      game.complete = false;
      game.outcome.win = false;
      game.continue = false;
    }
    else
    {
      game.reset.arena1 = true;
      game.complete = false;
      game.outcome.win = false;
      game.continue = false;
      game.lives = 3;
      game.level = 1;
      this.displayLives(game.lives);
    }
  }
}

screen.prototype.lost = function ()
{
  nCtx.font = "60px Verdana";
  var losingTxt = "You Died!";
  var widthTxt = nCtx.measureText(losingTxt).width;

  nCtx.fillStyle = "black";
  var brdr = 20;
  var txtH = 40;
  nCtx.fillRect(game.width/2 - widthTxt/2 - brdr, game.height/2 - txtH - brdr,
                widthTxt + 2*brdr, txtH + 10 + 2*brdr);

  nCtx.fillStyle = "red";
  nCtx.fillText(losingTxt, game.width/2 - widthTxt/2, game.height/2);
  nCtx.font = "12px Verdana";

  nCtx.fillStyle = "white";
  var spc = "Press Space to Restart Level.";
  var spcW = nCtx.measureText(spc).width;
  nCtx.fillText(spc, game.width/2 - spcW/2, game.height/2 + 20);

  if (!game.complete)
  {
    game.lives -= 1;
    game.complete = true;
  }
  this.pseudoCamera(0);
  ninja.simVelocity.x = 0;
  ninja.velocity.x = 0;
  ninja.acceleration.x = 0;

  if (game.lives <= 0)
  {
    nCtx.clearRect(0, 0, game.width, game.height);
    bgCtx.fillStyle = "black";
    bgCtx.fillRect(0, 0, game.width,game.height);

    var gmOvr = "GAME OVER!!!";
    nCtx.fillStyle = "red";
    nCtx.font = "bold 30px Verdana";
    var wTxt = nCtx.measureText(gmOvr).width;
    nCtx.fillText(gmOvr, game.width/2 - wTxt/2, game.height/2);

    nCtx.fillStyle = "white";
    nCtx.font = "12px Verdana";
    var cnt = "Press Space to Restart.";
    var wCnt = nCtx.measureText(cnt).width;
    nCtx.fillText(cnt, game.width/2 - wCnt/2, game.height/2 + 20);
  }

  if (game.continue)
  {
    if (game.lives > 0)
    {
      if (game.level == 1)
        game.reset.arena1 = true;

      game.complete = false;
      game.outcome.lose = false;
      game.continue = false;
    }
    else
    {
      game.reset.arena1 = true;
      game.complete = false;
      game.outcome.lose = false;
      game.continue = false;
      game.lives = 3;
      game.level = 1;
      this.displayLives(game.lives);
    }
  }
}

screen.prototype.keys = function (evt)
{
  switch (evt.keyCode)
  {
    case key.left:
      if (ninja.contact && !game.complete)
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
      if (ninja.contact && !game.complete)
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
      if (!game.complete)
      {
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
      }
      else
      {
          game.continue = true;
      }
      evt.preventDefault();
      break;
  }
}
  Game.screen = screen;
})();
