var controls = require("ble_hid_controls");
NRF.setServices(undefined, { hid : controls.report });

var RED = LED1;
var GREEN = LED2;
var BLUE = LED3;

var awaiting = false;
var queue = [];

function enqueue(fn) {
  queue.push(fn);
  if(!awaiting) {
    runNext();
  }
}

function runNext() {
  if(queue.length) {
    awaiting = true;
    try {
      queue.pop()(runNext);
      digitalPulse(GREEN, HIGH, 50);
    } catch (ex) {    
      digitalPulse(RED, HIGH, 100);
      console.log(ex);
    }
  } else {
    awaiting = false;
  }
}

function resetQueue() {
  awaiting = false;
  queue.length = 0;
}

// track connection state
// note: this doesn't seem to be completely reliable
NRF.on('connect',()=>{
  resetQueue();
  digitalPulse(GREEN, HIGH, [50,300,50,300,50]);
});
NRF.on('disconnect',()=>{
  resetQueue();
  digitalPulse(RED, HIGH, [50,300,50,300,50]);
});

// toggle the radio on and off to save battery (and avoid accidental clicks)
var isBluetoothOn = true;
function toggleBluetooth(){
  resetQueue();
  if (isBluetoothOn) {
    NRF.sleep();
    digitalPulse(BLUE, HIGH, [50,300,50]);
    digitalPulse(RED, LOW, [700, 300]); // LOW for duration of the blue pulse + 300 then HIGH for 300 then back to LOW
  } else {
    NRF.wake();
    digitalPulse(BLUE, HIGH, [50,300,50]);
    digitalPulse(GREEN, LOW, [700, 300]); // LOW for 700 then HIGH for 300 then back to LOW
  }
  isBluetoothOn = !isBluetoothOn;
}


var lastClickTime = 0;
var numClicks = 0;

function handleClick(e) {
  // count multiple clicks if they are less than a second appart
  var secondsSinceLastClick = e.time - lastClickTime;
  lastClickTime = e.time;
  if (secondsSinceLastClick > 1) {
    numClicks = 0;
  }
  numClicks++;
  if (numClicks === 1) {
    // toggle on first click
    enqueue((next) => {
      controls.playpause(next);
    });
  } else if (numClicks === 2) {
    // rewind *and* undo toggle on second click
    enqueue((next) => {
      controls.prev(() => controls.playpause(next));
    });
  } else {
    // rewind only on all subsequent clicks
    enqueue((next) => {
      controls.prev(next);
    });
  }

}

setWatch(function(e) {
  // long press: toggle radio and return
  var secondsPressed = e.time - e.lastTime;
  if (secondsPressed > 1) {
    toggleBluetooth();
    return;
  }
  // short press
  handleClick(e);
}, BTN, { edge:"falling",repeat:true,debounce:50});
