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
    break;
}

        
        console.log("Processing", i + 1, "of", msg.sheetIds.length);
console.log("Sheet ID =", msg.sheetIds[i]);
 
        let sheetId = msg.sheetIds[i];
 
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
 
        let response = await fetch(
            "https://8002-cs-bfbd904b-6b41-4e3f-a75e-9513f9d07342.cs-asia-southeast1-yelo.cloudshell.dev/upload-screenshot",
            {
                method: "POST",
                body: formData
            }
        );
 
        let result = await response.json();
 
        console.log(result);
 
        console.log("Uploaded Sheet_" + (i + 1));
 
        await sleep(2000);
    }
 
    console.log("Finished");
 
    // Open results automatically when all sheets are done
    chrome.tabs.create({
        url: "https://8002-cs-bfbd904b-6b41-4e3f-a75e-9513f9d07342.cs-asia-southeast1-yelo.cloudshell.dev"
    });
}
 
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}