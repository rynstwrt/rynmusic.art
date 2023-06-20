const AUDIO_PATH = "assets/audio/";
const AUDIO_FILE_NAMES = ["ItBeLikeThat.mp3"];
const BAR_COLOR = "#f84b15";
const BUTTON_PLAY_TEXT = "PLAY";
const BUTTON_PAUSE_TEXT = "PAUSE";


const playPauseButton = document.querySelector("#play-pause-button");
let canvas;
let canvasContext;
let context = undefined;
let analyser;
const barWidth = 2;
const audio = new Audio();
audio.id = "audio-player";
audio.src = AUDIO_PATH + AUDIO_FILE_NAMES[Math.floor(Math.random() * AUDIO_FILE_NAMES.length)];


playPauseButton.addEventListener("click", () =>
{
    audio.paused ? audio.play() : audio.pause();
    playPauseButton.textContent = audio.paused ? BUTTON_PLAY_TEXT : BUTTON_PAUSE_TEXT;
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