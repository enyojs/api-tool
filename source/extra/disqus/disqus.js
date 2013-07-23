enyo.kind({
    name: 'api.extra.Disqus',
    kind: enyo.Control,
    published: {
        shortname: "pjetrsite", // SET THIS ACCORDING TO DISQUS ACCOUNT YOU CREATED FOR THE API-VIEWER
        category_id: "2488265", // SET THIS ACCORDING TO THE CATEGORIES YOU CREATED IN YOUR ACCOUNT
        title: "",
        identifier: "",
        url: ""
    },
    components: [{
        name: "disqus_info",
        content: "[TEST SITE] Please do not post questions on community comments. Only snippets and solutions that will help others. Still they must be relative to the information you are looking at."
    }, 
    {
        name: "disqus_thread",
        classes: "disqus_thread",
        id: "disqus_thread",
        components: [{
            tag: 'noscript',
            components: [{
                tag: 'a',
                content: 'Please enable JavaScript to view the comments powered by Disqus.',
                attributes: {
                    href: "http://disqus.com/?ref_noscript"
                }
            }]
        }]
    }],

    create: function() {
        this.inherited(arguments);
        this.createIdentifier();
        this.createHashBagUrl();
        this.start();
    },
    /***
     *   `start` is function responsible for injecting the necessary variables and script for Disqus to run on the
     *   `<head>` or `<body>` tag of the page.
     */
    start: function() {
        // Disqus var values for later script injection
        // Exist here as mappings to the generating script variables and easier debugging, better not remove.
        var disqus_identifier = this.getIdentifier();
        var disqus_category_id = this.getCategory_id();
        var disqus_title = this.getTitle();
        var disqus_url = this.getUrl();

        // Script injection to <head> containing the above variables in global context for first run.
        var dsq_params = document.createElement("script");
        dsq_params.type = "text/javascript";
        dsq_params.text = "var disqus_identifier = '" + disqus_identifier + "';        var disqus_category_id ='" + disqus_category_id + "';        var disqus_title = '" + disqus_title + "';        var disqus_url = '" + disqus_url + "';";
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq_params);

        // Script injection to <head> for Disqus as in http://bit.ly/MUmhtQ
        var dsq = document.createElement('script');
        dsq.type = 'text/javascript';
        dsq.async = true;
        dsq.src = '//' + this.getShortname() + '.disqus.com/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    },

    /***
     *   `reset` function is responsible for reseting the Disqus comments and is called upon a change in the
     *   currently viewed item in API-Viewer which can be some kind or object. At first checks if the new item
     *   is not the same as the previous one and later takes necessary steps to reset Disqus
     */
    reset: function(pageid, url) {
        // Start by checking if it tries to reset disqus with the same identifier.
        /*if (window.location.hash.indexOf(this.getIdentifier()) != -1) {
            return;
        }*/

        // Internally modified values. Need to update the module's published.
        this.createIdentifier(pageid);
        this.createHashBagUrl(url);

        // Not modified values
        var disqus_category_id = this.getCategory_id();
        var disqus_title = this.getTitle();
        var disqus_identifier = this.getIdentifier();
        var disqus_url = this.getUrl();

        DISQUS.reset({
            reload: true,
            config: function() {
                this.page.identifier = disqus_identifier;
                this.page.url = disqus_url;
            }
        });
    },
    /***
     *   Changes and sets the url send to Disqus to contain a full hashbag (!#) instead of a hash (#) since is required.
     *   In case a Url is not provided will modify the current one.
     */
    createHashBagUrl: function(url) {
        url = url || window.location.href;
        url = url.replace("#", "#!"); //Disqus needs full hashbag
        this.setUrl(url);
    },
    /***
     *   Changes and sets an Identifier to be set to Disqus. Should be unique.
     *   In case an identifier is not provided will modify the trailing string after the hash of the current url
     *   or if this does not exists will use the string `start` instead.
     */
    createIdentifier: function(pageid) {
        pageid = pageid || window.location.hash.replace("#", "") || "start";
        this.setIdentifier(pageid);
    }
});