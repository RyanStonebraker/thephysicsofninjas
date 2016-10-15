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
}
