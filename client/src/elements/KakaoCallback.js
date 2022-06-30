// 리다이렉트될 화면
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
// import { instance } from '../servers/axios';

const KakaoCallback = () => {
  // const params = useParams();
  // const code = params.get("code");
  // params = new URL(window.location.toString()).searchParams;
  console.log(window.location.href);
  console.log(new URL(window.location.href).searchParams.get('code'));
  const code = new URL(window.location.href).searchParams.get('code');

  useEffect(() => {
    const Kakao = async (code) => {
      return await axios.post(`/auth/kakao?code=${code}`).then(() => {
        console.log(code);
      });
    };
  }, []);

  return (
    <>
      <p>Waiting...</p>
    </>
  );
};

export default KakaoCallback;
