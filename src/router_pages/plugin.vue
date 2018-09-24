<template>
	<v-container fluid>
		<v-container style="max-width: 700px;" v-if="plugin">
			<div style="display: block; margin-bottom: 10px;"><strong style="font-size: 1.2em;">Plugin: {{ plugin.name }}</strong><a v-if="userInfo && userInfo.cert_user_id == plugin.cert_user_id" style="float: right;" @click.prevent="">Edit Plugin</a></div>
			<p>{{ plugin.description }}</p>
			<div><a @click="downloadLatestVersion()">Download Latest</a> <span v-if="default_version_peers">({{ default_version_peers }} peers)</span></div>
			<hr>
			<v-card v-for="version in plugin_versions" :key="version.id" style="padding: 10px; margin-top: 10px;">
				<div>Version {{ version.version }}</div>
				<div><a @click="downloadVersion(version)">Download</a> <span v-if="version.peer">({{ version.peer }} peers)</span></div>
			</v-card>
			<!--<svg width="80" height="80" style="float: left; margin-bottom: 15px;" v-bind:data-jdenticon-value="userInfo.auth_address"></svg>
			<div style="float: right; width: calc(100% - 90px); height: 80px; margin-bottom: 15px;">
				<strong style="font-size: 1.2em;">{{ userInfo.cert_user_id.replace(/@kxoid.bit/, '') }}</strong>
				<p>{{ userInfo.auth_address }}</p>
			</div>
			<div style="clear: both;"></div>
			<hr>
			<div style="display: block; margin-bottom: 10px;"><strong style="font-size: 1.2em;">Zite Search Settings</strong></div>
			<div style="width: 50%; float: left;">
				<v-card v-for="zite in corsZites.slice(0, Math.round(corsZites.length / 2))" :key="zite.address" style="cursor: pointer;">
					<v-card-title primary-title>
						<strong style="color: blue;">{{ zite.searchType }}: {{ zite.title }}</strong>
					</v-card-title>
				</v-card>
			</div>
			<div style="width: 50%; float: right">
				<v-card v-for="zite in corsZites.slice(Math.round(corsZites.length / 2))" :key="zite.address" style="cursor: pointer;">
					<v-card-title primary-title>
						<strong style="color: blue;">{{ zite.searchType }}: {{ zite.title }}</strong>
					</v-card-title>
				</v-card>
			</div>-->
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
				default_version_peers: 0
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

			this.$emit("setcallback", "update", function() {
                /*self.getCorsAndDb("1MiS3ud9JogSQpd1QVmM6ETHRmk5RgJn6E", false, () => {
					self.getCorsAndDb("1SiTEs2D3rCBxeMoLHXei2UYqFcxctdwB", false, () => {
						self.getCorsAndDb("186THqMWuptrZxq1rxzpguAivK3Bs6z84o", false, () => {
							self.getCorsAndDb("1GitLiXB6t5r8vuU2zC6a8GYj9ME6HMQ4t", false, () => {
								self.getCorsAndDb("1PHBjZSAc6mHDMkySJNs3XeSXUL7eY7Q7W", false, () => {
									self.getCorsAndDb("1TaLkFrMwvbNsooF4ioKAY9EuxTBTjipT", true);
								});
							});
						});
					});
				});*/
			});

			/*this.$parent.$on("update", function() {
                //self.getQuestions();
                self.getCorsAndDb("1MiS3ud9JogSQpd1QVmM6ETHRmk5RgJn6E", false, () => {
					self.getCorsAndDb("1SiTEs2D3rCBxeMoLHXei2UYqFcxctdwB", false, () => {
						self.getCorsAndDb("186THqMWuptrZxq1rxzpguAivK3Bs6z84o", false, () => {
							self.getCorsAndDb("1GitLiXB6t5r8vuU2zC6a8GYj9ME6HMQ4t", false, () => {
								self.getCorsAndDb("1PHBjZSAc6mHDMkySJNs3XeSXUL7eY7Q7W", false, () => {
									self.getCorsAndDb("1TaLkFrMwvbNsooF4ioKAY9EuxTBTjipT", true);
								});
							});
						});
					});
				});
			});*/

			/*self.getCorsAndDb("1MiS3ud9JogSQpd1QVmM6ETHRmk5RgJn6E", false, () => {
				self.getCorsAndDb("1SiTEs2D3rCBxeMoLHXei2UYqFcxctdwB", false, () => {
					self.getCorsAndDb("186THqMWuptrZxq1rxzpguAivK3Bs6z84o", false, () => {
						self.getCorsAndDb("1GitLiXB6t5r8vuU2zC6a8GYj9ME6HMQ4t", false, () => {
							self.getCorsAndDb("1PHBjZSAc6mHDMkySJNs3XeSXUL7eY7Q7W", false, () => {
								self.getCorsAndDb("1TaLkFrMwvbNsooF4ioKAY9EuxTBTjipT", true);
							});
						});
					});
				});
			});*/
		},
		computed: {
			isLoggedIn: function() {
				if (this.userInfo == null) return false;
				return this.userInfo.cert_user_id != null;
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
					self.getDefaultVersionPeers();
					self.getVersions(results[0].id, results[0].cert_user_id);
				});
			},
			getVersions: function(plugin_id, plugin_cert_user_id) {
				var self = this;

				var query = `SELECT * FROM plugin_versions LEFT JOIN json USING (json_id) WHERE plugin_id=${plugin_id} AND cert_user_id='${plugin_cert_user_id}' ORDER BY date_added DESC`;

				page.cmd("dbQuery", [query], function(results) {
					console.log(results);
					self.plugin_versions = results;
					self.plugin_versions.forEach(function(version, index) {
						page.cmd("optionalFileInfo", [version.file_download_url], function(info) {
							self.plugin_versions[index]["peer"] = info.peer;
						});
					});
				});
			},
			getDefaultVersionPeers: function() {
				var self = this;

				page.cmd("optionalFileInfo", [self.plugin.file_download_url], function(info) {
					self.default_version_peers = info.peer;
				});
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
				window.location = '/1GTVetvjTEriCMzKzWSP9FahYoMPy6BG1P/' + this.plugin.file_download_url;
			},
			downloadVersion: function(version) {
				window.location = '/1GTVetvjTEriCMzKzWSP9FahYoMPy6BG1P/' + version.file_download_url;
			}
		}
	}
</script>