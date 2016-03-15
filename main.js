/**
 * Listens for the app launching, then creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function(launchData) {
  chrome.app.window.create(
    'login.html',
    {
      id: 'identitywin',
     "innerBounds": {
        "width": 710,
        "height": 850,
        "minHeight":850,
        "minWidth":710,
        "maxHeight":850,
        "maxWidth":710,
      }
    }
  );
});