<template>
	<v-container fluid>
		<v-container style="max-width: 700px;" v-if="userInfo">
			<svg width="80" height="80" style="float: left; margin-bottom: 15px;" v-bind:data-jdenticon-value="userInfo.auth_address"></svg>
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
			</div>
		</v-container>
	</v-container>
</template>

<script>
	var Router = require("../libs/router.js");
	var searchDbQuery = require("../libs/search.js");

	module.exports = {
		props: ["userInfo", "langTranslation"],
		name: "profile",
		data: () => {
			return {
				corsZites: [
					{ title: "Important Zites", searchType: "Zites", address="1MiS3ud9JogSQpd1QVmM6ETHRmk5RgJn6E" },
				],
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