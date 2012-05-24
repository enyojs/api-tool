enyo.kind({
	name: "PackagesEditor",
	kind: "Popup",
	classes: "packages-editor",
	events: {
		onSave: ""
	},
	components: [
		{kind: "Repeater", onSetupItem: "setupItem", components: [
			{components: [
				{name: "name", kind: "Input"},
				{name: "path", kind: "Input"},
				{kind: "Button", content: "Delete", ontap: "deletePkg"}
			]}
		]},
		{kind: "Button", content: "New...", ontap: "newPkg"},
		{tag: "hr"},
		{kind: "Button", content: "Cancel", ontap: "hide"},
		{kind: "Button", content: "Save", ontap: "save"}
	],
	openWithPackages: function(inPkgs) {
		this.show();
		this.pkgs = inPkgs;
		this.load();
	},
	load: function() {
		this.$.repeater.setCount(this.pkgs.length);
	},
	setupItem: function(inSender, inEvent) {
		var pkg = this.pkgs[inEvent.index];
		inEvent.item.$.name.setValue(pkg.name);
		inEvent.item.$.path.setValue(pkg.path);
		return true;
	},
	newPkg: function() {
		this.pkgs.push({name: "", path: ""});
		this.load();
	},
	deletePkg: function(inSender, inEvent) {
		this.pkgs.splice(inEvent.index, 1);
		this.load();
	},
	save: function() {
		var pkgs = [];
		for (var i=0, c; c=this.$.repeater.getClientControls()[i]; i++) {
			var n = c.$.name.getValue();
			var p = c.$.path.getValue(); 
			if (n && p) {
				pkgs.push({name: n, path: p});
			}
		}
		this.doSave({pkgs: pkgs});
		this.hide();
	}
});
