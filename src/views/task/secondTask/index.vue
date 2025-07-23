<template>
  <transition name="fade" v-cloak>
    <div class="sec_body" v-if="isec_body">
      <div class="sec_header">
        <div class="sec_nav">
          <a @click="projectShow">项目预览</a>
          <a href="#" class="sec_active">资产</a>
          <a href="#">镜头</a>
        </div>
        <h1>{{ key }}项目</h1>
      </div>

      <div class="sec_container" >
        <div class="sec_left" >
          <!-- 功能栏 -->
          <div class="main-gn">
            <el-button type="primary" style="color: white;background-color: #007AFF;border-radius: 12px;" @click="delTaskNode($event)" ref="delAdudit" v-if="clickAudit">删除</el-button>
            <!-- <el-button type="primary"  ref="editAdudit($event)" v-if="clickAudit">修改审核预设</el-button> -->
            <el-button style="color: #007AFF;background-color: white;border-radius: 12px;" type="primary" @click="exportTable">导出表格</el-button>
            <el-button ref="editAdudit2" style="color: #007AFF;background-color: white;border-radius: 12px;" type="primary" @click="cgProStatuIsEditing" v-if="!isEditing"> 编辑表格</el-button>
            <el-button ref="saveAdudit" type="primary" @click="cgProStatuIsEditing" v-if="isEditing" 
            style="color:#74F8F3;background-color: black;">保存</el-button>

            <!-- <el-button type="primary" @click="cgProStatu" v-if="fbshow">发布</el-button> -->
            <el-button style="cursor:not-allowed;background-color: grey;" v-if="!fbshow">暂停项目</el-button>
          </div>
          <!-- 表格 -->
          
          <div class="main-content" >
            
            <div class="table-container"
            :class="{ 'table-container-a': activeA }"
            ref="tableContainer">

              <table class="table" style="margin-top: 1.5rem;background-color: white">
                <thead >
                  <tr >
                    <th title="制片" class="zp_th" style="min-width: 7rem;">
                      信息缩略图
                      <span class="tooltip">制片</span>
                    </th>
                    <th class="zp_th">阶段</th>
                    <!-- <th>工作类型</th> -->
                    <th class="zp_th">主管</th>
                    <th class="zp_th">版本</th>
                    <th class="zp_th">人天</th>
                    <th class="zp_th" style="min-width: 8rem;">
                        预计结束时间
                    </th>

                    <th class="zg_th zg_slue" v-show="zg_th_data" @click="zg_th_data = !zg_th_data">
                      ...
                      <span class="tooltip">管理<i class="iconfont icon-youshensuo" style="margin-left: 0.2rem;font-size: 0.8rem;"></i></span>
                      
                    </th>
                    <th class="zg_th" v-show="!zg_th_data">
                      制作人
                      <span class="tooltip" @click="zg_th_data = !zg_th_data">
                        管理
                        <i class="iconfont icon-zuoshensuo-" style="margin-left: 0.2rem;font-size: 0.8rem;"></i>
                      </span>
                    </th>
                    <th class="zg_th" v-show="!zg_th_data">任务审核</th>
                    <th class="zg_th" v-show="!zg_th_data" style="min-width: 9rem;">截止到计时间</th>


                    <th class="zz_th zg_slue" @click="zg_slue" v-show="zg_slue_data">
                      ...
                      <span class="tooltip">制作人<i class="iconfont icon-youshensuo" style="margin-left: 0.2rem;font-size: 0.8rem;"></i></span>
                    </th>
                    <th class="zz_th" style="min-width: 7rem;" v-show="!zg_slue_data">开始时间
                      <span class="tooltip" @click="zg_slue_data = !zg_slue_data">制作人
                        <i class="iconfont icon-zuoshensuo-" style="margin-left: 0.2rem;font-size: 0.8rem;"></i></span>
                    </th>
                    <th class="zz_th" style="min-width: 8rem;" v-show="!zg_slue_data">工作状态</th>
                    <th class="zz_th" style="min-width: 7rem;" v-show="!zg_slue_data">完成时间</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(group, groupIndex) in groupedDesserts">
                    <tr @click="toggleGroup(groupIndex,group)" :class="{ groupSelected: group.ifXiala }">
                      <td colspan="13" :class="{'group-header': true, 'group-selected': group.headerSelected}">
                        <i class="iconfont icon-xiala" v-if="!group.ifXiala" style="font-size: 0.4rem;"></i>
                        <i class="iconfont icon-fanhui-copy" v-if="group.ifXiala" style="font-size: 0.6rem;"></i>
                        <span class="categorySpan" :class="{ categoryS: group.headerSelected }">{{ group.category }}</span>
                      </td>
                    </tr>
                    <template v-if="isGroupOpen(groupIndex)" >
                      <tr :class="{ trselected: dessert.td_select }" 
                      v-for="(dessert, index) in group.items" 
                      :key="dessert.code_name"
                      @click="clickCheckbox(dessert, index,group)">
                      
                        <td>{{ dessert.thum_inf }}</td>
                        <td >{{ dessert.code_name }}</td>
                      
                        <td
                          contenteditable="true"
                          v-if="isEditing"
                          style="width: 6rem;"
                          >
                          <el-select 
                          v-model="dessert.node_supervisor" 
                          placeholder="请选择" 
                          :style="{ width: '6rem' }"
                          @change="updateDessert(dessert, index, 'node_supervisor', dessert.node_supervisor, group)">
                            <el-option
                              v-for="item in supervisor_options"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            />
                          </el-select>
                        </td>
                        <td v-if="!isEditing" style="width: 6rem;">{{ dessert.node_supervisor }}</td>
                        <td>{{ dessert.version }}</td>
                        
                        <td
                          contenteditable="true"
                          v-if="isEditing"
                          @blur="updateDessert(dessert, index, 'humandays', $event.target.innerText, group)"
                        >
                          {{ dessert.humandays }}
                        </td>
                        <td v-if="!isEditing">{{ dessert.humandays }}</td>
                        <td
                          contenteditable="true"
                          v-if="isEditing"
                        >
                        <el-date-picker
                          @blur="updateDessert(dessert, index, 'planTime', dessert.zp_planTime, group)"
                          v-model="dessert.zp_planTime"
                          type="date"
                          :style="{ width: '8rem' }"
                          placeholder="选择日期"/>
                        </td>
                        <td v-if="!isEditing" style="width:8rem">{{ dessert.planTime }}</td>
                        <td v-show="zg_th_data">...</td>
                        
                        <td v-show="!zg_th_data" style="border-left: 3px solid #8CA2AA;">{{ dessert.node_producer }}</td>
                        <td v-show="!zg_th_data" >
                          <div style="display: flex;gap: 0.1rem;justify-content: space-between;">
                            <i v-for="(des,key) in dessert.task_status" 
                          :key="key" 
                          :title="des.a_code"
                          :class="getDesClass(des)">
                          </i>
                          </div> 
                          
                        </td>
                        <td v-show="!zg_th_data" style="border-right: 3px solid #8CA2AA;">{{ dessert.deadline }}</td>

                        <td v-show="zg_slue_data">...</td>
                        <td v-show="!zg_slue_data">{{ dessert.released }}</td>
                        <td v-show="!zg_slue_data">
                            <div class="up_statu" :style="{ backgroundColor: getAuditStatusColor(dessert.auditstatus) }">
                              {{ dessert.auditstatus }}
                            </div>  
                        </td>
                        <td v-show="!zg_slue_data">{{ dessert.realTime }}</td>
                      </tr>
                    </template>
                  </template>
                </tbody>
              </table>

            </div>
            <div class="workflow" v-show="workflowShow" style="padding-top: 0.5rem;border-radius: 10px;">
              <div class="w-head" style="margin-left: 1rem;">
                  <div style="display: flex;align-items: center;">
                    <i class="iconfont icon-xiala" style="font-size: 0.6rem;" @click="cg_workflowShow"></i>
                    <h3 style="margin-left: 1rem;">任务流</h3>
                  </div>
                  
                  <div style="margin-right: 3%;color: grey;">创建任务</div>
              </div>
              <div class="steps" style="justify-content: space-between;padding: 0.7rem;">
                <div class="task" style="margin-left: 5rem;color: grey;">任务阶段</div>
                <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;margin-left: 2rem">
                    <div class="button-container under">
                      <button
                        draggable="true"
                        class="button-gx"
                        v-for="item in gx"
                        :key="item.gxname"
                        :style="{backgroundColor: item.bdselected ? '#AF52DE' : 'grey', borderColor: item.selected ? 'blue' : 'red'}" 
                        style="color: white;"
                        @click="addToGxChecked(item)"
                        @dragstart="(event) => onDragStart(event, item)"
                        :class="{ 'hover-effect': item.gxname === '设计' }"
                        :disabled="item.gxname !== '设计'"
                      >
                      <i class="iconfont icon-jiahao1"></i>
                        {{ item.gxname }}
                        
                      </button>
                    </div>
                    
                </div>
                <div style="margin-right: 2rem;"><el-button type="primary" style="background-color: #34C758;" @click="cgshIf">添加审核预设</el-button></div>
              </div>
              
              <div style="display: flex;justify-content: center;width: 100%;">
                <div style="width: 94%;border-top: 1px solid #D3D3D3;"></div>
              </div>
              <div style="padding: 0.3rem;">
                

                <div class="steps" style="width: 94.5%;margin-top: 1rem;margin-bottom: 1rem;margin-left: 2rem;">
                  <!-- <div style="width: 100px; height: 20px; border: 1px solid"> -->
                    <div>
                      <div class="intd">中文名</div>
                      <input style="width: 6rem;height: 2rem;font-size: 0.8rem;color: #007bff;text-align: center;" v-model="inputValue_Chi" placeholder="资产中文名" class="underline-input"></input>
                    </div>

                    <h3  style="margin-top: 0.6rem;margin-left: 10px;font-size: 1.3rem;color: grey;">|</h3>

                    <div style="margin-left: 10px;">
                      <div class="intd">英文名</div>
                      <input style="width: 8rem;height: 2rem;font-size: 0.8rem;color: #007bff;text-align: center;" v-model="inputValue_Eng" placeholder="资产英文名" class="underline-input"></input>
                    </div>
                  <div style="width: 94%;;margin-left: 1rem;">
                    <div class="drop-zone" @dragover.prevent @drop="onDrop" >
                      <div v-if="showdrop">请点击任务阶段，添加任务......</div>
                      <button class="button-gx" v-for="item in gxchecked" :key="item.gxname" :style="{backgroundColor: item.bdselected ? '#AF52DE' : 'grey'}" >
                        <span class="button-text">{{ item.gxname }}</span>
                        <i @click="delGxname" class="iconfont icon-cuowutishichahao_cuowutishichahao"></i>
                      </button>
                      <div :style="divStyle"></div>
                      <el-button style="height: 1.6rem;margin-right: 3%;background-color: rgb(0 119 255);" type="primary" @click="saveCode" v-if="!isEditing">添加任务</el-button>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
            <div v-show="!workflowShow" style="height: 2.3rem;margin-top: 1.2rem;color: grey;background-color:#cccfd1;border: 1px solid grey;border-radius: 5px;">
              <div style="display: flex;align-items: center;justify-content: space-between;" @click="cg_workflowShow">
                <div style="display: flex;margin-left: 1rem;">
                  <i  class="iconfont icon-fanhui-copy" style="font-size: 1rem;" ></i>
                  <h3 style="margin-left: 1rem;color: grey;;">任务流</h3>
                </div>

                <div style="display: flex;align-items: center;margin-right: 2rem;background-color: black;border-radius: 10px;">
                  <i  class="iconfont icon-jiahao" style="font-size: 1.5rem;" ></i>
                  <span style="margin-left: 1rem;color:#74F8F3;">创建任务</span>
                </div>
              </div>
            </div>
            <div class="file-manager" v-show="fileflowShow" style="height: 2.3rem;border: 1px solid grey">
              <div style="display: flex;align-items: center;margin-left: 1rem;">
                <i class="iconfont icon-fanhui-copy" style="font-size: 1rem;" @click="cg_flowShow($event)"></i>
                <h3 style="margin-left: 1rem;color: grey;">文件管理器</h3>
              </div>
              
            </div>

            <div class="file-manTwo" v-show="!fileflowShow">
              <div style="display: flex;align-items: center;">
                <i  class="iconfont icon-xiala" style="font-size: 0.6rem;" @click="cg_flowShow($event)"></i>
                <h3 style="margin-left: 0.8rem;color: grey;">文件管理器</h3>
              </div>
              
              <div class="file" style="display: grid; grid-template-columns: 5fr 6fr 5fr 0.1fr 3fr; grid-gap: 3rem;">
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

        <div class="sidebar" v-show="sidebarShow"  style="position: relative;display: none;">
          <div v-if="showSh">
            <div style="display: flex;align-items: center;cursor: pointer;" @click="returnAduit">
              <i class="iconfont icon-fanhui"></i>
              <h3 style="margin-left: 0.5rem;">审核预设</h3>
            </div>
            
            <div class="approval">
              <!-- 选择审核主管 -->
              <div v-if="aduitshow" style="display: flex;align-items: center;justify-content: space-between;">

                <div style="width: 30%;">主管选择：</div>
                <el-select v-model="supervisor_selectedValue" style="width: 70%;" placeholder="请选择">
                  <el-option
                    v-for="item in supervisor_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
              <div v-if="aduitshow" style="margin-top: 2rem;border-top: 0.1rem solid grey;"></div>
              <div v-for="(person, index) in reviewers" :key="index" style="margin-top: 2rem;">
                <span>审核人：</span>
                <select v-model="person.selected" style="width: 6rem;margin-left: 4rem;border: 1px solid grey;border-radius: 0.2rem;" @click="seleClick($event)">
                  <option v-for="option in auditOptions" :key="option" :value="option">
                    {{option}}
                  </option>
                </select>
                
                <i class="iconfont icon-yingyong-" style="margin-left: 1.5rem;" @click="delAudit(person.selected,index,$event)"></i>
              </div>
              <div class="stage" style="margin-top: 1.5rem;">
                <button class="add-person" @click="addPerson($event)">添加审核人</button>
              </div>
              <div style="position: absolute; bottom: 2rem; left: 50%;transform: translateX(-50%);">
                <button class="confirm" @click="addReviewTemp($event)">确认</button>
              </div>
            </div>
          </div>
          <div ref="taskContainer"  v-if="!showSh" >
            <secondTaskMesg ref="secondTaskMesg" @childClicked="handleChildClick" 
            @delAudit = "delAudit"
            @addPerson = "addPerson"
            @addReviewTemp = "addReviewTemp"
            
            :secondTaskMesg_ops="secondTaskMesg_ops" :reviewers = "reviewers"
            :auditOptions="auditOptions" :editAdudit_only="editAdudit_only" :uploadShow = "uploadShow"
            :backShow = "backShow" :auditShow = "auditShow"></secondTaskMesg>
          </div>
        </div>
        
        <div class="sidebar" style="position: relative;display: flex;width: 4rem;padding: 0.5rem;background-color: #40A9FF;">
          <!-- <div style="width: 0.1rem; height: 100%; margin-right: 0.5rem; border-left: 1px solid #cccccc"></div> -->
          <div >
            <div class="sidebar_item" @click="toggleUpShow(1,$event)">
              <div style="text-align: center;" v-show="!backShow">
                <i class="iconfont icon-beizhu-copy" style="font-size: 1.5rem;"></i>
                <span style="color: #007AFF;">任务备注</span>
              </div>
              <div style="text-align: center;" v-show="backShow">
                <i class="iconfont icon-beizhu" style="font-size: 1.5rem;"></i>
                <span style="color: white;">任务备注</span>
              </div>
            </div>
            <!-- <div class="sidebar_item bottom" @click="toggleUpShow(2,$event)">
              <div style="text-align: center;" v-show="!uploadShow">
                <i class="iconfont icon-kanchagongzuoshangchuan" style="font-size: 1.5rem;"></i>
                <span>工作上传</span>
              </div>
              <div style="text-align: center;" v-show="uploadShow">
                <i class="iconfont icon-kanchagongzuoshangchuan-copy" style="font-size: 1.5rem;"></i>
                <span style="color: #1296db;">工作上传</span>
              </div>
            </div> -->
            <div class="sidebar_item bottom" @click="toggleUpShow(3,$event)">
              <div style="text-align: center;" v-show="!auditShow">
                <i class="iconfont icon-shenhe-copy" style="font-size: 1.5rem;"></i>
                <span style="color: #007AFF;">任务审核</span>
              </div>
              <div style="text-align: center;" v-show="auditShow">
                <i class="iconfont icon-shenhe" style="font-size: 1.5rem;"></i>
                <span style="color: white;">任务审核</span>
              </div>
            </div>
          </div>
          
        </div>

        <div class="overlay" v-if="showDrawer">
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
      </div>

      
      <ed :isVisible="isChildVisible" :message="parentMessage" :currProCode="currProCode" :auditOptions="auditOptions" @update-message="handleUpdateMessage"
      @update:isVisible="isChildVisible = $event"  @close-modal="isChildVisible = false" ref="childRef"></ed>
    </div>
  </transition>
</template>

<script src="./index.js">
// @import "./index";
</script>

<style scoped lang="scss">
@import "./index";
</style>
