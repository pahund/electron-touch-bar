const electron = require('electron');

const { app, BrowserWindow, TouchBar } = require('electron');
const { TouchBarLabel, TouchBarButton, TouchBarSpacer } = TouchBar;
const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

let spinning = false;

// Reel labels
const reel1 = new TouchBarLabel();
const reel2 = new TouchBarLabel();
const reel3 = new TouchBarLabel();

// Spin result label
const result = new TouchBarLabel();

// Spin button
const spin = new TouchBarButton({
    label: '🎰 Spin',
    backgroundColor: '#7851A9',
    click: () => {
        // Ignore clicks if already spinning
        if (spinning) {
            return
        }

        spinning = true;
        result.label = '';

        let timeout = 10;
        const spinLength = 4 * 1000; // 4 seconds
        const startTime = Date.now();

        const spinReels = () => {
            updateReels();

            if ((Date.now() - startTime) >= spinLength) {
                finishSpin();
            } else {
                // Slow down a bit on each spin
                timeout *= 1.1;
                setTimeout(spinReels, timeout);
            }
        };

        spinReels()
    }
});

const getRandomValue = () => {
    const values = ['🍒', '💎', '7️⃣', '🍊', '🔔', '⭐', '🍇', '🍀'];
    return values[Math.floor(Math.random() * values.length)];
};

const updateReels = () => {
    reel1.label = getRandomValue();
    reel2.label = getRandomValue();
    reel3.label = getRandomValue();
};

const finishSpin = () => {
    const uniqueValues = new Set([reel1.label, reel2.label, reel3.label]).size;
    if (uniqueValues === 1) {
        // All 3 values are the same
        result.label = '💰 Jackpot!';
        result.textColor = '#FDFF00';
    } else if (uniqueValues === 2) {
        // 2 values are the same
        result.label = '😍 Winner!';
        result.textColor = '#FDFF00';
    } else {
        // No values are the same
        result.label = '🙁 Spin Again';
        result.textColor = null;
    }
    spinning = false;
};

const touchBar = new TouchBar([
    spin,
    new TouchBarSpacer({size: 'large'}),
    reel1,
    new TouchBarSpacer({size: 'small'}),
    reel2,
    new TouchBarSpacer({size: 'small'}),
    reel3,
    new TouchBarSpacer({size: 'large'}),
    result
]);

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({ width: 800, height: 600 });

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Open the DevTools.
    win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });

    win.setTouchBar(touchBar);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
