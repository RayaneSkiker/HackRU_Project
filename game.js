let right = false;
let left = false;
let up = false;
let down = false;

let xPos = 280;
let yPos = 280;
let speed = 2;

let passXPos;
let passYPos;

let locXPos;
let locYPos;

let passCount = 0;

function setup() {
  createCanvas(600, 600);
  passXPos = random(30, 570);
  passYPos = random(30, 570);
  locXPos = random(30, 570);
  locYPos = random(30, 570);
}

function draw() {
  background(200);
  
  fill(color('green'));
  rect(passXPos, passYPos, 20);
  
  if(passCount > 0){
    fill(color('red'));
    circle(locXPos, locYPos, 20);
  }
  
  fill(color('white'));
  rect(xPos, yPos, 20);
  
  if(xPos + 20 + speed > passXPos && xPos + speed < passXPos + 20 && yPos + 20 > passYPos && yPos < passYPos + 20){
    passXPos = random(30, 570);
    passYPos = random(30, 570);
    passCount++;
  }
  
  if(xPos + 20 + speed > locXPos && xPos + speed < locXPos + 20 && yPos + 20 > locYPos && yPos < locYPos + 20){
    locXPos = random(30, 570);
    locYPos = random(30, 570);
    passCount--;
  }
  
  
  if(up){
    yPos -= speed;
  }
  
  if(down){
    yPos += speed;
  }
  
  if(left){
    xPos -= speed;
  }
  
  if(right){
    xPos += speed;
  }
  
  fill(color('black'));
  textSize(10);
  text('Passengers on Board: ' + passCount, 10, 20);
  
}

function keyPressed(){
  if(key == 'w' && down == true){
    
  }
  
  else if(key == 'w'){
    up = true;
    down = false;
    left = false;
    right = false;
  }
  
  if(key == 'a' && right == true){
    
  }
  else if(key =='a'){
    left = true;
    up = false;
    down = false;
    right = false;
  }
  
  if(key == 's' && up == true){
    
  }
  else if(key == 's'){
    down = true;
    up = false;
    left = false;
    right = false;
  }
  
  if(key == 'd' && left == true){
    
  }
  else if(key =='d'){
    right = true;
    up = false;
    down = false;
    left = false;
  }
}