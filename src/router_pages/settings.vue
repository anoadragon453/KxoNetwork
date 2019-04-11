<template>
	<v-container fluid>
		<v-container style="max-width: 700px;">
			<div style="display: block; margin-bottom: 10px;"><strong style="font-size: 1.2em;">Settings</strong></div>
            
            <div><em>CORS Searching</em></div>
            <p>Select the zite you would like to be able to search from or view users' posts from.</p>

            <v-container grid-list-xl>
                <v-layout row wrap>
                    <v-flex xs12 sm6>
                        <v-card v-for="result in zites.slice(0, Math.round(zites.length / 2.0))" style="padding: 10px; margin-top: 8px; cursor: pointer;  overflow-x: hidden;" @click.native="getCors(result.address)">
                            <div style="text-align: center;"><strong style="color: blue;">{{ result.title }}</strong></div>
							<div v-if="result.enabled" style="text-align: center;"><small>Enabled</small></div>
                        </v-card>
                    </v-flex>
                    <v-flex xs12 sm6>
                        <v-card v-for="result in zites.slice(Math.round(zites.length / 2.0))" style="padding: 10px; margin-top: 8px; cursor: pointer;  overflow-x: hidden;" @click.native="getCors(result.address)">
                            <div style="text-align: center;"><strong style="color: blue;">{{ result.title }}</strong></div>
							<div v-if="result.enabled" style="text-align: center;"><small>Enabled</small></div>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
		</v-container>
	</v-container>
</template>

<script>
	var Router = require("../libs/router.js");
	var searchDbQuery = require("../libs/search.js");

	module.exports = {
		props: ["userInfo", "siteInfo", "langTranslation"],
		name: "settings",
		data: () => {
			return {
                zites: [
					{ title: "Important Zites", address: "1MiS3ud9JogSQpd1QVmM6ETHRmk5RgJn6E", enabled: false },
					{ title: "ZeroSites", address: "1SiTEs2D3rCBxeMoLHXei2UYqFcxctdwB", enabled: false },
                    { title: "ZeroMe", address: "1MeFqFfFFGQfa1J3gJyYYUvb5Lksczq7nH", enabled: false },
					{ title: "ZeroTalk", address: "1TaLkFrMwvbNsooF4ioKAY9EuxTBTjipT", enabled: false },
					{ title: "GitCenter", address: "1GitLiXB6t5r8vuU2zC6a8GYj9ME6HMQ4t", enabled: false },
					{ title: "ZeroExchange", address: "1PHBjZSAc6mHDMkySJNs3XeSXUL7eY7Q7W", enabled: false },
					{ title: "KxoVid", address: "14c5LUN73J7KKMznp9LvZWkxpZFWgE1sDz", enabled: false },
					{ title: "KopyKate Big", address: "18Pfr2oswXvD352BbJvo59gZ3GbdbipSzh", enabled: false },
					{ title: "ZeroUp", address: "1uPLoaDwKzP6MCGoVzw48r4pxawRBdmQc", enabled: false },
                ]
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

			if (this.siteInfo) {
				for (var i in this.siteInfo.settings.permissions) {
					var corsPerm = this.siteInfo.settings.permissions[i];
					var address = corsPerm.replace("Cors:", "");

					for (var i2 in this.zites) {
						var zite = this.zites[i2];

						if (address == zite.address) {
							this.zites[i2].enabled = true;
						}
					}
				}
			}

			this.$emit("setcallback", "update", function(userInfo, siteInfo) {
				if (!siteInfo) return;
				self.siteInfo = siteInfo;
				for (var i in siteInfo.settings.permissions) {
					var corsPerm = siteInfo.settings.permissions[i];
					var address = corsPerm.replace("Cors:", "");

					for (var i2 in self.zites) {
						var zite = self.zites[i2];
						
						if (address == zite.address) {
							self.zites[i2].enabled = true;
						}
					}
				}
			});

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
			getCors: function(address, callback = null) {
				console.log("Test");
                var self = this;
                this.pageNum = 0;
                if(page.siteInfo.settings.permissions.indexOf("Cors:" + address) < 0) {
                    page.cmd("corsPermission", address, function() {
                            if (callback != null) callback();
                        });
                } else {
                    if (callback != null) callback();
                }
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
			}
		}
	}
</script>