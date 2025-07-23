<template>
  <div class="sec_body">
    <div class="sec_header">
      <div class="sec_nav">
        <a>项目预览</a>
        <a class="sec_active">资产</a>
        <a>镜头</a>
      </div>
      <h1>{{ key }}项目</h1>
    </div>

    <div class="sec_container">
      <div class="sec_left">
        <!-- 功能栏 -->
        <div class="main-gn" style="display: flex; justify-content: space-between; cursor: pointer">
          <div>
            <a @click="taskClick(3)" :style="{ color: taskClickThree ? 'white' : '#007bff' }">全部任务</a>
            <a @click="taskClick(1)" style="margin-left: 20px" :style="{ color: taskClickOne ? 'white' : '#007bff' }">审核任务</a>
            <a @click="taskClick(2)" style="margin-left: 20px" :style="{ color: taskClickTwo ? 'white' : '#007bff' }">制作任务</a>
          </div>
          <div>
            <!-- <el-button type="primary" @click="editAdudit($event)" v-if="clickAudit">修改审核预设</el-button> -->
            <el-button
              type="primary"
              style="color: #007aff; background-color: white; border-radius: 12px"
              @click="cgProStatuIsEditing"
              v-if="!isEditing"
              >编辑表格</el-button
            >
            <el-button
              type="primary"
              @click="cgProStatuIsEditing"
              v-if="isEditing"
              style="color: #74f8f3; background-color: black"
              >保存</el-button
            >
            <!-- <el-button @click="cgProStatu" style="background-color: grey">制作中...</el-button> -->
          </div>
        </div>
        <!-- 表格 -->
        <div class="main-content">
          <div :class="{ 'table-container-a': activeA, 'table-container': !activeA }" ref="tableContainer">
            <table class="table" style="margin-top: 1.5rem; background-color: white">
              <thead>
                <tr>
                  <th style="cursor: pointer" class="zp_th zg_slue" v-show="zp_show" @click="zp_show = !zp_show">
                    ...
                    <span class="tooltip"
                      >制片
                      <i style="margin-left: 0.2rem; font-size: 0.8rem" class="iconfont icon-youshensuo"></i>
                    </span>
                  </th>
                  <th v-show="!zp_show" class="zp_th" style="min-width: 8rem; white-space: nowrap">
                    信息缩略图
                    <span class="tooltip">
                      制片
                      <i
                        class="iconfont icon-zuoshensuo-"
                        style="margin-left: 0.2rem; font-size: 0.8rem"
                        @click="zp_show = !zp_show"
                      ></i>
                    </span>
                  </th>
                  <th v-show="!zp_show" class="zp_th">阶段</th>
                  <!-- <th v-show="!zp_show" class="zp_th">工作类型</th> -->
                  <th v-show="!zp_show" class="zp_th">主管</th>
                  <th v-show="!zp_show" class="zp_th">版本</th>
                  <th v-show="!zp_show" class="zp_th">人天</th>
                  <th v-show="!zp_show" class="zp_th">预计结束时间</th>

                  <th class="zg_th">制作人<span class="tooltip">管理</span></th>
                  <th class="zg_th">任务审核</th>
                  <th class="zg_th">截止到计时间</th>

                  <th class="zz_th" style="cursor: pointer" v-show="zz_show" @click="zz_show = !zz_show">
                    ...
                    <span class="tooltip"
                      >制作人<i class="iconfont icon-youshensuo" style="margin-left: 0.2rem; font-size: 0.8rem"></i
                    ></span>
                  </th>
                  <th class="zz_th" v-show="!zz_show">
                    开始时间
                    <span class="tooltip"
                      >制作人<i
                        class="iconfont icon-zuoshensuo-"
                        @click="zz_show = !zz_show"
                        style="margin-left: 0.2rem; font-size: 0.8rem"
                      ></i
                    ></span>
                  </th>
                  <th class="zz_th" v-show="!zz_show" style="width: 8rem">工作状态</th>
                  <th class="zz_th" v-show="!zz_show">完成时间</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(group, groupIndex) in groupedDesserts">
                  <tr @click="toggleGroup(groupIndex, group)">
                    <!-- <td><input type="checkbox" class="rowCheckbox" /></td> -->
                    <td colspan="14" :class="{ 'group-header': true, 'group-selected': group.headerSelected }">
                      <i class="iconfont icon-xiala" v-if="!group.ifXiala" style="font-size: 0.4rem"></i>
                      <i class="iconfont icon-fanhui-copy" v-if="group.ifXiala" style="font-size: 0.6rem"></i>
                      <span class="categorySpan" :class="{ categoryS: group.headerSelected }">{{ group.category }}</span>
                    </td>
                  </tr>
                  <template v-if="isGroupOpen(groupIndex)">
                    <tr
                      :class="{ trselected: dessert.td_select }"
                      v-for="(dessert, index) in group.items"
                      :key="dessert.code_name"
                      @click="clickCheckbox(dessert, group)"
                    >
                      <td v-show="zp_show">...</td>
                      <td
                        contenteditable="true"
                        v-if="isEditing"
                        @blur="updateDessert(dessert, index, 'thum_inf', $event.target.innerText, group)"
                        v-show="!zp_show"
                      >
                        {{ dessert.thum_inf }}
                      </td>
                      <td
                        v-show="!zp_show"
                        v-if="isEditing"
                        @blur="updateDessert(dessert, index, 'code_name', $event.target.innerText, group)"
                      >
                        {{ dessert.code_name }}
                      </td>
                      <!-- <td
                        v-if="isEditing"
                        contenteditable="false"
                        v-show="!zp_show"
                        @blur="updateDessert(dessert, index, 'work_type', $event.target.innerText, group)"
                      >
                        {{ dessert.work_type }}
                      </td> -->
                      <td
                        v-if="isEditing"
                        contenteditable="false"
                        v-show="!zp_show"
                        @blur="updateDessert(dessert, index, 'node_supervisor', $event.target.innerText, group)"
                      >
                        {{ dessert.node_supervisor }}
                      </td>
                      <td
                        v-show="!zp_show"
                        v-if="isEditing"
                        @blur="updateDessert(dessert, index, 'version', $event.target.innerText, group)"
                      >
                        {{ dessert.version }}
                      </td>
                      <td
                        v-if="isEditing"
                        contenteditable="false"
                        v-show="!zp_show"
                        @blur="updateDessert(dessert, index, 'humandays', $event.target.innerText, group)"
                      >
                        {{ dessert.humandays }}
                      </td>
                      <td
                        v-if="isEditing"
                        contenteditable="false"
                        v-show="!zp_show"
                        @blur="updateDessert(dessert, index, 'planTime', $event.target.innerText, group)"
                      >
                        {{ dessert.planTime }}
                      </td>
                      <td v-if="isEditing" contenteditable="true">
                        <!-- {{ dessert.node_producer }} -->
                        <el-select
                          v-model="dessert.node_producer"
                          placeholder="请选择"
                          @change="updateDessert(dessert, index, 'node_producer', dessert.node_producer, group)"
                        >
                          <el-option v-for="item in producer_options" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                      </td>
                      <td v-if="isEditing">
                        <i v-for="(des, key) in dessert.task_status" :key="key" :class="getDesClass(des)"> </i>
                      </td>
                      <td v-if="isEditing" contenteditable="true">
                        <el-date-picker
                          @blur="updateDessert(dessert, index, 'deadline', dessert.zg_deadline, group)"
                          v-model="dessert.zg_deadline"
                          type="datetime"
                          placeholder="选择日期"
                          format="YYYY-MM-DD HH:mm"
                        />
                      </td>
                      <td
                        v-show="!zz_show"
                        v-if="isEditing"
                        @blur="updateDessert(dessert, index, 'released', $event.target.innerText, group)"
                      >
                        {{ dessert.released }}
                      </td>
                      <td
                        v-show="!zz_show"
                        v-if="isEditing"
                        @blur="updateDessert(dessert, index, 'upload', $event.target.innerText, group)"
                      >
                        {{ dessert.upload }}
                      </td>
                      <td
                        v-show="!zz_show"
                        v-if="isEditing"
                        @blur="updateDessert(dessert, index, 'finishTime', $event.target.innerText, group)"
                      >
                        {{ dessert.finishTime }}
                      </td>

                      <td v-if="!isEditing" v-show="!zp_show">{{ dessert.thum_inf }}</td>
                      <td v-if="!isEditing" v-show="!zp_show">{{ dessert.code_name }}</td>
                      <!-- <td v-if="!isEditing" v-show="!zp_show">{{ dessert.work_type }}</td> -->
                      <td v-if="!isEditing" v-show="!zp_show">{{ dessert.node_supervisor }}</td>
                      <td v-if="!isEditing" v-show="!zp_show">{{ dessert.version }}</td>
                      <td v-if="!isEditing" v-show="!zp_show">{{ dessert.humandays }}</td>
                      <td v-if="!isEditing" v-show="!zp_show">{{ dessert.planTime }}</td>
                      <td v-if="!isEditing">{{ dessert.node_producer }}</td>
                      <td v-if="!isEditing" style="display: flex; flex-wrap: wrap; gap: 0.4rem; justify-content: center">
                        <div>
                          <div style="display: flex; gap: 0.4rem; justify-content: center">
                            <i :title="des.a_code" v-for="(des, key) in dessert.task_status" :key="key" :class="getDesClass(des)">
                            </i>
                          </div>
                          <div v-if="dessert.auditPersonZero">
                            <span style="font-size: 12px; color: #fd9625">提示:请添加任务审核人！</span>
                          </div>
                        </div>
                      </td>
                      <td v-if="!isEditing">{{ dessert.deadline }}</td>

                      <td v-show="zz_show" @click="zz_show = !zz_show">...</td>
                      <td v-show="!zz_show" v-if="!isEditing">{{ dessert.released }}</td>
                      <td v-show="!zz_show" v-if="!isEditing">
                        <div class="up_statu" :style="{ backgroundColor: getAuditStatusColor(dessert.auditstatus) }">
                          {{ dessert.auditstatus }}
                        </div>
                      </td>
                      <td v-show="!zz_show" v-if="!isEditing">{{ dessert.realTime }}</td>
                    </tr>
                  </template>
                </template>
              </tbody>
            </table>
          </div>

          <div class="file-manager-show" v-show="fileflowShow">
            <div style="display: flex; align-items: center">
              <i class="iconfont icon-fanhui-copy" style="font-size: 1rem" @click="cg_flowShow($event)"></i>
              <h3 style="margin-left: 1rem">文件管理器</h3>
            </div>
          </div>
          <div class="file-manager" v-show="!fileflowShow">
            <div style="display: flex; align-items: center; margin-top: 2rem">
              <i class="iconfont icon-xiala" style="font-size: 0.6rem" @click="cg_flowShow($event)"></i>
              <h3 style="margin-left: 0.8rem; color: grey">文件管理器</h3>
            </div>

            <div
              class="file-manager file"
              style="
                display: grid;
                grid-template-columns: 5fr 6fr 5fr 0.1fr 3fr;
                grid-gap: 3rem;
                margin-right: 0.5rem;
                margin-left: 0.5rem;
              "
            >
              <div class="file_content">
                <div class="file_title">关联文件</div>
                <div class="file_border"></div>
              </div>
              <div class="file_content">
                <div class="file_title">审核文件</div>
                <div class="file_border" style="width: 100%">
                  <div
                    style="width: 20rem; margin-top: 0.2rem; text-align: center; border: 1px solid; border-radius: 0.2rem"
                    :style="{
                      width: '20rem',
                      marginTop: '0.2rem',
                      textAlign: 'center',
                      border: '1px solid',
                      borderRadius: '0.2rem',
                      backgroundColor: getColor(file.color) // 使用方法来获取颜色
                    }"
                    v-for="(file, index) in auditFiles"
                    :key="file"
                    @click="auditClick(file, $event)"
                  >
                    <span>{{ auditFiles.length - index }}.</span>

                    <span>审核人：</span>

                    <span style="margin-left: 0.5rem">{{ file.create_p }}</span>
                    <!-- <span style="margin-left: 0.5rem">{{ file.color }}</span> -->
                    <span style="margin-left: 2rem">{{ file.create_time }}</span>

                    <i style="margin-left: 1rem; font-size: 1.2rem" class="iconfont icon-dianji"></i>
                  </div>
                </div>
              </div>
              <div class="file_content">
                <div class="file_title">工程文件</div>
                <div class="file_border"></div>
              </div>
              <div style="width: 0.1rem; border-left: 1px dashed"></div>
              <div class="file_content">
                <div class="file_title">已通过</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="sidebar" v-show="sidebarShow" style="position: relative; display: none">
        <div v-if="showSh">
          <div style="display: flex; cursor: pointer" @click="showSh = false">
            <i class="iconfont icon-fanhui"></i>
            <h3 style="margin-left: 0.5rem">审核预设</h3>
          </div>

          <div class="approval">
            <div v-for="(person, index) in reviewers" :key="index" style="display: flex; justify-content: space-between">
              <div>
                <span>审核阶段：</span>
                <select v-model="person.selected">
                  <option v-for="option in auditOptions" :key="option" :value="option">{{ option }}</option>
                </select>
              </div>

              <div>
                <span>审核人：</span>
                <select v-model="person.person">
                  <option v-for="option in peopleName" :key="option" :value="option">{{ option }}</option>
                </select>
              </div>
            </div>

            <div class="stage" style="margin-top: 2rem">
              <button class="add-person" @click="addPerson">添加审核人</button>
            </div>
            <button class="confirm" @click="addReviewTemp">确认</button>
          </div>
        </div>
        <div ref="taskContainer" v-if="!showSh">
          <secondTaskMesg
            @childClicked="handleChildClick"
            @openDialog="openDialogM"
            @addPersonS="addPerson"
            @addReviewTempS="addReviewTemp"
            @delAuditS="delAudit"
            :editAdudit_only="editAdudit_only"
            :peopleName="peopleName"
            :backShow="backShow"
            :reviewers="reviewers"
            :auditOptions="auditOptions"
            :supervisorShow="auditShow"
            :uploadShow="uploadShow"
          ></secondTaskMesg>
        </div>
      </div>
      <!-- 右侧弹窗 -->
      <div class="overlay" v-if="showDrawerS">
        <div class="drawer-content">
          <div class="drawer-top">
            <h2 v-if="!uploadImg">工作成果提交</h2>
            <div>
              <el-button @click="confireShowDrawer" v-if="uploadImg && ifAuditShow" type="primary">确认审核</el-button>
              <el-button v-if="uploadImg" @click="closeShowDrawer($event)" type="primary">关闭</el-button>
            </div>

            <div>
              <el-button @click="confireAdd($event)" v-if="!uploadImg" type="primary">确认提交</el-button>
              <el-button v-if="!uploadImg" @click="closeShowDrawer($event)" type="primary">关闭</el-button>
              <h2 v-if="uploadImg">工作成果审核</h2>
            </div>
          </div>
          <div class="drawer-name">
            <span>___制作人：</span>
          </div>
          <div class="uploadFour">
            <div class="uploadImg01" style="display: flex; align-items: center; justify-content: space-between">
              <span>上传图片</span>
              <div class="uploadImg02" v-if="uploadImg" style="display: flex; align-items: center">
                <div v-if="imgAudit">
                  <div v-if="imgAudit_passed" style="color: #00fa9a">审核通过</div>
                  <div v-if="!imgAudit_passed" style="color: red">审核不通过</div>
                </div>
                <el-button v-if="ifAuditShow" type="primary" @click="upAudit(2)" style="margin-left: 10px">审核通过</el-button>
                <el-button v-if="ifAuditShow" type="primary" style="background-color: red" @click="upAudit(1)"
                  >审核不通过</el-button
                >
              </div>
            </div>

            <div class="updiv" style="padding: 0">
              <div v-if="uploadImg" class="horizontal-scroll-container" style="width: 43rem">
                <div class="scroll-content">
                  <div v-if="imageUrls.length > 0" class="uploaded-image">
                    <img
                      @click="openModal(url)"
                      v-for="(url, index) in imageUrls"
                      :key="index"
                      :src="url"
                      alt="Loaded Image"
                      class="uploaded-image"
                    />
                  </div>

                  <div v-if="isModalOpen" class="modal" @click="closeModal">
                    <div class="modal-content" @click.stop>
                      <span class="close" @click="closeModal">&times;</span>
                      <img :src="imageUrl" alt="Uploaded Image" class="modal-image" />
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="!uploadImg" class="horizontal-scroll-container">
                <div class="scroll-content">
                  <div v-for="file in fileList" :key="file.uid" class="uploaded-image">
                    <img :src="file.url || createObjectURL(file.raw)" alt="Uploaded Image" />
                  </div>
                </div>
              </div>

              <div v-if="!uploadImg" class="upimg upload">
                <div style="width: 5rem; height: 2.5rem; overflow: hidden">
                  <el-upload
                    action="http://192.168.112.72:8889/upload/"
                    :on-change="handleChange"
                    :on-drop="handleDrop"
                    :before-upload="beforeUpload"
                    :file-list="fileList"
                    :data="upload_data"
                    :on-success="handleSuccess"
                    multiple
                    accept="image/*"
                  >
                    <div class="upload-dd-pic">上传图片</div>
                  </el-upload>
                </div>
              </div>
            </div>
          </div>

          <div class="uploadFour">
            <span>上传视频</span>
            <div class="updiv">
              <div class="upvideo"></div>
              <div class="upvideo upload">
                <div>上传视频</div>
              </div>
            </div>
          </div>

          <div class="uploadFour">
            <div style="display: flex; align-items: center; justify-content: space-between">
              <span>审核备注</span>
            </div>
            <div class="ediback-div" contenteditable="true" @blur="edibackUpdateValue" :innerHTML="ediback"></div>
          </div>

          <div class="uploadFour">
            <span>文件上传</span>
            <div class="fileUpload">
              <div class="fileDiv">
                <div class="up_file">
                  <div>点击将文件进行上传</div>
                  <div>支持扩展名：.zip .rar</div>
                </div>
              </div>
              <div style="border: 1px solid"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="sidebar" style="position: relative; display: flex; width: 4rem; padding: 0.5rem; background-color: #40a9ff">
        <!-- <div style="width: 0.1rem; height: 100%; margin-right: 0.5rem; border-left: 1px solid #cccccc"></div> -->
        <div>
          <div class="sidebar_item" @click="toggleUpShow(1, $event)">
            <div style="text-align: center" v-show="!backShow">
              <i class="iconfont icon-beizhu-copy" style="font-size: 1.5rem"></i>
              <span style="color: #007aff">任务备注</span>
            </div>
            <div style="text-align: center" v-show="backShow">
              <i class="iconfont icon-beizhu" style="font-size: 1.5rem"></i>
              <span style="color: white">任务备注</span>
            </div>
          </div>
          <div class="sidebar_item bottom" @click="toggleUpShow(2, $event)">
            <div style="text-align: center" v-show="!uploadShow">
              <i class="iconfont icon-kanchagongzuoshangchuan-copy" style="font-size: 1.5rem"></i>
              <span style="color: #007aff">工作上传</span>
            </div>
            <div style="text-align: center" v-show="uploadShow">
              <i class="iconfont icon-kanchagongzuoshangchuan" style="font-size: 1.5rem"></i>
              <span style="color: white">工作上传</span>
            </div>
          </div>
          <div class="sidebar_item bottom" @click="toggleUpShow(3, $event)">
            <div style="text-align: center" v-show="!auditShow">
              <i class="iconfont icon-shenhe-copy" style="font-size: 1.5rem"></i>
              <span style="color: #1296db">任务审核</span>
            </div>
            <div style="text-align: center" v-show="auditShow">
              <i class="iconfont icon-shenhe" style="font-size: 1.5rem"></i>
              <span style="color: white">任务审核</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./index.js">
// @import "./index";
</script>

<style scoped lang="scss">
@import "./index";
</style>
