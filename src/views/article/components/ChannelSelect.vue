<script setup>
import { artGetChannelsService } from '@/api/article'
import { ref } from 'vue'
// 设计成 v-model的使用方式 <ChannelSelect v-model="params.cate_id" />
defineProps({
  modelValue: {
    type: [Number, String]
  },
  width: {
    type: String
  }
})
const emit = defineEmits(['update:modelValue'])

const channelList = ref([])
const getchannelList = async () => {
  // 获取文章分类
  const res = await artGetChannelsService()
  // channelList.value = [
  //   {
  //     "id": 1,
  //     "cate_name": "最新",
  //     "cate_alias": "Latest"
  //   },{}
  // ]
  channelList.value = res.data.data
}
// 一进页面 就调用
getchannelList()
</script>

<template>
  <el-select
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    :style="{ width }"
  >
    <!-- 请选择-下拉菜单的下拉列表内容 -->
    <el-option
      v-for="channel in channelList"
      :key="channel.id"
      :label="channel.cate_name"
      :value="channel.id"
    ></el-option>
  </el-select>
</template>
