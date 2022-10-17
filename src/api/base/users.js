import { createAPI } from '@/utils/request'

// 获取用户列表
export const list = data => createAPI('/users/', 'get', data)

export const simple = data => createAPI('/users/simple', 'get', data)
export const add = data => createAPI('/users', 'post', data)
export const update = data => createAPI(`/users/${data.id}`, 'put', data)
export const remove = data => createAPI(`/users/${data.id}`, 'delete', data)
// export const detail = id => createAPI(`/users/${id}`, 'get')
export const detail = data => createAPI(`/users/${data.id}`, 'get', data)

