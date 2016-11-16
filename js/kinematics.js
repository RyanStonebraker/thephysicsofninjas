// kinematics.js
// Ryan Stonebraker
// Created 11/10/2016
// Last Updated: 11/15/2016
// kinematic functions integrated with game.js


// "object" on screen for collision detection and sprites
var object = function (imgSrc, width, height) {
  var prop = this;

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
  prop.acceleration = {x: 0, y: 0};
  prop.aTimeLeft = -1; // -1 to keep accelerating until something changes
  prop.contact = false;
}

function kinematic (objA, fps)
{
  var _perUpdate = fps/1000;
  kinematic.prototype.accelerate (objA, _perUpdate);
  kinematic.prototype.moveObj (objA, _perUpdate);
  // TODO implement collision detection between objects AND surfaces
  // NOTE use an elasticity variable for collisions thats unique to each
  // object surfaces should have 0 so they do not move, perfectly elastic = 1
  // to make a surface, make it same as regular object, just elasticity of 0
  // prop way it can be moved if necessary too.
  //if (object2)
  //  kinematic.prototype.detectCollision (object, object2, _perUpdate);
}

kinematic.prototype.accelerate = function (object, _perUpdate)
{
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

kinematic.prototype.moveObj = function (object, _perUpdate)
{
  object.xPos += object.velocity.x * _perUpdate;
  object.yPos += object.velocity.y * _perUpdate;
}

kinematic.prototype.detectCollision = function (obj1, obj2, fps)
{
  _perUpdate = fps/1000;
  // if obj1's top Left x is between obj2's top Left x and top Right x
  var tLx;
  var tRx;
  var bLx;
  var bRx;

  var tLy;
  var tRy;
  var bLy;
  var bRy;

  if (obj2.tL.x <= obj2.tR.x)
  {
    tLx = (obj1.tL.x >= obj2.tL.x && obj1.tL.x <= obj2.tR.x);
    tRx = (obj1.tR.x >= obj2.tL.x && obj1.tR.x <= obj2.tR.x);
    bLx = (obj1.bL.x >= obj2.tL.x && obj1.bL.x <= obj2.tR.x);
    bRx = (obj1.bR.x >= obj2.tL.x && obj1.bR.x <= obj2.tR.x);
  }
  else if (obj2.tL.x >= obj2.tR.x)
  {
    tLx = (obj1.tL.x <= obj2.tL.x && obj1.tL.x >= obj2.tR.x);
    tRx = (obj1.tR.x <= obj2.tL.x && obj1.tR.x >= obj2.tR.x);
    bLx = (obj1.bL.x <= obj2.tL.x && obj1.bL.x >= obj2.tR.x);
    bRx = (obj1.bR.x <= obj2.tL.x && obj1.bR.x >= obj2.tR.x);
  }

  if (obj1.bL.y >= obj2.tL.y)
  {
    tLy = (obj1.tL.y <= obj2.bL.y && obj1.tL.y >= obj2.tL.y);
    tRy = (obj1.tR.y <= obj2.bL.y && obj1.tR.y >= obj2.tL.y);
    bLy = (obj1.bL.y <= obj2.bL.y && obj1.bL.y >= obj2.tL.y);
    bRy = (obj1.bR.y <= obj2.bL.y && obj1.bR.y >= obj2.tL.y);
  }
  else if (obj1.bL.y >= obj2.tL.y)
  {
    tLy = (obj1.tL.y >= obj2.bL.y && obj1.tL.y <= obj2.tL.y);
    tRy = (obj1.tR.y >= obj2.bL.y && obj1.tR.y <= obj2.tL.y);
    bLy = (obj1.bL.y >= obj2.bL.y && obj1.bL.y <= obj2.tL.y);
    bRy = (obj1.bR.y >= obj2.bL.y && obj1.bR.y <= obj2.tL.y);
  }

/*  var nextObj1 = new object(0, obj1.width, obj1.height);
  nextObj1.xPos = obj1.xPos + obj1.velocity.x*_perUpdate;
  nextObj1.yPos = obj1.yPos + obj1.velocity.y*_perUpdate;

  var nextObj2 = new object(0, obj2.width, obj2.height);
  nextObj1.xPos = obj2.xPos + obj2.velocity.x*_perUpdate;
  nextObj1.yPos = obj2.yPos + obj2.velocity.y*_perUpdate;
*/


  if ((tLx || tRx || bLx || bRx) && (tLy || tRy || bLy || bRy))
    kinematic.prototype.conserveMomentum (obj1, obj2, _perUpdate);
  else
    obj1.contact = false;
}

kinematic.prototype.conserveMomentum = function (obj1, obj2, _perUpdate)
{
  if (obj1.contact == false)
  {
    obj1.velocity.y *= -obj1.elasticity;
    obj1.velocity.x *= -obj1.elasticity;
    obj2.velocity.y *= -obj2.elasticity;
    obj2.velocity.x *= -obj2.elasticity;

    // TODO fix so works for hitting object from x side too.
    if (obj1.yPos - obj1.velocity.y * _perUpdate <= obj2.yPos)
      obj1.yPos = obj2.yPos - obj1.height;
  }
  obj1.contact = true;
  obj1.acceleration.y -= obj1.acceleration.y;
}
