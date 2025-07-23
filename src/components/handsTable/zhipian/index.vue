<template>
  <div>
    <!-- <div style="display: flex">
      <div @click="hiddenRows">行隐藏</div>
      <select v-model="selectedCategory" @change="applyFilter" class="filter-select" style="border: 1px solid grey">
        <option v-for="category in huanSelect" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div> -->
    <!-- <div @click="setCellReadonly">将第1行第1列单元格设置为可编辑</div> -->
    <div style="display: flex; align-items: center; height: 40px; margin-top: 20px; border-radius: 8px">
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          margin-left: 20px;
          color: white;
          cursor: pointer;
          background-color: #ff6347;
          border-radius: 5px;
        "
        @click="filterIfClick('买量')"
      >
        买量
      </div>
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          margin-left: 40px;
          color: white;
          cursor: pointer;
          background-color: #9acd32;
          border-radius: 5px;
        "
        @click="filterIfClick('番剧')"
      >
        番剧
      </div>
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          margin-left: 40px;
          color: white;
          cursor: pointer;
          background-color: #9932cc;
          border-radius: 5px;
        "
        @click="filterIfClick('AI')"
      >
        AI
      </div>
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          margin-left: 40px;
          color: white;
          cursor: pointer;
          background-color: #ffce20;
          border-radius: 5px;
        "
        @click="filterIfClick('电影')"
      >
        电影
      </div>
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          margin-left: 40px;
          color: white;
          cursor: pointer;
          background-color: #4876ff;
          border-radius: 5px;
        "
        @click="filterIfClick('其他')"
      >
        其他
      </div>
      <i style="margin-left: 40px; font-size: 25px" class="iconfont icon-15qingkong-1" @click="clearFilter()"></i>

      <div style="display: flex; align-items: center; margin-left: 60px">
        <div style="display: flex; align-items: center">
          <div>多维表格</div>
          <el-switch v-model="dwb" @change="toggleDwb" />
        </div>
        <div style="display: flex; align-items: center; margin-left: 10px">
          <div>甘特图</div>
          <el-switch v-model="gantetu" @change="toggleGantetu" />
        </div>
      </div>
    </div>

    <div style="display: flex; margin-top: 20px; margin-left: 20px">
      <div style="display: flex; align-items: center; width: 250px; white-space: nowrap">
        <div>项目等级：</div>
        <el-select v-model="selectedPro" placeholder="请选择项目等级" @change="filterIfClick()">
          <el-option v-for="item in prolevelOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
        <i style="margin-left: 5px" class="iconfont icon-15qingkong-1" @click="clearFilter()"></i>
      </div>

      <div style="display: flex; align-items: center; width: 200px; margin-left: 40px; white-space: nowrap">
        <div>制片：</div>
        <el-select v-model="selectedZhipian" placeholder="请选择制片" @change="filterIfClick()">
          <el-option v-for="item in zhipianSelectOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
        <i style="margin-left: 5px" class="iconfont icon-15qingkong-1" @click="clearFilter()"></i>
      </div>

      <div style="display: flex; align-items: center; width: 250px; margin-left: 40px; white-space: nowrap">
        <div>进度状态：</div>
        <el-select v-model="selectedProgress" placeholder="请选择进度状态" @change="filterIfClick()">
          <el-option v-for="item in progresStatuOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <i style="margin-left: 5px" class="iconfont icon-15qingkong-1" @click="clearFilter()"></i>
      </div>
    </div>

    <div v-if="dwb" style="">
      <div v-if="hottable_csh" style="margin-top: 30px; margin-left: 30px">
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
          height="auto"
          filters="true"
          :language="language"
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

      <HotTable
        ref="yourTableRef"
        style="margin-top: 30px; margin-left: 30px"
        :data="filterData"
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
        height="auto"
        filters="true"
        :language="language"
        v-if="filterIf1"
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
      <HotTable
        ref="yourTableRef"
        style="margin-top: 30px; margin-left: 30px"
        :data="filterData"
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
        height="auto"
        filters="true"
        :language="language"
        v-if="filterIf2"
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

    <div v-if="gantetu">
      <GanttChart />
    </div>
  </div>
</template>

<script src="./index.js"></script>

<style>
.read-only-cell {
  color: #666666;
  background-color: #f0f0f0;
}
</style>
