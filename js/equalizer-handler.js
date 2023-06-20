const AUDIO_PATH = "assets/audio/";
const AUDIO_FILE_NAMES = ["ItBeLikeThat.mp3"];
const BAR_COLOR = "#f84b15";
const BUTTON_PLAY_TEXT = "PLAY";
const BUTTON_PAUSE_TEXT = "PAUSE";
const SKIP_AMOUNT_SECONDS = 15;


const backwardsButton = document.querySelector("#backward-button");
const prevButton = document.querySelector("#prev-button");
const playPauseButton = document.querySelector("#play-pause-button");
const nextButton = document.querySelector("#next-button");
const forwardButton = document.querySelector("#forward-button");


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


playPauseButton.addEventListener("click", () =>
{
    const toggleableElements = document.querySelectorAll(".toggleable");
    for (let i = 0; i < toggleableElements.length; ++i)
    {
        const el = toggleableElements[i];
        el.style.display = audio.paused ? "block" : "none";
    }

    playPauseButton.textContent = audio.paused ? BUTTON_PAUSE_TEXT : BUTTON_PLAY_TEXT;
    audio.paused ? audio.currentTime = 0 : undefined;
    audio.paused ? audio.play() : audio.pause();
});


backwardsButton.addEventListener("click", () =>
{
    audio.currentTime -= SKIP_AMOUNT_SECONDS;
});


forwardButton.addEventListener("click", () =>
{
    audio.currentTime += SKIP_AMOUNT_SECONDS;
});


prevButton.addEventListener("click", () =>
{
    --songIndex;

    if (songIndex < 0)
        songIndex = AUDIO_FILE_NAMES.length - 1;

    audio.src = AUDIO_PATH + AUDIO_FILE_NAMES[songIndex];
    audio.play();
});


nextButton.addEventListener("click", () =>
{
    ++songIndex;

    if (songIndex === AUDIO_FILE_NAMES.length)
        songIndex = 0;

    audio.src = AUDIO_PATH + AUDIO_FILE_NAMES[songIndex];
    audio.play();
});



window.addEventListener("resize", () =>
{
    if (canvas)
        canvas.width = window.innerWidth;
});


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