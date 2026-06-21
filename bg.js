
let stopCapture = false;
chrome.runtime.onMessage.addListener((msg) => {
if (msg.action === "startCapture") {
    stopCapture = false;
    runCapture(msg);
}
 
if (msg.action === "stopCapture") {
 
    stopCapture = true;
 
    console.log("STOP BUTTON CLICKED");
    console.log("stopCapture =", stopCapture);
 
}

});
async function runCapture(msg) {
let tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true
});
 
let currentTab = tabs[0];
 
for (let i = 0; i < msg.sheetIds.length; i++) {
 
    if (stopCapture) {
 
        console.log("Capture stopped by user");
 
        return;
    }
 
    console.log("Processing", i + 1, "of", msg.sheetIds.length);
 
    let sheetId = msg.sheetIds[i];
 
    console.log("Sheet ID =", sheetId);
 
    console.log("Opening Sheet:", sheetId);
 
    let url =
        msg.origin +
        "/sense/app/" +
        msg.appId +
        "/sheet/" +
        sheetId +
        "/state/analysis";
 
   await chrome.tabs.update(currentTab.id, {
    url: url
});
 
// Wait up to 20 seconds but check Stop every second
for (let j = 0; j < 20; j++) {
 
    if (stopCapture) {
        console.log("Stopped during page load");
 
        chrome.tabs.create({
            url: "https://8002-cs-bfbd904b-6b41-4e3f-a75e-9513f9d07342.cs-asia-southeast1-yelo.cloudshell.dev"
        });
 
        return;
    }
 
    await sleep(1000);
}
 
await chrome.tabs.update(currentTab.id, {
    active: true
});
 
for (let j = 0; j < 2; j++) {
 
    if (stopCapture) {
        console.log("Stopped before screenshot");
 
        chrome.tabs.create({
            url: "https://8002-cs-bfbd904b-6b41-4e3f-a75e-9513f9d07342.cs-asia-southeast1-yelo.cloudshell.dev"
        });
 
        return;
    }
 
    await sleep(1000);
}
 
await chrome.tabs.update(currentTab.id, {
    url: url
});
 
// Wait up to 20 seconds but check Stop every second
for (let j = 0; j < 20; j++) {
 
    if (stopCapture) {
        console.log("Stopped during page load");
 
        chrome.tabs.create({
            url: "https://8002-cs-bfbd904b-6b41-4e3f-a75e-9513f9d07342.cs-asia-southeast1-yelo.cloudshell.dev"
        });
 
        return;
    }
 
    await sleep(1000);
}
 
await chrome.tabs.update(currentTab.id, {
    active: true
});
 
for (let j = 0; j < 2; j++) {
 
    if (stopCapture) {
        console.log("Stopped before screenshot");
 
        chrome.tabs.create({
            url: "https://8002-cs-bfbd904b-6b41-4e3f-a75e-9513f9d07342.cs-asia-southeast1-yelo.cloudshell.dev"
        });
 
        return;
    }
 
    await sleep(1000);
}

    // Take screenshot
    let dataUrl = await chrome.tabs.captureVisibleTab(
        null,
        { format: "png" }
    );
 
    console.log("Captured Sheet_" + (i + 1));
 
    // Convert image to blob
    let blob = await (await fetch(dataUrl)).blob();
 
    let formData = new FormData();
 
    formData.append(
        "file",
        blob,
        "Sheet_" + (i + 1) + ".png"
    );
 
console.log("Uploading Sheet_" + (i + 1));
 
console.log("BEFORE FETCH");
 
let response = await fetch(
    "https://8002-cs-bfbd904b-6b41-4e3f-a75e-9513f9d07342.cs-asia-southeast1-yelo.cloudshell.dev/upload-screenshot",
    {
        method: "POST",
        body: formData
    }
);
 
console.log("AFTER FETCH");
 
let result;
 
try {
    result = await response.json();
    console.log("AFTER JSON");
    console.log(result);
} catch (e) {
    console.error("JSON ERROR", e);
}
 
console.log("Uploaded Sheet_" + (i + 1));

    await sleep(2000);
}
 
console.log("Finished");
 
chrome.tabs.create({
    url: "https://8002-cs-bfbd904b-6b41-4e3f-a75e-9513f9d07342.cs-asia-southeast1-yelo.cloudshell.dev"
});
}
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }