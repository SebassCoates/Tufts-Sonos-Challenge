function onLoad(){
	if (Modernizr.getusermedia){
		alert("Good to go");
		navigator.getUserMedia({audio: true})
		//Do voice capture
	}
	else{
		alert(Modernizr.getusermedia);

		//Do text instead
	}


}