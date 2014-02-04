/* api function :: presentors/shared/function.js */
enyo.kind({
    name: "api.Function",
    kind: enyo.Control,
    published: {
        name: "",
        arguments: ""
    },
    components: [
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
        this.inherited(arguments);
        if (this.getArguments()) {
            this.present();
        }
    },
    argumentsChanged: function(oldSource) {
        if (oldSource != this.getArguments()) {
            this.present();
        }
    },
    nameChanged: function(oldName) {
        if (oldName != this.getName()) {
            this.present();
        }
    },
    present: function() {
        this.reset();
        this.$.propertyTitle.setContent(this.getName());
        this.$.functionArguments.setContent(this.getArguments().join(", "));
    },
    reset: function() {
        this.$.functionArguments.setContent("");
    }
});