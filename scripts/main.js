function onLoad(){
	navigator.getUserMedia  = navigator.getUserMedia ||
                  navigator.webkitGetUserMedia ||
                  navigator.mozGetUserMedia ||
                  navigator.msGetUserMedia;

        if (navigator.getUserMedia){
        	alert("We're in");
        	navigator.getUserMedia({audio: true});
        }
        else {
        	alert("No audio capabilities");
        }



}