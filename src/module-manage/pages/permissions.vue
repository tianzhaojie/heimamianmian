<template>
  <div>
    <el-card class="box-card">
      <!-- 头部搜索 + 新增 -->
      <el-row :gutter="20">
        <el-form :inline="true" class="demo-form-inline">
          <!-- 搜索 -->
          <el-col :span="16">
            <div class="grid-content bg-purple">
              <!-- 搜索框 -->
              <el-form-item>
                <el-input v-model="page.title" placeholder="根据用户名搜索" />
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
          <!-- 新增 -->
          <el-col :span="6" style="padding-left: 18%">
            <div class="grid-content bg-purple">
              <el-form-item style="margin-left: 18px">
                <el-button icon="el-icon-edit" type="success" @click="addSubmit"
                  >新增用户</el-button
                >
              </el-form-item>
            </div>
          </el-col>
        </el-form>
      </el-row>

      <div
        data-v-ad10840c=""
        role="alert"
        class="el-alert alert el-alert--info is-light"
      >
        <i class="el-alert__icon el-icon-info" />
        <div class="el-alert__content">
          <span class="el-alert__title">共 {{ counts }} 条记录</span>
          <i class="el-alert__closebtn el-icon-close" style="display: none" />
        </div>
      </div>

      <!-- 表格 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%; margin-top: 18px"
      >
        <el-table-column type="selection" />
        <el-table-column prop="title" label="用户名" />
        <el-table-column prop="create_date" label="日期" sortable>
          <template slot-scope="{ row }">
            {{ row.create_date | parseTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button
              type="primary"
              plain
              size="small"
              icon="el-icon-edit"
              circle
              @click="btnOk(row)"
            />
            <el-button
              type="danger"
              plain
              size="small"
              icon="el-icon-delete"
              circle
              @click="btndel(row)"
            />
          </template>
        </el-table-column>
      </el-table>

      <!-- 新增弹出层 -->
      <el-dialog
        title="新增权限组"
        :visible.sync="dialogFormVisible"
        width="50%"
      >
        <el-form ref="formDate" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="用户名" prop="title">
            <el-input v-model="form.title" style="width: 300px"></el-input>
          </el-form-item>
          <!-- >&nbsp; -->
          <el-form-item label="权限分配">
            <el-tree
              ref="tree"
              :data="data"
              show-checkbox
              default-expand-all
              node-key="id"
              :props="defaultProps"
              :getCheckedKeys="getKeys"
            >
            </el-tree>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addOk">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 修改弹出层 -->
      <el-dialog
        title="修改权限组"
        :visible.sync="dialogFormVisible1"
        width="50%"
      >
        <el-form
          ref="formDate"
          :model="rowss"
          :rules="rules"
          label-width="80px"
        >
          <el-form-item label="用户名" prop="title">
            <el-input v-model="rowss.title" style="width: 300px"></el-input>
          </el-form-item>
          <!-- >&nbsp; -->
          <el-form-item label="权限分配">
            <el-tree
              ref="tree"
              :data="data"
              show-checkbox
              default-expand-all
              node-key="id"
              :props="defaultProps"
              :getCheckedKeys="rowss.permissions"
              :default-checked-keys="rowss.permissions"
            >
            </el-tree>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="addOk1">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 分页 -->
      <el-row :gutter="24">
        <el-col :span="8" :push="14"
          ><div class="grid-content bg-purple">
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
            </div></div
        ></el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { list, add, detail, update, remove } from '../../api/base/permissions'
import { list as listquanxz } from '../../api/base/menus'
export default {
  name: 'permissions',
  components: {},

  data () {
    return {

      tableData: [],
      rules: {
        title: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
      }
    }
  },

  created () {
    this.onSubmit()
    this.getquanx()
  },

  created() {
    this.onSubmit()
    this.getquanx()
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
    async getquanx() {
      const { data } = await listquanxz()
      // console.log(data)
      this.data = data
      // 给一个最大的父节点
      this.data = [{ title: '系统菜单和页面权限点', childs: data, id: 0 }]
    },
    async addSubmit() {
      this.dialogFormVisible = true
    },
    // 新增
    async addOk(row) {
      console.log(row)
      this.$refs.formDate.validate() // 判断验证规则是否通过
      const arr = this.$refs.tree.getCheckedKeys() // 获取点击数节点的id存放到数组里面
      // console.log(arr)
      this.form.permissions = arr
      try {
        // 调用接口
        await add(this.form)
        this.onSubmit()
        this.$message.success('新增成功')
      } catch (err) {
        this.$message.error('新增失败')
      } finally {
        this.dialogFormVisible = false
      }
    },
    // 修改 先数据回显
    async btnOk(row) {
      this.dialogFormVisible1 = true
      const { data } = await detail(row)
      // console.log(data)
      this.rowss.permissions = data.permissions
      this.rowss.title = data.title
      this.rowss.id = data.id
    },
    // 修改 + 渲染
    async addOk1() {
      this.$refs.formDate.validate() // 判断验证规则是否通过
      // 调用接口
      try {
        await update(this.rowss)
        this.onSubmit()
        this.$message.success('修改成功')
        // this.rowss.permissions = []
        // console.log(this.rowss.permissions)
      } catch (err) {
        this.$message.error('修改失败')
      } finally {
        this.dialogFormVisible1 = false
        // this.rowss.permissions = []
      }
    },
    // 删除
    async btndel(row) {
      try {
        await this.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
          type: 'warning'
        })
        await remove(row)
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
.box-card {
  margin: 18px 18px;
}
.block {
  margin-top: 18px;
}
</style>
