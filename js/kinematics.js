// kinematics.js
// Ryan Stonebraker
// Created 11/10/2016
// Last Updated: 11/12/2016
// kinematic functions integrated with game.js


// "object" on screen for collision detection and sprites
var object = function (imgSrc, width, height) {
  if (!imgSrc)
    console.log ("NO IMAGE:");

  this.img = new Image ();
  this.img.src = imgSrc;
  this._xPos = 0;
  this._yPos = 0;
  this._angle = 0;
  this.hyp = Math.sqrt((width*width)/4 + (height*height)/4);
  this.localRad = Math.atan(height/width);

  this.update = function() {
    this.rads = this._angle * Math.PI/180;
    this.xMid = this._xPos + width/2;
    this.yMid = this._yPos + height/2;
    this.bR = {x: 0, y: 0};
    this.bR.x = this.xMid + this.hyp * Math.cos(this.localRad - this.rads);
    this.bR.y = this.yMid + this.hyp * Math.sin(this.localRad - this.rads);
    this.tR = {x: 0, y: 0};
    this.tR.x = this.xMid + this.hyp * Math.cos(this.localRad + this.rads);
    this.tR.y = this.yMid - this.hyp * Math.sin(this.localRad + this.rads);
    this.tL = {x: 0, y: 0};
    this.tL.x = this.xMid - this.hyp * Math.cos(this.localRad - this.rads);
    this.tL.y = this.yMid - this.hyp * Math.sin(this.localRad - this.rads);
    this.bL = {x: 0, y: 0};
    this.bL.x = this.xMid - this.hyp * Math.cos(this.localRad + this.rads);
    this.bL.y = this.yMid + this.hyp * Math.sin(this.localRad + this.rads);
  }

  Object.defineProperty (this, 'angle', {
    get: function () { return this._angle; },
    set: function (v) {
      this._angle = v;
      this.update(); }
  });

  Object.defineProperty (this, 'xPos', {
    get: function () { return this._xPos; },
    set: function (v) {
      this._xPos = v;
      this.update(); }
  });

  Object.defineProperty (this, 'yPos', {
    get: function () { return this._yPos; },
    set: function (v) {
      this._yPos = v;
      this.update(); }
  });

  this.update();

  this.velocity = {x: 0, y: 0};
  this.acceleration = {x: 0, y: 0};
  this.aTimeLeft = -1; // -1 to keep accelerating until something changes
}

function kinematic (object, fps)
{
  kinematic.prototype.accelerate (object, fps);
  kinematic.prototype.moveObj (object, fps);
  // TODO implement collision detection between objects AND surfaces
  //this.detectCollision (object, fps);
}

kinematic.prototype.accelerate = function (object, fps)
{
  var _perUpdate = fps/1000;

  if (object.aTimeLeft == -1)
  {
    object.velocity.x += object.acceleration.x * _perUpdate;
    object.velocity.y += object.acceleration.y * _perUpdate;
  }

  if (object.aTimeLeft > 0)
  {
      object.velocity.x += object.acceleration.x * _perUpdate;
      object.velocity.y += object.acceleration.y * _perUpdate;
      object.aTimeLeft -= _perUpdate;
      if (object.aTimeLeft - _perUpdate <= _perUpdate)
        object.aTimeLeft = 0;
  }

  if (object.aTimeLeft == 0)
  {
    object.acceleration.x = 0;
    object.acceleration.y = 0;
    object.aTimeLeft = -1; // reset to default
  }
}

kinematic.prototype.moveObj = function (object, fps)
{
  var _perUpdate = fps/1000;

  object.xPos += object.velocity.x * _perUpdate;
  object.yPos += object.velocity.y * _perUpdate;
}
