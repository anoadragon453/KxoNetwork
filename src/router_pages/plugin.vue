<template>
	<v-container fluid>
		<v-container style="max-width: 700px;" v-if="plugin">
			<div style="display: block; margin-bottom: 10px;"><strong style="font-size: 1.2em;">Plugin: {{ plugin.name }}</strong><a v-if="userInfo && userInfo.cert_user_id == plugin.cert_user_id" style="float: right;" @click.prevent="">Edit Plugin</a></div>
			<p>{{ plugin.description }}</p>
			<p>Uploaded by <a :href="'./?/profile/' + plugin.cert_user_id.replace('@kxoid.bit', '')" @click.prevent="goto('profile/' + plugin.cert_user_id.replace('@kxoid.bit', ''))">{{ plugin.cert_user_id }}</a></p>
			<div>
				<a @click="downloadLatestVersion()">Download Latest</a> <span v-if="latest_version_peers">({{ latest_version_peers }} peers)</span>
				| <a @click="follow()">{{ followText }}</a>
			</div>
			<div v-if="isOwner">
				<a @click.prevent="uploadNewVersion()">Upload New Version</a>
			</div>
			<hr>
			<v-card v-for="version in plugin_versions" :key="version.id" style="padding: 10px; margin-top: 10px;">
				<div>Version {{ version.version }}</div>
				<div><a @click="downloadVersion(version)">Download</a> <span v-if="typeof version.peer !== undefined && version.peer != null">({{ version.peer }} peers)</span></div>
			</v-card>
		</v-container>
		<v-container style="max-width: 700px;" v-else>
			<p>Plugin does not exist!</p>
		</v-container>
	</v-container>
</template>

<script>
	var Router = require("../libs/router.js");
	var searchDbQuery = require("../libs/search.js");

	module.exports = {
		props: ["userInfo", "langTranslation"],
		name: "plugin",
		data: () => {
			return {
				plugin: null,
				plugin_versions: [],
				latest_version_peers: 0,
				followText: "Follow New Versions"
			};
		},
		beforeMount: function() {
			var self = this;
			/*this.$parent.$on("setLanguage", function(langTranslation) {
				self.ZiteName = langTranslation["KxoId"];
			});
			this.ZiteName = this.langTranslation["KxoId"];*/
		},
		mounted: function() {
			var self = this;
			if (!this.userInfo) {
				/*this.$parent.on('setUserInfo', function() {
					// TODO
				});*/
			}

			this.getPlugin(Router.currentParams["username"], Router.currentParams["id"]);
			this.isFollowing();

			this.$emit("setcallback", "update", function() {
				self.getPlugin(Router.currentParams["username"], Router.currentParams["id"]);
			});
		},
		computed: {
			isLoggedIn: function() {
				if (this.userInfo == null) return false;
				return this.userInfo.cert_user_id != null;
			},
			isOwner: function() {
				if (!this.userInfo) return false;
				return this.plugin.cert_user_id == this.userInfo.cert_user_id;
			}
		},
		methods: {
			getCorsAndDb: function(address, doGetResults = false, callback = null) {
				console.log("Test");
                var self = this;
                this.pageNum = 0;
                if(page.siteInfo.settings.permissions.indexOf("Cors:" + address) < 0) {
                    page.cmd("corsPermission", address, function() {
                    		if (doGetResults)
                            	self.getResults();
                            if (callback != null) callback();
                        });
                } else {
                    if (doGetResults)
                    	self.getResults();
                    if (callback != null) callback();
                }
			},
			getPlugin: function(username, id) {
				var self = this;

				var query = `SELECT plugins.*, json.cert_user_id, plugin_versions.file_download_url, plugin_versions.version FROM plugins LEFT JOIN json USING (json_id) LEFT JOIN plugin_versions ON plugins.default_version_id = plugin_versions.id WHERE plugins.id=${id} AND cert_user_id='${username}@kxoid.bit' limit 1`;

				page.cmd("dbQuery", [query], function(results) {
					//console.log(results);
					self.plugin = results[0];
					self.getVersions(results[0].id, results[0].cert_user_id);
				});
			},
			getVersions: function(plugin_id, plugin_cert_user_id) {
				var self = this;

				var query = `SELECT * FROM plugin_versions LEFT JOIN json USING (json_id) WHERE plugin_id=${plugin_id} AND json.cert_user_id='${plugin_cert_user_id}' ORDER BY date_added DESC`;

				page.cmd("dbQuery", [query], function(results) {
					console.log(results);
					self.plugin_versions = results;
					self.plugin_versions.forEach(function(version, index) {
						console.log(version.file_download_url);
						page.cmd("optionalFileInfo", [version.file_download_url], function(info) {
							self.plugin_versions[index]["peer"] = info.peer;
							console.log("Info: ", info);

						});
						if (index == self.plugin_versions.length - 1) self.getLatestVersionPeers();
					});
				});
			},
			getLatestVersionPeers: function() {
				var self = this;

				page.cmd("optionalFileInfo", [self.plugin_versions[0].file_download_url], function(info) {
					self.latest_version_peers = info.peer;
				});
			},
			isFollowing: function() {
				var self = this;
				page.cmd("feedListFollow", [], (followList) => {
					if (followList["plugin_" + Router.currentParams["username"] + "_" + self.plugin.id]) {
						self.followText = "Unfollow New Versions";
					} else {
						self.followText = "Follow New Versions";
					}
				});
			},
			follow: function() {
				var self = this;
				page.cmd("feedListFollow", [], (followList) => {
					var query = `
						SELECT 'plugin_' || REPLACE(json.cert_user_id, '@kxoid.bit', '') || '_' || plugin_versions.id AS event_uri,
							'article' AS type,
							plugin_versions.date_added AS date_added,
							'New Version Of Plugin "' || plugins.name || '"' AS title,
							plugin_versions.version || ': ' || plugins.description AS body,
							'?/plugin/' || REPLACE(json.cert_user_id, '@kxoid.bit', '') || '/' || plugin_versions.plugin_id AS url
						FROM plugin_versions
						LEFT JOIN json USING (json_id)
						LEFT JOIN plugins ON plugins.id=plugin_versions.plugin_id AND plugins.json_id=plugin_versions.json_id
						WHERE plugin_versions.plugin_id=${self.plugin.id}
							AND json.cert_user_id='${Router.currentParams["username"]}@kxoid.bit'
						`;
					var params = "";
					console.log(query);
					page.cmdp("dbQuery", [query])
						.then((results) => console.log(results));
					
					var newList = followList;
					if (followList["plugin_" + Router.currentParams["username"] + "_" + self.plugin.id]) {
						delete newList["plugin_" + Router.currentParams["username"] + "_" + self.plugin.id];
						self.followText = "Follow New Versions";
					} else {
						newList["plugin_" + Router.currentParams["username"] + "_" + self.plugin.id] = [query, params];
						self.followText = "Unfollow New Versions";
					}
					page.cmd("feedFollow", [newList]);
				});
			},
			uploadNewVersion: function() {
				Router.navigate('plugin/' + Router.currentParams["username"] + '/' + Router.currentParams["id"] + '/add');
			},
			goto: function(to) {
				Router.navigate(to);
			},
			login: function() {
				page.selectUser();
				return false;
			},
			gotoLink: function(to) {
				console.log(to);
				window.location = to;
			},
			downloadLatestVersion: function() {
				/*console.log(this.plugin);
				console.log(this.plugin.file_download_url);
				console.log(this.plugin.version);*/
				window.location = '/1GTVetvjTEriCMzKzWSP9FahYoMPy6BG1P/' + this.plugin_versions[0].file_download_url;
			},
			downloadVersion: function(version) {
				window.location = '/1GTVetvjTEriCMzKzWSP9FahYoMPy6BG1P/' + version.file_download_url;
			}
		}
	}
</script>