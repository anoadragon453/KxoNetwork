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
					<v-text-field prepend-icon="search" hide-details single-line clearable placeholder="Total Search" style="margin-right: 5px; margin-left: 3px;"></v-text-field>
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

			<v-card v-for="result in results" style="padding-left: 10px; padding-right: 10px; padding-top: 10px; margin-top: 8px;">
				<strong>{{ result.title }}</strong>
			</v-card>
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
				results: [],
				searchQuery: "",
				pageNum: 0,
				limit: 8,
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
                self.getCorsAndDb("1MiS3ud9JogSQpd1QVmM6ETHRmk5RgJn6E");
			});

			this.$parent.$on("update", function() {
                //self.getQuestions();
                self.getCorsAndDb("1MiS3ud9JogSQpd1QVmM6ETHRmk5RgJn6E");
			});

			this.getCorsAndDb("1MiS3ud9JogSQpd1QVmM6ETHRmk5RgJn6E");
			// 1MiS3ud9JogSQpd1QVmM6ETHRmk5RgJn6E
		},
		computed: {
			isLoggedIn: function() {
				if (this.userInfo == null) return false;
				return this.userInfo.cert_user_id != null;
			}
		},
		methods: {
			getCorsAndDb: function(address) {
				console.log("Test");
                var self = this;
                this.pageNum = 0;
                if(page.siteInfo.settings.permissions.indexOf("Cors:" + address) < 0) {
                    page.cmd("corsPermission", address, function() {
                            self.getResults();
                        });
                } else {
                    self.getResults();
                }
            },
            getResults: function() {
				var searchSelects = [
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

				var query = searchDbQuery(this, this.searchQuery, {
					orderByScore: true,
					id_col: "id",
					select: "*",
					searchSelects: searchSelects,
					table: "zites",
					join: "LEFT JOIN json USING (json_id)",
					//where: languageWhere,
					page: this.pageNum,
					afterOrderBy: "date_added ASC",
					limit: this.limit
				});

				var self = this;
				page.cmd("as", ["1MiS3ud9JogSQpd1QVmM6ETHRmk5RgJn6E", "dbQuery", [query]], function(results) {
					console.log("Results: ", results);
					self.results = results;
				});
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
		}
	}
</script>