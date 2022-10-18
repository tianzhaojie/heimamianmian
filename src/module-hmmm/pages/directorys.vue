<template>
  <div class="container">
    <el-card class="box-card cardp">
      <!-- 标题 -->
      <div class="title-x">
        <div class="x-fl">
          <el-form ref="searchFrom" :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="目录名称">
              <el-input v-model="formInline.directoryName" prop="directoryName" />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="formInline.state" placeholder="请选择" prop="state">
                <el-option label="启用" value="1" />
                <el-option label="禁用" value="0" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button @click="emptyList">清除</el-button>
              <el-button type="primary" @click="onSubmit">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-link v-show="jumpDisciplines" type="primary" :underline="false" class="backSubjct" @click="$router.push('/subjects/list')">←返回学科</el-link>
        <div class="x-fr">
          <el-button type="success" icon="el-icon-edit" @click="onrevise">新增目录</el-button>
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
            <el-link :type="zhuangtai(row)" :disabled="row.state? false:true" @click="onrevise(row)">修改</el-link>&nbsp;
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
      :title="title"
      :visible.sync="dialogVisible"
      width="22%"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="tanchuan" label-width="80px" :rules="rules">
        <el-form-item label="所属学科">
          <el-select v-model="tanchuan.subjectValue" class="inp-xz" placeholder="请选择">
            <el-option v-for="(item, index) in simpleList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="目录名称" prop="directoryValue">
          <el-input v-model="tanchuan.directoryValue" class="inp-xz" placeholder="请输入目录名称" />
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
import { directorysList as list, catalogsimple as simple, add, changeState, remove, update } from '@/api/hmmm/directorys.js'
import { status } from '@/api/hmmm/constants.js'
import { parseTime } from '@/utils'
export default {
  name: 'Directorys',
  data() {
    return {
      formInline: {
        directoryName: '', //
        state: ''//
      },
      page: {
        page: 1, // 页数
        pagesize: 10 // 页尺寸
      },
      rules: {
        directoryValue: [{ required: true, message: '目录名称不能为空', trigger: 'blur' }]
      },
      pages: 2,
      counts: 15, // 总条数
      tableData: [], // 数据列表
      status: status, // 启用禁用
      dialogVisible: false, // 新增弹出框
      tanchuan: {
        subjectValue: '', // 所属学科
        directoryValue: '' // 目录名称
      },
      simpleList: [], // 目录简单列表
      title: '新增目录',
      id: '',
      jumpDisciplines: false // 跳转学科
    }
  },
  created() {
    this.getList()
    this.getSimple()
  },
  methods: {
    emptyList() { // 搜索清空
      this.formInline = {
        user: '', //
        region: ''//
      }
    },
    onrevise(row) { // 判断并且赋值title
      if (!row.id) {
        this.title = '新增目录'
        this.tanchuan.subjectValue = ''
        this.tanchuan.directoryValue = ''
      } else {
        this.title = '修改目录'
        this.tanchuan.subjectValue = row.subjectID
        this.tanchuan.directoryValue = row.directoryName
        this.id = row.id
      }
      this.dialogVisible = true
    },
    zhuangtai(row) { // 状态判断
      return row.state ? 'primary' : 'info'
    },
    async onSubmit() { // 搜索
      const queryId = this.$route.query.id
      if (queryId) {
        const res = { ...this.formInline, ...this.page, subjectID: queryId }
        const { data } = await list(res)
        this.tableData = data.items
      } else {
        const res = { ...this.formInline, ...this.page }
        const { data } = await list(res)
        this.tableData = data.items
      }
    },
    handleClose() {
      this.dialogVisible = false
    },
    async getList() { // 目录列表
      const queryId = this.$route.query.id
      if (queryId) {
        const { data } = await list({ subjectID: queryId, ...this.page })
        this.jumpDisciplines = true
        this.tableData = data.items
        this.counts = data.counts
        this.page.page = +data.page
        this.pages = +data.pages
        this.page.pagesize = +data.pagesize
      } else {
        try {
          const { data } = await list(this.page)
          this.jumpDisciplines = false
          this.tableData = data.items
          this.counts = data.counts
          this.page.page = +data.page
          this.pages = +data.pages
          this.page.pagesize = +data.pagesize
        // console.log(data)
        } catch (error) {
          this.$message.error(error)
        }
      }
    },
    async getSimple() { // 简单目录列表
      const res = await simple()
      this.simpleList = res.data
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
      await this.$refs.form.validate()
      if (this.title === '新增目录') {
        await add({ id: this.id, subjectID: this.subjectValue, directoryName: this.directoryValue })
        this.dialogVisible = false
        this.$message.success('新增成功')
      } else if (this.title === '修改目录') {
        await update({ id: this.id, subjectID: this.subjectValue, directoryName: this.directoryValue })
        this.$message.success('修改成功')
      }
    },
    async getchangeState(row) { // 修改状态
      const state = !row.state
      const state1 = !state ? 0 : 1
      console.log(row)
      try {
        const a = await changeState({ id: row.id, state: state1 })
        console.log(a)
        this.getList()
        this.$message.success('状态修改成功')
      } catch (error) {
        this.$message.error('状态修改失败')
      }
    },
    async dels(row) { // 删除行接口
      await remove(row)
      this.getList()
    },
    removes(row) { // 删除行
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
.backSubjct{
  position: absolute;
  right: 10%;
  top: 13%;
}
</style>
