import request from '@/utils/request'
// 文章类别管理 获取-文章分类
export const artGetChannelsService = () => request.get('/my/cate/list')
// 文章类别管理 增加-文章分类
export const artAddChannelService = (data) => request.post('/my/cate/add', data)
// 文章类别管理 更新-文章分类(编辑/修改)
export const artEditChannelService = (data) => request.put('/my/cate/info', data)
// 文章类别管理 删除-文章分类
export const artDelChannelService = (id) =>
  request.delete('/my/cate/del', {
    params: { id }
  })

// 以上 是与分类相关的接口
// 以下 是与文章相关的接口  文章管理

// 获取-文章列表
export const artGetListService = (params) => request.get('/my/article/list', { params })

// 发布-文章 （添加，新增）
export const artPublishService = (data) => request.post('/my/article/add', data)

// 获取-文章详情      根据 id 获取详情数据
export const artGetDetailService = (id) => request.get('my/article/info', { params: { id } })

// 更新-文章信息（编辑，修改）
export const artEditService = (data) => request.put('my/article/info', data)

// 删除-文章
export const artDelService = (id) => request.delete('my/article/info', { params: { id } })
