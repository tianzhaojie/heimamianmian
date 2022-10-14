<template>
  <div class="container">
    <el-card class="box-card cardp">
      <!-- 标题 -->
      <div class="title-x">
        <div class="x-fl">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="目录名称">
              <el-input v-model="formInline.user" />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="formInline.region" placeholder="请选择">
                <el-option label="启用" value="启用" />
                <el-option label="禁用" value="禁用" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button>清除</el-button>
              <el-button type="primary" @click="onSubmit">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="x-fr">
          <el-button type="success" icon="el-icon-edit" @click="dialogVisible = true">新增目录</el-button>
        </div>
      </div>
      <!-- 消息提示 -->
      <el-alert type="info" show-icon>
        <template #title>
          数据一共 {{ counts }}条
        </template>
      </el-alert>
      <!-- 列表 -->
      <el-table :data="tableData" style="width: 100%" :header-cell-style="{background:'#fafafa'}">
        <el-table-column
          type="index"
          label="序号"
        />
        <el-table-column
          prop="subjectName"
          label="所属学科"
          width="180"
        />
        <el-table-column
          prop="directoryName"
          label="目录名称"
          width="180"
        />
        <el-table-column
          prop="username"
          label="创建者"
        />
        <el-table-column
          :formatter="ondate"
          prop="addDate"
          label="创建日期"
        />
        <el-table-column
          prop="totals"
          label="面试题数量"
        />
        <el-table-column
          :formatter="onstate"
          prop="state"
          label="状态"
        />
        <el-table-column
          label="操作"
        >
          <template slot-scope="{row}">
            <el-link type="primary" @click="getchangeState(row)">{{ row.state? '启用':'禁止' }}</el-link>&nbsp;
            <el-link :type="zhuangtai(row)" :disabled="row.state? false:true">修改</el-link>&nbsp;
            <el-link :type="zhuangtai(row)" :disabled="row.state? false:true" @click="removes(row)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部分页 -->
      <el-row>
        <el-col :span="24" :push="16"><div class="grid-content bg-purple-dark">
          <div class="block">
            <el-pagination
              background
              :current-page.sync="page.page"
              :page-sizes="[2, 5, 10, 15]"
              :page-size.sync="page.pagesize"
              layout="prev, pager, next, sizes, jumper"
              :total="counts"
              @current-change="getList"
              @size-change="getList"
            />
          </div>
        </div></el-col>
      </el-row>
    </el-card>
    <el-dialog
      title="新增目录"
      :visible.sync="dialogVisible"
      width="22%"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="tableData" label-width="80px" :rules="rules">
        <el-form-item label="所属学科">
          <el-select v-model="subjectValue" class="inp-xz" placeholder="请选择">
            <el-option v-for="(item, index) in simpleList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="目录名称" prop="directoryName">
          <el-input v-model="directoryValue" class="inp-xz" placeholder="请输入目录名称" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="addlist">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { list, simple, add, changeState, remove } from '@/api/hmmm/directorys.js'
import { status } from '@/api/hmmm/constants.js'
import { parseTime } from '@/utils'
export default {
  data() {
    return {
      formInline: {
        user: '', //
        region: ''//
      },
      page: {
        page: 1, // 页数
        pagesize: 10// 页尺寸
      },
      rules: {
        directoryName: [{ required: true, message: '目录名称不能为空', trigger: 'blur' }, {
          min: 1, max: 6, message: '目录名名为1-6位'
        }]
      },
      pages: 2,
      counts: 15, // 总条数
      tableData: {}, // 数据列表
      status: status, // 启用禁用
      dialogVisible: false, // 新增弹出框
      subjectValue: '', // 所属学科
      directoryValue: '', // 目录名称
      simpleList: {} // 目录简单列表
    }
  },
  created() {
    this.getList()
    this.getSimple()
  },
  methods: {
    zhuangtai(row) {
      return row.state ? 'primary' : 'info'
    },
    onSubmit() {
      console.log('submit!')
    },
    handleClose() {
      this.dialogVisible = false
    },
    async getList() { // 目录列表
      try {
        const { data } = await list(this.page)
        this.tableData = data.items
        this.counts = data.counts
        this.page.page = data.page
        this.pages = data.pages
        this.page.pagesize = data.pagesize
        console.log(data)
      } catch (error) {
        this.$message.error(error)
      }
    },
    async getSimple() { // 简单目录列表
      const res = await simple()
      this.simpleList = res.data
      // console.log(this.simpleList)
    },
    onstate(row, column, cellValue) { // 处理状态数据
      const arr = this.status.find(item => {
        return item.value === cellValue
      })
      return arr.label
      // console.log(arr)
    },
    ondate(row, column, cellValue) { // 处理日期数据
      return parseTime(cellValue)
    },
    async addlist() { // 新增
      try {
        const resadd = await add({ subjectID: this.subjectValue, directoryName: this.directoryValue })
        console.log(resadd)
        this.dialogVisible = false
        this.$message.success('新增成功')
      } catch (error) {
        this.$message.error('新增失败')
      }
    },
    async getchangeState(row) { // 修改状态
      const state = !row.state
      const state1 = !state ? 0 : 1
      console.log(state)
      try {
        const a = await changeState({ id: row.id, state: state1 })
        console.log(a)
        this.getList()
        this.$message.success('状态修改成功')
      } catch (error) {
        this.$message.error('状态修改失败')
      }
    },
    async dels(row) { // 删除行
      await remove(row)
      this.getList()
    },
    removes(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dels(row)
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
    }
  }
}
</script>

<style scoped lang='less'>
.title-x{
  display: flex;
  justify-content: space-between;
  .x-fl{
    display: flex;
   align-items: center;
   align-content: center;
}
}
.cardp{
  margin: 10px;
}
.inp-xz {
  width: 280px;
}
</style>
