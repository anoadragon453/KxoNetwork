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
		</v-container>
	</v-container>
</template>

<script>
	var Router = require("../libs/router.js");

	module.exports = {
		props: ["userInfo", "langTranslation"],
		name: "home",
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
		},
		mounted: function() {
			var self = this;
			if (!this.userInfo) {
				/*this.$parent.on('setUserInfo', function() {
					// TODO
				});*/
			}
		},
		computed: {
			isLoggedIn: function() {
				if (this.userInfo == null) return false;
				return this.userInfo.cert_user_id != null;
			}
		},
		methods: {
			goto: function(to) {
				Router.navigate(to);
			},
			login: function() {
				page.selectUser();
				return false;
			}
		}
	}
</script>