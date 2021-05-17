// Note: this code is intended to run in the Espruino runtime
// based on https://www.espruino.com/BLE+Music+Control

var controls = require("ble_hid_controls");
NRF.setServices(undefined, { hid : controls.report });

var RED = LED1;
var GREEN = LED2;
var BLUE = LED3;

function blinks(color) {
  digitalPulse(color, HIGH, 200);
  digitalPulse(color, LOW,  300);
  digitalPulse(color, HIGH, 200);
  digitalPulse(color, LOW,  300);
  digitalPulse(color, HIGH, 200);
}

var isConnected = false;

NRF.on('connect',()=>{
  isConnected = true;
  blinks(GREEN);
});
NRF.on('disconnect',()=>{
  isConnected = false;
  blinks(RED);
});

setWatch(function(e) {
  if (!isConnected) {
    blinks(RED);
    return;
  }
  var len = e.time - e.lastTime;
  if (len > 1) {
    try {
      // 3x 10 second rewinds
      controls.prev(() => controls.prev(() => controls.prev()));
      digitalPulse(BLUE, HIGH, 100);
    } catch (er) {
      digitalPulse(RED, HIGH, 100);
      console.log(er);
    }
  } else {
    try {
      controls.playpause();
      digitalPulse(GREEN, HIGH, 100);
    } catch (er) {
      digitalPulse(RED, HIGH, 100);
      console.log(er);
    }
  }
}, BTN, { edge:"falling",repeat:true,debounce:50});
