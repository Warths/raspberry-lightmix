// app.ts
function mainLoop() {
    console.log("The application is running. Timestamp:", new Date().toISOString());
}

// Set an interval to run the mainLoop function every 1000 milliseconds (1 second)
setInterval(mainLoop, 1000);