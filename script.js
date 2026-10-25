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

// ---------- Settings ----------
// Settings variables should contain all of the "fixed" parts of your programs
// For example: which notes you can play, how fast things move, the tempo.
const note = "C4"; // the note played when the pointer goes down
const circle = createShape("circle"); // this used to be in the setup() but moved it here so 
                                      // i could manipulate the shape in my functions.
  circle.setPosition(0.5, 0.5);
// ---------- State ----------
// State variables are the parts of your program that change over time.
// For example: where the pointer is, how fast it's moving, or whether a drone is on.
let xColor_value;
let yColor_value;

// ---------- Sound ----------
// Make the instruments and plug them into the speakers.
const synth = new Tone.PolySynth(Tone.Synth).toDestination(); // can play several notes at once

// ---------- Update ----------
// Update the state. This is called every 100ms.
function update() {
  setTimeout(update, 100); // call update() again in 100 milliseconds
}

// ---------- Use ----------
// Use the state to make sound and move shapes. This is called every 100ms.
function use() {
  setTimeout(use, 100); // call use() again in 100 milliseconds
}

// ---------- Controls (Event Handlers) ----------
// Runs every time the pointer goes down: a click, a tap or a pen touch.
function pointerDown(event) {
  Tone.start(); // browsers only allow sound after the player has pressed something
  console.log("Pointer down at", event.clientX, event.clientY);
  synth.triggerAttack(note, Tone.now()); // play the note
  circle.setRoundedness(0.2); // visual feedback
}

function pointerUp(event){
  console.log("Pointer up at ", event.clientX, event.clientY);
  synth.triggerRelease(note, Tone.now()); // stop the note
  circle.setRoundedness(1); // visual feedback
}


function pointerMove(event){
  //-------This moves the shape to the cursor with an offset to center it on the cursor.----
  circle.setPosition((event.clientX - 47.5) / window.innerWidth, (event.clientY - 47.5) / window.innerHeight);
  console.log("Pointer move at ", event.clientX, event.clientY); // to read that it's working
  //event.clientX is the mouse's x position in pixels which is the amount of pixels from the left. Problem is however that
  //the position value is supposed to be in fractions or decimals between 0 and 1. So the raw position would be >1 
  //and the position would be way way beyond the window so by deviding by window.innerWidth, aka the width of the window in
  // pixels we get smaller number devided by bigger number and we get our lovely fraction that will appear on the screen. 
  // The added numbers for x and y are to center the shape on the cursor no matter the size of the window.

//--------Time to change the color of the shape based on the position of the cursor. 
xColor_value = event.clientX /window.innerWidth *330; // determins the hue based on the relative x position. goes from 0 (red) and almost loops back to 360/0 but instead 330
yColor_value = event.clientY /window.innerHeight *50 + 20; // determines the lightness based on relative y. lightness goes from 20% --> 70%
circle.setColour(xColor_value, 100, yColor_value, 1);
// the inputs are h, s, l and a. determining the hue based on x position and lightness by y, saturation is 100 and opacity (a) is 1 = 100%


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