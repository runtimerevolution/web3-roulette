import axios from 'axios';

const { TA_USER, TA_SECRET, TA_ORIGIN } = process.env;

type TASession = {
  email: string;
  accessToken: string;
  siteUrl: string;
};

type TAPerson = {
  email: string;
  skills: string[];
};

const TAInstance = axios.create({
  baseURL: TA_ORIGIN,
});

const signIn = async (): Promise<TASession> => {
  const res = await TAInstance.post('/v1/auth/sign_in', {
    email: TA_USER,
    password: TA_SECRET,
  });

  if (res.status === 201) {
    return {
      email: res.data.session.email,
      siteUrl: res.data.session.site_url,
      accessToken: res.headers['access-token'],
    };
  }
};

const getPeople = async (
  session: TASession,
  archived: boolean
): Promise<TAPerson[]> => {
  const multiSite = session.siteUrl;
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

const getPersonById = async (
  session: TASession,
  archived: boolean,
  id: number,
): Promise<TAPerson> => {
  const multiSite = session.siteUrl;
  const queryParams = archived ? `?archived=${archived}` : '';

  const res = await TAInstance.get(`/v1/${multiSite}/people/${id}`, {
    headers: {
      'access-token': session.accessToken,
      uid: session.email,
    },
  });

  if (res.status === 200) {
    return res.data.person;
  }
};

const TAClient = { signIn, getPeople, getPersonById };
export default TAClient;
