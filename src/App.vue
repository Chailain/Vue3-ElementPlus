<script setup>
// 接口文档：https://apifox.com/apidoc/shared-93a28376-55a1-4421-8a02-7c6fa42e3df3/doc-1668767/

// 导入中文包
import zhCn from 'element-plus/es/locale/lang/zh-cn.mjs'
</script>

<template>
  <div>
    <!-- iampink666 123456 -->
    <el-config-provider :locale="zhCn">
      <RouterView></RouterView>
    </el-config-provider>
  </div>
</template>

<style lang="scss" scoped>

</style>