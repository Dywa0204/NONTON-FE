import { UserManager } from 'oidc-client'
import { setSession } from './jwt';
import { keycloakConfig } from '../config';
// documentation settings -> https://github.com/IdentityModel/oidc-client-js/wiki

export class Keycloak {
    private static userManager = new UserManager(keycloakConfig);

    public static USER_ROLES = [
        {text: "Super Admin", role: "super_admin"},
        {text: "Admin", role: "admin"},
        {text: "CoAss", role: "coass"}
    ]

    public static ADMIN_ROLES = ["super_admin", "admin"]
    public static COASS_ROLES = ["coass"]

    public static getUser() {
        return this.userManager.getUser();
    }

    public static signIn(url: string) {
        localStorage.setItem("lastUrl", url);
        return this.userManager.signinRedirect();
    }

    public static async signOut() {
        await this.userManager.signoutRedirect();
    };

    public static async handleRedirectCallback() {
        try {
            const user = await this.userManager.signinRedirectCallback();
            if (user) {
                console.log(user)
                const lastUrl = localStorage.getItem("lastUrl") || "/";
                localStorage.removeItem("lastUrl");
                setSession(user.access_token)
                
                window.location.href = lastUrl;
            }
        } catch (error) {
            console.error("Login callback error:", error);
        }
    }
}