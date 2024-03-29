const host = 'https://our-ideas-api.herokuapp.com/api/v1/'

const Api = {
    signIn: host + 'auth/signin',
    signUp: host + 'auth/signup',
    users: host + 'users',
    domains: host + 'domains',
    subjects: host + 'subjects',
    ideas: host + 'ideas',
    counts: host + 'counts'
};

export default Api;