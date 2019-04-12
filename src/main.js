version = "0.1";
/*ziteLanguages = [
	"CS", "DA", "DE", "EN", "ES", "EO", "FR", "HU", "IT", "KO", "NL", "PL", "PT", "PT-BR", "RU", "TR", "UK", "ZH", "ZH-TW"
];*/

var defaultLang = require("./default-lang.js");

waitingForResponse = false;
permissionaddress = "12F5SvxoPR128aiudte78h8pY7mobroG6V"; // aka public address of kxoid.
base64_publickey = "BOVHKzLh7FHFKCx0DjPj7BCFkuVH0Qcf95uh4Ns69LCRGiUkF+4tbe+IhbilIO8AfRDztBZ4y7ELtfOYPLrx2TA=";
certname = "kxoid.bit";

/*var MarkdownIt = require("markdown-it");
md = new MarkdownIt({
	html: false,
	linkify: true
});*/

jdenticon = require("jdenticon");
jdenticon.config = {
	replaceMode: "observe"
};

var ZeroFrame = require("./libs/ZeroFrame.js");
var Router = require("./libs/router.js");
var searchDbQuery = require("./libs/search.js");

var Vue = require("vue/dist/vue.min.js");

var Vuetify = require("vuetify");
var VueZeroFrameRouter = require("./libs/vue-zeroframe-router.js");

//var { sanitizeStringForUrl, sanitizeStringForUrl_SQL, html_substr, sanitizeHtmlForDb } = require("./util.js");

Vue.use(VueZeroFrameRouter.VueZeroFrameRouter);
Vue.use(Vuetify);

// Vue Components
var Navbar = require("./vue_components/navbar.vue");

var app = new Vue({
	el: "#app",
	template: `<div><v-app>
			<component ref="navbar" :is="navbar" :server-info="serverInfo" :user-info="userInfo" :site-info="siteInfo" :lang-translation="langTranslation"></component>
			<v-content>
				<component ref="view" :is="currentView" v-on:setcallback="setCallback" v-on:get-user-info="getUserInfo()" :server-info="serverInfo" :user-info="userInfo" :site-info="siteInfo" :getting-user-info="gettingUserInfo" :lang-translation="langTranslation"></component>
			</v-content>
		</v-app></div>`,
	data: {
		navbar: Navbar,
		currentView: null,
		siteInfo: null,
		userInfo: null,
		serverInfo: null,
		gettingUserInfo: true,
		langTranslation: defaultLang,
		peerReceiveCallback: null,
		updateCallback: null,
		updateSiteInfoCallback: null
	},
	methods: {
		getUserInfo: function(f = null) {
			var query = `SELECT ids.*, 'ids' AS table FROM ids WHERE address="${this.siteInfo.auth_address}" UNION SELECT bots.*, 'bots' AS table FROM bots WHERE address="${this.siteInfo.auth_address}"`
			page.cmd("dbQuery", [query], (results) => {
				if (results.length > 0) {
					var type = results[0].table == "ids" ? "web" : "bot";
					page.cmdp("certAdd", [certname, type, results[0].username, results[0].signature])
						.then((res) => {
						});
				}
			});
			
			console.log(this.siteInfo);
            if (this.siteInfo == null || this.siteInfo.cert_user_id == null) {
                this.userInfo = null;
				//this.$emit("setuserinfo", this.userInfo);
				//this.$emit("update");
				app.callCallback("update", this.userInfo, this.siteInfo);
                return;
            }

            var that = this;

			if (f !== null && typeof f === "function") f();
			

            page.cmd("dbQuery", ["SELECT key, value FROM keyvalue LEFT JOIN json USING (json_id) WHERE cert_user_id=\"" + this.siteInfo.cert_user_id + "\" AND directory=\"users/" + this.siteInfo.auth_address + "\""], (rows) => {
                var keyvalue = {};

                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    
                    keyvalue[row.key] = row.value;
                }
				
				that.userInfo = {
					privatekey: that.siteInfo.privatekey,
					cert_user_id: that.siteInfo.cert_user_id,
					auth_address: that.siteInfo.auth_address,
					keyvalue: keyvalue
				};

				if (that.userInfo.keyvalue.ko_interface) {
					page.cmdp("fileGet", { "inner_path": "languages/ko.json", "required": false }).then((data) => {
						data = JSON.parse(data);
						console.log("langdata: ", data);
						if (data) {
							app.langTranslation = data;
							app.$emit("setLanguage", data);
						}
					});
				} else if (that.userInfo.keyvalue.cs_interface) {
					page.cmdp("fileGet", { "inner_path": "languages/cs.json", "required": false }).then((data) => {
						data = JSON.parse(data);
						console.log("langdata: ", data);
						if (data) {
							app.langTranslation = data;
							app.$emit("setLanguage", data);
						}
					});
				}

				console.log("Keyvalue: ", that.userInfo.keyvalue);

				that.gettingUserInfo = false;
				//that.$emit("setUserInfo", that.userInfo); // TODO: Not sure if I need this if I can pass in a function callback instead
				//that.$emit("update", that.userInfo);
				app.callCallback("update", that.userInfo, that.siteInfo);
				if (f !== null && typeof f === "function") f();
            });
		},
		/*importZite: function(zite) {
			this.ziteToImport = zite;
			Router.navigate('import-zite');
		},*/
		setCallback: function(name, callback) {
			console.log("Setting '" + name + "Callback' callback to ", callback);
			this[name + "Callback"] = callback;
		},
		callCallback: function(name, ...params) {
			this[name + "Callback"](...params);
			this.$emit(name);
		}
	}
});

class ZeroApp extends ZeroFrame {
	onOpenWebsocket() {
		var self = this;

		this.cmdp("serverInfo", {})
			.then((serverInfo) => {
				console.log(serverInfo);
				self.serverInfo = serverInfo;
				app.serverInfo = serverInfo;
				return this.cmdp("fileGet", { "inner_path": "languages/" + self.serverInfo.language + ".json", "required": false })
			}).then((data) => {
				data = JSON.parse(data);
				console.log("langdata: ", data);
				if (data) {
					app.langTranslation = data;
					app.$emit("setLanguage", data);
				}
				return this.cmdp("siteInfo", {});
			}).then((siteInfo) => {
				console.log(siteInfo);
				self.siteInfo = siteInfo;
				app.siteInfo = siteInfo;
				app.callCallback("update");
				//app.callCallback("updateSiteInfo", siteInfo);
				if (siteInfo.address!="1GTVetvjTEriCMzKzWSP9FahYoMPy6BG1P" && !siteInfo.settings.own){self.cmdp("wrapperNotification", ["warning", "Note: This was cloned from another zite. You<br>\ncan find the original zite at this address:<br>\n 1GTVetvjTEriCMzKzWSP9FahYoMPy6BG1P."]);}
				app.getUserInfo();
			});
	}

	onRequest(cmd, message) {
		Router.listenForBack(cmd, message);
		console.log(cmd + ": ", message);
		if (cmd === "setSiteInfo") {
			this.siteInfo = message.params;
			app.siteInfo = message.params;
			app.getUserInfo();
		} else if (cmd === "peerReceive") {
			if (waitingForResponse) {
				// PeerValid is called in this callback only if
				// this message wasn't directed to this client
				app.callCallback("peerReceive", message.params);
			} else {
				this.cmd("peerValid", [message.params.hash]);
			}

			var messageParams = message.params;
			if (messageParams.message.startsWith('search|')) {
				var parts = messageParams.split('|');
				var zite = parts[1];
				var query = parts[2];

				if (isEnabled(zite)) {
					doSearch(zite, query, 1, 8, (results) => {

					});
				}
			}
		}

		if (message.params.event && message.params.event[0] === "file_done") {
			//app.$emit("update");
			app.callCallback("update", app.userInfo, app.siteInfo);
		}
	}

	// Returns whether CORS permission enabled for given zite address
	isEnabled(address) {
		if (!app.siteInfo) {
			//console.log("Error: Cannot determine if " + address + " is enabled.");
			return false;
		}

		for (var i in app.siteInfo.settings.permissions) {
			var corsPerm = app.siteInfo.settings.permissions[i];
			var zite_address = corsPerm.replace("Cors:", "");

			if (zite_address == address) {
				console.log(address + " is Enabled!");
				return true;
			}
		}

		console.log(address + " is not Enabled!");

		return false;
	}

	doSearch(ziteAddress, searchQuery, pageNum = 1, limit = 8, f = null) {
		var searchZites = {
			"1uPLoaDwKzP6MCGoVzw48r4pxawRBdmQc": { name: "ZeroUp", searchOptions: {
					orderByScore: true,
					id_col: "date_added",
					select: "*",
					searchSelects: [
						{ col: "title", score: 5 },
						{ col: "file_name", score: 4 },
						{ col: "cert_user_id", score: 3, usingJson: true },
						//{ col: "directory", score: 2, usingJson: true },
						{ col: "date_added", score: 1 }
					],
					table: "file",
					join: "LEFT JOIN json USING (json_id)",
					page: pageNum,
					afterOrderBy: "date_added DESC",
					limit: limit
				} },
			"18Pfr2oswXvD352BbJvo59gZ3GbdbipSzh": { name: "KopyKate Big", searchOptions: {
					orderByScore: true,
					id_col: "date_added",
					select: "*",
					searchSelects: [
						{ col: "title", score: 5 },
						{ col: "description", score: 4 },
						{ col: "category", score: 2 },
					],
					table: "file",
					join: `LEFT JOIN json using (json_id)`,
					afterOrderBy: "date_added ASC",
					page: pageNum,
					limit: limit
				} },
			"1MiS3ud9JogSQpd1QVmM6ETHRmk5RgJn6E": { name: "Important Zites", searchOptions: {
				orderByScore: true,
				id_col: "id",
				select: "*",
				searchSelects: [
					{ col: "title", score: 5 },
					{ col: "domain", score: 5 },
					{ col: "address", score: 5 },
					{ col: "tags", score: 4 },
					{ col: "category_slug", score: 4 },
					{ col: "merger_category", score: 4 },
					{ col: "creator", score: 3 },
					{ col: "description", score: 2 },
					//{ skip: !app.userInfo || !app.userInfo.auth_address, col: "bookmarkCount", select: this.subQueryBookmarks(), inSearchMatchesAdded: false, inSearchMatchesOrderBy: true, score: 6 } // TODO: Rename inSearchMatchesAdded, and isSearchMatchesOrderBy
				],
				table: "zites",
				join: "LEFT JOIN json USING (json_id)",
				//where: languageWhere,
				page: pageNum,
				afterOrderBy: "date_added ASC",
				limit: limit
			} },
			"1SiTEs2D3rCBxeMoLHXei2UYqFcxctdwB": { name: "ZeroSites", searchOptions: {
				orderByScore: true,
				id_col: "site_id",
				select: "*",
				searchSelects: [
					{ col: "title", score: 5 },
                    { col: "address", score: 5 },
                    { col: "tags", score: 4 },
                    { col: "cert_user_id", score: 4, usingJson: true },
                    { col: "category", score: 4 },
                    { col: "language", score: 3 },
                    { col: "description", score: 2 }
                    //{ col: "directory", score: 2, usingJson: true },
                    //{ col: "date_added", score: 1 }
				],
				table: "site",
				join: "LEFT JOIN json USING (json_id)",
				//where: languageWhere,
				page: pageNum,
				afterOrderBy: "date_added DESC",
				limit: limit
			} },
			"1TaLkFrMwvbNsooF4ioKAY9EuxTBTjipT": { name: "ZeroTalk", searchOptions: {
				orderByScore: true,
				id_col: "topic_id",
				select: `topic.*, json.directory,
					topic.topic_id || '_' || topic_creator_content.directory AS row_topic_uri,
					topic_creator_user.value AS topic_creator_user_name,
					CASE WHEN MAX(comment.added) IS NULL THEN topic.added ELSE MAX(comment.added) END as last_action`,
				searchSelects: [
					{ col: "title", score: 5 },
                    { col: "body", score: 4 },
				],
				table: "topic",
				join: `LEFT JOIN json USING (json_id)
					LEFT JOIN json AS topic_creator_content ON (topic_creator_content.directory = json.directory AND topic_creator_content.file_name = 'content.json')
					LEFT JOIN keyvalue AS topic_creator_user ON (topic_creator_user.json_id = topic_creator_content.json_id AND topic_creator_user.key = 'cert_user_id')
					LEFT JOIN comment ON (comment.topic_uri = row_topic_uri AND comment.added < ${Date.now()/1000+120})`,
				page: self.pageNum,
				afterOrderBy: `last_action DESC`,
				groupBy: "topic.topic_id, topic.json_id",
				having: `last_action < ${Date.now()/1000+120}`,
				limit: limit
			} },
			"1PHBjZSAc6mHDMkySJNs3XeSXUL7eY7Q7W": { name: "ZeroExchange", searchOptions: {
				orderByScore: true,
				id_col: "question_id",
				select: "*",
				searchSelects: [
					{ col: "title", score: 5 },
					{ col: "tags", score: 4 },
					{ col: "body", score: 3 },
					{ col: "date_added", score: 1 }
				],
				table: "questions",
				join: "LEFT JOIN json USING (json_id)",
				//where: languageWhere,
				page: 0,
				afterOrderBy: "date_added DESC",
				limit: limit
			} },
			"1GitLiXB6t5r8vuU2zC6a8GYj9ME6HMQ4t": { name: "GitCenter", searchOptions: {
				orderByScore: true,
				id_col: "address",
				select: "*",
				searchSelects: [
					{ col: "address", score: 5 },
					{ col: "title", score: 5 },
                    { col: "description", score: 4 },
                    //{ col: "cert_user_id", score: 3, usingJson: true }, // 0list puts this in keyvalue instead of json table for some reason
                    //{ col: "directory", score: 2, usingJson: true },
                    { col: "date_added", score: 1 }
				],
				table: "repo_index",
				join: "LEFT JOIN json USING (json_id)",
				//where: languageWhere,
				page: 0,
				afterOrderBy: "date_added ASC",
				limit: limit
			} },
			"14c5LUN73J7KKMznp9LvZWkxpZFWgE1sDz": { name: "KxoVid", searchOptions: {
			 	orderByScore: true,
				id_col: "video_id",
				select: "videos.*, videos_json.directory, videos_json.site, videos_json.cert_user_id, channels.name as channel_name",
				searchSelects: [
					{ col: "title", score: 5 },
					{ col: "description", score: 4 },
					{ col: "tags", score: 2 },
				],
				table: "videos",
				join: `LEFT JOIN json as videos_json USING (json_id)
						LEFT JOIN json as channels_json ON channels_json.directory=videos_json.directory AND channels_json.site="1HmJfQqTsfpdRinx3m8Kf1ZdoTzKcHfy2F"
						LEFT JOIN channels ON channels.channel_id=videos.ref_channel_id AND channels.json_id=channels_json.json_id`,
				afterOrderBy: "date_added ASC",
				page: pageNum,
				limit: limit
			} }
		}

		var query = searchDbQuery(this, searchQuery || "", searchZites[ziteAddress].searchOptions);

		this.cmd("as", [ziteAddress, "dbQuery", [query]], (results) => {
			if (typeof f !== undefined && f != null) f(results, searchZites[ziteAddress].name);
		});
	}

	selectUser() {
		return this.cmdp("certSelect", { accepted_domains: ["kxoid.bit"] });
    }

    signout() {
    	return this.cmdp("certSelect", { accepted_domains: [""] });
    }

    unimplemented() {
        return page.cmdp("wrapperNotification", ["info", "Unimplemented!"]);
	}

	checkOptional(doSignPublish, f) {
        if (!app.userInfo || !app.userInfo.cert_user_id) {
            this.cmd("wrapperNotification", ["info", "Please login first."]);
            //page.selectUser(); // TODO: Check if user has data, if not, show the registration modal.
            return;
        }

        var data_inner_path = "data/users/" + page.siteInfo.auth_address + "/data.json";
        var content_inner_path = "data/users/" + page.siteInfo.auth_address + "/content.json";

        // Verify that user has correct "optional" and "ignore" values
        page.cmd("fileGet", { "inner_path": content_inner_path, "required": false }, (data) => {
            if (!data) data = {};
            else data = JSON.parse(data);

            var curoptional = ".+\\.(zip)(.piecemap.msgpack)?";
            var changed = false;
            if (!data.hasOwnProperty("optional") || data.optional !== curoptional){
                data["optional"] = curoptional
                changed = true;
            }

            var json_raw = unescape(encodeURIComponent(JSON.stringify(data, undefined, "\t")));

            if (changed) {
                // Write (and Sign and Publish is doSignPublish)
                page.cmd("fileWrite", [content_inner_path, btoa(json_raw)], (res) => {
                    if (res === "ok") {
                        if (f != null && typeof f === "function") f();
                        if (doSignPublish) {
                            page.cmd("siteSign", { "inner_path": content_inner_path }, () => {
                                page.cmd("sitePublish", { "inner_path": content_inner_path, "sign": false });
                            });
                        }
                    } else {
                        page.cmd("wrapperNotification", ["error", "File write error: " + JSON.stringify(res)]);
                    }
                });
            } else {
                if (f != null && typeof f === "function") f();
            }
        });
    }

	uploadBigFile(file, f = null) {
		var date_added = Date.now();
        var orig_filename_list = file.name.split(".");
        var filename = orig_filename_list[0].replace(/\s/g, "_").replace(/[^\x00-\x7F]/g, "").replace(/\'/g, "").replace(/\"/g, "") + "-" + date_added + "." + orig_filename_list[orig_filename_list.length - 1];

        var f_path = "data/users/" + page.siteInfo.auth_address + "/" + filename;

        page.checkOptional(false, () => {
            page.cmd("bigfileUploadInit", [f_path, file.size], (init_res) => {
                var formdata = new FormData();
                formdata.append(file.name, file);

                var req = new XMLHttpRequest();

                req.upload.addEventListener("progress", console.log);
                req.upload.addEventListener("loadend", () => {
					console.log("Loadend");
					// Pin file so it is excluded from the automatized optional file cleanup
					page.cmd("optionalFilePin", { "inner_path": f_path });
					
                    page.cmd("wrapperNotification", ["info", "Upload finished!"]);
                    if (f !== null && typeof f === "function") f(f_path);
                });
                req.withCredentials = true;
                req.open("POST", init_res.url);
                req.send(formdata);
            });
        });
	}

	/*getZitesSearch() {
		
	}*/
}

page = new ZeroApp();

var Home = require("./router_pages/home.vue");
var CreateId = require("./router_pages/create_id.vue");
var CreateBotId = require("./router_pages/create_bot_id.vue");
var Profile = require("./router_pages/profile.vue");
var Plugins = require("./router_pages/plugins.vue");
var UploadPlugin = require("./router_pages/upload_plugin.vue");
var UploadPluginVersion = require("./router_pages/upload_plugin_version.vue");
var Plugin = require("./router_pages/plugin.vue");
var Settings = require("./router_pages/settings.vue");

VueZeroFrameRouter.VueZeroFrameRouter_Init(Router, app, [
	{ route: "plugin/:username/:id/add", component: UploadPluginVersion },
	{ route: "plugin/:username/:id", component: Plugin },
	{ route: "plugins/upload", component: UploadPlugin },
	{ route: "plugins", component: Plugins },
	{ route: "profile/:username", component: Profile },
	{ route: "profile", component: Profile },
	{ route: "create-id", component: CreateId },
	{ route: "create-bot-id", component: CreateBotId },
	{ route: "search/:tab/:searchQuery", component: Home },
	{ route: "search/:tab", component: Home },
	{ route: "search", component: Home },
	{ route: "settings", component: Settings },
	{ route: "", component: Home }
]);
