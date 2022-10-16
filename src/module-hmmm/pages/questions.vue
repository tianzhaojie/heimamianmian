<template>
  <div class="container">
    <top-form :total="total" />
    <el-card>
      <Table :table-list="tableList" :labels="labels" :loaidng="loading">
        <template #question="{scope}">
          <div v-html="scope.question" />
        </template>
        <template #questionType="{scope}">
          {{ computedType(scope) }}
        </template>
        <template #operation="{scope}">
          <el-button
            type="primary"
            size="small"
            circle
            icon="el-icon-view"
            @click="isShowPreview(scope)"
          />
          <el-button
            type="success"
            size="small"
            circle
            icon="el-icon-edit"
          />
          <el-button
            type="danger"
            size="small"
            circle
            icon="el-icon-delete"
            @click="open(scope)"
          />
          <el-button
            type="warning"
            size="small"
            circle
            icon="el-icon-check"
            @click="add(scope)"
          />
        </template>
        <template #difficulty="{scope}">
          {{ hardType(scope) }}
        </template>
        <template #addDate="{scope}">
          {{ scope.addDate | toDayJS }}
        </template>
      </Table>
      <!-- 分页 -->
      <el-pagination
        style=" margin-top: 20px;
         text-align: right;"
        :current-page.sync="page.page"
        :page-sizes="[5, 10, 20, 50]"
        :page-size.sync="page.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="getList"
        @current-change="getList"
      />
    </el-card>
    <!-- 预览弹出框 -->
    <preview v-if="currentPreview" :dialog-preview.sync="dialogPreview" :current-preview="currentPreview" />
  </div>
</template>

<script>
import preview from '../components/preview.vue'
import TopForm from '../components/TopForm.vue'
import { questionType, difficulty } from '@/api/hmmm/constants'
import Table from '../components/table.vue'
import { list, detail, remove, choiceAdd } from '@/api/hmmm/questions.js'
export default {
  name: 'Questions',
  components: {
    TopForm,
    Table,
    preview
  },
  data() {
    return {
      dialogPreview: false,
      loading: false,
      page: {
        page: 1,
        pagesize: 5
      },
      // 总数据数
      total: 0,
      hard: difficulty,
      tableList: [],
      questionList: questionType,
      labels: [
        ['number', '试题编号', '120px'],
        ['subject', '学科', '141px'],
        ['catalog', '目录', '137px'],
        ['questionType', '题型', '137px'],
        ['question', '题干', '280px'],
        ['addDate', '录入时间', '180px'],
        ['difficulty', '难度', '137px'],
        ['creator', '录入人', '137px']
      ],
      currentPreview: null
    }
  },
  computed: {
    computedType() {
      return function({ questionType }) {
        // console.log(questionType)
        const obj = this.questionList.find(item => item.value === +questionType)
        return obj.label
      }
    },
    hardType() {
      return function({ difficulty }) {
        const obj = this.hard.find(item => item.value === +difficulty)
        return obj.label
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList(obj) {
      this.loading = true
      const { data } = await list({ ...this.page, ...obj })
      this.total = data.counts
      this.loading = false
      this.tableList = data.items
    },
    async isShowPreview(row) {
      console.log(row)
      const { data } = await detail(row)
      console.log(data)
      this.currentPreview = data
      this.dialogPreview = true
    },
    async open(row) {
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await remove(row)
        this.$message.success('删除成功')
        this.getList()
      } catch (error) {
        this.$message.error('删除失败')
      }
    },
    async add(row) {
      try {
        await this.$confirm('此操作将将该项目加入精选, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        row.choiceState = 1
        await choiceAdd(row)
        this.$message.success('加入成功')
        this.getList()
      } catch (error) {
        this.$message.error('加入失败')
      }
    }
  }
}
</script>

<style scoped lang='less'>
 ::v-deep.el-pagination {
  .btn-prev,.btn-next{
    background-color: #f4f4f5 !important;
  }
 }
</style>
