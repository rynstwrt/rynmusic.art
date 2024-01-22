const BAR_COLOR = "#f84b15";
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
    {
        file: "I'mGonnaDishYouRightNow.mp3",
        title: "I'm Gonna Dish You Right Now!",
        year: "2023"
    },
    {
        file: "Growing.mp3",
        title: "Growing",
        year: "2023"
    },
    {
        file: "ICantBelieveThisHappened.mp3",
        title: "I Can't Believe This Happened",
        year: "2023"
    },
    {
        file: "OnMyMind.mp3",
        title: "On My Mind",
        year: "2023"
    },
    {
        file: "Amalgam.mp3",
        title: "Amalgam",
        year: "2023"
    },
    {
        file: "WhatIfYouFly.mp3",
        title: "What If You Fly?",
        year: "2024"
    }
];


const logoContainer = document.querySelector("#logo-container");

const backwardsButton = document.querySelector("#backward-button");
const prevButton = document.querySelector("#prev-button");
const playPauseButton = document.querySelector("#play-pause-button");
const nextButton = document.querySelector("#next-button");
const forwardButton = document.querySelector("#forward-button");

const playIcon = document.querySelector("#play-icon");
const pauseIcon = document.querySelector("#pause-icon");

const nowPlaying = document.querySelector("#now-playing");
const sliderContainer = document.querySelector("#progress-bar");
const slider = document.querySelector("#progress-slider");

let canvas;
let canvasContext;
let context = undefined;
let analyser;
const barWidth = 2;

let songIndex;
let audio;


function playOrPause()
{
    const toggleableElements = document.querySelectorAll(".toggleable");
    for (let i = 0; i < toggleableElements.length; ++i)
    {
        const el = toggleableElements[i];

        if (audio.paused)
        {
            el.style.opacity = "1";
            el.style.visibility = "visible";
        }
        else
        {
            el.addEventListener("transitionend", () => el.style.visibility = "hidden", {once: true});
            el.style.opacity = "0";
        }
    }

    playIcon.style.display = audio.paused ? "none" : "block";
    pauseIcon.style.display = audio.paused ? "block" : "none";

    if (audio.paused)
    {
        audio.play().then(() =>
        {
            console.log("now playing");
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
}


function prevOrNextSong(isPrev)
{
    nowPlaying.textContent = "";
    songIndex += isPrev ? -1 : 1;

    if (songIndex < 0)
        songIndex = AUDIOS.length - 1;
    else if (songIndex === AUDIOS.length)
        songIndex = 0;

    const currentAudio = AUDIOS[songIndex];
    audio.src = AUDIO_PATH + currentAudio.file;
    audio.play().then(() =>
    {
        nowPlaying.textContent = TITLE_PREFIX + currentAudio.title + ` (${currentAudio.year})`;
    });
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


sliderContainer.addEventListener("click", event =>
{
    const bounding = sliderContainer.getBoundingClientRect();
    const x = event.clientX - bounding.left;

    const newProportion = x / sliderContainer.clientWidth;
    audio.currentTime = audio.duration * newProportion;
});


window.addEventListener("load", () =>
{
    songIndex = Math.floor(Math.random() * AUDIOS.length);
    audio = new Audio(AUDIO_PATH + AUDIOS[songIndex].file);
    audio.id = "audio-player";

    document.getElementById("eq-audio").appendChild(audio);

    canvas = document.getElementById("eq-canvas");
    canvas.width = window.innerWidth;

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

            console.log("set up");
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

    const average = fbcArray.reduce((a, b) => a + b) / fbcArray.length;
    logoContainer.style.transform = `scale(${1 + average / 1000})`;

    const percent = audio.currentTime / audio.duration;
    slider.style.width = `${sliderContainer.clientWidth * percent}px`;
}


window.addEventListener("resize", () => { if (canvas) canvas.width = window.innerWidth; });