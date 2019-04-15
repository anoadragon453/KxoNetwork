<template>
	<v-container fluid>
		<v-container style="padding-top: 7px; padding-bottom: 7px; max-width: 500px;">
			<div style="text-align: center;">
                <strong style="font-size: 1.5em;">Down For the Next 24 Hours</strong>
				<p>
					I am currently working with @gitcenter on the finnishing touches to make KxoId a federated system. KxoId registration will be down for the next day until we can sort some problems out. Thanks for your patience - I think it will be worth the wait.
				</p>
            </div>
		</v-container>
		<v-container v-if="!isLoggedIn && false" style="padding-top: 7px; padding-bottom: 7px; max-width: 500px;"> <!-- Not Logged In -->
			<v-card color="red" tile style="margin: 0; margin-bottom: 7px;" v-if="!serverInfo || !hasPeerMessage">
				<v-card-text style="text-align: center;">
					Please install the PeerMessage plugin. You can download and install it from the <a href="./?/plugins" @click.prevent="goto('plugins')">Plugin Store</a>
				</v-card-text>
			</v-card>

			<v-card style="margin: 0;">
				<v-card-text>
					<v-text-field id="username" name="username" ref="usernameinput" label="Username" clearable required suffix="@kxoid.bit" v-model="username" :rules="getRules()"></v-text-field>
					<v-btn @click="register()" :loading="loading" :disabled="!hasPeerMessage">Create Id</v-btn>
					<v-btn @click="register_level2()" :loading="loading" :disabled="!hasPeerMessage">Create Level2 Id</v-btn>

					<v-divider style="margin-top: 15px;"></v-divider>
					<v-subheader>What is KxoId?</v-subheader>

					<p>KxoId is a semi-decentralized (federated) Id Provider for ZeroNet that offers unique usernames. It uses the <a href="./?/plugins" @click.prevent="goto('plugins')">PeerMessage plugin</a> created by @Git Center to broadcast user information over the ZeroNet network, where a set of "trusted clients" receive the messages, verify the usernames are unique, add the id information to the public database, and broadcast back the signatures created by the private key (which is only available to these trusted clients).</p>

					<v-divider style="margin-top: 15px;"></v-divider>
					<v-subheader>Supporting KxoId on Your Zite</v-subheader>

					<p>For developers, you can support KxoId by adding this to the "cert_signers" of your users content.json file:</p>
					<code>"kxoid.bit": ["{{ permissionaddress }}", "{{ permissionaddress_level2 }}"]</code>

					<v-divider style="margin-top: 15px;"></v-divider>
					<v-subheader>Register Bot Ids</v-subheader>

					<p>Registering an Id for a Bot? <a href="./?/create-bot-id" @click.prevent="goto('create-bot-id')">Click Here</a></p>
				</v-card-text>
			</v-card>
		</v-container>
		<v-container v-if="!gettingUserInfo && isLoggedIn && false">
			You are already logged in with a KxoId. You cannot create another one!
		</v-container>
	</v-container>
</template>

<script>
	var Router = require("../libs/router.js");

	module.exports = {
		props: ["gettingUserInfo", "userInfo", "langTranslation", "serverInfo"],
		name: "create-id",
		data: () => {
			return {
				username: "",
				error: "",
				permissionaddress: permissionaddress,
				permissionaddress_level2: permissionaddress_level2,
				loading: false,
				level2: false // If false, registering for level1
			};
		},
		beforeMount: function() {
			var self = this;
			/*this.$parent.$on("setLanguage", function(langTranslation) {
				self.ZiteName = langTranslation["KxoId"];
			});
			this.ZiteName = this.langTranslation["KxoId"];*/
			if (this.gettingUserInfo == false && this.isLoggedIn) {
				page.cmdp("wrapperNotification", ["info", "You are already logged in. You cannot create another id!"]);
				this.goto('');
			}

			this.$emit('setcallback', "peerReceive", this.peerReceive);
		},
		mounted: function() {
			var self = this;
		},
		computed: {
			isLoggedIn: function() {
				if (this.userInfo == null) return false;
				return this.userInfo.cert_user_id != null;
			},
			hasPeerMessage: function() {
				if (!this.serverInfo) return false;
				console.log(this.serverInfo);
				if (this.serverInfo.plugins.includes("Plugin-PeerMessage")
					|| this.serverInfo.plugins.includes("Plugin-PeerMessage-master")
					|| this.serverInfo.plugins.includes("PeerMessage")
					|| this.serverInfo.plugins.includes("peermessage")
					|| this.serverInfo.plugins.includes("PeerMessage-master")
					|| this.serverInfo.plugins.includes("Plugin-PeerMessage-py3")
					|| this.serverInfo.plugins.includes("PeerMessage-py3")
					|| this.serverInfo.plugins.includes("peermessage-py3")) {
					return true;
				}
				return false;
			}
		},
		methods: {
			getRules: function() {
				return [
					(currentValue) => currentValue == "" ? "Your username cannot be blank." : true,
					(currentValue) => /\s/g.test(currentValue) ? "Your username cannot have whitespace." : true,
					() => this.error == "" || this.error
				];
			},
			peerReceive: async function(messageParams) {
				var self = this;
				this.error = "";
				console.log(messageParams);
				var mainMessage = messageParams.message.split('|')[1];
				var decrypted = messageParams.message.split('|').slice(1).join('|'); // TODO: Hack
				if (messageParams.message.startsWith('error|')) {
					// Decrypt the main message
					//page.cmdp("eciesDecrypt", [mainMessage, base64_publickey])
					//	.then((decrypted) => {
							// Verify that sent to client
							var messageParts = decrypted.split('|');
							if (messageParts[0] == page.siteInfo.auth_address) {
								switch (messageParts[1]) {
									case 'WhitespaceOrBlank':
									{
										self.error = "Your username cannot contain any whitespace or be blank.";
									} break;
									case 'NotUnique':
									{
										console.log(page.siteInfo.auth_address);
										// Check if already in db
										var query = `
                                            SELECT * FROM bots WHERE address="${page.siteInfo.auth_address}"
                                            	UNION SELECT * FROM ids WHERE address="${page.siteInfo.auth_address}"`;
										page.cmd("dbQuery", [query], (results) => {
											console.log("Results: ", results);
											if (results.length > 0) {
												page.cmdp("certAdd", [certname, "web", results[0].username, results[0].signature])
													.then((res) => {
														if (res.error) {
															page.cmdp("wrapperNotification", ["error", "Failed to create account: " + res.error]);
														} else {
															page.cmdp("certSelect", [[certname]]);
														}
														self.$refs["usernameinput"].validate(true);
														waitingForResponse = false;
														self.loading = false;
													});
											} else {
												self.error = "That username is already taken or you have already signed up on this client.";
												self.$refs["usernameinput"].validate(true);
												waitingForResponse = false;
												self.loading = false;
											}
										});
										//self.error = "That username is already taken or you have already signed up on this client.";
									} break;
									default:
									{
										self.error = "Unknown Error";
									} break;
								}
								self.$refs["usernameinput"].validate(true);
								//page.cmdp("wrapperNotification", ["error", messageParts[1]]);
								waitingForResponse = false;
								self.loading = false;
							} else {
								page.cmd("peerValid", [messageParams.hash]);
							}
					//	});
				} else if (messageParams.message.startsWith('success|')) {
					// Decrypt the main message
					//page.cmdp("eciesDecrypt", [mainMessage, base64_publickey])
					//	.then((decrypted) => {
							// Verify that sent to client
							var messageParts = decrypted.split('|');
							if (messageParts[0] == page.siteInfo.auth_address) {
								// Add the certificate and have user login
								var username = messageParts[1];
								var base64_signature = messageParts[2];
								console.log("Success: " + username + ", " + base64_signature);
								page.cmdp("certAdd", [certname, "web", username, base64_signature])
									.then((res) => {
										if (res.error) {
											page.cmdp("wrapperNotification", ["error", "Failed to create account: " + res.error]);
										} else {
											page.cmdp("certSelect", [[certname]]);
										}
									});
								waitingForResponse = false;
								self.loading = false;
								// Navigate to homepage
								self.goto('');
							} else {
								page.cmd("peerValid", [messageParams.hash]);
							}
					//	});
				} else {
					page.cmd("peerValid", [messageParams.hash]);
					//console.log(messageParams);
				}
			},
			goto: function(to) {
				Router.navigate(to);
			},
			login: function() {
				page.selectUser();
				return false;
			},
			register: function() {
				if (!this.hasPeerMessage) {
					page.cmdp("wrapperNotification", ["error", "You must have the PeerMessage plugin installed. Download and install from the Plugin Store."]);
					return;
				}
				if (this.userInfo && this.userInfo.cert_user_id) {
					alert("You already have a KxoId.");
					return;
				}
				var username = this.username.toLowerCase();
				if (username === "") {
					//username = page.siteInfo.auth_address.slice(0, 13);
					page.cmd("wrapperNotification", ["error", "Your username cannot be blank."]);
				}
				// TODO: Check that username doesn't have space.

				// Encrypt with public key of kxoid so that only people who have the private key (the trusted servers) can decrypt and send back a signature, that way other's cant steal the username before it's been signed and added.
				var message = username;
				// When received back signed, do .toString("base64") before adding cert.
				console.log(message);
				var self = this;
				page.cmdp("eciesEncrypt", { "text": message, "publickey": base64_publickey })
					.then((encryptedMsg) => {
						console.log("Encrypted: " + encryptedMsg);
						waitingForResponse = true;
						self.loading = true;
						page.cmdp("peerBroadcast", {message: "register|" + encryptedMsg, immediate: true, privatekey: false});
					}).catch((error) => console.log(error));
			},
			register_level2: function() {
				if (!this.hasPeerMessage) {
					page.cmdp("wrapperNotification", ["error", "You must have the PeerMessage plugin installed. Download and install from the Plugin Store."]);
					return;
				}
				if (this.userInfo && this.userInfo.cert_user_id) {
					alert("You already have a KxoId.");
					return;
				}

				var username = this.username.toLowerCase();
				if (username === "") {
					//username = page.siteInfo.auth_address.slice(0, 13);
					page.cmd("wrapperNotification", ["error", "Your username cannot be blank."]);
				}
				// TODO: Check that username doesn't have space.

				// Encrypt with public key of kxoid so that only people who have the private key (the trusted servers) can decrypt and send back a signature, that way other's cant steal the username before it's been signed and added.
				this.level2 = true;
				var message = username;
				// When received back signed, do .toString("base64") before adding cert.
				console.log(message);
				var self = this;
				page.cmdp("eciesEncrypt", { "text": message, "publickey": base64_publickey_level2 })
					.then((encryptedMsg) => {
						console.log("Encrypted: " + encryptedMsg);
						waitingForResponse = true;
						self.loading = true;
						page.cmdp("peerBroadcast", {message: "register2|" + encryptedMsg, immediate: true, privatekey: false});
					}).catch((error) => console.log(error));
			}
		}
	}
</script>