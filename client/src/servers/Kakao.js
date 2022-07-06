import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import KakaoLoding from "../elements/KakaoCallback";
import { instance } from "./axios";

// 카카오 로그인 인가코드
const kakaoLogin = () => {
  const navigate = useNavigate();
  const code = new URL(window.location.href).searchParams.get("code");
  console.log(new URL(window.location.href).searchParams.get('code')); 
  useEffect(() => {
    const Kakao = async (code) => {
      return await instance
        .get(`/auth/kakao?code=${code}`)
        .then(() => {
          navigate("/");
        })
        .catch(() => {
          navigate("/login")
        });
    };
    if (code) {
      Kakao(code);
    }
  }, [code, navigate]);

  return <KakaoLoding/>;
};
// const kakaoLogin = (code) => {
//     return function (dispatch, getState, { history }) {
//       axios({
//         method: "GET",
//         url: `http://3.35.208.142/oauth/callback/kakao?code=${code}`,
//       })
//         .then((res) => {
//           console.log(res); // 토큰이 넘어올 것임
          
//           const ACCESS_TOKEN = res.data.accessToken;
          
//           localStorage.setItem("token", ACCESS_TOKEN);    //예시로 로컬에 저장함    
          
//           history.replace("/main") // 토큰 받았았고 로그인됐으니 화면 전환시켜줌(메인으로)
          
//           }.catch((err) => {
//           console.log("소셜로그인 에러", err);
//           window.alert("로그인에 실패하였습니다.");
//           history.replace("/login"); // 로그인 실패하면 로그인화면으로 돌려보냄
//           }
//       }
//   };
export default Kakao;