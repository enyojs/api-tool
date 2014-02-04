/* Objects(Modules) layout Header view */
var presentor = presentor, api = api;
enyo.kind({
    name: "presentor.objects.Header",
    kind: enyo.Control,
    tag: "moduleName",
    showing: false,
    published: {
        source: ""
    },
    create: function() {
        this.inherited(arguments);
        if (this.getSource()) {
            this.present();
        }
    },
    sourceChanged: function(oldSource) {
        var newSource = this.getSource();
        if (oldSource != newSource) {
            this.present();
        }
    },
    present: function() {
        this.reset();
        if (this.getSource()[0]) {
            this.setContent(this.getSource()[0].module.name);
        }
        this.show();
    },
    reset: function() {
        this.setContent("");
        this.hide();
    }
});