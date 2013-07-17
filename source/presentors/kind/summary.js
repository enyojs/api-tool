/* Kind summary view :: presentors/kind/summary.js */
enyo.kind({
    name: "presentor.kind.Summary",
    kind: enyo.Control,
    published: {
        source: ""
    },
    components: [
        {tag: "h3", name: "summaryHeader"},
        {name: "summaryContainer", components:[] }
    ],
    create: function() {
        this.inherited(arguments);
        if (this.getSource()) {
            this.present();
        }
    },
    sourceChanged: function(oldSource) {
        if (oldSource != this.getSource()) {
            this.present();
        }
    },
    present: function() {
        this.reset();
        this.$.summaryHeader.setContent("Summary");
        var source = this.getSource();
        this.$.summaryContainer.createComponent({kind: api.Comment, source: source}, {owner: this});
    },
    reset: function() {
        this.$.summaryHeader.setContent("");
        this.$.summaryContainer.destroyComponents();
        this.$.summaryContainer.destroyClientControls();
    }
});