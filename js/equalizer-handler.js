const BAR_COLOR = "#f84b15";
const BUTTON_PLAY_TEXT = "PLAY";
const BUTTON_PAUSE_TEXT = "PAUSE";
const SKIP_AMOUNT_SECONDS = 15;
const TITLE_PREFIX = "Ryn - ";
const AUDIO_PATH = "assets/audio/";
const AUDIOS = [
    {
        file: "ItBeLikeThat.mp3",
        title: "It Be Like That",
        year: "2023"
    },
    {
        file: "4AM.mp3",
        title: "4 AM",
        year: "2022"
    },
    {
        file: "ADeeperLove.mp3",
        title: "A Deeper Love",
        year: "2022"
    },
    {
        file: "CeremonialFunk.mp3",
        title: "Ceremonial Funk",
        year: "2021"
    },
    {
        file: "Down.mp3",
        title: "Down",
        year: "2023"
    },
    {
        file: "GameBitch.mp3",
        title: "GameBitch™",
        year: "2021"
    },
    {
        file: "Gutted.mp3",
        title: "Gutted",
        year: "2023"
    },
    {
        file: "It'llBeFine.mp3",
        title: "It'll Be Fine",
        year: "2022"
    },
    {
        file: "It'sAlwaysTheSame.mp3",
        title: "It's Always the Same",
        year: "2022"
    },
    {
        file: "MaybeIt'llGetBetter.mp3",
        title: "Maybe It'll Get Better",
        year: "2022"
    },
    {
        file: "PianoBeat.mp3",
        title: "Piano Beat",
        year: "2022"
    },
    {
        file: "Transfiguration.wav",
        title: "Transfiguration",
        year: "2023"
    },
];


const backwardsButton = document.querySelector("#backward-button");
const prevButton = document.querySelector("#prev-button");
const playPauseButton = document.querySelector("#play-pause-button");
const nextButton = document.querySelector("#next-button");
const forwardButton = document.querySelector("#forward-button");
const nowPlaying = document.querySelector("#now-playing");
const sliderContainer = document.querySelector("#progress-bar");
const slider = document.querySelector("#progress-slider");


let canvas;
let canvasContext;
let context = undefined;
let analyser;
const barWidth = 2;
const audio = new Audio();
audio.id = "audio-player";
let songIndex = Math.floor(Math.random() * AUDIOS.length);
audio.src = AUDIO_PATH + AUDIOS[songIndex].file;


backwardsButton.textContent = `-${SKIP_AMOUNT_SECONDS}s`;
forwardButton.textContent = `+${SKIP_AMOUNT_SECONDS}s`;


function playOrPause()
{
    nowPlaying.textContent = "Loading...";

    const toggleableElements = document.querySelectorAll(".toggleable");
    for (let i = 0; i < toggleableElements.length; ++i)
    {
        const el = toggleableElements[i];
        el.style.display = audio.paused ? "block" : "none";
    }

    playPauseButton.textContent = audio.paused ? BUTTON_PAUSE_TEXT : BUTTON_PLAY_TEXT;

    if (audio.paused)
    {
        audio.play().then(() =>
        {
            const currentAudio = AUDIOS[songIndex];
            nowPlaying.textContent = TITLE_PREFIX + currentAudio.title + ` (${currentAudio.year})`;
        });
    }
    else
    {
        audio.pause();
    }
}


function skipBackwardsOrForward(isBackward)
{
    audio.currentTime += isBackward ? SKIP_AMOUNT_SECONDS : -SKIP_AMOUNT_SECONDS;
    console.log(audio.currentTime, audio.duration)
}


function prevOrNextSong(isPrev)
{
    songIndex += isPrev ? -1 : 1;

    if (songIndex < 0)
        songIndex = AUDIOS.length - 1;
    else if (songIndex === AUDIOS.length)
        songIndex = 0;

    const currentAudio = AUDIOS[songIndex];
    audio.src = AUDIO_PATH + currentAudio.file;
    nowPlaying.textContent = TITLE_PREFIX + currentAudio.title + ` (${currentAudio.year})`;
    audio.play();
}
playPauseButton.addEventListener("click", () => playOrPause());


window.addEventListener("keydown", event =>
{
    if (event.key === " ")
        playOrPause();
    else if (event.key === "ArrowLeft" && !audio.paused)
        skipBackwardsOrForward(false);
    else if (event.key === "ArrowRight" && !audio.paused)
        skipBackwardsOrForward(true);
});


prevButton.addEventListener("click", () => prevOrNextSong(true));
backwardsButton.addEventListener("click", () => skipBackwardsOrForward(false));
forwardButton.addEventListener("click", () => skipBackwardsOrForward(true));
nextButton.addEventListener("click", () => prevOrNextSong(false));


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

    audio.onended = () =>
    {
        prevOrNextSong(false);
    }
}, false);


function animate()
{
    window.RequestAnimationFrame = window.requestAnimationFrame(animate)
                                || window.msRequestAnimationFrame(animate)
                                || window.mozRequestAnimationFrame(animate)
                                || window.webkitRequestAnimationFrame(animate);

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

    const percent = audio.currentTime / audio.duration;
    slider.style.width = `${sliderContainer.clientWidth * percent}px`;
}


window.addEventListener("resize", () => { if (canvas) canvas.width = window.innerWidth; });