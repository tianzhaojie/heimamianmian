<template>
  <el-card>
    <el-row>
      <el-col :span="24" :push="16"><div class="grid-content bg-purple-dark">
        <div class="block">
          <el-pagination
            :current-page.sync="page.page"
            :page-size.sync="page.pagesize"
            :page-sizes="[10, 20, 30, 40]"
            layout="prev, pager, next, sizes, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div></el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    total: {
      required: true,
      type: [Object, Array, Number]
    },
    page: {
      type: [Number, Object],
      default: 1
    }
  },
  data() {
    return {
    }
  },
  methods: {
    handleSizeChange(val) {
      // this.$emit('pagination', { page: this.currentPage, limit: val })
      this.$emit('pagination')
    },
    handleCurrentChange(val) {
      // this.$emit('pagination', { page: val, limit: this.pageSize })
      this.$emit('pagination')
    }
  }
}
</script>

<style>

</style>
