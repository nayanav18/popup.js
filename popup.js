console.log("popup.js loaded");
document.getElementById("captureBtn").addEventListener("click", async () => {

    let tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    let tab = tabs[0];

    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: async () => {

            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            let sheetIds = [];

            document.querySelectorAll('[role="menuitem"]').forEach(el => {

                let id = el.getAttribute("data-testid");

                if (id) {

                    id = id.replace("privateList-grid-item-button-", "");

                    if (
                        id !== "addNewItem" &&
                        !sheetIds.includes(id)
                    ) {
                        sheetIds.push(id);
                    }
                }

            });

            alert("Found " + sheetIds.length + " sheets");

            let currentUrl = window.location.href;

            let appMatch = currentUrl.match(/app\/([^\/]+)/);

            if (!appMatch) {
                alert("App ID not found");
                return;
            }

            let appId = appMatch[1];

            chrome.runtime.sendMessage({
                action: "startCapture",
                appId: appId,
                sheetIds: sheetIds,
                origin: window.location.origin
            });

            alert("Capture Started");

        }
    });

});