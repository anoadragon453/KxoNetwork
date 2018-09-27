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
			<component ref="navbar" :is="navbar" :user-info="userInfo" :lang-translation="langTranslation"></component>
			<v-content>
				<component ref="view" :is="currentView" v-on:setcallback="setCallback" v-on:get-user-info="getUserInfo()" :user-info="userInfo" :getting-user-info="gettingUserInfo" :lang-translation="langTranslation"></component>
			</v-content>
		</v-app></div>`,
	data: {
		navbar: Navbar,
		currentView: null,
		siteInfo: null,
		userInfo: null,
		gettingUserInfo: true,
		langTranslation: defaultLang,
		peerReceiveCallback: null,
		updateCallback: null
	},
	methods: {
		getUserInfo: function(f = null) {
			console.log(this.siteInfo);
            if (this.siteInfo == null || this.siteInfo.cert_user_id == null) {
                this.userInfo = null;
				//this.$emit("setuserinfo", this.userInfo);
				//this.$emit("update");
				app.callCallback("update", this.userInfo);
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
				app.callCallback("update", that.userInfo);
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
				if (siteInfo.address!="1GTVetvjTEriCMzKzWSP9FahYoMPy6BG1P" && !siteInfo.settings.own){self.cmdp("wrapperNotification", ["warning", "Note: This was cloned from another zite. You<br>\ncan find the original zite at this address:<br>\n 1GTVetvjTEriCMzKzWSP9FahYoMPy6BG1P."]);}
				app.getUserInfo();
			});
	}

	onRequest(cmd, message) {
		Router.listenForBack(cmd, message);
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
		}

		if (message.params.event && message.params.event[0] === "file_done") {
			//app.$emit("update");
			app.callCallback("update");
		}
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
var Profile = require("./router_pages/profile.vue");
var Plugins = require("./router_pages/plugins.vue");
var UploadPlugin = require("./router_pages/upload_plugin.vue");
var Plugin = require("./router_pages/plugin.vue");

VueZeroFrameRouter.VueZeroFrameRouter_Init(Router, app, [
	{ route: "plugin/:username/:id", component: Plugin },
	{ route: "plugins/upload", component: UploadPlugin },
	{ route: "plugins", component: Plugins },
	{ route: "profile/:username", component: Profile },
	{ route: "profile", component: Profile },
	{ route: "create-id", component: CreateId },
	{ route: "", component: Home }
]);
