<template>
  <div>
    <el-card class="box-card">
      <!-- 头部搜索 -->

      <el-row :gutter="20">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-col :span="16">
            <div class="grid-content bg-purple">
              <!-- 搜索框 -->
              <el-form-item>
                <el-input placeholder="根据用户名搜索" />
              </el-form-item>
              <!-- 按钮 -->
              <el-form-item>
                <el-button @click="onSubmit">清空</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">搜索</el-button>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6" style="padding-left: 18%;">
            <div class="grid-content bg-purple">
              <el-form-item style="margin-left:18px">
                <el-button icon="el-icon-edit" type="success" @click="onSubmit">新增用户</el-button>
              </el-form-item>
            </div>
          </el-col>
        </el-form>
      </el-row>

      <div data-v-ad10840c="" role="alert" class="el-alert alert el-alert--info is-light">
        <i class="el-alert__icon el-icon-info" />
        <div class="el-alert__content">
          <span class="el-alert__title">共 2 条记录</span>
          <i class="el-alert__closebtn el-icon-close" style="display: none;" />
        </div>
      </div>

      <!-- 表格 -->
      <el-table
        :data="tableData"
        style="width: 100%; margin-top:18px"
      >
        <el-table-column
          type="index"
          label="序号"
        />
        <el-table-column
          prop="name"
          label="邮箱"
        />
        <el-table-column
          prop="联系电话"
          label="联系电话"
        />
        <el-table-column
          prop="用户名"
          label="用户名"
        />
        <el-table-column
          prop="权限组名称"
          label="权限组名称"
        />
        <el-table-column
          prop="角色"
          label="角色"
        />
        <el-table-column label="操作">
          <template>
            <el-button type="primary" plain size="small" icon="el-icon-edit" circle />
            <el-button type="danger" plain size="small" icon="el-icon-delete" circle />

          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->

      <el-row :gutter="24">
        <el-col :span="8" :push="14"><div class="grid-content bg-purple">
          <div class="block">
            <el-pagination
              background
              :current-page="currentPage4"
              :page-sizes="[2, 5, 10, 20]"
              :page-size="10"
              layout=" prev, pager, next, sizes, jumper"
              :total="18"
            />
          </div>
        </div></el-col>
      </el-row>

    </el-card>
  </div>
</template>

<script>
export default {

  data() {
    return {
      currentPage4: 1,
      formInline: {
        user: '',
        region: ''
      },
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  created() {},
  methods: {
    onSubmit() {
      console.log('submit!')
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
