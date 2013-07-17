/* Kind table of contents view :: presentors/kind/toc.js */
enyo.kind({
    name: "presentor.kind.Toc",
    kind: enyo.Control,
    published: {
        source: "",
        contents: ""
    },
    components: [
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
    contentsChanged: function(oldContents) {
        if (this.getContents()) {
            this.present();
        }
    },
    present: function() {
        this.reset();
        var inKind = this.getSource();
        var contents = this.getContents();
        contents = api.helper.inlineProperties(contents, {"published":1, "statics":1, "events":1});
        contents.sort(analyzer.Indexer.nameCompare);

        var formatedColumnContents = this.formatToColumns(contents, inKind);
        this.createComponents(formatedColumnContents, {owner: this});
        this.render();
    },
    reset: function() {
        this.destroyComponents();
        this.destroyClientControls();
    },
    formatToColumns: function(inProperties, inSource, inHeight) {
        //var p$ = api.helper.groupFilter(inProperties);
        var prefix = '';
        if (inSource) {
            prefix = inSource.name + "::";
        }
        var h = inHeight || 4;
        var cols = [];
        var column = [];
        for (var i=0, r=0, p; (p=inProperties[i]); i++) {
            column.push({ 
                tag: "a",
                content: p.name,
                attributes: [ {href: "#" + prefix + p.name} ]
            });
            column.push({ tag: "br"});
            if (++r == h) {
                cols.push({ tag: "column", components: column});
                column = [];
                r = 0;
            }
        }
        if (column) {
            cols.push({ tag: "column", components: column});
        }
        return cols;
    }
});