<template>
  <div style="overflow: scroll">
    <input ref="input" v-if="!json" type="file" accept=".ics" @change="handleFileUpload" />
    <div class="grid-container">
      <aside class="sidebar">
        <!-- Sidebar content -->
        <div class="event-block" v-for="event in allEvents" :key="event['UID']"> <h2>
          {{ event['SUMMARY'] }}
        </h2></div>
      </aside>

      <main class="main-content">
        <!-- Main content -->
      </main>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { convert } from 'ical2json';
import { storageManager } from '@/composables/storage';
import { useGetFutureAndPastEvents } from '@/composables/useGetFutureAndPastEvents';


export default {
  setup() {
    const json = ref(false);
    const futureEvents = ref(false);
    const pastEvents = ref(false);
    const lastEvent = ref(false);
    const firstEvent = ref(false);
    const allEvents = ref(false);



    let jsonData = ref({});
    const firstThreeDatesArray = ref([]);
    const { storage } = storageManager();
    const {
      getFutureEvents,
      getPastEvents,
      getTodaysEvents,
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
      getFirstEvent,
      getAllEvents,
    } = useGetFutureAndPastEvents();

    if (storage.doesDataExist('calendarJson')) {
      jsonData.value = storage.getData('calendarJson');
      json.value = storage.getData('calendarJson');
      firstThreeDatesArray.value = getFutureEvents(json.value).slice(0, 4);;
      futureEvents.value = getFutureEvents(json.value)
      pastEvents.value = getPastEvents(json.value)
      lastEvent.value = getLastEvent(json.value, pastEvents.value)
      firstEvent.value = getFirstEvent(futureEvents.value)
      allEvents.value = getAllEvents(json.value)



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

    return {
      json, handleFileUpload, jsonData,
      getFutureEvents,
      getPastEvents,
      getTodaysEvents,
      convertToISO8601,
      getTime,
      getYear,
      getMonth,
      getDayOfWeek,
      getEventLength,
      firstThreeDatesArray,
      getNextThreeHours,
      getDayOfMonth,
      futureEvents,
      pastEvents,
      lastEvent,
      firstEvent,
      getMonthAndDay,
      getAllEvents,
      allEvents,

    };
  },
};
</script>

<style lang="scss" scoped>
.grid-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-gap: 10px;
  place-content: center stretch;

  height: 100%;
  min-height: 513px;
  padding: 10px 0;
  box-sizing: border-box;
  font-size: 1rem;
  grid-column: 2;

  width: 100%;
  max-width: 900px;
  margin-inline: auto;

}

.sidebar {
  display: grid;
  gap: 10px;
  grid-column: 1;
  // min-width: 200px;
  background-color: #fff;
  padding: 10px;

  max-height: 533px;
  overflow: scroll; 

  div.event-block{


    h2 {
      font-size: 1.1rem;
      font-weight: 600;
      text-align: left;
      margin: 0;
    }
  }
}

.main-content {
  grid-column: 2;
  background-color: #f0f0f0;
  padding: 10px;
}
</style>
