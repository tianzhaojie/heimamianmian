<template>
  <el-dialog
    title="创建用户"
    :visible.sync="dialogVisible"
    width="50%"
    :before-close="handleClose"
  >
    <!-- 创建form -->
    <el-form
      ref="Formdata"
      :model="ruleForm"
      :rules="rules"
      label-width="180px"
      class="demo-ruleForm"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="ruleForm.email" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" />
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-input v-model="ruleForm.role" />
      </el-form-item>
      <el-form-item label="权限组名称" prop="permission_group_id">
        <el-select v-model="ruleForm.permission_group_id" placeholder="请选择">
          <el-option
            v-for="item in permissionname"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
          <!-- <el-option label="编辑组" value="beijing" /> -->
        </el-select>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="ruleForm.phone" />
      </el-form-item>
      <el-form-item label="介绍" prop="introduction">
        <el-input
          v-model="ruleForm.introduction"
          type="textarea"
          placeholder="Please input"
        />
      </el-form-item>

      <el-form-item>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="addForm">确定</el-button>
      </el-form-item>
    </el-form>
    <!-- 修改form -->
    <!-- <el-form ref="Formdata" :model="ruleForm" :rules="rules" label-width="180px" class="demo-ruleForm">
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
    </el-form> -->
  </el-dialog>
</template>

<script>
import { add } from '../../../api/base/users'
export default {
  name: 'Adduser',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    permissionname: {
      type: Array,
      required: true
    }

  },
  data () {
    return {
      ruleForm: {
        username: '',
        email: '',
        password: '',
        role: '',
        introduction: '',
        phone: '',
        permission_group_id: '',
        avatar: 111
      },
      rules: {
        username: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' },
          { min: 3, max: 5, message: '用户名称长度需在 3 到 5 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 3, message: '密码长度最低 3 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {

  },
  created () {

  },
  methods: {
    handleClose () {
      this.$emit('update:dialogVisible', false)
      this.$refs.Formdata.resetFields()
    },
    async addForm() {
      try {
        await this.$refs.Formdata.validate()

        await add(this.ruleForm)
        // this.ruleForm.id ? await update(this.ruleForm) : await add(this.ruleForm)
        this.$message.success('新增成功')
        this.$parent.onSubmit()
        this.handleClose()
      } catch (err) {
        console.log(err)
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: center;
}
</style>
