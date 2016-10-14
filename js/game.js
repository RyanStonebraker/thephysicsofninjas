// game.js
// Ryan Stonebraker
// 10/13/2016
// A Ninja performs simple physics in an interactive physics-demonstrating game.

var ctx;
var canvas;

function game ()
{
  canvas = document.getElementById("gameCanvas");

  if (canvas.getContext)
  {
    ctx = canvas.getContext("2d");

    ctx.fillStyle= "white";
    ctx.fillRect(0, 0, 400, 250);
  }
}
