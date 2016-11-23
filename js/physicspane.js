// physicspane.js
// Ryan Stonebraker
// 11/23/2016
// Pane displaying relevant physics occuring onscreen

var context;
var cvs;

var physBG = {
  img : new Image(),
  source : 'img/paneBG.jpg'
}
var save = {
  "tmPass" : 0,
  "aI" : 0
}
physBG.img.src = physBG.source;

function physpane (level, relevant)
{
  var cvs = document.getElementById("physicsCanvas");
  if (cvs.getContext)
  {
    context = cvs.getContext("2d");
  }
  physpane.prototype.update_Physics(level, relevant);
}

physpane.prototype.update_Physics = function (lvl, rel)
{
  context.clearRect(0, 0, 400, 150);
  context.drawImage(physBG.img, 0, 0);

  switch (lvl)
  {
    case 1:
    physpane.prototype.level1(rel);
      break;
  }
}

physpane.prototype.level1 = function(rel)
{
  var tpX = 20;
  var tpY = 30;
  var htTxt = 15;
  context.fillStyle = "black";
  context.font = "12px Verdana";

  if (rel.lives > 1)
    var objective = "Objective: Reach the Target in " + rel.lives + " Tries.";
  else
    var objective = "Objective: Reach the Target in " + rel.lives + " Try.";
  context.fillText(objective, tpX, tpY);

  var eq = "Equations: X = Vit + 1/2at^2, Vf^2 = Vi^2 + 2aX"
  tpY += htTxt;
  context.fillText(eq, tpX, tpY);

  if (rel.ninjaToTarget)
    var dist = "Distance to Target: " + rel.ninjaToTarget + "m";
  else
    var dist = "Distance to Target: AT TARGET";
    tpY += htTxt;
  context.fillText(dist, tpX, tpY);

  if (rel.ninja.simX < rel.b1.rX)
  {
    var distEdge = Math.abs((rel.ninja.simX + rel.ninja.width/2) - rel.b1.rX);
    distEdge = Math.round(distEdge)/10;
    var nToE = "Distance to Edge: " + distEdge + "m";
    tpY += htTxt;
    context.fillText(nToE, tpX, tpY);
  }
  /*var avgAccel = save.aI;
  if (rel.numTicks % 10 == 0)
    avgAccel = (rel.ninja.acceleration.x/10 + save.aI)/2;
  if (rel.numTicks % 5 == 0)
    save.aI = rel.ninja.acceleration.x/10;
    */
  if (rel.ninja.acceleration.x > 0.5)
    var avgAccel = rel.keyAcc/10;
  else if (rel.ninja.acceleration.x < -0.5)
    var avgAccel = -rel.keyAcc/10;
  else
    var avgAccel = 0;

    // pseudo acceleration
  var accelN = "Ninja's X Acceleration: " + avgAccel + "m/s^2";
  tpY += htTxt;
  context.fillText(accelN, tpX, tpY);

  var disYAccel = "Ninja's Y Acceleration: -" + rel.ninja.acceleration.y/10 + "m/s^2";
  tpY += htTxt;
  context.fillText(disYAccel, tpX, tpY);

  var nVelX = "Ninja's X Velocity: " + Math.round(rel.ninja.simVelocity.x)/10 + "m/s";
  tpY += htTxt;
  context.fillText(nVelX, tpX, tpY);
  if (rel.ninja.bY <= rel.target.yPos)
  {
    var nYHt = "Distance Above Target: " + Math.round(rel.target.yPos - rel.ninja.bY)/10 + "m";
    tpY += htTxt;
    context.fillText(nYHt, tpX, tpY);
  }
}
