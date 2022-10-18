<template>
  <el-dialog
    title="修改用户"
    :visible.sync="dialogVisibleModifyuser"
    width="50%"
    :before-close="handleClose"
  >

    <!-- form -->
    <el-form ref="Formdata" :model="ruleForm" :rules="rules" label-width="180px" class="demo-ruleForm">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="ruleForm.email" />
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-input v-model="ruleForm.role" />
      </el-form-item>
      <el-form-item label="权限组名称" prop="permission_group_id">
        <el-select v-model="ruleForm.permission_group_id" placeholder="请选择">
          <el-option v-for="item in permissionsName" :key="item.id" :label="item.title" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="ruleForm.phone" />
      </el-form-item>
      <el-form-item label="介绍" prop="introduction">
        <el-input v-model="ruleForm.introduction" type="textarea" placeholder="Please input" />
      </el-form-item>

      <el-form-item>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="addForm">确定</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>
</template>

<script>
import { update } from '../../../api/base/users'
export default {
  name: 'ModifyUser',
  props: {
    dialogVisibleModifyuser: {
      type: Boolean,
      default: false
    },
    permissionsName: {
      type: Array,
      required: true
    }

  },
  data() {
    return {
      ruleForm: {
        id: '',
        avatar: '',
        username: '',
        email: '',
        role: '',
        introduction: '',
        phone: '',
        permission_group_id: ''
      },

      rules: {
        username: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' },
          { min: 3, max: 5, message: '用户名称长度需在 3 到 5 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisibleModifyuser', false)
      this.$refs.Formdata.resetFields()
    },
    async addForm() {
      try {
        await this.$refs.Formdata.validate()
        await update(this.ruleForm)
        this.$message.success('修改成功')
        this.$parent.onSubmit()
        this.handleClose()
      } catch (err) {
        this.$message.error('修改失败')
      }
    }

  }

}
</script>

<style>

</style>
