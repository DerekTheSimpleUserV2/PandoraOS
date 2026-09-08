// ========================================
// PandoraOS - script.js
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    const bootScreen = document.getElementById("boot-screen");
    const lockScreen = document.getElementById("lock-screen");
    const desktop = document.getElementById("desktop");

    const unlockButton = document.getElementById("unlock-button");
    const startButton = document.getElementById("start-button");
    const startMenu = document.getElementById("start-menu");

    const clock = document.getElementById("clock");
    const lockTime = document.getElementById("lock-time");
    const lockDate = document.getElementById("lock-date");

    const windowArea = document.getElementById("window-area");
    const runningApps = document.getElementById("running-apps");

    let highestZ = 10;

    // ========================================
    // Boot Screen
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

        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");

        const time = `${hours}:${minutes}`;

        clock.textContent = time;
        lockTime.textContent = time;

        lockDate.textContent = now.toLocaleDateString("en-US", {
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

    startButton.addEventListener("click", (event) => {
        event.stopPropagation();
        startMenu.classList.toggle("open");
    });

    document.addEventListener("click", (event) => {
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
                    <div>Type "help" for available commands.</div>

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

                <p>Built with HTML, CSS and JavaScript.</p>

                <p>Version 1.0</p>
            `
        }
    };

    // ========================================
    // Open Application
    // ========================================

    function openApp(appName) {

        const app = apps[appName];

        if (!app) {
            return;
        }

        // If already open, bring it to front
        const existingWindow = document.querySelector(
            `.window[data-app="${appName}"]`
        );

        if (existingWindow) {

            existingWindow.style.display = "block";

            bringToFront(existingWindow);

            if (appName === "terminal") {
                const input = existingWindow.querySelector(".terminal-input");

                if (input) {
                    input.focus();
                }
            }

            return;
        }

        // ========================================
        // Create Window
        // ========================================

        const windowElement = document.createElement("div");

        windowElement.className = "window";
        windowElement.dataset.app = appName;

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

        // ========================================
        // Window Position
        // ========================================

        const windowCount =
            document.querySelectorAll(".window").length;

        const offset = windowCount * 25;

        windowElement.style.left = `${100 + offset}px`;
        windowElement.style.top = `${70 + offset}px`;

        bringToFront(windowElement);

        // ========================================
        // Close
        // ========================================

        const closeButton =
            windowElement.querySelector(".close-button");

        closeButton.addEventListener("click", () => {

            windowElement.remove();

            const taskButton = document.querySelector(
                `.task-button[data-app="${appName}"]`
            );

            if (taskButton) {
                taskButton.remove();
            }
        });

        // ========================================
        // Minimize
        // ========================================

        const minimizeButton =
            windowElement.querySelector(".minimize-button");

        minimizeButton.addEventListener("click", () => {

            windowElement.style.display = "none";
        });

        // ========================================
        // Taskbar Button
        // ========================================

        const taskButton = document.createElement("button");

        taskButton.className = "task-button";
        taskButton.dataset.app = appName;

        taskButton.textContent =
            `${app.icon} ${app.title}`;

        taskButton.addEventListener("click", () => {

            if (windowElement.style.display === "none") {

                windowElement.style.display = "block";

                bringToFront(windowElement);

            } else {

                bringToFront(windowElement);
            }
        });

        runningApps.appendChild(taskButton);

        // ========================================
        // Dragging
        // ========================================

        makeDraggable(windowElement);

        // ========================================
        // Terminal
        // ========================================

        if (appName === "terminal") {

            setupTerminal(windowElement);

        }

        // ========================================
        // Settings
        // ========================================

        if (appName === "settings") {

            const darkButton =
                windowElement.querySelector("#dark-mode-button");

            darkButton.addEventListener("click", () => {

                document.body.classList.toggle("dark-mode");

            });
        }
    }

    // ========================================
    // Terminal
    // ========================================

    function setupTerminal(windowElement) {

        const input =
            windowElement.querySelector(".terminal-input");

        const output =
            windowElement.querySelector("#terminal-output");

        input.focus();

        input.addEventListener("keydown", (event) => {

            // ENTER
            if (event.key !== "Enter") {
                return;
            }

            const command =
                input.value.trim();

            // Clear input
            input.value = "";

            // Ignore empty command
            if (command === "") {
                return;
            }

            // Show command
            const commandLine =
                document.createElement("div");

            commandLine.textContent =
                `pandora@os:~$ ${command}`;

            output.appendChild(commandLine);

            // ========================================
            // Commands
            // ========================================

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
                    echo - Print text<br>
                `;

            } else if (command === "clear") {

                output.innerHTML = "";

                return;

            } else if (command === "date") {

                response.textContent =
                    new Date().toLocaleDateString();

            } else if (command === "time") {

                response.textContent =
                    new Date().toLocaleTimeString();

            } else if (command === "about") {

                response.textContent =
                    "PandoraOS 1.0 - Web Operating System";

            } else if (command.startsWith("echo ")) {

                response.textContent =
                    command.substring(5);

            } else {

                response.textContent =
                    `Command not found: ${command}`;
            }

            output.appendChild(response);

            // Scroll terminal down
            const terminal =
                windowElement.querySelector(".terminal");

            terminal.scrollTop =
                terminal.scrollHeight;
        });
    }

    // ========================================
    // Bring Window To Front
    // ========================================

    function bringToFront(element) {

        highestZ++;

        element.style.zIndex = highestZ;
    }

    // ========================================
    // Window Dragging
    // ========================================

    function makeDraggable(windowElement) {

        const titlebar =
            windowElement.querySelector(".titlebar");

        let dragging = false;
        let offsetX = 0;
        let offsetY = 0;

        titlebar.addEventListener("mousedown", (event) => {

            dragging = true;

            const rect =
                windowElement.getBoundingClientRect();

            offsetX =
                event.clientX - rect.left;

            offsetY =
                event.clientY - rect.top;

            bringToFront(windowElement);
        });

        document.addEventListener("mousemove", (event) => {

            if (!dragging) {
                return;
            }

            windowElement.style.left =
                `${event.clientX - offsetX}px`;

            windowElement.style.top =
                `${event.clientY - offsetY}px`;
        });

        document.addEventListener("mouseup", () => {

            dragging = false;

        });
    }

    // ========================================
    // Desktop Shortcuts
    // ========================================

    document.querySelectorAll(".desktop-icon").forEach(icon => {

        // Single click
        icon.addEventListener("click", () => {

            const appName =
                icon.dataset.app;

            openApp(appName);

        });

    });

    // ========================================
    // Start Menu Applications
    // ========================================

    document.querySelectorAll(".app-item").forEach(item => {

        item.addEventListener("click", () => {

            const appName =
                item.dataset.app;

            openApp(appName);

            startMenu.classList.remove("open");

        });

    });

    // ========================================
    // Power
    // ========================================

    const powerButton =
        document.getElementById("power-button");

    powerButton.addEventListener("click", () => {

        startMenu.classList.remove("open");

        desktop.style.display = "none";

        lockScreen.style.display = "flex";
    });

});

