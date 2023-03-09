# ESPTool Node

A port of [esptool-js](https://github.com/espressif/esptool-js) to Node.js to replace the use of [esptool.py](https://github.com/espressif/esptool) for flashing Espressif devices from the command line.

**This is a work in progress and is not functional yet.**

Requirements:

Node.js v18
PNPM

Get set up quickly using [rtx](https://github.com/jdxcode/rtx):

```
rtx install
```

## Motivation

As a JavaScript developer who likes working with embedded devices, the ecosystem of Python tooling needed to work with the most popular chipsets is unfamiliar and annoying to maintain. Given that the browser port of esptool exists, it makes sense to try to bring this functionality to Node.js. 

I'm also hoping to learn a bit more about communicating with these devices.
