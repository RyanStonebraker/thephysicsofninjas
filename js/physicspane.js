// physicspane.js
// Ryan Stonebraker
// 10/13/2016
// Pane displaying relevant physics occuring onscreen

var ctx;
var canvas;

function physpane ()
{
  var canvas = document.getElementById("physicsCanvas");
  if (canvas.getContext)
  {
    ctx = canvas.getContext("2d");

    ctx.fillStyle = "gray";

    ctx.fillRect(0, 0, 400, 150);
  }
}
