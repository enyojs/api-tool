/* api comment :: presentors/shared/comment.js */
enyo.kind({
    name: "api.Comment",
    kind: enyo.Control,
    showing: false,
    published: {
        source: ""
    },
    components: [
        {tag: "comment", allowHtml: true, name: "comment"}
    ],
    create: function() {
        this.inherited(arguments);
        if (this.getSource() && this.getSource().comment) {
            this.present();
        }
    },
    sourceChanged: function(oldSource) {
        if (oldSource != this.getSource() && this.getSource().comment) {
            this.present();
        }
    },
    present: function() {
        this.reset();
        this.$.comment.setContent(this.markupToHtml(this.getSource().comment));
        this.show();
    },
    reset: function() {
        this.hide();
        this.$.comment.setContent("");
    },
    markupToHtml: function(inMarkup) {
        /* global syntaxHighlight, Showdown */
        var html = api.Comment.showdown.makeHtml(inMarkup || "");
        html = html.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/gm, function(m, c) {
            return "<pre>" + syntaxHighlight(c) + "</pre>";
        });
        return html;
    },
    statics: {
        showdown: new Showdown.converter()
    }
});