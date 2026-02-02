<!-- attrib title: Writing | You don't have to tolerate ads! -->
<!-- attrib pagetype: writing -->
<!-- attrib windowtitle: adtolerating.md -->

<img src="banners/adtolerating.png" class="thin gray border" style="margin: auto; width: 500px; image-rendering: pixelated;">

# You don't have to tolerate ads!

## Why I added the adblock popup to my website

I recently got linked to [Maurycy's blog](https://maurycyz.com); more 
specifically, to their ["No adblocker detected"](https://maurycyz.com/misc/ads) 
article, which in turn was inspired by [Stefan Bohacek](https://stefanbohacek.com)'s
["Detect Missing Adblocker"](https://wordpress.org/plugins/detect-missing-adblocker/) 
WordPress plugin.

I have always been strongly opposed to ads (and willing to 
sacrifice even relatively large amounts of time and comfort to ensure I never 
see them), and I always recommend ad-blocking options whenever I notice ads on 
someone's devices, so I naturally thought it would be fun to implement 
something similar on my website. While I wrote my own implementation, I had 
some thoughts about ad-blocking, advertising, and most non-technical users' 
strange passivity about them; so I figured I would write this article to share 
those thoughts.

Enjoy? Maybe?

## My implementation :3

First of all, if you are the kind of person that reads random deer's websites 
(weirdos /affectionate /<3), you probably already have at least some basic 
adblocking solution installed. So, for the sake of clarity, this is what my 
implementation looks like:

<div class="red border" style="width: 40ch; margin: auto; position: 
relative; box-shadow: 6px 6px 0 3px #1D202188"><span class="titlebar">No ad blocker detected!</span><div 
class="content"><p>No browser-level adblocker detected!</p><p>Advertising is 
annoying, obtrusive, wasteful and useless. Do yourself a favor and get an 
ad-blocking browser extension to stay safe and save time and bandwidth. <a 
href="https://github.com/gorhill/uBlock#ublock-origin">uBlock Origin</a> has 
generally good default settings!</p><p>I can't detect DNS-level adblocking without showing you an actual ad, so 
ignore this if you're already running a DNS-based adblocking solution (and if 
you aren't, hey, <a href="https://pi-hole.net">PiHole</a> is super easy to set 
up!)</p><p>Close this window or click <a 
onclick="alert(`Don't close the demo, silly!`)" style="cursor: 
pointer;">here</a> to dismiss this popup forever</p></div><button 
class="titlebarbutton" style="right: 0px;" aria-hidden="true" 
onclick="alert(`Don't close the demo, silly!`)"></button></div>

It pops up to the right of the website's main view (the DOE fantasy VM 
window) with a `z-index` of -1. It won't ever obstruct the 
website's content, and the user is provided with links to ad blocking tools and 
two different ways to close it.

In order to avoid creating noise for accessibility tools and/or users on 
browsers with no JavaScript support, it's right at the end of the 
tabbing order and is populated via JS after the page has finished loading. 
When users dismiss it, that status is stored as a boolean in 
<code>localStorage[<span style=color:var(--dgreen)>'adblockDismissed'</span>]</code>,
so even if you choose to not/cannot use adblock, you should never see it again after
dismissing it a single time. It also stores that key automatically 500ms after 
page load if it detects the popup was made invisible by an adblocking extension,
so it remembers users at their "best". I'm aware popups are annoying, so I tried
my best to make mine as unobtrusive as possible.

I'm also aware that getting browser-level adblock is harder on the disgusting 
walled gardens we pass for mobile operating systems, so the popup doesn't show 
up on the website's mobile view.

Code-wise, it's mostly based on Maurycy's implementation:

<pre data-lang="HTML" data-filename="templates/default.html" class="thin gray border">
<span style=color:var(--bg4)>&lt;!-- (...) --&gt;</span>
<span style=color:var(--orange)>&lt;</span><b>script</b> <span style=color:var(--daqua)>defer src</span>=<span style="color: var(--dgreen)">"/globals/nativeads.js"</span><span style=color:var(--orange)>&gt;&lt;<b>/</span>script</b><span style=color:var(--orange)>&gt;
&lt;</span><b>div</b> <span style=color:var(--daqua)>hidden id</span>=<span style=color:var(--dgreen>"ad-note"</span> <span style=color:var(--daqua)>class</span>=<span style=color:var(--dgreen)>ftf-dma-note ad native-ad native-ad-1 ytd-j yxd-j yxd-jd aff-content-col aff-inner-col aff-item-list ark-ad-message inplayer-ad inplayer_banners in_stream_banner trafficjunky-float-right dbanner preroll-blocker happy-inside-player blocker-notice blocker-overlay exo-horizontal ave-pl bottom-hor-block brs-block advboxemb wgAdBlockMessage glx-watermark-container overlay-advertising-new header-menu-bottom-ads rkads mdp-deblocker-wrapper amp-ad-inner imggif bloc-pub bloc-pub2 hor_banner aan_fake aan_fake__video-units rps_player_ads fints-block__row full-ave-pl full-bns-block vertbars video-brs player-bns-block wps-player__happy-inside gallery-bns-bl stream-item-widget adsbyrunactive happy-under-player adde_modal_detector adde_modal-overlay ninja-recommend-block aoa_overlay message"</span><span style=color:var(--orange)>&gt;
&lt;<b>/</span>div</b><span style=color:var(--orange)>&gt;</span>
<span style=color:var(--bg4)>&lt;!-- (...) --&gt;</span>
</pre>

The basic idea is that ad blockers will see two extremely suspicious elements: 
a <code><span style=color:var(--orange)>&lt;</span><b>script</b><span style=color:var(--orange)>&gt;</span></code> 
tag loading something called `nativeads.js`, and a 
<code><span style=color:var(--orange)>&lt;</span><b>div</b><span style=color:var(--orange)>&gt;</span></code>
with a bunch of ad-sounding class names.

Ideally, the user's ad blocking situation should kick in and stop at least one 
of those elements. If it blocks the 
<code><span style=color:var(--orange)>&lt;</span><b>script</b><span style=color:var(--orange)>&gt;</span></code>, 
the <code><span style=color:var(--orange)>&lt;</span><b>div</b><span style=color:var(--orange)>&gt;</span></code> 
never gets populated and the user doesn't see it; if it blocks the 
<code><span style=color:var(--orange)>&lt;</span><b>div</b><span style=color:var(--orange)>&gt;</span></code>, 
the user won't see it even if the 
<code><span style=color:var(--orange)>&lt;</span><b>script</b><span style=color:var(--orange)>&gt;</span></code> 
does populate it. Neat!

The <code><span style=color:var(--orange)>&lt;</span><b>script</b><span style=color:var(--orange)>&gt;</span></code>'s 
<code><span style=color:var(--daqua)>defer</span></code> attribute makes it so 
that `nativeads.js` only runs after the user's browser finished loading and 
parsing the page, thus giving their adblock extension the best possible chance 
to block it.

As for the code itself, it's some extremely simple JavaScript:

<pre data-lang="JS" data-filename="globals/nativeads.js" class="thin gray border">
<b>const</b> adContainer = <span style=color:var(--dorange)>document</span>.<span style=color:var(--daqua)>getElementById</span><span style=color:var(--dpink)>(<span style=color:var(--dgreen)>'ad-note'</span>)</span>;

<span style=color:var(--dred)><b>if</b></span> <span style=color:var(--red)>(</span>!localStorage.<span style=color:var(--daqua)>getItem</span><span style=color:var(--yellow)>(<span style=color:var(--dgreen)>'adblockDismissed'</span>)</span> ||
    localStorage.<span style=color:var(--daqua)>getItem</span><span style=color:var(--aqua)>(<span style=color:var(--dgreen)>'adblockDismissed'</span>)</span> === <b>null</b><span style=color:var(--red)>)</span> <span style=color:var(--blue)>{</span>
	adContainer.<span style=color:var(--daqua)>removeAttribute</span>(<span style=color:var(--dgreen)>'hidden'</span>);
	adContainer.<span style=color:var(--yellow)>innerHTML</span> = <span style=color:var(--dgreen)>`&lt;aside class="window red border"&gt;&lt;span class="titlebar"&gt;No ad blocker detected!&lt;/span&gt;&lt;div class="content"&gt;&lt;p&gt;No browser-level adblocker detected!&lt;/p&gt;&lt;p&gt;Advertising is annoying, obtrusive, wasteful and useless. Do yourself a favor and get an ad-blocking browser extension to stay safe and save time and bandwidth. &lt;a href="https://github.com/gorhill/uBlock#ublock-origin"&gt;uBlock Origin&lt;/a&gt; has generally good default settings!&lt;/p&gt;&lt;p&gt;I can't detect DNS-level adblocking without showing you an actual ad, so ignore this if you're already running a DNS-based adblocking solution (and if you aren't, hey, &lt;a href="https://pi-hole.net"&gt;PiHole&lt;/a&gt; is super easy to set up!)&lt;/p&gt;&lt;p&gt;Close this window or click &lt;a onclick="document.getElementById('ad-note').setAttribute('hidden', true); localStorage.setItem('adblockDismissed', true)" style="cursor: pointer;"&gt;here&lt;/a&gt; to dismiss this popup forever&lt;/p&gt;&lt;/div&gt;&lt;button class="titlebarbutton" style="right: 0px;" aria-hidden="true" onclick="document.getElementById('ad-note').setAttribute('hidden', true); localStorage.setItem('adblockDismissed', true)"&gt;&lt;/button&gt;&lt;/aside&gt;`</span>
	<span style=color:var(--dorange)>setTimeout</span>(autoDismiss, <span style=color:var(--orange)>500</span>)
<span style=color:var(--blue)>}</span>

<b>function</b> <span style=color:var(--daqua)>autoDismiss</span>() {
	<span style=color:var(--dred)><b>if</b></span> <span style=color:var(--pink)>(</span><span style=color:var(--daqua)>getComputedStyle</span><span style=color:var(--pink)>)</span><span style=color:var(--red)>(</span>adContainer<span style=color:var(--red)>)</span><span style=color:var(--yellow)>[<span style=color:var(--dgreen)>'display'</span>]</span> == <span style=color:var(--dgreen)>"none"</span><span style=color:var(--pink)>)</span> {
		localStorage.<span style=color:var(--daqua)>setItem</span><span style=color:var(--aqua)>(</span><span style=color:var(--dgreen)>'adblockDismissed'</span>, <b>true</b><span style=color:var(--aqua)>)</span>
	}
}
</pre>

It simply checks whether <code>localStorage[<span style=color:var(--dgreen)>'adblockDismissed'</span>]</code> 
is set to <code><b>false</b></code> and, if it isn't (or if it doesn't exist at 
all), it unhides the <code><span style=color:var(--dorange)>&lt;</span><b>div</b> <span style=color:var(--daqua)>id</span>=<span style=color:var(--dgreen)>"ad-note"</span><span style=color:var(--dorange)>&gt;</span></code> 
we created in the page's HTML and populates it with 
<code><span style=color:var(--dyellow)>innerHTML</span></code> that fits the 
rest of my website's styling.

It also sets a 500ms timer to check the element's computed styles. That way, if 
the user's adblock re-hides the element before they get a chance to dismiss it, 
the script will make sure not to waste time repopulating it next time.

There are obviously cleaner ways to render the popup, sure, but I knew I'd want 
to write a tutorial about it, so I prioritized code simplicity/readability over 
"good practices" etc.

The CSS component is obviously dependant on your page's stylesheet and however 
you'd want it to look. In my case, most of it was already handled by preexisting
rules, so I only had to set its size and position (and correct for some edge 
cases caused by it being outside the DOE window).

<pre data-lang="CSS" data-filename="globals/doe.css" class="thin gray border">
<span style=color:var(--bg4)>/* (...) */</span>
<span style=color:var(--dorange)><b>#ad-note</b></span> <span style=color:var(--yellow)>{</span>
	<b>background</b><span style=color:var(--dpink)>:</span> <span style=color:var(--daqua)>var(<span style=color:var(--dblue)>--bg0</span>)</span>;
	<b>bottom</b><span style=color:var(--dpink)>:</span> <span style=color:var(--orange)>20</span><span style=color:var(--dyellow)>px</span>;
	<b>height</b><span style=color:var(--dpink)>:</span> <span style=color:var(--orange)>fit-content</span>;
	<b>position</b><span style=color:var(--dpink)>:</span> <span style=color:var(--orange)>absolute</span>;
	<b>right</b><span style=color:var(--dpink)>:</span> <span style=color:var(--orange)>20</span><span style=color:var(--dyellow)>px</span>;
	<b>width</b><span style=color:var(--dpink)>:</span> <span style=color:var(--orange)>40</span><span style=color:var(--dyellow)>ch</span>;
	<b>z-index</b> <span style=color:var(--dpink)>:</span> <span style=color:var(--orange)>-1</span>;
<span style=color:var(--yellow)>}</span>

<span style=color:var(--dorange)><b>#ad-note</b></span> <span style=color:var(--red)>aside</span> <span style=color:var(--aqua)>{</span>
	<b>position</b><span style=color:var(--dpink)>:</span> <span style=color:var(--orange)>unset</span>; <span style=color:var(--bg4)>/* .window causes some Bull Shit, apparently */</span>
<span style=color:var(--aqua)>}</span>

<span style=color:var(--dorange)><b>#ad-note</b></span>:where(<span style=color:var(--aqua)>:hover</span>, <span style=color:var(--aqua)>:focus</span>) <span style=color:var(--pink)>{</span>
	<b>z-index</b><span style=color:var(--dpink)>:</span> <span style=color:var(--orange)>2</span>;
<span style=color:var(--pink)>}</span>
<span style=color:var(--bg4)>/* (...) */</span>
<span style=color:var(--daqua)>@media</span> <span style=color:var(--dgreen)>screen</span> <b>and</b> <span style=color:var(--yellow)>(</span><b>max-width</b><span style=color:var(--dpink)>:</span> <span style=color:var(--orange)>812</span><span style=color:var(--yellow)>px)</span> {
	<span style=color:var(--bg4)>/* (...) */</span>
	<span style=color:var(--dorange)><b>#ad-note</b></span> <span style=color:var(--pink)>{</span>
		<b>display</b><span style=color:var(--dpink)>:</span> <span style=color:var(--orange)>none</span> <span style=color:var(--yellow)>!important</span>; <span style=color:var(--bg4)>/* !important just to make sure */</span>
	<span style=color:var(--pink)>}</span>
	<span style=color:var(--bg4)>/* (...) */</span>
}
</pre>

Of course, if you want your popup to be more (or less) elaborate you can just do
so. As far as I can tell, the part that actually triggers adblock extensions 
most reliably is the long list of suspicious classes, so as long as the wrapper 
has those you can take the concept and do pretty much whatever with it.

Sadly, this can't account for DNS-based adblockers such as [PiHole](https://pi-hole.net), 
[AdGuard Home](https://github.com/AdguardTeam/AdGuardHome) or [Technitium](https://technitium.com/dns). 
Those solutions rely on the domain the ad's being loaded from, so there aren't 
any real reliable ways to trigger those without showing the user an actual ad, 
and I refuse to do that. Good on you if you're already using one of those, 
though! The popup shouldn't come back once you dismiss it, but you should 
probably consider a browser-level adblocker anyways (for YouTube ads, if nothing
else)?

## Final thoughts

First of all, check out [shouldiblockads.com](https://shouldiblockads.com) if 
you aren't convinced already.

Also, uh, I'm sorry about this section's preachy tone, I guess.

Look, a lot has been said about how ads are bad from an anti-capitalist and/or 
anti-consumerist point of view. I'm not beating that dead horse any more than it
needs to. Yes, they are, but that's not the argument I'm trying to make here.

Ads are <em>unnecessary</em>. You don't <em>have</em> to put up with them; you 
don't <em>have</em> to tolerate them; you don't <em>have</em> to keep making 
excuses for them.

It's been proven that ad agencies inflate their numbers to manufacture consent 
for their continued existence, and in reality very few (if any) people actually 
get any useful/actionable information from seeing advertisments. They're 
useless. You don't need them. Take a couple minutes to actually think about 
whether your life has ever been meaningfully improved by seeing an ad. Think 
about whether you have ever gotten any important piece of information from an ad
(not a PSA, mind you). If you somehow have ever found yourself in any of those 
situations, think about how often that has happened, and whether you would have 
realistically obtained that information from any other sources if you hadn't 
seen the ad itself.

If ads are useless, then what reason do you have left to keep exposing yourself 
to them while knowing full on well that you can almost effortlessly get rid of 
them almost completely? Apathy? Not getting around to it? Hey, you've read this 
whole article. Take a couple minutes to go set up adblock; I promise by the end 
of it reading will have taken longer.

You don't need ads. The people paying ad companies to show you ads don't need 
ads. The people that put ads on their websites or apps or whatever don't 
actually need ads. Considering the amount of energy and resources burned by the 
advertising industry, <em>humanity</em> doesn't need ads.

Are/were you pissed about Proof-Of-Work cryptocurrency's environmental impacts? 
About the environmental impact caused by all the new datacenters built during 
the Machine Learning/AI economic bubble? About Taylor Swift's private jet usage? 
Do you have any fucking idea how much money, energy and human-hours are wasted 
on advertising? Burned forever for <em>demonstrably</em> no fucking good at all?
Get mad about advertising too.

Speaking of being mad: did you get annoyed by my popup? Did it annoy you more or
less than the thousands of ads you are forcibly exposed to on a daily basis? Was
it too preachy? Is that preachiness more or less manipulative than the ones 
desperately trying to sell you weight-loss pills or whatever the fuck it is that
ad agencies are trying to sell nowadays? What made mine get your attention over 
those? Hey, if you don't notice normal ads' presence, why would you notice their
absence? Might as well get rid of them, no?

Just... You genuinely don't need ads in your life! They're annoying, 
harmful, privacy-violating, often manipulative and, most of all: <em>fucking 
useless, unnecessary and <b>OPTIONAL</b></em>. Block ads; I promise it'll be a 
net positive in your life.

Thank you for your time.