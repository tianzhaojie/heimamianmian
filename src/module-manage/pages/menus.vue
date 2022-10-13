<template>
  <div class="menus">
    <el-card>
      <div class="rightBtn">
        <el-button type="primary" icon="el-icon-edit" size="small" class="btn">添加菜单</el-button>
      </div>
      <!--

      <el-row>
        <el-table
          ref="disabel"
          :data="menuList"
          style="width: 100%;dispaly:flex;"
          row-key="pid"
          :default-expand-all="true"
          :tree-props="{children: 'childs', hasChildren: 'hasChildren'}"
          :expand-row-keys="[]"
          @expand-change="none"
        >
          <el-table-column
            prop="title"
            label="标题"
            width="200"
          >
            <template slot-scope="{row}">
              <i class="el-icon-edit" />
              <span>{{ row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="code"
            label="权限点代码"
          />
          <el-table-column
            label="操作"
            class-name="operation"
            width="110"
          >
            <template>
              <el-button type="primary" icon="el-icon-edit" circle />
              <el-button type="danger" icon="el-icon-delete" circle />
            </template>
          </el-table-column>
        </el-table>
      </el-row> -->
      <TreeTable :data="menuList" :tree-structure="true" :hander="hander" />
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
import { list } from '@/api/base/menus.js'
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
  async created() {
    const { data } = await list()
    this.menuList = JSON.parse(JSON.stringify(data).replace(/childs/g, 'children').replace(/points/g, 'children'))
    // this.retract(this.menuList)
    this.menuList = arrayTreeAddLevel(this.menuList)
    console.log(arrayTreeAddLevel(this.menuList))
  },
  methods: {
    retract(data) {
      // 每行缩进
      data.forEach(item => {
        if (item.children) {
          this.retract(item.children)
        } else {
          item.children = []
        }
      })
      console.log(data)
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
