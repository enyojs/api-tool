;(function(){
	var highlighter = new SyntaxHighlighter.brushes.JScript();
	highlighter.init({});
	//
	syntaxHighlight = function(inCode) {
		return highlighter.getHtml(inCode);
	}
})();
