/* Kind presentors controler:: presentors/contorller.js */
enyo.kind({
    name: "api.presentors.Controller",
    kind: enyo.Control,
    layoutKind: enyo.FittableRowsLayout,
    fit: true,
    published: {
        isBusy: ""
    },
    events: {
        onReSelectTopic: ""
    },
    showInherited: false,
    showProtected: false,
    showSocialComments: false,
    components: [
        {name: "scope", classes: "api-scope", components: [
            {name: "inheritedCb", kind: "Checkbox", content: "show inherited", onchange: "scopeChange"},
            {name: "accessCb", kind: "Checkbox", content: "show protected", style: "margin-left: 20px;", onchange: "accessChange"},
            {name: "commentsCb", kind: "Checkbox", content: "show community comments", style: "margin-left: 20px;", onchange: "commentsChange"}
        ]},
        {name: "kindHeader", kind: presentor.kind.Header, classes: "api-header"},
        {name: "objectsHeader", kind: presentor.objects.Header, classes: "api-header"},
        {name: "tocFrame", classes: "api-tocFrame", kind: "Scroller", components: [
            {name: "kindTocArea", classes: "api-tocArea", kind: presentor.kind.Toc}
        ]},         
        {name: "bodyFrame", kind: "Scroller", fit: true, classes: "enyo-selectable", components: [
            {name: "indexBusy", kind: "Image", src: "assets/busy.gif", style: "padding-left: 8px;", showing: false},
            {name: "body", classes: "api-body", components:[
                { kind: presentor.kind.Summary, name: "kindSummary"},
                { kind: api.Properties, name: "kindProperties" },
                { kind: presentor.objects.View, name: "objectsView" }
            ]}
        ]}
    ],
    create: function() {
        this.inherited(arguments);
    },
    presentObject: function(inObject) {
        switch (inObject.type) {
        case "module":
            return this.presentObjects(inObject.objects);
        case "kind":
        case "singleton":
            return this.presentKind(inObject);
        case "function":
        case "global":
            return this.presentProperty(inObject);
        }
    },
    presentKind: function(inKind) {
        this.resetObjects();

        var accessibleProps = this.showInherited ? inKind.allProperties : inKind.properties;
        accessibleProps = api.helper.groupFilter(accessibleProps, this.showProtected);

        this.$.kindHeader.setSource(inKind);
        this.$.kindTocArea.setSource(inKind);
        this.$.kindTocArea.setContents(accessibleProps);

        if (inKind.comment) {
            this.$.kindSummary.setSource(inKind);
        }

        this.$.kindProperties.setSource(inKind);
        this.$.kindProperties.setProperties(accessibleProps);
        this.$.body.render();        
        this.reflow();
    },
    presentObjects: function(inObjects) {
        this.resetKind();
        var accessibleObjects = api.helper.groupFilter(inObjects, this.showProtected);
        this.$.objectsHeader.setSource(accessibleObjects);
        this.$.objectsView.setSource(accessibleObjects);
    },
    presentProperty: function(inProperty) {
        this.resetKind();
        this.$.kindProperties.createComponent({kind: api.Property, property: inProperty});
    },
    resetKind: function() {
        this.$.kindHeader.reset();
        this.$.kindTocArea.reset();
        this.$.kindSummary.reset();
        this.$.kindProperties.reset();
        this.$.kindTocArea.reflow();
    },
    resetObjects: function() {       
        if (this.$.objectsView) {
            this.$.objectsView.reset();
            this.$.objectsHeader.reset();
        }
    },
    scopeChange: function() {
        this.showInherited = this.$.inheritedCb.getValue();
        this.$.body.container.setScrollTop(0);
        this.doReSelectTopic();
    },
    accessChange: function() {
        this.showProtected = this.$.accessCb.getValue();
        this.$.body.container.setScrollTop(0);
        this.doReSelectTopic();
    },
    commentsChange: function() {
        this.showSocialComments = this.$.commentsCb.getValue();
        this.$.body.container.setScrollTop(0);
        this.doReSelectTopic();
    },
    isBusyChanged: function(oldVal) {
        this.$.indexBusy.setShowing(this.getIsBusy());
    }
});