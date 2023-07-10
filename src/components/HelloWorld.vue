<template>
  <div style="overflow: scroll">
    <input ref="input" v-if="!json" type="file" accept=".ics" @change="handleFileUpload" />
    <div class='event-group' v-if="json">

      <div class="event-summary"><span class="no-of-tasks">48</span><span>Tasks done</span></div>
      <div class="event-summary">Next event is</div>
      <div class="event-summary">Last event was</div>
      <div class="event-summary"><span class="no-of-tasks">12</span><span>Future Events</span></div>
      <div class="event-summary today">
        <div class="date">
          <span>{{ getDayOfMonth() }} DEC</span>
          <h3>{{ getDayOfWeek(new Date()) }}</h3>
        </div>
        <div v-for="hour in getNextThreeHours()" class="event-slot" :key="hour">
          <h4>
            {{ getTime(hour) }}
          </h4>
        </div>
      </div>

      <div class="event" v-for='calendar in  firstThreeDatesArray' :key="calendar['CREATED']">
        <!-- {{ calendar['NEWCREATED'] }} -->
        <h3>{{ calendar['SUMMARY'] }}</h3>
        <div class="icon"></div>
        <div class="time">
          {{ getTime(new Date(calendar['NEWDTSTART'])) }}
          <span>start</span>
        </div>
        <div class="length" v-if="calendar.length > 0"> {{ getEventLength(calendar) }}</div>
        <div class="time end">
          {{ getTime(new Date(calendar['NEWDTEND'])) }}
          <span>end</span>

        </div>
      </div>
      <div class="event-summary next-day">Events tomorrow</div>
      <div class="event-summary second-next-day">Events day after tomorrow</div>

    </div>
  </div>
</template>

<script>
import { storageManager } from '@/composables/storage';
import { useGetFutureAndPastEvents } from '@/composables/useGetFutureAndPastEvents';
export default {
    if (storage.doesDataExist('calendarJson')) {
      jsonData.value = storage.getData('calendarJson');
      json.value = storage.getData('calendarJson');
      firstThreeDatesArray.value = getFutureEvents(json.value).slice(0, 3);;
      // firstThreeDatesArray.value = jsonData.value["VCALENDAR"][0]["VEVENT"];
      // console.log("test - future", getFutureEvents(json.value))
      // console.log("test", getPastEvents(json.value))

      onMounted(() => {

        const calendarCreatedKey = Object.keys(firstThreeDatesArray.value[0]).find(key => key.includes('CREATED') || key.includes('DTSTAMP'));
        const calendarStartedKey = Object.keys(firstThreeDatesArray.value[0]).find(key => key.includes('DTSTART'));
        const calendarEndedKey = Object.keys(firstThreeDatesArray.value[0]).find(key => key.includes('DTEND'));

        firstThreeDatesArray.value.forEach((date) => {
          date['NEWCREATED'] = new Date(convertToISO8601(date[calendarCreatedKey]))
          date['NEWDTSTART'] = new Date(convertToISO8601(date[calendarStartedKey]))
          date['NEWDTEND'] = new Date(convertToISO8601(date[calendarEndedKey]))
          // console.log(date)
        })
      })
    }

    const handleFileUpload = () => {
      const file = event.target.files[0];

      if (!file) return;

      const reader = new FileReader();


      reader.onload = () => {
        const icsData = reader.result;
        jsonData.value = convert(icsData);
        storage.storeData('calendarJson', jsonData.value)
        json.value = JSON.stringify(jsonData);
      };

      reader.readAsText(file);
    };
  },
};
</script>

<style lang="scss">
.event-group {
  display: grid;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.7rem;
  --tile-color: #E4B875;
  --text-color: #333A;
  --small-font: 0.8rem;
  --large-font: 3em;
  --date-large-font: 2.2em;

  width: 100%;
  max-width: 900px;
  margin-inline: auto;


  >div {
    // &.event {
    min-height: 120px;
    // width: 100%;
    display: grid;
    place-items: center;
    background: var(--tile-color);
    // color: #333b;
    border-radius: 15px;
    padding-inline: 10px;
    box-sizing: border-box;

    // &:is(.time) {
    //   --tile-color: none;
    // }


    // }
    &:nth-last-child(3) {
      --tile-color: #C8CBF0;
    }

    &:nth-last-child(2) {
      --tile-color: #BDD5E6;
    }

    &:nth-last-child(1) {
      --tile-color: #EFDAB2;
    }

    &.event-summary {
      h3 {
        margin: 0;
      }

      &.today {
        grid-column: 1 / span 1;
        grid-row: span 2;
        --tile-color: #DDBEA7;
        grid-template-rows: auto 1fr 1fr 1fr;
        gap: 3px;

        h3 {
          font-size: var(--small-font);
        }

        .date {
          margin: 0;
          font-size: var(--large-font);
          font-size: var(--date-large-font);
          color: var(--text-color);
          // display: grid;
          // place-items: start;
          text-align: start;
          width: 100%;

          span {
            margin-block-end: 0.1rem;

          }

        }

        .event-slot {
          place-items: start;
          display: grid;
          width: 100%;
          border-top: var(--text-color) 1px solid;
          padding-block: 7px 0;
          height: 100%;
          box-sizing: border-box;

          h4 {
            font-size: var(--small-font);
            color: var(--text-color);
            margin: 0;
          }
        }
      }

      &:first-child {
        grid-column: 1 / span 1;
        --tile-color: #B0BBBC;

      }

      &:nth-child(2) {
        grid-column: 2 / span 2;
        --tile-color: #CB9CA3;

      }

      &:nth-child(3) {
        grid-column: 1 / span 2;
        --tile-color: #9DCBC9;
      }

      &:nth-child(4) {
        grid-column: 3 / span 1;
        --tile-color: #C1CB9C;
      }


      .no-of-tasks {
        font-size: 3em;
        font-weight: 700;
        color: #3339;
        // color: 3331;

      }


    }

    &.event {
      grid-template-rows: 1fr auto;
      grid-template-columns: 1fr 2fr 1fr;
      place-items: start;
      padding: 10px;
      color: var(--text-color);


h3 {
        grid-column: span 2;
        margin: 0;

      }

      .icon {
        grid-column: span 1;
        background: black;
        border-radius: 50%;
        // height: 30%;
        width: 20%;
        aspect-ratio: 1;
        padding-inline: 10px;
        margin-inline: 10px;
        box-sizing: border-box;

        place-self: end;
        align-self: start;
      }

      .time {
        display: flex;
        flex-direction: column;
        gap: 2px;

        font-size: 1.25rem;

        span {
          font-size: 1rem;
          text-transform: capitalize;
          text-align: start;
          // font-size: 0.8rem;
          font-size: var(--small-font);


        }
      }

      .time.end {
        place-self: end;
      }

      .length {
        background: var(--text-color);
        color: var(--tile-color);
        padding: 8px 10px 6px 10px;
        border-radius: 50px;
        /* margin: 0 23px; */
        place-self: center;
        min-width: 50px;
        font-size: var(--small-font);

      }



    }
  }

  @media only screen and (max-width: 600px) {
    /*Tablets [601px -> 1200px]*/

    // .event-group {
    //   display: grid;
    //   grid-template-columns: 1fr 1fr 1fr 1fr;
    // }



    div {

      &.event,
      &.next-day,
      &.second-next-day {
        display: none;
      }

      &:nth-last-child(3) {
        --tile-color: #C8CBF0;
      }

      &:nth-last-child(2) {
        --tile-color: #BDD5E6;
      }

      &:nth-last-child(1) {
        --tile-color: #EFDAB2;
      }

      &.event-summary {
        &.today {
          grid-column: span 3;
        }

        &:first-child {
          grid-column: 1 / span 2;
          // display: none;
          --tile-color: #B0BBBC;
        }

        &:nth-child(2) {
          grid-column: 1 / span 3;

        }

        &:nth-child(3) {
          display: none;
          grid-column: 1 / span 2;
          --tile-color: #9DCBC9;
        }

        &:nth-child(4) {
          grid-column: 3 / span 1;
          grid-row: 1;
          --tile-color: #C1CB9C;
        }


        .no-of-tasks {
          font-size: 3em;
          font-weight: 700;
          color: var(--tile-color);
          // color: 3331;

        }
}
}
}

}
</style>
