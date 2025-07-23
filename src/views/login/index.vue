<template>
  <div class="login-container flx-center">
    <div class="login-box">
      <!-- <img
        style="width: 100%; height: 100%; object-fit: cover"
        class="login-left-img"
        src="@/assets/images/login_left.png"
        alt="login"
      /> -->
      <SwitchDark class="dark" />
      <div class="login-left" style="width: 100%">
        <!-- <img
          style="width: 100%; height: 100%; object-fit: cover"
          class="login-left-img"
          src="@/assets/images/login_left.png"
          alt="login"
        /> -->
      </div>
      <div class="login-form">
        <div class="login-logo">
          <img class="login-icon" src="@/assets/images/logo.png" alt="" />
          <h2 class="logo-text">Login</h2>
        </div>
        <LoginForm />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="login">
import LoginForm from "./components/LoginForm.vue";
import SwitchDark from "@/components/SwitchDark/index.vue";
</script>

<style scoped lang="scss">
@import "./index";
</style>
