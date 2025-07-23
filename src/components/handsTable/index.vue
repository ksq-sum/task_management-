<template>
  <div>
    <el-dialog v-model="dialogTableVisible" title="选择开始时间" width="400" align-center>
      <el-date-picker
        style="margin-left: 20px"
        v-model="value2"
        type="datetime"
        placeholder="Select date and time"
        :shortcuts="shortcuts"
      />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogTableVisible = false">取消</el-button>
          <el-button type="primary" @click="getStartDateTime"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- <div style="display: flex">
      <div @click="hiddenRows">行隐藏</div>
      <select v-model="selectedCategory" @change="applyFilter" class="filter-select" style="border: 1px solid grey">
        <option v-for="category in huanSelect" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div> -->
    <!-- <div @click="setCellReadonly">将第1行第1列单元格设置为可编辑</div> -->
    <div v-if="dwb">
      <div style="display: flex; height: 40px; margin-top: 10px; border-radius: 8px">
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px;
            margin-left: 20px;
            cursor: pointer;
            background-color: #c3e6cb;
            border-radius: 5px;
          "
        >
          解限机
        </div>
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px;
            margin-left: 20px;
            cursor: pointer;
            background-color: #ffeeba;
            border-radius: 5px;
          "
        >
          大东家
        </div>
        <div style="display: flex; align-items: center; margin-left: 1200px">
          <div style="display: flex; align-items: center">
            <div>多维表格</div>
            <el-switch v-model="dwb" @change="toggleDwb" />
          </div>
          <div style="display: flex; align-items: center; margin-left: 20px">
            <div>甘特图</div>
            <el-switch v-model="gantetu" @change="toggleGantetu" />
          </div>
        </div>
      </div>

      <div style="display: flex; margin-top: 20px; margin-left: 20px">
        <div style="display: flex; align-items: center; width: 200px; white-space: nowrap">
          <div>任务名：</div>
          <el-select v-model="selectedTask" placeholder="请选择任务" @change="filterIfClick()">
            <el-option v-for="item in taskOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
          <i style="margin-left: 5px" class="iconfont icon-15qingkong-1" @click="clearFilter()"></i>
        </div>

        <div style="display: flex; align-items: center; width: 200px; margin-left: 40px; white-space: nowrap">
          <div>类型：</div>
          <el-select v-model="selectedProtype" placeholder="请选择类型" @change="filterIfClick()">
            <el-option v-for="item in protypeSelectOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <i style="margin-left: 5px" class="iconfont icon-15qingkong-1" @click="clearFilter()"></i>
        </div>

        <div style="display: flex; align-items: center; width: 200px; margin-left: 40px; white-space: nowrap">
          <div>等级：</div>
          <el-select v-model="selectedLevel" placeholder="请选择等级" @change="filterIfClick()">
            <el-option v-for="item in levelSelectOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <i style="margin-left: 5px" class="iconfont icon-15qingkong-1" @click="clearFilter()"></i>
        </div>

        <div style="display: flex; align-items: center; width: 200px; margin-left: 40px; white-space: nowrap">
          <div>环节：</div>
          <el-select v-model="huanjieSelectedTask" placeholder="请选择环节" @change="filterIfClick()">
            <el-option v-for="item in huanjieSelectOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <i style="margin-left: 5px" class="iconfont icon-15qingkong-1" @click="clearFilter()"></i>
        </div>

        <div style="display: flex; align-items: center; width: 200px; margin-left: 40px; white-space: nowrap">
          <div>人员：</div>
          <el-select v-model="peopleSelect" placeholder="请选择人员" @change="filterIfClick()">
            <el-option v-for="item in peopleSelectOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
          <i style="margin-left: 5px" class="iconfont icon-15qingkong-1" @click="clearFilter()"></i>
        </div>

        <div style="display: flex; align-items: center; width: 250px; margin-left: 40px; white-space: nowrap">
          <div>任务进度：</div>
          <el-select v-model="taskProgressSelect" placeholder="请选择任务进度" @change="filterIfClick()">
            <el-option v-for="item in taskProgressSelectOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <i style="margin-left: 5px" class="iconfont icon-15qingkong-1" @click="clearFilter()"></i>
        </div>
      </div>

      <HotTable
        ref="yourTableRef"
        style="margin-top: 30px; margin-left: 30px"
        :data="data"
        manualRowInsert="true"
        preventOverflow="horizontal"
        :rowHeaders="true"
        :colHeaders="colHeaders"
        :afterChange="handleAfterChange"
        :afterCreateRow="handleAfterCreateRow"
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
        v-if="!filterIf"
      >
        <HotColumn width="150" :renderer="taskNameRenderer" title="任务名" data="category" filters="true" dropdownMenu="true">
        </HotColumn>
        <!-- <HotColumn title="项目名称" :readOnly="true" data="artist" filters="false" dropdownMenu="true"></HotColumn> -->
        <HotColumn title="资产名称" data="title" dropdownMenu="true"></HotColumn>
        <HotColumn title="文件名" colWidths="100" data="label" dropdownMenu="true"></HotColumn>
        <HotColumn
          title="类型"
          colWidths="50"
          data="pro_type"
          :renderer="protypeRenderer"
          :dropdownMenu="true"
          type="dropdown"
          :source="protypeOptions"
        ></HotColumn>
        <HotColumn
          title="等级"
          :renderer="protypeRenderer"
          colWidths="50"
          data="level"
          :dropdownMenu="true"
          type="dropdown"
          :source="levelOptions"
        ></HotColumn>
        <HotColumn
          title="环节"
          width="100"
          data="huanjie"
          :dropdownMenu="true"
          type="dropdown"
          :renderer="protypeRenderer"
          :source="huanjieOptions"
        ></HotColumn>
        <HotColumn title="制作备注" data="makeback" dropdownMenu="true"></HotColumn>

        <HotColumn
          title="人员"
          data="person"
          :filters="true"
          :renderer="peopleRenderer"
          :dropdownMenu="true"
          type="dropdown"
          :source="personOptions"
        ></HotColumn>
        <HotColumn title="开始时间" data="startTime" :renderer="startTimeRenderer" type="text"></HotColumn>
        <HotColumn title="工时" data="gongshi" dropdownMenu="true"></HotColumn>
        <HotColumn title="截止时间" data="endTime" type="text" dropdownMenu="true"></HotColumn>
        <HotColumn
          title="任务进度"
          data="taskProgress"
          :filters="true"
          :dropdownMenu="true"
          type="dropdown"
          :renderer="protypeRenderer"
          :source="taskProgressOptions"
        ></HotColumn>
        <HotColumn title="完成路径" data="endPath" dropdownMenu="true"></HotColumn>
        <HotColumn title="状态" data="statu" dropdownMenu="true" :renderer="weekdayRenderer" width="80"> </HotColumn>
        <HotColumn title="图片&附件" data="picAttach" dropdownMenu="true"></HotColumn>
        <HotColumn title="最终结束时间" data="realEndTime" dropdownMenu="true"></HotColumn>
      </HotTable>

      <HotTable
        ref="yourTableRef"
        style="margin-top: 30px; margin-left: 30px"
        :data="filterData"
        manualRowInsert="true"
        preventOverflow="horizontal"
        :rowHeaders="true"
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
        <HotColumn
          width="150"
          :renderer="taskNameRenderer"
          title="任务名"
          data="category"
          filters="true"
          dropdownMenu="true"
          @ckick="clicTaskName"
        >
        </HotColumn>
        <!-- <HotColumn title="项目名称" :readOnly="true" data="artist" filters="false" dropdownMenu="true"></HotColumn> -->
        <HotColumn title="资产名称" data="title" dropdownMenu="true"></HotColumn>
        <HotColumn title="文件名" colWidths="100" data="label" dropdownMenu="true"></HotColumn>
        <HotColumn
          title="类型"
          colWidths="50"
          data="pro_type"
          :renderer="protypeRenderer"
          :dropdownMenu="true"
          type="dropdown"
          :source="protypeOptions"
        ></HotColumn>
        <HotColumn
          title="等级"
          :renderer="protypeRenderer"
          colWidths="50"
          data="level"
          :dropdownMenu="true"
          type="dropdown"
          :source="levelOptions"
        ></HotColumn>
        <HotColumn
          title="环节"
          width="100"
          data="huanjie"
          :dropdownMenu="true"
          type="dropdown"
          :renderer="protypeRenderer"
          :source="huanjieOptions"
        ></HotColumn>
        <HotColumn title="制作备注" data="makeback" dropdownMenu="true"></HotColumn>

        <HotColumn
          title="人员"
          data="person"
          :filters="true"
          :renderer="peopleRenderer"
          :dropdownMenu="true"
          type="dropdown"
          :source="personOptions"
        ></HotColumn>
        <HotColumn title="开始时间" data="startTime" :renderer="startTimeRenderer" type="text"></HotColumn>
        <HotColumn title="工时" data="gongshi" dropdownMenu="true"></HotColumn>
        <HotColumn title="截止时间" data="endTime" type="text" dropdownMenu="true"></HotColumn>
        <HotColumn
          title="任务进度"
          data="taskProgress"
          :filters="true"
          :dropdownMenu="true"
          type="dropdown"
          :renderer="protypeRenderer"
          :source="taskProgressOptions"
        ></HotColumn>
        <HotColumn title="完成路径" data="endPath" dropdownMenu="true"></HotColumn>
        <HotColumn title="状态" data="statu" dropdownMenu="true" :renderer="weekdayRenderer" width="80"> </HotColumn>
        <HotColumn title="图片&附件" data="picAttach" dropdownMenu="true"></HotColumn>
        <HotColumn title="最终结束时间" data="realEndTime" dropdownMenu="true"></HotColumn>
      </HotTable>

      <HotTable
        ref="yourTableRef"
        style="margin-top: 30px; margin-left: 30px"
        :data="filterData"
        manualRowInsert="true"
        preventOverflow="horizontal"
        :rowHeaders="true"
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
        <HotColumn
          width="150"
          :renderer="taskNameRenderer"
          title="任务名"
          data="category"
          filters="true"
          dropdownMenu="true"
          @ckick="clicTaskName"
        >
        </HotColumn>
        <!-- <HotColumn title="项目名称" :readOnly="true" data="artist" filters="false" dropdownMenu="true"></HotColumn> -->
        <HotColumn title="资产名称" data="title" dropdownMenu="true"></HotColumn>
        <HotColumn title="文件名" colWidths="100" data="label" dropdownMenu="true"></HotColumn>
        <HotColumn
          title="类型"
          colWidths="50"
          data="pro_type"
          :renderer="protypeRenderer"
          :dropdownMenu="true"
          type="dropdown"
          :source="protypeOptions"
        ></HotColumn>
        <HotColumn
          title="等级"
          :renderer="protypeRenderer"
          colWidths="50"
          data="level"
          :dropdownMenu="true"
          type="dropdown"
          :source="levelOptions"
        ></HotColumn>
        <HotColumn
          title="环节"
          width="100"
          data="huanjie"
          :dropdownMenu="true"
          type="dropdown"
          :renderer="protypeRenderer"
          :source="huanjieOptions"
        ></HotColumn>
        <HotColumn title="制作备注" data="makeback" dropdownMenu="true"></HotColumn>

        <HotColumn
          title="人员"
          data="person"
          :filters="true"
          :renderer="peopleRenderer"
          :dropdownMenu="true"
          type="dropdown"
          :source="personOptions"
        ></HotColumn>
        <HotColumn title="开始时间" data="startTime" :renderer="startTimeRenderer" type="text"></HotColumn>
        <HotColumn title="工时" data="gongshi" dropdownMenu="true"></HotColumn>
        <HotColumn title="截止时间" data="endTime" type="text" dropdownMenu="true"></HotColumn>
        <HotColumn
          title="任务进度"
          data="taskProgress"
          :filters="true"
          :dropdownMenu="true"
          type="dropdown"
          :renderer="protypeRenderer"
          :source="taskProgressOptions"
        ></HotColumn>
        <HotColumn title="完成路径" data="endPath" dropdownMenu="true"></HotColumn>
        <HotColumn title="状态" data="statu" dropdownMenu="true" :renderer="weekdayRenderer" width="80"> </HotColumn>
        <HotColumn title="图片&附件" data="picAttach" dropdownMenu="true"></HotColumn>
        <HotColumn title="最终结束时间" data="realEndTime" dropdownMenu="true"></HotColumn>
      </HotTable>
    </div>
    <div v-if="gantetu">
      <GanttChart1 @toggle-dwb="handleToggleDwb" />
      <!-- <GanttChart2 /> -->
    </div>
  </div>
</template>

<script src="./index.js"></script>

<style>
.read-only-cell {
  color: #666666;
  background-color: #f0f0f0;
}
.my-cell {
  background-color: rgb(202 202 188); /* 设置您需要的背景颜色 */
}
</style>
