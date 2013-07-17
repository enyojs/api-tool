/* Kind-view Presentor/Property */
enyo.kind({
    name: "api.Property",
    kind: enyo.Control,
    published: {
        source: "",
        property: ""
    },
    components: [
        
    ],
    initials: [
        { tag: "a", name: "propertyName" },
        { tag: "div", name: "groupConditional", components: []},
        { tag: "prototype", name: "protoName" },
        { tag: "label", name: "labelContainer", components: [
            { tag: "span", name: "propertyTitle"},
            { tag: "span", content: ":"}
        ] },
        { tag: "span", name: "functionSignature", components: [
            { tag: "span", content: "function("},
            { tag: "arguments", name: "functionArguments",content: ""},
            { tag: "span", content: ")"},
            { tag: "br"}
        ]}
    ],
    create: function() {
        this.components = this.initials;
        this.inherited(arguments);
        if (this.getProperty()) {
            this.present();
        }
    },
    sourceChanged: function() {
        if (this.getSource()) {
            this.present();
        }
    },
    propertyChanged: function(oldProperty) {
        var newProperty = this.getProperty();
        if (oldProperty != newProperty && !!newProperty) {
            this.present();
        }
    },
    present: function() {
        this.reset();
        var property = this.getProperty();
        var kind = this.getSource();
        

        this.$.propertyName.setAttribute("name", property.name);

        if (property.group) {
            this.$.groupConditional.setTag(property.group, this);
            this.$.groupConditional.setContent(property.group, this);
        } else {
            this.$.groupConditional.destroy();
        }

        if (property.object && kind && kind != property.object) {
            this.$.protoName.setContent(property.object.name + "::", this);
        } else {
            this.$.protoName.destroy();
        }

        this.$.propertyTitle.setContent(property.name.replace(".prototype", ""));

        if (property.value && property.value[0] && property.value[0].token == "function") {
            this.$.functionArguments.setContent(property.value[0]['arguments'].join(", "));
        } else {
            this.$.functionSignature.destroyComponents();
            this.$.functionSignature.destroyClientControls();
            this.presentValue(property, this.$.functionSignature);
        }

        this.$.functionSignature.createComponent({ kind: api.Comment, source: property});
        this.createComponent({tag: "hr"}, {owner: this});
    },

    reset: function () {
        this.destroyComponents();
        this.destroyClientControls();
        this.createComponents(this.initials, {owner: this});
    },

    presentValue: function(inValue, inElement) {
        //console.log("value: ", inValue);
        if (!inValue.value || !inValue.value[0]) {
            inElement.createComponent({tag: "span", content: inValue.token});
        } else {
            inElement.createComponent({kind: api.Expression, source: inValue.value[0], style: "display: inline;"}, { owner: this });
        }
        inElement.createComponent({tag: "br"}, {owner: this});
    }
});