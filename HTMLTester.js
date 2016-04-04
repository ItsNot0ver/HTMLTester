﻿
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
	document.getElementById("TesterMixed").style.display = "";
	document.getElementById("TesterJS").style.display = "none";
	document.getElementById("TesterCSS").style.display = "none";
	document.getElementById("TesterMixedItem").classList.add("active");
	document.getElementById("TesterJSItem").classList.remove("active");
	document.getElementById("TesterCSSItem").classList.remove("active");
	document.getElementById("openFile").accept = ".htm,.html";
}

function switchToJS() {
	document.getElementById("TesterMixed").style.display = "none";
	document.getElementById("TesterJS").style.display = "";
	document.getElementById("TesterCSS").style.display = "none";
	document.getElementById("TesterMixedItem").classList.remove("active");
	document.getElementById("TesterJSItem").classList.add("active");
	document.getElementById("TesterCSSItem").classList.remove("active");
	document.getElementById("openFile").accept = ".js";
}

function switchToCSS() {
	document.getElementById("TesterMixed").style.display = "none";
	document.getElementById("TesterJS").style.display = "none";
	document.getElementById("TesterCSS").style.display = "";
	document.getElementById("TesterMixedItem").classList.remove("active");
	document.getElementById("TesterJSItem").classList.remove("active");
	document.getElementById("TesterCSSItem").classList.add("active");
	document.getElementById("openFile").accept = ".css";
}

function renderHtml(html, iframeId) {
	var iframe = document.getElementById(iframeId);
	iframe.contentDocument.open();
	iframe.contentDocument.write(html);
	iframe.contentDocument.close();
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

function TesterDownload() {
	var editor, fileType, fileName;
	if (document.getElementById("TesterMixed").style.display != "none") {
		editor = getMixedEditor();
		fileType = "text/html";
		fileName = "TestedPage_" + randomGuid() + ".html";
	}
	else if (document.getElementById("TesterJS").style.display != "none") {
		editor = getJSEditor();
		fileType = "text/javascript";
		fileName = "TestedScript_" + randomGuid() + ".js";
	}
	else if (document.getElementById("TesterCSS").style.display != "none") {
		editor = getCSSEditor();
		fileType = "text/css";
		fileName = "TestedStyles_" + randomGuid() + ".css";
	}
	if (typeof window.chrome != "undefined") { 
		fileName = prompt("Insert filename", fileName);
		if (fileName !== null && fileName !== "") {
			var fileNamePattern = /^[0-9a-zA-Z_ ... ]+$/;
			if (fileNamePattern.test(fileName)) {
				download(editor.getValue(), fileName, fileType+";charset=utf-8");
			}
			else {
				alert("Filename is invalid");
			}
		}
	}
	else download(editor.getValue(), fileName, fileType+";charset=utf-8");
}

function TesterLoad() {
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
		enableLiveAutocompletion: true
	});
	jsEditor.setOptions({
		enableBasicAutocompletion: true,
		enableSnippets: true,
		enableLiveAutocompletion: true
	});
	cssEditor.setOptions({
		enableBasicAutocompletion: true,
		enableSnippets: true,
		enableLiveAutocompletion: true
	});
	
	document.getElementById("TesterMixed").classList.add("cool-border");
	document.getElementById("TesterJS").classList.add("cool-border");
	document.getElementById("TesterCSS").classList.add("cool-border");
	
	var html = queryString("html");
	if (html != null) {
		editor.setValue(html);
		editor.clearSelection();	
	}
	else {
		var defaultTestHtml = "<!DOCTYPE html>\n<html>\n\t<head>\n\t\t\n\t</head>\n\t<body>\n\t\t\n\t</body>\n</html>\n";
		editor.setValue(defaultTestHtml);
		editor.clearSelection();
	}
	var js = queryString("js");
	if (js != null) {
		jsEditor.setValue(js);
		jsEditor.clearSelection();
	}
	var css = queryString("css");
	if (css != null) {
		cssEditor.setValue(css);
		cssEditor.clearSelection();
	}
	//TesterUpdate();
	editor.getSession().on('change', TesterOnCodeChange);
	jsEditor.getSession().on('change', TesterOnCodeChange);
	cssEditor.getSession().on('change', TesterOnCodeChange);
}

function TesterUpdate() {
	var addCss = getCSSEditor().getValue().trim().length > 1;
	var addJs = getJSEditor().getValue().trim().length > 1;
	if (addCss || addJs) {
		var tempFrame = document.createElement("iframe");
		tempFrame.id = "tempFrame_" + randomGuid();
		tempFrame.style.display = "none";
		tempFrame.sandbox = "allow-same-origin";
		document.body.appendChild(tempFrame);
		/*tempFrame.contentDocument.open();
		tempFrame.contentDocument.write(getMixedEditor().getValue());
		tempFrame.contentDocument.close();*/
		renderHtml(getMixedEditor().getValue(), tempFrame.id);
		if (addCss) {
			var css = tempFrame.contentDocument.createElement("style");
			css.type = "text/css";
			css.appendChild(tempFrame.contentDocument.createTextNode(getCSSEditor().getValue()));
			tempFrame.contentDocument.head.appendChild(css);
		}
		if (addJs) {
			var js = tempFrame.contentDocument.createElement("script");
			js.type = "text/javascript";
			js.appendChild(tempFrame.contentDocument.createTextNode(getJSEditor().getValue()));
			tempFrame.contentDocument.head.appendChild(js);
		}
		var head = tempFrame.contentDocument.head.outerHTML;
		var body = tempFrame.contentDocument.body.outerHTML;
		document.body.removeChild(tempFrame);
		renderHtml("<html>\n\t" + head + "\n\t" + body + "\n</html>\n", "TesterResult");
	}
	else renderHtml(getMixedEditor().getValue(), "TesterResult");
	// OLD WAY
	/*renderHtml(getMixedEditor().getValue(), "TesterResult"); 
	var frame = document.getElementById("TesterResult");
	var css = frame.contentDocument.createElement("style");
	css.type = "text/css";
	css.appendChild(frame.contentDocument.createTextNode(getCSSEditor().getValue()));
	frame.contentDocument.head.appendChild(css);
	var js = frame.contentDocument.createElement("script");
	js.type = "text/javascript";
	js.appendChild(frame.contentDocument.createTextNode(getJSEditor().getValue()));
	frame.contentDocument.head.appendChild(js);*/
}

function TesterClear() {
	if (document.getElementById("TesterMixed").style.display != "none") {
		var editor = getMixedEditor();
		editor.setValue("<!DOCTYPE html>\n<html>\n\t<head>\n\t\t\n\t</head>\n\t<body>\n\t\t\n\t</body>\n</html>\n");
		editor.clearSelection();
	}
	else if (document.getElementById("TesterJS").style.display != "none") {
		getJSEditor().setValue("");
	}
	else if (document.getElementById("TesterCSS").style.display != "none") {
		getCSSEditor().setValue("");
	}
	//TesterUpdate();
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
					showContextMenu(e.x, e.y, [
						{ 
							description: "Copy HTML", 
							action: function() {
								textArea.select();
								document.execCommand('copy');
							}
						},
						{ 
							description: "Remove Image", 
							action: function() { pasteZone.removeChild(textArea); } 
						}
					]);
					return false;
				};
				pasteZone.appendChild(textArea);
				//textareaToEditor(textArea.id, false);
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
	var cmDiv = document.createElement("div");
	cmDiv.className = "cool-contextmenu";
	cmDiv.tabIndex = -1;
	cmDiv.style.zIndex = 0x7FFFFFFD;
	cmDiv.onblur = function() { document.body.removeChild(cmDiv); };
	var cmUl = document.createElement("ul");
	for (var i = 0; i < itemArray.length; i++) {
		var item = itemArray[i];
		var cmLi = document.createElement("li");
		cmLi.appendChild(document.createTextNode(item.description));
		cmLi.onclick = item.action;
		cmUl.appendChild(cmLi);
	}
	var cmLiCancel = document.createElement("li");
	cmLiCancel.appendChild(document.createTextNode("Cancel"));
	cmUl.appendChild(cmLiCancel);
	cmUl.onclick = function () { document.body.removeChild(cmDiv); };
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
	x += document.body.scrollLeft;
	y += document.body.scrollTop;
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
			renderHtml(txt, textareaId + "Result");
			editor.getSession().on('change', function() {
				renderHtml(editor.getValue(), textareaId + "Result");
			});
		}
	}
}

function encryptText(text) {
	/*var compression_mode = 1,
    my_lzma = LZMA; /// lzma_worker.js creates a global LZMA object. We store it as a new variable just to match simple_demo.html.

document.getElementById("go").onclick = function () {
    /// First, let's compress it.
    my_lzma.compress(document.getElementById("compression_el").value, compression_mode, function on_compress_complete(result) {
        alert("Compressed: " + result);
        
        /// Now, let's try to decompress it to make sure it works both ways.
        my_lzma.decompress(result, function on_decompress_complete(result) {
            alert("Decompressed: " + result);
        }, function on_decompress_progress_update(percent) {
            /// Decompressing progress code goes here.
            document.title = "Decompressing: " + (percent * 100) + "%";
        });
    }, function on_compress_progress_update(percent) {
        /// Compressing progress code goes here.
        document.title = "Compressing: " + (percent * 100) + "%";
    });
}
*/
	var status = { result: null, progress = 0 };
	LZMA.compress(text, 1, function onSuccess(result) {
		status.result = result;
	}, function onProgress(percent) {
		status.progress = percent;	
	});
	while (status.progress < 1) {}
	return status.result;
}

function TesterGeneratePageUrl() {
	debugger;
	if (typeof LZMA == "undefined") return;
	var pasteZone = document.getElementById("pasteZone");
	var html = encryptText(getMixedEditor().getValue());
	var js = encryptText(getJSEditor().getValue());
	var css = encryptText(getCSSEditor().getValue());
	var qs = window.location.origin + window.location.pathname + "?"
		 + (html.trim().length > 0 ? "html=" + encodeURIComponent(html) : "")
		 + (js.trim().length > 0 ? (html.trim().length > 0 ? "&" : "") + "js=" + encodeURIComponent(js) : "")
		 + (css.trim().length > 0 ? (html.trim().length > 0 || js.trim().length > 0 ? "&" : "") + "css=" + encodeURIComponent(css) : "");
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
		showContextMenu(e.x, e.y, [
			{ 
				description: "Copy URL", 
				action: function() {
					textArea.select();
					document.execCommand('copy');
				}
			},
			{ 
				description: "Remove URL", 
				action: function() { pasteZone.removeChild(textArea); } 
			}
		]);
		return false;
	};
	pasteZone.appendChild(textArea);
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

