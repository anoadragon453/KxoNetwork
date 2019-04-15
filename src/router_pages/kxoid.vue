<template>
	<v-container fluid>
		<v-container style="max-width: 700px;">
            <div style="text-align: center;">
                <strong style="font-size: 1.5em;">Introducing KxoId</strong>
                <p>Brought to you by @krixano and @gitcenter</p>
            </div>
			<div style="clear: both;"></div>

			<div>
				<v-divider></v-divider>

                <v-tabs show-arrows centered v-model="currentTab" style="max-width: 900px; margin-left: auto; margin-right: auto;">
                    <v-tab key="overview" ripple>Overview</v-tab>
                    <!--<v-tab key="videos" ripple></v-tab>-->
                    <v-tab key="support" ripple>Support</v-tab>
                    <!--<v-tab>Discussion</v-tab>-->
                </v-tabs>

                <v-divider></v-divider>

                <v-tabs-items v-model="currentTab">
                    <v-tab-item key="overview" style="padding: 20px;">
                        <strong>Overview</strong>
                        <v-divider></v-divider>
                    </v-tab-item>
                    <v-tab-item key="support" style="padding: 20px;">
                        <strong>Zites That Support KxoId</strong>
                        <v-divider></v-divider>
                        <v-list style="margin-top: 10px;">
                            <v-list-tile v-for="zite in supportedZites" :href="'/' + zite.address" @click="gotoLink('/' + zite.address)" :key="zite.address">
                                <v-list-tile-content>
                                    <v-list-tile-title>{{ zite.title }}</v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                    </v-tab-item>
                </v-tabs-items>
			</div>
		</v-container>
	</v-container>
</template>

<script>
	var Router = require("../libs/router.js");
	var searchDbQuery = require("../libs/search.js");

	module.exports = {
		props: ["userInfo", "langTranslation", "siteInfo"],
		name: "kxoid",
		data: () => {
			return {
                currentTab: 0,
                supportedZites: [
                    { title: "KxoVid", address: "14c5LUN73J7KKMznp9LvZWkxpZFWgE1sDz" },
                    { title: "KxoQA", address: "1PHBjZSAc6mHDMkySJNs3XeSXUL7eY7Q7W" },
                    { title: "ZeroMedium", address: "1CVmbCKWtbskK2GAZLM6gnMuiL6Je25Yds" },
                    { title: "0Play Game Center", address: "1Ag6xidDHiPgWoDKhfSx4xFQr6WC3NqxZg" },
                    { title: "ThunderWave", address: "1CWkZv7fQAKxTVjZVrLZ8VHcrN6YGGcdky" }
                ]
			};
		},
		beforeMount: function() {
			var self = this;

			/*this.$parent.$on("setLanguage", function(langTranslation) {
				self.ZiteName = langTranslation["KxoId"];
			});
			this.ZiteName = this.langTranslation["KxoId"];*/

			this.$emit("setcallback", "update", function(userInfo) {
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