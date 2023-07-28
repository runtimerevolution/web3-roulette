import axios from "axios";
import qs from 'qs';

const {
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
  GOOGLE_OAUTH_REDIRECT_URL
} = process.env

interface GoogleOauthToken {
  access_token: string;
  id_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
  scope: string;
}

interface GoogleUserResult {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export const getGoogleOauthToken = async (code: string, swagger: boolean):
  Promise<{ idToken: string; accessToken: string; }> => {  
  const options = {
    code,
    client_id: GOOGLE_OAUTH_CLIENT_ID,
    client_secret: GOOGLE_OAUTH_CLIENT_SECRET,
    redirect_uri: `${GOOGLE_OAUTH_REDIRECT_URL}${swagger ? '?swagger=true' : ''}`,
    grant_type: 'authorization_code',
  };
  const { data } = await axios.post<GoogleOauthToken>(
    "https://oauth2.googleapis.com/token",
    qs.stringify(options),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  return { idToken: data.id_token, accessToken: data.access_token };
};

export async function getGoogleUser(idToken: string, accessToken: string):
  Promise<{name: string; verified: boolean; email: string; picture: string; }> {
  const options = { alt: "json", access_token: accessToken }
  const { data } = await axios.get<GoogleUserResult>(
    `https://www.googleapis.com/oauth2/v1/userinfo?${qs.stringify(options)}`,
    { headers: { Authorization: `Bearer ${idToken}` }, }
  );
  return {
    name: data.name,
    verified: data.verified_email,
    email: data.email,
    picture: data.picture
  };
}
