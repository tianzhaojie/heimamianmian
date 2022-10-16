<template>
  <div class="menus">
    <el-card>
      <div class="rightBtn">
        <el-button type="primary" icon="el-icon-edit" size="small" class="btn" @click="dialogFormVisible = true">添加菜单</el-button>
      </div>
      <TreeTable :data="menuList" :tree-structure="true" :hander="hander" @removeUser="removeUser" />
      <MenuAdd v-if="dialogFormVisible" :dialog-form-visible.sync="dialogFormVisible" page-title="菜单" text="创建" @getList="getMenusList" />
    </el-card>
  </div>
</template>

<script>

// const arrayTreeAddLevel = (array, childrenName = 'children') => {
//   if (!Array.isArray(array)) return []
//   const recursive = (array, level = 0) => {
//     level++
//     return array.map(v => {
//       const child = v[childrenName]
//       if (child && child.length) recursive(child, level)
//       return v
//     })
//   }
//   return recursive(array)
// }

import TreeTable from '@/components/TreeTable'
import { list, remove } from '@/api/base/menus.js'
import MenuAdd from '../components/menu-add.vue'
export default {
  components: {
    TreeTable,
    MenuAdd
  },
  data() {
    return {
      menuList: [],
      arr: [],
      expand: true,
      hander: [{ title: '标题', width: 200, value: 'title', name: ['el-icon-folder-opened', 'el-icon-document', 'el-icon-view'] },
        { title: '权限点代码', width: '', value: 'code', name: '' }],
      indent: 20,
      dialogFormVisible: false
    }
  },
  created() {
    this.getMenusList()
  },
  methods: {
    // 根据id删除某一行的数据
    async removeUser(data) {
      try {
        this.$confirm('此操作将永久删除该学科, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          remove(data)
          this.getMenusList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } catch (error) {
        this.$message.woring(error)
      }
    },
    // 获取列表数据
    async getMenusList() {
      const { data } = await list()
      this.menuList = JSON.parse(JSON.stringify(data).replace(/childs/g, 'children').replace(/points/g, 'children'))
      const recursive = (arr, level = 1) => {
        return arr.map(item => {
          item.level = level
          if (item.children) {
            if (item.children[0].is_point) {
              item.level = 2
              recursive(item.children, 2)
              return item
            }
            item.level = 1
            recursive(item.children, 1)
            return item
          } else if (!item.is_point) {
            console.log('3')
            item.level = 2
            return item
          } else {
            item.level = 3
            return item
          }
        })
      }
      this.menuList = recursive(this.menuList)
      console.log()
    },
    getList() {
      this.getMenusList()
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
