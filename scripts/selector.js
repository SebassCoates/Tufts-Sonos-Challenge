SONG_DICT = {};
SONG_DICT["negative"] = "https://open.spotify.com/embed?uri=spotify:user:spotify:playlist:3A37i9dQZF1DX3YSRoSdA634";
SONG_DICT["positive"] = "https://open.spotify.com/embed?uri=spotify:user:spotify:playlist:37i9dQZF1DX9XIFQuFvzM4";

function pickSong(responseText){
        
        json = JSON.parse(responseText);
        console.log(json);        
        sentiment = json.documentSentiment.score;

        if (sentiment < 0) {
                document.getElementById('player').src=SONG_DICT["negative"];
        } else {
                document.getElementById('player').src=SONG_DICT["positive"];
        }
}

