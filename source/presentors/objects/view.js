/* Objects(Modules) layout main view */
var presentor = presentor, api = api;
enyo.kind({
    name: "presentor.objects.View",
    fit: true,
    kind: enyo.Control,
    showing: false,
    published: {
        source: ""
    },
    components: [
        
    ],
    initials: [
        {tag: "h3", name: "kindsHeader"},
        {name: "kindsContainer", components:[

        ]},
        {tag: "h3", name: "singletonsHeader"},
        {name: "singletonsContainer", components:[

        ]},
        {tag: "h3", name: "functionsHeader"},
        {name: "functionsContainer", components:[

        ]},
        {tag: "h3", name: "globalsHeader"},
        {name: "globalsContainer", components:[

        ]},
        {name: "remarks"}
    ],
    create: function() {
        this.components = this.initials;
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
        var i, o;
        var sourceObjects = this.getSource();



        var kindComponents = [];
        var kindObjects = api.helper.getByType(sourceObjects, "kind");
        if (kindObjects.length) {
            for (i=0; (o=kindObjects[i]); i++) {
                kindComponents.push({tag: "kind", content: o.name});
                kindComponents.push({kind: api.Comment, source: o});
            }
        }
        if (kindComponents.length) {
            this.$.kindsHeader.setContent("Kinds");
            this.$.kindsContainer.createComponents(kindComponents, {owner: this});
            this.$.kindsContainer.render();
        }

        var singletonComponents = [];
        var singletonObjects = api.helper.getByType(sourceObjects, "singleton");
        if (singletonObjects.length) {
            for (i=0; (o=singletonObjects[i]); i++) {
                singletonComponents.push({tag: "kind", content: o.name});
                singletonComponents.push({kind: api.Comment, source: o});
            }
        }
        if (singletonComponents.length) {
            this.$.singletonsHeader.setContent("Singletons");
            this.$.singletonsContainer.createComponents(singletonComponents, {owner: this});
            this.$.singletonsContainer.render();
        }

        var functionComponents = [];
        var functionObjects = api.helper.getByType(sourceObjects, "function");
        if (functionObjects.length) {
            for (i=0; (o=functionObjects[i]); i++) {
                if (o.group) {
                    functionComponents.push({tag: o.group, content: o.group});
                }                
                functionComponents.push({kind: api.Function, tag: "span", name: o.name.replace(".prototype", ""), arguments: o.value[0]['arguments']});
            }
        }
        if (functionComponents.length) {
            this.$.functionsHeader.setContent("Functions");
            this.$.functionsContainer.createComponents(functionComponents, {owner: this});
            this.$.functionsContainer.render();
        }
        

        var globalComponents = [];
        var globalObjects = api.helper.getByType(sourceObjects, "global");
        if (globalObjects.length) {
            for (i=0; (o=globalObjects[i]); i++) {
                globalComponents.push({ kind: api.Comment, source: o });
                if (o.group) {
                    globalComponents.push({ tag: o.group, content: o.group });
                }
                globalComponents.push({ tag: "label", content: o.name});
                globalComponents.push({ tag: "span", content: " = "});
                globalComponents.push({ tag: "span", kind: api.Expression, source: o.value[0]});
            }
        } 
        if (globalComponents.length) {
            this.$.globalsHeader.setContent("Variables");
            this.$.globalsContainer.createComponents(globalComponents, {owner: this});
            this.$.globalsContainer.render();
        }
        

        if (!globalComponents.length 
            && !functionComponents.length 
            && !kindComponents.length 
            && !singletonComponents.length) {
            this.$.remarks.createComponent({tag: "h3", content: "This module has no public properties or functions to display."}, {owner: this});
        }
        this.show();
        this.render();
    },
    reset: function() {
        this.hide();
        this.destroyComponents();
        this.destroyClientControls();
        this.createComponents(this.initials, {owner: this});
    }
});