<template>
	<v-container fluid>
		<v-container style="max-width: 700px;" v-if="userInfo && plugin && isOwner && !loading">
			<div style="display: block; margin-bottom: 10px;"><strong style="font-size: 1.2em;">Upload New Version of '{{ plugin.name }}' Plugin</strong></div>
			<v-card>
				<v-card-text>
					<!--<strong>New Version</strong><br><br>-->

					<input class="file-input" type="file" accept=".zip,application/zip,application/x-zip,application/x-zip-compressed" id="fileUpload"><br>
					<v-text-field name="version"
						label="Version String"
						value=""
						single-line
						v-model="version"
						required
					></v-text-field>
					<v-checkbox name="prerelease" label="Pre-release?" v-model="prerelease"></v-checkbox>
					
					<v-btn color="success" :loading="loading" @click="uploadFile()">Upload</v-btn>
				</v-card-text>
			</v-card>
		</v-container>
		<v-container style="max-width: 700px;" v-if="!userInfo && !loading">
			<p>You must be logged in to upload plugin to plugin store!</p>
		</v-container>
		<v-container style="max-width: 700px;" v-if="!plugin && !loading">
			<p>Plugin does not exist!</p>
		</v-container>
		<v-container style="max-width: 700px;" v-if="!isOwner && !loading">
			<p>You must be the owner of the plugin to upload a new version of it!</p>
		</v-container>
	</v-container>
</template>

<script>
	var Router = require("../libs/router.js");
	var searchDbQuery = require("../libs/search.js");

	module.exports = {
		props: ["userInfo", "langTranslation"],
		name: "uploadpluginversion",
		data: () => {
			return {
				name: "",
				description: "",
				gitcenteraddress: "",
				version: "",
				prerelease: false,
				loading: true
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

			this.loading = true;
			this.getPlugin(Router.currentParams["username"], Router.currentParams["id"]);

			this.$emit("setcallback", "update", function() {
			});
		},
		computed: {
			isLoggedIn: function() {
				if (this.userInfo == null) return false;
				return this.userInfo.cert_user_id != null;
			},
			isOwner: function() {
				if (!this.userInfo || !this.plugin) return false;
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
					this.loading = false;
					//console.log(results);
					self.plugin = results[0];
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
			uploadFile: function() {
				var self = this;

				if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
					alert("The File APIs are not fully supported in this browser.");
					return;
				}

				var that = this;
				var fileUpload = document.getElementById("fileUpload");
				var files = fileUpload.files;

				if (!files) {
					return;
				}

				if (files.length > 0)
					self.loading = true;

				for (let fX in files) {
					let fY = files[fX];

					if (!fY || typeof fY !== "object" || !fY.type.match("\\.zip|(application)\/(zip|x-zip|x-zip-compressed)")) { // |audio|video      || !fY.name.match(/\.IMAGETYPE$/gm)
						//page.cmd("wrapperNotification", ["error", "That file type is not supported."]);
						continue;
					}

					/*let reader = new FileReader();
					reader.onload = function(event) {
							let f_data = btoa(event.target.result);
							let file_type = fY.type;
					*/
					page.uploadBigFile(fY, (output_url) => {
							console.log("Uploaded big file!");
							fileUpload.value = null;
							self.addToDb(output_url);
						});
					//	};
					//reader.readAsBinaryString(fY);
				}
			},
			addToDb: function(output_url) {
				var self = this;

				var data_inner_path = "data/users/" + page.siteInfo.auth_address + "/data.json";
				var content_inner_path = "data/users/" + page.siteInfo.auth_address + "/content.json";
		
				page.cmd("fileGet", { "inner_path": data_inner_path, "required": false }, (data) => {
					if (!data) {
						data = {};
					} else {
						data = JSON.parse(data);
					}

					if (!data["plugins"]) return;
					//if (!data["plugins"]) data["plugins"] = [];
					if (!data["plugin_versions"]) data["plugin_versions"] = [];

					var date_added = Date.now();

					/*data["plugins"].push({
						"id": date_added,
						"name": self.name,
						"description": self.description,
						"gitcenteraddress": self.gitcenteraddress,
						"default_version_id": date_added,
						"date_added": date_added
					});*/

					data["plugin_versions"].push({
						"id": date_added,
						"plugin_id": self.plugin.id,
						"version": self.version,
						"file_download_url": output_url,
						"prerelease": self.prerelease,
						"date_added": date_added
					});

					var json_raw = unescape(encodeURIComponent(JSON.stringify(data, undefined, "\t")));

					page.cmd("fileWrite", [data_inner_path, btoa(json_raw)], (res) => {
						if (res === "ok") {
							self.loading = false;

							page.cmd("siteSign", { "inner_path": content_inner_path }, (res) => {
								if (res === "ok") {
									Router.navigate("plugins");

									page.cmd("sitePublish", { "inner_path": content_inner_path, "sign": false });
								} else {
									page.cmd("wrapperNotification", ["error", "Signing failed!"]);
								}
							});
						} else {
							page.cmd("wrapperNotification", ["error", "File write error: " + JSON.stringify(res)]);
						}
					});
				});
			}
		}
	}
</script>