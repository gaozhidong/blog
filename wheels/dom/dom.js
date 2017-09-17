let dom = {
	on: function (element, eventType, selector, fn) {
		element.addEventListener(eventType, e => {
			let el = e.target
			while (!el.matches(selector)) {
				if (element === el) {
					el = null
					break
				}
				el = el.parentNode
			}
			el && fn.call(el, e, el)
		})
		return element
	},
	index: function (element) {
		let siblings = element.parentNode.children
		for (let index = 0; index < siblings.length; index++) {
			if (siblings[index] === element) {
				return index
			}
		}
		return -1
	},
	uniqueClass: function (element, className) {
		dom.every(element.parentNode.children, el => {
			el.classList.remove(className)
		})
		element.classList.add(className)
		return element
	},
	every: function (nodeList, fn) {
		for (var i = 0; i < nodeList.length; i++) {
			fn.call(null, nodeList[i], i)
		}
		return nodeList
	},
	create: function (html, children) {
		var template = document.createElement('template')
		template.innerHTML = html.trim()
		let node = template.content.firstChild
		if (children) {
			dom.append(node, children)
		}
		return node
	},
}