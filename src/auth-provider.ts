import { AuthProvider, UserIdentity, Identifier } from "react-admin";
import client from "./auth-client";

const authProvider: AuthProvider = {
  async login() {
    console.log("called login");
    await client.loginWithRedirect();

    const user = await client.getUser();

    console.log(`user: `, user);
    console.log("done login with redirect");
  },
  async logout() {
    console.log("called logout");
    await client.logout({
      logoutParams: {
        returnTo: import.meta.env.VITE_LOGOUT_REDIRECT_URL,
      },
    });
  },

  async checkAuth() {
    console.log("---called checkAuth---");

    const isAuthenticated = await client.isAuthenticated();

    if (isAuthenticated) {
      return Promise.resolve();
    }

    // localStorage.setItem("react-admin-auth0", window.location.href);

    // await client.loginWithRedirect({
    //   authorizationParams: {
    //     redirect_uri: import.meta.env.VITE_LOGIN_REDIRECT_URL,
    //   },
    // });

    return new Promise(() => {
      setTimeout(() => {
        //   // localStorage.getItem("auth") ? resolve() : reject();
        client.loginWithRedirect({
          authorizationParams: {
            redirect_uri: import.meta.env.VITE_LOGIN_REDIRECT_URL,
          },
        });
      }, 3000); // Change this to 500 to hide the loading page
    });
  },

  async checkError({ status }) {
    console.log("called checError");
    if (status === 401 || status === 403) {
      throw new Error("Unauthorized");
    }
  },

  async getIdentity() {
    console.log("called getIdentity");
    if (await client.isAuthenticated()) {
      const user = await client.getUser();
      console.log(`getIdentity() user: `, user);
      const identity: UserIdentity = {
        id: user?.email as unknown as Identifier,
        fullName: user?.name,
        avatar: user?.picture,
      };
      return identity;
    }
    throw new Error("Failed to get identity.");
  },

  async handleCallback() {
    console.log("handlecallback was called");
    const query = window.location.search;

    if (!query.includes("code=") && !query.includes("state=")) {
      console.log("does not includec code and state for some reason");
      throw new Error("Failed to handle login callback.");
    }

    console.log("include code and state for some reason");

    await client.handleRedirectCallback();

    return { redirectTo: "/profile" };
  },

  async getPermissions() {
    console.log("called getPermissions");
    return ["editor", "admin"];
  },
};

export default authProvider;
