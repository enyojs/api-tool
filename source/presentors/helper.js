enyo.kind({
    name: "api.helper",
    kind: enyo.Control,
    statics: {
        groupFilter: function(inProperties, showProtected) {
            return enyo.filter(inProperties, function(p) {
                return p.name[0] !== "_" && (p.group == "public" || showProtected && p.group == "protected");
            }, this);
        },

        getByType: function(inObjects, inType) {
            var result = [];
            for (var i=0, o; (o=inObjects[i]); i++) {
                if (o.type == inType) {
                    result.push(o);
                }
            }
            return result;
        },

        markupToHtml: function(inMarkup) {
            var html = Presentor.showdown.makeHtml(inMarkup || "");
            html = html.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/gm, function(m, c) {
                return "<pre>" + syntaxHighlight(c) + "</pre>";
            });
            return html;
        },
        
        inlineProperties: function(inList, inPropNames) {
            var newProps = [];
            var addParentHash = function(pr) { pr.parentHash = p.name; };
            for (var i = 0, p; (p = inList[i]); i++) {
                if (inPropNames[p.name]) {
                    // add the properties from p into newProps
                    if (p.value && p.value[0] && p.value[0].properties) {
                        enyo.forEach(p.value[0].properties, addParentHash);
                        newProps = newProps.concat(p.value[0].properties);
                    }
                } else {
                    // add the property directly
                    newProps.push(p);
                }
            }
            return newProps;
        }
    }
});