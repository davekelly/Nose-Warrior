/*
  =-. Nose Blaster .-=

  Something to keep my kids occupied during some 
  unexpected days off school.

  Created during ITP Camp, 2021
  David Kelly (davidkelly.ie | @davkell)

  Based in part on a session run by Yona (yonaymoris.com) 
  - https://itp.nyu.edu/camp2021/session/76

*/

let video;
let poseNet;
let poses = [];

let noseBullets = [];
let targets = [];


let speech;
let isDrawing = false;
let showOutOfBoundsMsg = true;

let game = {
  score: 0,
  maxTargets: 4,
  timeRemaining: 30,
  noseBulletMaxCount: 100,
  targetsDisplayed: 1,
  soundEffectFiles: [
      "audio/mixkit-animated-small-group-applause-523_01.mp3",
      "audio/mixkit-cartoon-monkey-applause-103_01.mp3",
      "audio/mixkit-football-team-applause-509_01.mp3",
      "audio/mixkit-girls-audience-applause-510_01.mp3"
  ],
  soundEffectsLoaded: []
}

function preload(){

  game.soundEffectFiles.forEach(function(sound){
    game.soundEffectsLoaded.push(
      loadSound(sound)
    );
  });

}

function setup() {
    let canvas = createCanvas(1080, 760);
    canvas.parent('game-screen');

    video = createCapture(VIDEO);
    video.size(width, height);

    // Create a new poseNet method with a single detection
    poseNet = ml5.poseNet(video, modelReady);
    // This sets up an event that fills the global variable "poses"
    // with an array every time new poses are detected
    poseNet.on("pose", function(results) {
        poses = results;
    });
    // Hide the video element, and just show the canvas
    video.hide();
    showOutOfBoundsMsg = true;

    speech = new p5.SpeechRec();
    speech.onResult = gotSpeech; // bind callback function to trigger when speech is recognized
    speech.start(true); // start listening
  
}

function modelReady() {
  console.log("model is ready");
}

function draw() {
  
  background(55);

  image(video, 0, 0, width, height);
  
  showNoseBullets();
  
  noseBullets.forEach(function(noseBullet){
    noStroke();
    fill("hotpink");
    ellipse(noseBullet.x, noseBullet.y, noseBullet.radius, noseBullet.radius);
    let hit = false;

    targets.forEach(function(target){
      hit = target.hasBeenHit(noseBullet);
      if(hit === true ){
        game.score++;
        if( targets.length < game.maxTargets){
          targets.push(
            new Target(25, random(50, width - 100), random(50, height - 100), 30, '#ED225D', true)
          );
        }
      }
      target.update();
      target.display();
    });
    
  });

  showScoreBoard();  
  showStartupMessage();
  
}

function showScoreBoard()
{
  fill('#ED225D');
  noStroke();
  rect(width - 150, 0, 150, 50);

  fill('#fff');
  textSize(16);
  // textAlign(RIGHT)
  text('Score: ' + game.score, width - 140, 30);
}


function showStartupMessage()
{
  if( showOutOfBoundsMsg === true){
    fill('#ED225D');
    noStroke();
    rect(0, height-50, width, 50);

    fill('#fff');
    textSize(16);
    
    text('Use your nose to hit the targets. Keep your nose visible or you\'ll lose your points.', 100, height - 20);
    game.score = 0;
  }
}

// A function to draw ellipses over the detected keypoints
function showNoseBullets() {
  // Loop through all the poses detected
  if(poses.length && isDrawing){
    let nose = poses[0].pose.nose;
    if (nose.confidence > 0.9) {        
        // ellipse(nose.x, nose.y, 10);
        noseBullets.push(
          {
            x: nose.x, 
            y: nose.y,
            radius: 10
          });

        if(noseBullets.length > (game.noseBulletMaxCount) * 2){
          noseBullets = noseBullets.slice(game.noseBulletMaxCount);
        }

        showOutOfBoundsMsg = false;
    }else{
       noseBullets = [];
       showOutOfBoundsMsg = true;
    }
  }
}


function gotSpeech()
{
  console.log(speech.resultString); // log the result
  
  if(speech.resultString.toLowerCase() === 'start'){
    isDrawing = true;
    targets.push(
      new Target(25, random(50, width - 100), random(50, height - 100), 30, '#ED225D', true)
    );
    
  }else if(speech.resultString.toLowerCase() === 'stop'){

    isDrawing = false;
    noseBullets = [];
    targets = [];
  }
}

