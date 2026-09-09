// ========================================
// PandoraOS - script.js
// Desktop + Installation Setup
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    // Detectar qué página estamos usando
    if (document.getElementById("setup")) {
        startInstaller();
    }

    if (document.getElementById("desktop")) {
        startPandoraOS();
    }

});


// ========================================
// INSTALLATION / SETUP
// ========================================

function startInstaller() {

    const pages = [
        document.getElementById("step-welcome"),
        document.getElementById("step-user"),
        document.getElementById("step-appearance"),
        document.getElementById("step-install"),
        document.getElementById("step-finished")
    ];

    const stepText = document.getElementById("setup-step");

    const username = document.getElementById("username");
    const theme = document.getElementById("theme");
    const wallpaper = document.getElementById("wallpaper");

    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");
    const installStatus = document.getElementById("install-status");

    const welcomeUser = document.getElementById("welcome-user");
    const launchButton = document.getElementById("launch-pandora");

    let currentStep = 0;


    // ========================================
    // Mostrar página
    // ========================================

    function showPage(number) {

        pages.forEach(page => {
            if (page) {
                page.classList.remove("active");
            }
        });

        if (pages[number]) {
            pages[number].classList.add("active");
        }

        if (number < 4) {
            stepText.textContent = `Paso ${number + 1} de 4`;
        } else {
            stepText.textContent = "Finalizado";
        }

        currentStep = number;
    }


    // ========================================
    // Botones Siguiente
    // ========================================

    document.querySelectorAll("[data-next]").forEach(button => {

        button.addEventListener("click", () => {

            const nextStep =
                Number(button.dataset.next) - 1;

            // Validar nombre
            if (currentStep === 1) {

                if (username.value.trim() === "") {

                    username.focus();

                    username.style.borderColor = "#d55";

                    return;
                }

                username.style.borderColor = "";
            }

            showPage(nextStep);

            // Comenzar instalación
            if (nextStep === 3) {
                startInstallation();
            }

        });

    });


    // ========================================
    // Botones Atrás
    // ========================================

    document.querySelectorAll("[data-back]").forEach(button => {

        button.addEventListener("click", () => {

            const previousStep =
                Number(button.dataset.back) - 1;

            showPage(previousStep);

        });

    });


    // ========================================
    // Instalación
    // ========================================

    function startInstallation() {

        let progress = 0;

        progressBar.style.width = "0%";
        progressText.textContent = "0%";

        installStatus.textContent =
            "Preparando PandoraOS...";

        const installationSteps = [
            "Preparando configuración...",
            "Configurando usuario...",
            "Aplicando tema...",
            "Configurando escritorio...",
            "Guardando configuración...",
            "Finalizando instalación..."
        ];

        let messageIndex = 0;

        const interval = setInterval(() => {

            progress += Math.floor(Math.random() * 8) + 5;

            if (progress >= 100) {
                progress = 100;
            }

            progressBar.style.width =
                `${progress}%`;

            progressText.textContent =
                `${progress}%`;


            if (
                messageIndex <
                installationSteps.length &&
                progress >=
                ((messageIndex + 1) * 16)
            ) {

                installStatus.textContent =
                    installationSteps[messageIndex];

                messageIndex++;
            }


            if (progress >= 100) {

                clearInterval(interval);

                saveConfiguration();

                setTimeout(() => {

                    welcomeUser.textContent =
                        `Bienvenido, ${username.value.trim()}. PandoraOS está listo para usarse.`;

                    showPage(4);

                }, 700);
            }

        }, 350);

    }


    // ========================================
    // Guardar configuración
    // ========================================

    function saveConfiguration() {

        const configuration = {

            username:
                username.value.trim(),

            theme:
                theme.value,

            wallpaper:
                wallpaper.value,

            installed:
                true,

            version:
                "1.0"

        };

        localStorage.setItem(
            "PandoraOS",
            JSON.stringify(configuration)
        );

    }


    // ========================================
    // Lanzar PandoraOS
    // ========================================

    launchButton.addEventListener("click", () => {

        window.location.href = "index.html";

    });


    // ========================================
    // Estado inicial
    // ========================================

    showPage(0);
}


// ========================================
// PANDORAOS DESKTOP
// ========================================

function startPandoraOS() {

    const bootScreen =
        document.getElementById("boot-screen");

    const lockScreen =
        document.getElementById("lock-screen");

    const desktop =
        document.getElementById("desktop");

    const unlockButton =
        document.getElementById("unlock-button");

    const startButton =
        document.getElementById("start-button");

    const startMenu =
        document.getElementById("start-menu");

    const clock =
        document.getElementById("clock");

    const lockTime =
        document.getElementById("lock-time");

    const lockDate =
        document.getElementById("lock-date");

    const windowArea =
        document.getElementById("window-area");

    const runningApps =
        document.getElementById("running-apps");

    let highestZ = 10;


    // ========================================
    // Cargar configuración
    // ========================================

    const saved =
        localStorage.getItem("PandoraOS");

    if (saved) {

        const configuration =
            JSON.parse(saved);

        if (configuration.theme === "light") {
            document.body.classList.add("light-mode");
        }

        if (configuration.wallpaper === "midnight") {
            desktop.style.background =
                "radial-gradient(circle at 30% 20%, #182030, #07090d 70%)";
        }

        if (configuration.wallpaper === "blue") {
            desktop.style.background =
                "radial-gradient(circle at 30% 20%, #315b91, #10131a 70%)";
        }
    }


    // ========================================
    // Boot
    // ========================================

    setTimeout(() => {

        bootScreen.style.display = "none";
        lockScreen.style.display = "flex";

    }, 2000);


    // ========================================
    // Clock
    // ========================================

    function updateClock() {

        const now = new Date();

        const hours =
            String(now.getHours()).padStart(2, "0");

        const minutes =
            String(now.getMinutes()).padStart(2, "0");

        const time =
            `${hours}:${minutes}`;

        clock.textContent = time;
        lockTime.textContent = time;

        lockDate.textContent =
            now.toLocaleDateString("es-AR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            });
    }

    updateClock();

    setInterval(updateClock, 1000);


    // ========================================
    // Unlock
    // ========================================

    unlockButton.addEventListener("click", () => {

        lockScreen.style.display = "none";
        desktop.style.display = "block";

    });


    // ========================================
    // Start Menu
    // ========================================

    startButton.addEventListener("click", event => {

        event.stopPropagation();

        startMenu.classList.toggle("open");

    });


    document.addEventListener("click", event => {

        if (
            !startMenu.contains(event.target) &&
            !startButton.contains(event.target)
        ) {

            startMenu.classList.remove("open");

        }

    });


    // ========================================
    // Applications
    // ========================================

    const apps = {

        files: {

            title: "Files",
            icon: "📁",

            content: `
                <h2>Files</h2>

                <p>Welcome to PandoraOS Files.</p>

                <hr>

                <p>📁 Documents</p>
                <p>📁 Downloads</p>
                <p>📁 Pictures</p>
            `
        },


        terminal: {

            title: "Terminal",
            icon: "⌨️",

            content: `
                <div class="terminal">

                    <div>PandoraOS Terminal</div>

                    <div>
                        Type "help" for available commands.
                    </div>

                    <br>

                    <div id="terminal-output"></div>

                    <div>
                        <span>pandora@os:~$ </span>

                        <input
                            class="terminal-input"
                            type="text"
                            autocomplete="off"
                            spellcheck="false"
                        >
                    </div>

                </div>
            `
        },


        settings: {

            title: "Settings",
            icon: "⚙️",

            content: `
                <h2>Settings</h2>

                <p>Customize PandoraOS.</p>

                <br>

                <button id="dark-mode-button">
                    Toggle Dark Mode
                </button>
            `
        },


        about: {

            title: "About PandoraOS",
            icon: "ℹ️",

            content: `
                <h2>About PandoraOS</h2>

                <p><strong>PandoraOS</strong></p>

                <p>A Web Operating System.</p>

                <p>
                    Built with HTML, CSS and JavaScript.
                </p>

                <p>Version 1.0</p>
            `
        }

    };


    // ========================================
    // Open App
    // ========================================

    function openApp(appName) {

        const app = apps[appName];

        if (!app) {
            return;
        }


        // Ya está abierta
        const existingWindow =
            document.querySelector(
                `.window[data-app="${appName}"]`
            );

        if (existingWindow) {

            existingWindow.style.display =
                "block";

            bringToFront(existingWindow);

            if (appName === "terminal") {

                const input =
                    existingWindow.querySelector(
                        ".terminal-input"
                    );

                if (input) {
                    input.focus();
                }
            }

            return;
        }


        // Crear ventana
        const windowElement =
            document.createElement("div");

        windowElement.className =
            "window";

        windowElement.dataset.app =
            appName;


        windowElement.innerHTML = `

            <div class="titlebar">

                <div class="window-title">

                    <span>${app.icon}</span>

                    <span>${app.title}</span>

                </div>

                <div class="window-buttons">

                    <button class="minimize-button">
                        −
                    </button>

                    <button class="close-button">
                        ×
                    </button>

                </div>

            </div>

            <div class="window-content">
                ${app.content}
            </div>
        `;


        windowArea.appendChild(windowElement);


        // Posición
        const windowCount =
            document.querySelectorAll(".window").length;

        const offset =
            windowCount * 25;

        windowElement.style.left =
            `${100 + offset}px`;

        windowElement.style.top =
            `${70 + offset}px`;


        bringToFront(windowElement);


        // ========================================
        // Close
        // ========================================

        windowElement
            .querySelector(".close-button")
            .addEventListener("click", () => {

                windowElement.remove();

                const taskButton =
                    document.querySelector(
                        `.task-button[data-app="${appName}"]`
                    );

                if (taskButton) {
                    taskButton.remove();
                }

            });


        // ========================================
        // Minimize
        // ========================================

        windowElement
            .querySelector(".minimize-button")
            .addEventListener("click", () => {

                windowElement.style.display =
                    "none";

            });


        // ========================================
        // Taskbar
        // ========================================

        const taskButton =
            document.createElement("button");

        taskButton.className =
            "task-button";

        taskButton.dataset.app =
            appName;

        taskButton.textContent =
            `${app.icon} ${app.title}`;


        taskButton.addEventListener("click", () => {

            if (
                windowElement.style.display ===
                "none"
            ) {

                windowElement.style.display =
                    "block";

            }

            bringToFront(windowElement);

        });


        runningApps.appendChild(taskButton);


        // Drag
        makeDraggable(windowElement);


        // Terminal
        if (appName === "terminal") {
            setupTerminal(windowElement);
        }


        // Settings
        if (appName === "settings") {

            const darkButton =
                windowElement.querySelector(
                    "#dark-mode-button"
                );

            darkButton.addEventListener("click", () => {

                document.body.classList.toggle(
                    "dark-mode"
                );

            });

        }

    }


    // ========================================
    // Terminal
    // ========================================

    function setupTerminal(windowElement) {

        const input =
            windowElement.querySelector(
                ".terminal-input"
            );

        const output =
            windowElement.querySelector(
                "#terminal-output"
            );


        input.focus();


        input.addEventListener(
            "keydown",
            event => {

                if (event.key !== "Enter") {
                    return;
                }


                const command =
                    input.value.trim();


                input.value = "";


                if (command === "") {
                    return;
                }


                // Mostrar comando
                const commandLine =
                    document.createElement("div");

                commandLine.textContent =
                    `pandora@os:~$ ${command}`;

                output.appendChild(commandLine);


                // Respuesta
                const response =
                    document.createElement("div");


                if (command === "help") {

                    response.innerHTML = `
                        Available commands:<br>
                        help - Show this help<br>
                        clear - Clear terminal<br>
                        date - Show date<br>
                        time - Show time<br>
                        about - About PandoraOS<br>
                        echo - Print text
                    `;

                }

                else if (command === "clear") {

                    output.innerHTML = "";

                    return;

                }

                else if (command === "date") {

                    response.textContent =
                        new Date()
                        .toLocaleDateString("es-AR");

                }

                else if (command === "time") {

                    response.textContent =
                        new Date()
                        .toLocaleTimeString("es-AR");

                }

                else if (command === "about") {

                    response.textContent =
                        "PandoraOS 1.0 - Web Operating System";

                }

                else if (
                    command.startsWith("echo ")
                ) {

                    response.textContent =
                        command.substring(5);

                }

                else {

                    response.textContent =
                        `Command not found: ${command}`;

                }


                output.appendChild(response);


                const terminal =
                    windowElement.querySelector(
                        ".terminal"
                    );

                terminal.scrollTop =
                    terminal.scrollHeight;

            }
        );

    }


    // ========================================
    // Bring Window Front
    // ========================================

    function bringToFront(element) {

        highestZ++;

        element.style.zIndex =
            highestZ;

    }


    // ========================================
    // Drag Windows
    // ========================================

    function makeDraggable(windowElement) {

        const titlebar =
            windowElement.querySelector(
                ".titlebar"
            );

        let dragging = false;

        let offsetX = 0;
        let offsetY = 0;


        titlebar.addEventListener(
            "mousedown",
            event => {

                dragging = true;

                const rect =
                    windowElement.getBoundingClientRect();

                offsetX =
                    event.clientX - rect.left;

                offsetY =
                    event.clientY - rect.top;

                bringToFront(windowElement);

            }
        );


        document.addEventListener(
            "mousemove",
            event => {

                if (!dragging) {
                    return;
                }

                windowElement.style.left =
                    `${event.clientX - offsetX}px`;

                windowElement.style.top =
                    `${event.clientY - offsetY}px`;

            }
        );


        document.addEventListener(
            "mouseup",
            () => {

                dragging = false;

            }
        );

    }


    // ========================================
    // Desktop Shortcuts
    // ========================================

    document
        .querySelectorAll(".desktop-icon")
        .forEach(icon => {

            icon.addEventListener(
                "click",
                () => {

                    const appName =
                        icon.dataset.app;

                    openApp(appName);

                }
            );

        });


    // ========================================
    // Start Menu Apps
    // ========================================

    document
        .querySelectorAll(".app-item")
        .forEach(item => {

            item.addEventListener(
                "click",
                () => {

                    const appName =
                        item.dataset.app;

                    openApp(appName);

                    startMenu.classList.remove(
                        "open"
                    );

                }
            );

        });


    // ========================================
    // Power
    // ========================================

    const powerButton =
        document.getElementById(
            "power-button"
        );


    powerButton.addEventListener(
        "click",
        () => {

            startMenu.classList.remove(
                "open"
            );

            desktop.style.display =
                "none";

            lockScreen.style.display =
                "flex";

        }
    );

}

