const adContainer = document.getElementById('ad-note');

if (!localStorage.getItem('adblockDismissed') || localStorage.getItem('adblockDismissed') === null) {
	
	adContainer.removeAttribute('hidden');
	adContainer.innerHTML = `<aside class="window red border"><span class="titlebar">No ad blocker detected!</span><div class="content"><p>No browser-level adblocker detected!</p><p>Advertising is annoying, obtrusive, wasteful and useless. Do yourself a favor and get an ad-blocking browser extension to stay safe and save time and bandwidth. <a href="https://github.com/gorhill/uBlock#ublock-origin">uBlock Origin</a> has generally good default settings!</p><p>I can't detect DNS-level adblocking without showing you an actual ad, so ignore this if you're already running a DNS-based adblocking solution (and if you aren't, hey, <a href="https://pi-hole.net">PiHole</a> is super easy to set up!)</p><p>Close this window or click <a onclick="document.getElementById('ad-note').setAttribute('hidden', true); localStorage.setItem('adblockDismissed', true)" style="cursor: pointer;">here</a> to dismiss this popup forever</p></div><button class="titlebarbutton" style="right: 0px;" aria-hidden="true" onclick="document.getElementById('ad-note').setAttribute('hidden', true); localStorage.setItem('adblockDismissed', true)"></button></aside>`
	setTimeout(autoDismiss, 500)
}

function autoDismiss() {
	if (getComputedStyle(adContainer)['display'] == "none") {
		localStorage.setItem('adblockDismissed', true)
	}
}

