let stopCapture = false;
chrome.runtime.onMessage.addListener((msg) => {
if (msg.action === "startCapture") {
    stopCapture = false;
    runCapture(msg);
}
 
if (msg.action === "stopCapture") {
    stopCapture = true;
    console.log("Stop requested");
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
 
        chrome.tabs.create({
            url: "https://8002-cs-bfbd904b-6b41-4e3f-a75e-9513f9d07342.cs-asia-southeast1-yelo.cloudshell.dev"
        });
 
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
 
    // Wait for Qlik sheet to load
    await sleep(20000);
 
    // Ensure Qlik tab is active
    await chrome.tabs.update(currentTab.id, {
        active: true
    });
 
    await sleep(2000);
 
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