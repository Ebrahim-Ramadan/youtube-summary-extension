document.getElementById('transcribeBtn').addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var currentTab = tabs[0];
      var videoUrl = currentTab.url;
  
      chrome.runtime.sendMessage({ action: 'getTranscriptAndSummary', videoUrl: videoUrl }, function(response) {
        document.getElementById('transcriptOutput').textContent = response.transcriptAndSummary.transcript;
        document.getElementById('summaryOutput').textContent = response.transcriptAndSummary.summary;
      });
    });
  });
  
  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'transcribeResults') {
      document.getElementById('transcriptOutput').textContent = request.data.transcript;
      document.getElementById('summaryOutput').textContent = request.data.summary;
    }
  });