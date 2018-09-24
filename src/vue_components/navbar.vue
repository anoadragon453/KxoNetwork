<template>
	<v-toolbar app dark style="padding-right: 45px; padding-left: 45px;">
		<v-toolbar-title style="cursor: pointer;" @click.prevent="goto('')">{{ ZiteName }} (beta)</v-toolbar-title>
		<v-toolbar-items style="margin-left: 10px;">
			<!--<v-btn flat>News</v-btn>-->
			<v-btn flat @click="goto('plugins')">Plugin Store</v-btn>
		</v-toolbar-items>
		<v-spacer></v-spacer>
		<v-menu left offset-y dark>
			<v-btn icon slot="activator">
		      <v-icon>apps</v-icon>
		    </v-btn>
		    <v-list>
		    	<v-subheader>Network Zites</v-subheader>
		    	<!--<v-list-tile @click="">
		    		<v-list-tile-title>KxoMail</v-list-tile-title>
		    	</v-list-tile>-->
		    	<v-list-tile @click="gotoLink('/1MiS3ud9JogSQpd1QVmM6ETHRmk5RgJn6E')">
		    		<v-list-tile-title>KxoZites</v-list-tile-title>
		    	</v-list-tile>
		    	<!--<v-list-tile @click="">
		    		<v-list-tile-title>KxoSoftware</v-list-tile-title>
		    	</v-list-tile>-->
		    	<v-list-tile @click="gotoLink('/ZeroMedium.bit')">
		    		<v-list-tile-title>ZeroMedium</v-list-tile-title>
		    	</v-list-tile>
		    	<v-list-tile @click="gotoLink('/ZeroExchange.bit')">
		    		<v-list-tile-title>ZeroExchange</v-list-tile-title>
		    	</v-list-tile>
		    	<v-list-tile @click="gotoLink('/1LqcxtENM69yBggxPYLaj87J4bqon5SVwU')">
		    		<v-list-tile-title>KxoHub (ZeroMe Hub)</v-list-tile-title>
		    	</v-list-tile>
		    	<v-divider></v-divider>
		    	<v-subheader>Partner Zites</v-subheader>
		    	<v-list-tile @click="gotoLink('/1Ag6xidDHiPgWoDKhfSx4xFQr6WC3NqxZg')">
		    		<v-list-tile-title>0Play Game Center</v-list-tile-title>
		    	</v-list-tile>
		    	<v-list-tile @click="">
		    		<v-list-tile-title>ZeroNet Instant Messenger</v-list-tile-title>
		    	</v-list-tile>
		    </v-list>
		</v-menu>
		<v-toolbar-items>
			<svg style="height: 50%; width: auto; margin-top: auto; margin-bottom: auto;" v-bind:data-jdenticon-value="userInfo.auth_address" v-if="isLoggedIn"></svg>
			<v-btn flat v-if="!isLoggedIn" @click="login()">Sign In</v-btn>
			<v-btn flat v-if="!isLoggedIn" @click="goto('create-id')">Register</v-btn>
			<v-btn flat v-else @click="goto('profile')">{{ userInfo.cert_user_id }}</v-btn>
		</v-toolbar-items>
	</v-toolbar>
</template>

<script>
	var Router = require("../libs/router.js");

	module.exports = {
		props: ["userInfo", "langTranslation"],
		name: "navbar",
		data: () => {
			return {
				ZiteName: ""
			};
		},
		beforeMount: function() {
			var self = this;
			this.$parent.$on("setLanguage", function(langTranslation) {
				self.ZiteName = langTranslation["KxoNetwork"];
			});
			this.ZiteName = this.langTranslation["KxoNetwork"];
		},
		mounted: function() {
			var self = this;
			if (!this.userInfo) {
				/*this.$parent.on('setUserInfo', function() {
					// TODO
				});*/
			}
		},
		updated: function() {
			//jdenticon();
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
			},
			gotoLink: function(to) {
				window.location = to;
			}
		}
	}
</script>