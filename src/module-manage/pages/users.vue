<template>
  <div>
    <el-card class="box-card">
      <!-- 头部搜索 -->

      <el-row :gutter="20">
        <el-form :inline="true" class="demo-form-inline">
          <el-col :span="16">
            <div class="grid-content bg-purple">
              <!-- 搜索框 -->
              <el-form-item>
                <el-input v-model="page.username" placeholder="根据用户名搜索" />
              </el-form-item>
              <!-- 按钮 -->
              <el-form-item>
                <el-button @click="delSubmit">清空</el-button>
              </el-form-item>
              <el-form-item>

                <el-button type="primary" @click="onSubmit">搜索</el-button>

              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6" style="padding-left: 18%;">
            <div class="grid-content bg-purple">
              <el-form-item style="margin-left:18px">

                <el-button icon="el-icon-edit" type="success" @click="addSubmit">新增用户</el-button>

              </el-form-item>
            </div>
          </el-col>
        </el-form>
      </el-row>

      <div data-v-ad10840c="" role="alert" class="el-alert alert el-alert--info is-light">
        <i class="el-alert__icon el-icon-info" />
        <div class="el-alert__content">
          <span class="el-alert__title">共 {{ counts }} 条记录</span>
          <i class="el-alert__closebtn el-icon-close" style="display: none;" />
        </div>
      </div>

      <!-- 表格 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%; margin-top:18px"
      >
        <el-table-column
          type="index"
          label="序号"
        />
        <el-table-column
          prop="email"
          label="邮箱"
        />
        <el-table-column
          prop="phone"
          label="联系电话"
        />
        <el-table-column
          prop="username"
          label="用户名"
        />
        <el-table-column
          prop="permission_group_title"
          label="权限组名称"
        />
        <el-table-column
          prop="role"
          label="角色"
        />
        <el-table-column label="操作">
          <template slot-scope="row">
            <el-button type="primary" plain size="small" icon="el-icon-edit" circle @click="btnOk(row)" />
            <el-button type="danger" plain size="small" icon="el-icon-delete" circle @click="btndel(row)" />

          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-row :gutter="24">
        <el-col :span="8" :push="14"><div class="grid-content bg-purple">
          <div class="block">
            <el-pagination
              v-if="counts > 0"
              background
              :current-page.sync="page.page"
              :page-size.sync="page.pagesize"
              :page-sizes="[3, 6, 10, 25]"
              layout=" prev, pager, next, sizes, jumper"
              :total="counts"
              @size-change="onSubmit"
              @current-change="onSubmit"
            />
          </div>
        </div></el-col>
      </el-row>

    </el-card>

    <!-- 新增用户弹窗 -->
    <adduser ref="adduser" :dialog-visible.sync="dialogVisible" :permissionname="editorial " />
    <!-- 修改用户弹窗 -->
    <ModifyUser ref="adduser" :dialog-visible-modifyuser.sync="dialogVisibleModifyuser" :permissions-name="editorial " />
  </div>
</template>

<script>
import ModifyUser from './components/Modify -user.vue'
import adduser from './components/add-user.vue'
import { list, detail, remove } from '../../api/base/users'
import { simple } from '../../api/base/permissions'
export default {
  name: 'User',
  components: { adduser, ModifyUser },

  data() {
    return {
      dialogVisibleModifyuser: false,
      dialogVisible: false,
      loading: false,
      page: {
        page: 1, // 当前页
        pagesize: 10, // 页的大小
        username: ''
      },
      counts: 0, // 总记录数
      pages: 0, // 总页数

      tableData: [],
      editorial: []
    }
  },
  created() {
    this.onSubmit()
  },
  methods: {
    // 搜索 + 渲染列表
    async onSubmit() {
      try {
        this.loading = true
        const { data } = await list(this.page)
        // console.log(data)
        this.tableData = data.list
        this.page.page = data.page - 0
        this.page.pagesize = data.pagesize - 0
        this.counts = data.counts
        if (this.counts > 0 && data.list.length === 0) {
          this.page.page = this.page.page - 1
          this.onSubmit()
        }
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },
    // 清空搜索
    delSubmit() {
      this.page = {
        page: 1, // 当前页
        pagesize: 10, // 页的大小
        username: ''
      }
      // 再次调用接口渲染页面
      this.onSubmit()
    },
    // 获取权限组名称
    async addSubmit() {
      this.dialogVisible = true
      const { data } = await simple(this.page)
      // console.log(data)
      this.editorial = data
      // console.log(this.editorial)
    },
    // 修改
    async btnOk({ row }) {
      // console.log(row)

      this.dialogVisibleModifyuser = true

      const { data } = await simple(this.page)
      // console.log(data)
      this.editorial = data

      await detail(row)
      // console.log(row)

      this.$refs.adduser.ruleForm.email = row.email
      this.$refs.adduser.ruleForm.introduction = row.introduction
      this.$refs.adduser.ruleForm.permission_group_id = row.permission_group_id
      this.$refs.adduser.ruleForm.phone = row.phone
      this.$refs.adduser.ruleForm.role = row.role
      this.$refs.adduser.ruleForm.username = row.username
      this.$refs.adduser.ruleForm.id = row.id
    },
    // 删除
    async btndel({ row }) {
      console.log(row.id)
      // console.log(id)
      console.log(2)

      try {
        await this.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
          type: 'warning'
        })
        console.log(3)
        await remove({ id: row.id })
        console.log(1)
        this.onSubmit()
        this.$message.success('删除成功')
      } catch (err) {
        this.$message.error('删除失败')
      }
    }
  }

}
</script>

<style scoped lang='less'>
.box-card{
  margin: 18px 18px;
}
.block {
  margin-top: 18px;
}
</style>
