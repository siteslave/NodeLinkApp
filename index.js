var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var ipc = require('ipc');
var fse = require('fs-extra');
var path = require('path');
var fs = require('fs');

var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    app.quit();
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
    var dataPath = app.getPath('appData');
    var appPath = path.join(dataPath, 'nodelink');
    var configFile = path.join(appPath, 'config.json');

    fse.ensureDirSync(appPath);

    fs.access(configFile, fs.W_OK && fs.R_OK, function(err) {
        if (err) {
            var defaultConfig = {
                db: {
                    host: 'localhost',
                    database: 'hos',
                    port: 3306,
                    user: 'sa',
                    password: 'sa'
                },
                cloud: {
                  url: 'http://localhost',
                  port: 3000,
                  user: 'sa',
                  password: 'sa'
                }
            };

            fse.writeJsonSync(configFile, defaultConfig);
        }
    });

    // ipc modules
    ipc.on('get-app-path', function(event, arg) {
        event.returnValue = appPath;
    });

    ipc.on('get-config-file', function(event, arg) {
        event.returnValue = configFile;
    });

    ipc.on('show-select-directory', function(event, arg) {
        var dialog = require('dialog');
        var dir = dialog.showOpenDialog({ properties: ['openDirectory']});
        event.returnValue = dir;
    });
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 1010, height: 600});

    // and load the index.html of the app.
    mainWindow.loadUrl('file://' + __dirname + '/app/index.html');

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});
