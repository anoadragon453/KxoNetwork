<template>
	<v-toolbar app dark style="padding-right: 45px; padding-left: 45px;">
		<v-toolbar-side-icon @click.stop="toggleDrawer()"></v-toolbar-side-icon>

		<v-menu bottom>
			<v-toolbar-title slot="activator" style="cursor: pointer;" @mousedown.middle="gotoLinkNewTab('./?/')" @click.prevent="goto('')">
				<span>{{ ZiteName }} (beta)</span>
				<v-icon dark>arrow_drop_down</v-icon>
			</v-toolbar-title>
			<v-list dense>
					<v-list-tile v-for="item in kxozites" :key="item.address" :href="'/' + item.address" @click="gotoLink('/' + item.address)">
						<v-list-tile-title v-text="item.title"></v-list-tile-title>
					</v-list-tile>
			</v-list>
		</v-menu>

		<v-toolbar-items style="margin-left: 10px;">
			<!--<v-btn flat>News</v-btn>-->
			<v-btn flat @click="goto('kxoid')">KxoId</v-btn>
			<v-btn flat @click="goto('plugins')">Plugin Store</v-btn>
		</v-toolbar-items>
		<v-spacer></v-spacer>
		<!--<v-menu left offset-y dark>
			<v-btn icon slot="activator">
		      <v-icon>apps</v-icon>
		    </v-btn>
		    <v-list>
		    	<v-subheader>Network Zites</v-subheader>
		    	<v-list-tile @click="gotoLink('/14c5LUN73J7KKMznp9LvZWkxpZFWgE1sDz')">
		    		<v-list-tile-title>KxoVid</v-list-tile-title>
		    	</v-list-tile>
		    	<v-list-tile @click="gotoLink('/1MiS3ud9JogSQpd1QVmM6ETHRmk5RgJn6E')">
		    		<v-list-tile-title>KxoZites</v-list-tile-title>
		    	</v-list-tile>
		    	<v-list-tile @click="gotoLink('/ZeroMedium.bit')">
		    		<v-list-tile-title>ZeroMedium</v-list-tile-title>
		    	</v-list-tile>
		    	<v-list-tile @click="gotoLink('/1PHBjZSAc6mHDMkySJNs3XeSXUL7eY7Q7W')">
		    		<v-list-tile-title>KxoQA</v-list-tile-title>
		    	</v-list-tile>
		    	<v-list-tile @click="gotoLink('/1LqcxtENM69yBggxPYLaj87J4bqon5SVwU')">
		    		<v-list-tile-title>KxoHub (ZeroMe Hub)</v-list-tile-title>
		    	</v-list-tile>
		    	<v-divider></v-divider>
		    	<v-subheader>Partner Zites</v-subheader>
		    	<v-list-tile @click="gotoLink('/1Ag6xidDHiPgWoDKhfSx4xFQr6WC3NqxZg')">
		    		<v-list-tile-title>0Play Game Center</v-list-tile-title>
		    	</v-list-tile>
		    </v-list>
		</v-menu>-->
		<v-toolbar-items>
			<v-btn flat v-if="!isLoggedIn" @click="login()">Sign In</v-btn>
			<v-btn flat v-if="!isLoggedIn" @click="goto('create-id')">Register</v-btn>
			<v-menu flat v-else offset-y>
				<v-btn slot="activator" flat>
					<svg style="height: 50%; width: auto; margin-top: auto; margin-bottom: auto; margin-right: 5px;" v-bind:data-jdenticon-value="userInfo.auth_address" v-if="isLoggedIn"></svg>
					{{ userInfo.cert_user_id }}
				</v-btn>
				<v-list>
					<v-list-tile @click="goto('profile')"><v-list-tile-title>Profile</v-list-tile-title></v-list-tile>
					<v-list-tile @click="goto('settings')"><v-list-tile-title>Settings</v-list-tile-title></v-list-tile>
				</v-list>
			</v-menu>
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
				ZiteName: "",
				kxozites: [
					//{ title: "KxoNetwork", address: "1GTVetvjTEriCMzKzWSP9FahYoMPy6BG1P" },
					{ title: "KxoVid", address: "14c5LUN73J7KKMznp9LvZWkxpZFWgE1sDz" },
					{ title: "KxoQA", address: "1PHBjZSAc6mHDMkySJNs3XeSXUL7eY7Q7W" },
					{ title: "ZeroMedium", address: "1CVmbCKWtbskK2GAZLM6gnMuiL6Je25Yds" },
				],
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
			},
			gotoLinkNewTab: function(to) {
				page.cmdp("wrapperOpenWindow", [to, "_blank"])
			},
			toggleDrawer: function() {
				this.$emit("toggle-drawer");
			}
		}
	}
</script>