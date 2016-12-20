const {
    app,
    BrowserWindow
} = require('electron');
const dialog = require('dialog');
const path = require('path');
const url = require('url');
const child_process = require('child_process');
const portfinder = require('portfinder');
const $ = require('jquery');

let window;
let backend_port;

function createWindow() {
    window = new BrowserWindow({
        width: 640,
        height: 480
    });
    
    window.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    window.webContents.openDevTools({mode: 'undocked'});
    
    window.on('closed', function() {
        window = null;
    });
}

function callConvert() {
    
}

app.on('ready', function() {
    portfinder.getPort(function(err, port) {
        if (err) {
            dialog.showMessageBox({
                type: "error",
                message: "unable to bind local port"
            });
            app.quit();
        }
        backend_port = port;
        child_process.spawn("./hl/hl server --host localhost:" + port);
    });
    createWindow();
});

app.on('activate', function() {
    if (window === null) {
        createWindow();
    }
});
