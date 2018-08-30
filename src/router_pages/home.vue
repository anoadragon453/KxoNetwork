<template>
	<v-container fluid>
		<v-container v-if="!isLoggedIn" style="padding-top: 7px; padding-bottom: 7px; max-width: 900px;"> <!-- Not Logged In -->
			<v-card color="blue" tile style="margin: 0;">
				<v-card-text style="text-align: center;">
					<a href="#" @click.prevent="goto('create-id')" style="color: black;">Create a KxoId</a> to get the full experience of the KxoNetwork!
				</v-card-text>
			</v-card>
		</v-container>
		<v-container style="max-width: 900px;"> <!-- Search -->
			<v-card style="padding-left: 10px; padding-right: 10px; padding-top: 10px;">
				<v-toolbar color="white" dense prominent extended flat>
					<v-text-field prepend-icon="search" hide-details single-line clearable placeholder="Total Search" style="margin-right: 5px; margin-left: 3px;" v-model="searchQuery" @keyup.enter="getResults()" @blur="getResults()"></v-text-field>
					<v-tabs slot="extension" centered>
						<v-tab>Zites</v-tab>
						<v-tab>Audio</v-tab>
						<v-tab>Video</v-tab>
						<v-tab>Posts</v-tab>
						<v-tab>Files</v-tab>
						<v-tab>KxoIds</v-tab>
					</v-tabs>
				</v-toolbar>
			</v-card>

			<div style="margin-left: 15px; margin-right: 15px; margin-top: 8px;">Time: {{ searchTime / 1000.0 }} seconds</div>

			<v-container style="max-width: 50%; float: left;">
				<v-card v-for="result in results.slice(0, Math.round(results.length / 2.0))" style="padding-left: 10px; padding-right: 10px; padding-top: 10px; margin-top: 8px; cursor: pointer;" @click.native="gotoLink('/' + result.address || '#')">
					<div style="text-align: center;"><strong style="color: blue;">{{ result.title }}</strong></div>
				</v-card>
			</v-container>
			<v-container style="max-width: 50%; float: right;">
				<v-card v-for="result in results.slice(Math.round(results.length / 2.0))" style="padding-left: 10px; padding-right: 10px; padding-top: 10px; margin-top: 8px; cursor: pointer;" @click.native="gotoLink('/' + result.address || '#')">
					<div style="text-align: center;"><strong style="color: blue;">{{ result.title }}</strong></div>
					{{ result.address }}
				</v-card>
			</v-container>
			<div style="clear: both;"></div>
			
			<v-container>
				<v-card v-for="result in gitCenterResults" style="padding-left: 10px; padding-right: 10px; padding-top: 10px; margin-top: 8px; cursor: pointer;" @click.native="gotoLink('/' + result.address || '#')">
					<div style="text-align: center;"><strong style="color: blue;">Git Center: {{ result.title }}</strong></div>
					<div style="margin-bottom: 5px; text-align: center;">{{ result.description }}</div>
					<small>{{ result.address }}</small>
				</v-card>
			</v-container>
			<v-container>
				<v-card v-for="result in zeroExchangeResults" style="padding-left: 10px; padding-right: 10px; padding-top: 10px; margin-top: 8px; cursor: pointer;" @click.native="gotoLink('/ZeroExchange.bit/?/' + result.site + '/' + result.directory.replace(/data\/users\//, '') + '/' + result.date_added || '#')">
					<div style="text-align: center;"><strong style="color: blue;">ZeroExchange: {{ result.title }}</strong></div>
					<div style="margin-bottom: 5px; text-align: center;">{{ result.body.slice(0, 150) }}</div>
				</v-card>
			</v-container>

			<v-btn style="margin-top: 16px; float: left;" @click="prevPage()">&lt;</v-btn>
			<v-btn style="margin-top: 16px; float: right;" @click="nextPage()">&gt;</v-btn>
			<div style="text-align: center; margin-top: 24px;"> page {{ pageNum + 1 }} </div>
			<div style="clear: both;"></div>
		</v-container>
	</v-container>
</template>

<script>
	var Router = require("../libs/router.js");
	var searchDbQuery = require("../libs/search.js");

	module.exports = {
		props: ["userInfo", "langTranslation"],
		name: "home",
		data: () => {
			return {
				currentTab: "zites",
				prevResults: [],
				results: [],
				nextResults: [],
				gitCenterResults: [],
				zeroExchangeResults: [],
				searchQuery: "",
				previousSearchQuery: null,
				pageNum: 0,
				limit: 8,
				searchTime: 0, // In miliseconds
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

			console.log(self.userInfo);

			this.$emit("setcallback", "update", function() {
                self.getCorsAndDb("1MiS3ud9JogSQpd1QVmM6ETHRmk5RgJn6E", false, () => {
					self.getCorsAndDb("1SiTEs2D3rCBxeMoLHXei2UYqFcxctdwB", false, () => {
						self.getCorsAndDb("186THqMWuptrZxq1rxzpguAivK3Bs6z84o", false, () => {
							self.getCorsAndDb("1GitLiXB6t5r8vuU2zC6a8GYj9ME6HMQ4t", false, () => {
								self.getCorsAndDb("1PHBjZSAc6mHDMkySJNs3XeSXUL7eY7Q7W", true);
							});
						});
					});
				});
			});

			this.$parent.$on("update", function() {
                //self.getQuestions();
                self.getCorsAndDb("1MiS3ud9JogSQpd1QVmM6ETHRmk5RgJn6E", false, () => {
					self.getCorsAndDb("1SiTEs2D3rCBxeMoLHXei2UYqFcxctdwB", false, () => {
						self.getCorsAndDb("186THqMWuptrZxq1rxzpguAivK3Bs6z84o", false, () => {
							self.getCorsAndDb("1GitLiXB6t5r8vuU2zC6a8GYj9ME6HMQ4t", false, () => {
								self.getCorsAndDb("1PHBjZSAc6mHDMkySJNs3XeSXUL7eY7Q7W", true);
							});
						});
					});
				});
			});

			self.getCorsAndDb("1MiS3ud9JogSQpd1QVmM6ETHRmk5RgJn6E", false, () => {
				self.getCorsAndDb("1SiTEs2D3rCBxeMoLHXei2UYqFcxctdwB", false, () => {
					self.getCorsAndDb("186THqMWuptrZxq1rxzpguAivK3Bs6z84o", false, () => {
						self.getCorsAndDb("1GitLiXB6t5r8vuU2zC6a8GYj9ME6HMQ4t", false, () => {
							self.getCorsAndDb("1PHBjZSAc6mHDMkySJNs3XeSXUL7eY7Q7W", true);
						});
					});
				});
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
            getResults: function(pageChange = false, next = false, previous = false) {
            	if (!pageChange && this.previousSearchQuery == this.searchQuery) return;

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
            		setNextResults = true;
            		this.searchTime = Math.abs(new Date() - startTime);
            		pageNum++;
            	} else if (!pageChange) {
            		this.nextResults = [];
            		this.prevResults = [];
            		setNextResults = false;
            		//setPrevResults = false;
            		this.pageNum = 0;
            		pageNum = 0;
            	}

            	if (pageNum % 2 == 1) {
            		subPageNum = 1;
            		pageNum--;
            	}

            	console.log(pageNum);

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
					join: "LEFT JOIN json USING (json_id)",
					//where: languageWhere,
					page: pageNum,
					afterOrderBy: "date_added ASC",
					limit: this.limit
				});

				var self = this;
				page.cmd("as", ["1MiS3ud9JogSQpd1QVmM6ETHRmk5RgJn6E", "dbQuery", [query]], function(results) {
					if (subPageNum == 0) {
						if (!setNextResults){
							self.results = self.results.concat(results.slice(0, 4));
							self.nextResults = self.nextResults.concat(results.slice(4));
						}
						else if (setNextResults) self.nextResults = self.nextResults.concat(results.slice(0, 4));
					}
					else {
						if (!setNextResults) {
							self.results = self.results.concat(results.slice(4));
							self.prevResults = self.prevResults.concat(results.slice(0, 4));
						}
						else if (setNextResults) self.nextResults = self.nextResults.concat(results.slice(4));
					}

					if (!setNextResults) {
						if (self.searchTime == 0) {
							var date = new Date();
							self.searchTime = Math.abs(date - startTime);
							startTime = date;
						} else {
							var date = new Date();
							self.searchTime += Math.abs(date - startTime);
							startTime = date;
						}
					}
				});

				var searchSelects_ZeroTalk = [
					{ col: "title", score: 5 },
                    { col: "body", score: 4 },
					//{ skip: !app.userInfo || !app.userInfo.auth_address, col: "bookmarkCount", select: this.subQueryBookmarks(), inSearchMatchesAdded: false, inSearchMatchesOrderBy: true, score: 6 } // TODO: Rename inSearchMatchesAdded, and isSearchMatchesOrderBy
				];

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

				query = searchDbQuery(this, this.searchQuery || "", {
					orderByScore: true,
					id_col: "site_id",
					select: "*",
					searchSelects: searchSelects_ZeroSites,
					table: "site",
					join: "LEFT JOIN json USING (json_id)",
					//where: languageWhere,
					page: pageNum,
					afterOrderBy: "date_added DESC",
					limit: this.limit
				});

				page.cmd("as", ["1SiTEs2D3rCBxeMoLHXei2UYqFcxctdwB", "dbQuery", [query]], function(results) {
					if (subPageNum == 0) {
						if (!setNextResults){
							self.results = self.results.concat(results.slice(0, 4));
							self.nextResults = self.nextResults.concat(results.slice(4));
						}
						else if (setNextResults) self.nextResults = self.nextResults.concat(results.slice(0, 4));
					}
					else {
						if (!setNextResults) {
							self.results = self.results.concat(results.slice(4));
							self.prevResults = self.prevResults.concat(results.slice(0, 4));
						}
						else if (setNextResults) self.nextResults = self.nextResults.concat(results.slice(4));
					}

					if (!setNextResults) {
						if (self.searchTime == 0) {
							var date = new Date();
							self.searchTime = Math.abs(date - startTime);
							startTime = date;
						} else {
							var date = new Date();
							self.searchTime += Math.abs(date - startTime);
							startTime = date;
						}
					}
				});

				var searchSelects_0List = [
					{ col: "title", score: 5 },
                    { col: "body", score: 4 },
                    //{ col: "cert_user_id", score: 3, usingJson: true }, // 0list puts this in keyvalue instead of json table for some reason
                    //{ col: "directory", score: 2, usingJson: true },
                    { col: "added", score: 1 }
				];

				query = searchDbQuery(this, this.searchQuery || "", {
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

				page.cmd("as", ["186THqMWuptrZxq1rxzpguAivK3Bs6z84o", "dbQuery", [query]], function(results) {
					if (subPageNum == 0) {
						if (!setNextResults){
							self.results = self.results.concat(results.slice(0, 4));
							self.nextResults = self.nextResults.concat(results.slice(4));
						}
						else if (setNextResults) self.nextResults = self.nextResults.concat(results.slice(0, 4));
					}
					else {
						if (!setNextResults) {
							self.results = self.results.concat(results.slice(4));
							self.prevResults = self.prevResults.concat(results.slice(0, 4));
						}
						else if (setNextResults) self.nextResults = self.nextResults.concat(results.slice(4));
					}

					if (!setNextResults) {
						if (self.searchTime == 0) {
							var date = new Date();
							self.searchTime = Math.abs(date - startTime);
							startTime = date;
						} else {
							var date = new Date();
							self.searchTime += Math.abs(date - startTime);
							startTime = date;
						}
					}
				});

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


				if (this.searchQuery && (this.searchQuery[this.searchQuery.length - 1] == "?" || this.searchQuery.startsWith("how") || this.searchQuery.startsWith("where") || this.searchQuery.startsWith("what") || this.searchQuery.startsWith("when") || this.searchQuery.startsWith("could") || this.searchQuery.startsWith("who") || this.searchQuery.startsWith("where") || this.searchQuery.startsWith("why"))) {
					query = searchDbQuery(this, this.searchQuery || "", {
						orderByScore: true,
						id_col: "question_id",
						select: "*",
						searchSelects: searchSelects_ZeroExchange,
						table: "questions",
						join: "LEFT JOIN json USING (json_id)",
						//where: languageWhere,
						page: 0,
						afterOrderBy: "date_added DESC",
						limit: 1
					});

					page.cmd("as", ["1PHBjZSAc6mHDMkySJNs3XeSXUL7eY7Q7W", "dbQuery", [query]], function(results) {
						self.zeroExchangeResults = results;
					});
				} else if (this.searchQuery && this.searchQuery != "") {
					query = searchDbQuery(this, this.searchQuery || "", {
						orderByScore: true,
						id_col: "address",
						select: "*",
						searchSelects: searchSelects_GitCenter,
						table: "repo_index",
						join: "LEFT JOIN json USING (json_id)",
						//where: languageWhere,
						page: 0,
						afterOrderBy: "date_added ASC",
						limit: 1
					});

					page.cmd("as", ["1GitLiXB6t5r8vuU2zC6a8GYj9ME6HMQ4t", "dbQuery", [query]], function(results) {
						self.gitCenterResults = results;
					});
				}

				//return this.cmdp("as", )
				//return this.cmdp("dbQuery", [query]);
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
			prevPage: function() {
				if (this.pageNum == 0) return;
				this.pageNum--;
				this.getResults(true, false, true);
			},
			nextPage: function() {
				this.pageNum++;
				this.getResults(true, true, false);
			}
		}
	}
</script>