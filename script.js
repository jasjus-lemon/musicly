const searchInput =
    document.getElementById("searchInput");

const result =
    document.getElementById("result");

const resultCount =
    document.getElementById("resultCount");

const songTitle =
    document.getElementById("songTitle");

const artist =
    document.getElementById("artist");

const playerCover =
    document.getElementById("playerCover");

const playButton =
    document.getElementById("playButton");

const volume =
    document.getElementById("volume");


let audio = new Audio();

let currentSong = null;

let songs = [];

let currentIndex = 0;


// ===============================
// SEARCH
// ===============================

async function searchMusic() {

    const query =
        searchInput.value.trim();


    if (query === "") {

        result.innerHTML = `
            <div class="empty">
                Ketik nama lagu terlebih dahulu 🎵
            </div>
        `;

        resultCount.textContent = "";

        return;
    }


    result.innerHTML = `
        <div class="empty">
            🔎 Searching...
        </div>
    `;


    try {

        const url =
            "https://itunes.apple.com/search?" +
            "term=" +
            encodeURIComponent(query) +
            "&media=music" +
            "&entity=song" +
            "&limit=15";


        const response =
            await fetch(url);


        const data =
            await response.json();


        songs = data.results;


        if (songs.length === 0) {

            result.innerHTML = `
                <div class="empty">
                    😢 Lagu tidak ditemukan.
                </div>
            `;

            resultCount.textContent = "";

            return;
        }


        resultCount.textContent =
            songs.length + " songs";


        result.innerHTML = "";


        songs.forEach((song, index) => {

            const item =
                document.createElement("div");


            item.className =
                "song-result";


            let cover =
                song.artworkUrl100;


            if (cover) {

                cover =
                    cover.replace(
                        "100x100",
                        "300x300"
                    );
            }


            item.innerHTML = `

                <img
                    class="song-cover"
                    src="${cover}"
                    alt="Album cover"
                >


                <div class="song-info">

                    <strong>
                        ${song.trackName}
                    </strong>

                    <p>
                        ${song.artistName}
                    </p>

                    <small>
                        ${song.collectionName || "Single"}
                    </small>

                </div>


                <button class="song-play">
                    ▶
                </button>

            `;


            item.onclick = () => {

                currentIndex = index;

                playSong(song);

            };


            result.appendChild(item);

        });


    } catch (error) {

        console.error(error);


        result.innerHTML = `
            <div class="empty">
                ⚠️ Tidak bisa mencari lagu.<br>
                Periksa koneksi internet.
            </div>
        `;

    }
}


// ===============================
// PLAY SONG
// ===============================

function playSong(song) {

    if (!song.previewUrl) {

        alert(
            "Preview lagu ini tidak tersedia."
        );

        return;
    }


    currentSong = song;


    audio.src =
        song.previewUrl;


    audio.play();


    songTitle.textContent =
        song.trackName;


    artist.textContent =
        song.artistName;


    let cover =
        song.artworkUrl100;


    if (cover) {

        cover =
            cover.replace(
                "100x100",
                "300x300"
            );
    }


    playerCover.src =
        cover || "art.jpg";


    playButton.textContent =
        "Ⅱ";
}


// ===============================
// PLAY / PAUSE
// ===============================

function playMusic() {

    if (!currentSong) {

        alert(
            "Cari dan pilih lagu terlebih dahulu 🎵"
        );

        return;
    }


    if (audio.paused) {

        audio.play();

        playButton.textContent = "Ⅱ";

    } else {

        audio.pause();

        playButton.textContent = "▶";

    }
}


// ===============================
// NEXT
// ===============================

function nextSong() {

    if (songs.length === 0) {

        return;
    }


    currentIndex++;


    if (currentIndex >= songs.length) {

        currentIndex = 0;

    }


    playSong(
        songs[currentIndex]
    );
}


// ===============================
// PREVIOUS
// ===============================

function previousSong() {

    if (songs.length === 0) {

        return;
    }


    currentIndex--;


    if (currentIndex < 0) {

        currentIndex =
            songs.length - 1;

    }


    playSong(
        songs[currentIndex]
    );
}


// ===============================
// VOLUME
// ===============================

volume.addEventListener(
    "input",
    function() {

        audio.volume =
            volume.value;

    }
);


// Volume awal
audio.volume = 0.8;


// ===============================
// ENTER = SEARCH
// ===============================

searchInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            searchMusic();

        }

    }
);


// ===============================
// SEARCH BUTTON / SIDEBAR
// ===============================

function focusSearch() {

    searchInput.focus();

    searchInput.scrollIntoView({
        behavior: "smooth"
    });

}


// ===============================
// UPDATE BUTTON SAAT LAGU SELESAI
// ===============================

audio.addEventListener(
    "ended",
    function() {

        playButton.textContent = "▶";

    }
);