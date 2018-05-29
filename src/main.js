version = "0.1";
/*ziteLanguages = [
	"CS", "DA", "DE", "EN", "ES", "EO", "FR", "HU", "IT", "KO", "NL", "PL", "PT", "PT-BR", "RU", "TR", "UK", "ZH", "ZH-TW"
];*/

var defaultLang = require("./default-lang.js");

waitingForResponse = false;
permissionaddress = "1M3V3rtUB2mbbVtdcTHF4TNSuwDehd1erU"; // aka public key of kxoid.
certname = "kxoid.bit";

/*var MarkdownIt = require("markdown-it");
md = new MarkdownIt({
	html: false,
	linkify: true
});*/

var ZeroFrame = require("./libs/ZeroFrame.js");
var Router = require("./libs/router.js");
var searchDbQuery = require("./libs/search.js");

var Vue = require("vue/dist/vue.min.js");

var VueZeroFrameRouter = require("./libs/vue-zeroframe-router.js");
var Vuetify = require("vuetify");

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
		peerReceiveCallback: null
	},
	methods: {
		getUserInfo: function(f = null) {
			console.log(this.siteInfo);
            if (this.siteInfo == null || this.siteInfo.cert_user_id == null) {
                this.userInfo = null;
				this.$emit("setuserinfo", this.userInfo);
				this.$emit("update");
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
				that.$emit("setUserInfo", that.userInfo); // TODO: Not sure if I need this if I can pass in a function callback instead
				that.$emit("update", that.userInfo);
				if (f !== null && typeof f === "function") f();
            });
		},
		importZite: function(zite) {
			this.ziteToImport = zite;
			Router.navigate('import-zite');
		},
		setCallback: function(name, callback) {
			console.log("Setting '" + name + "Callback' callback to ", callback);
			this[name + "Callback"] = callback;
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
		} else if (cmd === "peerReceive" && waitingForResponse) {
			if (app.peerReceiveCallback != null && typeof app.peerReceiveCallback == "function") {
				app.peerReceiveCallback(message.params);
			}
		}

		if (message.params.event && message.params.event[0] === "file_done") {
			app.$emit("update");
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
}

page = new ZeroApp();

var Home = require("./router_pages/home.vue");
var CreateId = require("./router_pages/create_id.vue");

VueZeroFrameRouter.VueZeroFrameRouter_Init(Router, app, [
	{ route: "create-id", component: CreateId },
	{ route: "", component: Home }
]);
