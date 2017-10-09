SONG_DICT = {};
SONG_DICT["negative"] = "https://open.spotify.com/embed?uri=spotify:user:spotify:playlist:37i9dQZF1DX3YSRoSdA634";
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

function simulateClick(){
        coords = getOffset(document.getElementById('player'));
        xcoord = coords.top;
        ycoord = coords.left;
        click(xcoord + 25, ycoord + 30);
}

function getOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}

function click(x, y)
{
    var ev = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true,
        'screenX': x,
        'screenY': y
    });

    var el = document.elementFromPoint(x, y);

    el.dispatchEvent(ev);
}
