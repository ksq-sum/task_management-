<template>
  <div>
    <HotTable
      ref="yourTableRef"
      :data="data"
      manualRowInsert="true"
      preventOverflow="horizontal"
      :rowHeaders="true"
      :colWidths="200"
      :colHeaders="colHeaders"
      :afterChange="handleAfterChange"
      licenseKey="non-commercial-and-evaluation"
      themeName="ht-theme-main"
      dropdownMenu="true"
      nestedRows="true"
      contextMenu="true"
      bindRowsWithHeaders="true"
      autoWrapRow="true"
      hiddenRows="true"
      autoWrapCol="true"
      filters="true"
      :language="language"
      v-if="!filterIf"
    >
      <HotColumn title="项目名称" data="project_name" dropdownMenu="true"></HotColumn>
      <HotColumn title="英文名" data="eng_name" dropdownMenu="true"></HotColumn>
      <HotColumn
        width="150"
        title="项目类型"
        data="project_type"
        :renderer="protypeRenderer"
        filters="true"
        dropdownMenu="true"
        type="dropdown"
        :source="typeOptions"
        @ckick="clicTaskName"
      >
      </HotColumn>
      <HotColumn
        title="项目等级"
        type="dropdown"
        colWidths="100"
        data="level"
        dropdownMenu="true"
        :renderer="protypeRenderer"
        :source="levelOptions"
      ></HotColumn>
      <HotColumn
        title="制片"
        colWidths="50"
        data="zhipian"
        :renderer="peopleRenderer"
        :dropdownMenu="true"
        type="dropdown"
        :source="personOptions"
      ></HotColumn>
      <HotColumn
        title="进度状态"
        :renderer="protypeRenderer"
        data="taskProgress"
        :dropdownMenu="true"
        type="dropdown"
        :source="taskProgressOptions"
      ></HotColumn>
      <HotColumn title="项目备注" width="100" data="project_back" :dropdownMenu="true"></HotColumn>
      <HotColumn title="资产开始时间" data="startTime" dropdownMenu="true"></HotColumn>

      <HotColumn title="资产结束时间" data="endTime" :filters="true" :dropdownMenu="true"></HotColumn>
    </HotTable>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { HotTable, HotColumn } from "@handsontable/vue3";
import "handsontable/styles/handsontable.min.css";
import "handsontable/styles/ht-theme-main.min.css";

export default defineComponent({
  data() {
    return {
      data: [
        {
          project_name: "项目1",
          eng_name: "eng_name1",
          project_type: "1",
          level: "1",
          zhipian: "1",
          taskProgress: "1",
          project_back: "1",
          startTime: "2022-01-01",
          endTime: "2022-01-01"
        }
      ]
    };
  }
});
</script>

<style>
.read-only-cell {
  color: #666666;
  background-color: #f0f0f0;
}
</style>
