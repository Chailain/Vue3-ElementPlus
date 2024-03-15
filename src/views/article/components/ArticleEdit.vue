<script setup>
import { ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { artPublishService, artGetDetailService, artEditService } from '@/api/article.js'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { baseURL } from '@/utils/request'
// visibleDrawer 控制 抽屉的 显示和隐藏
const visibleDrawer = ref(false)
// 默认的 抽屉里的 表单数据
const defaultForm = {
  // 文章标题
  title: '',
  // 文章分类   所属分类Id
  cate_id: '',
  // 文章封面:只能是图片文件
  cover_img: '',
  // 文章内容:非空的字符串
  content: '',
  // 文章的发布状态:可选值为：已发布、草稿
  state: ''
}
// 抽屉中的表单 收集发请求需要的所有数据
const formModel = ref({ ...defaultForm })

const formRef = ref()
const editorRef = ref()
// 看看外部传入的样子 确定是 添加文章 还是 编辑修改文章
const open = async (row) => { // 接收 外部 传参
  visibleDrawer.value = true // 打开抽屉
  if (row.id) {
    // 修改文章
    // 根据 id 获取文章详情数据   放到抽屉里
    const res = await artGetDetailService(row.id)
    // 点击 Edit文章按钮->调用open方法->回显抽屉数据
    formModel.value = res.data.data
    imgUrl.value = baseURL + formModel.value.cover_img // 封面回显
    // 发请求 更新-文章信息（编辑，修改） 接口对图片格式有要求 要file格式
    // 把网络图片 转换成file对象格式
    formModel.value.cover_img = await imageUrlToFile(imgUrl.value, formModel.value.cover_img)
  } else {
    // 新增文章   重置表单数据
    formModel.value = { ...defaultForm }
    imgUrl.value = ''
    editorRef.value.setHTML('')
  }
}

// 将网络图片地址转换为File对象
// 完整的网络图片地址https://a.com/b.jpg  文件名b.jpg
async function imageUrlToFile(url, fileName) {
  try {
    // 第一步：使用axios获取网络图片数据
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const imageData = response.data

    // 第二步：将图片数据转换为Blob对象
    const blob = new Blob([imageData], {
      type: response.headers['content-type']
    })

    // 第三步：创建一个新的File对象
    const file = new File([blob], fileName, { type: blob.type })

    return file
  } catch (error) {
    console.error('将图片转换为File对象时发生错误:', error)
    throw error
  }
}

// 上传 文章封面图片 相关的逻辑
const imgUrl = ref('')
// 文件状态改变时的钩子，添加文件   <el-upload :on-change="onUploadFile">
  // 选择图片触发on-change事件
const onUploadFile = (uploadFile) => {
  // 创建一个图片的URL
  imgUrl.value = URL.createObjectURL(uploadFile.raw) // 封面预览
  // 封面图片对象 存入formModel 将来用于提交
  formModel.value.cover_img = uploadFile.raw
}

const emit = defineEmits(['success'])
// 点击 抽屉里的 发布/草稿 按钮
const onPublish = async (state) => {
  // 将已发布还是草稿状态，存入 state
  formModel.value.state = state
  // 接口文档-发布文章post-要求传参为form-data格式
  const fd = new FormData()
  // 将 js普通对象 转换 formData数据
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }

  if (formModel.value.id) {
    await artEditService(fd)
    ElMessage.success('编辑成功')
    visibleDrawer.value = false
    emit('success', 'edit')
  } else {
    // 发请求 添加·发布·新增 文章
    await artPublishService(fd)
    ElMessage.success('添加成功')
    visibleDrawer.value = false
    // 触发 父组件监听的success 通知父组件 发布文章成功
    // 新数据加到了最后一页的最后
    emit('success', 'add')
  }
}

defineExpose({
  open
})
</script>

<template>
  <!-- 抽屉 -->
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.id ? '编辑文章' : '添加文章'"
    direction="rtl"
    size="50%"
  >
    <!-- 发表文章表单 -->
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <ChannelSelect v-model="formModel.cate_id" width="100%"></ChannelSelect>
      </el-form-item>
      <el-form-item label="文章封面" prop="formModel.cover_img">
        <el-upload
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onUploadFile"
        >
          <!-- 有图片 渲染图片 -->
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <!-- 没有图片 渲染+号 -->
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <quill-editor
            ref="editorRef"
            theme="snow"
            v-model:content="formModel.content"
            contentType="html"
          >
          </quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onPublish('已发布')">发布</el-button>
        <el-button type="info" @click="onPublish('草稿')">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
// 上传 文章封面 样式
.avatar-uploader {
  // 穿透组件的 scoped 样式   在组件内部修改样式
  :deep() {
    // 预览图片
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      // 定义元素的过渡效果  特定的过渡时间
      transition: var(--el-transition-duration-fast);
    }
    // 改变边框颜色
    .el-upload:hover {
      // elementPlus里的css变量
      border-color: var(--el-color-primary);
    }
    // + 图标的样式
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
