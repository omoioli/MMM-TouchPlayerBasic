'use strict';
const NodeHelper = require('node_helper');
const exec = require('child_process').exec;

var timer;
//function initialize() {
//}
//(function(){
//	initialize();
//			autosleep();
//})();
module.exports = NodeHelper.create({
  start: function() {
		this.started = false;

  }, 
 
  socketNotificationReceived: function(notification, payload) {

	if (notification === "Radiostop") {
		exec("sudo killall mpg123", null);
	}
	if (notification === "VolumeUp") {
		exec("amixer -q sset Master 3%+", null);
	}
	if (notification === "VolumeDown") {
		exec("amixer -q sset Master 3%-", null);
	}
	if (notification === "Mute") {
		exec("amixer -q sset Master toggle", null);
	}
	if (notification === "Radiolecture") {
		exec("sudo /home/pi/MagicMirror/modules/MMM-TouchPlayerBasic/scriptfiles/" + payload + ".sh", null);
	}
	if (notification === "KALLIOPE") {
		exec("bash /home/pi/Desktop/restartKall.sh", null);
	}
//	else {
//		exec("sudo /home/pi/MagicMirror/modules/MMM-TouchPlayerBasic/scriptfiles/" + notification + ".sh", null);
//	}
	

   },
  
});

	
