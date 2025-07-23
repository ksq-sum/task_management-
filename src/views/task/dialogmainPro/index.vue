<template>
  <div class="dialog-body">
    <div class="dialog-container">
      <div class="title">创建项目</div>
      <!-- <div class="image-container">
        <img
          alt="A person riding a dinosaur with a pyramid in the background"
          height="250"
          src="@\assets\task_img\1728982314813.png"
          width="400"
        />
      </div> -->
      <div style="display: flex;justify-content: space-between;">
        <div class="project-name">
          <label> 项目名称: </label>
          <input v-model="pro_ch_modelName" style="padding: 2px;margin-left: 10px;" @mouseleave="cgProEnModelName" > </input>
        </div>
        <div class="project-name">
          <label> 项目英文名: </label>
          <input v-model="pro_en_modelName" style="padding: 2px;margin-left: 10px;background-color: #B4B3B5;"> </input>
        </div>
      </div>
      
      <div class="project-name">
        <label> 钉钉群名: </label>
        <span>【{{selectProType}}】 {{ pro_ch_modelName }}</span>
      </div>
      <div class="divider"></div>
      <div class="form-container">
        <div>
          <div class="dialog-group">
            <label> 项目类型： </label>
            <select  v-model="selectProType" >
              <option v-for="name in proTypeSelects" :key="name" :value="name">
                {{ name }}
              </option>
            </select>
          </div>
          <div class="dialog-group">
            <label> 项目等级： </label>
            <select  v-model="selectProLevel" >
              <option v-for="name in proLevelSelects" :key="name" :value="name">
                {{ name }}
              </option>
            </select>
          </div>
          <div class="dialog-group" >
            <label> 帧率： </label>
            <input v-model="zhenlv"> </input>
          </div>
          <div class="dialog-group">
            <label> 分辨率： </label>
            <input v-model="fenbianlv"> </input>
          </div>
          <div class="dialog-group date-icon">
            <label> 开始时间： </label>
            <input type="date" v-model="startTime"/>
            <!-- <i class="fas fa-calendar-alt"> </i> -->
          </div>
          
        </div>
        <div>
          <div class="dialog-group">
            <label> 创建人员：</label>
            <span> {{zzuo}}</span>
          </div>
          <div class="dialog-group">
            <label> 甲方： </label>
            <select  v-model="selectedJiafa" >
              <option v-for="name in jiafaSelects" :key="name" :value="name">
                {{ name }}
              </option>
            </select>
          </div>
          <div class="dialog-group">
            <label> 项目状态： </label>
            <span>{{prostatu}}</span>
          </div>
          
          <div class="dialog-group">
            <label > 备注： </label>
            <input type="text" v-model="backcomment"/>
          </div>

          <div class="dialog-group date-icon">
            <label> 结束时间： </label>
            <input type="date" v-model="endTime"/>
            <!-- <i class="fas fa-calendar-alt"> </i> -->
          </div>
        </div>
      </div>
      <div class="submit-button">
        <button @click="callParentMethod">确认创建</button>
        <button style="margin-left: 20px;" @click="callParentCloseMethod">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted,defineProps } from "vue";
import { useUserStore } from "@/stores/modules/user"; // 导入你的 store
import {web_getUserName,web_getAllDirect,web_createNPro} from "@/api/modules/task";
import { format } from 'date-fns';
import { proMesStore } from "@/stores/modules/proMes";
import pinyin from 'pinyin';

const zzuo = ref("");
const zzuoUsername = ref("");
// 创建一个响应式数组
const direNames = ref(['请选择']);
const selectedName = ref('请选择');
const prostatu = ref('已开始')
const zhenlv = ref('')
const fenbianlv = ref('')
const startTime = ref('')
const endTime = ref('')
const backcomment = ref('')
const pro_ch_modelName = ref('')
const pro_en_modelName = ref('')
// 使用 proMesStore 访问方法和状态
const proMes = proMesStore();
const proTypes = proMes.getProTypes;
const proLevels = proMes.getProLevels;
const partyAsComp = proMes.getPartyAsComp;
const proTypeSelects = ref([]);
const selectProType = ref('');
const proLevelSelects = ref([]);
const selectProLevel = ref('');
const jiafaSelects = ref([]);
const selectedJiafa = ref('');
const pro_modelName = ref('');

// 定义 props
const props = defineProps({
  onCallParentMethod: Function,
  anotherMethod:Function
});

onMounted(() => {
    // 可以在这里执行数据获取或初始化逻辑
    fetchData();
    getProTypes();
});

function getProTypes(){
  proTypeSelects.value = proTypes.map(item => item.value);
  selectProType.value = proTypes[0].value;
  proLevelSelects.value = proLevels.map(item => item.value);
  selectProLevel.value = proLevels[0].value;
  jiafaSelects.value = partyAsComp.map(item => item.value);
  selectedJiafa.value = partyAsComp[0].value;
}

// 示例拼音转换函数（实际使用中可以使用第三方库，如 pinyin）
const convertToPinyin = (pinyinResult) => {
  return pinyin(pinyinResult, {
    style: pinyin.STYLE_NORMAL, // 风格：普通拼音
    heteronym: false, // 是否启用多音字
  }).flat().join(' '); // 将嵌套数组展平，拼接为字符串
};


function cgProEnModelName(){
  const value = pro_ch_modelName.value;
  let result = '';
  let keyResult = '';

  for (let char of value) {
    if (/^[\u4e00-\u9fa5]+$/.test(char)) {
      const pinyinResult = convertToPinyin(char).replace(/\s+/g, '');
      // 如果是中文，调用拼音转换函数
      result += pinyinResult.charAt(0).toUpperCase();
      keyResult += pinyinResult;
    } 
    else if (/^[A-Za-z]+$/.test(char)) {
      // 如果是英文，转为大写
      result += char.toUpperCase();
      keyResult += char.toUpperCase();
    } else if (/^\d+$/.test(char)) {
        // 如果是数字，保持不变
        result += char;
        keyResult += char;
      } 
    else{
          // 其他字符（如标点）可以选择跳过或处理
          continue;
      }
    }

  // 去掉末尾多余的空格
  pro_en_modelName.value = result.trim();
  pro_modelName.value = keyResult.trim();
  // pro_en_modelName.value = keyResult.trim();
}

function fetchData() {
    const userStore = useUserStore();
    zzuoUsername.value = userStore.getName
    // 获取当前制片账号
    // 通过账号查询制片姓名
    web_getUserName(userStore.getName).then(response => {
        // 模拟数据获取
        zzuo.value = response.realname;
    })
    
    //获取导演
    web_getAllDirect().then(response => {
      direNames.value = ['请选择', ...response]; // 在头部添加选项
      selectedName.value = direNames.value[0]; // 默认选中 "请选择"
    })
}

// 定义方法
const callParentMethod = () => {
  if (props.onCallParentMethod) {
    props.onCallParentMethod();
  }

  //获取当前时间
  const now = new Date();
  const formattedNow = format(now, 'yyyy-MM-dd HH:mm:ss');
  const ymd = format(now, 'yyyyMMdd');

  //导演和制片都传账号，因为账号唯一，姓名不一定唯一

  const jsonString = {
    pro_code: pro_modelName.value+ymd,
    pro_name: pro_modelName.value,
    pro_thumbnail:pro_modelName.value+ymd+".png",
    pro_ch_name:pro_ch_modelName.value,
    pro_en_name:pro_en_modelName.value,
    pro_type:selectProType.value,
    pro_level:selectProLevel.value,
    party_asComp:selectedJiafa.value,
    ding_thumbnail:"【"+selectProType.value+"】"+pro_ch_modelName.value,
    pro_p: zzuoUsername.value, 
    pro_state: 1,
    pro_progress:"0",
    pro_director: selectedName.value,
    pro_frame_rate: zhenlv.value,
    pro_resolution: fenbianlv.value,
    pro_starttime: startTime.value,
    pro_endtime: endTime.value,
    pro_asspeople:[{}],
    pro_description: backcomment.value,
    create_time:formattedNow,
    create_p:zzuoUsername.value
  };
  // console.log("jsonString:", JSON.stringify(jsonString))

  // 创建一个新的项目
  web_createNPro(jsonString).then(response => {
    // console.log('创建成功')    
    //刷新主页面
    if (props.anotherMethod()) {
      props.anotherMethod();
    }
  })
};

const callParentCloseMethod = () =>{
  if (props.onCallParentMethod) {
    props.onCallParentMethod();
  }
}

</script>

<style>
.dialog-body input{
  background: none;          /* 去除背景 */
  border: 1px solid;
  border-radius: 3px;
  outline: none;             /* 去除聚焦时的外框 */
}
.dialog-body select{
  background: none;          /* 去除背景 */
  border: 1px solid;
  border-radius: 3px;
  outline: none;             /* 去除聚焦时的外框 */
}
.dialog-body {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  background-color: rgb(0 0 0 / 70%);
}
.dialog-container {
  width: 800px;
  padding: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
}
.title {
  font-size: 36px;
  color: #666666;
}
.project-name {
  display: flex;
  align-items: center;
  margin-top: 20px;
}
.project-name label {
  font-size: 20px;
  color: #333333;
}
.project-name span {
  margin-left: 10px;
  font-size: 20px;
  color: #007bff;
}
.image-container {
  margin-top: 20px;
  text-align: center;
}
.image-container img {
  width: 100%;
  max-width: 600px;
  border-radius: 10px;
}
.form-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.dialog-group {
  display: flex;
  align-items: center;
  width: 300px;
  margin-bottom: 10px;
}
.dialog-group span{
  width: 100%;
}
.dialog-group label {
  display: block;
  width: 50%;
  color: #333333;
}
.dialog-group input,
.dialog-group select {
  width: 100%;
  padding: 2px;
  margin-top: 5px;
  font-size: 16px;
}
.dialog-group input[type="date"] {
  padding: 4px;
}
.dialog-group .date-icon {
  position: relative;
}
.dialog-group .date-icon input {
  padding-right: 30px;
}
.dialog-group .date-icon i {
  position: absolute;
  top: 50%;
  right: 10px;
  color: #999999;
  transform: translateY(-50%);
}
.divider {
  margin: 20px 0;
  border-top: 1px solid #cccccc;
}
.submit-button {
  margin-top: 20px;
  text-align: center;
}
.submit-button button {
  padding: 10px 20px;
  font-size: 16px;
  color: #ffffff;
  cursor: pointer;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
}
.submit-button button:hover {
  background-color: #0056b3;
}
</style>
