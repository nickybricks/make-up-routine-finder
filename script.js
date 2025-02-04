function saveToGoogleSheet() {
    const dataToSend = {
        answers: answers.map(answer => answer.text)
    };

    console.log("Daten an Google Sheets senden:", dataToSend);

    fetch("https://script.google.com/macros/s/AKfycbwhWsn1FWHUVFIrwHWqWPdBHT4KepLScY_K3ztEE30f6q2UUU2wYUDdNrp9om4hIz7A/exec", {
        method: "POST",
        mode: "no-cors",  // WICHTIG: Damit der Request verarbeitet wird
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataToSend)
    })
    .then(() => console.log("Antwort erfolgreich gesendet."))
    .catch(error => console.error("Fehler beim Senden:", error));
}



let currentQuestion = 0;
let answers = [];
let scores = {
    "everyday_glow": 0,
    "glam_night_out": 0,
    "soft_glam": 0,
    "natural_look": 0,
    "bold_and_edgy": 0,
    "romantic_look": 0,
    "minimal_makeup": 0,
    "full_glam": 0
};

const questions = [
    { text: "Für welchen Anlass suchst du dein Makeup?", options: { "Alltag": "everyday_glow", "Party": "glam_night_out", "Besondere Anlässe": "soft_glam" } },
    { text: "Welcher Look gefällt dir am meisten?", options: { "Natürlich & dezent": "natural_look", "Strahlend & glowy": "soft_glam", "Auffällig & dramatisch": "full_glam" } },
    { text: "Welche Farben trägst du am liebsten?", options: { "Neutrale Töne": "everyday_glow", "Warme Töne": "romantic_look", "Kühle Töne": "bold_and_edgy" } },
    { text: "Welcher Hautton passt am ehesten zu dir?", options: { "Heller Teint": "soft_glam", "Mittlerer Teint": "everyday_glow", "Dunkler Teint": "full_glam" } }
];

function renderQuestion() {
    const questionData = questions[currentQuestion];
    document.getElementById("question-text").innerText = questionData.text;
    const optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = "";
    
    for (const [key, value] of Object.entries(questionData.options)) {
        const button = document.createElement("button");
        button.innerText = key;
        button.onclick = function() { selectAnswer(button, value); };
        optionsContainer.appendChild(button);
    }
    document.getElementById("back-button").style.display = currentQuestion > 0 ? "block" : "none";
}

function selectAnswer(button, answerKey) {
    document.querySelectorAll(".options button").forEach(btn => btn.classList.remove("selected"));
    button.classList.add("selected");
    answers[currentQuestion] = { key: answerKey, text: button.innerText };  // Speichere beides
}



function nextQuestion() {
    if (answers[currentQuestion]) {
        scores[answers[currentQuestion].key] += 1;  // Punkte basierend auf dem Key vergeben
        currentQuestion++;
        if (currentQuestion < questions.length) {
            renderQuestion();
        } else {
            showResult();
        }
    } else {
        alert("Bitte eine Antwort auswählen.");
    }
}


function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion();
    }
}


function showResult() {
    let bestSets = Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, 2);

    let resultHTML = "<p>Danke für deine Antworten! Deine empfohlenen Makeup-Sets:</p><div class='set-container'>";

    bestSets.forEach(([key]) => {
        let set = productLinks[key];
        if (set) {
            resultHTML += `<div class='set'>
                            <a href="${set.url}" target="_blank">
                                <img src="${set.img}" alt="${set.name}">
                                <p>${set.name}</p>
                            </a>
                          </div>`;
        } else {
            resultHTML += `<div class='set'><p>Standard Set</p></div>`;
        }
    });

    resultHTML += "</div>";
    document.getElementById("quiz").style.display = "none";
    document.getElementById("result").style.display = "block";
    document.getElementById("result").innerHTML = resultHTML;

    saveToGoogleSheet(); // ✅ Hier wird nur noch saveToGoogleSheet() aufgerufen
    document.getElementById("restart-button").style.display = "block";
}



const productLinks = {
    "everyday_glow": { "name": "Everyday Glow Set", "url": "#", "img": "placeholder1.jpg" },
    "glam_night_out": { "name": "Glam Night Out Set", "url": "#", "img": "placeholder2.jpg" },
    "soft_glam": { "name": "Soft Glam Set", "url": "#", "img": "placeholder3.jpg" },
    "natural_look": { "name": "Natural Look Set", "url": "#", "img": "placeholder4.jpg" },
    "bold_and_edgy": { "name": "Bold & Edgy Set", "url": "#", "img": "placeholder5.jpg" },
    "romantic_look": { "name": "Romantic Glow Set", "url": "#", "img": "placeholder6.jpg" },
    "minimal_makeup": { "name": "Minimal Makeup Set", "url": "#", "img": "placeholder7.jpg" },
    "full_glam": { "name": "Full Glam Set", "url": "#", "img": "placeholder8.jpg" }
};
  
function restartQuiz() {
    currentQuestion = 0;
    answers = [];
    for (let key in scores) {
        scores[key] = 0; // Setzt alle Punkte zurück
    }
    document.getElementById("result").style.display = "none";
    document.getElementById("quiz").style.display = "block";
    document.getElementById("restart-button").style.display = "none";
    renderQuestion(); // Quiz von vorne starten
}

document.addEventListener("DOMContentLoaded", function() {
    renderQuestion();


});