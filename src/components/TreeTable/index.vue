<!-- eslint-disable vue/require-valid-default-prop -->
<template>
  <el-table
    v-loading="listLoading"
    :data="formatData"
    :row-class-name="rowClassStatus"
    element-loading-text="给我一点时间"
    fit
    highlight-current-row
    row-key="id"
    style="width: 100%"
    :indent="25"
    :default-expand-all="defaultExpandAll"
  >
    <el-table-column
      v-for="(column, index) in hander"
      :key="column.prop"
      :width="column.width"
      :prop="column.prop"
      :label="column.title"
    >
      <template slot-scope="scope">
        <i :class="column.name[scope.row.level-1]" class="icon" />
        <expand
          v-if="column.render"
          :render="column.render"
          :row="scope.row"
          :index="index"
          :column="scope.row"
        />
        <span v-else>
          {{ scope.row[column.value] }}
        </span>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="150" align="center">
      <template slot-scope="scope">
        <el-button
          type="primary"
          icon="el-icon-edit"
          style="width: 36px; heigth: 36px;"
          circle
          class="edit"
          @click="handleUpdate(scope.row)"
        />
        <el-button
          type="danger"
          icon="el-icon-delete"
          circle
          style="width: 36px; heigth: 36px;"
          class="delt"
          @click="handleDelete(scope.row.id)"
        />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import Utils from './utils/dataTranslate.js'
import expand from './utils/expand'

export default {
  name: 'TreeTable',
  components: { expand },
  props: {
    // 该属性是确认父组件传过来的数据是否已经是树形结构了，如果是，则不需要进行树形格式化
    treeStructure: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    data: {
      type: Array,
      default: function() {
        return []
      }
    },
    // 这是相应的字段展示
    columns: {
      type: Array,
      default: function() {
        return []
      }
    },
    listLoading: {
      type: Boolean,
      default: false
    },
    // 是否默认展开所有树
    defaultExpandAll: {
      type: Boolean,
      default: function() {
        return true
      }
    },
    // ? 渲染表头数组
    hander: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: []
    }
  },
  computed: {
    // 格式化数据源
    formatData: function() {
      const me = this
      if (me.treeStructure) {
        const data = Utils.treeToArray(me.data, null, null, me.defaultExpandAll)
        return data
      }
      return me.data
    }
  },
  created() {
  },
  methods: {
    rowClassStatus: function() {
      this.$emit('rowClassStatus')
    },
    handleUpdate(row) {
      this.$emit('handleUpdate', row)
    },
    handleDelete(user) {
      this.$emit('removeUser', user)
    }

  }
}
</script>
<style rel="stylesheet/css">
.ivu-icon-ios-folder-outline {
  content: '\F434';
}
@keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@-webkit-keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
$color-blue: #2196f3;
$space-width: 18px;
.ms-tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: $space-width;
  height: 14px;
  &::before {
    content: '';
  }
}
.processContainer {
  width: 100%;
  height: 100%;
}
table td {
  line-height: 26px;
}

.tree-ctrl {
  position: relative;
  cursor: pointer;
  color: $color-blue;
  margin-left: -$space-width;
}
:deep(.el-table__expand-icon--expanded){
  display: none !important;
}
:deep(.el-table__placeholder){
  width: 0;
}
:deep(.cell){
  font-size: 14px;
  .icon{
    font-size: 18px;
    margin-right: 15px;
  }
}
.edit{
      color: #409eff;
    background: #ecf5ff;
    border-color: #b3d8ff;
}
.delt{
      color: #f56c6c;
    background: #fef0f0;
    border-color: #fbc4c4;
}
</style>
