const {
    app,
    BrowserWindow,
    dialog
} = require('electron');
const path = require('path');
const url = require('url');
const child_process = require('child_process');
const portfinder = require('portfinder');
const $ = require('jquery');

// Install Dev Tools ...
const installExtension = require('electron-devtools-installer').default;
const {REACT_DEVELOPER_TOOLS, REACT_PERF} = require('electron-devtools-installer');
// To Here ...

let window;
let host;

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

function convert(type, field, endian, num_bytes, value) {
    $.post(
        host,
        {type, field, endian, num_bytes, value},
        function(data) {
            console.log(data);
        }
    );
}

app.on('ready', function() {
    installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
    portfinder.getPort(function(err, port) {
        if (err) {
            dialog.showMessageBox({
                type: "error",
                message: "unable to bind local port"
            });
            app.quit();
        }
        host = "localhost:" + port;
        child_process.spawn('./hl/hl', ['server', '--host', host]);
    });
    createWindow();
});

app.on('activate', function() {
    if (window === null) {
        createWindow();
    }
});
