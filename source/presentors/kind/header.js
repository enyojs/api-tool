/* Kind view Presentor/Header */
enyo.kind({
    name: "presentor.kind.Header",
    kind: enyo.Control,
    published: {
        source: ""
    },
    components: [
        { tag: "package", name: "packageLabel" },
        { tag: "kind", name: "kindName" },
        { tag: "div", style: "padding: 4px 0px;", name: "inheritancePath", components: []}
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
        var source = this.getSource();

        if (source.module && source.module.label) {
            this.$.packageLabel.setContent(source.module.label);
        }
        
        this.$.kindName.setContent(source.name);
        
        if (source.superkinds.length) {
            this.createInheritancePath(source);
        }
    },
    reset: function() {
        this.$.packageLabel.setContent("");
        this.$.kindName.setContent("");
        this.$.inheritancePath.destroyComponents();
        this.$.inheritancePath.destroyClientControls();
    },
    createInheritancePath: function(inSource) {
        // enyo.currentControl :: enyo.parentControl
        var superKindControls = [{tag:"span", content:inSource.name}];


        enyo.forEach(inSource.superkinds, function(superkind){
            superKindControls.push({ tag: "a", content: " :: " + superkind, attributes: {
                href: "#" + superkind
            } });
        });
        this.$.inheritancePath.createComponents(superKindControls, {owner: this});
        this.$.inheritancePath.render();
    }


});