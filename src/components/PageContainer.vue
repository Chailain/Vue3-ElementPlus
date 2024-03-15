<script setup>
// 子组件中接收
defineProps({
  title: {
    required: true,
    type: String
  }
})
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <!-- 定制标题 -->
        <span>{{ title }}</span>
        <!-- 头部 最右边部分 -->
        <div class="extra">
          <!-- 内容不可写死 具名插槽定制额外的按钮 -->
          <slot name="extra"></slot>
        </div>
      </div>
    </template>
    <!-- 默认插槽 定制内容 灵活 -->
    <slot></slot>
  </el-card>
</template>

<style lang="scss" scoped>
// 页面容器
.page-container {
  // 高度只有一部分不好看   高度撑满
  min-height: 100%;
  box-sizing: border-box;
  .header {
    display: flex;
    // 垂直居中
    align-items: center;
    // 去两边
    justify-content: space-between;
  }
}
</style>
