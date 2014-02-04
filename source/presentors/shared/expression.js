var api = api;
enyo.kind({
    name: "api.Expression",
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
        var source = this.getSource();

        if (source.comment) {
            this.createComponent({ kind: api.Comment, source: source}, {owner: this});
            return;
        }

        if (source.type == "block") {
            this.createComponents(this.getFormattedBlockComponents("{", "}"), { owner: this });
            this.$.blockquote.createComponent({ kind: api.Properties, properties: source.properties}, {owner: this});
            return;
        }

        if (source.type == "array") {
            this.createComponents(this.getFormattedBlockComponents("[", "]"), { owner: this });
            this.$.blockquote.createComponent({ kind: api.Array, source: source}, {owner: this});
            return;
        }

        this.createComponent({tag:"span", content: source.token});
        return;
    },
    getFormattedBlockComponents: function(startString, endString) {
        return [ 
            { tag: "span", content: startString }, 
            { tag: "blockquote", name: "blockquote"}, 
            { tag: "span", content: endString } 
        ];
    }
});