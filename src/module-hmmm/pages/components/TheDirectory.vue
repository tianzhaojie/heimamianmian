<template>
  <div>
    <el-dialog
      :title="titles"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose"
    >
      <span>
        <el-form ref="formBase" :model="formBase" :rules="rules" label-width="80px">
          <el-form-item label="活动名称" prop="title">
            <el-input v-model="formBase.title" />
          </el-form-item>
          <!-- 富文本编辑器 -->
          <el-form-item label="文章内容" prop="articleBody">
            <!-- 失去焦点时手动校验该字段 (当前 articleBody 属性值) -->
            <quill-editor
              v-model="formBase.articleBody"
              @blur="$refs.formBase.validateField('articleBody')"
            />
          </el-form-item>

          <el-form-item label="视屏地址">
            <el-input v-model="formBase.videoURL" />
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="createData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { add, update } from '../../../api/hmmm/articles'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    titles: {
      type: String,
      required: true
    },
    formBase: {
      type: [Object, undefined],
      required: true
    }
  },
  data() {
    return {
      rules: {
        title: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 1 }
        ],
        articleBody: [
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 弹窗
    handleClose() {
      this.$emit('update:dialogVisible', false)
    },
    // 新增
    createData() {
      this.$refs.formBase.validate(async valid => {
        if (valid) {
          this.handleClose()
          const data = {
            ...this.formBase
          }
          if (this.formBase.id) {
            await update(data).then(() => {
              this.$emit('newDataes', this.formBase)
            })
          } else {
            await add(this.formBase).then(() => {
              this.$emit('newDataes', this.formBase)
            })
          }
        } else {
          this.$message.error('*号为必填项!')
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">

::v-deep .ql-editor {
// 样式穿透
min-height: 180px !important;

}

</style>
