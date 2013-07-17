enyo.kind({
    name: 'api.extra.Disqus',
    kind: enyo.Control,
    published: {
        shortname: 'pjetrsite'
    },
    components: [
        {name: "disqus_thread", classes: "disqus_thread", components:[
            {tag: 'noscript', components: [{
                tag: 'a', 
                content: 'Please enable JavaScript to view the comments powered by Disqus.', 
                attributes: {
                    href: "http://disqus.com/?ref_noscript"
                }}
            ]} 
        ]}
    ],
    create: function(){
        this.inherited(arguments);
    
       this.$.disqus_thread.setId("disqus_thread");
        
        var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
        dsq.src = '//' + this.getShortname() + '.disqus.com/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    },
});