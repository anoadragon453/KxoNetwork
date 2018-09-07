<template>
	<v-container fluid>
		<v-container style="max-width: 700px;" v-if="userInfo">
			<div style="display: block; margin-bottom: 10px;"><strong style="font-size: 1.2em;">Upload Plugin to Plugin Store</strong></div>
			<v-card>
				<v-card-text>
					<v-text-field
						name="name"
						label="Plugin Name"
						value=""
						single-line
						v-model="name"
						required
					></v-text-field>
					<v-text-field
						name="description"
						label="Description"
						value=""
						multi-line
						v-model="description"
						required
					></v-text-field>
					<v-text-field
						name="gitcenteraddress"
						label="GitCenter Address"
						value=""
						single-line
						v-model="gitcenteraddress"
						required
					></v-text-field>

					<input class="file-input" type="file" accept=".zip,application/zip,application/x-zip,application/x-zip-compressed" id="fileUpload" v-on:change="uploadFile()">
					
					<v-btn color="success" :loading="loading" @click="upload()">Upload</v-btn>
				</v-card-text>
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
		<v-container style="max-width: 700px;" v-else>
			<p>You must be logged in to upload plugin to plugin store!</p>
		</v-container>
	</v-container>
</template>

<script>
	var Router = require("../libs/router.js");
	var searchDbQuery = require("../libs/search.js");

	module.exports = {
		props: ["userInfo", "langTranslation"],
		name: "uploadplugin",
		data: () => {
			return {
				name: "",
				description: "",
				gitcenteraddress: "",
				loading: false
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

				for (let fX in files) {
					let fY = files[fX];

					if (!fY || typeof fY !== "object" || !fY.type.match("\\.zip|(application)\/(zip|x-zip|x-zip-compressed)")) { // |audio|video      || !fY.name.match(/\.IMAGETYPE$/gm)
						//page.cmd("wrapperNotification", ["error", "That file type is not supported."]);
						continue;
					}

					let reader = new FileReader();
					reader.onload = function(event) {
							let f_data = btoa(event.target.result);
							let file_type = fY.type;

							page.uploadBigFile(fY, (output_url) => {
									console.log("Uploaded big file!");
									fileUpload.value = null;
									self.addToDb(output_url);
								});
						};
					reader.readAsBinaryString(fY);
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

					if (!data["plugins"]) data["plugins"] = [];

					var date_added = Date.now();

					data["plugins"].push({
						"id": date_added,
						"name": self.name,
						"description": self.description,
						"gitcenteraddress": self.gitcenteraddress,
						"file_download_url": output_url,
						"date_added": date_added
					});

					var json_raw = unescape(encodeURIComponent(JSON.stringify(data, undefined, "\t")));

					page.cmd("fileWrite", [data_inner_path, btoa(json_raw)], (res) => {
						if (res === "ok") {
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