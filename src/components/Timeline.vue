<template>
  <FullCalendar :options="calendarOptions" />
</template>

<script>
import { defineComponent, ref } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
// import "@fullcalendar/resource-timeline/index.css";

export default defineComponent({
  components: {
    FullCalendar
  },
  setup() {
    const calendarOptions = ref({
      plugins: [resourceTimelinePlugin],
      initialView: "resourceTimelineDay",
      resources: [
        { id: "a", title: "Room A" },
        { id: "b", title: "Room B" }
      ],
      events: [
        {
          id: "1",
          resourceId: "a",
          start: "2023-10-05T09:00:00",
          end: "2023-10-05T14:00:00",
          title: "Meeting"
        },
        {
          id: "2",
          resourceId: "b",
          start: "2023-10-06T12:00:00",
          end: "2023-10-06T18:00:00",
          title: "Conference"
        }
      ]
    });

    return {
      calendarOptions
    };
  }
});
</script>

<style>
/* @import "~@fullcalendar/core/main.css";
@import "~@fullcalendar/resource-timeline/main.css"; */
</style>
