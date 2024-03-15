<script setup>
import { ref } from 'vue'
import { artEditChannelService, artAddChannelService } from '@/api/article.js'
// 对话框 默认 隐藏不展示
const dialogVisible = ref(false)

// 外部接口 接收参数obj
const open = async (row) => {
  // 控制弹窗显示
  dialogVisible.value = true
  formModel.value = { ...row }
}

// 接口文档 - 文章类别管理
// 增加-文章分类
// 更新-文章分类
// 请求参数-示例
// 表单 数据
const formModel = ref({
  cate_name: '',
  cate_alias: ''
})
// 表单 校验规则
const rules = {
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '分类名必须是1-10位的非空字符',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    {
      required: true,
      message: '请输入分类别名',
      trigger: 'blur'
    },
    {
      pattern: /^[a-zA-Z0-9]{1,15}$/,
      message: '分类别名必须是1-15位的字母数字',
      trigger: 'blur'
    }
  ]
}

const formRef = ref()
const emit = defineEmits(['success'])
// 点击 对话框的 确认按钮
const onSubmit = async () => {
  // 等待 通过校验
  await formRef.value.validate()
  formModel.value.id
    ? await artEditChannelService(formModel.value)
    : await artAddChannelService(formModel.value)
  ElMessage({
    type: 'success',
    message: formModel.value.id ? '编辑成功' : '添加成功'
  })
  dialogVisible.value = false
  // 通知 父组件 文章频道.vue 进行回显 更新文章分类列表
  emit('success')
}
// 暴露给外部 open方法
// 看参数: {}添加 {...}编辑
defineExpose({
  open
})
</script>
<template>
  <el-dialog v-model="dialogVisible" :title="formModel.id ? '编辑分类' : '添加分类'" width="30%">
    <el-form :model="formModel" :rules="rules" ref="formRef"
      label-width="100px" style="padding-right: 30px"
    >
      <!-- 两个输入框 -->
      <el-form-item label="分类名称" prop="cate_name">
        <el-input v-model="formModel.cate_name" minlength="1" maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input v-model="formModel.cate_alias" minlength="1" maxlength="15"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <!-- 取消按钮 -->
        <el-button @click="dialogVisible = false">取消</el-button>
        <!-- 确认按钮 -->
        <el-button type="primary" @click="onSubmit"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
