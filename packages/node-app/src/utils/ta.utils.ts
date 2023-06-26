import axios from 'axios';

const { TA_USER, TA_SECRET, TA_ORIGIN } = process.env;

const TAInstance = axios.create({
  baseURL: TA_ORIGIN,
});

const signIn = async () => {
  const res = await TAInstance.post('/v1/auth/sign_in', {
    email: TA_USER,
    password: TA_SECRET,
  });

  if (res.status === 201) {
    return {
      ...res.data.session,
      accessToken: res.headers['access-token'],
    };
  }
};

const getPeople = async (session, archived) => {
  const multiSite = session.site_url;
  const queryParams = archived ? `?archived=${archived}` : '';

  const res = await TAInstance.get(`/v1/${multiSite}/people${queryParams}`, {
    headers: {
      'access-token': session.accessToken,
      uid: session.email,
    },
  });

  if (res.status === 200) {
    return res.data.people;
  }
};

const TAClient = { signIn, getPeople };
export default TAClient;
