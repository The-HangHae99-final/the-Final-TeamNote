
console.log(process.env.REACT_APP_REST_API_KEY_K);

export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_REST_API_KEY_K}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI_K}&response_type=code`;

