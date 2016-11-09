// physicspane.js
// Ryan Stonebraker
// 10/13/2016
// Pane displaying relevant physics occuring onscreen

var context;
var cvs;

function physpane ()
{
  var cvs = document.getElementById("physicsCanvas");
  if (cvs.getContext)
  {
    context = cvs.getContext("2d");
    context.fillStyle = "gray";
    context.fillRect(0, 0, 400, 150);
  }

  display_Position ();
}

function display_Position ()
{
  var adjustNetY = -ninja.net_force.y;
  var adjustPosY = -(ninja.position.y - (game.height - ninja.height));
  adjustPosY = +adjustPosY.toFixed(2);
  var adjustVelY = -ninja.velocity.y;
  adjustVelY = +adjustVelY.toFixed(2);
  context.fillStyle = "black";
  context.font= "20px Times";
  context.fillText("X Position: " + ninja.position.x + " meters", 0, 20);
  context.fillText("Y Position: " + adjustPosY + " meters", 0, 45);
  context.fillText("X Force: " + ninja.net_force.x + " Newtons", 0, 70);
  context.fillText("Y Force: " + adjustNetY + " Newtons", 0, 95);
  context.fillText("X Velocity: " + ninja.velocity.x + " m/s", 0, 120);
  context.fillText("Y Velocity: " + adjustVelY + " m/s", 0, 145);
}
