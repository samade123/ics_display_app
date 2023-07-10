<template>
  <div style="overflow: scroll">
    <input ref="input" type="file" accept=".ics" @change="handleFileUpload" />
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
    } = useGetFutureAndPastEvents();

    if (storage.doesDataExist('calendarJson')) {
      jsonData.value = storage.getData('calendarJson');
      json.value = storage.getData('calendarJson');
      firstThreeDatesArray.value = getPastEvents(json.value);
      onMounted(() => {

        firstThreeDatesArray.value.forEach((date) => {
          date['NEWCREATED'] = new Date(convertToISO8601(date['CREATED']))
          date['NEWDTSTART'] = new Date(convertToISO8601(date['DTSTART']))
          date['NEWDTEND'] = new Date(convertToISO8601(date['DTEND']))
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
      json, handleFileUpload, jsonData
    };
  },
};
</script>
