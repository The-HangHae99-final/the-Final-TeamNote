import './App.css';
import styled from 'styled-components';
import { Routes, Route } from 'react-router-dom';
  // **** pages**** //
import CalendarMain from './elements/Calendar';
import Calendar2 from './elements/Calendar2';
import KakaoLogin from './elements/KakaoLogin';
import KakaoCallback from './elements/KakaoCallback';




function App() {

  return (
    <>
    <Routes>
      <Route exact path="/" element={< CalendarMain/>} />
      <Route exact path="/2" element={< Calendar2 />} />
      <Route exact path="/login" element={< KakaoLogin />} /> 
      <Route exact path="/oauth/callback/kakao" element={< KakaoCallback />} /> 
    </Routes>
  </>
  );
}



export default App;
