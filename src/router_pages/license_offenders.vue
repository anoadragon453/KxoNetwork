<template>
	<v-container fluid>
		<v-container style="max-width: 700px;">
            <div style="text-align: center;">
                <strong style="font-size: 1.5em;">License Offenders Blocklist</strong>
            </div>
			<div style="clear: both;"></div>

			<div>
				<v-divider></v-divider>

                <v-tabs show-arrows centered v-model="currentTab" style="max-width: 900px; margin-left: auto; margin-right: auto;">
                    <v-tab key="list" ripple>List</v-tab>
					<v-tab key="notices" ripple>Notices</v-tab>
                    <v-tab key="about" ripple>About</v-tab>
					<v-tab key="rules" ripple>Rules/Interpretation</v-tab>
                    <v-tab key="popular-licenses" ripple>Popular Licenses</v-tab>
                    <!--<v-tab key="videos" ripple></v-tab>-->
                    <!--<v-tab>Discussion</v-tab>-->
                </v-tabs>

                <v-divider></v-divider>

                <v-tabs-items v-model="currentTab">
                    <v-tab-item key="list" style="padding: 20px;">
                        <strong>List</strong>
                        <v-divider style="margin-bottom: 10px;"></v-divider>
                        <p style="color: red;">
                            Since the majority of Zites probably don't follow <em>any</em> of the rules yet, this Blocklist will not go into effect until May 17th.
                        </p>
                        <v-switch v-model="active" :value="active" label="Enable" @click="toggleEnable()"></v-switch>
                    </v-tab-item>
					<v-tab-item key="notices" style="padding: 20px;">
                        <strong>Notices</strong>
                        <v-divider style="margin-bottom: 10px;"></v-divider>
                    </v-tab-item>
                    <v-tab-item key="about" style="padding: 20px;">
                        <strong>About</strong>
                        <v-divider style="margin-bottom: 10px;"></v-divider>
                        <p>
                            This is a blocklist for zites that offend the License of zites they have cloned or used source code from. It applies to:
                            <ul>
                                <li>Clones/Forks to zites which use a copyleft license (including MPL, GPL, etc.)</li>
                                <li>Zites that do not follow the restrictions of the zite they fork/clone/use source code from (examples of restrictions include "Include Original Source", "Include Copyright", "Give Credit", etc.)</li>
                                <li>Proprietary zites which have <em>explicitly</em> given me a complaint about the offending zite.</li>
                            </ul>
                        </p>
                        <p>
                            Zites that offend Licenses will be placed under a notice for 7 days. After the 7 days are up and the zite is still offending, the zite will be added to the Blocklist.
                            <!--<ul>
                                <li>Proof of first existence must be apparent (e.g. Dates on GitHub) - if ambiguous, neither zite or supposed clones will be added until sufficient evidence is shown (or input/votes by users of ZeroNet)</li>
                                <li>Zites that offend Licenses will be placed under a notice for 7 days. After the 7 days are up and the zite is still offending, the zite will be added to the Blocklist.</li>
                            </ul>-->
                            <br>
                            <small>Go to the Rules/Interpretation tab for more specific details on how common license restrictions are interpreted.</small>
                        </p>
                    </v-tab-item>
					<v-tab-item key="rules" style="padding: 20px;">
                        <strong>Rules and Interpretation</strong>
                        <v-divider style="margin-bottom: 10px;"></v-divider>
                        <p style="color: red;">
                            Since the majority of Zites probably don't follow <em>any</em> of these rules yet, this Blocklist will not go into effect until May 17th.
                        </p>
						<p>
							<ul>
                                <li>This blocklist will only apply to use of code from other zites, and does <strong>not</strong> <em>currently</em> apply to any non-ZeroNet libraries or websites being used.</li>
                                <li>It is enough for zites to have a page that lists relied-upon source code and their licenses and copyrights when following the "Include License" restriction.</li>
                                <li>Zites need not "Include Original" Source as the source for all zites is already visible - <strong>unless</strong> the source of the zite is encrypted or obfuscation has been added.</li>
                                <li>Zites need not follow the "Include Install Instructions" restriction of GPL and related Licenses as zites aren't installed.</li>
                                <li>For a Copyleft License - It must be clear on the zite what the License is by placing the License somewhere visible on the zite, or by directly linking to the zite's repository if one exists.</li>
                                <li>Additionally, in order for a License to apply, it must be clearly visible from the zite (or linked to). If no license is shown, it's implied as proprietary.</li>
                                <li>Zites cloned from GPL-Licensed zites (or other Licenses that have this restriction) must <em>State Changes</em> on the zite or provide a link that does so. This doesn't really apply to <em>libraries</em>.</li>
                                <li>Clones of proprietary zites will not be added to the Blocklist unless the original owner gives explicit notice (you can send me a zeromail <strong>@krixano</strong> or mention me on ZeroTalk or ZeroMe).</li>
                                <li>Zites that allow cloning allow the redistribution and modification of code, regardless of if any license has been provided. However, if a license is specified on a clonable zite, the restrictions of that license still apply.</li>
							</ul>
						</p>

                        <strong>Where should I list the License?</strong>
                        <v-divider style="margin-bottom: 10px;"></v-divider>
                        <p>
                            The License should be apparent to uses. You can link to a license file from a footer/page on your zite, link to the repo with your license, or add the full contents of the license to a page on the zite - whatever works best for you.
                            <br>
                            <small>
                                This website shows that for websites, a page that references to licenses is sufficient:
                                <br><a href="https://www.ifosslr.org/index.php/ifosslr/article/view/47/102">https://www.ifosslr.org/index.php/ifosslr/article/view/47/102</a>
                            </small>
                            <br>
                            <small>
                                This website gives an easy-to-read list of restrictions that apply for each license type:
                                <br><a href="https://tldrlegal.com/">https://tldrlegal.com/</a>
                            </small>
                        </p>
                    </v-tab-item>
                    <v-tab-item key="popular-licenses" style="padding: 20px;">
                        <strong>MIT</strong>
                        <v-divider style="margin-bottom: 10px;"></v-divider>
                        <p>
                            <table>
                                <tr>
                                    <td>
                                        <u>Can:</u>
                                        <ul>
                                            <li>Commercial Use</li>
                                            <li>Modify</li>
                                            <li>Distribute</li>
                                            <li>Sublicense</li>
                                            <li>Private Use</li>
                                        </ul>
                                    </td>
                                    <td>
                                        <u>Cannot:</u>
                                        <ul>
                                            <li>Hold Liable</li>
                                        </ul>
                                    </td>
                                    <td>
                                        <u>Must:</u>
                                        <ul>
                                            <li>Include Copyright</li>
                                            <li>Include License</li>
                                        </ul>
                                    </td>
                                </tr>
                            </table>
                        </p>

                        <strong>MPLv1.1</strong>
                        <v-divider style="margin-bottom: 10px;"></v-divider>
                        <p>
                            <small>Note: Not compatible with GPL</small><br>
                            <table>
                                <tr>
                                    <td>
                                        <u>Can:</u>
                                        <ul>
                                            <li>Distribute</li>
                                            <li>Modify</li>
                                            <li>Commercial Use</li>
                                            <li>Sublicense</li>
                                            <li>Place Warranty</li>
                                            <li>Use Patent Claims</li>
                                        </ul>
                                    </td>
                                    <td>
                                        <u>Cannot:</u>
                                        <ul>
                                            <li>Hold Liable</li>
                                            <li>Use Trademark</li>
                                        </ul>
                                    </td>
                                    <td>
                                        <u>Must:</u>
                                        <ul>
                                            <li>Include License</li>
                                            <li>Include Copyright</li>
                                            <li>State Changes</li>
                                            <li>Disclose Source</li>
                                            <li>include Notice</li>
                                            <li>Give Credit</li>
                                        </ul>
                                    </td>
                                </tr>
                            </table>
                        </p>

                        <strong>MPLv2</strong>
                        <v-divider style="margin-bottom: 10px;"></v-divider>
                        <p>
                            <small>Note: Compatible with GPL</small><br>
                            <table>
                                <tr>
                                    <td>
                                        <u>Can:</u>
                                        <ul>
                                            <li>Commercial Use</li>
                                            <li>Modify</li>
                                            <li>Distribute</li>
                                            <li>Sublicense</li>
                                            <li>Place Warranty</li>
                                            <li>Use Patent Claims</li>
                                        </ul>
                                    </td>
                                    <td>
                                        <u>Cannot:</u>
                                        <ul>
                                            <li>Use Trademark</li>
                                            <li>Hold Liable</li>
                                        </ul>
                                    </td>
                                    <td>
                                        <u>Must:</u>
                                        <ul>
                                            <li>Include Coyright</li>
                                            <li>Include License</li>
                                            <li>Disclose Source</li>
                                            <li>Include Original</li>
                                        </ul>
                                    </td>
                                </tr>
                            </table>
                        </p>

                        <strong>BSD-2-Clause</strong>
                        <v-divider style="margin-bottom: 10px;"></v-divider>
                        <p>
                            <table>
                                <tr>
                                    <td>
                                        <u>Can:</u>
                                        <ul>
                                            <li>Commercial Use</li>
                                            <li>Modify</li>
                                            <li>Distribute</li>
                                            <li>Place Warranty</li>
                                        </ul>
                                    </td>
                                    <td>
                                        <u>Cannot:</u>
                                        <ul>
                                            <li>Hold Liable</li>
                                        </ul>
                                    </td>
                                    <td>
                                        <u>Must:</u>
                                        <ul>
                                            <li>Include Copyright</li>
                                            <li>Include License</li>
                                        </ul>
                                    </td>
                                </tr>
                            </table>
                        </p>

                        <strong>GPLv2</strong>
                        <v-divider style="margin-bottom: 10px;"></v-divider>
                        <p>
                            <table>
                                <tr>
                                    <td>
                                        <u>Can:</u>
                                        <ul>
                                            <li>Commercial Use</li>
                                            <li>Modify</li>
                                            <li>Distribute</li>
                                            <li>Place Warranty</li>
                                        </ul>
                                    </td>
                                    <td>
                                        <u>Cannot:</u>
                                        <ul>
                                            <li>Sublicense</li>
                                            <li>Hold Liable</li>
                                        </ul>
                                    </td>
                                    <td>
                                        <u>Must:</u>
                                        <ul>
                                            <li>Include Original</li>
                                            <li>Disclose Source</li>
                                            <li>Include Copyright</li>
                                            <li>State Changes</li>
                                            <li>Include License</li>
                                        </ul>
                                    </td>
                                </tr>
                            </table>
                        </p>

                        <strong>GPLv3</strong>
                        <v-divider style="margin-bottom: 10px;"></v-divider>
                        <p>
                            <table>
                                <tr>
                                    <td>
                                        <u>Can:</u>
                                        <ul>
                                            <li>Commercial Use</li>
                                            <li>Modify</li>
                                            <li>Distribute</li>
                                            <li>Place Warranty</li>
                                            <li>Use Patent Claims</li>
                                        </ul>
                                    </td>
                                    <td>
                                        <u>Cannot:</u>
                                        <ul>
                                            <li>Sublicense</li>
                                            <li>Hold Liable</li>
                                        </ul>
                                    </td>
                                    <td>
                                        <u>Must:</u>
                                        <ul>
                                            <li>Include Original</li>
                                            <li>State Changes</li>
                                            <li>Disclose Source</li>
                                            <li>Include License</li>
                                            <li>Include Copyright</li>
                                            <li>Include Install Instructions</li>
                                        </ul>
                                    </td>
                                </tr>
                            </table>
                        </p>
                    </v-tab-item>
                </v-tabs-items>
			</div>
		</v-container>
	</v-container>
</template>

<style scoped>
    table {
        width: 100%;
    }
</style>


<script>
	var Router = require("../libs/router.js");
	var searchDbQuery = require("../libs/search.js");

	module.exports = {
		props: ["userInfo", "langTranslation", "siteInfo"],
		name: "license-offenders",
		data: () => {
			return {
                currentTab: 0,
                active: false
			};
		},
		beforeMount: function() {
			var self = this;

			/*this.$parent.$on("setLanguage", function(langTranslation) {
				self.ZiteName = langTranslation["KxoId"];
			});
			this.ZiteName = this.langTranslation["KxoId"];*/

			this.$emit("setcallback", "update", function(userInfo) {
                page.cmdp("filterIncludeList", [])
                    .then((filters) => {
                        for (var filter of filters) {
                            if (filter.inner_path == "data/filters/license_offending.json" && filter.address == self.siteInfo.address) {
                                self.active = true;
                                break;
                            }
                        }
                    });
            });
            
            if (this.siteInfo) {
                page.cmdp("filterIncludeList", [])
                    .then((filters) => {
                        for (var filter of filters) {
                            if (filter.inner_path == "data/filters/license_offending.json" && filter.address == self.siteInfo.address) {
                                self.active = true;
                                break;
                            }
                        }
                    });
            }
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
            toggleEnable: function() {
                if (!this.active) {
                    page.cmdp("filterIncludeAdd", "data/filters/license_offending.json");
                } else {
                    page.cmdp("filterIncludeRemove", "data/filters/license_offending.json");
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