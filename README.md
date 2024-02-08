# Getting Started with RDM

This project is for NYIT Senior Project I. RDM is a download manager that can download internet content such as files, BTs, or other URL requests.

## Before started

### For Windows
In package.json, change
```json
"rdm-server": "set ELECTRON_START_URL=http://localhost:3000 && electron .",
```

to

```json
"rdm-server": "export ELECTRON_START_URL=http://localhost:3000 && electron .",
```

### For MacOS

In package.json, change

```json
"rdm-server": "export ELECTRON_START_URL=http://localhost:3000 && electron .",
```


to

```json
"rdm-server": "set ELECTRON_START_URL=http://localhost:3000 && electron .",
```

Windows can't reconize "set", and MacOS can't reconize "export", when upload to the repo, make sure it stays `set` to avoid conflicts!

## Start Re Download Manager Debug
First, use `npm start`
Then, run `npm run rdm-server`,
This will show the desktop version created by Electron.

## Build RDM
This part is not available for now.

