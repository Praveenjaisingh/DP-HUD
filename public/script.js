let commandBuffer = "";
let state = "idle";
let audioUnlocked = false;
let welcomePlayed = false;

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;
if (!SpeechRecognition) {
    alert("Speech Recognition not supported");
}

const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = false;
recognition.lang = "en-IN";
function setStatus(msg) {
    document.getElementById("status").innerText = msg;
}

function setLive(msg) {
    document.getElementById("liveText").innerText = msg;
}

function unlockAudio() {

    if (audioUnlocked) return;
    try {
        audioUnlocked = true;
        if (!welcomePlayed) {
            welcomePlayed = true;
            const s = new SpeechSynthesisUtterance(
                "Yes boss, what can I do for you?"
            );
            s.volume = 1;
            s.rate = 1;
            s.pitch = 1;
            s.lang = "en-IN";
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(s);
        }
        document.removeEventListener(
            "click",
            unlockAudio
        );
        document.removeEventListener(
            "keydown",
            unlockAudio
        );
    } catch (e) {
        console.log(e);
    }
}

document.addEventListener("click", unlockAudio);
document.addEventListener("keydown", unlockAudio);

function startMic() {
    try {
        recognition.start();
        state = "listening";
    } catch (e) { }
}
function stopMic() {
    try {
        recognition.stop();
    } catch (e) { }
}
function speak(text, callback) {
    if (!audioUnlocked) {
        console.log("Audio blocked until user gesture");
        return;
    }
    stopMic();
    state = "speaking";
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 1;
    msg.pitch = 1;
    msg.volume = 1;
    msg.lang = "en-IN";
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
        voices.find(v => v.name.includes("Google")) ||
        voices.find(v => v.name.includes("Microsoft")) ||
        voices.find(v => v.lang.includes("en-IN")) ||
        voices[0];
    if (preferredVoice) {
        msg.voice = preferredVoice;
    }
    msg.onerror = (e) => {
        console.log("Speech error:", e);
        setTimeout(() => {
            if (audioUnlocked) {
                window.speechSynthesis.speak(
                    new SpeechSynthesisUtterance(text)
                );
            }
        }, 500);
    };

    msg.onstart = () => {
        setLive("🔊 Speaking...");
    };

    msg.onend = () => {
        setTimeout(() => {
            state = "listening";
            startMic();
            if (callback) callback();
        }, 800);
    };

    setTimeout(() => {
        window.speechSynthesis.speak(msg);
    }, 200);
}

function cleanForVoice(text) {
    return text
        .replace(/https?:\/\/\S+/g, "")
        .replace(/[^\w\s.,!?-]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

async function searchData() {
    const input = document.getElementById("query");
    const query = input.value.trim();
    if (!query) return;
    const results = document.getElementById("results");
    setStatus("🧠 Processing...");
    state = "processing";
    try {
        const res = await fetch("/api/users/home", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ query })
        });
        const data = await res.json();
        results.innerHTML = "";
        const card = document.createElement("div");
        card.className = "card";
        let html = `<b>🤖 DP RESPONSE</b><br><br>`;
        let voiceResponse = "";
        if (data.data?.city) {
            html += `🌍 ${data.data.city}<br>🌡 ${data.data.temperature}`;
            voiceResponse =
                `The weather in ${data.data.city} is ${data.data.temperature}`;
        } else if (Array.isArray(data.data?.news)) {
            data.data.news.forEach((n, i) => {
                html += `<p>${i + 1}. ${n}</p>`;
            });
            voiceResponse =
                data.data.news.slice(0, 5).join(". ");
        } else if (Array.isArray(data.data?.results)) {
            data.data.results.forEach((r, i) => {
                html += `<p>${i + 1}. ${r}</p>`;
            });
            voiceResponse =
                data.data.results.slice(0, 5).join(". ");
        } else {
            html += `<pre>${JSON.stringify(data.data, null, 2)}</pre>`;
            voiceResponse =
                JSON.stringify(data.data);
        }
        card.innerHTML = html;
        results.appendChild(card);
        input.value = "";
        commandBuffer = "";
        setStatus("🎤 Say 'Hey DP Wake Up'");
        setLive("Ready");
        state = "idle";
        speak(
            cleanForVoice(
                voiceResponse || "Command executed successfully"
            )
        );
    } catch (err) {
        console.log(err);
        setStatus("❌ Error");
        setLive("Error");
        state = "idle";
        speak("Something went wrong");
    }
}

recognition.onresult = async (event) => {

    let text = "";
    for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
    ) {
        if (event.results[i].isFinal) {
            text += event.results[i][0].transcript + " ";
        }
    }

    const cleanText = text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");
    if (!cleanText) return;
    console.log("HEARD:", cleanText);

    const wake =
        /hey dp wake up|dp wake up|hey dp wake/i
            .test(cleanText);

    const execute =
        cleanText.includes("execute") ||
        cleanText.includes("run command") ||
        cleanText.includes("process it") ||
        cleanText.includes("that's all");

    if (state === "idle" && wake) {
        state = "speaking";
        commandBuffer = "";
        document
            .getElementById("aiCore")
            .classList.add("active");
        setStatus("🤖 Online");
        setLive("Waking up...");
        stopMic();
        if (!welcomePlayed) {
            welcomePlayed = true;
            setTimeout(() => {
                speak(
                    "Yes boss, what can I do for you?"
                );
            }, 300);

        } else {
            state = "listening";
            startMic();
        }

        return;
    }

    if (state !== "listening") return;
    if (execute) {
        document
            .getElementById("aiCore")
            .classList.remove("active");
        document
            .getElementById("query")
            .value = commandBuffer;
        setStatus("🧠 Executing...");
        setLive("Processing...");
        await searchData();
        return;
    }
    const processed = cleanText
        .replace(/hey dp wake up/g, "")
        .replace(/dp wake up/g, "")
        .replace(/hey dp wake/g, "")
        .replace(/execute/g, "")
        .trim();

    if (!processed) return;
    commandBuffer =
        (commandBuffer + " " + processed).trim();
    if (commandBuffer.length > 200) {
        commandBuffer =
            commandBuffer.slice(-200);
    }

    document.getElementById("query").value =
        commandBuffer;
    setStatus("🎤 Recording...");
    setLive(commandBuffer);
};
recognition.onend = () => {
    setTimeout(() => {
        if (state === "listening") {
            startMic();
        }
    }, 700);
};
setStatus(
    "🎤 Click anywhere once, then say 'Hey DP Wake Up'"
);

startMic();