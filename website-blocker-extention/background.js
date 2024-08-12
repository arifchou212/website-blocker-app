let blockedWebsites = {};

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(['blockedWebsites'], (result) => {
        if (result.blockedWebsites) {
            blockedWebsites = result.blockedWebsites;
        }
    });
});

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        const url = new URL(details.url);
        if (blockedWebsites[url.hostname]) {
            const unblockTime = blockedWebsites[url.hostname];
            if (Date.now() < unblockTime) {
                return { cancel: true };
            } else {
                delete blockedWebsites[url.hostname];
                chrome.storage.local.set({ blockedWebsites });
            }
        }
        return { cancel: false };
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
);

function updateBlockedWebsites() {
    fetch('http://localhost:3000/blocked-websites')
        .then(response => response.json())
        .then(data => {
            blockedWebsites = data;
            chrome.storage.local.set({ blockedWebsites });
        })
        .catch(error => console.error('Error:', error));
}

setInterval(updateBlockedWebsites, 60000); // Update every minute
