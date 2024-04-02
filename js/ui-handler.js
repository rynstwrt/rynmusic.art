import { AudioManager } from "./audio-manager.js";

const BAR_COLOR = "#f84b15";
const SKIP_AMOUNT_SECONDS = 15;

const logoContainer = document.querySelector("#logo-container");

const backwardsButton = document.querySelector("#backward-button");
const prevButton = document.querySelector("#prev-button");
const playPauseButton = document.querySelector("#play-pause-button");
const nextButton = document.querySelector("#next-button");
const forwardButton = document.querySelector("#forward-button");
const shuffleButton = document.querySelector("#shuffle-button");
const loopButton = document.querySelector("#loop-button");

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

let audioManager;


// TODO: FIX VISIBILITY ERROR WHEN SPAM CLICKING PLAY/PAUSE BUTTON
function playOrPause()
{
    const toggleableElements = document.querySelectorAll(".toggleable");
    for (let i = 0; i < toggleableElements.length; ++i)
    {
        const el = toggleableElements[i];

        if (!audioManager.isPlaying())
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

    playIcon.style.display = audioManager.isPlaying() ? "block" : "none";
    pauseIcon.style.display = audioManager.isPlaying() ? "none" : "block";

    if (!audioManager.isPlaying())
    {
        audioManager.play().then(() =>
        {
            nowPlaying.textContent = audioManager.getTitle();
        });
    }
    else
    {
        audioManager.pause();
    }
}
playPauseButton.addEventListener("click", () => playOrPause());


loopButton.addEventListener("click", () =>
{
    if (audioManager.isLooping())
    {
        audioManager.setLooping(false);
        loopButton.classList.remove("pressed");
    }
    else
    {
        audioManager .setLooping(true);
        loopButton.classList.add("pressed");
    }
});


shuffleButton.addEventListener("click", () =>
{
    if (audioManager.isShuffling())
    {
        audioManager.setShuffling(false);
        shuffleButton.classList.remove("pressed");
    }
    else
    {
        audioManager.setShuffling(true);
        shuffleButton.classList.add("pressed");
    }
});


window.addEventListener("keydown", event =>
{
    if (event.key === " ")
        playOrPause();
    else if (event.key === "ArrowLeft" && audioManager.isPlaying())
        audioManager.skipBackwardsOrForward(false, SKIP_AMOUNT_SECONDS);
    else if (event.key === "ArrowRight" && audioManager.isPlaying())
        audioManager.skipBackwardsOrForward(true, SKIP_AMOUNT_SECONDS);
});


prevButton.addEventListener("click", () => audioManager.moveToNextOrPreviousSong(false));
backwardsButton.addEventListener("click", () => audioManager.skipBackwardsOrForward(false, SKIP_AMOUNT_SECONDS));
forwardButton.addEventListener("click", () => audioManager.skipBackwardsOrForward(true, SKIP_AMOUNT_SECONDS));
nextButton.addEventListener("click", () => audioManager.moveToNextOrPreviousSong(true));


sliderContainer.addEventListener("click", event =>
{
    const bounding = sliderContainer.getBoundingClientRect();
    const x = event.clientX - bounding.left;

    const newProportion = x / sliderContainer.clientWidth;
    audioManager.setAudioProgressByPercent(newProportion);
});


window.addEventListener("load", () =>
{
    audioManager = new AudioManager(nowPlaying);
    const audio = audioManager.getAudio();

    document.querySelector("#eq-audio").appendChild(audio);

    canvas = document.getElementById("eq-canvas");
    canvas.width = window.innerWidth;

    document.getElementById("audio-player").onplay = () =>
    {
        // context = new AudioContext();
        // analyser = context.createAnalyser();
        //
        // canvasContext = canvas.getContext("2d");
        // const source = context.createMediaElementSource(audio);
        //
        // source.connect(analyser);
        // analyser.connect(context.destination);
        //
        // console.log("set up");
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
    console.log(average);
    logoContainer.style.transform = `scale(${1 + average / 1000})`;

    const percent = audioManager.getAudioProgressPercent();
    slider.style.width = `${sliderContainer.clientWidth * percent}px`;
}


window.addEventListener("resize", () => { if (canvas) canvas.width = window.innerWidth; });