
var ww = window.innerWidth 
var wh = window.innerHeight *0.95
console.log("width: " + ww + " height: " + wh)
var mouseX_c,mouseY_c
var mouse = {x: 0, y: 0}
var cssscale
var scaleslider
var playerCount = 1500
var playerList = []
var prevtime = 0
var currtime = 0
var changing = false


class Particle {
  constructor(x, y) {
    this.color = color(random(255), random(255), random(255))
    this.x = x
    this.y = y
    this.vx = 0
    this.vy = 0
    this.ax = 0
    this.ay = 0
    this.prev = {x: x, y: x}
    this.prev2 = {x: x, y: x}
    this.dampen = random(0.95,0.99)
  }
  resetOffScreen(){
    this.vy = 0
    this.vx = 0
    this.prev = {}
    this.prev2 = {}
    if (random(1) > 0.5){
      if (random(1) > 0.5){this.y = random(-200,0); this.x = random(0,ww)}
      else{this.y = random(wh,wh+200); this.x = random(0,ww)}

    }else{
      if (random(1) > 0.5){this.x = random(-200,0); this.y = random(0,wh)}
      else{this.x = random(ww,ww+200); this.y = random(0,wh)}
    }
  }
  update() {
    this.vx += this.ax
    this.vy += this.ay
    this.x += this.vx
    this.y += this.vy
    this.vx *= this.dampen
    this.vy *= this.dampen
    if (this.x > ww + 200 || this.x < -200 || this.y > wh + 200 || this.y < -200){this.resetOffScreen()}
    if(frameCount % 2 == 0){
      this.prev2 = this.prev
      this.prev = {x: this.x, y: this.y}
    }
  }
  draw() {  
    push()
    stroke(this.color)
    fill(255)
    circle(this.x, this.y, 3)
    pop()
  }
  drawTrails(){
    push()
    strokeWeight(3)
    stroke(this.color, 75)
    line(this.x, this.y, this.prev.x, this.prev.y)
    strokeWeight(1)
    line(this.prev.x, this.prev.y, this.prev2.x, this.prev2.y)
    pop()
  }
  calculateAcceleration() {
    let dx = mouse.x - this.x
    let dy = mouse.y - this.y
    let angle = atan2(dy, dx) + random(-0.05,0)
    let distance = sqrt(dx * dx + dy * dy)
    let force = 200 / distance**1.1
    if (force > 2) force = 2
    this.ax = (cos(angle) * force)+random(-0.05,0.05)  
    this.ay = (sin(angle) * force)+random(-0.05,0.05)
    if(!mouseIsPressed){}else{this.ax = -this.ax*5; this.ay = -this.ay*5}
  }
  play(){
    this.calculateAcceleration()
    this.update()
    this.draw()
    this.drawTrails()
  }
}

// function drawTrails() {
//   push()
//   strokeWeight(3)
//   for (let i in playerList) {
//     stroke(playerList[i].color, 75)
//     line(playerList[i].x, playerList[i].y, playerList[i].prev.x, playerList[i].prev.y)
//     strokeWeight(1)
//     line(playerList[i].prev.x, playerList[i].prev.y, playerList[i].prev2.x, playerList[i].prev2.y)
//   }
//   pop()
// }




function precalculateMouseCoordinates(){
  cssscale = parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--zoomscale'))
  document.documentElement.style.setProperty('--zoomscale', zoomslider.value())
  mouseX_c = mouseX / cssscale
  mouseY_c = mouseY / cssscale
  if (mouseX_c > ww) mouseX_c = ww
  if (mouseX_c < 0) mouseX_c = 0
  if (mouseY_c > wh) mouseY_c = wh
  if (mouseY_c < 0) mouseY_c = 0
  mouse.x = mouseX_c
  mouse.y = mouseY_c

}

function windowResized() {
  ww = window.innerWidth *0.8
  wh = window.innerHeight *0.8
  resizeCanvas(ww, wh);
}

function resetAndChangePlayerCount(){
  changing = true 
  playerCount = playerslider.value()
  playerList = []
  for (let i = 0; i < playerCount; i++) {
    let p = new Particle(random(ww), random(wh))
    playerList.push(p)
  }
}
function mouseReleased(){
  if (changing == true){
  resetAndChangePlayerCount()
  changing = false}}

function setup() {
  for (let i = 0; i < playerCount; i++) {
    let p = new Particle(random(ww), random(wh))
    playerList.push(p)
  }
  console.log(playerList)
  createCanvas(ww, wh)
  frameRate(60)
  cssscale = parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--zoomscale'))
  zoomslider = createSlider(0.01,2,cssscale,0.01)
  playerslider = createSlider(1,1500,playerCount,1)
  playerslider.mousePressed(resetAndChangePlayerCount)
  textSize(20)
  fill(235)
  strokeWeight(1)
}




function draw() {
  background(10)
  precalculateMouseCoordinates()
  for (i in playerList){
    if (changing == true) {playerList[i].draw()}else{
    playerList[i].play()}}

  prevtime = currtime
  currtime = Date.now()
  let fps = 1000/(currtime-prevtime)
  text("fps: " + fps.toFixed(2), 10, 30)
  text("Particles: " + playerCount, 10, 60)

}5
