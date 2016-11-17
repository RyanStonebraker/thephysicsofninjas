// kinematics.js
// Ryan Stonebraker
// Created 11/10/2016
// Last Updated: 11/17/2016
// kinematic functions integrated with game.js

// "object" on screen for collision detection and sprites
var object = function (imgSrc, width, height) {
  var prop = this;

  prop.name = "";
  prop.img = new Image ();
  if (imgSrc)
    prop.img.src = imgSrc;
  prop._xPos = 0;
  prop._yPos = 0;
  prop._angle = 0;
  prop.width = width;
  prop.height = height;
  prop.hyp = Math.sqrt((width*width)/4 + (height*height)/4);
  prop.localRad = Math.atan(height/width);

  prop.update = function() {
    prop.rads = prop._angle * Math.PI/180;
    prop.xMid = prop._xPos + width/2;
    prop.yMid = prop._yPos + height/2;
    prop.bR = {x: 0, y: 0};
    prop.bR.x = prop.xMid + prop.hyp * Math.cos(prop.localRad - prop.rads);
    prop.bR.y = prop.yMid + prop.hyp * Math.sin(prop.localRad - prop.rads);
    prop.tR = {x: 0, y: 0};
    prop.tR.x = prop.xMid + prop.hyp * Math.cos(prop.localRad + prop.rads);
    prop.tR.y = prop.yMid - prop.hyp * Math.sin(prop.localRad + prop.rads);
    prop.tL = {x: 0, y: 0};
    prop.tL.x = prop.xMid - prop.hyp * Math.cos(prop.localRad - prop.rads);
    prop.tL.y = prop.yMid - prop.hyp * Math.sin(prop.localRad - prop.rads);
    prop.bL = {x: 0, y: 0};
    prop.bL.x = prop.xMid - prop.hyp * Math.cos(prop.localRad + prop.rads);
    prop.bL.y = prop.yMid + prop.hyp * Math.sin(prop.localRad + prop.rads);
  }

  Object.defineProperty (prop, 'angle', {
    get: function () { return prop._angle; },
    set: function (v) {
      prop._angle = v;
      prop.update(); }
  });

  Object.defineProperty (prop, 'xPos', {
    get: function () { return prop._xPos; },
    set: function (v) {
      prop._xPos = v;
      prop.update(); }
  });

  Object.defineProperty (prop, 'yPos', {
    get: function () { return prop._yPos; },
    set: function (v) {
      prop._yPos = v;
      prop.update(); }
  });

  prop.update();

  prop.elasticity = 0;
  prop.velocity = {x: 0, y: 0};
  prop.simVelocity = {x: 0};
  prop.acceleration = {x: 0, y: 0};
  prop.aTimeLeft = -1; // -1 to keep accelerating until something changes
  prop.contact = false;
  prop.contactSrc = "none";
  prop.interact = 3;
  prop.kineticFriction = 0.05;
}

function kinematic (objA, fps)
{
  var rnd = 1000;
  var _perUpdate = fps/1000;
  kinematic.prototype.accelerate (objA, _perUpdate);
  kinematic.prototype.moveObj (objA, _perUpdate);

  // no need to calculate nonvisible changes
  if (Math.abs(objA.simVelocity.x) < 0.05)
    objA.simVelocity.x = 0;
  if (Math.abs(objA.velocity.x) < 0.05)
    objA.velocity.x = 0;
  if (Math.abs(objA.velocity.y) < 0.05)
    objA.velocity.y = 0;
}

kinematic.prototype.accelerate = function (object, _perUpdate)
{
  if (object.aTimeLeft == -1)
  {
    object.simVelocity.x += object.acceleration.x * _perUpdate;
    object.velocity.x += object.acceleration.x * _perUpdate;
    object.velocity.y += object.acceleration.y * _perUpdate;
  }

  if (object.aTimeLeft > 0)
  {
      object.simVelocity.x += object.acceleration.x * _perUpdate;
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

kinematic.prototype.moveObj = function (object, _perUpdate)
{
  object.xPos += object.velocity.x * _perUpdate;
  object.yPos += object.velocity.y * _perUpdate;
}

kinematic.prototype.detectCollision = function (obj1, obj2, fps)
{
  var _perUpdate = fps/1000;
  var mrgn = 0.5; // compensate for slight inaccuracies in computer calculations

  // no rotation bounds
  var rightSide = (obj1.tR.x + mrgn >= obj2.tL.x && obj1.tR.x - mrgn <= obj2.tR.x);
  var top = (obj1.tR.y - mrgn <= obj2.bR.y && obj1.tR.y + mrgn >= obj2.tR.y);
  var leftSide = (obj1.tL.x - mrgn <= obj2.tR.x && obj1.tL.x + mrgn >= obj2.tL.x);
  var bottom = (obj1.bR.y + mrgn >= obj2.tR.y && obj1.bR.y - mrgn <= obj2.bR.y);

  // 0 = rightSide, 1 = top, 2 = leftSide, 3 = bottom
  if ((rightSide || leftSide) && (top || bottom))
  {
    if (obj1.bL.y - 5 < obj2.tL.y)
      obj1.interact = 3;
    else if (obj1.tL.x +5 > obj2.tR.x)
        obj1.interact = 2;
    else if (obj1.bR.x -5 < obj2.bL.x)
      obj1.interact = 0;
    else if (obj1.tR.y +5 > obj2.bR.y)
      obj1.interact = 1;
    kinematic.prototype.conserveMomentum (obj1, obj2, _perUpdate);
    obj1.contactSrc = obj2.name;
  }
  else
  {
    if (obj1.contactSrc == obj2.name)
    {
      obj1.contactSrc = "none";
      obj1.contact = false;
    }
  }
}

kinematic.prototype.conserveMomentum = function (obj1, obj2, _perUpdate)
{
  var side = obj1.interact;

  if (!obj1.contact)
  {
    if (side == 0)
    {
      obj1.simVelocity.x *= -obj1.elasticity;
      obj1.velocity.x *= -obj1.elasticity;
      obj1.xPos = obj2.bL - obj1.width;
    }
    else if (side == 1)
    {
      obj1.velocity.y *= -obj1.elasticity;
      obj1.yPos = obj2.bL.y;
    }
    else if (side == 2)
    {
      obj1.simVelocity.x *= -obj1.elasticty;
      obj1.velocity.x *= -obj1.elasticity;
      obj1.xPos = obj2.tR.x;
    }
    else if (side == 3)
    {
      obj1.velocity.x -= obj1.velocity.x * obj2.kineticFriction;
      obj1.simVelocity.x -= obj1.simVelocity.x * obj2.kineticFriction;
      if (obj1.velocity.y > 0)
        obj1.velocity.y *= -obj1.elasticity;
      obj1.yPos = obj2.tR.y - obj1.height;
    }
  }
  else if (side == 3)
  {
    obj1.velocity.x -= obj1.simVelocity.x * obj2.kineticFriction;
    obj1.simVelocity.x -= obj1.simVelocity.x * obj2.kineticFriction;
  }

  obj1.contact = true;
  obj1.acceleration.y -= obj1.acceleration.y;
}
