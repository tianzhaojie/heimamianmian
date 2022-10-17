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
          <el-button type="text" style="font-size:12px" @click="isShowPreview(scope)">预览</el-button>
          <el-button type="text" style="font-size:12px" :disabled="scope.chkState === 0 ? false : true" @click="audit(scope)">审核</el-button>
          <el-button type="text" style="font-size:12px" :disabled="isChange(scope)" >修改</el-button>
          <el-button type="text" style="font-size:12px" @click="shelves(scope)">{{ +scope.publishState === 1 ?'下架' :'上架' }}</el-button>
          <el-button type="text" style="font-size:12px" :disabled="isChange(scope)" @click="del">删除</el-button>
        </template>
        <template #difficulty="{scope}">
          {{ hardType(scope) }}
        </template>
        <template #addDate="{scope}">
          {{ scope.addDate | toDayJS }}
        </template>
        <template #publishState="{scope}">
          {{ publish(scope) }}
        </template>
        <template #chkState="{scope}">
          {{ chkState(scope) }}
        </template>
      </Table>
      <!-- 分页 -->
      <el-pagination
        style=" margin-top: 20px;text-align: right;"
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
    <!-- 审核弹窗 -->
    <audit v-if="dialogAudit" :dialog-audit.sync="dialogAudit" :current-audit="currentAudit" />
  </div>
</template>

<script>
import audit from '../components/audit.vue'
import preview from '../components/preview.vue'
import TopForm from '../components/TopForm.vue'
import { questionType, difficulty } from '@/api/hmmm/constants'
import Table from '../components/table.vue'
import { choice, detail, choicePublish, remove } from '@/api/hmmm/questions.js'
export default {
  name: 'QuestionsChoice',
  components: {
    TopForm,
    Table,
    preview,
    audit
  },
  data() {
    return {
      dialogAudit: false,
      dialogPreview: false,
      loading: false,
      publishTypeList: [{ value: 0 }, { value: 1, label: '待发布' }],
      page: {
        page: 1,
        pagesize: 10
      },
      // 总数据数
      total: 0,
      hard: difficulty,
      tableList: [],
      questionList: questionType,
      labels: [
        ['number', '试题编号', '120px'],
        ['subject', '学科', '120px'],
        ['catalog', '目录', '120px'],
        ['questionType', '题型', '120px'],
        ['question', '题干', '280px'],
        ['addDate', '录入时间', '180px'],
        ['difficulty', '难度', '80px'],
        ['creator', '录入人', '120px'],
        ['chkState', '审核状态', '120px'],
        ['chkRemarks', '审核意见', '150px'],
        ['chkUser', '审核人', '120px'],
        ['publishState', '发布状态', '150px']
      ],
      currentPreview: null,
      currentAudit: null
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
    },
    publish() {
      return function({ publishState, chkState }) {
        if (+chkState === 1) {
          if (+publishState === 1) {
            return '已发布'
          } else if (+publishState === 0) {
            return '已下架'
          }
        } else {
          return '待发布'
        }
      }
    },
    chkState() {
      return function({ chkState }) {
        if (+chkState === 0) {
          return '待审核'
        } else if (+chkState === 1) {
          return '已审核'
        } else {
          return '已拒绝'
        }
      }
    },
    // 是否可修改
    isChange() {
      return function({ publishState }) {
        if (+publishState === 1) {
          return true
        } else {
          return false
        }
      }
    }

  },
  created() {
    this.getList()
  },
  methods: {
    async getList(obj) {
      this.loading = true
      const { data } = await choice({ ...this.page, ...obj })
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
    audit(row) {
      this.currentAudit = row
      this.dialogAudit = true
    },
    async shelves(row) {
      try {
        await this.$confirm(`您确认${+row.publishState === 1 ? '下架' : '上架'}这道题目吗`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await choicePublish(row)
        this.$message.success('成功')
        this.getList()
      } catch (error) {
        this.$message.error('取消6')
      }
    },
    async del(row) {
      try {
        await this.$confirm(`您确认删除这道题目吗`, '提示', {
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
