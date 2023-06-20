const AUDIO_PATH = "assets/audio/";
const AUDIO_FILE_NAMES = ["ItBeLikeThat.mp3", "4AM.mp3", "ADeeperLove.mp3", "CeremonialFunk.mp3", "Down.mp3", "GameBitch.mp3", "Gutted.mp3", "It'llBeFine.mp3", "It'sAlwaysTheSame.mp3", "MaybeIt'llGetBetter.mp3", "PianoBeat.mp3"];
const TRACK_NAMES = ["It Be Like That", "4 AM", "A Deeper Love", "Ceremonial Funk", "Down", "GameBitch™", "Gutted", "It'll Be Fine", "It's Always the Same", "Maybe It'll Get Better", "Piano Beat"];
const BAR_COLOR = "#f84b15";
const BUTTON_PLAY_TEXT = "PLAY";
const BUTTON_PAUSE_TEXT = "PAUSE";
const SKIP_AMOUNT_SECONDS = 15;


const backwardsButton = document.querySelector("#backward-button");
const prevButton = document.querySelector("#prev-button");
const playPauseButton = document.querySelector("#play-pause-button");
const nextButton = document.querySelector("#next-button");
const forwardButton = document.querySelector("#forward-button");
const nowPlaying = document.querySelector("#now-playing");


let canvas;
let canvasContext;
let context = undefined;
let analyser;
const barWidth = 2;
const audio = new Audio();
audio.id = "audio-player";
audio.loop = true;
let songIndex = Math.floor(Math.random() * AUDIO_FILE_NAMES.length);
audio.src = AUDIO_PATH + AUDIO_FILE_NAMES[songIndex];


function playOrPause()
{
    const toggleableElements = document.querySelectorAll(".toggleable");
    for (let i = 0; i < toggleableElements.length; ++i)
    {
        const el = toggleableElements[i];
        el.style.display = audio.paused ? "block" : "none";
    }

    nowPlaying.textContent = TRACK_NAMES[songIndex];
    playPauseButton.textContent = audio.paused ? BUTTON_PAUSE_TEXT : BUTTON_PLAY_TEXT;
    audio.paused ? audio.play() : audio.pause();
}


function prevOrNextSong(isPrev)
{
    songIndex += isPrev ? -1 : 1;

    if (songIndex < 0)
        songIndex = AUDIO_FILE_NAMES.length - 1;
    else if (songIndex === AUDIO_FILE_NAMES.length)
        songIndex = 0;

    audio.src = AUDIO_PATH + AUDIO_FILE_NAMES[songIndex];
    nowPlaying.textContent = TRACK_NAMES[songIndex];
    audio.play();
}


playPauseButton.addEventListener("click", () => playOrPause());
window.addEventListener("keydown", event =>
{
    if (event.key === " ")
        playOrPause();
    else if (event.key === "ArrowLeft" && !audio.paused)
    {
        prevOrNextSong(true);
    }
    else if (event.key === "ArrowRight" && !audio.paused)
    {
        prevOrNextSong(false);
    }
});


backwardsButton.addEventListener("click", () => audio.currentTime -= SKIP_AMOUNT_SECONDS);
forwardButton.addEventListener("click", () => audio.currentTime += SKIP_AMOUNT_SECONDS);


prevButton.addEventListener("click", () => prevOrNextSong(true));
nextButton.addEventListener("click", () => prevOrNextSong(false));


window.addEventListener("resize", () => { if (canvas) canvas.width = window.innerWidth; });


window.addEventListener("load", () =>
{
    document.getElementById("eq-audio").appendChild(audio);

    canvas = document.getElementById("eq-canvas");
    canvas.width = window.innerWidth;

    playPauseButton.textContent = BUTTON_PLAY_TEXT;

    document.getElementById("audio-player").onplay = () =>
    {
        if (context === undefined)
        {
            context = new AudioContext();
            analyser = context.createAnalyser();

            canvasContext = canvas.getContext("2d");
            const source = context.createMediaElementSource(audio);

            source.connect(analyser);
            analyser.connect(context.destination);
        }

        animate();
    }
}, false);


function animate()
{
    window.RequestAnimationFrame =
        window.requestAnimationFrame(animate) || window.msRequestAnimationFrame(animate) ||
        window.mozRequestAnimationFrame(animate) || window.webkitRequestAnimationFrame(animate);

    const fbcArray = new Uint8Array(analyser.frequencyBinCount);
    const barCount = window.innerWidth / 2;

    analyser.getByteFrequencyData(fbcArray);

    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvasContext.fillStyle = BAR_COLOR;

    for (let i = 0; i < barCount; ++i)
    {
        const barPos = i * 4;
        const barHeight = -(fbcArray[i] / 2);
        canvasContext.fillRect(barPos, canvas.height, barWidth, barHeight);
    }
}