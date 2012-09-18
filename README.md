EnyoJS API Tool
===============

This [Bootplate](http://github.com/enyojs/bootplate)-based application
scans EnyoJS source code on the fly and produces navigable documentation.

The _assets/manifest.json_ file identifies the code packages to be scanned.
You can edit this file in your local copy of the api-tool to add your own packages
and libraries to your local view of the documentation.  When we deploy this
to the [enyojs.com website](http://enyojs.com/api/), we use a modified version
of the manifest to include all of the Enyo standard libraries.

**IMPORTANT**: in the context of the API Tool application,
the `$enyo` and `$lib`macros refer to internal folders used to run the
app. You should not use those macros in _assets/manifest.json_ in a deployed 
API Tool application. Instead, use complete paths, either relative to the 
API Tool folder, or absolute.

For example, given:

	enyo/
	lib/
	  layout/
	api-tool/

_manifest.json_ should look like this:

	[
		{"name": "enyo", "path": "../enyo/source"}
		{"name": "layout", "path": "../lib/layout"}
	]