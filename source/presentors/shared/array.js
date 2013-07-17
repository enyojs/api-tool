enyo.kind({
    name: "api.Array",
    kind: enyo.Control,
    published: {
        source: ""
    },
    components: [

    ],
    create: function() {
        this.inherited(arguments);
        if (this.getSource()) {
            this.present();
        }
    },
    sourceChanged: function(oldValue) {
        var newValue = this.getSource();
        if (oldValue != newValue && !!newValue) {
            this.present();
        }
    },
    present: function() {
        var props = this.getSource().properties;
        for (var i=0, p; (p=props[i]); i++) {
            this.createComponents([
                { tag: "i", content: i + ": " },
                { tag: "span", kind: api.Expression, source: p }
            ], {owner: this});
        }
    }
});