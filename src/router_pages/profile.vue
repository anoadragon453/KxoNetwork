<template>
	<v-container fluid>
		<v-container style="max-width: 700px;" v-if="auth_address">
			<svg width="80" height="80" style="float: left; margin-bottom: 15px;" v-bind:data-jdenticon-value="auth_address"></svg>
			<div style="float: right; width: calc(100% - 90px); height: 80px; margin-bottom: 15px;">
				<strong style="font-size: 1.2em;">{{ username }}</strong>
				<p>{{ auth_address }}</p>
			</div>
			<div style="clear: both;"></div>

			<div>
				<v-divider></v-divider>
			</div>

			<v-subheader>ZeroMe Posts</v-subheader>
			<div v-for="post in zeroMe">
				{{ post.body }}<br>
			</div>

			<v-subheader>Videos</v-subheader>
			<div v-for="video in kxoVid">
				{{ video.title }}<br>
			</div>
		</v-container>
	</v-container>
</template>

<script>
	var Router = require("../libs/router.js");
	var searchDbQuery = require("../libs/search.js");

	module.exports = {
		props: ["userInfo", "langTranslation", "siteInfo"],
		name: "profile",
		data: () => {
			return {
				username: "",
				auth_address: "",
				zeroMe: [],
				kxoVid: [],
			};
		},
		beforeMount: function() {
			var self = this;
			this.username = "";

			this.getProfile();

			/*this.$parent.$on("setLanguage", function(langTranslation) {
				self.ZiteName = langTranslation["KxoId"];
			});
			this.ZiteName = this.langTranslation["KxoId"];*/

			this.$emit("setcallback", "update", function(userInfo) {
				self.userInfo = userInfo;
                self.getProfile(userInfo);
			});
		},
		mounted: function() {
			var self = this;
		},
		computed: {
			isLoggedIn: function() {
				if (this.userInfo == null) return false;
				return this.userInfo.cert_user_id != null;
			}
		},
		methods: {
			getProfile: function(userInfo = this.userInfo) {
				console.log(Router.currentParams["username"]);
				if (!Router.currentParams["username"] || Router.currentParams["username"] == "") {
					if (userInfo) {
						this.auth_address = userInfo.auth_address;
						this.username = userInfo.cert_user_id.replace("@kxoid.bit", "");
					}

					this.getZeroMePosts();
					this.getKxoVidVideos();
					return;
				}

				this.username = Router.currentParams["username"];

				var self = this;
				var query = `
					SELECT * FROM ids WHERE username="${this.username}"
					UNION SELECT * FROM bots WHERE username="${this.username}"
					LIMIT 1`;
				page.cmd("dbQuery", [query], (results) => {
					console.log(results);
					self.auth_address = results[0].address;

					self.getZeroMePosts();
					self.getKxoVidVideos();
				});
			},
			getZeroMePosts: function() {
				if (this.isEnabled("1MeFqFfFFGQfa1J3gJyYYUvb5Lksczq7nH")) {
					var self = this;
					var query = `SELECT *
						FROM post
						LEFT JOIN json USING (json_id)
						WHERE REPLACE(json.directory, 'data/users/', '')='${self.auth_address}'
						ORDER BY date_added DESC`;

					page.cmd("as", ["1MeFqFfFFGQfa1J3gJyYYUvb5Lksczq7nH", "dbQuery", [query]], function(results) {
						self.zeroMe = results;
						console.log(results);
					});
				}
			},
			getKxoVidVideos: function() {
				if (this.isEnabled("14c5LUN73J7KKMznp9LvZWkxpZFWgE1sDz")) {
					var self = this;
					var query = `SELECT *
						FROM videos
						LEFT JOIN json USING (json_id)
						WHERE REPLACE(json.directory, 'data/users/', '')='${self.auth_address}'
						ORDER BY date_added DESC`;

						console.log(query);

					page.cmd("as", ["14c5LUN73J7KKMznp9LvZWkxpZFWgE1sDz", "dbQuery", [query]], function(results) {
						self.kxoVid = results;
						console.log(results);
					});
				}
			},
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
			// Returns whether CORS permission enabled for given zite address
			isEnabled: function(address) {
				if (!this.siteInfo) {
					console.log("Error: Cannot determine if " + address + " is enabled.");
					return false;
				}

				for (var i in this.siteInfo.settings.permissions) {
					var corsPerm = this.siteInfo.settings.permissions[i];
					var zite_address = corsPerm.replace("Cors:", "");

					if (zite_address == address) {
						console.log(address + " is Enabled!");
						return true;
					}
				}

				console.log(address + " is not Enabled!");

				return false;
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