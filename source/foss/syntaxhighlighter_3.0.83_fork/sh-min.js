
// xregexp-min.js

var XRegExp;

if (XRegExp) throw Error("can't load XRegExp twice in the same frame");

(function() {
function l(a, b) {
if (!XRegExp.isRegExp(a)) throw TypeError("type RegExp expected");
var c = a._xregexp;
return a = XRegExp(a.source, m(a) + (b || "")), c && (a._xregexp = {
source: c.source,
captureNames: c.captureNames ? c.captureNames.slice(0) : null
}), a;
}
function m(a) {
return (a.global ? "g" : "") + (a.ignoreCase ? "i" : "") + (a.multiline ? "m" : "") + (a.extended ? "x" : "") + (a.sticky ? "y" : "");
}
function n(a, b, c, f) {
var g = e.length, h, i, j;
d = !0;
try {
while (g--) {
j = e[g];
if (c & j.scope && (!j.trigger || j.trigger.call(f))) {
j.pattern.lastIndex = b, i = j.pattern.exec(a);
if (i && i.index === b) {
h = {
output: j.handler.call(f, i, c),
match: i
};
break;
}
}
}
} catch (k) {
throw k;
} finally {
d = !1;
}
return h;
}
function o(a, b, c) {
if (Array.prototype.indexOf) return a.indexOf(b, c);
for (var d = c || 0; d < a.length; d++) if (a[d] === b) return d;
return -1;
}
XRegExp = function(a, c) {
var e = [], g = XRegExp.OUTSIDE_CLASS, h = 0, i, j, m, o, p;
if (XRegExp.isRegExp(a)) {
if (c !== undefined) throw TypeError("can't supply flags when constructing one RegExp from another");
return l(a);
}
if (d) throw Error("can't call the XRegExp constructor within token definition functions");
c = c || "", i = {
hasNamedCapture: !1,
captureNames: [],
hasFlag: function(a) {
return c.indexOf(a) > -1;
},
setFlag: function(a) {
c += a;
}
};
while (h < a.length) j = n(a, h, g, i), j ? (e.push(j.output), h += j.match[0].length || 1) : (m = f.exec.call(k[g], a.slice(h))) ? (e.push(m[0]), h += m[0].length) : (o = a.charAt(h), o === "[" ? g = XRegExp.INSIDE_CLASS : o === "]" && (g = XRegExp.OUTSIDE_CLASS), e.push(o), h++);
return p = RegExp(e.join(""), f.replace.call(c, b, "")), p._xregexp = {
source: a,
captureNames: i.hasNamedCapture ? i.captureNames : null
}, p;
}, XRegExp.version = "1.5.0", XRegExp.INSIDE_CLASS = 1, XRegExp.OUTSIDE_CLASS = 2;
var a = /\$(?:(\d\d?|[$&`'])|{([$\w]+)})/g, b = /[^gimy]+|([\s\S])(?=[\s\S]*\1)/g, c = /^(?:[?*+]|{\d+(?:,\d*)?})\??/, d = !1, e = [], f = {
exec: RegExp.prototype.exec,
test: RegExp.prototype.test,
match: String.prototype.match,
replace: String.prototype.replace,
split: String.prototype.split
}, g = f.exec.call(/()??/, "")[1] === undefined, h = function() {
var a = /^/g;
return f.test.call(a, ""), !a.lastIndex;
}(), i = function() {
var a = /x/g;
return f.replace.call("x", a, ""), !a.lastIndex;
}(), j = RegExp.prototype.sticky !== undefined, k = {};
k[XRegExp.INSIDE_CLASS] = /^(?:\\(?:[0-3][0-7]{0,2}|[4-7][0-7]?|x[\dA-Fa-f]{2}|u[\dA-Fa-f]{4}|c[A-Za-z]|[\s\S]))/, k[XRegExp.OUTSIDE_CLASS] = /^(?:\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9]\d*|x[\dA-Fa-f]{2}|u[\dA-Fa-f]{4}|c[A-Za-z]|[\s\S])|\(\?[:=!]|[?*+]\?|{\d+(?:,\d*)?}\??)/, XRegExp.addToken = function(a, b, c, d) {
e.push({
pattern: l(a, "g" + (j ? "y" : "")),
handler: b,
scope: c || XRegExp.OUTSIDE_CLASS,
trigger: d || null
});
}, XRegExp.cache = function(a, b) {
var c = a + "/" + (b || "");
return XRegExp.cache[c] || (XRegExp.cache[c] = XRegExp(a, b));
}, XRegExp.copyAsGlobal = function(a) {
return l(a, "g");
}, XRegExp.escape = function(a) {
return a.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}, XRegExp.execAt = function(a, b, c, d) {
b = l(b, "g" + (d && j ? "y" : "")), b.lastIndex = c = c || 0;
var e = b.exec(a);
return d ? e && e.index === c ? e : null : e;
}, XRegExp.freezeTokens = function() {
XRegExp.addToken = function() {
throw Error("can't run addToken after freezeTokens");
};
}, XRegExp.isRegExp = function(a) {
return Object.prototype.toString.call(a) === "[object RegExp]";
}, XRegExp.iterate = function(a, b, c, d) {
var e = l(b, "g"), f = -1, g;
while (g = e.exec(a)) c.call(d, g, ++f, a, e), e.lastIndex === g.index && e.lastIndex++;
b.global && (b.lastIndex = 0);
}, XRegExp.matchChain = function(a, b) {
return function c(a, d) {
var e = b[d].regex ? b[d] : {
regex: b[d]
}, f = l(e.regex, "g"), g = [], h;
for (h = 0; h < a.length; h++) XRegExp.iterate(a[h], f, function(a) {
g.push(e.backref ? a[e.backref] || "" : a[0]);
});
return d === b.length - 1 || !g.length ? g : c(g, d + 1);
}([ a ], 0);
}, RegExp.prototype.apply = function(a, b) {
return this.exec(b[0]);
}, RegExp.prototype.call = function(a, b) {
return this.exec(b);
}, RegExp.prototype.exec = function(a) {
var b = f.exec.apply(this, arguments), c, d;
if (b) {
!g && b.length > 1 && o(b, "") > -1 && (d = RegExp(this.source, f.replace.call(m(this), "g", "")), f.replace.call(a.slice(b.index), d, function() {
for (var a = 1; a < arguments.length - 2; a++) arguments[a] === undefined && (b[a] = undefined);
}));
if (this._xregexp && this._xregexp.captureNames) for (var e = 1; e < b.length; e++) c = this._xregexp.captureNames[e - 1], c && (b[c] = b[e]);
!h && this.global && !b[0].length && this.lastIndex > b.index && this.lastIndex--;
}
return b;
}, h || (RegExp.prototype.test = function(a) {
var b = f.exec.call(this, a);
return b && this.global && !b[0].length && this.lastIndex > b.index && this.lastIndex--, !!b;
}), String.prototype.match = function(a) {
XRegExp.isRegExp(a) || (a = RegExp(a));
if (a.global) {
var b = f.match.apply(this, arguments);
return a.lastIndex = 0, b;
}
return a.exec(this);
}, String.prototype.replace = function(b, c) {
var d = XRegExp.isRegExp(b), e, g, h;
return d && typeof c.valueOf() == "string" && c.indexOf("${") === -1 && i ? f.replace.apply(this, arguments) : (d ? b._xregexp && (e = b._xregexp.captureNames) : b += "", typeof c == "function" ? g = f.replace.call(this, b, function() {
if (e) {
arguments[0] = new String(arguments[0]);
for (var a = 0; a < e.length; a++) e[a] && (arguments[0][e[a]] = arguments[a + 1]);
}
return d && b.global && (b.lastIndex = arguments[arguments.length - 2] + arguments[0].length), c.apply(null, arguments);
}) : (h = this + "", g = f.replace.call(h, b, function() {
var b = arguments;
return f.replace.call(c, a, function(a, c, d) {
if (!c) {
var g = +d;
return g <= b.length - 3 ? b[g] : (g = e ? o(e, d) : -1, g > -1 ? b[g + 1] : a);
}
switch (c) {
case "$":
return "$";
case "&":
return b[0];
case "`":
return b[b.length - 1].slice(0, b[b.length - 2]);
case "'":
return b[b.length - 1].slice(b[b.length - 2] + b[0].length);
default:
var f = "";
c = +c;
if (!c) return a;
while (c > b.length - 3) f = String.prototype.slice.call(c, -1) + f, c = Math.floor(c / 10);
return (c ? b[c] || "" : "$") + f;
}
});
})), d && b.global && (b.lastIndex = 0), g);
}, String.prototype.split = function(a, b) {
if (!XRegExp.isRegExp(a)) return f.split.apply(this, arguments);
var c = this + "", d = [], e = 0, g, h;
if (b === undefined || +b < 0) b = Infinity; else {
b = Math.floor(+b);
if (!b) return [];
}
a = XRegExp.copyAsGlobal(a);
while (g = a.exec(c)) {
if (a.lastIndex > e) {
d.push(c.slice(e, g.index)), g.length > 1 && g.index < c.length && Array.prototype.push.apply(d, g.slice(1)), h = g[0].length, e = a.lastIndex;
if (d.length >= b) break;
}
a.lastIndex === g.index && a.lastIndex++;
}
return e === c.length ? (!f.test.call(a, "") || h) && d.push("") : d.push(c.slice(e)), d.length > b ? d.slice(0, b) : d;
}, XRegExp.addToken(/\(\?#[^)]*\)/, function(a) {
return f.test.call(c, a.input.slice(a.index + a[0].length)) ? "" : "(?:)";
}), XRegExp.addToken(/\((?!\?)/, function() {
return this.captureNames.push(null), "(";
}), XRegExp.addToken(/\(\?<([$\w]+)>/, function(a) {
return this.captureNames.push(a[1]), this.hasNamedCapture = !0, "(";
}), XRegExp.addToken(/\\k<([\w$]+)>/, function(a) {
var b = o(this.captureNames, a[1]);
return b > -1 ? "\\" + (b + 1) + (isNaN(a.input.charAt(a.index + a[0].length)) ? "" : "(?:)") : a[0];
}), XRegExp.addToken(/\[\^?]/, function(a) {
return a[0] === "[]" ? "\\b\\B" : "[\\s\\S]";
}), XRegExp.addToken(/^\(\?([imsx]+)\)/, function(a) {
return this.setFlag(a[1]), "";
}), XRegExp.addToken(/(?:\s+|#.*)+/, function(a) {
return f.test.call(c, a.input.slice(a.index + a[0].length)) ? "" : "(?:)";
}, XRegExp.OUTSIDE_CLASS, function() {
return this.hasFlag("x");
}), XRegExp.addToken(/\./, function() {
return "[\\s\\S]";
}, XRegExp.OUTSIDE_CLASS, function() {
return this.hasFlag("s");
});
})();

// shCore.js

var SyntaxHighlighter = function() {
function b(a) {
return a.split("\n");
}
function c(a, b, c) {
c = Math.max(c || 0, 0);
for (var d = c; d < a.length; d++) if (a[d] == b) return d;
return -1;
}
function d(a, b) {
var c = {}, d;
for (d in a) c[d] = a[d];
for (d in b) c[d] = b[d];
return c;
}
function e(a) {
var b = {
"true": !0,
"false": !1
}[a];
return b == null ? a : b;
}
function f(a, c) {
var d = b(a);
for (var e = 0; e < d.length; e++) d[e] = c(d[e], e);
return d.join("\n");
}
function g(a) {
return a.replace(/^[ ]*[\n]+|[\n]*[ ]*$/g, "");
}
function h(b, c) {
return b == null || b.length == 0 || b == "\n" ? b : (b = b.replace(/</g, "&lt;"), b = b.replace(/ {2,}/g, function(b) {
var c = "";
for (var d = 0; d < b.length - 1; d++) c += a.config.space;
return c + " ";
}), c != null && (b = f(b, function(a) {
if (a.length == 0) return "";
var b = "";
return a = a.replace(/^(&nbsp;| )+/, function(a) {
return b = a, "";
}), a.length == 0 ? b : b + '<code class="' + c + '">' + a + "</code>";
})), b);
}
function i(a, b) {
var c = a.toString();
while (c.length < b) c = "0" + c;
return c;
}
function j(a, b) {
var c = "";
for (var d = 0; d < b; d++) c += " ";
return a.replace(/\t/g, c);
}
function k(a, c) {
function i(a, b, c) {
return a.substr(0, b) + g.substr(0, c) + a.substr(b + 1, a.length);
}
var d = b(a), e = "\t", g = "";
for (var h = 0; h < 50; h++) g += "                    ";
return a = f(a, function(a) {
if (a.indexOf(e) == -1) return a;
var b = 0;
while ((b = a.indexOf(e)) != -1) {
var d = c - b % c;
a = i(a, b, d);
}
return a;
}), a;
}
function l(b) {
var c = /<br\s*\/?>|&lt;br\s*\/?&gt;/gi;
return /*a.config.bloggerMode == 1 &&*/ (b = b.replace(c, "\n")), a.config.stripBrs == 1 && (b = b.replace(c, "")), b;
}
function m(a) {
return a.replace(/^\s+|\s+$/g, "");
}
function n(a) {
var c = b(l(a)), d = new Array, e = /^\s*/, f = 1e3;
for (var g = 0; g < c.length && f > 0; g++) {
var h = c[g];
if (m(h).length == 0) continue;
var i = e.exec(h);
if (i == null) return a;
f = Math.min(i[0].length, f);
}
if (f > 0) for (var g = 0; g < c.length; g++) c[g] = c[g].substr(f);
return c.join("\n");
}
function o(a, b) {
return a.index < b.index ? -1 : a.index > b.index ? 1 : a.length < b.length ? -1 : a.length > b.length ? 1 : 0;
}
function p(b, c) {
function d(a, b) {
return a[0];
}
var e = 0, f = null, g = [], h = c.func ? c.func : d;
while ((f = c.regex.exec(b)) != null) {
var i = h(f, c);
typeof i == "string" && (i = [ new a.Match(i, f.index, c.css) ]), g = g.concat(i);
}
return g;
}
function q(b) {
var c = /(.*)((&gt;|&lt;).*)/;
return b.replace(a.regexLib.url, function(a) {
var b = "", d = null;
if (d = c.exec(a)) a = d[1], b = d[2];
return '<a href="' + a + '">' + a + "</a>" + b;
});
}
var a = {
defaults: {
"class-name": "",
"first-line": 1,
"pad-line-numbers": !1,
highlight: null,
"smart-tabs": !0,
"tab-size": 4,
gutter: !0,
"auto-links": !0
},
config: {
space: "&nbsp;",
stripBrs: !1,
strings: {
alert: "SyntaxHighlighter\n\n",
noBrush: "Can't find brush for: ",
brushNotHtmlScript: "Brush wasn't configured for html-script option: "
}
},
brushes: {},
regexLib: {
multiLineCComments: /\/\*[\s\S]*?\*\//gm,
singleLineCComments: /\/\/.*$/gm,
singleLinePerlComments: /#.*$/gm,
doubleQuotedString: /"([^\\"\n]|\\.)*"/g,
singleQuotedString: /'([^\\'\n]|\\.)*'/g,
multiLineDoubleQuotedString: new XRegExp('"([^\\\\"]|\\\\.)*"', "gs"),
multiLineSingleQuotedString: new XRegExp("'([^\\\\']|\\\\.)*'", "gs"),
xmlComments: /(&lt;|<)!--[\s\S]*?--(&gt;|>)/gm,
url: /\w+:\/\/[\w-.\/?%&=:@;]*/g,
phpScriptTags: {
left: /(&lt;|<)\?=?/g,
right: /\?(&gt;|>)/g
},
aspScriptTags: {
left: /(&lt;|<)%=?/g,
right: /%(&gt;|>)/g
},
scriptScriptTags: {
left: /(&lt;|<)\s*script.*?(&gt;|>)/gi,
right: /(&lt;|<)\/\s*script\s*(&gt;|>)/gi
}
}
};
return a.Match = function(a, b, c) {
this.value = a, this.index = b, this.length = a.length, this.css = c, this.brushName = null;
}, a.Match.prototype.toString = function() {
return this.value;
}, a.Highlighter = function() {}, a.Highlighter.prototype = {
getParam: function(a, b) {
var c = this.params[a];
return e(c == null ? b : c);
},
create: function(a) {
return document.createElement(a);
},
findMatches: function(a, b) {
var c = [];
if (a != null) for (var d = 0; d < a.length; d++) typeof a[d] == "object" && (c = c.concat(p(b, a[d])));
return this.removeNestedMatches(c.sort(o));
},
removeNestedMatches: function(a) {
for (var b = 0; b < a.length; b++) {
if (a[b] === null) continue;
var c = a[b], d = c.index + c.length;
for (var e = b + 1; e < a.length && a[b] !== null; e++) {
var f = a[e];
if (f === null) continue;
if (f.index > d) break;
f.index == c.index && f.length > c.length ? a[b] = null : f.index >= c.index && f.index < d && (a[e] = null);
}
}
return a;
},
figureOutLineNumbers: function(a) {
var b = [], c = parseInt(this.getParam("first-line"));
return f(a, function(a, d) {
b.push(d + c);
}), b;
},
isLineHighlighted: function(a) {
var b = this.getParam("highlight", []);
return typeof b != "object" && b.push == null && (b = [ b ]), c(b, a.toString()) != -1;
},
getLineHtml: function(a, b, c) {
var d = [ "line", "number" + b, "index" + a, "alt" + (b % 2 == 0 ? 1 : 2).toString() ];
return this.isLineHighlighted(b) && d.push("highlighted"), b == 0 && d.push("break"), '<div class="' + d.join(" ") + '">' + c + "</div>";
},
getLineNumbersHtml: function(c, d) {
var e = "", f = b(c).length, g = parseInt(this.getParam("first-line")), h = this.getParam("pad-line-numbers");
h == 1 ? h = (g + f - 1).toString().length : isNaN(h) == 1 && (h = 0);
for (var j = 0; j < f; j++) {
var k = d ? d[j] : g + j, c = k == 0 ? a.config.space : i(k, h);
e += this.getLineHtml(j, k, c);
}
return e;
},
getCodeLinesHtml: function(c, d) {
c = m(c);
var e = b(c), f = this.getParam("pad-line-numbers"), g = parseInt(this.getParam("first-line")), c = "", h = this.getParam("brush");
for (var i = 0; i < e.length; i++) {
var j = e[i], k = /^(&nbsp;|\s)+/.exec(j), l = null, n = d ? d[i] : g + i;
k != null && (l = k[0].toString(), j = j.substr(l.length), l = l.replace(" ", a.config.space)), j = m(j), j.length == 0 && (j = a.config.space), c += this.getLineHtml(i, n, (l != null ? '<code class="' + h + ' spaces">' + l + "</code>" : "") + j);
}
return c;
},
getMatchesHtml: function(a, b) {
function f(a) {
var b = a ? a.brushName || e : e;
return b ? b + " " : "";
}
var c = 0, d = "", e = this.getParam("brush", "");
for (var g = 0; g < b.length; g++) {
var i = b[g], j;
if (i === null || i.length === 0) continue;
j = f(i), d += h(a.substr(c, i.index - c), j + "plain") + h(i.value, j + i.css), c = i.index + i.length + (i.offset || 0);
}
return d += h(a.substr(c), f() + "plain"), d;
},
getHtml: function(a) {
var b = "", c = [ "syntaxhighlighter" ], d, e, f;
return className = "syntaxhighlighter", (gutter = this.getParam("gutter")) == 0 && c.push("nogutter"), c.push(this.getParam("class-name")), c.push(this.getParam("brush")), a = g(a).replace(/\r/g, " "), d = this.getParam("tab-size"), a = this.getParam("smart-tabs") == 1 ? k(a, d) : j(a, d), a = n(a), gutter && (f = this.figureOutLineNumbers(a)), e = this.findMatches(this.regexList, a), b = this.getMatchesHtml(a, e), b = this.getCodeLinesHtml(b, f), this.getParam("auto-links") && (b = q(b)), typeof navigator != "undefined" && navigator.userAgent && navigator.userAgent.match(/MSIE/) && c.push("ie"), b = '<div class="' + c.join(" ") + '">' + '<table border="0" cellpadding="0" cellspacing="0">' + "<tbody>" + "<tr>" + (gutter ? '<td class="gutter">' + this.getLineNumbersHtml(a) + "</td>" : "") + '<td class="code">' + '<div class="container">' + b + "</div>" + "</td>" + "</tr>" + "</tbody>" + "</table>" + "</div>", b;
},
init: function(b) {
this.params = d(a.defaults, b || {});
},
getKeywords: function(a) {
return a = a.replace(/^\s+|\s+$/g, "").replace(/\s+/g, "|"), "\\b(?:" + a + ")\\b";
}
}, a;
}();

// shBrushJScript.js

(function() {
function a() {
var a = "break case catch continue default delete do else false  for function if in instanceof new null return super switch this throw true try typeof var while with", b = SyntaxHighlighter.regexLib;
this.regexList = [ {
regex: b.multiLineDoubleQuotedString,
css: "string"
}, {
regex: b.multiLineSingleQuotedString,
css: "string"
}, {
regex: b.singleLineCComments,
css: "comments"
}, {
regex: b.multiLineCComments,
css: "comments"
}, {
regex: /\s*#.*/gm,
css: "preprocessor"
}, {
regex: new RegExp(this.getKeywords(a), "gm"),
css: "keyword"
} ];
}
a.prototype = new SyntaxHighlighter.Highlighter, a.aliases = [ "js", "jscript", "javascript" ], SyntaxHighlighter.brushes.JScript = a;
})();

// fork.js

(function() {
var a = new SyntaxHighlighter.brushes.JScript;
a.init({}), syntaxHighlight = function(b) {
return a.getHtml(b);
};
})();
