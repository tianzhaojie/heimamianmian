<template>
  <el-dialog
    title="题目审核"
    :visible="dialogAudit"
    width="30%"
    @close="handleClose"
  >

    <el-radio v-model="chkState" label="1">通过</el-radio>
    <el-radio v-model="chkState" label="2">拒绝</el-radio>
    <el-input
      v-model="chkRemarks"
      style="margin-top:30px"
      type="textarea"
      :rows="2"
      placeholder="请输审核意见"
    />
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { choiceCheck } from '@/api/hmmm/questions'
export default {
  name: 'Audit',
  props: {
    dialogAudit: {
      type: Boolean,
      default: false
    },
    currentAudit: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      chkState: '',
      chkRemarks: ''
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogAudit', false)
    },
    async submit() {
      if (this.chkState === '' || this.chkRemarks === '') {
        this.$message('请补全信息')
      } else {
        await choiceCheck({ chkRemarks: this.chkRemarks, chkState: +this.chkState, id: this.currentAudit.id })
        this.$parent.getList()
        this.handleClose()
      }
    }
  }

}
</script>

<style>

</style>
