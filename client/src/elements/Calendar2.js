import React, { useState } from 'react'
import Calendar from 'react-calendar';
import './Calendar.css'
import moment from 'moment';




const Calendar2 = () => {


  const [date, setDate] = useState(new Date());

  return (
    <div className='app'>
      <h1 className='text-center'>Calendar with Range</h1>
      <div className='calendar-container' 
      style={{background: '#f8f8fa',
            color: '#6f48eb'}}>
        <Calendar
          onChange={setDate}
          value={date}
          selectRange={true}
          formatDay={(locale, date) => moment(date).format("DD")}
          maxDetail="month"
          className="mx-auto w-full text-sm border-b"
        />
      </div>
      {date.length > 0 ? (
        <p className='text-center'>
          <span className='bold'>Start:</span>{' '}
          {date[0].toDateString()}
          &nbsp;|&nbsp;
          <span className='bold'>End:</span> {date[1].toDateString()}
        </p>
      ) : (
        <p className='text-center'
        style={{background: '#f8f8fa',
            color: '#6f48eb'}}>
          <span className='bold'>Default selected date:</span>{' '}
          {date.toDateString()}
        </p>
      )}
    </div>
  );
}

export default Calendar2