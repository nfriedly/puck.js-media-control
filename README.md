# Puck.js Media Control
Remote control to pause, resume, and rewind audiobooks playing from my phone.

* Short press toggles play/pause. Light blinks green.
* Long press rewinds 30 seconds. Light blinks blue.
  * It actually sends 3x "previous track" commands, but I have my [audiobook player](https://play.google.com/store/apps/details?id=ak.alizandro.smartaudiobookplayer) configured to interpret each of those as 10-second rewind.

Why?

I have some otherwise great earbuds that have frusturatingly-unreliable touch controls. This gives me a physical button that reliably performs my most common two tasks.

This code is meant to run on a [Puck.js](https://www.puck-js.com/) via [Espruino](https://www.espruino.com/).

[![Puck.js](http://www.espruino.com/refimages/Puckjs_board.jpg)](https://www.puck-js.com/)
