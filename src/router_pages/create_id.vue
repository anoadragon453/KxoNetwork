<template>
	<v-container fluid>
		<v-container v-if="!isLoggedIn" style="padding-top: 7px; padding-bottom: 7px; max-width: 500px;"> <!-- Not Logged In -->
			<v-card style="margin: 0;">
				<v-card-text>
					<v-text-field id="username" name="username" ref="usernameinput" label="Username" clearable required suffix="@kxoid.bit" v-model="username" :rules="getRules()"></v-text-field>
					<v-btn @click="register()">Create Id</v-btn>

					<v-divider style="margin-top: 15px; margin-bottom: 15px;"></v-divider>

					<p>KxoId is a semi-decentralized Id Provider for ZeroNet that offers unique usernames. It uses the <a href="#">p2p-Messages plugin</a> created by @Git Center to broadcast user information over the ZeroNet network, where a set of "trusted clients" receive the messages, verify the usernames are unique, add the id information to the public database, and broadcast back the signatures created by the private key (which is only available to these trusted clients).</p>
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
		props: ["gettingUserInfo", "userInfo", "langTranslation"],
		name: "create-id",
		data: () => {
			return {
				username: "",
				error: ""
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
		},
		mounted: function() {
			var self = this;
			this.$emit('setcallback', "peerReceive", this.peerReceive);
		},
		computed: {
			isLoggedIn: function() {
				if (this.userInfo == null) return false;
				return this.userInfo.cert_user_id != null;
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
				if (messageParams.message.startsWith('error|')) {
					// Decrypt the main message
					page.cmdp("eciesDecrypt", mainMessage, {"privatekey": permissionaddress})
						.then((decrypted) => {
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
										self.error = "That username is already taken or there is already a user with that public address.";
									} break;
									default:
									{
										self.error = "Unknown Error";
									} break;
								}
								self.$refs["usernameinput"].validate(true);
								//page.cmdp("wrapperNotification", ["error", messageParts[1]]);
								waitingForResponse = false;
							}
						});
				} else if (messageParams.message.startsWith('success|')) {
					// Decrypt the main message
					page.cmdp("eciesDecrypt", mainMessage, {"privatekey": permissionaddress})
						.then((decrypted) => {
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
								// Navigate to homepage
								self.goto('');
							}
						});
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
				if (this.userInfo && this.userInfo.cert_user_id) {
					alert("You already have a KxoId.");
					return;
				}
				var username = this.username;
				if (username === "") {
					username = page.siteInfo.auth_address.slice(0, 13);
				}
				// TODO: Check that username doesn't have space.

				// Encrypt with public key of kxoid so that only people who have the private key (the trusted servers) can decrypt and send back a signature, that way other's cant steal the username before it's been signed and added.
				var message = username;
				// When received back signed, do .toString("base64") before adding cert.
				console.log(message);
				page.cmdp("eciesEncrypt", message, { "publickey": permissionaddress })
					.then((encryptedMsg) => {
						console.log("Encrypted: " + encryptedMsg);
						waitingForResponse = true;
						page.cmdp("peerBroadcast", {message: "register|" + encryptedMsg, immediate: true, privatekey: false});
					});
			}
		}
	}
</script>