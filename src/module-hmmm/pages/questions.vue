<template>
  <div class="container">
    <top-form />
    <el-card>
      <Table :table-list="tableList" :labels="labels">
        <template #question="{scope}">
          <div v-html="scope.question" />
        </template>
      </Table>
    </el-card>
  </div>
</template>

<script>
import TopForm from '../components/TopForm.vue'
import Table from '../components/table.vue'
import { list } from '@/api/hmmm/questions.js'
export default {
  name: 'Questions',
  components: {
    TopForm,
    Table
  },
  data() {
    return {
      tableList: [],
      labels: [

        ['number', '试题编号', '120px'],
        ['subjectID', '学科', '141px'],
        ['catalogID', '目录', '137px'],
        ['questionType', '题型', '137px'],
        ['question', '题干', '280px'],
        ['addDate', '录入时间', '180px'],
        ['difficulty', '难度', '137px'],
        ['creator', '录入人', '137px']
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      const { data } = await list()
      console.log(data)
      this.tableList = data.items
    }
  }
}
</script>

<style scoped lang='less'></style>
