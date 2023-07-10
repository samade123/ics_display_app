<template>
  <div style="overflow: scroll">
    <input ref="input" v-if="!json" type="file" accept=".ics" @change="handleFileUpload" />
    <div class='event-group' v-if="json">

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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
