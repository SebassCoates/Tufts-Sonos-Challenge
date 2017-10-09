SONG_DICT = {};
SONG_DICT["negative"] = "https://open.spotify.com/embed?uri=spotify:user:erebore:playlist:3A37i9dQZF1DX3YSRoSdA634";
SONG_DICT["positive"] = "https://open.spotify.com/embed?uri=spotify:user:erebore:playlist:37i9dQZF1DX9XIFQuFvzM4";

function pickSong(responseText){

        sentObject = JSON.parse(responseText);
        sentiment = sentObject.sentences.sentiment.score;

        player = document.getElementById('main-content').remove();

        if (sentiment < 0) {
                document.getElementById('player').src=SONG_DICT["negative"];
        } else {
                document.getElementById('player').src=SONG_DICT["positive"];
        }
}

