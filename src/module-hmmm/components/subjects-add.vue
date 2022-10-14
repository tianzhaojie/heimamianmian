<template>
  <div class="container">
    <el-dialog
      title="新增学科"
      :visible="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="formData" :model="form" label-width="80px">
        <el-form-item ref="subjectName" label="学科名称" prop="subjectName" :rules="{ required: true, message: '请填写学科内容', trigger: 'blur' }">
          <el-input v-model="form.subjectName" />
        </el-form-item>
        <el-form-item label="是否显示">
          <el-switch v-model="form.isFrontDisplay" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="dialogClose">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { add, update } from '@/api/hmmm/subjects.js'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: null
    },
    row: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      form: {
        isFrontDisplay: false,
        subjectName: '',
        id: null
      },
      formatForm: {}
    }
  },
  created() {
    if (this.id) {
      if (this.row.isFrontDisplay === '是') {
        this.row.isFrontDisplay = true
      } else {
        this.row.isFrontDisplay = false
      }
      this.form = {
        isFrontDisplay: this.row.isFrontDisplay,
        subjectName: this.row.subjectName,
        id: this.id
      }
    }
  },

  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false)
    },
    async dialogClose() {
      this.formatForm = this.form
      // this.formatForm.subjectName = this.formatForm.username
      // 处理数据
      this.isFrontDisplay(this.formatForm.isFrontDisplay)
      // 判断id是否存在，存在更新数据，不存在新建数据
      if (this.id) {
        try {
          await this.$refs.formData.validate()
          this.isFrontDisplay(this.formatForm.isFrontDisplay)
          await update(this.formatForm)
          this.$emit('update:id', null)
          this.$emit('getSubjectList')
          this.$emit('update:dialogVisible', false)
          this.$message.success('操作成功')
        } catch (error) {
          console.log(error)
        }
        return
      }
      if (this.form.subjectName.trim().length === 0) {
        this.$refs.subjectName.blur
        // console.log(1)
        await this.$refs.form.validate()
        return
      }
      await add(this.formatForm)
      this.$emit('getSubjectList')
      this.$emit('update:dialogVisible', false)
      this.$message.success('添加成功')
    },
    isFrontDisplay(boolean) {
      if (boolean) {
        boolean = 1
      } else {
        boolean = 0
      }
    }
  }
}
</script>

<style scoped lang='less'></style>
