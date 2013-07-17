/* Kind layout main view */
var presentor = presentor, api = api;
enyo.kind({
    name: "presentor.kind.View",
    fit: true,
    kind: enyo.Control,
    published: {
        source: ""
    },
    components: [
        {name: "kindHeader", kind: presentor.kind.Header},
        {name: "tocFrame", kind: "Scroller", components: [
            {name: "kindTocArea", kind: presentor.kind.Toc}
        ]},         
        {name: "bodyFrame", kind: "Scroller", fit: true, classes: "enyo-selectable", components: [
            {name: "indexBusy", kind: "Image", src: "assets/busy.gif", style: "padding-left: 8px;", showing: false},
            {name: "body", components:[
                { kind: presentor.kind.Summary, name: "kindSummary"},
                { kind: api.Properties, name: "kindProperties" }
            ]}
        ]}
    ],
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
        var sourceKind = this.getSource();

        var accessibleProps = this.showInherited ? sourceKind.allProperties : sourceKind.properties;
        accessibleProps = api.helper.groupFilter(accessibleProps, this.showProtected);

        this.$.kindHeader.setSource(sourceKind);
        this.$.kindTocArea.setSource(sourceKind);
        this.$.kindTocArea.setContents(accessibleProps);

        if (sourceKind.comment) {
            this.$.kindSummary.setSource(sourceKind);
        }

        this.$.kindProperties.setSource(sourceKind);
        this.$.kindProperties.setProperties(accessibleProps);

        this.render();
    },
    reset: function() {
        
        this.$.kindHeader.reset();
        this.$.kindTocArea.reset();
        this.$.kindSummary.reset();
        this.$.kindProperties.reset();
        this.$.kindTocArea.reflow();
    }
});