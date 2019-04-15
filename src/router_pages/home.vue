<template>
	<v-container fluid>
		<v-container v-if="!isLoggedIn" style="padding-top: 7px; padding-bottom: 7px; max-width: 900px;">
			<v-card color="blue" tile style="margin: 0;">
				<v-card-text style="text-align: center;">
					<a href="#" @click.prevent="goto('create-id')" style="color: black;">Create a KxoId</a> to get the full experience of the KxoNetwork!
				</v-card-text>
			</v-card>
		</v-container>
		<v-container style="max-width: 900px;"> <!-- Search -->
			<div style="text-align: center;">
				<small><strong>Note:</strong> You can enable more zites to search by going to the <a href="./?/settings" v-on:click.prevent="goto('settings')">Settings</a> page.</small>
			</div>
			<v-card style="padding-left: 10px; padding-right: 10px; padding-top: 10px;">
				<v-toolbar color="white" dense prominent extended flat>
					<v-text-field prepend-icon="search" hide-details single-line clearable v-bind:placeholder="'Search ' + currentTab" style="margin-right: 5px; margin-left: 3px;" v-model="searchQuery" @keyup.enter="getResults()" @blur="getResults()"></v-text-field>
					<v-tabs slot="extension" centered v-model="active" v-bind="active">
						<v-tab key="zites" @click="changeTab('zites')">Zites</v-tab>
						<v-tab key="kxoids" @click="changeTab('kxoids')">KxoIds</v-tab>
						<!--<v-tab key="audio" @click="changeTab('audio')">Audio</v-tab>-->
						<v-tab key="video" @click="changeTab('video')">Video</v-tab>
						<!--<v-tab key="posts">Posts</v-tab>-->
						<v-tab key="files" @click="changeTab('files')">Files</v-tab>
					</v-tabs>
				</v-toolbar>
			</v-card>

			<v-container grid-list-xl>
				<!-- Zites -->
				<v-layout row wrap v-if="currentTab == 'zites' && searchQuery != '' && results && results.length > 0">
					<v-flex xs12 style="padding: 0;"><div style="margin-left: 15px; margin-right: 15px;">Time: {{ searchTime / 1000.0 }} seconds</div></v-flex>

					<v-flex xs12 sm6>
						<v-card v-for="result in results.slice(0, Math.round(results.length / 2.0))" style="padding: 10px; margin-top: 8px; cursor: pointer; overflow-x: hidden;" @mousedown.middle="gotoLinkNewTab('/' + (result.address || getLinkFromBody(result)))" @click.native="gotoLink('/' + (result.address || getLinkFromBody(result)))">
							<div style="text-align: center;"><strong style="color: blue;">{{ result.title }}</strong></div>
							<div style="text-align: center;"><small>{{ (result.zite == "ZeroTalk" ? "ZeroTalk: " : "") + (result.address || getLinkFromBody(result)) }}</small></div>
						</v-card>
					</v-flex>
					<v-flex xs12 sm6>
						<v-card v-for="result in results.slice(Math.round(results.length / 2.0))" style="padding: 10px; margin-top: 8px; cursor: pointer; overflow-x: hidden;" @mousedown.middle="gotoLinkNewTab('/' + (result.address || getLinkFromBody(result)))" @click.native="gotoLink('/' + (result.address || getLinkFromBody(result)))">
							<div style="text-align: center;"><strong style="color: blue;">{{ result.title }}</strong></div>
							<div style="text-align: center;"><small>{{ (result.zite == "ZeroTalk" ? "ZeroTalk: " : "") + (result.address || getLinkFromBody(result)) }}</small></div>
						</v-card>
					</v-flex>
					
					<v-flex xs12 v-if="gitCenterResults.length > 0">
						<v-card v-for="result in gitCenterResults" style="padding: 10px; margin-top: 8px; cursor: pointer; overflow-x: hidden;" @mousedown.middle="gotoLinkNewTab('/' + (result.address || '#'))" @click.native="gotoLink('/' + result.address || '#')">
							<div style="text-align: center;"><strong style="color: blue;">Git Center: {{ result.title }}</strong></div>
							<div style="margin-bottom: 5px; text-align: center;">{{ result.description.slice(0, 150) }}</div>
							<div style="text-align: center;"><small>{{ result.address }}</small></div>
						</v-card>
					</v-flex>
					<v-flex xs12 v-if="zeroExchangeResults.length > 0">
						<v-card v-for="result in zeroExchangeResults" style="padding: 10px; margin-top: 8px; cursor: pointer; overflow-x: hidden;" @mousedown.middle="gotoLinkNewTab('/ZeroExchange.bit/?/' + result.site + '/' + result.directory.replace(/data\/users\//, '') + '/' + result.date_added || '#')" @click.native="gotoLink('/ZeroExchange.bit/?/' + result.site + '/' + result.directory.replace(/data\/users\//, '') + '/' + result.date_added || '#')">
							<div style="text-align: center;"><strong style="color: blue;">ZeroExchange: {{ result.title }}</strong></div>
							<div style="margin-bottom: 5px; text-align: center;">{{ result.body.slice(0, 150) }}</div>
						</v-card>
					</v-flex>
				</v-layout>

				<!-- Featured Zites -->
				<v-layout row wrap v-if="currentTab == 'zites' && (searchQuery == '' || !results || results.length == 0)">
					<v-flex xs12 style="padding: 0;"><div style="margin-left: 15px; margin-right: 15px;">Featured Zites</div></v-flex>

					<v-flex xs12 sm6>
						<v-card v-for="result in featured.slice(0, Math.round(featured.length / 2.0))" style="padding: 10px; margin-top: 8px; cursor: pointer;  overflow-x: hidden;" @mousedown.middle="gotoLinkNewTab('/' + (result.address || getLinkFromBody(result)))" @click.native="gotoLink('/' + (result.address || getLinkFromBody(result)))">
							<div style="text-align: center;"><strong style="color: blue;">{{ result.title }}</strong></div>
							<div style="text-align: center;"><small>{{ (result.address || getLinkFromBody(result)) }}</small></div>
						</v-card>
					</v-flex>
					<v-flex xs12 sm6>
						<v-card v-for="result in featured.slice(Math.round(featured.length / 2.0))" style="padding: 10px; 10px; margin-top: 8px; cursor: pointer;  overflow-x: hidden;" @mousedown.middle="gotoLinkNewTab('/' + (result.address || getLinkFromBody(result)))" @click.native="gotoLink('/' + (result.address || getLinkFromBody(result)))">
							<div style="text-align: center;"><strong style="color: blue;">{{ result.title }}</strong></div>
							<div style="text-align: center;"><small>{{ (result.address || getLinkFromBody(result)) }}</small></div>
						</v-card>
					</v-flex>
				</v-layout>

				<!-- KxoIds -->
				<v-layout row wrap v-if="currentTab == 'kxoids'">
					<v-flex xs12 sm6>
						<v-card v-for="result in results.slice(0, Math.round(results.length / 2.0))" style="padding: 10px; margin-top: 8px; cursor: pointer; overflow-x: hidden;" @mousedown.middle="gotoLinkNewTab('./?/profile' + result.username)" @click.native="goto('profile/' + result.username)">
							<svg style="float: left;" width="45" height="45" v-bind:data-jdenticon-value="result.address"></svg>
							<div style="float: right; width: calc(100% - 50px);">
								<div><strong style="color: blue;">{{ result.username }}</strong></div>
								<div><small>{{ result.type == "bot" ? "Bot: " : "" }}{{ result.address }}</small></div>
							</div>
							<div style="clear: both;"></div>
						</v-card>
					</v-flex>
					<v-flex xs12 sm6>
						<v-card v-for="result in results.slice(Math.round(results.length / 2.0))" style="padding: 10px; margin-top: 8px; cursor: pointer; overflow-x: hidden;" @mousedown.middle="gotoLinkNewTab('./?/profile' + result.username)" @click.native="goto('profile/' + result.username)">
							<svg style="float: left;" width="45" height="45" v-bind:data-jdenticon-value="result.address"></svg>
							<div style="float: right; width: calc(100% - 50px);">
								<div><strong style="color: blue;">{{ result.username }}</strong></div>
								<div><small>{{ result.type == "bot" ? "Bot: " : "" }}{{ result.address }}</small></div>
							</div>
							<div style="clear: both;"></div>
						</v-card>
					</v-flex>
				</v-layout>

				<!-- Videos -->
				<v-layout row wrap v-if="currentTab == 'video'">
					<v-flex xs12 style="padding: 0;"><div style="margin-left: 15px; margin-right: 15px;">Time: {{ searchTime / 1000.0 }} seconds</div></v-flex>

					<v-flex xs12 sm6>
						<v-card v-for="result in results.slice(0, Math.round(results.length / 2.0))" style="padding: 10px; margin-top: 8px; cursor: pointer; overflow-x: hidden;" @mousedown.middle="gotoLinkNewTab('/' + (result.address || getLinkFromBody(result)))" @click.native="gotoLink('/' + (result.address || getLinkFromBody(result)))">
							<div style="text-align: center;"><strong style="color: blue;">{{ result.title }}</strong></div>
							<div style="text-align: center;"><small>{{ result.zite }}</small></div>
							<!--<div style="text-align: center;"><small>{{ (result.zite == "KxoVid" ? "KxoVid: " : "") + (result.address || getLinkFromBody(result)) }}</small></div>-->
						</v-card>
					</v-flex>
					<v-flex xs12 sm6>
						<v-card v-for="result in results.slice(Math.round(results.length / 2.0))" style="padding: 10px; margin-top: 8px; cursor: pointer; overflow-x: hidden;" @mousedown.middle="gotoLinkNewTab('/' + (result.address || getLinkFromBody(result)))" @click.native="gotoLink('/' + (result.address || getLinkFromBody(result)))">
							<div style="text-align: center;"><strong style="color: blue;">{{ result.title }}</strong></div>
							<div style="text-align: center;"><small>{{ result.zite }}</small></div>
							<!--<div style="text-align: center;"><small>{{ (result.zite == "KxoVid" ? "KxoVid: " : "") + (result.address || getLinkFromBody(result)) }}</small></div>-->
						</v-card>
					</v-flex>
				</v-layout>

				<!-- Files -->
				<v-layout row wrap v-if="currentTab == 'files'">
					<v-flex xs12 style="padding: 0;"><div style="margin-left: 15px; margin-right: 15px;">Time: {{ searchTime / 1000.0 }} seconds</div></v-flex>

					<v-flex xs12 sm6>
						<v-card v-for="result in results.slice(0, Math.round(results.length / 2.0))" style="padding: 10px; margin-top: 8px; cursor: pointer; overflow-x: hidden;" @mousedown.middle="gotoLinkNewTab('/' + (result.address || getLinkFromBody(result)))" @click.native="gotoLink('/' + (result.address || getLinkFromBody(result)))">
							<div style="text-align: center;"><strong style="color: blue;">{{ result.title }}</strong></div>
							<div style="text-align: center;"><small>{{ result.zite }}</small></div>
							<!--<v-btn @click.prevent="pinFile(result.zite, result.address)"></v-btn>-->
							<!--<div style="text-align: center;"><small>{{ (result.zite == "KxoVid" ? "KxoVid: " : "") + (result.address || getLinkFromBody(result)) }}</small></div>-->
						</v-card>
					</v-flex>
					<v-flex xs12 sm6>
						<v-card v-for="result in results.slice(Math.round(results.length / 2.0))" style="padding: 10px; margin-top: 8px; cursor: pointer; overflow-x: hidden;" @mousedown.middle="gotoLinkNewTab('/' + (result.address || getLinkFromBody(result)))" @click.native="gotoLink('/' + (result.address || getLinkFromBody(result)))">
							<div style="text-align: center;"><strong style="color: blue;">{{ result.title }}</strong></div>
							<div style="text-align: center;"><small>{{ result.zite }}</small></div>
							<!--<div style="text-align: center;"><small>{{ (result.zite == "KxoVid" ? "KxoVid: " : "") + (result.address || getLinkFromBody(result)) }}</small></div>-->
						</v-card>
					</v-flex>
				</v-layout>

			</v-container>

			<div v-if="(currentTab == 'zites' && searchQuery != '' && results && (results.length > 0 || pageNum > 0)) || currentTab != 'zites'">
				<v-btn style="float: left;" @click="prevPage()">&lt;</v-btn>
				<v-btn style="float: right;" @click="nextPage()">&gt;</v-btn>
				<div style="text-align: center; margin-top: 16px;"> page {{ pageNum + 1 }} </div>
				<div style="clear: both;"></div>
			</div>
		</v-container>
	</v-container>
</template>

<script>
	var Router = require("../libs/router.js");
	var searchDbQuery = require("../libs/search.js");

	module.exports = {
		props: ["siteInfo", "userInfo", "langTranslation"],
		name: "home",
		data: () => {
			return {
				active: "",
				currentTab: "zites",
				prevResults: [],
				results: [],
				nextResults: [],
				gitCenterResults: [],
				zeroExchangeResults: [],
				searchQuery: "",
				previousSearchQuery: null,
				pageNum: 0,
				limit: 4,
				searchTime: 0, // In miliseconds
				totalResults: 4,
				currentResults: 0,
				featured: [
					{ title: "0Play Game Center", address: "1Ag6xidDHiPgWoDKhfSx4xFQr6WC3NqxZg" },
					{ title: "KxoQA", address: "1PHBjZSAc6mHDMkySJNs3XeSXUL7eY7Q7W" },
					{ title: "Git Center", address: "1GitLiXB6t5r8vuU2zC6a8GYj9ME6HMQ4t" },
					{ title: "Horizon", address: "1HoRiznsHbJAqs2bmrVcSd79NTGVFp4Ju2" },
					{ title: "ZPlace", address: "1D6f2CvDRhPeEeBAcmqGt3X9z2CkLpmv2V" },
					{ title: "ThunderWave", address: "thunderwave.bit" },
					{ title: "Kiwipedia", address: "1KiwiBCVBUcuypVm8FEmUW9YT6fJDXkN9r" },
					{ title: "NullPaste", address: "1MgHVPCE1ve6QfKrgsqCURzRj72HrRWioz" },
					{ title: "Sakana", address: "sakana.bit" },
					{ title: "ZeroMedium", address: "ZeroMedium.bit" },
					{ title: "Nopelist", address: "Styromaniac.blocklist.bit" },
					{ title: "CodeR", address: "1CodEr7T9xNXSPcwbsvf5fHTqsixDMwDzL" }
				]
			};
		},
		beforeMount: function() {
			var self = this;
			/*this.$parent.$on("setLanguage", function(langTranslation) {
				self.ZiteName = langTranslation["KxoId"];
			});
			this.ZiteName = this.langTranslation["KxoId"];*/

			if (Router.currentParams["searchQuery"]) {
				this.searchQuery = Router.currentParams["searchQuery"].replace("%20", " ");
				this.getResults();
			}
			if (Router.currentParams["tab"]) {
				this.currentTab = Router.currentParams["tab"];
				//this.active = Router.currentParams["tab"];
				this.changeTab(Router.currentParams["tab"]);
			}
		},
		mounted: function() {
			var self = this;
			if (!this.userInfo) {
				/*this.$parent.on('setUserInfo', function() {
					// TODO
				});*/
			}

			console.log(self.userInfo);

			this.$emit("setcallback", "update", function() {
                self.getCorsAndDb("1MiS3ud9JogSQpd1QVmM6ETHRmk5RgJn6E", true, () => {
					/*self.getCorsAndDb("1SiTEs2D3rCBxeMoLHXei2UYqFcxctdwB", false, () => {
						self.getCorsAndDb("186THqMWuptrZxq1rxzpguAivK3Bs6z84o", false, () => {
							self.getCorsAndDb("1GitLiXB6t5r8vuU2zC6a8GYj9ME6HMQ4t", false, () => {
								self.getCorsAndDb("1PHBjZSAc6mHDMkySJNs3XeSXUL7eY7Q7W", false, () => {
									self.getCorsAndDb("1TaLkFrMwvbNsooF4ioKAY9EuxTBTjipT", true);
								});
							});
						});
					});*/
				});
			});

			this.$parent.$on("update", function() {
                //self.getQuestions();
                self.getCorsAndDb("1MiS3ud9JogSQpd1QVmM6ETHRmk5RgJn6E", true, () => {
					/*self.getCorsAndDb("1SiTEs2D3rCBxeMoLHXei2UYqFcxctdwB", false, () => {
						self.getCorsAndDb("186THqMWuptrZxq1rxzpguAivK3Bs6z84o", false, () => {
							self.getCorsAndDb("1GitLiXB6t5r8vuU2zC6a8GYj9ME6HMQ4t", false, () => {
								self.getCorsAndDb("1PHBjZSAc6mHDMkySJNs3XeSXUL7eY7Q7W", false, () => {
									self.getCorsAndDb("1TaLkFrMwvbNsooF4ioKAY9EuxTBTjipT", true);
								});
							});
						});
					});*/
				});
			});

			self.getCorsAndDb("1MiS3ud9JogSQpd1QVmM6ETHRmk5RgJn6E", true, () => {
				/*self.getCorsAndDb("1SiTEs2D3rCBxeMoLHXei2UYqFcxctdwB", false, () => {
					self.getCorsAndDb("186THqMWuptrZxq1rxzpguAivK3Bs6z84o", false, () => {
						self.getCorsAndDb("1GitLiXB6t5r8vuU2zC6a8GYj9ME6HMQ4t", false, () => {
							self.getCorsAndDb("1PHBjZSAc6mHDMkySJNs3XeSXUL7eY7Q7W", false, () => {
								self.getCorsAndDb("1TaLkFrMwvbNsooF4ioKAY9EuxTBTjipT", true);
							});
						});
					});
				});*/
			});
			// 1MiS3ud9JogSQpd1QVmM6ETHRmk5RgJn6E
		},
		computed: {
			isLoggedIn: function() {
				if (this.userInfo == null) return false;
				return this.userInfo.cert_user_id != null;
			}
		},
		methods: {
			getCorsAndDb: function(address, doGetResults = false, callback = null) {
				if (!page.siteInfo) return;

                var self = this;
                this.pageNum = 0;
                if (page.siteInfo.settings.permissions.indexOf("Cors:" + address) < 0) {
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
            getResults: function(pageChange = false, next = false, previous = false) {
				if (this.currentTab == "zites" && (!this.searchQuery || this.searchQuery == null || this.searchQuery == "")) {
					this.results = [];
					this.pageNum = 0;
					this.subPageNum = 0;
					this.searchTime = 0;
					this.gitCenterResults = [];
					this.zeroExchangeResults = [];
					this.currentQueries = 0;
					page.cmd("wrapperPushState", [{ "route": "/search/" + this.currentTab }, "/search/" + this.currentTab, "/search/" + this.currentTab]);
					return;
				}
            	if (!pageChange && this.previousSearchQuery == this.searchQuery) return;

				page.cmd("wrapperPushState", [{ "route": "/search/" + this.currentTab + "/" + this.searchQuery }, "/search/" + this.currentTab + "/" + this.searchQuery, "/search/" + this.currentTab + "/" + this.searchQuery]);

            	var setNextResults = false;
            	//var setPrevResults = false;

            	this.previousSearchQuery = this.searchQuery;
            	this.currentQueries = 0;
            	this.results = [];
            	this.gitCenterResults = [];
            	this.zeroExchangeResults = [];
            	this.searchTime = 0;
            	var startTime = new Date();

            	var subPageNum = 0;
            	var pageNum = this.pageNum;
            	
            	if (pageChange && next && this.nextResults.length > 0) {
        			this.prevResults = this.results.slice(0);
            		this.results = this.nextResults.slice(0);
            		this.nextResults = [];
            		setNextResults = true;
            		this.searchTime = Math.abs(new Date() - startTime);
            		pageNum++;
	            } else if (pageChange && previous && this.prevResults.length > 0) {
					this.nextResults = this.results.slice(0);
            		this.results = this.prevResults.slice(0);
            		this.prevResults = [];
            		//this.nextResults = []; // TODO
            		//setNextResults = true;
            		this.searchTime = Math.abs(new Date() - startTime);
            		//pageNum++;
            		return;
            	} else if (!pageChange) {
            		this.nextResults = [];
            		this.prevResults = [];
            		setNextResults = false;
            		//setPrevResults = false;
            		this.pageNum = 0;
            		pageNum = 0;
            	}

            	/*if (pageNum % 2 == 1) {
            		subPageNum = 1;
            		pageNum--;
            	}*/

            	console.log(pageNum);
            	var self = this;

            	if (this.currentTab == "kxoids") {
					this.getKxoIdResults(pageNum, subPageNum, setNextResults);
            		return;
            	} else if (this.currentTab == "zites") {
					this.getZiteResults(pageNum, subPageNum, setNextResults);
					return;
				} else if (this.currentTab == "video") {
					this.getVideoResults(pageNum, subPageNum, setNextResults);
					return;
				} else if (this.currentTab == "files") {
					this.getFileResults(pageNum, subPageNum, setNextResults);
					return;
				}
			},
            doSearchQuery: function(ziteName, address, searchSelects, query, setNextResults, subPageNum, f = null) {
            	var self = this;
				var startTime = new Date();
				var startTab = this.currentTab;

            	var addResults = async (results) => {
					if (f != null && typeof f === "function") results = await f(results);

					//console.log(results);
            		self.currentResults++;
					// Add stuff to each result, including zite name and scoreNum
					for (var i = 0; i < results.length; i++) {
						results[i].zite = ziteName;

						/*var scoreNum = 0;
						var keys = Object.keys(results[i]);
						for (var j = 0; j < keys.length; j++) {
							if (keys[j].includes("match")) {
								for (var k = 0; k < searchSelects.length; k++) {
									if (keys[j].startsWith(searchSelects[k].col)) {
										scoreNum += results[i][keys[j]] * searchSelects[k].score;
									}
								}
							}
						}

						results[i].scoreNum = scoreNum;*/

						if (ziteName == "ZeroTalk") {
							//console.log(results[i]);
							results[i].address = address + "/?Topic:" + results[i].row_topic_uri;
						} else if (ziteName == "ZeroUp") {
							results[i].address = "1uPLoaDwKzP6MCGoVzw48r4pxawRBdmQc/data/users/" + results[i].directory + "/" + results[i].file_name;
						} else if (ziteName == "KxoVid") {
							results[i].address = "14c5LUN73J7KKMznp9LvZWkxpZFWgE1sDz/?/channel/" + results[i].directory.replace(/data\/users\//ig, "") + "/" + results[i].ref_channel_id + "/v/" + results[i].video_id;
						} else if (ziteName == "KopyKate Big") {
							results[i].address = "18Pfr2oswXvD352BbJvo59gZ3GbdbipSzh/?Video=" + results[i].date_added + "_" + results[i].directory.replace(/data\/users\//ig, "");
						}

						if (results[i].address && results[i].address.startsWith('/')) {
							results[i].address = results[i].substring(1);
						}

						results[i].zite = ziteName;

						/*if (results[i].address) {
							results[i].address = results[i].address.replace(/)
						}*/
						/*results[i].address = "";
						if (ziteName == "KxoNetwork")
							results[i].address = results[i].address;
						*/
					}

					//var totalResults = self.results.slice();
					//var totalNextResults = self.nextResults.slice();
					//var totalPrevResults = self.prevResults.slice();

					//if (subPageNum == 0) {
						if (!setNextResults){
							//totalResults = totalResults.concat(results);
							if (self.currentTab == startTab)
								self.results = self.results.concat(results);
							//totalResults = totalResults.concat(results.slice(0, self.limit / 2));
							//totalNextResults = totalNextResults.concat(results.slice(self.limit / 2));
						}
						//else if (setNextResults) totalNextResults = totalNextResults.concat(results.slice(0, self.limit / 2));
					/*}
					else {
						if (!setNextResults) {
							totalResults = totalResults.concat(results.slice(self.limit / 2));
							//totalPrevResults = totalPrevResults.concat(results.slice(0, self.limit / 2));
						}
						else if (setNextResults) totalNextResults = totalNextResults.concat(results.slice(self.limit / 2));
					}*/

					// Remove duplicates
					//var hashtable = {};
					//var totalResults2 = [];
					//var totalNextResults2 = [];
					//var totalPrevResults2 = [];
					/*for (var i = 0; i < totalResults.length; i++) {
						if (!hashtable[totalResults[i].address]) {
							totalResults2.push(totalResults[i]);
							hashtable[totalResults[i].address] = 1;
						}
					}*/
					//totalResults2 = totalResults;
					/*for (var i = 0; i < totalPrevResults.length; i++) {
						if (!hashtable[totalPrevResults[i].address]) {
							totalPrevResults2.push(totalPrevResults[i]);
							hashtable[totalPrevResults[i].address] = 1;
						}
					}
					for (var i = 0; i < totalNextResults.length; i++) {
						if (!hashtable[totalNextResults[i].address]) {
							totalNextResults2.push(totalNextResults[i]);
							hashtable[totalNextResults[i].address] = 1;
						}
					}*/

					//totalResults = totalResults2;
					//totalNextResults = totalNextResults2;
					//totalPrevResults = totalPrevResults2;

					// Resort
					//if (self.currentResults == self.totalResults) {
						//self.results = totalResults;
						/*self.results = totalResults.sort((a, b) => {
							return a.sortNum < b.sortNum;
						});*/
						/*self.nextResults = totalNextResults.sort((a, b) => {
							return a.sortNum < b.sortNum;
						});
						self.prevResults = totalPrevResults.sort((a, b) => {
							return a.sortNum < b.sortNum;
						});*/
					//}

					if (!setNextResults) {
						if (self.searchTime == 0) {
							var date = new Date();
							self.searchTime = Math.abs(date - startTime);
						} else {
							var date = new Date();
							self.searchTime += Math.abs(date - startTime);
						}
					}
            	};

            	if (address != "self") {
					page.cmdp("as", [address, "dbQuery", [query]]).then(addResults);
				} else {
					page.cmdp("dbQuery", [query], addResults).then(addResults);
				}
			},
			getZiteResults: function(pageNum, subPageNum, setNextResults) {
				var searchSelects_KxoZites = [
					{ col: "title", score: 5 },
					{ col: "domain", score: 5 },
					{ col: "address", score: 5 },
					{ col: "tags", score: 4 },
					{ col: "category_slug", score: 4 },
					{ col: "merger_category", score: 4 },
					{ col: "creator", score: 3 },
					{ col: "description", score: 2 },
					//{ skip: !app.userInfo || !app.userInfo.auth_address, col: "bookmarkCount", select: this.subQueryBookmarks(), inSearchMatchesAdded: false, inSearchMatchesOrderBy: true, score: 6 } // TODO: Rename inSearchMatchesAdded, and isSearchMatchesOrderBy
				];

				var query = searchDbQuery(this, this.searchQuery || "", {
					orderByScore: true,
					id_col: "id",
					select: "*",
					searchSelects: searchSelects_KxoZites,
					table: "zites",
					join: "INNER JOIN json USING (json_id)",
					//where: languageWhere,
					page: pageNum,
					afterOrderBy: "date_added ASC",
					limit: this.limit
				});
				this.doSearchQuery("KxoNetwork", "1MiS3ud9JogSQpd1QVmM6ETHRmk5RgJn6E", searchSelects_KxoZites, query, setNextResults, subPageNum);

				var searchSelects_ZeroSites = [
					{ col: "title", score: 5 },
                    { col: "address", score: 5 },
                    { col: "tags", score: 4 },
                    { col: "cert_user_id", score: 4, usingJson: true },
                    { col: "category", score: 4 },
                    { col: "language", score: 3 },
                    { col: "description", score: 2 }
                    //{ col: "directory", score: 2, usingJson: true },
                    //{ col: "date_added", score: 1 }
				];

				// ZeroSites
				if (this.isEnabled("1SiTEs2D3rCBxeMoLHXei2UYqFcxctdwB")) {
					query = searchDbQuery(this, this.searchQuery || "", {
						orderByScore: true,
						id_col: "site_id",
						select: "*",
						searchSelects: searchSelects_ZeroSites,
						table: "site",
						join: "INNER JOIN json USING (json_id)",
						//where: languageWhere,
						page: pageNum,
						afterOrderBy: "date_added DESC",
						limit: this.limit
					});
					this.doSearchQuery("ZeroSites", "1SiTEs2D3rCBxeMoLHXei2UYqFcxctdwB", searchSelects_ZeroSites, query, setNextResults, subPageNum);
				}

				var searchSelects_0List = [
					{ col: "title", score: 5 },
                    { col: "body", score: 4 },
                    //{ col: "cert_user_id", score: 3, usingJson: true }, // 0list puts this in keyvalue instead of json table for some reason
                    //{ col: "directory", score: 2, usingJson: true },
                    { col: "added", score: 1 }
				];

				/*query = searchDbQuery(this, this.searchQuery || "", {
					orderByScore: true,
					id_col: "topic_id",
					select: "*",
					searchSelects: searchSelects_0List,
					table: "topic",
					join: "LEFT JOIN json USING (json_id)",
					//where: languageWhere,
					page: pageNum,
					afterOrderBy: "added DESC",
					limit: this.limit
				});
				this.doSearchQuery("0List", "186THqMWuptrZxq1rxzpguAivK3Bs6z84o", searchSelects_0List, query, setNextResults, subPageNum);*/

				var searchSelects_ZeroTalk = [
					{ col: "title", score: 5 },
                    { col: "body", score: 4 },
					//{ skip: !app.userInfo || !app.userInfo.auth_address, col: "bookmarkCount", select: this.subQueryBookmarks(), inSearchMatchesAdded: false, inSearchMatchesOrderBy: true, score: 6 } // TODO: Rename inSearchMatchesAdded, and isSearchMatchesOrderBy
				];

				// ZeroTalk
				if (this.isEnabled("1TaLkFrMwvbNsooF4ioKAY9EuxTBTjipT")) {
					query = searchDbQuery(this, this.searchQuery || "", {
						orderByScore: true,
						id_col: "topic_id",
						select: `topic.*, json.directory,
							topic.topic_id || '_' || topic_creator_content.directory AS row_topic_uri,
							topic_creator_user.value AS topic_creator_user_name,
							CASE WHEN MAX(comment.added) IS NULL THEN topic.added ELSE MAX(comment.added) END as last_action`,
						searchSelects: searchSelects_ZeroTalk,
						table: "topic",
						join: `INNER JOIN json USING (json_id)
							INNER JOIN json AS topic_creator_content ON (topic_creator_content.directory = json.directory AND topic_creator_content.file_name = 'content.json')
							LEFT JOIN keyvalue AS topic_creator_user ON (topic_creator_user.json_id = topic_creator_content.json_id AND topic_creator_user.key = 'cert_user_id')
							LEFT JOIN comment ON (comment.topic_uri = row_topic_uri AND comment.added < ${Date.now()/1000+120})`,
						page: self.pageNum,
						afterOrderBy: `last_action DESC`,
						groupBy: "topic.topic_id, topic.json_id",
						having: `last_action < ${Date.now()/1000+120}`,
						limit: this.limit
					});
					this.doSearchQuery("ZeroTalk", "1TaLkFrMwvbNsooF4ioKAY9EuxTBTjipT", searchSelects_ZeroTalk, query, setNextResults, subPageNum);
				}

				var searchSelects_GitCenter = [
					{ col: "address", score: 5 },
					{ col: "title", score: 5 },
                    { col: "description", score: 4 },
                    //{ col: "cert_user_id", score: 3, usingJson: true }, // 0list puts this in keyvalue instead of json table for some reason
                    //{ col: "directory", score: 2, usingJson: true },
                    { col: "date_added", score: 1 }
				];

				var searchSelects_ZeroExchange = [
					{ col: "title", score: 5 },
					{ col: "tags", score: 4 },
					{ col: "body", score: 3 },
					{ col: "date_added", score: 1 }
				];


				if (pageNum == 0 && this.searchQuery && (this.searchQuery[this.searchQuery.length - 1] == "?" || this.searchQuery.toLowerCase().startsWith("how") || this.searchQuery.toLowerCase().startsWith("where") || this.searchQuery.toLowerCase().startsWith("what") || this.searchQuery.toLowerCase().startsWith("when") || this.searchQuery.toLowerCase().startsWith("could") || this.searchQuery.toLowerCase().startsWith("who") || this.searchQuery.toLowerCase().startsWith("where") || this.searchQuery.toLowerCase().startsWith("why") || this.searchQuery.toLowerCase().startsWith("did") || this.searchQuery.toLowerCase().startsWith("do") || this.searchQuery.toLowerCase().startsWith("does")) && this.isEnabled("1PHBjZSAc6mHDMkySJNs3XeSXUL7eY7Q7W")) { // ZeroExchange
					var newSearchQuery = (this.searchQuery || "").replace(/how( to)?/ig, "").replace(/where/ig, "").replace(/what/ig, "").replace(/when/ig, "").replace(/do/ig, "").replace(/did/ig, "").replace(/does/ig, "").replace(/could/ig, "").replace(/who/ig, "").replace(/why/ig, "").replace(/\?/g, "");
					query = searchDbQuery(this, newSearchQuery || "", {
						orderByScore: true,
						id_col: "question_id",
						select: "*",
						searchSelects: searchSelects_ZeroExchange,
						table: "questions",
						join: "INNER JOIN json USING (json_id)",
						//where: languageWhere,
						page: 0,
						afterOrderBy: "date_added DESC",
						limit: 1
					});

					page.cmd("as", ["1PHBjZSAc6mHDMkySJNs3XeSXUL7eY7Q7W", "dbQuery", [query]], function(results) {
						self.zeroExchangeResults = results;
					});
				} else if (pageNum == 0 && this.searchQuery && this.searchQuery != "" && this.isEnabled("1GitLiXB6t5r8vuU2zC6a8GYj9ME6HMQ4t")) { // GitCenter
					query = searchDbQuery(this, this.searchQuery || "", {
						orderByScore: true,
						id_col: "address",
						select: "*",
						searchSelects: searchSelects_GitCenter,
						table: "repo_index",
						join: "INNER JOIN json USING (json_id)",
						//where: languageWhere,
						page: 0,
						afterOrderBy: "date_added ASC",
						limit: 1
					});

					page.cmd("as", ["1GitLiXB6t5r8vuU2zC6a8GYj9ME6HMQ4t", "dbQuery", [query]], function(results) {
						self.gitCenterResults = results;
					});
				}
			},
			getKxoIdResults: function(pageNum, subPageNum, setNextResults) {
				var searchSelects_KxoIds = [
					{ col: "username", score: 5 },
					{ col: "address", score: 4 }
				];

				var query = searchDbQuery(this, this.searchQuery || "", {
					orderByScore: true,
					id_col: "id",
					select: "ids.*, json.*",
					searchSelects: searchSelects_KxoIds,
					table: "ids",
					page: pageNum,
					//afterOrderBy: "date_added ASC",
					join: "INNER JOIN json USING (json_id)",
					limit: this.limit
				});

				var query2 = searchDbQuery(this, this.searchQuery || "", {
					orderByScore: true,
					id_col: "id",
					select: "bots.*, json.*",
					searchSelects: searchSelects_KxoIds,
					table: "bots",
					page: pageNum,
					join: "INNER JOIN json USING (json_id)",
					limit: this.limit
				});

				this.doSearchQuery("KxoId", "self", searchSelects_KxoIds, query, setNextResults, subPageNum, async function(results) {
					results = await asyncFilter(results, async (row) => {
						if (row.file_name == "ids.json") return true;
						var cert = row.directory.replace('users/', '') + '#' + row.cert_auth_type + '/' + row.cert_user_id;

						return await page.cmdp("ecdsaVerify", [cert, permissionaddress_level2, row.trustedpeer_sig]);
					});

					for (var i = 0; i < results.length; i++) {
						results[i]["type"] = "web";
					}

					return results;
				});
				this.doSearchQuery("KxoId Bots", "self", searchSelects_KxoIds, query2, setNextResults, subPageNum, async function(results) {
					results = await asyncFilter(results, async (row) => {
						if (row.file_name == "ids.json") return true;
						var cert = row.directory.replace('users/', '') + '#' + row.cert_auth_type + '/' + row.cert_user_id;

						return await page.cmdp("ecdsaVerify", [cert, permissionaddress_level2, row.trustedpeer_sig]);
					});

					for (var i = 0; i < results.length; i++) {
						results[i]["type"] = "bot";
					}

					return results;
				});
			},
			getVideoResults: function(pageNum, subPageNum, setNextResults) {
				// KxoVid
				if (this.isEnabled("14c5LUN73J7KKMznp9LvZWkxpZFWgE1sDz")) {
					var searchSelects = [
						{ col: "title", score: 5 },
						{ col: "description", score: 4 },
						{ col: "tags", score: 2 },
					];

					var query = searchDbQuery(this, this.searchQuery || "", {
						 orderByScore: true,
						id_col: "video_id",
						select: "videos.*, videos_json.directory, videos_json.site, videos_json.cert_user_id, channels.name as channel_name",
						searchSelects: searchSelects,
						table: "videos",
						join: `INNER JOIN json as videos_json USING (json_id)
								INNER JOIN json as channels_json ON channels_json.directory=videos_json.directory AND channels_json.site="1HmJfQqTsfpdRinx3m8Kf1ZdoTzKcHfy2F"
								LEFT JOIN channels ON channels.channel_id=videos.ref_channel_id AND channels.json_id=channels_json.json_id`,
						afterOrderBy: "date_added ASC",
						page: pageNum,
						limit: this.limit
					});

					this.doSearchQuery("KxoVid", "14c5LUN73J7KKMznp9LvZWkxpZFWgE1sDz", searchSelects, query, setNextResults, subPageNum);
				}

				// KopyKate Big
				if (this.isEnabled("18Pfr2oswXvD352BbJvo59gZ3GbdbipSzh")) {
					var searchSelects = [
						{ col: "title", score: 5 },
						{ col: "description", score: 4 },
						{ col: "category", score: 2 },
					];

					var query = searchDbQuery(this, this.searchQuery || "", {
						orderByScore: true,
						id_col: "date_added",
						select: "*",
						searchSelects: searchSelects,
						table: "file",
						join: `INNER JOIN json using (json_id)`,
						afterOrderBy: "date_added ASC",
						page: pageNum,
						limit: this.limit
					});

					this.doSearchQuery("KopyKate Big", "18Pfr2oswXvD352BbJvo59gZ3GbdbipSzh", searchSelects, query, setNextResults, subPageNum);
				}
			},
			getFileResults: function(pageNum, subPageNum, setNextResults) {
				if (this.isEnabled("1uPLoaDwKzP6MCGoVzw48r4pxawRBdmQc")) {
					var searchSelects = [
						{ col: "title", score: 5 },
						{ col: "file_name", score: 4 },
						{ col: "cert_user_id", score: 3, usingJson: true },
						//{ col: "directory", score: 2, usingJson: true },
						{ col: "date_added", score: 1 }
					];

					var query = searchDbQuery(this, this.searchQuery, {
						orderByScore: true,
						id_col: "date_added",
						select: "*",
						searchSelects: searchSelects,
						table: "file",
						join: "INNER JOIN json USING (json_id)",
						page: pageNum,
						afterOrderBy: "date_added DESC",
						limit: this.limit
					});
					
					this.doSearchQuery("ZeroUp", "1uPLoaDwKzP6MCGoVzw48r4pxawRBdmQc", searchSelects, query, setNextResults, subPageNum);
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
			},
			gotoLinkNewTab: function(to) {
				page.cmd("wrapperOpenWindow", [to, "_blank"]);
			},
			prevPage: function() {
				if (this.pageNum == 0) return;
				this.pageNum--;
				this.getResults(true, false, true);
			},
			nextPage: function() {
				this.pageNum++;
				this.getResults(true, true, false);
			},
			getLinkFromBody: function(result) {
				var body = result.body;
				if (!body) return "#";
				var matches = body.match(/https?\:\/\/127\.0\.0\.1\:43110\/[A-Za-z0-9\.]+/);
                //console.log(matches);
                if (matches) {
                    return "/" + matches[0].replace(/https?\:\/\//g, "").replace(/127\.0\.0\.1/g, "").replace(/\:43110\/?/g, "").replace(/\//g, "");
                }
                return "#";
			},
			changeTab: function(tabName) {
				console.log("Active: " + this.active);
				this.currentTab = tabName;

				if (tabName == "kxoids") {
					this.limit = 10; // 24
				} else if (tabName == "video") {
					this.limit = 5;
				} else if (tabName == "files") {
					this.limit = 8;
				} else {
					this.limit = 4; // 8
				}

				if (this.searchQuery == null) this.searchQuery = "";
				this.previousSearchQuery = null;
				this.getResults();
			}
		}
	}
</script>