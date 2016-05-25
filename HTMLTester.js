
var beautifyOptions = { 
    indent_inner_html: true,
    indent_with_tabs: true,
    preserve_newlines: true,
    max_preserve_newlines: 1,
    extra_liners: "",
    wrap_line_length: 0,
    end_with_newline: true
};

var intervals = [];
var timeouts = [];
function hookTimers(wnd) {
	var originalSetInterval = wnd.setInterval;
	var originalSetTimeout = wnd.setTimeout;
	wnd.setInterval = function(proc, delay) {
		intervals.push(originalSetInterval(proc, delay));	
	};
	wnd.setTimeout = function(proc, delay) {
		timeouts.push(originalSetTimeout(proc, delay));	
	};
}
function clearHookedTimers(wnd) {
	var i;
	for (i = 0; i < intervals.length; i++) {
		wnd.clearInterval(intervals[i]);
	}
	intervals = [];
	for (i = 0; i < timeouts.length; i++) {
		wnd.clearTimeout(timeouts[i]);
	}
	timeouts = [];
}

function fireResize() {
	var e = document.createEvent('Event');
	e.initEvent('resize', true, true);
	document.body.dispatchEvent(e);
}

function getMixedEditor() {
	return ace.edit("TesterMixed");
}

function getJSEditor() {
	return ace.edit("TesterJS");
}

function getCSSEditor() {
	return ace.edit("TesterCSS");
}

function switchToMixed() {
	var html = document.getElementById("TesterMixed");
	html.style.height = "100%";
	html.style.display = "inline-block";
	document.getElementById("TesterJS").style.display = "none";
	document.getElementById("TesterCSS").style.display = "none";
	document.getElementById("TesterMixedItem").classList.add("active");
	document.getElementById("TesterJSItem").classList.remove("active");
	document.getElementById("TesterCSSItem").classList.remove("active");
	document.getElementById("TesterAllItem").classList.remove("active");
	var open = document.getElementById("openFile");
	open.disabled = "";
	open.accept = ".htm,.html";
	document.getElementById("openFileSpan").style.display = "inline";
	fireResize();
}

function switchToJS() {
	var js = document.getElementById("TesterJS");
	document.getElementById("TesterMixed").style.display = "none";
	js.style.height = "100%";
	js.style.display = "inline-block";
	document.getElementById("TesterCSS").style.display = "none";
	document.getElementById("TesterMixedItem").classList.remove("active");
	document.getElementById("TesterJSItem").classList.add("active");
	document.getElementById("TesterCSSItem").classList.remove("active");
	document.getElementById("TesterAllItem").classList.remove("active");
	var open = document.getElementById("openFile");
	open.disabled = "";
	open.accept = ".js";
	document.getElementById("openFileSpan").style.display = "inline";
	fireResize();
}

function switchToCSS() {
	var css = document.getElementById("TesterCSS");
	document.getElementById("TesterMixed").style.display = "none";
	document.getElementById("TesterJS").style.display = "none";
	css.style.height = "100%";
	css.style.display = "inline-block";
	document.getElementById("TesterMixedItem").classList.remove("active");
	document.getElementById("TesterJSItem").classList.remove("active");
	document.getElementById("TesterCSSItem").classList.add("active");
	document.getElementById("TesterAllItem").classList.remove("active");
	var open = document.getElementById("openFile");
	open.disabled = "";
	open.accept = ".css";
	document.getElementById("openFileSpan").style.display = "inline";
	fireResize();
}

function switchToAll() {
	var html = document.getElementById("TesterMixed");
	var js = document.getElementById("TesterJS");
	var css = document.getElementById("TesterCSS");
	html.style.display = "inline-block";
	html.style.height = "33%";
	js.style.display = "inline-block";
	js.style.height = "33%";
	css.style.display = "inline-block";
	css.style.height = "33%";
	document.getElementById("TesterMixedItem").classList.remove("active");
	document.getElementById("TesterJSItem").classList.remove("active");
	document.getElementById("TesterCSSItem").classList.remove("active");
	document.getElementById("TesterAllItem").classList.add("active");
	document.getElementById("openFile").disabled = true;
	document.getElementById("openFileSpan").style.display = "none";
	fireResize();
}

function renderHtml(html, iframe) {
	var ifrw = (iframe.contentWindow) ? iframe.contentWindow : (iframe.contentDocument.document) ? iframe.contentDocument.document : iframe.contentDocument;
	ifrw.document.open();
	ifrw.document.write(html);  
	ifrw.document.close();
	return iframe;
}

function renderHtmlFix(html, iframe) {
	var ifrw = (iframe.contentWindow) ? iframe.contentWindow : (iframe.contentDocument.document) ? iframe.contentDocument.document : iframe.contentDocument;
	ifrw.document.open();
	ifrw.document.write(html);  
	ifrw.document.close();
	if (ifrw.document.body && !ifrw.document.body.isContentEditable) {
		ifrw.document.body.contentEditable = true;
		ifrw.document.body.contentEditable = false;
	}
	return iframe;
}

function refreshScripts (container) {
	var scripts = container.getElementsByTagName("script");
	for (var i = 0; i < scripts.length; i++) {
		var script = scripts[i];
		var newScript = document.createElement("script");
		newScript.id = script.id;
		newScript.name = script.name;
		newScript.type = script.type;
		newScript.appendChild(document.createTextNode(script.innerHTML));
		container.insertBefore(newScript, script);
		container.removeChild(script);
	}
}

function download(text, fileName, type) {
	var file = new Blob([text], {type: type});
	if (typeof navigator.msSaveOrOpenBlob != "undefined") {
		navigator.msSaveOrOpenBlob(file, fileName);
	}
	else {
	  	var a = document.createElement("a");
		a.href = URL.createObjectURL(file);
		a.download = fileName;
		a.style.display = "none";
		document.body.appendChild(a);
		try {
			if (document.createEvent) {
				var e = document.createEvent("MouseEvents");
				e.initEvent("click", true, true);
				a.dispatchEvent(e);
			}
			else {
				a.click();
			}
		}
		finally {
	  	document.body.removeChild(a);
		}
	}
}

function randomFourDigitHex() {
	var hex = Math.floor(Math.random() * 0x10000).toString(16);
	for (var i = 4 - hex.length; i > 0; i--) hex = "0" + hex;
	return hex;
}

function randomGuid() {
	return randomFourDigitHex() + randomFourDigitHex() + randomFourDigitHex() + randomFourDigitHex() +
				 randomFourDigitHex() + randomFourDigitHex() + randomFourDigitHex() + randomFourDigitHex();
}

function GetHTMLFromDocument(doc) {
	var doctype = '<!DOCTYPE ' + doc.doctype.name + (doc.doctype.publicId ? ' PUBLIC "' + doc.doctype.publicId + '"' : '') + (!doc.doctype.publicId && doc.doctype.systemId ? ' SYSTEM' : '') + (doc.doctype.systemId ? ' "' + doc.doctype.systemId + '"' : '') + '>\n';
	return doctype + doc.documentElement.outerHTML;
}

function GetFullCode() {
	var addCss = getCSSEditor().getValue().trim().length > 1;
	var addJs = getJSEditor().getValue().trim().length > 1;
	var addJQuery = document.getElementById("jqueryFlag").checked;
	if (addCss || addJs || addJQuery) {
		var tempFrame = document.createElement("iframe");
		tempFrame.id = "tempFrame_" + randomGuid();
		tempFrame.style.display = "none";
		tempFrame.sandbox = "allow-same-origin";
		document.body.appendChild(tempFrame);
		var ifrw = (tempFrame.contentWindow) ? tempFrame.contentWindow : (tempFrame.contentDocument.document) ? tempFrame.contentDocument.document : tempFrame.contentDocument;
		renderHtml(getMixedEditor().getValue(), tempFrame);
		if (addJQuery) {
			var js = ifrw.document.createElement("script");
			js.type = "text/javascript";
			js.src = "https://code.jquery.com/jquery-2.2.3.min.js";
			ifrw.document.head.insertBefore(js, ifrw.document.head.firstElementChild);
		}
		if (addCss) {
			var css = ifrw.document.createElement("style");
			css.type = "text/css";
			css.appendChild(ifrw.document.createTextNode(getCSSEditor().getValue()));
			ifrw.document.head.appendChild(css);
		}
		if (addJs) {
			var js = ifrw.document.createElement("script");
			js.type = "text/javascript";
			js.appendChild(ifrw.document.createTextNode(getJSEditor().getValue()));
			if (document.getElementById("jsBody").checked) {
				if (document.getElementById("jsEnd").checked) {
					ifrw.document.body.appendChild(js);
				}
				else {
					ifrw.document.insertBefore(js, ifrw.document.body.firstElementChild);
				}
			}
			else {
				if (document.getElementById("jsEnd").checked) {
					ifrw.document.head.appendChild(js);
				}
				else {
					ifrw.document.insertBefore(js, ifrw.document.head.firstElementChild);
				}
			}
		}
		var html = GetHTMLFromDocument(tempFrame.contentDocument);
		document.body.removeChild(tempFrame);
		return html;
	}
	return getMixedEditor().getValue();
}

function TesterDownload() {
	var text, fileType, fileName;
	fileType = "text/html";
	fileName = "TestedPage_" + randomGuid() + ".html";
	text = html_beautify(GetFullCode(), beautifyOptions);
	if (typeof window.chrome != "undefined") { 
		fileName = prompt("Insert filename", fileName);
		if (fileName !== null && fileName !== "") {
			var fileNamePattern = /^[0-9a-zA-Z_ ... ]+$/;
			if (fileNamePattern.test(fileName)) {
				download(text, fileName, fileType+";charset=utf-8");
			}
			else {
				alert("Filename is invalid");
			}
		}
	}
	else download(text, fileName, fileType+";charset=utf-8");
}

function addAceEditorLabel(editorId, text) {
	var div = document.createElement("div");
	div.style.position = "absolute";
	div.style.right = "5px"; 
	div.style.zIndex = 9999; 
	div.style.color = "#404040";
	div.innerHTML = text;
	document.getElementById(editorId).getElementsByClassName("ace_scroller")[0].appendChild(div);
}

function TesterLoad() {
	var page = queryString("page");
	switch (page) {
		case "html":
			break;
		case "js":
			switchToJS();
			break;
		case "css":
			switchToCSS();
			break;
		default:
			switchToAll();
			break;
	}
	ace.require("ace/ext/language_tools");
	var editor = getMixedEditor();
	var jsEditor = getJSEditor();
	var cssEditor = getCSSEditor();
	editor.session.setMode("ace/mode/html");
	jsEditor.session.setMode("ace/mode/javascript");
	cssEditor.session.setMode("ace/mode/css");
	editor.setTheme("ace/theme/eclipse");
	jsEditor.setTheme("ace/theme/eclipse");
	cssEditor.setTheme("ace/theme/eclipse");
	editor.setOptions({
		enableBasicAutocompletion: true,
		enableSnippets: true,
		enableLiveAutocompletion: false
	});
	jsEditor.setOptions({
		enableBasicAutocompletion: true,
		enableSnippets: true,
		enableLiveAutocompletion: false
	});
	cssEditor.setOptions({
		enableBasicAutocompletion: true,
		enableSnippets: true,
		enableLiveAutocompletion: false
	});
	
	document.getElementById("TesterMixed").classList.add("cool-border");
	document.getElementById("TesterJS").classList.add("cool-border");
	document.getElementById("TesterCSS").classList.add("cool-border");
	
	var html = queryString("html");
	if (html != null) {
		editor.setValue(LZString.decompressFromBase64(html));
		editor.clearSelection();	
	}
	else {
		var defaultTestHtml = "<!DOCTYPE html>\n<html>\n\t<head>\n\t\t\n\t</head>\n\t<body>\n\t\t\n\t</body>\n</html>\n";
		editor.setValue(defaultTestHtml);
		editor.clearSelection();
	}
	var js = queryString("js");
	if (js != null) {
		jsEditor.setValue(LZString.decompressFromBase64(js));
		jsEditor.clearSelection();
		js = queryString("jsPos");
		if (js != null) {
			if (js == "head") {
				document.getElementById("jsHead").checked = true;
				document.getElementById("jsBody").checked = false;
			}
			else {
				document.getElementById("jsHead").checked = false;
				document.getElementById("jsBody").checked = true;
			}
		}
	}
	var css = queryString("css");
	if (css != null) {
		cssEditor.setValue(LZString.decompressFromBase64(css));
		cssEditor.clearSelection();
	}
	var jquery = queryString("jquery");
	if (jquery != null && jquery == "true") {
		document.getElementById("jqueryFlag").checked = true;
	}
	editor.getSession().on('change', TesterOnCodeChange);
	jsEditor.getSession().on('change', TesterOnCodeChange);
	cssEditor.getSession().on('change', TesterOnCodeChange);
	addAceEditorLabel("TesterMixed", "HTML");
	addAceEditorLabel("TesterJS", "JS");
	addAceEditorLabel("TesterCSS", "CSS");
	
	//hookTimers(document.getElementById("TesterResult").contentWindow);
	
	var command = queryString("autoLoad");
	if (command != null && command == "true") {
		TesterUpdate();
	}
	command = queryString("fullScreen");
	if (command != null && command == "true") {
		TesterFullScreen();
	}
}

function TesterUpdate() {
	var html = GetFullCode(), wrapper = document.getElementById("TesterResultWrapper"), frame;
	wrapper.innerHTML = "";
	frame = document.createElement("iframe");
	frame.id = "TesterResult";
	frame.className = "cool-border";
	frame.style.background = "white";
	frame.style.width = "100%";
	frame.style.height = "100%";
	frame.style.display = "inline-block";
	wrapper.appendChild(frame);
	renderHtmlFix(html, frame);
}

function TesterPushJS() {
	var addJs = getJSEditor().getValue().trim().length > 1;
	if (addJs) {
		var tempFrame = document.createElement("iframe");
		tempFrame.id = "tempFrame_" + randomGuid();
		tempFrame.style.display = "none";
		tempFrame.sandbox = "allow-same-origin";
		document.body.appendChild(tempFrame);
		renderHtml(getMixedEditor().getValue(), tempFrame);
		if (addJs) {
			var js = tempFrame.contentDocument.createElement("script");
			js.type = "text/javascript";
			js.appendChild(tempFrame.contentDocument.createTextNode(getJSEditor().getValue()));
			if (document.getElementById("jsBody").checked) {
				tempFrame.contentDocument.body.appendChild(js);
			}
			else {
				tempFrame.contentDocument.head.appendChild(js);	
			}
		}
		var html = GetHTMLFromDocument(tempFrame.contentDocument);
		document.body.removeChild(tempFrame);
		getJSEditor().setValue("");
		getMixedEditor().setValue(html_beautify(html, beautifyOptions));
		getMixedEditor().clearSelection();
	}
}

function TesterClear() {
	if (document.getElementById("TesterMixed").style.display != "none") {
		var editor = getMixedEditor();
		editor.setValue("<!DOCTYPE html>\n<html>\n\t<head>\n\t\t\n\t</head>\n\t<body>\n\t\t\n\t</body>\n</html>\n");
		editor.clearSelection();
	}
	if (document.getElementById("TesterJS").style.display != "none") {
		getJSEditor().setValue("");
	}
	if (document.getElementById("TesterCSS").style.display != "none") {
		getCSSEditor().setValue("");
	}
	//TesterUpdate();
}

function TesterBeautify() {
	if (document.getElementById("TesterMixed").style.display != "none") {
		var editor = getMixedEditor();
		if (editor.getValue().trim().length > 1) {
			editor.setValue(html_beautify(editor.getValue(), beautifyOptions));
			editor.clearSelection();
		}
	}
	if (document.getElementById("TesterJS").style.display != "none") {
		var editor = getJSEditor();
		if (editor.getValue().trim().length > 1) {
			editor.setValue(js_beautify(editor.getValue(), beautifyOptions));
			editor.clearSelection();
		}
	}
	if (document.getElementById("TesterCSS").style.display != "none") {
		var editor = getCSSEditor();
		if (editor.getValue().trim().length > 1) {
			editor.setValue(css_beautify(editor.getValue(), beautifyOptions));
			editor.clearSelection();
		}
	}
}

function TesterOnCodeChange() {
	var realTimeUpdate = document.getElementById("TesterRealTimeUpdate");
	if (realTimeUpdate.checked) TesterUpdate();
}

function TesterRealTime() {
	var realTimeUpdate = document.getElementById("TesterRealTimeUpdate");
	document.getElementById("TesterUpdateBtn").disabled = realTimeUpdate.checked;
	if (realTimeUpdate.checked) TesterUpdate();
}

function TesterFullScreen() {
	document.body.style.overflow = "hidden";
	var frame = document.getElementById("TesterResult");
	var oldClass = frame.className;
	frame.className = "full-screen";
	var closeButtonDiv = document.createElement("div");
	closeButtonDiv.className = "cool-button";
	closeButtonDiv.style.position = "fixed";
	closeButtonDiv.style.top = "10px";
	closeButtonDiv.style.right = "30px";
	closeButtonDiv.style.zIndex = 0x7FFFFFFE;
	var closeButton = document.createElement("button");
	closeButton.appendChild(document.createTextNode("Close"));
	closeButton.onclick = function() {
		document.body.removeChild(closeButtonDiv);
		frame.className = oldClass;
		document.body.style.overflow = "auto";
	};
	closeButtonDiv.appendChild(closeButton);
	document.body.appendChild(closeButtonDiv);
}

function TesterFileOpen() {
	var openFile = document.getElementById("openFile");
	if (typeof openFile.files != "undefined" && openFile.files != null && openFile.files.length == 1) {
		var file = openFile.files[0];
		if (file) {
			var reader = new FileReader();
			reader.onload = function(e) {
				var editor;
				if (document.getElementById("TesterMixed").style.display != "none") {
					editor = getMixedEditor();
				}
				else if (document.getElementById("TesterJS").style.display != "none") {
					editor = getJSEditor();
				}
				else if (document.getElementById("TesterCSS").style.display != "none") {
					editor = getCSSEditor();
				}
				editor.setValue(e.target.result);
				editor.clearSelection();
				openFile.value = null;
			};
			reader.readAsText(file);
		}
	}
}

function TesterImageOpen() {
	var openFile = document.getElementById("openImage");
	if (typeof openFile.files != "undefined" && openFile.files != null && openFile.files.length == 1) {
		var file = openFile.files[0];
		if (file) {
			var reader = new FileReader();
			reader.onload = function(e) {
				var pasteZone = document.getElementById("pasteZone");
				var html = '<img src="' + splitStringEvery(e.target.result, 30000).join("\n") + '" />';
				var textArea = document.createElement("textarea");
				textArea.id = "image_" + randomGuid();
				textArea.className = "cool-border";
				textArea.value = html;
				textArea.style.width = "100%";
				textArea.style.height = "100px";
				textArea.style.background = "white";
				textArea.style.resize = "none";
				textArea.style.marginBottom = "10px";
				textArea.readOnly = true;
				textArea.oncontextmenu = function(e) {
					e.returnValue = false;
					showContextMenu(e.clientX, e.clientY, [
						{ 
							description: "Copy HTML", 
							action: function() {
								textArea.select();
								document.execCommand('copy');
							}
						},
						{ 
							description: "Remove Image", 
							action: function() { pasteZone.removeChild(textArea); pasteZoneCheck(); } 
						}
					]);
					return false;
				};
				pasteZone.appendChild(textArea);
				pasteZoneCheck();
				window.scrollTo(0, document.body.scrollHeight);	
				openFile.value = null;
			};
			reader.readAsDataURL(file);
		}
	}
}

function getTextMetrics(text, font, size) {
	var canvas = getTextMetrics.canvas || (getTextMetrics.canvas = document.createElement("canvas"));
	var context = canvas.getContext("2d");
	context.font = font + " " + size;
	return context.measureText(text);
}

function adjustTextForWidth(text, font, size, boxWidth) {
	var textWidth = getTextMetrics(text, font, size).width;
	if (textWidth > boxWidth) {
		var dotsWidth = getTextMetrics("... ", font, size).width;
		boxWidth -= dotsWidth;
		var words = text.split(" ");
		text = "";
		textWidth = 0;
		for (var i = 0; i < words.length; i++) {
			textWidth += getTextMetrics(words[i], font, size).width;
			if (textWidth > boxWidth) {
				break;
			}
			else {
				text += words[i] + " ";
			}
		}
		text += "...";
	}
	return text;
}

function setCoolBorder(el) {
    el.style["border"] = "none";
    el.style["border-top"] = "1px solid #a0a0a0";
    el.style["-webkit-border-radius"] = "4px";
    el.style["-moz-border-radius"] = "4px";
    el.style["border-radius"] = "4px";
    el.style["-webkit-box-shadow"] = "0px 1px 1px black";
    el.style["-moz-box-shadow"] = "0px 1px 1px black";
    el.style["box-shadow"] = "0px 1px 1px black";
}

function showContextMenu (x, y, itemArray) {
	var nullContextMenu = function(e) { e.returnValue = false; return false; };
	var cmDiv = document.createElement("div");
	cmDiv.oncontextmenu = nullContextMenu;
	cmDiv.className = "cool-contextmenu";
	cmDiv.tabIndex = -1;
	cmDiv.style.zIndex = 0x7FFFFFFD;
	var cmID = "cm_" + randomGuid();
	cmDiv.id = cmID;
	var removeThis = function () { 
		var cm = document.getElementById(cmID);
		if (cm) {
			document.body.removeChild(cm);
		}
	};
	cmDiv.onblur = removeThis;
	var cmUl = document.createElement("ul");
	cmUl.oncontextmenu = nullContextMenu;
	for (var i = 0; i < itemArray.length; i++) {
		var item = itemArray[i];
		var cmLi = document.createElement("li");
		cmLi.oncontextmenu = nullContextMenu;
		cmLi.appendChild(document.createTextNode(item.description));
		cmLi.onclick = item.action;
		cmUl.appendChild(cmLi);
	}
	var cmLiCancel = document.createElement("li");
	cmLiCancel.oncontextmenu = nullContextMenu;
	cmLiCancel.appendChild(document.createTextNode("Cancel"));
	cmUl.appendChild(cmLiCancel);
	cmUl.onclick = removeThis;
	var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
	if (typeof document.addEventListener != "undefined")
		document.addEventListener(mousewheelevt, function(e) { e.currentTarget.removeEventListener(e.type, arguments.callee); removeThis(); }, false);
	else
		document.attachEvent("on"+mousewheelevt, function(e) { e = window.event || e; e.currentTarget.detachEvent(e.type, arguments.callee); removeThis(); });
	cmDiv.appendChild(cmUl);
	document.body.appendChild(cmDiv);
	if (cmUl.clientWidth < 150) cmUl.style.width = "150px";
	if (y + cmDiv.clientHeight > window.innerHeight) {
		y = window.innerHeight - cmDiv.clientHeight;
	}
	if (x + cmDiv.clientWidth > window.innerWidth) {
		x = window.innerWidth - cmDiv.clientWidth;
	}
	if (x < 0) x = 0;
	if (y < 0) y = 0;
	// if position is absolute
	/*x += document.body.scrollLeft;
	y += document.body.scrollTop;*/
	cmDiv.style.left = x.toString() + "px";
	cmDiv.style.top = y.toString() + "px";
	cmDiv.focus();
}

function splitStringEvery(str, n) {
    return str.match(new RegExp("[\\s\\S]{1," + n + "}", "g")) || [];
}

function textareaToEditor(textareaId, withResult) {
	var txtArea = document.getElementById(textareaId);
	if (txtArea.tagName.toLowerCase() == "textarea") {
		var container = txtArea.parentNode;
		var txt = txtArea.value;
		var table = document.createElement("table");
		table.style.width = txtArea.style.width;
		table.style.height = txtArea.style.height;
		var tr = document.createElement("tr");
		table.appendChild(tr);
		var leftTd = document.createElement("td");
		tr.appendChild(leftTd);
		if (withResult) {
			var rightTd = document.createElement("td");
			tr.appendChild(rightTd);
			leftTd.style.width = "50%";
			rightTd.style.width = "50%";
		}
		else {
			leftTd.style.width = "100%";
		}
		container.style.margin = "0";
		container.style.padding = "0";
		container.insertBefore(table, txtArea);
		container.removeChild(txtArea);
		var div = document.createElement("div");
		div.id = textareaId;
		div.style.width = "100%";
		div.style.height = "100%";
		setCoolBorder(div);
		leftTd.appendChild(div);
		var editor = ace.edit(textareaId);
		editor.session.setMode("ace/mode/html");
		editor.setTheme("ace/theme/eclipse");
		editor.setOptions({
			enableBasicAutocompletion: true,
			enableSnippets: true,
			enableLiveAutocompletion: true
		});
		editor.setValue(txt);
		editor.clearSelection();
		if (withResult) {
			var frame = document.createElement("iframe");
			frame.id = textareaId + "Result";
			frame.style.width = "100%";
			frame.style.height = "100%";
			frame.style.background = "white";
			setCoolBorder(frame);
			rightTd.appendChild(frame);
			renderHtml(txt, frame);
			editor.getSession().on('change', function() {
				renderHtml(editor.getValue(), frame);
			});
		}
	}
}

function TesterGeneratePageUrl() {
	var pasteZone = document.getElementById("pasteZone");
	var html = getMixedEditor().getValue();
	if (html.trim().length > 0) html = LZString.compressToBase64(html);
	var js = getJSEditor().getValue();
	if (js.trim().length > 0) js = LZString.compressToBase64(js);
	var css = getCSSEditor().getValue();
	if (css.trim().length > 0) css = LZString.compressToBase64(css);
	var qs = window.location.origin + window.location.pathname + "?"
		 + (html.length > 0 ? "html=" + encodeURIComponent(html) : "")
		 + (js.length > 0 ? (html.length > 0 ? "&" : "") + "js=" + encodeURIComponent(js) : "")
		 + (css.length > 0 ? (html.length > 0 || js.length > 0 ? "&" : "") + "css=" + encodeURIComponent(css) : "")
		 + (js.length > 0 ? (document.getElementById("jsBody").checked ? "" : "&jsPos=head") : "")
		 + (document.getElementById("jqueryFlag").checked ? (html.length > 0 || js.length > 0 || css.length > 0 ? "&" : "") + "jquery=true" : "");
	
	var textArea = document.createElement("textarea");
	textArea.id = "page_" + randomGuid();
	textArea.className = "cool-border";
	textArea.value = qs;
	textArea.style.width = "100%";
	textArea.style.height = "100px";
	textArea.style.background = "white";
	textArea.style.resize = "none";
	textArea.style.marginBottom = "10px";
	textArea.readOnly = true;
	textArea.oncontextmenu = function(e) {
		e.returnValue = false;
		showContextMenu(e.clientX, e.clientY, [
			{ 
				description: "Copy URL", 
				action: function() {
					textArea.select();
					document.execCommand('copy');
				}
			},
			{
				description: "Open URL",	
				action: function() {
					window.location.href = qs;
				}
			},
			{
				description: "Open in a new tab",	
				action: function() {
					var a = document.createElement("a");
					a.style.display = "none";
					a.href = qs;
					a.target = "_blank";
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);
				}
			},
			{ 
				description: "Remove URL", 
				action: function() { pasteZone.removeChild(textArea); pasteZoneCheck(); } 
			}
		]);
		return false;
	};
	pasteZone.appendChild(textArea);
	pasteZoneCheck();
	window.scrollTo(0, document.body.scrollHeight);	
}

function queryString(key) {
    var url = window.location.href;
    var queryStringStart = url.indexOf("?");
    if (queryStringStart > 0) {
        key = key.toLowerCase();
        var args = url.substring(queryStringStart+1).split("&");
        for (var i = 0; i < args.length; i++) {
            var equals = args[i].indexOf("=");
            if (equals > 0) {
                var argKey = args[i].substring(0, equals);
                if (argKey.toLowerCase() == key) {
                    return decodeURIComponent(args[i].substring(equals+1));
                }
            }
            else if (args[i].toLowerCase() == key) return null;
        }
    }
    return null;
}

function pasteZoneCheck() {
	var table = document.getElementById("pasteTable");
	var zone = document.getElementById("pasteZone");
	table.style.display = zone.children.length > 0 ? "table" : "none";
}

