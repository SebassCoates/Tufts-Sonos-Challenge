API_KEY = 'AIzaSyCgHIuhsWBBgUOMtmuOc4td5SWrLiPboEE';

evenClick = false;

function onLoad(){

	$("#start").click(toggleRecording);
}

function speechRecognition(){
	navigator.mediaDevices.getUserMedia({audio:true})
	.then(stream => {

		var options = {
			type: 'audio',
			mimeType: 'audio/wav',
			recorderType: StereoAudioRecorder,
			numberOfAudioChannels: 1,
			sampleRate: 41000,
		}

		recordRTC = RecordRTC(stream, options);
		recordRTC.startRecording();

		updateUI(function (){
			$("#mic").removeClass("fa-microphone-slash")
				   .addClass("fa-microphone");

			$("#micContainer").css("color", "red");
		});
	})
	.catch(console.log("permission exception caught"));
}


function getTranscription(newVoice){
	console.log("starting upload");

	var request = new XMLHttpRequest();

	request.open("POST",
	 'https://speech.googleapis.com/v1/speech:recognize?key=' + API_KEY,
	  true)
	
	request.send(JSON.stringify({
		"config": {
			"encoding":"LINEAR16",
			"sampleRateHertz": 41000,
			"languageCode": "en-US",
		},
		"audio": {
			"content": newVoice
		}
	}));

	request.onreadystatechange = function (){
		if (request.readyState === XMLHttpRequest.DONE) {
			console.log(request.responseText);
			responseJson = JSON.parse(request.responseText);
			// Takes the transcript from voice to text
			// and gets sentiment analysis value
			naturalLang(responseJson.results[0].alternatives[0].transcript);
		} 	
	}
	console.log("upload done");
}

function naturalLang(transcript){
	var request = new XMLHttpRequest();

	request.open("POST",
	 'https://language.googleapis.com/v1/documents:analyzeSentiment?key=' 
	 + API_KEY,
	  true)
	
	request.send(JSON.stringify({
		  "encodingType": "UTF8",
		  "document": {
			    "type": "PLAIN_TEXT",
			    "content": transcript
		  }
	}));

	request.onreadystatechange = function (){
		if (request.readyState === XMLHttpRequest.DONE) {
			console.log(request.responseText);
			updateUI(function (){
				$("#prompt").css("display", "none");
				$("#player").css("display", "block");
			});

		} else {
			// Not ready yet.
		}	
	}
}

function updateUI(func){
	func();
}

function toggleRecording(){
	evenClick = !evenClick
	
	if (evenClick){ 
		speechRecognition();
	}
	else {
		updateUI(function (){
			$("#mic").removeClass("fa-microphone")
			         .addClass("fa-microphone-slash");

			$("#micContainer").css("color", "black");
		});
		
		recordRTC.stopRecording(function(audioURL) {

			var blob = recordRTC.getBlob();
			var filereader = new FileReader();

			// Callback when reader finishes reading
			filereader.onload = function(event){
				var data = this.result.split(",")[1];
				getTranscription(data);
			}

			// Converts audio to base64 string
			filereader.readAsDataURL(blob); 
		});
	}
}
