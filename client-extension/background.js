chrome.browserAction.onClicked.addListener(function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var currentTab = tabs[0];
    var videoUrl = currentTab.url;

    fetch('http://127.0.0.1:5000/api/transcribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ youtube_link: videoUrl })
    })
    .then(response => response.json())
    .then(data => {
      // Send the response to the popup
      chrome.runtime.sendMessage({ action: 'transcribeResults', data: data });
    })
    .catch(error => console.error('Error:', error));
  });
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'getTranscriptAndSummary') {
    // Call the Python server to get the transcript and summary
    fetch('http://127.0.0.1:5000/api/transcribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ youtube_link: request.videoUrl })
    })
    .then(response => response.json())
    .then(data => {
      sendResponse({ transcriptAndSummary: data });
    })
    .catch(error => console.error('Error:', error));
    return true; // Keep the message channel open for asynchronous response
  }
});