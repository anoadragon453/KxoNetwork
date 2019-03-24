<template>
	<v-container fluid>
		<v-container style="max-width: 700px;">
			<div style="display: block; margin-bottom: 10px;"><strong style="font-size: 1.2em;">Plugins Store</strong><a v-if="userInfo" style="float: right;" @click.prevent="goto('plugins/upload')">Upload Plugin</a></div>
			<v-container grid-list-xl>
				<v-layout row wrap>
					<v-flex xs12 sm6>
						<v-card v-for="plugin in plugins.slice(0, Math.round(plugins.length / 2))" :key="plugin.id" style="padding: 10px; margin-top: 8px;">
							<strong style="color: blue; cursor: pointer;" @click="goto('plugin/' + plugin.cert_user_id.replace(/@kxoid.bit/, '') + '/' + plugin.id)">{{ plugin.name }}</strong>
							<div>{{ plugin.description }}</div>
							<div><a @click="downloadPlugin(plugin)">Download Latest</a></div>
						</v-card>
					</v-flex>
					<v-flex xs12 sm6>
						<v-card v-for="plugin in plugins.slice(Math.round(plugins.length / 2))" :key="plugin.id" style="padding: 10px; margin-top: 8px;">
							<strong style="color: blue; cursor: pointer;" @click="goto('plugin/' + plugin.cert_user_id.replace(/@kxoid.bit/, '') + '/' + plugin.id)">{{ plugin.name }}</strong>
							<div>{{ plugin.description }}</div>
							<div><a @click="downloadPlugin(plugin)">Download Latest</a></div>
						</v-card>
					</v-flex>
				</v-layout>
			</v-container>
			<div style="margin-top: 10px;">
				<v-divider style="margin-bottom: 10px;"></v-divider>
				<strong>How to Install ZeroNet Plugins?</strong>
				<p>
					<ol>
						<li>Download the zip file.</li>
						<li>Unzip the folder contained in the zip file.</li>
						<li>Move the folder into the <code>ZeroNetRoot\core\plugins</code> directory.</li>
						<li>If the plugin folder starts with <code>Plugin-</code> or ends with <code>-master</code>, then it's likely
						you should rename the folder to remove those.</li>
						<li>Restart ZeroNet</li>
					</ol>
				</p>
			</div>
		</v-container>
	</v-container>
</template>

<script>
	var Router = require("../libs/router.js");
	var searchDbQuery = require("../libs/search.js");

	module.exports = {
		props: ["userInfo", "langTranslation"],
		name: "plugins",
		data: () => {
			return {
				plugins: []
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

			this.getPlugins();

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
			getPlugins: function() {
				var self = this;

				var query = `SELECT * FROM plugins LEFT JOIN json USING (json_id) LEFT JOIN plugin_versions ON plugins.default_version_id = plugin_versions.id`;

				page.cmd("dbQuery", [query], function(results) {
					self.plugins = results;
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
			downloadPlugin: function(plugin) {
				window.location = '/1GTVetvjTEriCMzKzWSP9FahYoMPy6BG1P/' + plugin.file_download_url;
			}
		}
	}
</script>