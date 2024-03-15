<script setup>
import { ref } from 'vue'
import { Plus, Upload } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import { userUploadAvatarService } from '@/api/user.js'
// 获取 用户存储 实例
const userStore = useUserStore()
// 创建 el-upload上传 引用
const uploadRef = ref()
// 完成图片预览 imgUrl有值
const imgUrl = ref(userStore.user.user_pic)
// 文件状态改变时的钩子，添加文件 预览
const onUploadFile = (file) => {
  const reader = new FileReader()
  reader.readAsDataURL(file.raw)
  // 文件读取完时 触发onload
  reader.onload = () => {
    imgUrl.value = reader.result // base64字符串
  }
}
// 点击 上传头像 按钮
const onUpdateAvatar = async () => {
  // 发送请求 更新头像
  await userUploadAvatarService(imgUrl.value)
  await userStore.getUser()
  ElMessage({ type: 'success', message: '更换头像成功' })
}
</script>

<template>
  <page-container title="更换头像">
    <el-row>
      <el-col :span="12">
        <!-- :auto-upload="false"不需要自带的自动上传功能 -->
        <el-upload
          ref="uploadRef"
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onUploadFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <img v-else src="@/assets/avatar.jpg" width="278" />
        </el-upload>
        <!-- 上面 上传框el-upload -->
        <br />
        <!-- 点击 选择图片 按钮，触发el-upload的点击 -->
        <el-button
          type="primary"
          :icon="Plus"
          size="large"
          @click="uploadRef.$el.querySelector('input').click()"
        >
          选择图片
        </el-button>
        <el-button type="success" :icon="Upload" size="large" @click="onUpdateAvatar">
          上传头像
        </el-button>
      </el-col>
    </el-row>
  </page-container>
</template>

<style lang="scss" scoped>
// 通过点击或者拖拽上传文件
.avatar-uploader {
  :deep() {
    // 图片样式
    .avatar {
      width: 278px;
      height: 278px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>
