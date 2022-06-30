// import { KAKAO_AUTH_URL } from "../../servers/OAuth";
import styled from 'styled-components';
// import kakao from '../image/KakaoLogin.png'
import kakaoimg from '../image/KakaoLogin.png';
import {KAKAO_AUTH_URL} from './OAuth';

const KakaoLogin = () => {
  console.log(new URL(window.location.href).searchParams.get('code')); 
  const onClick = () => {
    window.location.href = KAKAO_AUTH_URL;
  };
  return (
    <>
 
      <SocialLogin
        onClick={onClick} 
        >
        <p>Login with KakaoTalk</p>
      </SocialLogin>

    </>
  )
}

// css
const KakaoBtn = styled.div`
    background-image: url(${kakaoimg});
    background-repeat: no-repeat;
    background-size : cover;
`
const SocialLogin = styled.a`
  border-radius: 5px;
  display: inline-flex;
  color: ##22211a;
  width: 300px;
  height: 30px;
  background-color: #FEE500;
  justify-content: center;
  align-items: center;
  padding: 9px 0;
  font-weight: 500;
  border: 1px solid transparent;
  cursor: pointer;


  transition: background-color 0.1s ease-in-out, border-color 0.1s ease-in-out, color 0.1s ease-in-out;

  svg {
    margin-right: 8px;
  }

  &:hover {
    background-color: #ffdd00;
  }
`

export default KakaoLogin;