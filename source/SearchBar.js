enyo.kind({
	name: "SearchBar",
	events: {
		onSearch: ""
	},
	handlers: {
		onkeyup: "search",
		onchange: "search"
	},
	components: [
		{xkind: "InputDecorator", classes: "enyo-tool-decorator input-decorator", style: "display: block;", components: [
			{kind: "Input", style: "width: 90%;"},
			{kind: "Image", src: "assets/search-input-search.png"}
		]}
	],
	getValue: function() {
		if (this.$.input.hasNode()) {
			return this.$.input.node.value;
		}
	},
	search: function() {
		this.doSearch({searchString: this.getValue()});
	}
});
