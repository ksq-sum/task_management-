<template>
  <div class="sec_body">
    <div class="overlay" v-if="isVisible">
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
<style scoped>
.sec_body {
  height: 90%;
  margin-top: 1%;
  background-image: url("@/assets/images/taskShow.png");
  background-position: center; /* 背景图像居中 */
  background-size: cover; /* 让背景图像覆盖整个div */
}
.chat-input-container {
  padding: 1rem;
  background: white;
  border-top: 1px solid #dee2e6;
}
.typing-indicator {
  display: flex;
  gap: 3px;
  padding: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.typing-indicator.active {
  opacity: 1;
}
.typing-dot:nth-child(1) {
  animation-delay: 0s;
}
.typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}
.typing-dot:nth-child(3) {
  animation-delay: 0.4s;
}
.typing-dot {
  width: 8px;
  height: 8px;
  background: #007bff;
  border-radius: 50%;
  animation: typing 1s infinite ease-in-out;
}
.chat-input-wrapper {
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
}
.chat-input {
  flex-grow: 1;
  min-height: 40px;
  max-height: 100px;
  padding: 0.5rem 1rem;
  resize: none;
  border: 1px solid #dee2e6;
  border-radius: 20px;
  outline: none;
}

/* 聊天窗口样式 */
.chat-widget {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  width: 360px;
  max-height: 600px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgb(0 0 0 / 15%);
  transition: all 0.3s ease;
}

/* 更新最小化状态样式 */
.chat-widget.minimized {
  width: 60px;
  height: 60px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 50%;
}

/* 更新聊天窗口头部样式 */
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between; /* 修改为两端对齐 */
  padding: 1rem;
  color: white;
  background: #007bff;
  border-radius: 12px 12px 0 0;
}

/* 调整标题和控制按钮的布局 */
.chat-title {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.chat-controls {
  margin-left: auto; /* 将控制按钮推到右边 */
}

/* 最小化状态下的样式调整 */
.chat-widget.minimized .chat-header {
  justify-content: center; /* 最小化时居中图 */
}
.chat-widget.minimized .chat-title {
  margin: 0; /* 重置margin */
}

/* 最小化状态下隐藏不需要的元素 */
.chat-widget.minimized .chat-title span,
.chat-widget.minimized .chat-controls,
.chat-widget.minimized .chat-messages,
.chat-widget.minimized .typing-indicator,
.chat-widget.minimized .chat-input-container {
  display: none;
}

/* 最小化状态下的图标样式 */
.chat-widget.minimized .chat-title i {
  margin: 0;
  font-size: 24px;
}

/* 添加悬停效果 */
.chat-widget.minimized:hover {
  box-shadow: 0 8px 25px rgb(0 0 0 / 20%);
  transform: scale(1.1);
}
.carousel-controls .fas {
  font-size: 1.8rem;
  line-height: 1;
}

/* 添加动画效果 */
.carousel-controls .btn-circle:hover .fas {
  animation: buttonPulse 1s infinite;
}
.chat-control-btn {
  padding: 5px;
  font-size: 1.2rem;
  color: white;
  cursor: pointer;
  background: none;
  border: none;
}
.chat-messages {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 1rem;
  height: 400px;
  padding: 1rem;
  overflow-y: auto;
  background: #f8f9fa;
}
.message-bubble {
  position: relative;
  padding: 0.8rem 1rem;
  border-radius: 15px;
}
.user .message-bubble {
  color: white;
  background: #007bff;
  border-bottom-right-radius: 5px;
}
.ai .message-bubble {
  color: #343a40;
  background: white;
  border-bottom-left-radius: 5px;
  box-shadow: 0 2px 5px rgb(0 0 0 / 5%);
}
</style>
