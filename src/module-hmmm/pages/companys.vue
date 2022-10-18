<template>
  <div class="app-container">
    <el-card class="box-card">
      <!-- 表头表单 -->
      <el-form ref="formData" :inline="true" :model="formData" class="demo-form-inline">
        <el-row>
          <el-col
            :span="6"
          ><div class="grid-content bg-purple">
            <el-form-item label="标签名称">
              <el-input v-model="formData.tags" placeholder="请输入" />
            </el-form-item></div></el-col>
          <el-col
            :span="6"
          ><div class="grid-content bg-purple-light">
            <el-form-item label="城市">
              <el-select v-model="formData.province" placeholder="请选择" @change="AccessAreas">
                <el-option v-for="(item,index) in AllCities" :key="index" :label="item" :value="item" />
              </el-select>
            </el-form-item></div></el-col>
          <el-col
            :span="6"
          ><div class="grid-content bg-purple">
            <el-form-item label="地区">
              <el-select v-model="formData.city" placeholder="请选择" @change="AccessAreas">
                <el-option v-for="(item,index) in regions" :key="index" :label="item" :value="item" />
              </el-select>
            </el-form-item></div></el-col>
          <el-col
            :span="6"
          ><div class="grid-content bg-purple-light">
            <el-form-item label="企业简称">
              <el-input v-model="formData.shortName" placeholder="请输入" />
            </el-form-item></div></el-col>
        </el-row>
        <el-row>
          <el-col
            :span="6"
          ><div class="grid-content bg-purple" style="margin-left: 27px">
            <el-form-item label="状态">
              <el-select v-model="formData.state" placeholder="请选择">
                <el-option label="启用" value="1" />
                <el-option label="禁用" value="0" />
              </el-select>
            </el-form-item></div></el-col>
          <el-col
            :span="6"
          ><div class="grid-content bg-purple">
            <el-button style="margin-left: 60px" @click="resetForm()">清除</el-button>
            <el-button type="primary" @click="search">搜索</el-button>
          </div></el-col>
          <el-col
            :span="12"
            :push="9"
          ><div class="grid-content bg-purple-light">
            <el-button type="success" icon="el-icon-edit" @click="handleClick">新增用户</el-button>
          </div></el-col>
        </el-row>
      </el-form>
      <!-- 消息提示 -->
      <el-alert :title="`共${tableData.counts}条记录`" type="info" show-icon />
    </el-card>
    <!-- 表格内容 -->
    <el-table slot="empty" :data="tableData.items" style="width: 100%">
      <el-table-column prop="id" label="序号" width="80" />
      <el-table-column prop="number" label="企业编号" width="160" />
      <el-table-column prop="shortName" label="企业简称" width="100" />
      <el-table-column prop="tags" label="标签" />
      <el-table-column prop="creatorID" label="创建者" />
      <el-table-column prop="addDate" label="创建日期" />
      <el-table-column prop="remarks" label="备注" />
      <el-table-column label="状态">
        <template slot-scope="{row}">
          {{ row.state===1? '启用' : '禁用' }}
        </template></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="primary" icon="el-icon-edit" circle @click="handleClick1(row)" />
          <el-tooltip class="item" effect="dark" :content="row.state === 0? '禁用' : '启用'" placement="top">
            <el-button type="warning" :icon="row.state === 0? 'el-icon-close' :'el-icon-check'" circle @click="companys(row)" />
          </el-tooltip>
          <el-button type="danger" icon="el-icon-delete" circle @click="remove(row)" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-if="tableData.counts" :page="page" :total="tableData.counts" @pagination="list" />
    <!-- 新增弹窗 -->
    <companysAdd ref="child" v-loading="loading" :title-info="title" :form-base="formBase" @newDataes="add" />
    <!-- 修改弹窗 -->
    <companysAdd ref="child1" v-loading="loading" :title-info="title1" :form-base="rows" @newDataes="update" />
  </div>
</template>

<script>
import { datas, provinces, citys } from '../../api/hmmm/citys'
import { list, disabled, remove } from '../../api/hmmm/companys'
import pagination from './components/pagination.vue'
import companysAdd from '../../module-hmmm/components/companys-add.vue'
export default {
  name: 'City',
  components: {
    pagination, companysAdd
  },
  data() {
    return {
      loading: false,
      title: {
        text: '创建用户',
        pageTitle: ''
      },
      title1: {
        text: '修改用户',
        pageTitle: ''
      },
      datas, // 地区总数数据
      AllCities: {}, // 所有城市
      regions: {}, // 当前点击城市的地区
      page: {
        page: 1, // 当前页数
        pagesize: 10 // 页尺寸
      },
      formData: {
        tags: '', // 标签名称
        province: '', // 企业所在地省份
        city: '', // 企业所在城市
        shortName: '', //	企业简称
        state: '' // 状态
      },
      tableData: [], // 内容表格数据
      formBase: {
        isFamous: true,
        shortName: '',
        company: '',
        province: '',
        city: '',
        tags: '',
        remarks: ''
      }, // 新增数据
      rows: {
        id: '',
        number: '',
        isFamous: true,
        shortName: '',
        company: '',
        province: '',
        city: '',
        tags: '',
        remarks: ''
      }, // 修改数据
      state: {
        id: 0,
        state: ''
      }
    }
  },
  created() {
    // 获取城市数据
    this.AllCities = provinces(datas)
    this.list()
  },
  methods: {
    // 获取列表数据
    async list() {
      const { data } = await list(this.page)
      this.tableData = data
      // console.log(data)
    },
    // 搜索
    async search() {
      const res = { ...this.formData, ...this.page }
      const { data } = await list(res)
      this.tableData = data
    },
    // 表单清除
    resetForm() {
      // this.$refs[formName].resetFields()
      this.formData = {
        tags: '', // 标签名称
        province: '', // 企业所在地省份
        city: '', // 企业所在城市
        shortName: '', //	企业简称
        state: '' // 状态
      }
    },
    // 城市选择后触发事件获取地区
    AccessAreas() {
      const res = this.form.province
      this.regions = citys(res)
    },
    // 新增弹窗弹窗
    handleClick() {
      this.$refs.child.dialogFormV()
    },
    // 修改弹窗
    handleClick1(row) {
      console.log(row)
      this.rows.id = row.id
      this.rows.number = row.number
      this.rows.shortName = row.shortName
      this.rows.company = row.company
      this.rows.province = row.province
      this.rows.city = row.city
      this.rows.tags = row.tags
      this.rows.remarks = row.remarks
      this.$refs.child1.dialogFormV()
    },
    // 新增
    async add() {
      try {
        this.loading = true
        this.$message.success('新增成功')
        this.list()
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    // 修改
    async update() {
      try {
        this.loading = true
        this.$message.success('修改成功')
        this.list()
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    // 状态修改
    async companys(row) {
      const res = !row.state
      this.state.state = !res ? 0 : 1
      this.state.id = row.id
      await this.$confirm(`${this.state.state === 0 ? '已成功启动是否继续' : '已成功禁用 '}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await disabled(this.state)
      if (this.state.state === 0) {
        this.$message.success('禁用成功')
      } else {
        this.$message.success('启动成功')
      }
      this.list()
    },
    // 删除
    async remove(row) {
      await this.$confirm(`此操作将永久删除用户, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await remove(row)
      this.list()
    }

  }
}
</script>

<style scoped lang='less'>
</style>
