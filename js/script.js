/* ==================================================
   ELEMENTOS PRINCIPALES
================================================== */

const startScreen =
    document.getElementById("start-screen");

const loadingScreen =
    document.getElementById("loading-screen");

const levelUpScreen =
    document.getElementById("level-up-screen");

const mainScreen =
    document.getElementById("main-screen");

const finalScreen =
    document.getElementById("final-screen");


const startButton =
    document.getElementById("start-button");


const backgroundMusic =
    document.getElementById("background-music");


const particles =
    document.getElementById("particles");


/* ==================================================
   ESTADO DEL JUEGO
================================================== */

/*
    Aquí guardamos todo lo que el jugador
    ha hecho.

    Esto es lo que convierte nuestra página
    en una pequeña experiencia interactiva.
*/

const gameState = {

    level: 1,

    messageSeen: false,

    profileSeen: false,

    skillsSeen: false,

    secretUnlocked: false,

    eventCompleted: false

};


/* ==================================================
   CONFIGURACIÓN DE NIVELES
================================================== */

const levelMessages = {

    2: "MESSAGE DATABASE ACCESSED",

    3: "PLAYER PROFILE DISCOVERED",

    4: "SKILL DATABASE ACCESSED",

    5: "ALL MAIN DATA DISCOVERED",

    6: "SECRET CONDITION COMPLETE",

    7: "SPECIAL CONNECTION ESTABLISHED",

    8: "MAXIMUM CONFIDANT APPROACHING",

    9: "CONNECTION CANNOT BE MEASURED",

    10: "MAX CONFIDANT"
};


/* ==================================================
   CAMBIAR DE PANTALLA
================================================== */

function showScreen(screen) {

    document
        .querySelectorAll(".screen")
        .forEach(currentScreen => {

            currentScreen.classList.remove(
                "active"
            );

        });


    screen.classList.add("active");

}


/* ==================================================
   CREAR PARTICULAS
================================================== */

function createParticles() {

    for (let i = 0; i < 45; i++) {

        const particle =
            document.createElement("div");


        particle.classList.add(
            "particle"
        );


        particle.style.left =
            Math.random() * 100 + "%";


        particle.style.animationDuration =
            5 + Math.random() * 12 + "s";


        particle.style.animationDelay =
            Math.random() * 10 + "s";


        particle.style.opacity =
            Math.random();


        particles.appendChild(
            particle
        );

    }

}


createParticles();


/* ==================================================
   START
================================================== */

startButton.addEventListener(
    "click",
    startGame
);


function startGame() {

    /*
        Intentamos reproducir música.

        Como el usuario acaba de hacer click,
        el navegador normalmente permite
        reproducirla.
    */

    backgroundMusic
        .play()
        .catch(() => {

            console.log(
                "Music unavailable or blocked."
            );

        });


    showScreen(
        loadingScreen
    );


    loadGame();

}


/* ==================================================
   LOADING
================================================== */

function loadGame() {

    let progress = 0;


    const interval =
        setInterval(() => {

            progress +=
                Math.floor(
                    Math.random() * 8
                ) + 1;


            if (progress >= 100) {

                progress = 100;

                clearInterval(
                    interval
                );

            }


            document
                .getElementById(
                    "loading-progress"
                )
                .style.width =
                    progress + "%";


            document
                .getElementById(
                    "loading-percentage"
                )
                .textContent =
                    progress + "%";


            if (progress === 100) {

                setTimeout(() => {

                    showScreen(
                        mainScreen
                    );

                }, 500);

            }

        }, 80);

}


/* ==================================================
   MENÚ
================================================== */

const menuButtons =
    document.querySelectorAll(
        ".menu-button"
    );


menuButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const section =
                button.dataset.section;


            openPanel(section);

        }
    );

});


/* ==================================================
   ABRIR PANEL
================================================== */

function openPanel(panelId) {

    const panel =
        document.getElementById(
            panelId
        );


    /*
        Si el secreto está bloqueado,
        no permitimos entrar.
    */

    if (
        panelId === "secret" &&
        !gameState.secretUnlocked
    ) {

        playErrorEffect();

        return;

    }


    panel.classList.add(
        "active"
    );


    /*
        Marcamos qué sección ha visitado.
    */

    if (panelId === "message") {

        if (!gameState.messageSeen) {

            gameState.messageSeen = true;

            updateChecklist();

            levelUp(2);

        }

        startTyping();

    }


    if (panelId === "profile") {

        if (!gameState.profileSeen) {

            gameState.profileSeen = true;

            updateChecklist();

            levelUp(3);

        }

    }


    if (panelId === "skills") {

        if (!gameState.skillsSeen) {

            gameState.skillsSeen = true;

            updateChecklist();

            levelUp(4);

        }

    }

}


/* ==================================================
   CERRAR PANELES
================================================== */

const closeButtons =
    document.querySelectorAll(
        ".close-panel"
    );


closeButtons.forEach(button => {

    button.addEventListener(
        "click",
        closePanel
    );

});


function closePanel() {

    const panel =
        this.closest(".panel");


    panel.classList.remove(
        "active"
    );

}


/* ==================================================
   MENSAJES
================================================== */

const messagePages = [

`Hola WEON...

Después de estos añitos juntos quería felicitarte este año de una forma un poco más especial.

Así que para no decirte solo ¡¡¡felicidades!!!, te hice esto xD.
`,

`Ya ni sé exactamente cuánto tiempo llevamos...

Y aunque no suelo expresarme siempre de la mejor manera (tú menos),

eres la persona que más amo en mi vida.`,

`No quería que esto sonara super empalagoso.

Pero bueno.

Ya es demasiado tarde.`,

`Me encanta compartir mi vida contigo.

Me encantas tú.

Me encanta estar contigo, pasar tiempo juntos, ver pelis y series, jugar contigo...

(menos al Piko).`,

`Y ojalá pudiéramos pasar mas tiempo juntos.

Aunque estemos a la otra punta del mundo,

ojalá pronto podamos estar juntos y poder disfrutar de la vida, pasar mas tiempo juntos y poder viajar o simplemente valer vrg pero uno al lado del otro.`,

`Pero bueno, lo mas importante...

¡¡¡FELICIDADES, viejo kl!!!

Espero que este año te traiga cosas buenas y que cumplas todas esas metas que tienes.

Y espero estar ahí para disfrutarlas contigo.`

];


let currentMessage = 0;

let typingTimeout;


/* ==================================================
   TYPING
================================================== */

const messageElement =
    document.getElementById(
        "typed-message"
    );


const messageCounter =
    document.getElementById(
        "message-counter"
    );


function startTyping() {

    currentMessage = 0;

    showMessage(
        messagePages[currentMessage]
    );

}


function showMessage(text) {

    clearTimeout(
        typingTimeout
    );


    messageElement.textContent =
        "";


    messageCounter.textContent =
        `${currentMessage + 1} / ${messagePages.length}`;


    let index = 0;


    function typeCharacter() {

        if (
            index <
            text.length
        ) {

            messageElement.textContent +=
                text.charAt(index);


            index++;


            typingTimeout =
                setTimeout(
                    typeCharacter,
                    22
                );

        }

    }


    typeCharacter();

}


/* ==================================================
   CONTINUE
================================================== */

const nextMessage =
    document.getElementById(
        "next-message"
    );


nextMessage.addEventListener(
    "click",
    nextMessagePage
);


function nextMessagePage() {

    /*
        Si todavía está escribiendo,
        mostramos inmediatamente todo
        el texto.
    */

    if (
        messageElement.textContent !==
        messagePages[currentMessage]
    ) {

        clearTimeout(
            typingTimeout
        );


        messageElement.textContent =
            messagePages[currentMessage];

        return;

    }


    currentMessage++;


    /*
        Cuando terminamos todos
        los mensajes.
    */

    if (
        currentMessage >=
        messagePages.length
    ) {

        currentMessage = 0;

        messageElement.textContent =
            messagePages[currentMessage];

        return;

    }


    showMessage(
        messagePages[currentMessage]
    );

}


/* ==================================================
   SKILLS
================================================== */

const skills =
    document.querySelectorAll(
        ".skill-card"
    );


const skillDescription =
    document.getElementById(
        "skill-description"
    );


const skillEffect =
    document.getElementById(
        "skill-effect"
    );


const skillData = [

    {

        description:
            "Al mirar fijamente a sus oponentes, activa su heterocromía y los convierte inmediatamente en perros kls. Efecto secundario: nadie sabe cómo funciona.",

        effect:
            "EFFECT: +100% CONFUSION"

    },


    {

        description:
            "El usuario almacena pepinos en su interior y los expulsa violentamente por la boca, causando daño crítico a todos los enemigos en línea recta.",

        effect:
            "DAMAGE: ??? // DIGNITY: -100%"

    },


    {

        description:
            "No requiere explicación. Esta habilidad es exclusiva del personaje.",

        effect:
            "EFFECT: CHILENO KL"

    },


    {

        description:
            "El usuario invoca el poder ancestral de la gastronomía chilena. Pan, salchicha, tomate, palta y demás ingredientes se fusionan en una única entidad gastronómica.",

        effect:
            "ULTIMATE DAMAGE: MASSIVE"

    }

];


skills.forEach(skill => {

    skill.addEventListener(
        "click",
        () => {

            skills.forEach(
                currentSkill => {

                    currentSkill.classList.remove(
                        "selected"
                    );

                }
            );


            skill.classList.add(
                "selected"
            );


            const index =
                Number(
                    skill.dataset.skill
                );


            skillDescription.textContent =
                skillData[index].description;


            skillEffect.textContent =
                skillData[index].effect;


            if (index === 3) {

                ultimateEffect();

            }

        }
    );

});


/* ==================================================
   ULTIMATE
================================================== */

function ultimateEffect() {

    document.body.classList.add(
        "glitch"
    );


    setTimeout(() => {

        document.body.classList.remove(
            "glitch"
        );

    }, 700);

}


/* ==================================================
   CHECKLIST
================================================== */

function updateChecklist() {

    const messageCheck =
        document.getElementById(
            "check-message"
        );


    const profileCheck =
        document.getElementById(
            "check-profile"
        );


    const skillsCheck =
        document.getElementById(
            "check-skills"
        );


    if (gameState.messageSeen) {

        messageCheck.textContent =
            "✓ MESSAGE";

        messageCheck.classList.add(
            "complete"
        );

    }


    if (gameState.profileSeen) {

        profileCheck.textContent =
            "✓ PROFILE";

        profileCheck.classList.add(
            "complete"
        );

    }


    if (gameState.skillsSeen) {

        skillsCheck.textContent =
            "✓ SKILLS";

        skillsCheck.classList.add(
            "complete"
        );

    }


    checkSecretCondition();

}


/* ==================================================
   SECRET CONDITION
================================================== */

function checkSecretCondition() {

    if (

        gameState.messageSeen &&
        gameState.profileSeen &&
        gameState.skillsSeen &&
        !gameState.secretUnlocked

    ) {

        gameState.secretUnlocked =
            true;

        showSecretUnlock();
        /*
            Subimos al nivel 6.
        */

        setTimeout(() => {

            levelUp(6);

        }, 500);


        const secretButton =
            document.querySelector(
                ".secret-menu-button"
            );


        const secretStatus =
            document.getElementById(
                "secret-status"
            );


        secretButton.classList.add(
            "unlocked"
        );


        secretStatus.textContent =
            "UNLOCKED";


        secretStatus.style.color =
            "#ff2020";


        updateSecretPanel();

    }

}


/* ==================================================
   SECRET PANEL
================================================== */

function updateSecretPanel() {

    const locked =
        document.getElementById(
            "secret-locked"
        );


    const unlocked =
        document.getElementById(
            "secret-unlocked"
        );


    if (gameState.secretUnlocked) {

        locked.classList.add(
            "hidden"
        );


        unlocked.classList.remove(
            "hidden"
        );

    }

}


/* ==================================================
   LEVEL SYSTEM
================================================== */

const currentLevel =
    document.getElementById(
        "current-level"
    );


const connectionProgress =
    document.getElementById(
        "connection-progress"
    );


let levelTransitioning = false;


function levelUp(newLevel) {

    /*
        Evitamos que la misma subida
        se ejecute varias veces.
    */

    if (
        newLevel <= gameState.level ||
        levelTransitioning
    ) {

        return;

    }


    levelTransitioning = true;


    const oldLevel =
        gameState.level;


    gameState.level =
        newLevel;


    document.getElementById(
        "old-level"
    ).textContent =
        String(oldLevel).padStart(
            2,
            "0"
        );


    document.getElementById(
        "new-level"
    ).textContent =
        String(newLevel).padStart(
            2,
            "0"
        );


    document.getElementById(
        "level-message"
    ).textContent =
        levelMessages[newLevel] ||
        "CONNECTION STRENGTHENED";


    showScreen(
        levelUpScreen
    );


    setTimeout(() => {

        currentLevel.textContent =
            String(newLevel).padStart(
                2,
                "0"
            );


        const percentage =
            Math.min(
                newLevel * 10,
                100
            );


        connectionProgress.style.width =
            percentage + "%";


        showScreen(
            mainScreen
        );


        levelTransitioning = false;

    }, 1800);

}


/* ==================================================
   ERROR EFFECT
================================================== */

function playErrorEffect() {

    const secretButton =
        document.querySelector(
            ".secret-menu-button"
        );


    secretButton.classList.add(
        "glitch"
    );


    setTimeout(() => {

        secretButton.classList.remove(
            "glitch"
        );

    }, 500);

}


/* ==================================================
   COMPLETE EVENT
================================================== */

const completeButton =
    document.getElementById(
        "complete-button"
    );


completeButton.addEventListener(
    "click",
    completeEvent
);


function completeEvent() {

    gameState.eventCompleted =
        true;


    /*
        MAX CONFIDANT
    */

    gameState.level =
        10;


    currentLevel.textContent =
        "10";


    connectionProgress.style.width =
        "100%";


    /*
        Pequeña pausa dramática.
    */

    document.body.classList.add(
        "glitch"
    );


    setTimeout(() => {

        document.body.classList.remove(
            "glitch"
        );


        showScreen(
            finalScreen
        );

    }, 1000);

}


/* ==================================================
   RESTART
================================================== */

const restartButton =
    document.getElementById(
        "restart-button"
    );


restartButton.addEventListener(
    "click",
    () => {

        /*
            Reiniciamos el estado.
        */

        gameState.level = 1;

        gameState.messageSeen = false;

        gameState.profileSeen = false;

        gameState.skillsSeen = false;

        gameState.secretUnlocked = false;

        gameState.eventCompleted = false;


        currentLevel.textContent =
            "01";


        connectionProgress.style.width =
            "10%";


        document
            .querySelector(
                ".secret-menu-button"
            )
            .classList.remove(
                "unlocked"
            );


        document
            .getElementById(
                "secret-status"
            )
            .textContent =
                "LOCKED";


        updateChecklist();


        showScreen(
            startScreen
        );

    }
);


/* ==================================================
   TECLADO / EASTER EGG
================================================== */

let konamiCode = [];

const secretCode = [

    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight"

];


document.addEventListener(
    "keydown",
    event => {

        konamiCode.push(
            event.key
        );


        if (
            konamiCode.length >
            secretCode.length
        ) {

            konamiCode.shift();

        }


        const codeMatches =
            secretCode.every(
                (key, index) =>
                    key === konamiCode[index]
            );


        if (
            codeMatches &&
            konamiCode.length ===
            secretCode.length
        ) {

            activateEasterEgg();

            konamiCode = [];

        }

    }
);


/* ==================================================
   EASTER EGG
================================================== */

function activateEasterEgg() {

    alert(
        "CHEAT CODE ACTIVATED\n\n" +
        "YOU FOUND SOMETHING YOU " +
        "WEREN'T SUPPOSED TO FIND."
    );

}


function showSecretUnlock() {

    const unlockScreen =
        document.getElementById(
            "secret-unlock-screen"
        );

    showScreen(
        unlockScreen
    );

    document.body.classList.add(
        "glitch"
    );

    setTimeout(() => {

        document.body.classList.remove(
            "glitch"
        );

        showScreen(
            mainScreen
        );

    }, 2500);

}