// simple_physics_engine.js
// Ryan Stonebraker
// Created 10/16/2016
//

function normal (object)
{
  return object.mass*object.gravityConst*Math.cos(object.rads) + object.applied_force;
}
function gravity (object)
{
  return object.mass*(-object.gravityConst);
}

function acceleration_from_force (object)
{
  object.acceleration.x = object.net_force.x/object.mass;
  object.acceleration.y = object.net_force.y/object.mass;
}

function velocity_from_acceleration (object, time)
{
  // Vf^2 = Vi^2 - 2aX
  // X = Vi*t + 1/2at^2
  // Vf = vi + at
  object.velocity.x = object.acceleration.x * time;
  object.velocity.y = object.acceleration.y * time;
}

function position_from_velocity (object, time)
{
  object.position.x += object.velocity.x * time;
  object.position.y += object.velocity.y * time;
}

function move (object, time)
{

  acceleration_from_force (object);
  velocity_from_acceleration (object, time);
  position_from_velocity (object, time);
}

function arena1 (object)
{
  object.multiplier = 2; // jumping multiplier
  object.gravityConst = 10; // acceleration due to gravity on earth

  var force1 = gravity(object); // add gravity force
  var force2 = 0;
  if (object.contact == true)
    force2 = normal(object); // add normal force if in contact w/something
  netforceY = -(force1 + force2);

    console.log("Gravity: " + force1);
    console.log("Normal: " + force2);


  object.net_force.y = netforceY; // add forces together
}
