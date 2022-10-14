<template>
  <div class="menus">
    <el-card>
      <div class="rightBtn">
        <el-button type="primary" icon="el-icon-edit" size="small" class="btn">添加菜单</el-button>
      </div>
      <TreeTable :data="menuList" :tree-structure="true" :hander="hander" @removeUser="removeUser" />
    </el-card>
  </div>
</template>

<script>

const arrayTreeAddLevel = (array, levelName = 'level', childrenName = 'children') => {
  if (!Array.isArray(array)) return []
  const recursive = (array, level = 0) => {
    level++
    return array.map(v => {
      v[levelName] = level
      const child = v[childrenName]
      if (child && child.length) recursive(child, level)
      return v
    })
  }
  return recursive(array)
}

import TreeTable from '@/components/TreeTable'
import { list, remove } from '@/api/base/menus.js'
export default {
  components: {
    TreeTable
  },
  data() {
    return {
      menuList: [],
      arr: [],
      expand: true,
      hander: [{ title: '标题', width: 200, value: 'title', name: ['el-icon-folder-opened', 'el-icon-document', 'el-icon-view'] },
        { title: '权限点代码', width: '', value: 'code', name: '' }],
      indent: 20
    }
  },
  created() {
    this.getMenusList()
  },
  methods: {
    // 根据id删除某一行的数据
    async removeUser(data) {
      try {
        await remove(data)
        this.$message.success('删除成功')
        this.getMenusList()
      } catch (error) {
        this.$message.woring(error)
      }
    },
    // 获取列表数据
    async getMenusList() {
      const { data } = await list()
      this.menuList = JSON.parse(JSON.stringify(data).replace(/childs/g, 'children').replace(/points/g, 'children'))
      // this.retract(this.menuList)
      this.menuList = arrayTreeAddLevel(this.menuList)
      console.log(arrayTreeAddLevel(this.menuList))
    }
  }
}
</script>

<style scoped lang='less'>
.menus{
  padding: 20px;
 .rightBtn{
  display: flex;
  justify-content: end;
      .btn{
    background-color: #67c23a;
    color: #fff;
    margin-bottom: 20px;
  }
 }
.operation{
  float: right;
}
/deep/.el-icon-arrow-right{
  display: none;
}
}
</style>
