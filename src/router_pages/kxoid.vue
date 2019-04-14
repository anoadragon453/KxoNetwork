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