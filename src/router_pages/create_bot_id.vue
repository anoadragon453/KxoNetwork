<template>
	<v-container fluid>
		<v-container v-if="!isLoggedIn" style="padding-top: 7px; padding-bottom: 7px; max-width: 500px;"> <!-- Not Logged In -->
			<v-card color="red" tile style="margin: 0; margin-bottom: 7px;" v-if="!serverInfo || !hasPeerMessage">
				<v-card-text style="text-align: center;">
					Please install the PeerMessage plugin. You can download and install it from the <a href="./?/plugins" @click.prevent="goto('plugins')">Plugin Store</a>
				</v-card-text>
			</v-card>

			<v-card style="margin: 0;">
				<v-card-text>
					<v-text-field id="username" name="username" ref="usernameinput" label="Username" clearable required suffix="@kxoid.bit" v-model="username" :rules="getRules()"></v-text-field>
					<v-btn @click="register()" :loading="loading" :disabled="!hasPeerMessage">Create Id</v-btn>
                    
					<v-divider style="margin-top: 15px;"></v-divider>
					<v-subheader>Supporting KxoId on Your Zite</v-subheader>

					<p>For developers, you can support KxoId by adding this to the "cert_signers" of your users content.json file:</p>
					<p>"kxoid.bit": ["{{ permissionaddress }}"]</p>

                    <v-divider style="margin-top: 15px;"></v-divider>
					<v-subheader>Blocking Bot KxoId's on Your Zite</v-subheader>

                    <p>You can block all Bot KxoIds by adding this under the "permission_rules" part of your users content.json file:</p>
                    <p>"bot/.*@kxoid.bit": false</p>
                    <small>Note: Unsure if this is completely correct.</small>
				</v-card-text>
			</v-card>
		</v-container>
		<v-container v-if="!gettingUserInfo && isLoggedIn">
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
				loading: false
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
			peerReceive: function(messageParams) {
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
											if (results.length > 0) {
												page.cmdp("certAdd", [certname, "bot", results[0].username, results[0].signature])
													.then((res) => {
														if (res.error) {
															page.cmdp("wrapperNotification", ["error", "Failed to create account: " + res.error]);
														} else {
															page.cmdp("certSelect", [[certname]]);
														}
													});
											} else {
												self.error = "That username is already taken or you have already signed up on this client.";
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
								page.cmdp("certAdd", [certname, "bot", username, base64_signature])
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
						page.cmdp("peerBroadcast", {message: "registerbot|" + encryptedMsg, immediate: true, privatekey: false});
					}).catch((error) => console.log(error));
			}
		}
	}
</script>