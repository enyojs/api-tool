/* global syntaxHighlight, Showdown, Presentor */
enyo.kind({
	name: "Presentor",
	kind: null,
	showInherited: false,
	showProtected: false,
	getByType: function(inObjects, inType) {
		var result = [];
		for (var i=0, o; (o=inObjects[i]); i++) {
			if (o.type == inType) {
				result.push(o);
			}
		}
		return result;
	},
	presentObject: function(inObject) {
		switch (inObject.type) {
		case "module":
			return this.presentObjects(inObject.objects);
		case "kind":
			return this.presentKind(inObject);
		case "function":
		case "global":
			return this.presentProperty(inObject);
		}
	},
	presentObjects: function(inObjects) {
		var o$ = this.groupFilter(inObjects);
		var html = '';
		var i, o;
		var publicMethods = false;
		//
		var objs = this.getByType(o$, "kind");
		if (objs.length) {
			html += "<h3>Kinds</h3>";
			for (i=0; (o=objs[i]); i++) {
				//w("<i>name:</i> ");
				html += "<kind>" + o.name + "</kind><br/>";
				html += this.presentComment(o.comment);
				//html += "<blockquote>" + this.presentKind(o) + "</blockquote>";
				//html += this.presentKind(o);
			}
			publicMethods = true;
		}
		//
		objs = this.getByType(o$, "function");
		if (objs.length) {
			html += "<h3>Functions</h3>";
			for (i=0; (o=objs[i]); i++) {
				if (o.group) {
					html += "<" + o.group + ">" + o.group + "</" + o.group  + ">";
				}
				html += "<label>" + o.name + "</label>: function(<arguments>" + o.value[0]['arguments'].join(", ") + "</arguments>)</label><br/>";
				html += this.presentComment(o.comment);

			}
			publicMethods = true;
		}
		//
		objs = this.getByType(o$, "global");
		if (objs.length) {
			html += "<h3>Variables</h3>";
			for (i=0; (o=objs[i]); i++) {
				html += this.presentComment(o.comment);
				if (o.group) {
					html += "<" + o.group + ">" + o.group + "</" + o.group  + ">";
				}
				//html += "<i>name:</i> <label>" + o.name + "</label><br/>";
				html += "<label>" + o.name + "</label> = ";
				html += this.presentExpression(o.value[0]);
				html += "<br/>";
			}
			publicMethods = true;
		}
		//if object only has private fields and functions
		if (!publicMethods) {
			html += "<h3>This module has no public properties or functions to display.</h3>";
		}
		return html;
	},
	presentComment: function(inComment) {
		return inComment ? "<comment>" + this.markupToHtml(inComment) + "</comment>" : "";
	},
	presentKind: function(inKind) {
		return this.presentKindHeader(inKind) + this.presentKindSummary(inKind) + this.presentKindProperties(inKind);
	},
	presentKindHeader: function(inKind) {
		var html = '';
		if (inKind.module && inKind.module.label) {
			html += '<package>' + inKind.module.label + '</package>';
		}
		html += '<kind>' + inKind.name + '</kind>';
		if (inKind.superkinds.length) {
			//html += '<h3>Extends</h3>';
			html += '<div style="padding: 4px 0px;">';
			html += inKind.name;
			enyo.forEach(inKind.superkinds, function(e) {
				/*
				html +=
					'<superkind>'
						+ '<a href=#' + e + '>'
							+ e
						+ '</a>'
					+ '</superkind>';
				*/
				html += ' :: <a href=#' + e + '>' + e + '</a>';
			});
			html += '</div>';
		}
		return html;
	},
	presentKindSummary: function(inKind) {
		var html = '';
		if (inKind.comment) {
			html +=
				'<h3>Summary</h3>' + this.presentComment(inKind.comment);
		}
		return html;
	},
	presentKindProperties: function(inKind) {
		return this.presentProperties(this.showInherited ? inKind.allProperties : inKind.properties, inKind);
	},
	groupFilter: function(inProperties) {
		return enyo.filter(inProperties, function(p) {
			return p.name[0] !== "_" && (p.group == "public" || this.showProtected && p.group == "protected");
		}, this);
	},
	presentProperties: function(inProperties, inSource) {
		var p$ = this.groupFilter(inProperties);
		var html = '';
		for (var i=0, p; (p=p$[i]); i++) {
			html += this.presentProperty(p, inSource);
		}
		return html;
	},
	presentProperty: function(inProperty, inSource) {
		var html = '';
		// group
		var o = inProperty;
		html += '<a name="' + o.name + '"></a>';
		if (o.group) {
			html += "<" + o.group + ">" + o.group + "</" + o.group  + ">";
		}
		// name (and possible ancestor)
		var n = o.name.replace(".prototype", ""); //for g11n remove .prototype from function name
		if (o.object && inSource && inSource != o.object) {
			n = '<prototype>' + o.object.name + '::</prototype>' + n;
		}
		html += "<label>" + n + "</label>: ";
		// right-hand side
		if (o.value && o.value[0] && o.value[0].token == "function") {
			// function signature
			html += "function(<arguments>" + o.value[0]['arguments'].join(", ") + "</arguments>)<br/>";
		} else {
			// value
			html += this.presentValue(o);
		}
		// inline docs
		html += this.presentComment(o.comment);
		// separator
		html += "<hr/>";
		return html;
	},
	presentValue: function(inValue) {
		var html;
		//console.log("value: ", inValue);
		var o = inValue.value;
		if (!o || !o[0]) {
			html = inValue.token;
		} else {
			html = this.presentExpression(o[0]);
		}
		html += "</br>";
		return html;
	},
	presentExpression: function(inObject) {
		//console.log("expr: ", inObject);
		var o = inObject;
		if (o.comment) {
			return this.presentComment(o.comment);
		}
		if (o.type == "block") {
			return "{<blockquote><br/>" + this.presentBlock(o) + "</blockquote>}";
		}
		if (o.type == "array") {
			return "[<blockquote>" + this.presentArray(o) + "</blockquote>]";
		}
		return o.token;// + "<br/>";
	},
	presentBlock: function(inObject) {
		return this.presentProperties(inObject.properties);
	},
	presentArray: function(inObject) {
		//console.log("array: ", inObject);
		var html = '';
		var props = inObject.properties;
		for (var i=0, p; (p=props[i]); i++) {
			html += '<i>' + i + '</i>: ' + this.presentExpression(p);
		}
		return html;
	},
	presentColumns: function(inProperties, inSource, inHeight) {
		var p$ = this.groupFilter(inProperties);
		var prefix = '';
		if (inSource) {
			prefix = inSource.name + "::";
		}
		var h = inHeight || 4;
		var cols = [];
		var html = '';
		for (var i=0, c=0, r=0; (p=p$[i]); i++) {
			html += '<a href="#' + prefix + p.name + '">' + p.name + '</a><br/>';
			if (++r == h) {
				cols.push(html);
				html = '';
				r = 0;
			}
		}
		if (html) {
			cols.push(html);
		}
		html = cols.length ? '<column>' + cols.join('</column><column>') + '</column>' : '';
		return html;
	},
	markupToHtml: function(inMarkup) {
		var html = Presentor.showdown.makeHtml(inMarkup || "");
		html = html.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/gm, function(m, c) {
			return "<pre>" + syntaxHighlight(c) + "</pre>";
		});
		// change external links to use target _blank for Chrome app support
		html = html.replace(/<a href="http/gm, "<a target=\"_blank\" href=\"http");
		html = html.replace(/<a href='http/gm, "<a target=\"_blank\" href=\'http");
		return html;
	},
	// returns a new list where the properties of objects mentioned as
	// properties of the inPropNames argument have been added as top-level
	// members, but the mentioned top-level members have been removed.  Each
	// element that is in a found hash has a new property, parentHash, that
	// lists the name of the parent.
	//
	// ex: var toc$ = this.presentor.inlineProperties(p$, {"published":1, "statics":1, "events":1});
	inlineProperties: function(inList, inPropNames) {
		var newProps = [];
		var addParentHash = function(pr) { pr.parentHash = p.name; };
		for (var i = 0, p; (p = inList[i]); i++) {
			if (inPropNames[p.name]) {
				// add the properties from p into newProps
				if (p.value && p.value[0] && p.value[0].properties) {
					enyo.forEach(p.value[0].properties, addParentHash);
					newProps = newProps.concat(p.value[0].properties);
				}
			} else {
				// add the property directly
				newProps.push(p);
			}
		}
		return newProps;
	},
	statics: {
		showdown: new Showdown.converter()
	}
});