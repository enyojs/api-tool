/* Kind properties view :: presentors/kind/properties.js */
enyo.kind({
    name: "api.Properties",
    kind: enyo.Control,
    published: {
        source: "",
        properties: ""
    },
    components: [
        {tag:"h3", name: "propertiesHeader"},
        {name: "propertiesContainer", components:[] }
    ],
    create: function() {
        this.inherited(arguments);
        if (this.getProperties()) {
            this.present();
        }
    },
    sourceChanged: function(oldSource) {
        if (this.getSource() && oldSource != this.getSource()) {
            this.present();
        }
    },
    propertiesChanged: function(oldProperties) {
        if (this.getProperties() && oldProperties != this.getProperties()) {
            this.present();
        }
    },
    present: function() {
        this.reset();
        var filteredProps = this.getProperties();
        var ownerkind = this.getSource();

        if (ownerkind) {
            this.$.propertiesHeader.setContent("Properties");

        }

        for (var i = 0, prop; (prop = filteredProps[i]); i++) {
            this.presentProperty(prop, ownerkind);
        }

        if (ownerkind) {
            //this.$.propertiesContainer.createComponent({ kind: api.extra.Disqus, name: "disqus"});
        }
    },
    reset: function() {
        this.$.propertiesHeader.setContent("");
        this.$.propertiesContainer.destroyComponents();
        this.$.propertiesContainer.destroyClientControls();
    },
    presentProperty: function(inProperty, inKind) {
        this.$.propertiesContainer.createComponent({kind: api.Property, property: inProperty, source: inKind}, {owner: this});
    }
});