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
					<v-tab key="differences" ripple>Differences</v-tab>
					<v-tab key="peermessage" ripple>PeerMessage</v-tab>
                    <!--<v-tab key="videos" ripple></v-tab>-->
                    <v-tab key="support" ripple>Support</v-tab>
                    <!--<v-tab>Discussion</v-tab>-->
                </v-tabs>

                <v-divider></v-divider>

                <v-tabs-items v-model="currentTab">
                    <v-tab-item key="overview" style="padding: 20px;">
                        <strong>Overview</strong>
                        <v-divider style="margin-bottom: 10px;"></v-divider>
						<p>
							KxoId is a new Id Provider, created by @krixano and @gitcenter, that ensures Unique usernames. It uses the
							<a href="./?/plugins" @click.prevent="goto('plugins')">PeerMessage plugin</a> to:
							<ul>
								<li>make sure all registration requests only happen within the ZeroNet network</li>
								<li>ensure the servers cannot be blocked easily by ISPs or Governments</li>
								<li>and ensure that IPs are not leaked to the clearnet and that IPs remain hidden when using Tor</li>
							</ul>
						</p>

						<strong>Federated System</strong>
                        <v-divider style="margin-bottom: 10px;"></v-divider>
						<p>
							KxoId uses a two-level system.
							<ul>
								<li>
									<strong>Level 1</strong> - This is always preferred first. Level 1 uses <em>only</em> the official KxoNetwork servers to do the
									registrations. This offers the highest level of trust to ensure usernames are always unique.
								</li>
								<li>
									<strong>Level 2</strong> - This is used when the official KxoNetwork servers are unavailable on the network (e.g. if they go down).
									Level 2 uses a set of <strong>Trusted Peers</strong> to handle the registrations.
								</li>
							</ul>
						</p>
						<p>
							Zite owners can easily restrict login to <em>only</em> Level 1 ids on their zites.
						</p>

						<strong>Detecting Traitor Peers</strong>
                        <v-divider style="margin-bottom: 10px;"></v-divider>
						<p>
							Because Trusted Peers can give the private keys used for registrations to new Trusted Peers - there's always a chance a peer
							that intentionally malfunctions (e.g. intentionally allows registration of non-unique usernames) can become a "Trusted Peer".
							We call this type of Peer a <strong>Traitor Peer</strong>.
						</p>
						<p>
							KxoId will have a system to try to detect Traitor Peers. When a Traitor Peer is detected, the following will happen:
							<ol>
								<li>
									Any <em>non-unique</em> usernames the peer has created will be added to the <strong>Traitor Blocklist</strong>. We recommend
									both users and zite owners block these accounts. These users will be notified when they visit KxoNetwork that their id was
									added to the blocklist due to not being unique.
								</li>
								<li>
									KxoId requires that all registrations handled by "Trusted Peers" be logged in.
									So, the account associated with the traitor peer is also added to the blocklist. The ip address of the peer will also be
									added to a list.
								</li>
								<li>
									Unique usernames are re-verified and re-added to the database under a more trustworthy peer.
								</li>
							</ol>
						</p>
                    </v-tab-item>
					<v-tab-item key="differences" style="padding: 20px;">
                        <strong>Differences From Other Id Providers</strong>
                        <v-divider style="margin-bottom: 10px;"></v-divider>
						<p>
							<strong>ZeroId</strong> accesses a clearnet server to ensure usernames are always unique. This server handles detecting of existing users
							as well as the signing of the user ids. Due to this, the server is easily inaccessible by blocking its IP address (China has already done
							this multiple times).
						</p>
						<p>
							<strong>KaffieId</strong> is a fully decentralized Id Provider - Id Signature creation happens <em>locally</em>, on the computer doing the
							registration. Because of this, KaffieId does not ensure unique usernames.
						</p>
						<p>
							<strong>KxoId</strong> uses a collection of <em>Trusted Peer servers</em>. Requests are given to and sent from these servers by
							<em>broadcasting</em> over the ZeroNet network using the <a href="./?/plugins" @click.prevent="goto('plugins')">PeerMessage plugin</a>.
						</p>
                    </v-tab-item>
					<v-tab-item key="peermessage" style="padding: 20px;">
                        <strong>Overview</strong>
                        <v-divider style="margin-bottom: 10px;"></v-divider>
						<p>
							When you register a username, an encrypted message is broadcasted over the network with the help of the
							<a href="./?/plugins" @click.prevent="goto('plugins')">PeerMessage plugin</a>. The message is encrypted
							via ECIES (which is known to be safe) to ensure that nobody can steal your username before it's registered.
						</p>

						<strong>Broadcasting with PeerMessage</strong>
                        <v-divider style="margin-bottom: 10px;"></v-divider>
						<p>
							The message is sent to 5 random peers. Those peers broadcast the message to 5 other peers (so 25 peers total),
							and so on. This means that the message is broadcasted to the whole network very quickly. For signing, we use ECDSA,
							the same thing that Bitcoin uses for signing (we don't have blockchain!!).
						</p>

						<strong>KxoId Registration</strong>
                        <v-divider style="margin-bottom: 10px;"></v-divider>
						<p>
							When a Trusted Peer receives a message, they will decrypt it, validate your request, and add you to the database.
							You will be able to use ZeroNet in less than a minute.
						</p>

						<strong>KxoId Consensus</strong>
                        <v-divider style="margin-bottom: 10px;"></v-divider>
						<p>
							However, what would happen when two people try to register the same username at the same time? No problem, KxoID uses a consensus algorithm to fix this.
						</p>
						<p>
							When you try to register, the Trusted Peers talk to each other (via signed broadcasts) to make sure that the username is not being registered already.
							In this case, the one who's message is received first will get the username.
						</p>
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
					{ title: "ZeroTalk", address: "1TaLkFrMwvbNsooF4ioKAY9EuxTBTjipT" },
                    { title: "KxoVid", address: "14c5LUN73J7KKMznp9LvZWkxpZFWgE1sDz" },
                    { title: "KxoQA", address: "1PHBjZSAc6mHDMkySJNs3XeSXUL7eY7Q7W" },
                    { title: "ZeroMedium", address: "1CVmbCKWtbskK2GAZLM6gnMuiL6Je25Yds" },
                    { title: "0Play Game Center", address: "1Ag6xidDHiPgWoDKhfSx4xFQr6WC3NqxZg" },
                    { title: "ThunderWave", address: "1CWkZv7fQAKxTVjZVrLZ8VHcrN6YGGcdky" },
					{ title: "StreamZ", address: "1BTZh5pymEKzMYr3qgDtgr4dMmap77QvEs" }
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