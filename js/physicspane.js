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
  context.fillStyle = "black";
  context.font= "20px Times";
  context.fillText("X Position: " + ninja.position.x, 0, 20);
  context.fillText("Y Position: " + adjustPosY, 0, 45);
  context.fillText("X Force: " + ninja.net_force.x, 0, 70);
  context.fillText("Y Force: " + adjustNetY, 0, 95);
}
