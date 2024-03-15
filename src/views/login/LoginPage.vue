<script setup>
import { userRegisterService, userLoginService } from '@/api/user.js'
import { User, Lock } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
// 展示登录界面
const isRegister = ref(false)
// 收集表单全部数据 字段由接口文档决定
const formModel = ref({
  username: '',
  password: '',
  repassword: ''
})

// 监听数据isRegister,  发生改变时，登录/注册切换时  重置数据
watch(isRegister, () => {
  formModel.value = {
    username: '',
    password: '',
    repassword: ''
  }
})

// 声明整个表单的校验规则
const rules = {
  username: [
    // 用户名
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 10, message: '用户名必须是5-10位的字符', trigger: 'blur' }
  ],
  password: [
    // \S 非空字符(空格不行)
    { require: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15位的非空字符',
      trigger: 'blur'
    }
  ],
  // 自定义校验 => 自己写校验的逻辑(校验函数)
  //    validator: (rule, value, callback)
  //    (1) rule 当前校验规则相关的信息
  //    (2) value 所校验的表单元素目前的表单值
  //    (3) callback 无论成功还是失败，都需要 callback回调
  repassword: [
    { require: true, message: '请再次输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15位的非空字符',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        // repassword框里的值 与 password框里的值
        if (value !== formModel.value.password) {
          // callback(new Error(错误信息)) 校验失败
          callback(new Error('两次输入密码不一致！'))
        } else {
          // 校验成功
          callback()
        }
      },
      // 自定义校验的触发时机
      trigger: 'blur'
    }
  ]
}

// 注册功能
const formVc = ref()
// el-button注册按钮的 点击事件
const register = async () => {
  // 兜底校验/预校验
  await formVc.value.validate()
  // 发送注册请求
  await userRegisterService(formModel.value)
  ElMessage.success('注册成功')
  // 切换到登录界面
  isRegister.value = false
}

//登录校验
const userStore = useUserStore()
const router = useRouter()
// el-button登录按钮的 点击事件
const login = async () => {
  await formVc.value.validate()
  const res = await userLoginService(formModel.value)
  userStore.setToken(res.data.token)
  ElMessage.success('登录成功')
  router.push('/')
}
</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <!-- 栅格占据的列数默认24份 offset栅格左侧的间隔格数3份 -->
    <el-col :span="6" :offset="3" class="form">
      <!-- 注册相关表单 -->
      <el-form
        ref="formVc"
        size="large"
        autocomplete="off"
        v-if="isRegister"
        :model="formModel"
        :rules="rules"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            :prefix-icon="User"
            placeholder="请输入用户名"
            v-model="formModel.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            show-password
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            v-model="formModel.password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入再次密码"
            v-model="formModel.repassword"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="button" type="primary" auto-insert-space @click="register">
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false"> ← 返回 </el-link>
        </el-form-item>
      </el-form>

      <!-- 登录相关表单 -->
      <el-form
        ref="formVc"
        size="large"
        autocomplete="off"
        v-else
        :model="formModel"
        :rules="rules"
      >
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            :prefix-icon="User"
            placeholder="请输入用户名"
            v-model="formModel.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            v-model="formModel.password"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button class="button" type="primary" auto-insert-space @click="login">登录</el-button>
        </el-form-item>
        <el-form-item class="flex">
          <!-- 没有文字链接下划线 -->
          <el-link type="info" :underline="false" @click="isRegister = true"> 注册 → </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background:
      url('@/assets/login.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    // 设置flex布局，主轴方向为column
    flex-direction: column;
    // 主轴column对齐方式为居中
    justify-content: center;
    // 禁止用户选择文本
    user-select: none;
    ::v-deep .el-input__inner::placeholder {
      color: #ffc0cb; // 粉色的十六进制值
    }
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
