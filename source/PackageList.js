enyo.kind({
	name: "PackageList",
	components: [
		{kind: "Repeater", components: [
			{components: [
				{kind: "Checkbox", onchange: "cbChange"}
			]}
		]},
		//{kind: "Button", content: "Edit Packages", style: "float: right;", ontap: "editPackages"},
		//{kind: "Button", content: "Reload", style: "float: right;", ontap: "doPackagesChange"},
		{kind: "PackagesEditor", modal: true, centered: true, floating: true, onSave: "savePackages"}
	],
	events: {
		onPackagesChange: "",
		onLoaded: ""
	},
	handlers: {
		onSetupItem: "setupItem"
	},
	fetchPackageData: function() {
		new enyo.Ajax({url: "manifest.json"})
			.response(this, function(inSender, inPackages) {
				this.gotPackageData(inPackages);
			})
			.go();
	},
	gotPackageData: function(inPackages) {
		this.pkgs = inPackages;
		this.$.repeater.setCount(this.pkgs.length);
		this.doLoaded({packages: this.pkgs});
	},
	loadPackageData: function() {
		// when there is UI to customize the packages list, we can persist it this way
		/*var pkgs = localStorage.getItem("enyo-live-api-packages");
		if (pkgs) {
			this.pkgs = enyo.json.parse(pkgs);
		} else {
			this.savePackageData();
		}*/
		if (this.pkgs) {
			this.gotPackageData(this.pkgs);
		} else {
			this.fetchPackageData();
		}
	},
	savePackageData: function() {
		// when there is UI to customize the packages list, we can persist it this way
		//localStorage.setItem("enyo-live-api-packages", enyo.json.stringify(this.pkgs));
	},
	setupItem: function(inSender, inEvent) {
		var r = this.pkgs[inEvent.index];
		var cb = inEvent.item.$.checkbox;
		cb.setContent(r.name);
		cb.setChecked(!r.disabled);
	},
	cbChange: function(inSender, inEvent) {
		var index = inEvent.index;
		var p = this.pkgs[index];
		if (p) {
			p.disabled = !(inSender.getChecked());
			this.savePackageData();
		}
		this.doPackagesChange({pkg: p});
	}/*,
	editPackages: function() {
		this.$.packagesEditor.openWithPackages(this.pkgs);
	},
	savePackages: function(inSender, inEvent) {
		this.pkgs = inEvent.pkgs;
		this.savePackageData();
		this.doPackagesChange();
	}*/
});
