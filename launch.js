chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('TeslaCamPlayer.html', {
  	id: "mainwin", innerBounds: { width: 880, height: 480 }
  })
})
