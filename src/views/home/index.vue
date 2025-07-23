<template>
  <div class="make_home card">
    <!-- <div class="task_detail">
      <div class="task_descript">
        <div class="content first"></div>
      </div>
      <div class="my_task">
        <div class="content myTask">
          <div>
            <span style="font-weight: bold">我的任务</span>
          </div>
          <div class="bott_task">
            <div class="circle_task">
              <div class="task">
                <div class="circle">
                  <h1>6</h1>
                </div>
              </div>

              <div class="task font">
                <span style="font-weight: bold; color: #40a9ff">待完成</span>
              </div>
            </div>
            <div>
              <div class="circle_task">
                <div class="task">
                  <div class="circle">
                    <h1>4</h1>
                  </div>
                </div>
                <div class="task font">
                  <span style="font-weight: bold; color: #34c758">已完成</span>
                </div>
              </div>
            </div>
            <div class="statistics_task">
              <div class="audit">
                <span style="color: #ffcb01">待审核</span>
                <span>2</span>
              </div>
              <div class="audit">
                <span style="color: #af52de">请审核</span>
                <span>2</span>
              </div>
              <div class="audit">
                <span style="color: red">已逾期</span>
                <span>1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <!-- <div class="task_list">
      <div class="content">
        <div class="content taskList">
          <div>
            <span style="font-weight: bold">任务清单</span>
          </div>
          <div class="task_row">
            <div>
              <span>名称</span>
            </div>

            <div class="task_columns">
              <span>审核阶段</span>
              <span>审核状态</span>
              <span>工作上传</span>
            </div>
          </div>
          <div class="real_task_list">
            <div class="real_task_content">xxxx资产</div>
            <div class="real_task_content">01集/001场/001镜头</div>
          </div>
        </div>
      </div>
    </div> -->

    <!-- <div class="home card">
    <img class="home-bg" src="@/assets/images/welcome.png" alt="welcome" />
  </div> -->
    <!-- 在 </body> 标签之前添加聊天窗口 -->
    <div class="chat-widget minimized" id="chatWidget">
      <div class="chat-header">
        <div class="chat-title">
          <i class="fas fa-robot"></i>
          <span>AI助手</span>
        </div>
        <div class="chat-controls">
          <button class="chat-control-btn" id="minimizeChat">
            <i class="fas fa-minus"></i>
          </button>
        </div>
      </div>
      <div class="chat-messages" id="chatMessages">
        <div class="message ai">
          <div class="message-bubble">你好！我是管理平台的AI助手，很高兴为您服务。</div>
        </div>
      </div>
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
      <div class="chat-input-container">
        <div class="chat-input-wrapper">
          <textarea class="chat-input" id="chatInput" placeholder="输入消息..." rows="1"></textarea>
          <button class="send-button" id="sendMessage">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isVisible: true, // 控制弹窗的显示和隐藏
      isTyping: false // 用于控制输入指示器的显示
    };
  },
  methods: {
    closeModal() {
      this.isVisible = false; // 关闭弹窗
    },
    confirm() {
      // 处理确认逻辑
      alert("确认按钮被点击");
      this.closeModal();
    },
    sendMessage() {
      const chatInput = document.getElementById("chatInput");
      const message = chatInput.value.trim();
      if (message) {
        // 添加用户消息
        this.addMessage(message, "user");
        chatInput.value = "";

        // 显示输入中动画
        this.isTyping = true;

        // 模拟 AI 响应
        setTimeout(() => {
          this.isTyping = false;
          this.addMessage(`收到您的消息："${message}"。我认真考虑并回复。`, "ai");
        }, 1500);
      }
    },
    addMessage(content, type) {
      const chatMessages = document.getElementById("chatMessages");
      const messageDiv = document.createElement("div");
      messageDiv.className = `message ${type}`;

      const bubble = document.createElement("div");
      bubble.className = "message-bubble";
      bubble.textContent = content;

      messageDiv.appendChild(bubble);
      chatMessages.appendChild(messageDiv);

      // 滚动到底部
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  },
  mounted() {
    const minimizeBtn = document.getElementById("minimizeChat");
    const sendBtn = document.getElementById("sendMessage");
    const chatInput = document.getElementById("chatInput");
    const chatWidget = document.getElementById("chatWidget");

    minimizeBtn.addEventListener("click", e => {
      console.log(1);
      e.stopPropagation(); // 阻止事件冒泡
      chatWidget.classList.toggle("minimized");
    });

    sendBtn.addEventListener("click", this.sendMessage);

    chatInput.addEventListener("keypress", e => {
      console.log(2);
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // 自调整输入框高度
    chatInput.addEventListener("input", function () {
      console.log(3);
      this.style.height = "auto";
      this.style.height = this.scrollHeight + "px";
    });

    // 修改点击最小化状态恢复的功能
    chatWidget.addEventListener("click", e => {
      console.log(4);
      if (chatWidget.classList.contains("minimized") && e.target.closest(".chat-widget")) {
        chatWidget.classList.remove("minimized");
      }
    });
  }
};
</script>
<style scoped lang="scss">
@import "./index";
</style>
