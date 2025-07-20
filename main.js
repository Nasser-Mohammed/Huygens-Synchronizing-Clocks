
// Three-body simulation with simple Euler integration

let ctx;
const dt = 0.01;
let frameCount = 0;
let simulationTime = 0;
let animationId = null;
let running = false;
let width;
let height;
let isDragging = false;
let bodies = [];
let cnt = 0;
let centerX;
let centerY;
let maxTrailLength = 900;
let stepsPerFrame = 500;
let defaultSteps = 500;

let clocks = [];

class Clock{
  constructor(theta, angularVelo, length, mass, x, y){
    this.theta = theta;
    this.angularVelo = angularVelo;
    this.length = length;
    this.mass = mass;
    this.x;
    this.y;
  }

  drawClock(){

  }
}


/*equations of motion:
For n pendulums, we have 4n first order ODEs
*/


function computeAcceleration(x, y, selfIndex) {
  let ax = 0;
  let ay = 0;

  for (let j = 0; j < bodies.length; j++) {
    if (j === selfIndex) continue;
    const other = bodies[j];

    const dx = other.stateVector.x - x;
    const dy = other.stateVector.y - y;
    const softening = maxPlanetSize * 4; // or 3x
    const distSq = dx * dx + dy * dy + softening * softening;
    const dist = Math.sqrt(distSq);



    const force = G * other.mass / (distSq * dist); // equivalent to Gm / r^3

    ax += force * dx;
    ay += force * dy;
  }

  return { ax, ay };
}

function clockUpdateRK4() {
  for (let i = 0; i < clocks.length; i++) {
    const p = clocks[i];
    const { x, y, Xvelocity: vx, Yvelocity: vy } = p.stateVector;

    // k1
    const a1 = computeAcceleration(x, y, i);
    const k1vx = a1.ax * dt;
    const k1vy = a1.ay * dt;
    const k1x = vx * dt;
    const k1y = vy * dt;

    // k2
    const a2 = computeAcceleration(x + k1x / 2, y + k1y / 2, i);
    const k2vx = a2.ax * dt;
    const k2vy = a2.ay * dt;
    const k2x = (vx + k1vx / 2) * dt;
    const k2y = (vy + k1vy / 2) * dt;

    // k3
    const a3 = computeAcceleration(x + k2x / 2, y + k2y / 2, i);
    const k3vx = a3.ax * dt;
    const k3vy = a3.ay * dt;
    const k3x = (vx + k2vx / 2) * dt;
    const k3y = (vy + k2vy / 2) * dt;

    // k4
    const a4 = computeAcceleration(x + k3x, y + k3y, i);
    const k4vx = a4.ax * dt;
    const k4vy = a4.ay * dt;
    const k4x = (vx + k3vx) * dt;
    const k4y = (vy + k3vy) * dt;

    // Final position and velocity update
    p.stateVector.x += (k1x + 2 * k2x + 2 * k3x + k4x) / 6;
    p.stateVector.y += (k1y + 2 * k2y + 2 * k3y + k4y) / 6;
    p.stateVector.Xvelocity += (k1vx + 2 * k2vx + 2 * k3vx + k4vx) / 6;
    p.stateVector.Yvelocity += (k1vy + 2 * k2vy + 2 * k3vy + k4vy) / 6;

    //console.log("new position: ", p.stateVector.x, ", ", p.stateVector.y);
  }
}


function euclideanDistance(x1, y1, x2, y2){
    return Math.sqrt((x2-x1)**2 + (y2-y1)**2);
}


function animate(){
  cnt++;
  if (cnt%280 === 0 || cnt >= 280){
    console.log("one month cycle");
    cnt = 0;
    multiplier++;
    if (multiplier < 12){
    document.getElementById("time-display").textContent = "Month: " + (Math.floor(multiplier)).toString();
    }
    else{
      if(Math.floor(multiplier/12) === 1){
        if (multiplier%12 === 1){
        document.getElementById("time-display").textContent = (Math.floor(multiplier/12)).toString() + " year and " + ((multiplier%12).toFixed()).toString() + " month";
        }
        else{
          document.getElementById("time-display").textContent = (Math.floor(multiplier/12)).toString() + " year and " + ((multiplier%12).toFixed()).toString() + " months";
        }
      }
      else{
        if (multiplier%12 ===1){
          document.getElementById("time-display").textContent = (Math.floor(multiplier/12)).toString() + " years and " + ((multiplier%12).toFixed()).toString() + " month";
        }
        else{
          document.getElementById("time-display").textContent = (Math.floor(multiplier/12)).toString() + " years and " + ((multiplier%12).toFixed()).toString() + " months";
        }
      }
    }
  }

    for (let i = 0; i < stepsPerFrame; i++) {
      clockUpdateRK4();
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

  drawClocks();
  //console.log("running......");
  animationId = requestAnimationFrame(animate);
}

function drawClocks(){
  for(let i = 0; i < clocks.length; i++){
    const clock = clocks[i];
    //console.log(planet.image.src);
    ctx.drawImage(
    );



  }
}

function drawSideSupports(){
  const supportWidth = 100;
  const leftX = 250;
  const supportY = 225;
  const rightX = width - leftX - supportWidth;

  const supportHeight = height - supportY;

  ctx.fillStyle = "#4B2E14";
  ctx.fillRect(leftX, supportY, supportWidth, supportHeight);
  ctx.fillRect(rightX, supportY, supportWidth, supportHeight);

}


function clocks2Simulation(xCoord, yCoord) {
    //convert canvas coords to x,y cartesian coords
    //we want x = 0 to correspond to width/2 (the middle, so our graph is centered in the middle of the canvas)

    let newX = xCoord - width/2;
    let newY = -yCoord + height/2;

    const body = {};
    // body.stateVector.x = newX;
    // body.stateVector.y = newY;
    // body.stateVector.Xvelocity = 0;
    // body.stateVector.Yvelocity = 0; 
    // body.mass = name2Mass.get(bodyName);
    clocks.push(body);
    //drawClocks();

}


function startSimulation() {
  animate();
}


function resetStates(){
  clocks = [];
  clocks2Simulation(0, 0, true);
  clocks2Simulation(0, 0, true);
  clocks2Simulation(0, 0, true);
}

function resetSimulation() {
  running = false;
  if (animationId !== null){
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  simulationTime = 0;
  frameCount = 0;
  stepsPerFrame = defaultSteps;
  const speedSlider = document.getElementById("speed-slider");
  const speedValue = document.getElementById("speed-value");
  speedSlider.value = Math.floor(defaultSteps/100);
  speedValue.textContent = speedSlider.value;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);
  resetStates();
  console.log('rewrote canvas');
  cnt = 0;
  multiplier = 1;
  document.getElementById("time-display").textContent = "Month: 1";
  document.getElementById("start-simulation").textContent = "Click to Start Simulation";
}


document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("simCanvas");
  ctx = canvas.getContext("2d");
  height = ctx.canvas.height;
  width = ctx.canvas.width;
  centerX = width/2;
  centerY = height/2
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);
  resetStates();
  drawSideSupports();

    document.getElementById("start-simulation").addEventListener("click", () => {
      const btn = document.getElementById("start-simulation");
      if (!running) {
        running = true;
        btn.textContent = "Pause";
        startSimulation();
      } else {
        running = false;
        cancelAnimationFrame(animationId);
        btn.textContent = "Resume";
      }
    });


  const speedSlider = document.getElementById("speed-slider");
  const speedValue = document.getElementById("speed-value");
  stepsPerFrame = Math.floor(parseInt(speedSlider.value)*100)

  speedSlider.addEventListener("input", () => {
    stepsPerFrame = Math.floor(parseInt(speedSlider.value)*100);
    speedValue.textContent = Math.floor(stepsPerFrame/100);
  });

  document.getElementById("reset").addEventListener("click", () => {
    resetSimulation();
  });
});