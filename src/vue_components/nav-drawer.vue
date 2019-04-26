<template>
    <v-list dense>
        <v-list-tile :class="{ 'menu-item-active': routerIsActive('') }" href="./?/" @click.prevent="goto('')">
            <v-list-tile-action>
                <v-icon>home</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
                <v-list-tile-title>Home</v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>
        <v-list-tile :class="{ 'menu-item-active': routerIsActive('kxoid') }" href="./?/kxoid" @click.prevent="goto('kxoid')">
            <v-list-tile-action>
                <v-icon>change_history</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
                <v-list-tile-title>KxoId</v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>
        <v-list-tile :class="{ 'menu-item-active': routerIsActive('plugins') }" href="./?/plugins" @click.prevent="goto('plugins')">
            <v-list-tile-action>
                <v-icon>equalizer</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
                <v-list-tile-title>Plugin Store</v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>

        <v-divider style="margin-top: 12px;"></v-divider>
        <v-subheader>Blocklists</v-subheader>
        <v-list-tile :class="{ 'menu-item-active': routerIsActive('blocklist/license-offenders') }" href="./?/blocklist/license-offenders" @click.prevent="goto('blocklist/license-offenders')">
            <v-list-tile-title>License Offenders</v-list-tile-title>
        </v-list-tile>

        <v-divider style="margin-top: 12px; margin-bottom: 12px;"></v-divider>
        <v-list-tile :class="{ 'menu-item-active': routerIsActive('settings') }" href="./?/settings" @click.prevent="goto('settings')">
            <v-list-tile-title>Settings</v-list-tile-title>
        </v-list-tile>
        <!--<v-list-tile :class="{ 'menu-item-active': routerIsActive('support-me') }" href="./?/support-me" @click.prevent="goto('support-me')">
            <v-list-tile-title>Support Me</v-list-tile-title>
        </v-list-tile>-->
    </v-list>
</template>

<style lang="css" scoped>
    .menu-item-active {
        background-color: lightgray;
    }
    .theme--dark .menu-item-active {
        background-color: #505050;
    }
</style>


<script>
	var Router = require("../libs/router.js");

	module.exports = {
		props: ["userInfo", "userChannels", "langTranslation"],
		name: "nav-drawer",
		data: () => {
			return {
                subscriptions: [],
                category_subscriptions: []
			};
		},
		beforeMount: function() {
			var self = this;
			/*this.$parent.$on("setLanguage", function(langTranslation) {
				self.ZiteName = langTranslation["KxoVid"];
			});
            this.ZiteName = this.langTranslation["KxoVid"];*/
		},
		mounted: function() {
            var self = this;
            
            this.$emit("setcallback", "navDrawerUpdate", function(userInfo) {
                //self.userInfo = userInfo;
			});
		},
		updated: function() {
            //jdenticon();
            /*switch (this.$vuetify.breakpoint.name) {
                case 'xs': this.value = false;
                case 'sm': this.value = false;
                case 'md': this.value = false;
                case 'lg': this.value = null;
                case 'xl': this.value = null;
            }*/
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
            routerIsActive: function(route) {
                return Router.currentRoute == route;
            },
            channelIsActive: function(auth_address, id) {
                return Router.currentRoute == "channel/:auth_address/:id" && Router.currentParams["auth_address"] && Router.currentParams["id"] && Router.currentParams["auth_address"] == auth_address && Router.currentParams["id"] == id;
            }
		}
	}
</script>