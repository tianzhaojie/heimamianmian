<template>
  <div class="question-container">
    <el-card class="container">
      <el-row class="search">
        <el-col>
          <span class="word">关键字</span>
          <el-input v-model="word" placeholder="根据编号搜索" style="width:240px;margin-left:10px" />
        </el-col>
        <el-col class="btn" :span="12" style="margin-left:50%;">
          <el-button size="small" @click="clear">清除</el-button>
          <el-button size="small" type="primary" @click="search">搜索</el-button>
        </el-col>
      </el-row>
      <el-row class="total" type="flex" align="center">
        <i class="el-icon-info" style="font-size:16px" />
        <div>数据一共 {{ total }} 条</div>
      </el-row>
      <el-row class="table">
        <el-table
          v-loading="loading"
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column
            prop="id"
            label="编号"
            width="220"
          />
          <el-table-column
            prop="questionType"
            label="题型"
            width="80"
            :formatter="formatterFn"
          />
          <el-table-column
            prop="questionIDs"
            label="题目编号"
            width="220"
          >
            <template slot-scope="{row}">
              <div v-for="(item,index) in row.questionIDs" :key="index">
                <a href="javascript:void(0);" style="color: rgb(0, 153, 255);" @click="preview(item.id)">{{ item.number }}</a>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="addTime"
            label="录入时间"
            width="180"
          />
          <el-table-column
            prop="totalSeconds"
            label="答题时间(s)"
            width="165"
          />
          <el-table-column
            prop="accuracyRate"
            label="正确率(%)"
            width="165"
          />
          <el-table-column
            prop="userName"
            label="录入人"
            width="165"
          />
          <el-table-column
            prop="address"
            label="操作"
            width="80"
          >
            <template slot-scope="{row}">
              <el-button type="danger" icon="el-icon-delete" circle @click="del(row.id)" />
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row type="flex" justify="end">
        <el-pagination
          background
          :current-page.sync="page.page"
          :page-sizes="[2, 5, 10, 15]"
          :page-size.sync="page.pagesize"
          layout="  prev, pager, next,sizes,jumper"
          :total="total"
          @size-change="getrandoms"
          @current-change="getrandoms"
        />
      </el-row>
    </el-card>
    <questionsPreview :preview.sync="isPreview" :detail-list="detailList" />
  </div>
</template>

<script>
import { randoms, detail, removeRandoms } from '@/api/hmmm/questions'
import questionsPreview from '@/module-hmmm/components/questions-preview'
export default {
  components: { questionsPreview },
  data() {
    return {
      word: '',
      total: 0,
      loading: false,
      tableData: [],
      page: {
        page: 1,
        pagesize: 10
      },
      questions: [
        { id: 1, label: '1', value: '单选' },
        { id: 2, label: '2', value: '多选' },
        { id: 3, label: '3', value: '简答' }
      ],
      isPreview: false,
      detailList: {}
    }
  },
  created() {
    // 获取列表
    this.getrandoms()
  },
  methods: {
    async  getrandoms() {
      const { data: { counts, items }} = await randoms(this.page)
      console.log(counts, items)
      // 如果删除这列表的数据的最后一个且数组还有的情况下 就page--获取上一页
      if (counts && items.length === 0) {
        this.page.page--
        this.getrandoms(this.page)
      }
      this.total = counts
      this.tableData = items
    },
    formatterFn(row, column, cellValue) {
      const res = this.questions.find(item => item.label === cellValue)
      return res.value
    },
    // 清除表单
    clear() {
      this.word = ''
    },
    // 搜索
    async  search() {
      const { data } = await randoms({ keyword: this.word })
      console.log(data)
      this.tableData = data.items
    },
    // 预览
    async  preview(id) {
      console.log(id)
      this.isPreview = true
      const { data } = await detail({ id, isNext: false })
      this.detailList = data
    },
    // 删除
    async del(id) {
      console.log(id)
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await removeRandoms({ id })
        this.$message.success('删除成功')
        this.getrandoms()
      } catch (e) {
        this.$message.error('删除失败')
      }
    }
  }
}
</script>

<style scoped lang='less'>
.question-container {
    padding: 0 10px;
    margin: 10px 0;
    .container {
      // padding: 20px;
      background: #fff;
      width: 100%;
    }
    .search {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 18px;
      .word {
        margin-left: 20px;
        color: #606266;
        font-weight: 700;
        font-size: 14px;
        // float: right;
      }
      .btn {
        display: flex;
        justify-content: flex-end;      }
    }
    .total {
      padding: 8px 16px;
      height: 35px;
      // line-height: 35px;
      background-color: #f4f4f5;
      font-size: 13px;
      color: #909399;
      margin-bottom: 15px;
      div {
        padding:  0 8px;
        vertical-align: middle;
      }
    }
    .table{
      margin-bottom: 15px;
    }
    :deep(.el-table th) {
      background-color: #fafafa!important;
    }
   :deep(.el-table th.is-leaf) {
      border-bottom: 2px solid #e8e8e8!important;
    }
}
</style>
