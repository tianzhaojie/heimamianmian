<template>
  <el-table
    v-if="tableList"
    :data="tableList"
    style="width: 100%"
  >
    <el-table-column
      v-for="item ,index in labels"
      :key="index"
      :label="item[1]"
      :width="item[2]"
    >
      <template slot-scope="{row}">
        <slot :scope="row" :name="item[0]">{{ row[item[0]] }}</slot>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>

export default {
  name: 'Table',
  props: {
    tableList: {
      type: [Object, Array],
      default: () => { [] }
    },
    labels: {
      type: Array,
      default: () => ([])
    }
  }
}
</script>

<style lang="less" scoped>

</style>
