const loginURL =
  "https://login.eveonline.com/v2/oauth/authorize/?response_type=code";
const redirectURI = "redirect_uri=http://127.0.0.1:5500/EVE-App/";
const cidString = "client_id=7b8292b4cb3e4bd7bc350fb4d1aeda24";
const scope =
  "scope=esi-industry.read_character_jobs.v1 esi-industry.read_corporation_jobs.v1 esi-corporations.read_corporation_membership.v1";
const state = "state=something-unique";

let loginArray = [loginURL, redirectURI, cidString, scope, state];

let loginString = "";

loginArray.forEach((element) => {
  loginString += element + "&";
});

loginString = loginString.substring(0, loginString.length - 1);

let loginLink = document.querySelector(".login-link");

loginLink.setAttribute("href", loginString);
