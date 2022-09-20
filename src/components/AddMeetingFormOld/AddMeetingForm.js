import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { actions, useStore } from '../../AppContext';
import { startIsLess } from '../../Helpers';
import { GET_BUILDINGS } from '../../Queries';
import './AddMeetingForm.css';

const AddMeetingForm = ({ className = '' }) => {
  const { loading: buildingsLoading, error: buildingsError, data: buildingsData } = useQuery(GET_BUILDINGS);
  const { Buildings: buildings } = buildingsData || {};
  const titleRef = useRef();
  const dateRef = useRef();
  const startTimeRef = useRef();
  const endTimeRef = useRef();
  const buildingRef = useRef();
  const {
    dispatch,
    state: {
      formData: { title, date, startTime, endTime },
    },
  } = useStore();
  let navigate = useNavigate();

  // const validYear = (startTime, endTime) => {
  //   return startTime < endTime;
  // }

  const validate = () => {
    const { title, year, month, date, startTime, endTime, buildingId } = getInputs();
    if (!startIsLess(startTime, endTime)) {
      return { message: 'Start time should be earlier than End Time' };
    }
    if (year > '9999') {
      return { message: 'Please select a reasonable year!' };
    }
    const startTimeArray = startTime.split(':');
    const endTimeArray = endTime.split(':');
    const startMin = parseInt(startTimeArray[0]) * 60 + parseInt(startTimeArray[1]);
    const endMin = parseInt(endTimeArray[0]) * 60 + parseInt(endTimeArray[1]);

    if (endMin - startMin < 15) {
      return { message: 'Meeting should be atleast 15 mins long' };
    }

    return false;
  };

  const getInputs = () => {
    const title = titleRef.current.value;
    const [year, month, date] = dateRef.current.value.split('-');
    const startTime = startTimeRef.current.value;
    const endTime = endTimeRef.current.value;
    const buildingId = buildingRef.current.value;

    return {
      title,
      year,
      month,
      date,
      startTime,
      endTime,
      buildingId,
    };
  };

  const handleFormSubmit = e => {
    e.preventDefault();

    const { title, year, month, date, startTime, endTime, buildingId } = getInputs();
    const hasErrors = validate();

    if (!hasErrors) {
      dispatch({
        type: actions.SET_FORM_DATA,
        payload: {
          title,
          date: `${date}/${month}/${year}`,
          startTime,
          endTime,
          buildingId: parseInt(buildingId),
        },
      });
      navigate('/create-meeting/select-room');
    } else {
      alert(hasErrors.message);
    }
  };

  const handleBlur = () => {
    const hasErrors = validate();

    if (hasErrors) {
      alert(hasErrors.message);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="page-container add-meeting-form">
      <div className="input-grid">
        <label htmlFor="title">Title</label>
        <input id="title" ref={titleRef} required defaultValue={title} />
        <label htmlFor="date">Date</label>
        <input id="date" type="date" ref={dateRef} required defaultValue={date} />
        <label htmlFor="start-time">Start Time</label>
        <input id="start-time" type="time" ref={startTimeRef} required defaultValue={startTime} />
        <label htmlFor="end-time">End Time</label>
        <input id="end-time" type="time" ref={endTimeRef} required defaultValue={endTime} onBlur={handleBlur} />
      </div>
      {buildingsLoading && <p>Loading</p>}
      {buildingsError && <p>Error :(</p>}
      {!buildingsLoading && !buildingsError && (
        <select ref={buildingRef} className="building-dropdown" required defaultValue="">
          <option value="" disabled>
            Select a building
          </option>
          {buildings?.map(({ name, id }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      )}
      <button type="submit" className="primary-cta">
        Next
      </button>
    </form>
  );
};

AddMeetingForm.propTypes = {
  className: PropTypes.string,
};

export default AddMeetingForm;
