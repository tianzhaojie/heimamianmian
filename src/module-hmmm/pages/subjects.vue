<template>
  <div class="container">
    <div class="from">
      <el-form ref="fromData" :model="fromData" label-width="100px" class="demo-ruleForm">
        <span>学科名称</span>
        <el-input v-model.trim="fromData.subjectName" autocomplete="off" class="input" />
        <el-button @click="resetForm">清除</el-button>
        <el-button type="primary" @click="submitForm('numberValidateForm')">搜索</el-button>
        <div class="rightBtn">
          <el-button type="primary" icon="el-icon-edit" size="small" class="btn" @click="subjectsAdd">添加学科</el-button>
        </div>
      </el-form>
      <el-alert :title="`数据一共${counts}条`" type="info" show-icon :closable="false" class="info" />
      <el-table
        :data="subjectList"
        style="width: 100%"
      >
        <el-table-column
          type="index"
          prop="date"
          label="序号"
          width="50"
        />
        <el-table-column
          prop="subjectName"
          label="学科名称"
        />
        <el-table-column
          prop="username"
          label="创建者"
        />
        <el-table-column
          prop="addDate"
          label="创建日期"
        />
        <el-table-column
          prop="isFrontDisplay"
          label="前台是否显示"
        />
        <el-table-column
          prop="twoLevelDirectory"
          label="二级目录"
        />
        <el-table-column
          prop="tags"
          label="标签"
        />
        <el-table-column

          prop="totals"
          label="题目数量"
        />
        <el-table-column
          fixed="right"
          width="240"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small">学科分类</el-button>
            <el-button type="text" size="small">学科标签</el-button>
            <el-button type="text" size="small" @click="edit(scope.row)">修改</el-button>
            <el-button type="text" size="small" @click="handleClick(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <subjects-add v-if="dialogVisible" :id.sync="id" :row="row" :dialog-visible.sync="dialogVisible" @getSubjectList="getSubjectList" />
      <el-pagination
        background
        layout="prev, pager, next,sizes, jumper"
        :total="counts"
        :page-size.sync="fromData.pagesize"
        :page-sizes="[2, 4, 6, 8, 10]"
        :current-page.sync="fromData.page"
        class="page"
        @current-change="changePage"
      />
    </div>
  </div>
</template>

<script>
import { list, remove } from '@/api/hmmm/subjects.js'
import dayjs from 'dayjs'
import subjectsAdd from '../components/subjects-add.vue'
export default {
  components: {
    subjectsAdd
  },
  data() {
    return {
      fromData: {
        subjectName: '',
        page: 1,
        pagesize: 10
      },
      counts: 0,
      subjectList: [],
      show: {
        1: '是',
        0: '否'
      },
      dialogVisible: false,
      id: 0,
      row: {}
    }
  },
  async created() {
    this.getSubjectList()
  },
  methods: {
    submitForm() {
      this.getSubjectList()
    },
    resetForm() {
      this.fromData.subjectName = ''
    },
    changePage() {
      this.getSubjectList()
    },
    async getSubjectList() {
      const { data } = await list(this.fromData)

      this.subjectList = data.items
      this.subjectList.forEach(item => {
        item.addDate = dayjs(item.addDate).format('YYYY-MM-DD HH:mm:ss')
        item.isFrontDisplay = this.show[item.isFrontDisplay]
      })
      this.counts = data.counts
    },
    // 添加
    subjectsAdd() {
      this.id = null
      this.dialogVisible = true
    },
    edit(i) {
      this.id = i.id
      this.row = i
      this.dialogVisible = true
    },
    async handleClick(row) {
      this.$confirm('此操作将永久删除该学科, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
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
      await remove(row)
      this.getSubjectList()
    }
  }
}
</script>

<style scoped lang='less'>
.container{
  padding: 10px;
  background-color: #fff;
  .from{
   padding: 10px;
    .demo-ruleForm{
    margin-bottom: 20px;
    span{
     font-size: 14px;
     font-weight: 700;
     margin-right: 10px;
     color: #606266;
    }
    .input{
   width: 200px;
   margin-right: 20px;
   }
    .rightBtn{
      .btn{
         position: absolute;
         top: 30px;
         right: 30px;
         background-color: #67c23a;
         color: #fff;
       }
     }
  }
 }
 .info{
  margin-bottom: 20px;
 }
 .page{
  margin-top: 20px;
display: flex;
justify-content: end;

 }
}
</style>
