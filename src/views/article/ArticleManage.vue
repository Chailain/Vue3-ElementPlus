<script setup>
import { Delete, Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'
import ChannelSelect from './components/ChannelSelect.vue'
import { artGetListService, artDelService } from '@/api/article.js'
import { formatTime } from '@/utils/format'
import ArticleEdit from './components/ArticleEdit.vue'

const loading = ref(false)
const articleList = ref([]) // 文章列表
const total = ref(0) // 总条数
// 接口文档->文章管理 获取-文章列表 请求参数
const params = ref({
  // 请求参数
  pagenum: 1, // 当前页码数
  pagesize: 5, // 当前页面需要的数据条数
  cate_id: '', // 文章分类id(注意不是文章id)
  state: '' // 文章状态("已发布"和"草稿")2种值
})
const getArticleList = async () => {
  loading.value = true
  // 获取-文章列表
  const res = await artGetListService(params.value)
  articleList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}
// 一进页面 就获取 文章列表数据
getArticleList()

// 分页功能
// 页码大小 变动时 触发   每页？条数据
const onSizeChange = (size) => {
  // 重置到第一页
  params.value.pagenum = 1
  // 改成 每页size条数据
  params.value.pagesize = size
  // 基于 最新的 当前页数和每页size条数据 渲染
  getArticleList()
}
// 当前页数/当前页 变动时候触发
const onCurrentChange = (page) => {
  // 更新 当前页码
  params.value.pagenum = page
  // 基于最新的页面 请求文章列表数据
  getArticleList()
}

// 表单 按条件筛选区 功能
// 点击 搜索按钮时
const onSearch = () => {
  // 原来看第几页不保留，从第一页开始展示
  params.value.pagenum = 1
  getArticleList()
}
// 点击 重置按钮时
const onReset = () => {
  params.value.pagenum = 1
  // v-model绑定了el-select
  // cate_id: '', // 文章分类id(注意不是文章id)
  // state: '' // 文章状态("已发布"和"草稿")2种值
  params.value.cate_id = ''
  params.value.state = ''
  // 检索全部
  getArticleList()
}

// 获取 抽屉弹窗组件实例（编辑文章）
const articleEditRef = ref()
// 点击 添加文章 按钮
const onAddArticle = () => {
  articleEditRef.value.open({})
}
// 点击 Edit文章按钮
const onEditArticle = (row) => {
  articleEditRef.value.open(row)
}

// 发布或修改文章 成功的回调
const onSuccess = (type) => {
  if (type === 'add') {
    // 如果是添加，需要跳转渲染最后一页，编辑直接渲染当前页
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    params.value.pagenum = lastPage
  }
  getArticleList()
}

// 点击 Delete文章按钮
const onDeleteArticle = async (row) => {
  await ElMessageBox.confirm('你确认删除该文章信息吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  await artDelService(row.id)
  ElMessage({ type: 'success', message: '删除成功' })
  getArticleList()
}
</script>

<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">添加文章</el-button>
    </template>
    <!-- 表单区域   筛选条件 -->
    <el-form inline>
      <el-form-item label="文章分类：">
        <ChannelSelect v-model="params.cate_id" width="200px"></ChannelSelect>
      </el-form-item>
      <el-form-item label="发布状态">
        <el-select v-model="params.state" style="width: 200px;">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table style="width: 100%" :data="articleList" v-loading="loading">
      <el-table-column label="文章标题" width="400">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发表时间">
        <template #default="{ row }">{{ formatTime(row.pub_data) }}</template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            plain
            type="primary"
            circle
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDeleteArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>

    <!-- 分页区域 -->
    <!-- :page-sizes="[2, 3, 4, 5, 10]" 要包含默认的 pagesize: 5 -->
    <!-- layout 工具栏 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 4, 5, 10]"
      layout="jumper, total, sizes, prev, pager, next"
      background
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />

    <!-- 抽屉弹窗 添加和编辑修改文章 -->
    <ArticleEdit ref="articleEditRef" @success="onSuccess"></ArticleEdit>
  </page-container>
</template>
