import axios from "axios";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import styled from "styled-components";

import 'react-calendar/dist/Calendar.css';
import Grid from "./Grid";

const CalendarMain = () => {
  const [value, onChange] = useState(new Date());
  const [mark, setMark] = useState([]);
  const marks = [
    "2022-06-07",
    "2022-06-10",
    "2022-06-23",
    "2022-06-23",
  ];
  const [editInfo, setEditInfo] = useState({
    title: "",
    description: "",
  });
  const ttRef = useRef(null);
  const dcRef = useRef(null);
  console.log(editInfo);


  //useeffect
  useEffect(() => {
    const daydata = async () => {
      try {
        const response = await axios.get(
          "http://3.36.74.108:3000/api/day"
        );
        setMark(response.data);
        // setPost(response.data.body)
        console.log(response.data);
      } catch (e) {
        console.log(e);
      }
    };
    daydata()
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    const { value, name } = e.target;
    setEditInfo({ ...editInfo, [name]: value });
  };


  return (
    <div >
      <Calendar
        onChange={onChange}
        value={value}
        locale={"ko"}
        showNeighboringMonth={false}
        prev2Label={null}
        next2Label={null}
        minDetail="month"
        maxDetail="month"
        formatDay={(locale, date) => moment(date).format("D")}
        calendarType={"US"}
        tileContent={({ date, view }) => {
          if (mark.find((x) => x === moment(date).format("YYYY-MM-DD"))) {
            return (
              <>
                <div style={{ display: 'flex', flexFlow: 'row', justifyContent: 'center' }}>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </>
            );
          }
        }}
      />
      <div className="text-gray-500 mt-4">
        {moment(value).format("YYYY년 MM월 DD일")}
      </div>
     
        <input
          className="form-input"
          name="title"
          placeholder="일정명"
          maxLength="20"
          ref={ttRef}
          required
        />

        <input
          className="form-input"
          name="title"
          placeholder="일정명"
          ref={dcRef}
          required
        />


    </div>
  );
};



const Textarea = styled.textarea`
  width: 95%;
  padding: 10px;
  margin: 10px 0px 13px;
  font-size: 13px;
  border-radius: 4px;
  border: 1px solid #d1d1d1;
  transition: border 0.1s ease-in-out;
  resize: none;

  &:focus {
    outline: none;
    border: 1px solid #111;
  }
`

export default CalendarMain;
