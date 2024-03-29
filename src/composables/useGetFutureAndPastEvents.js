import { ref } from 'vue';
import { compareDesc, isFuture, parse } from 'date-fns'


export function useGetFutureAndPastEvents() {
  const convertToISO8601 = (dateTimeString) => {
    if (dateTimeString.length > 8) {
      const year = dateTimeString.slice(0, 4);
      const month = dateTimeString.slice(4, 6);
      const day = dateTimeString.slice(6, 8);
      const hours = dateTimeString.slice(9, 11) || '00';
      const minutes = dateTimeString.slice(11, 13) || '00';
      const seconds = dateTimeString.slice(13, 15) || '00';

      const iso8601String = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
      return iso8601String;
    } else {
      const year = dateTimeString.slice(0, 4);
      const month = dateTimeString.slice(4, 6);
      const day = dateTimeString.slice(6, 8);

      const iso8601String = `${year}-${month}-${day}T00:00:00Z`;
      return iso8601String;
    }
  };

  const sortByDateDesc = (a, b) => {
    return compareDesc(a.date, b.date);
  }

  const getAllEvents = (jsonObject) => {
    const allEvents = ref([]);

    // console.log("allevents" , jsonObject);


    const events = jsonObject.VCALENDAR[0].VEVENT;

    for (const event of events) {
      const dtStartKey = Object.keys(event).find((key) => key.includes("DTSTART"));
      const startDate = convertToISO8601(event[dtStartKey]);

      allEvents.value.push(event);
    }

    allEvents.value.sort((a, b) => {
      const startDateAKey = Object.keys(a).find((key) => key.includes("DTSTART"));
      const startDateBKey = Object.keys(b).find((key) => key.includes("DTSTART"));
      const startDateA = convertToISO8601(a[startDateAKey]);
      const startDateB = convertToISO8601(b[startDateBKey]);
      return compareDesc(new Date(startDateA), new Date(startDateB));
    });
    // console.log("allevents" , allEvents.value);

    return allEvents.value;


  }


  const getFutureEvents = (jsonObject) => {
    const futureEvents = ref([]);

    const events = jsonObject.VCALENDAR[0].VEVENT;

    for (const event of events) {
      const dtStartKey = Object.keys(event).find((key) => key.includes("DTSTART"));
      const startDate = convertToISO8601(event[dtStartKey]);
      // console.log(event[dtStartKey], startDate)

      if (new Date(startDate) > new Date()) {
        futureEvents.value.push(event);
      }
    }

    futureEvents.value.sort((a, b) => {
      const startDateAKey = Object.keys(a).find((key) => key.includes("DTSTART"));
      const startDateBKey = Object.keys(b).find((key) => key.includes("DTSTART"));
      const startDateA = convertToISO8601(a[startDateAKey]);
      const startDateB = convertToISO8601(b[startDateBKey]);
      return new Date(startDateA) - new Date(startDateB);
    });

    // console.log(futureEvents)

    return futureEvents.value;
  };


  const getPastEvents = (jsonObject) => {
    const pastEvents = ref([]);

    const events = jsonObject.VCALENDAR[0].VEVENT;
    // console.log(events);

    for (const event of events) {
      const dtStartKey = Object.keys(event).find((key) => key.includes("DTSTART"));
      const startDate = convertToISO8601(event[dtStartKey]);

      if (new Date(startDate) <= new Date()) {
        pastEvents.value.push(event);
      }
    }

    pastEvents.value.sort((a, b) => {
      const startDateAKey = Object.keys(a).find((key) => key.includes("DTSTART"));
      const startDateBKey = Object.keys(b).find((key) => key.includes("DTSTART"));
      const startDateA = convertToISO8601(a[startDateAKey]);
      const startDateB = convertToISO8601(b[startDateBKey]);
      return new Date(startDateB) - new Date(startDateA);
    });

    return pastEvents.value;
  };


  const getLastEvent = (jsonObject, pastEvent) => {
    let events = jsonObject.VCALENDAR[0].VEVENT;

    if (events.length === 0) {
      return null; // Return null if there are no events
    }

    let lastEvent = events[events.length - 1];
    if (pastEvent && pastEvent.length > 0) {
      lastEvent = pastEvent[0];
    }


    const startDateAKey = Object.keys(lastEvent).find((key) => key.includes("DTSTART"));
    // console.log(lastEvent, "last event", startDateAKey)
    const startDate = convertToISO8601(lastEvent[startDateAKey]);
    const date = new Date(startDate);
    const eventDay = getDayOfWeek(date);
    const eventTime = getTime(date);

    return {
      eventName: lastEvent.SUMMARY,
      eventDay,
      date: date.toDateString(),
      month: getMonth(date.getMonth()),
      dateDate: date.getDate(),
      time: eventTime,
    };
  };

  const getFirstEvent = (futureEvents) => {


    // let firstEvent = events[events.length - 1];
    // if (futureEvents && futureEvents.length > 0) {
    let firstEvent = futureEvents[0];
    // }


    const startDateAKey = Object.keys(firstEvent).find((key) => key.includes("DTSTART"));
    // console.log(firstEvent, "first event", startDateAKey)
    const startDate = convertToISO8601(firstEvent[startDateAKey]);
    const date = new Date(startDate);
    const eventDay = getDayOfWeek(date);
    const eventTime = getTime(date);

    return {
      eventName: firstEvent.SUMMARY,
      eventDay,
      date: date.toDateString(),
      month: getMonth(date.getMonth()),
      dateDate: date.getDate(),
      time: eventTime,
    };
  };

  const getNextEvent = (jsonObject) => {
    const events = jsonObject.VCALENDAR[0].VEVENT;

    if (events.length === 0) {
      return null; // Return null if there are no events
    }

    const nextEvent = events[0];
    const startDate = convertToISO8601(nextEvent.DTSTART);
    const date = new Date(startDate);
    const eventDay = getDayOfWeek(date);
    const eventTime = getTime(date);

    return {
      eventName: nextEvent.name,
      eventDay,
      date: date.toDateString(),
      time: eventTime,
    };
  };

  const getTodaysEvents = (jsonObject) => {
    const today = new Date();
    const todaysEvents = ref([]);

    const events = jsonObject.VCALENDAR[0].VEVENT;

    for (const event of events) {
      const startDate = convertToISO8601(event.DTSTART);

      if (startDate.startsWith(today.toISOString().slice(0, 10))) {
        todaysEvents.value.push(event);
      }
    }

    return todaysEvents.value;
  };

  const getNextThreeHours = (date = new Date()) => {
    const nextThreeHours = [];
    const startHour = Math.floor(date.getTime() / (1000 * 60 * 60)) * (1000 * 60 * 60);

    for (let i = 0; i < 3; i++) {
      const hour = new Date(startHour + i * (1000 * 60 * 60));
      nextThreeHours.push(hour);
    }
    // console.log(nextThreeHours)

    return nextThreeHours;
  };

  function getTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const time = `${padZero(hours)}:${padZero(minutes)}`;
    // const time = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
    return time;
  }

  function getDay(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const time = `${padZero(hours)}:${padZero(minutes)}`;
    // const time = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
    return time;
  }

  function getYear(date) {
    return date.getFullYear();
  }

  function getMonthAndDay(date) {
    const month = date.getMonth() + 1; // JavaScript months are 0-based, so add 1
    const day = date.getDate();

    return `${getMonth(month)} ${day}`;
  }

  function getMonth(month) {
    let date = new Date();
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];

    const monthIndex = month ? month : date.getMonth();
    return months[monthIndex];
  }

  function getDayOfWeek(date) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const dayIndex = date.getDay();
    return daysOfWeek[dayIndex];
  }

  function padZero(number) {
    return number.toString().padStart(2, '0');
  }

  const getEventLength = (event) => {
    const startDateTime = convertToISO8601(event.DTSTART);
    const endDateTime = convertToISO8601(event.DTEND);

    const startDate = new Date(startDateTime);
    const endDate = new Date(endDateTime);

    const duration = endDate - startDate;
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration / (1000 * 60)) % 60);

    let lengthString = '';
    if (hours > 0) {
      lengthString += `${hours} hr${hours !== 1 ? 's' : ''}`;
    }
    if (minutes > 0) {
      lengthString += `${hours > 0 ? ' ' : ''}${minutes} min${minutes !== 1 ? 's' : ''}`;
    }

    return lengthString;
  };

  function getDayOfMonth(date = new Date()) {
    return date.getDate();
  }



  // // Example usage
  // const date = new Date();
  // console.log('Time:', getTime(date));
  // console.log('Year:', getYear(date));
  // console.log('Month:', getMonth(date));
  // console.log('Day of the Week:', getDayOfWeek(date));


  return {
    getFutureEvents,
    getPastEvents,
    getTodaysEvents,
    getFirstEvent,
    convertToISO8601,
    getTime,
    getYear,
    getMonth,
    getDayOfWeek,
    getEventLength,
    getNextThreeHours,
    getDayOfMonth,
    getLastEvent,
    getNextEvent,
    getMonthAndDay,
    getAllEvents,
  };
}
