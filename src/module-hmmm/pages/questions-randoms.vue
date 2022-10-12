<template>
  <div class="question-container">
    <el-card class="container">
      <el-row class="title">
        <el-col>
          <span class="word">关键字</span>
          <el-input placeholder="根据编号搜索" style="width:240px;margin-left:10px" />
        </el-col>
        <el-col class="btn" :span="12" style="margin-left:50%;">
          <el-button size="small">清除</el-button>
          <el-button size="small" type="primary">搜索</el-button>
        </el-col>
      </el-row>
      <el-row class="total" type="flex" align="center">
        <i class="el-icon-info" style="font-size:16px" />
        <div>数据一共 {{ total }} 条</div>
      </el-row>
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
        />
        <el-table-column
          prop="questionIDs"
          label="题目编号"
          width="220"
        />
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
          <el-button type="danger" icon="el-icon-delete" circle />
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { randoms } from '@/api/hmmm/questions'
export default {
  data() {
    return {
      total: '0',
      loading: false,
      tableData: [],
      page: {
        page: 1,
        pagesize: 10
      }
    }
  },
  created() {
    this.getrandoms()
  },
  methods: {
    async  getrandoms() {
      const { data: { counts, items }} = await randoms()
      // console.log(data)
      this.total = counts
      this.tableData = items
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
      height: 1000px;
    }
    .title {
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
    :deep(.el-table th) {
      background-color: #fafafa!important;
    }
   :deep(.el-table th.is-leaf) {
      border-bottom: 2px solid #e8e8e8!important;
    }
}
</style>
