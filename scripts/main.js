function onLoad(){

	audioChunks = [];

	navigator.mediaDevices.getUserMedia({audio:true})
	.then(stream => {
		rec = new MediaRecorder(stream);
		rec.ondataavailable = e => {
		audioChunks.push(e.data);
			if (rec.state == "inactive"){
        			let blob = new Blob(audioChunks,{type:'audio/x-mpeg-3'});
    			}
		}
	})
	.catch(e=>console.log(e));

	e => {rec.start();}
	i = 0;
	while ( i < 1000000 ){
		i++;
	}
	e => {rec.stop();}

}