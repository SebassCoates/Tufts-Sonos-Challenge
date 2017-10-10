API_KEY = 'AIzaSyCgHIuhsWBBgUOMtmuOc4td5SWrLiPboEE';
SONG_DICT = {};
SONG_DICT["negative"] = "https://open.spotify.com/embed?uri=spotify:user:spotify:playlist:37i9dQZF1DX3YSRoSdA634";
SONG_DICT["positive"] = "https://open.spotify.com/embed?uri=spotify:user:spotify:playlist:37i9dQZF1DX9XIFQuFvzM4";
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
	.catch(getKeyboardText())
}

function getKeyboardText(){
	/*document.getElementById('start').style.visibility = "hidden";*/
	document.getElementById('input').style.visibility = "visible";
	document.getElementById('button').style.visibility = "visible";
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
			result = request.responseText;
			console.log(result);
			updateUI(function (){
				pickSong(result);
				$("#prompt").css("display", "none");
				$("#player").css("display", "block");
			});

		} else {
			// Not ready yet.
		}	
	}
}

function naturalLang(){
	transcript = document.getElementById('usertext').value;

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
			result = request.responseText;
			console.log(result);
			updateUI(function (){
				pickSong(result);
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

function pickSong(responseText){
        
        json = JSON.parse(responseText);
        console.log(json);        
        sentiment = json.documentSentiment.score;
        if (sentiment < 0) {
                document.getElementById('player').src=SONG_DICT["negative"];
                document.body.style.backgroundImage = "url('assets/sadbg.jpg')";

        } else {
                document.getElementById('player').src=SONG_DICT["positive"];
                document.body.style.backgroundImage = "url('assets/happybg.jpg')";
        }
}

