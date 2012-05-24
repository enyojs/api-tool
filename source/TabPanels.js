enyo.kind({
	name: "TabPanels",
	kind: "FittableRows",
	components: [
		{name: "tabs", kind: "Group", defaultKind: "Button", controlClasses: "tab"},
		{name: "client", style: "position: relative;", fit: true}
	],
	create: function() {
		this.inherited(arguments);
		this.selectTab(0);
	},
	addControl: function(inControl) {
		if (!inControl.isChrome) {
			inControl.addClass("enyo-fit");
			inControl.showing = false;
			this.$.tabs.createComponent({content: inControl.tabName || inControl.name, ontap: "tabTap", owner: this});
		}
		this.inherited(arguments);
	},
	selectTab: function(inIndex) {
		// change tab hilight
		this.$.tabs.getControls()[inIndex].setActive(true);
		// show the page
		for (var i=0, c$ = this.getClientControls(), c; c=c$[i]; i++) {
			c.setShowing(i == inIndex);
		}
	},
	tabTap: function(inSender) {
		this.selectTab(inSender.indexInContainer());
	}
});