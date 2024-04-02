const TITLE_PREFIX = "Ryn - ";
const AUDIO_PATH = "assets/audio/";
const AUDIOS = [
    {
        file: "GameBitch.mp3",
        title: "GameBitch™",
        year: "2021"
    },
    {
        file: "CeremonialFunk.mp3",
        title: "Ceremonial Funk",
        year: "2021"
    },
    {
        file: "ADeeperLove.mp3",
        title: "A Deeper Love",
        year: "2022"
    },
    {
        file: "4AM.mp3",
        title: "4 AM",
        year: "2022"
    },
    {
        file: "IDontKnowIfIWantToGoYet.mp3",
        title: "I Don't Know If I Want To Go Yet",
        year: "2022"
    },
    {
        file: "MaybeIt'llGetBetter.mp3",
        title: "Maybe It'll Get Better",
        year: "2022"
    },
    {
        file: "HouseOfPianoHouse.mp3",
        title: "House of Piano House",
        year: "2022"
    },
    {
        file: "PianoBeat.mp3",
        title: "Piano Beat",
        year: "2022"
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
        file: "I'mGonnaDishYouRightNow.mp3",
        title: "I'm Gonna Dish You Right Now!",
        year: "2023"
    },
    {
        file: "ItBeLikeThat.mp3",
        title: "It Be Like That",
        year: "2023"
    },
    {
        file: "Gutted.mp3",
        title: "Gutted",
        year: "2023"
    },
    {
        file: "Down.mp3",
        title: "Down",
        year: "2023"
    },
    {
        file: "Transfiguration.wav",
        title: "Transfiguration",
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
    },
    {
        file: "ItMightBeGettingBetter.mp3",
        title: "It (Might) Be Getting Better",
        year: "2024"
    },
    {
        file: "Recovery.mp3",
        title: "Recovery",
        year: "2024"
    },
    {
        file: "ImPerfect.mp3",
        title: "I'm Perfect!",
        year: "2024"
    },
    {
        file: "MakesUsStronger.mp3",
        title: "Makes Us Stronger",
        year: "2024"
    }
];


class AudioManager
{
    #songIndex = AUDIOS.length - 1;
    #audio = undefined;
    #shuffling = false;
    #looping = false;
    #nowPlaying = undefined;


    constructor(nowPlaying)
    {
        this.#nowPlaying = nowPlaying;
        this.#audio = new Audio(AUDIO_PATH + AUDIOS[this.#songIndex].file);
        this.#audio.id = "audio-player";

        this.#audio.onended = async () =>
        {
            if (this.#looping)
            {
                await this.#audio.play();
            }
            else
            {
                await this.moveToNextOrPreviousSong(true);
            }
        }
    }


    getAudio()
    {
        return this.#audio;
    }


    getTitle()
    {
        const currentAudio = AUDIOS[this.#songIndex];
        return TITLE_PREFIX + currentAudio.title + ` (${currentAudio.year})`
    }


    isPlaying()
    {
        return !this.#audio.paused;
    }


    async play()
    {
        await this.#audio.play();
        console.log("now playing");
    }


    pause()
    {
        this.#audio.pause();
    }


    skipBackwardsOrForward(isForwards, seconds)
    {
        this.#audio.currentTime += isForwards ? seconds : -seconds;
    }


    getAudioProgressPercent()
    {
        return this.#audio.currentTime / this.#audio.duration;
    }


    setAudioProgressByPercent(percent)
    {
        this.#audio.currentTime = this.#audio.duration * percent;
    }


    async moveToNextOrPreviousSong(isNext)
    {
        this.#nowPlaying.textContent = "";

        if (this.#shuffling)
        {
            this.#songIndex = Math.floor(Math.random() * AUDIOS.length);
        }
        else
        {
            this.#songIndex += isNext ? -1 : 1;

            if (this.#songIndex < 0)
                this.#songIndex = AUDIOS.length - 1;
            else if (this.#songIndex === AUDIOS.length)
                this.#songIndex = 0;
        }

        const currentAudio = AUDIOS[this.#songIndex];
        this.#audio.src = AUDIO_PATH + currentAudio.file;
        await this.#audio.play();

        this.#nowPlaying.textContent = this.getTitle();
    }


    setShuffling(enabled)
    {
        this.#shuffling = enabled;
    }


    isShuffling()
    {
        return this.#shuffling;
    }


    setLooping(enabled)
    {
        this.#looping = enabled;
    }


    isLooping()
    {
        return this.#looping;
    }
}


export { AudioManager };