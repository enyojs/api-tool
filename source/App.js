enyo.kind({
	name: "App",
	fit: true,
	kind: "FittableColumns",
	components: [
		{kind: "Analyzer", onIndexReady: "indexReady"},
		{name: "left", kind: "TabPanels", components: [
			{kind: "Scroller", tabName: "Kinds", components: [
				{name: "kinds", allowHtml: true}
			]},
			{kind: "Scroller", tabName: "Modules", components: [
				{name: "modules", allowHtml: true}
			]},
			{kind: "Scroller", tabName: "Index", components: [
				{kind: "SearchBar", onSearch: "search"},
				{name: "index", allowHtml: true}
			]},
			{name: "packages", tabName: "Packages", kind: "PackageList", onPackagesChange: "loadPackages", onLoaded: "packagesLoaded"}
		]},
		{name: "doc", kind: "FittableRows", fit: true, components: [
			{name: "scope", components: [
				{name: "inheritedCb", kind: "Checkbox", content: "show inherited", onchange: "scopeChange"},
				{name: "accessCb", kind: "Checkbox", content: "show protected", style: "margin-left: 20px;", onchange: "accessChange"}
			]},
			{name: "header", allowHtml: true},
			{name: "tocFrame", kind: "Scroller", components: [
				{name: "toc", allowHtml: true}
			]},
			{name: "bodyFrame", kind: "Scroller", fit: true, classes: "enyo-selectable", components: [
				{name: "indexBusy", kind: "Image", src: "assets/busy.gif", style: "padding-left: 8px;", showing: false},
				{name: "body", allowHtml: true}
			]}
		]}
	],
	create: function() {
		this.inherited(arguments);
		window.onhashchange = enyo.bind(this, "hashChange");
		// make a presentor
		this.presentor = new Presentor();
		// load packages
		this.loadPackages();
	},
	//
	// analyze packages
	//
	loadPackages: function() {
		// alias this important object and reset indexer
		this.index = this.$.analyzer.index = new Indexer();
		this.$.packages.loadPackageData();
	},
	packagesLoaded: function(inSender, inEvent) {
		// walk the selected packages
		var paths = [];
		enyo.forEach(inEvent.packages, function(e) {
			if (!e.disabled) {
				paths.push(e.path);
			}
		});
		this.walk(paths);
		return true;
	},
	walk: function(inPackageList) {
		this.walking = true;
		this.$.indexBusy.show();
		this.$.analyzer.walk(inPackageList);
	},
	//
	// presentation of documentation data
	//
	indexReady: function() {
		this.presentKinds();
		this.presentModules();
		this.presentIndex();
		this.$.indexBusy.hide();
		this.walking = false;
		this.hashChange();
	},
	// indices
	indexalize: function(inFilter, inTemplate, inMap) {
		var filtered = inFilter ? enyo.filter(this.index.objects, inFilter, this) : this.index.objects;
		filtered = this.nameFilter(filtered);
		var html = '', divider;
		for (var i=0, o; o=filtered[i]; i++) {
			// divider
			var d = inMap(o).divider;
			if (d && divider != d) {
				divider = d;
				html += "<divider>" + d + "</divider>";
			}
			//
			html += enyo.macroize(inTemplate, inMap(o));
		}
		return html;
	},
	nameFilter: function(inObjects) {
		return enyo.filter(inObjects, function(o) {
			return o.name && o.name[0] !== "_";
		});
	},
	presentFilteredIndex: function(inFilter) {
		var template = '<a href="#{$link}"><prototype>{$object}</prototype><topic>{$topic}</topic>{$module}</a><br/>';
		var map = function(o) {
			return {
				link: o.topic || o.name,
				topic: o.name,
				divider: o.name[0].toUpperCase(),
				object: o.object && o.object.name ? o.object.name + "::" : "",
				module: !o.object && o.module && o.module.name ? " [" + o.module.name + "]" : ""
			}
		};
		this.$.index.setContent(this.indexalize(inFilter, template, map));
	},
	presentIndex: function() {
		var filter = function(o) {
			return (o.name !== "published" && (o.group == "public" || o.group == "published"));
		};
		this.presentFilteredIndex(filter);
	},
	presentModules: function() {
		var filter = function(o) {
			return (o.type == "module");
		};
		var template = '<a href="#{$link}"><topic>{$topic}</topic></a><br/>';
		var map = function(o) {
			return {
				link: o.topic || o.name,
				topic: o.name,
				divider: o.name[0].toUpperCase()
			}
		};
		this.$.modules.setContent(this.indexalize(filter, template, map));
	},
	presentKinds: function() {
		var filter = function(o) {
			return (o.type == "kind" && o.group == "public");
		};
		var template = '<a href="#{$link}"><topic>{$topic}</topic></a><br/>';
		var map = function(o) {
			return {
				link: o.topic || o.name,
				topic: o.name,
				divider: o.name.split(".")[0]
			}
		};
		this.$.kinds.setContent(this.indexalize(filter, template, map));
	},
	// docs
	presentObject: function(inObject) {
		switch (inObject && inObject.type) {
			case "kind":
				this.presentKind(inObject);
				break;
			//
			default:
				this.$.header.setContent("");
				this.$.toc.setContent("");
				this.$.doc.reflow();
				//
				var body = "";
				if (inObject) {
					body = this.presentor.presentObject(inObject)
				}
				this.$.body.setContent(body);
				break;
		}
	},
	presentKind: function(inKind) {
		this.$.header.setContent(this.presentor.presentKindHeader(inKind));
		//
		var p$ = this.presentor.showInherited ? inKind.allProperties : inKind.properties;
		p$.sort(Indexer.nameCompare);
		//
		var toc = this.presentor.presentColumns(p$, inKind);
		this.$.toc.setContent(toc);
		//this.$.toc.setContent('<h3>Properties</h3>' + toc);
		//
		var body = this.presentor.presentKindSummary(inKind);
		var p$ = this.presentor.presentKindProperties(inKind)
		if (p$) {
			body += '<h3>Properties</h3>' + p$;
		}
		this.$.body.setContent(body);
		//
		this.$.doc.reflow();
	},
	presentModule: function(inModule) {
		//this.$.code.setContent(inModule.code);
		this.presentObject(inModule);
	},
	//
	// UX
	//
	moduleTap: function(inSender) {
		this.presentModule(inSender.object);
	},
	objectTap: function(inSender) {
		this.presentObject(inSender.object);
	},
	//
	hashChange: function(inEvent) {
		this.selectTopic(this.getHashTopic());
	},
	getHashTopic: function() {
		return window.location.hash.slice(1);
	},
	selectTopic: function(inTopic) {
		this.topic = inTopic;
		// split
		var parts = inTopic.split("::");
		var main = parts.shift();
		var sub = parts.shift();
		// find this eponymous main object
		var object = this.index.findByName(main) || this.index.findByName("enyo." + main);
		if (this.topicObject != object) {
			this.presentObject(object);
			this.topicObject = object;
			this.$.body.container.setScrollTop(0);
		}
		if (sub) {
			var anchor = document.getElementsByName(sub)[0];
			if (anchor) {
				anchor.scrollIntoView(true);
			}
		}
	},
	scopeChange: function() {
		this.presentor.showInherited = this.$.inheritedCb.getValue();
		this.topicObject = null;
		this.selectTopic(this.topic);
	},
	accessChange: function() {
		this.presentor.showProtected = this.$.accessCb.getValue();
		this.topicObject = null;
		this.selectTopic(this.topic);
	},
	search: function(inSender, inEvent) {
		this.setSearchString(inEvent.searchString.toLowerCase());
	},
	setSearchString: function(inString) {
		var filter = function(o) {
			return (o.name !== "published" && (o.group == "public" || o.group == "published")) && (o.name.toLowerCase().indexOf(inString) >= 0);
		};
		this.presentFilteredIndex(filter);
	}
});
