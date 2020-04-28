/* global Module */

/* Magic Mirror
 * Module: MMM-TouchPlayerBasic
 *
 *
 * By Pierre Broberg, based on code from MMM-Myvoiceradio by gismo2006
 * MIT Licensed.
 */

		var stylestation = "none";
		var styletop = "none";
		var menustation = "off";
		var lecture = "off";
		var frequence = 0;

Module.register("MMM-TouchPlayerBasic",{


// Default module config.
	defaults: {
		showOnStart: false,
		stations: [
			"R radio", // Separation by space, First part "R" is the .png image filename, the second is .sh script name
			"P playlist" // The default icons are R for radiostation and P for playlist icon.
		]
	},
	getStyles: function() {
		return ["style.css"];
	},

 start: function() {
    this.sendSocketNotification("KALLIOPE", {})
    
  },

/* notification part*/
notificationReceived: function(notification, payload, sender) {
var self = this;
var stationsArray = self.config.stations;

	if (notification === "Radiostop"){
	   stylestation = "none";
	   styletop = "none";
	   lecture = "off";
	   menustation = "off";
       self.sendSocketNotification('Radiostop', {});
	   this.updateDom();
   	}
	if (notification === "Radioouvre"){
	   self.sendSocketNotification('Radiostop', {});
	   menustation = "on";
	   stylestation = "block";
	   styletop = "block";
	   this.updateDom();
    }
	if (notification === "VolumeUp"){
           self.sendSocketNotification('VOLUME_UP', {});
   	}
	if (notification === "VolumeDown"){
      	   self.sendSocketNotification('VOLUME_DOWN', {});
   	}
	if (notification === "Mute"){
		//lecture = "off";
		if (menustation == "on" && lecture == "on") {
			self.sendSocketNotification('Radiostop', {});
		}
    }
	if (notification === "Resume"){
		if (menustation == "on" && lecture == "on") {
			lecture = "on";
			//this.sendNotification("mqttradioon", "on");
			self.sendSocketNotification("Radiolecture", stationsArray[frequence].split(" ")[1]);
		}
		
    }
	if (notification === "Radiolire") {
	   if (menustation == "on" ) {
	//	stylestation = "none";
		lecture = "on";
		frequence = payload;
	   	this.updateDom();
		
       self.sendSocketNotification('Radiostop', {});
		self.sendSocketNotification("Radiolecture", stationsArray[frequence].split(" ")[1]);
		}
	}
	if (notification === "Radionext") {
	   if (menustation == "on") {
		if (frequence < stationsArray.length) {
			frequence = frequence + 1;
		}
		else {
			frequence = 0;
		}
		if (lecture) {
			self.sendSocketNotification("Radiolecture", stationsArray[frequence].split(" ")[1]);
			this.updateDom();
		}
	   }
	}
},

	// Override dom generator.
	getDom: function() {

		var self = this;
		var stationsArray = self.config.stations;
		var stationListWidth;
		
		if (stationsArray.length < 4) {stationListWidth = 290;}
		else {stationListWidth = ( stationsArray.length * 60 ) + 60;}

		var wrapper = document.createElement("div");
//if (menustation == "on") {
		var mainButton = document.createElement("div");
			mainButton.innerHTML = '<img src="modules/MMM-TouchPlayerBasic/images/mainButtonBW.png" style="cursor:pointer"></img>';
			mainButton.className = "mainButton";
			mainButton.addEventListener("click", () => DisplayMenu());
			mainButton.style.display = styletop;

		var stationMenu = document.createElement("div");
			stationMenu.className = "stationMenu";
			stationMenu.style.display = stylestation; //ESSAI D'AFFICHAGE STATION MENU -------------------------------------

		var stationList = document.createElement("div")
		stationList.innerHTML = "<img class='imgLeft' src='modules/MMM-TouchPlayerBasic/images/stationListEnd.png'><img class='imgRight' src='modules/MMM-TouchPlayerBasic/images/stationListStart.png'>";
		stationList.className = "stationList";
		stationList.style.width = stationListWidth + "px";
		//stationList.style.width = 500 + "px";
		stationMenu.appendChild(stationList);

		var statindex;
		for (statindex = 0; statindex < stationsArray.length; ++statindex) {
			var strsplit = stationsArray[statindex].split(" ")
			let scriptfile = strsplit[1];
			var statplace = (statindex + 1) * 60;
			//var station = strsplit[1];
			var	station = document.createElement("div");
			//	station.innerHTML = '<img src="modules/MMM-TouchPlayerBasic/images/' + strsplit[0] + '.png" style="cursor:pointer"></img><div class="rotate">' + scriptfile + '</div>';
				station.innerHTML = '<img src="modules/MMM-TouchPlayerBasic/images/' + strsplit[0] + '.png" style="cursor:pointer"></img><div class="rotate">' + " " + '</div>';
				station.className = "stationButton";
				station.style.right = statplace + "px";
				station.addEventListener("click", () => play(scriptfile));
				stationMenu.appendChild(station);
		};

		wrapper.appendChild(stationMenu);
//}		
		function DisplayMenu() {
				/*	stationMenu.style.display = "block";
					topMenu.style.display = "block";*/
					stationMenu.style.display = stylestation;
					topMenu.style.display = styletop;

					stationMenu.style.webkitAnimationName = "stationMenuAnimation";
					topMenu.style.webkitAnimationName = "topMenuAnimation";
					stylestation = "block";
					styletop = "block";
		};

		function play(scriptfile) {
			//stationMenu.style.display = "none";
			stationMenu.style.display = stylestation;
			self.sendSocketNotification(scriptfile, {});
		};

		var topMenu = document.createElement("div");
			topMenu.className = "topMenu";
			topMenu.style.display = styletop; //essai affichage -----------------------------------

		var stopper = document.createElement("div");
			stopper.className = "stopButton";
			stopper.innerHTML = '<img src="modules/MMM-TouchPlayerBasic/images/stopButton.png" style="cursor:pointer"></img>';
			stopper.addEventListener("click", () => radiostop());

		function radiostop() {
		//	stationMenu.style.display = "none";
		//	topMenu.style.display = "none";
			stationMenu.style.display = stylestation;
			topMenu.style.display = styletop;
			menustation = "off";
			self.sendSocketNotification('Radiostop', {});
			stylestation = "none";
			styletop = "none";
		};

		var volumeUp = document.createElement("div");
			volumeUp.className = "volumeupButton";
			volumeUp.innerHTML = '<img src="modules/MMM-TouchPlayerBasic/images/volumeupButton.png" style="cursor:pointer"></img>';
			volumeUp.addEventListener("click", () => volumecontrol('VolumeUp'));
		var volumeDown = document.createElement("div");
			volumeDown.className = "volumedownButton";
			volumeDown.innerHTML = '<img src="modules/MMM-TouchPlayerBasic/images/volumedownButton.png" style="cursor:pointer"></img>';
			volumeDown.addEventListener("click", () => volumecontrol('VolumeDown'));
		var volumeMute = document.createElement("div");
			volumeMute.className = "muteButton";
			volumeMute.innerHTML = '<img src="modules/MMM-TouchPlayerBasic/images/muteButton.png" style="cursor:pointer"></img>';
			volumeMute.addEventListener("click", () => volumecontrol('Mute'));

		function volumecontrol(action) {
			self.sendSocketNotification(action, {});
		};

		topMenu.appendChild(stopper);
		topMenu.appendChild(volumeUp);
		topMenu.appendChild(volumeDown);
		topMenu.appendChild(volumeMute);

		wrapper.appendChild(topMenu);
		wrapper.appendChild(mainButton);
		return wrapper;

	}
});
