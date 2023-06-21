import axios from 'axios';

const TA_USER = process.env.TA_USER;
const TA_SECRET = process.env.TA_SECRET;

const TAInstance = axios.create({
  baseURL: process.env.TA_ORIGIN,
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
