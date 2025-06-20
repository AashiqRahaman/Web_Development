const textInput = document.getElementById("textToConvert");
const voiceSelect = document.getElementById("voiceSelect");
const errorMsg = document.getElementById("errorMsg");

const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resumeBtn = document.getElementById("resumeBtn");
const stopBtn = document.getElementById("stopBtn");

let synth = window.speechSynthesis;
let voices = [];
let utterance = null;

// Load voices dynamically
function loadVoices() {
    voices = synth.getVoices();
    voiceSelect.innerHTML = "";
    voices.forEach((voice, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
    });
}

// Wait for voices to be available
synth.onvoiceschanged = loadVoices;

// Play speech
playBtn.addEventListener("click", () => {
    const text = textInput.value.trim();
    if (!text) {
        errorMsg.textContent = "⚠️ Please enter some text!";
        return;
    }

    if (synth.speaking) synth.cancel();

    errorMsg.textContent = "";
    utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voices[voiceSelect.value];
    synth.speak(utterance);
});

// Pause speech
pauseBtn.addEventListener("click", () => {
    if (synth.speaking && !synth.paused) {
        synth.pause();
    }
});

// Resume speech
resumeBtn.addEventListener("click", () => {
    if (synth.paused) {
        synth.resume();
    }
});

// Stop speech
stopBtn.addEventListener("click", () => {
    if (synth.speaking) {
        synth.cancel();
    }
});
