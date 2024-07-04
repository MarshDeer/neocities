// Function: Build Text Block
function createText(content) {
	let str =  content.text.replaceAll('<', '&lt;')
	let texts = str.replaceAll('>', '&gt;')
	if (content.text === '') return ''
	let output = ""
	// if there is formatted content
	if (content.formatting) {
		let characters = Array.from(texts.split(''))
		for (const [i, text] of characters.entries()) {
			const char = texts[i]
			// look for end of format
			const endFormatTypes = content.formatting.filter((f) => f.end === i);
			// for each type, create a closing tag
			for (const f of endFormatTypes) {
				if (f.type === "link") {output += "</a>"}
				if (f.type === "color") {output += "</span>"}
				if (f.type === "bold") {output += "</b>"}
				if (f.type === "small") {output += "</small>"}
				if (f.type === "mention") {output += "</a>"}
				if (f.type === "italic") {output += "</i>"}
				if (f.type === "strikethrough") {output += "</s>"}
			}
			// look for start of format
			const startFormatTypes = content.formatting.filter((f) => f.start === i);
			// for each type, create an opening tag
			for (const f of startFormatTypes) {
				if (f.type === "link") {output += `<a href="${f.url}">`}
				if (f.type === "color") {output += `<span style="color:${f.hex}">`}
				if (f.type === "bold") {output += `<b>`}
				if (f.type === "small") {output += `<small>`}
				if (f.type === "mention") {output += `<a className="mention" href="${f.blog.url}">`;}
				if (f.type === "italic") {output += `<i>`}
				if (f.type === "strikethrough") {output += `<s>`}
			}
		output += char
		}
	}
	// if no formatting, just output the text
	else {
		output += texts
	}

	// if unordered list
	if (content.subtype === "unordered-list-item") {
		let li = document.createElement('li')
			li.classList.add(content.subtype, 'unordered-list-item')
			li.innerHTML = output
		return li
	}
	// if ordered list
	if (content.subtype === "ordered-list-item") {
		let li = document.createElement('li')
			li.classList.add(content.subtype, 'ordered-list-item')
			li.innerHTML = output
		return li
	}
	// create and populate text element
	else {
		let p = document.createElement('p')
			p.classList.add(content.subtype)
			p.innerHTML = output
		return p
	}
}

// Function: Build Audio Block
function createAudio(content) {
	// Create audio wrapper
	let audioWrapper = document.createElement('div')
		audioWrapper.classList.add('audio-wrapper', 'thin', 'pink', 'border')
	// Get track data and assemble metadata element
	let audioTrack = document.createElement('b')
		audioTrack.classList.add('audio-track')
		audioTrack.innerHTML = content.title
	let audioArtist = document.createElement('i')
		audioArtist.classList.add('audio-artist')
		audioArtist.innerHTML = content.artist
	let audioMeta = document.createElement('div')
		audioMeta.classList.add('audio-meta')
		audioMeta.append(audioTrack, audioArtist)
	// Get albumart
	let audioArt = document.createElement('img')
		audioArt.src = content.poster[0].url
	// Create audio player
	let audioPlayer = document.createElement('audio')
		audioPlayer.controls = 'controls' // Why is this necessary
		audioPlayer.type = content.media.type
		audioPlayer.src = content.media.url
	// Assemble and return
	audioWrapper.append(audioMeta, audioArt, audioPlayer)
	return audioWrapper
}

// Function: Build Poll Block
function createPoll(content, permalink) {
	let id = permalink.substring(permalink.lastIndexOf("/") + 1);
	// Create poll item
	let poll = document.createElement('div')
		poll.classList.add('poll', 'thin', 'blue', 'border')
	// Append question text
	let question = document.createElement('span')
		question.classList.add('question')
		question.innerHTML = content.question
	poll.append(question)
	// Create answers
	content.answers.map((answers) => {
		let answer = document.createElement('a')
			answer.classList.add('option', 'blue', 'button')
			answer.target = "_blank"
			answer.href = `https://tumblr.com/${ user }/${ id }`
			answer.innerHTML = answers.answer_text
		poll.append(answer)
	})
	return poll
}

// Function: Build Link Block
function createLink(content) {
	// Create link element
	let link = document.createElement('a')
	link.classList.add('post-link', 'thin', 'green', 'border')
	link.href = content.url
	// Create poster element
	let posterImage = document.createElement('div')
		posterImage.classList.add('poster')
	let poster = content.poster
	if (poster) {
		posterImage.classList.add('has-image')
		posterImage.style.background = `linear-gradient(to top, var(--accent) 1.2em, transparent 2em), url(${content.poster[0].url})`
	}
	posterImage.innerHTML = `<span class="link-title">${content.title}`
	link.append(posterImage)
	// If link has description
	if (content.description) {
		let description = document.createElement('span')
			description.classList = "description"
			description.textContent = content.description
		link.append(description)
	}
	// Get link source
	let source = document.createElement('span')
		source.classList.add('source')
		source.innerHTML = `${content.site_name != null ? content.site_name : ''} | ${content.author != null ? content.author : ''}`
	if (content.author && content.site_name) link.append(source)
	return link
}

// Function: Build Image block
function createImage(media) {
	let image = document.createElement('img')
		image.src = media.url
		image.setAttribute('srcset', media.url)
		image.classList.add('post_media_photo', 'image')
	let anchor = document.createElement('a')
		anchor.classList.add('post_media_photo_anchor')
		anchor.setAttribute('data-big-photo', media.url)
		anchor.setAttribute('data-big-photo-height', media.height)
		anchor.setAttribute('data-big-photo-width', media.width)
		anchor.append(image)
	return anchor
}

// Function: Populate rows
function createRow(content, permalink) {
	// sort through content types
	switch (content.type) {
	case 'text':
		let textWrapper = document.createElement('div')
			textWrapper.classList.add('text-content')
			textWrapper.append(createText(content))
		return textWrapper
		break;
	case 'image':
		return createImage(content.media[0])
		break;
	case 'audio':
		return createAudio(content)
		break;
	case 'link':
		return createLink(content)
		break;
	case 'video':
		if (content.provider === 'tumblr') {
		let video = document.createElement('video')
			video.classList.add('video')
			video.src = content.url
			video.controls = true
		return video
		} else {
		let videoWidth = content.embed_iframe?.width ?? content.media.width
		let videoHeight = content.embed_iframe?.height ?? content.media.height
		let video = document.createElement('iframe')
			video.classList.add('video')
			video.src = content.embed_iframe?.url ?? content.media.url
			video.style.aspectRatio = `${ videoWidth } / ${ videoHeight }`
		return video
		}
		break;
	case 'poll':
		return createPoll(content, permalink)
		break;
	default: // FALLBACK FOR FUTURE UNSUPPORTED BLOCK TYPES
		return `${content.type} NPF BLOCK SUPPORT PENDING`
	}
}

// Function: Create rows
	function createRows(id, content, layout, permalink, trail = null) {
	let rows = document.createElement('div')
	// if there are indexes with asks
	let asks = []
	// if there are layouts
	if (layout.length) {
		// if there are rows
		let hasRows = layout.every(v => v.type === 'rows');
		layout.map((layout) => {
			if (hasRows) {
				if (layout.display) {
				// create individual rows
				layout.display.map((display) => {
					let row = document.createElement('div')
					row.classList.add(`content-rows`)
					row.style.setProperty('--columns', display.blocks.length)
					// if there is inner content in a row
					if (display.blocks) {
					display.blocks.map((block) => {
					let innerRow = document.createElement('div')
						innerRow.classList.add('row-element')
						innerRow.append(createRow(content[block], permalink))
						row.append(innerRow)
						rows.append(row)
					})
					}
				})
				}
			}
			else {
				// if layout is an ask
				if (layout.type === 'ask') {
					rows.classList.add('ask')
					// create ask header
						let askHeader = document.createElement('header')
							askHeader.classList.add('question-header', 'thin', 'gray', 'border')
						let askLink = document.createElement('a')
						let ask = document.createElement('div')
							ask.classList.add('question', 'thin', 'gray', 'border')
						let askerIcon = document.createElement('img')
							askerIcon.classList.add('thin', 'blue', 'border')
						let askerName = document.createElement('span')
						// populate non-anon header
						if (layout.attribution) {
							askerIcon.src = `https://api.tumblr.com/v2/blog/${layout.attribution.blog.name}/avatar/64`
							askerName.innerHTML = `${layout.attribution.blog.name}`
							asker.href = `https://${layout.attribution.blog.name}.tumblr.com`
						// populate anon header
						} else {
							askerIcon.src = "https://assets.tumblr.com/pop/src/assets/images/avatar/anonymous_avatar_96-223fabe0.png"
							askerName.innerHTML = "anonymous"
						}
					// assemble and push header
					askLink.append(askerIcon, askerName)
					askHeader.append(askLink)
					rows.append(askHeader)
					// assemble question block
					asks = layout.blocks
					if (layout.blocks) {
						layout.blocks.map((block) => {
							ask.append(createRow(content[block], permalink))
							rows.append(ask)
						})
					}
				}
				// if it is a reply
				if (!layout.display) {
					// create reply header
					let replyHeader = document.createElement('header')
						replyHeader.classList.add('reply-header', 'thin', 'gray', 'border')
					let replyLink = document.createElement('a')
					let reply = document.createElement('div')
						reply.classList.add('reply', 'thin', 'gray', 'border')
					let replyIcon = document.createElement('img')
						replyIcon.classList.add('thin', 'blue', 'border')
					let replyName = document.createElement('span')
					// populate not necessarily original header
					if (trail) {
						replyName.innerHTML = `${trail.name}`
						replyIcon.src = `https://api.tumblr.com/v2/blog/${trail.name}/avatar/64`
					// populate original header
					} else {
						replyName.innerHTML = user
						replyIcon.src = `https://api.tumblr.com/v2/blog/${user}/avatar/64`
					}
					// assemble and push header
					replyLink.append(replyIcon, replyName)
					replyHeader.append(replyLink)
					rows.append(replyHeader)
					// assemble answer block
					content.map((block, index) => {
						// if block is not part of the original ask
						if (asks.indexOf(index) === -1) {
							// if the reply is part of a trail
							if (trail) {
								reply.append(createRow(block,permalink))
								rows.append(reply)
							}
							// if reply is part of an original post
							else {
								rows.append(createRow(block, permalink))
							}
						}
					})
				}
			}
		})
	} else {
		content.map((block) => {
			rows.append(createRow(block, permalink))
		})
	}
	return rows
}

// Function: Request post activity data
function postNotes(url) {
	let postNotesData = ""
	let postNotesDiv = document.createElement('div')
	let httpRequest = new XMLHttpRequest()
		httpRequest.onreadystatechange = function (data) {
		postNotesData = data.srcElement.response
		}
		httpRequest.open("GET", url)
		httpRequest.send()
	postNotesDiv.innerHTML = postNotesData
	return postNotesDiv
}

// Function: Build Trail Item Header
function createHeader(blogName, blogURL, active) {
	// Assemble header item
	let userAvatar = `<img class="user-avatar blue thin border" src="https://api.tumblr.com/v2/blog/${ blogName }/avatar/32">`
	let reblogHeader = document.createElement('a')
		reblogHeader.href = blogURL
		// no images for inactive users
		reblogHeader.innerHTML = `${active ? userAvatar : ''} <span class="active-${ active } usernames">${ blogName }</span>`
	// return reblog header content
	return reblogHeader
}

// ========= POST RENDERING ====================
for (const post of posts) {
	let npf = post.npf
	let permalink = post.permalink
	let article = document.createElement('article')
		article.id = `post-${ post.id }`
		article.classList.add('border')

	// pink window if user is OP, blue window if pinned post
	if (npf.trail.length > 0 && npf.trail[0].blog.name === user || post.original) {
	article.classList.add('pink')
	} else if (post.pinned) {
	article.classList.add('blue')
	} else {
	article.classList.add('gray')
	}

	// build titlebar
	let titlebar = document.createElement('span')
		titlebar.classList.add('titlebar')
		titlebar.innerHTML = post.titlebarText
	article.append(titlebar)

	// build section
	let trailItem = document.createElement('section')
	let articleContent = document.createElement('div')
		articleContent.classList.add('article-content')

	// if the section is part of a reblog trail
	if (npf.trail) {
		npf.trail.map((trail, index) => {
			// populate header and content
			let header = document.createElement('header')
			let content = document.createElement('div')
			if (trail.blog) {
				header.append(createHeader(trail.blog.name, trail.blog.url, trail.blog.can_be_followed))
			} else {
				let brokenBlog = document.createElement('span')
					brokenBlog.classList.add('broken-blog', 'mention')
					brokenBlog.innerHTML = trail.broken_blog_name
				header.append(brokenBlog)
			}
			content.append(createRows(post.id, trail.content, trail.layout, permalink, trail.blog))
			header.classList.add('thin', 'border')
			content.classList.add('trail-item', 'thin', 'border')
			// did I make this trail item?
			if (trail.blog.name === user) {
				content.classList.add('pink')
				header.classList.add('pink')
			} else {
				content.classList.add('gray')
				header.classList.add('gray')
			}
			trailItem.append(header, content)
			articleContent.append(trailItem)
		})
	}

	// if the section is an original addition
	if (npf.content.length > 0) {
		let header = document.createElement('header')
			header.append(createHeader(user, `https://${ user }.tumblr.com`, true, null))
			header.classList.add('pink', 'thin' , 'border')
		let content = document.createElement('div')
			content.append(createRows(post.id, npf.content, npf.layout, permalink))
			content.classList.add('trail-item', 'pink', 'thin', 'border')
		trailItem.append(header, content)
		articleContent.append(trailItem)
	}
	// assemble into article
	article.append(articleContent)

	// tags
	if (post.tags) {
		let tagged = document.createElement('section')
			tagged.classList.add('tags', 'gray', 'thin', 'border')
		for (let tag of post.tags) {
			let tagContent = `<a href="/tagged/${ tag }">#${ tag }</a> `
			let tagLink = document.createElement('span')
				tagLink.innerHTML = tagContent
			tagged.append(tagLink)
		}
	articleContent.append(tagged)
	}

	// footer line
	let postInfo = document.createElement('footer')
	// notes
		if (post.noteCount) {
		let notecount = document.createElement('a')
			notecount.href = permalink
			notecount.innerHTML = `${post.noteCount}`
			notecount.classList.add('note-count', 'info-box', 'gray', 'thin', 'border')
		postInfo.append(notecount)
		}
	// date
		let postdate = document.createElement('span')
			postdate.innerHTML = post.date
			postdate.classList.add('post-date', 'info-box', 'gray', 'thin', 'border')
		postInfo.append(postdate)
	// buttons
		// Create container
		let postButtons = document.createElement('div')
			postButtons.classList.add('interaction-buttons','gray','thin','border')
		// Create buttons
		let permabutton = document.createElement('a')
			permabutton.href = permalink
			permabutton.innerHTML = "Perma"
			permabutton.classList.add('orange', 'button')
		let viewbutton = document.createElement('a')
			viewbutton.href = "https://tumblr.com/"+user+"/"+post.id
			viewbutton.innerHTML = "View"
			viewbutton.classList.add('blue', 'button')
		let reblogbutton = document.createElement('a')
			reblogbutton.href = "https://tumblr.com/reblog/"+user+"/"+post.id+"/reblog"
			reblogbutton.innerHTML = "Reblog"
			reblogbutton.classList.add('green', 'button')
		// Assemble element
		postButtons.append(permabutton, viewbutton, reblogbutton)
		postInfo.append(postButtons)
	// assemble post footer
	article.append(postInfo)

	// append post activity on permalink page
	if (permalink === window.location.href) {
		pagination.append(postNotes(post.postNotes))
	}

	// Ask/Sumbit dialog
	if (container.classList.contains('inbox')) {
		let inbox = document.createElement('div')
			inbox.classList.add('text-content')
			inbox.innerHTML = post.inboxBody
		articleContent.append(inbox)
	}

	// append article to container
	container.append(article)
}
