/* global Presentor */
enyo.kind({
    name: "App",
    fit: true,
    kind: "FittableColumns",
    components: [
        {kind: "analyzer.Analyzer", onIndexReady: "indexReady"},
        {name: "left", kind: "TabPanels", classes: "enyo-unselectable", components: [
            {kind: "Scroller", tabName: "Kinds", components: [
                {name: "kinds", allowHtml: true}
            ]},
            {kind: "Scroller", tabName: "Modules", components: [
                {name: "modules", allowHtml: true}
            ]},
            {kind: "Scroller", tabName: "Index", components: [
                {kind: "SearchBar", onSearch: "search"},
                {name: "index", allowHtml: true}
            ]},
            {name: "packages", tabName: "Packages", kind: "PackageList", onPackagesChange: "loadPackages", onLoaded: "packagesLoaded"}
        ]},
        { kind: api.presentors.Controller, classes: "api-doc", name: "controller", onReSelectTopic: "handleReSelectTopic", isBusy: false, fit: true }
    ],
    create: function() {
        this.inherited(arguments);
        window.onhashchange = enyo.bind(this, "hashChange");
        // load packages
        this.loadPackages();
    },
    //
    // analyze packages
    //
    loadPackages: function() {
        // alias this important object and reset indexer
        this.index = this.$.analyzer.index = new analyzer.Indexer();
        this.$.packages.loadPackageData();
    },
    packagesLoaded: function(inSender, inEvent) {
        // update our version in title bar
        document.title = "Enyo API Viewer (" + inEvent.version + ")";
        // walk the selected packages
        var paths = [];
        this.hidden = [];
        for(var i=0; i<inEvent.packages.length; i++) {
            var curr = inEvent.packages[i];
            if(!inEvent.packages[i].disabled) {
                paths.push({ path: curr.path, label: curr.name});
            }
            if(curr.hidden) {
                this.hidden.push(curr.name);
            }
        }
        this.walk(paths);
        return true;
    },
    walk: function(inPackageList) {
        this.walking = true;
        this.$.controller.setIsBusy(true);
        this.$.analyzer.walk(inPackageList);
    },
    //
    // presentation of documentation data
    //
    indexReady: function() {
        this.presentKinds();
        this.presentModules();
        this.presentIndex();
        //this.$.indexBusy.hide();
        this.$.controller.setIsBusy(false);
        this.walking = false;
        this.hashChange();
    },
    // indices
    indexalize: function(inFilter, inTemplate, inMap) {
        var filtered = inFilter ? enyo.filter(this.index.objects, inFilter, this) : this.index.objects;

        //sort module data
        if (inFilter(filtered[0])) {
            filtered.sort(this.moduleCompare);
        }

        filtered = this.nameFilter(filtered);

        var html = '', divider;
        for (var i=0, o; (o=filtered[i]); i++) {
            if(this.visibleModule(o)) {
                // divider
                var d = inMap(o).divider;
                if (d && divider != d) {
                    divider = d;
                    html += "<divider>" + d + "</divider>";
                }
                html += enyo.macroize(inTemplate, inMap(o));
            }
        }
        return html;
    },
    visibleModule: function(o) {
        var mdl = o.module || ((o.object) ? o.object.module : undefined);
        var lbl = (mdl) ? mdl.label : (o.label);
        return (this.hidden.indexOf(lbl)<0);
    },
    //special case to exclude the path when sorting modules & only use the file name (g11n workaround)
    moduleCompare: function(inA, inB) {
        var a, b;
        try {
            a = inA.name.match('[^/]*\\.js$')[0];
            b = inB.name.match('[^/]*\\.js$')[0];
        }
        catch (err) {
            a = inA.name;
            b = inB.name;
        }

        if (a.toUpperCase() < b.toUpperCase()) {
            return -1;
        } else if (a.toUpperCase() > b.toUpperCase()) {
            return 1;
        } else {
            return 0;
        }
    },
    nameFilter: function(inObjects) {
        return enyo.filter(inObjects, function(o) {
            return o.name && o.name[0] !== "_";
        });
    },
    presentFilteredIndex: function(inFilter) {
        var template = '<a href="#{$link}"><prototype>{$object}</prototype><topic>{$topic}</topic>{$module}</a><br/>';
        var map = function(o) {
            return {
                link: o.topic || o.name,
                topic: o.name.replace(".prototype", ""), //g11n - remove "prototype" string from index topic
                divider: o.name[0].toUpperCase(),
                object: o.object && o.object.name ? o.object.name + "::" : "",
                module: !o.object && o.module && o.module.name ? " [" + o.module.name.match('[^/]*\\.js$') + "]" : ""
            };
        };
        this.$.index.setContent(this.indexalize(inFilter, template, map));
    },
    presentIndex: function() {
        var filter = function(o) {
            return (o.name !== "published" && (o.group == "public" || o.group == "published"));
        };
        this.presentFilteredIndex(filter);
    },
    presentModules: function() {
        var filter = function(o) {
            return (o.type == "module");
        };
        var template = '<a href="#{$link}"><topic>{$topic}</topic></a><br/>';
        var map = function(o) {
            // enyo.log(o);
            return {
                link: o.topic || o.name,
                topic: o.name.match('[^/]*\\.js$'), // g11n - remove the path name
                divider: o.name.match('[^/]*\\.js$')[0][0].toUpperCase()
            };
        };
        this.$.modules.setContent(this.indexalize(filter, template, map));
    },
    presentKinds: function() {
        var filter = function(o) {
            return (o.type == "kind" && o.group == "public");
        };
        var template = '<a href="#{$link}"><topic>{$topic}</topic></a><br/>';
        var map = function(o) {
            return {
                link: o.topic || o.name,
                topic: o.name,
                divider: o.name.split(".")[0]
            };
        };
        this.$.kinds.setContent(this.indexalize(filter, template, map));
    },
    // docs
    presentObject: function(inObject) {
        // early exit for bad inObject
        if (inObject) {
            body = this.$.controller.presentObject(inObject);
        }
    },
    presentModule: function(inModule) {
        //this.$.code.setContent(inModule.code);
        this.presentObject(inModule);
    },

    //
    // UX
    //
    moduleTap: function(inSender) {
        this.presentModule(inSender.object);
    },
    objectTap: function(inSender) {
        this.presentObject(inSender.object);
    },
    //
    hashChange: function(inEvent) {
        if(window.location.hash.indexOf("?")>-1) {
            this.loadPackages();
        } else {
            this.selectTopic(this.getHashTopic());
        }
    },
    getHashTopic: function() {
        return window.location.hash.slice(1);
    },
    selectTopic: function(inTopic) {
        this.topic = inTopic;
        // split
        var parts = inTopic.split("::");
        var main = parts.shift();
        var sub = parts.shift();
        // find this eponymous main object
        var object = this.index.findByName(main) || this.index.findByName("enyo." + main);
        if (this.topicObject != object) {
            this.presentObject(object);
            this.topicObject = object;
            //this.$.body.container.setScrollTop(0);
        }
        if (sub) {
            var anchor = document.getElementsByName(sub)[0];
            if (anchor) {
                anchor.scrollIntoView(true);
            }
        }
    },
    handleReSelectTopic: function() {
        this.topicObject = null;
        this.selectTopic(this.topic);
    },
    search: function(inSender, inEvent) {
        this.setSearchString(inEvent.searchString.toLowerCase());
    },
    setSearchString: function(inString) {
        var filter = function(o) {
            return (o.name !== "published" && (o.group == "public" || o.group == "published")) && (o.name.toLowerCase().indexOf(inString) >= 0);
        };
        this.presentFilteredIndex(filter);
    }
});