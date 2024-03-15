<script setup>
//获取文章分类数据
import { ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import { artGetChannelsService, artDelChannelService } from '@/api/article'
import ChannelEdit from './components/ChannelEdit.vue'

const channelList = ref([])
// 定义一个loading变量，用于控制加载状态
const loading = ref(false)
// 定义一个异步函数，用于获取频道列表
const getChannelList = async () => {
  // 将loading设置为true，表示正在加载中
  loading.value = true
  // 调用artGetChannelsService函数，获取频道列表
  const res = await artGetChannelsService()
  // 将获取到的频道列表赋值给channelList
  channelList.value = res.data.data
  // 将loading设置为false，表示加载完成
  loading.value = false
}
// 调用getChannelList函数，获取频道列表
getChannelList()

// 弹窗
const dialog = ref()

// 点击 编辑/修改文章分类 按钮
const onEditChannel = (row) => {
  dialog.value.open(row)
}
// 删除文章分类按钮 的 点击事件
const onDelChannel = async (row) => {
  await ElMessageBox.confirm('你确认删除该分类信息吗?', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  await artDelChannelService(row.id)
  ElMessage({ type: 'success', message: '删除成功' })
  // 重新渲染
  getChannelList()
}

// 点击 添加文章分类 按钮
const onAddChannel = () => {
  dialog.value.open({})
}
// 重新获取 文章分类列表
  // 点击 对话框的 确认按钮
  // el-form兜底预校验  发请求新增/修改 提示  关闭对话框
const onSuccess = () => {
  // 获取-文章分类  更新最新数据（不用手动刷新，有loading效果）
  getChannelList()
}
</script>

<template>
  <!-- 文章频道（管理）---文章分类 -->
  <page-container title="文章分类">
    <template #extra>
      <el-button type="primary" plain @click="onAddChannel">添加分类</el-button>
    </template>
    <!-- 表格渲染 -->
    <el-table :data="channelList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" width="100" type="index"> </el-table-column>
      <el-table-column label="分类名称" prop="cate_name"></el-table-column>
      <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
      <el-table-column label="操作" width="100">
        <!-- [{}--row] -->
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditChannel(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDelChannel(row)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <!-- 弹窗 -->
    <ChannelEdit ref="dialog" @success="onSuccess"></ChannelEdit>
  </page-container>
</template>
