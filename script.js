/*
 * IDB Programming: A3 — a musical instrument
 *
 * All of the code for your instrument goes in this file. It's split into sections:
 *   settings — the "fixed" parts of your program
 *   state    — the parts of your program that change over time
 *   sound    — the Tone.js instruments and effects
 *   update   — updates the state every 100ms, if necessary
 *   use      — uses the state to make sound and shapes every 100ms, if necessary
 *   controls — what happens when the player uses the pointer
 *   setup    — starts everything
 *
 * The pointer events change the state. update() and use() each run every
 * 100ms, in a loop:
 *   1. update: change the state, e.g. based on time or on the pointer's movement
 *   2. use:    make sound and move shapes, based on the state
 *
 * Shapes come from shape.js: createShape() makes one, and its methods
 * (setPosition, setSize, setColour ...) change it.
 *
 * Tone.js documentation: https://tonejs.github.io/docs/15.1.22/
 */

import { createShape } from "./shape.js";

//---------- Make 7 x 4 grid --------------
//Let's setup the lines that will go across horizontally
for (let i = 1; i < 4; i++) {
  //should only run 3 times and that's it
  let linename = "Horizontal" + i;
  linename = createShape("rectangle");
  linename.setRoundedness(0);
  linename.setPosition(0, i / 4);
  linename.setSize(innerWidth, 5);
  linename.setColour(360, 100, 0, 1);
}
//Let's do the same vertically
for (let i = 1; i < 7; i++) {
  //should only run 6 times and that's it
  let linename = "Vertical" + i;
  linename = createShape("rectangle");
  linename.setRoundedness(0);
  linename.setPosition(i / 7, 0);
  linename.setSize(5, innerHeight);
  linename.setColour(360, 100, 0, 1);
}

// ---------- Settings ----------
// Settings variables should contain all of the "fixed" parts of your programs
// For example: which notes you can play, how fast things move, the tempo.
//const note = "C4"; // the note played when the pointer goes down
const circle = createShape("circle"); // this used to be in the setup() but moved it here so
// i could manipulate the shape in my functions.

// ---------- State Cursor ----------
// State variables are the parts of your program that change over time.
// For example: where the pointer is, how fast it's moving, or whether a drone is on.
let xColor_value = 0;
let yColor_value = 0;
let xPosition = [];
let yPosition = [];
let vectorSizes = [];
let vectorSizeMeanValue = 0;
let trueAverageSpeed = 0;

//for shape to use, but defined by the mouse
let rawY;
let rawX;

//----------- State Shape
circle.setPosition(0.5, 0.5); //initial position
let shapeState = "0"; //we'll use 0 as the big state, 1 as the medium, and 2 as the big state
let shapeSize = 100;
let newShapeSize = 100;
let isMoving = false;
let timerMoved = 0;
// ---------- Sound ----------
// Make the instruments and plug them into the speakers.
const synth = new Tone.PolySynth(Tone.Synth).toDestination(); // can play several notes at once
let notes = "D";
let octave = "2";
let play = false;
let decisionMade = false;
let completeNote = "D2";
let currentCN = "";

// ---------- Update ----------
// Update the state. This is called every 100ms.
function update() {
  setTimeout(update, 100); // call update() again in 100 milliseconds

  let newCN = completeNote;

  //Runs when play is true
  if (play === true) {
    //Let's check if we have moved anywhere by checking the notes of currentCN and newCN. If these two tell us nothing has changed, then nothing needs to happen.
    //However should something change, that's when we need to act. Now when something changes, we stop the old note, update the note we're supposed to play to
    //the new thing and start playing that.
    if (currentCN !== newCN) {
      synth.triggerRelease(currentCN, Tone.now());
      currentCN = newCN;
      synth.triggerAttack(currentCN, Tone.now());
    }
  }
  //Runs when we turned play off and resets the instrument basically
  else if (play === false) {
    synth.triggerRelease(currentCN, Tone.now());
  }
}

//-----------Position check for notes--------
function updatePositionNotes(xPos, yPos) {
  //Check which note to play
  if (xPos <= 1 / 7) {
    notes = "A";
  } else if (xPos > 1 / 7 && xPos <= 2 / 7) {
    notes = "B";
  } else if (xPos > 2 / 7 && xPos <= 3 / 7) {
    notes = "C";
  } else if (xPos > 3 / 7 && xPos <= 4 / 7) {
    notes = "D";
  } else if (xPos > 4 / 7 && xPos <= 5 / 7) {
    notes = "E";
  } else if (xPos > 5 / 7 && xPos <= 6 / 7) {
    notes = "F";
  } else if (xPos > 6 / 7) {
    notes = "G";
  }

  //Check which octave to play at
  if (yPos <= 1 / 4) {
    octave = "1";
  } else if (yPos > 1 / 4 && yPos <= 2 / 4) {
    octave = "2";
  } else if (yPos > 2 / 4 && yPos <= 3 / 4) {
    octave = "3";
  } else if (yPos > 3 / 4) {
    octave = "4";
  }

  completeNote = notes + octave;
  //console.log("note = " , notes, " and octave = ", octave);
}

// ---------- Use ----------
// Use the state to make sound and move shapes. This is called every 100ms.
function use() {
  setTimeout(use, 5); // call use() again in 5 milliseconds
  //Let's check what size the shape is suppoed to be hehe
  if (shapeState === 0) {
    //if big
    newShapeSize = 100;
  } else if (shapeState === 1) {
    //if medium
    newShapeSize = 62.5;
  } else if (shapeState === 2) {
    //if small
    newShapeSize = 25;
  }

  if (newShapeSize > shapeSize) {
    shapeSize = shapeSize + 2.5;
    circle.setSize(shapeSize);
  } else if (newShapeSize < shapeSize) {
    shapeSize = shapeSize - 2.5;
    circle.setSize(shapeSize);
  }

  //We want to check if we have moved recently and then how long it has been
  if (isMoving === true) {
    if (timerMoved < 10) {
      //5 ms * 10 = 50 ms or 0.05 seconds
      timerMoved = timerMoved + 1;
    } else {
      //after the established amount of time has passed and
      isMoving = false;
      shapeState = 0;
    }
  }

  //Let's move the shape to the cursor and make sure we offset properly :)
  circle.setPosition(
    (rawX - (shapeSize / 2) * 0.95) / window.innerWidth,
    (rawY - (shapeSize / 2) * 0.95) / window.innerHeight,
  );
}

// ---------- Controls (Event Handlers) ----------
// Runs every time the pointer goes down: a click, a tap or a pen touch.
function pointerDown(event) {
  Tone.start(); // browsers only allow sound after the player has pressed something
  console.log("Pointer down at", event.clientX, event.clientY);
  circle.setRoundedness(0.2); // visual feedback

  //When we press the mouse we want the music to toggle on and off but we have to make sure that we don't accidentally loop. When we decide to start play, we don't want to
  //accidentally loop with turning it off, so it's only on for but a moment and then goes off immediately.
  //if statement for if we want to initiate play
  if (play === false && decisionMade === false) {
    play = true;
    decisionMade = true;
    // console.log("play is on");
  }
  //else if statement for if we want to initiate stop play
  else if (play === true && decisionMade === false) {
    play = false;
    decisionMade = true;
    // console.log("play is off")
  }
}

function pointerUp(event) {
  console.log("Pointer up at ", event.clientX, event.clientY);
  circle.setRoundedness(1); // visual feedback
  //turning boolean false so we can make a new decision
  decisionMade = false;
  //synth.triggerRelease("C4", Tone.now()); // stop the note
}

function pointerMove(event) {
  //-------This moves the shape to the cursor with an offset to center it on the cursor.----
  // circle.setPosition(
  //   (event.clientX - 47.5) / window.innerWidth,
  //   (event.clientY - 47.5) / window.innerHeight,
  // );
  //console.log("Pointer move at ", event.clientX, event.clientY); // to read that it's working
  //event.clientX is the mouse's x position in pixels which is the amount of pixels from the left. Problem is however that
  //the position value is supposed to be in fractions or decimals between 0 and 1. So the raw position would be >1
  //and the position would be way way beyond the window so by deviding by window.innerWidth, aka the width of the window in
  //pixels we get smaller number devided by bigger number and we get our lovely fraction that will appear on the screen.
  //The added numbers for x and y are to center the shape on the cursor no matter the size of the window.

  //---Let's define the mouse movement-----
  let xInput = event.clientX / window.innerWidth;
  let yInput = event.clientY / window.innerHeight;
  rawX = event.clientX;
  rawY = event.clientY;

  //----Let's send that to the function that will check what we'll play because of that--
  updatePositionNotes(xInput, yInput);

  //--------Time to change the color of the shape based on the position of the cursor---------
  xColor_value = xInput * 350; // determins the hue based on the relative x position. goes from 0 (red) and almost loops back to 360/0 but instead 350
  yColor_value = yInput * 50 + 20; // determines the lightness based on relative y. lightness goes from 20% --> 70%
  circle.setColour(xColor_value, 100, yColor_value, 1);
  // the inputs are h, s, l and a. determining the hue based on x position and lightness by y, saturation is 100 and opacity (a) is 1 = 100%

  //Adding the inputs into our position arrays
  xPosition.push(xInput);
  yPosition.push(yInput);

  //------- let's clean up the arrays as well so less memory---------------------
  if (xPosition.length > 2 && yPosition.length > 2) {
    xPosition.shift();
    yPosition.shift();
  }

  //------working out the math to determine how fast we move (roughly xd). Only interested in values we can read so that's what we're doing here.
  if (xPosition.length > 1 && yPosition.length > 1) {
    let xxDiff =
      xPosition[xPosition.length - 1] - xPosition[xPosition.length - 2]; //sets up the difference on the x axis
    let yyDiff =
      yPosition[yPosition.length - 1] - yPosition[yPosition.length - 2]; //sets up the difference on the y axis
    let xSquare = (xxDiff * 10000) ** 2; //multiply by 10000 to make the numbers readable
    let ySquare = (yyDiff * 10000) ** 2;
    let directionVector = Math.sqrt(xSquare + ySquare); //pythagoras theorem
    vectorSizes.push(directionVector);
    if (vectorSizes.length > 5) {
      vectorSizes.shift();
    }
    if (vectorSizes.length === 5) {
      vectorSizeMeanValue = 0;
      for (let i = 0; i < vectorSizes.length; i++) {
        vectorSizeMeanValue = vectorSizeMeanValue + vectorSizes[i];
      }
      //Let's get the Average length
      trueAverageSpeed = vectorSizeMeanValue / vectorSizes.length;

      //--------Let's shrink the ball depending on how fast we move the cursor-----
      // we probably need an array to check the current vs previous position and then ask how quickly are we moving using a^2 + b^2 = c^2
      // if the absolute value of c, or just c^2 since that will always be positive, falls within a range then it shouldn't shirnk at all,
      // but if it goes beyond then maybe make it shrink ig to various degrees but not more than a certain amount, think this will require finetuning perhaps
      //console.log("the current x positionm is ", xPosition[xPosition.length - 1], ". and the previous one was ", xPosition[xPosition.length - 2], ". The difference multiplied by 1000 is: ", xxDiff*1000)
      console.log("Current vector: ", directionVector);
      console.log("Average: ", trueAverageSpeed);
      if (trueAverageSpeed <= 70) {
        //circle.setSize(100);
        //make size big
        shapeState = 0;
      } else if (trueAverageSpeed <= 150 && trueAverageSpeed >= 90) {
        //circle.setSize(62.5);
        //make size medium
        shapeState = 1;
      } else if (trueAverageSpeed > 170) {
        //circle.setSize(25);
        //make size small
        shapeState = 2;
      }
    }
  }

  //let's add something that tells the program that we have moved recently
  isMoving = true;
  timerMoved = 0;
}

// ---------- Setup ----------
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  update(); // start the update loop
  use(); // start the use loop

  // Example: a shape near the middle of the window. Replace it with your own.
  //const example = createShape("example");
  //example.setPosition(0.5, 0.5);

  // Put your event listener code here
  window.addEventListener("pointerdown", pointerDown); // listening for when we press with any mousebutton or pen
  window.addEventListener("pointerup", pointerUp); // -||- but when we release it
  window.addEventListener("pointermove", pointerMove); // listens for when we move the pointer around
}

setup(); // Always remember to call setup()!
