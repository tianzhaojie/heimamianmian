<template>
  <el-dialog
    title="题目预览"
    :visible="dialogPreview"
    width="900px"
    @close="handleClose"
  >
    <el-row>
      <el-col :span="6">【题型】&nbsp;:&nbsp;{{ $parent.computedType(currentPreview) }}</el-col>
      <el-col :span="6">【编号】&nbsp;:&nbsp;{{ currentPreview.id }}</el-col>
      <el-col :span="6">【难度】&nbsp;:&nbsp;{{ $parent.hardType(currentPreview) }}</el-col>
      <el-col :span="6">【标签】&nbsp;:&nbsp;{{ currentPreview.tags }}</el-col>
      <el-col :span="6">【学科】&nbsp;:&nbsp;{{ currentPreview.subjectName }}</el-col>
      <el-col :span="6">【目录】&nbsp;:&nbsp;{{ currentPreview.directoryName }}</el-col>
      <el-col :span="6">【方向】&nbsp;:&nbsp;{{ currentPreview.direction }}</el-col>
    </el-row>

    <hr>
    【题干】
    <div style="color:#1f1fff" v-html="currentPreview.question" />
    <div v-if="+currentPreview.questionType === 1" class="subject">
      {{ $parent.computedType(currentPreview) }}题  选项:   (以下选中的选项为正确答案)
      <div v-for="item,index in currentPreview.options" :key="index">
        <template>
          <el-radio :value="radio" :label="item.isRight" style="padding: 8px 0px;">{{ item.title }}</el-radio>
        </template>
      </div>
    </div>
    <div v-if="+currentPreview.questionType === 2" class="subject">
      {{ $parent.computedType(currentPreview) }}题  选项:   (以下选中的选项为正确答案)
      <div v-for="item,index in currentPreview.options" :key="index">
        <template>
          <el-checkbox
            :value="item.isRight"
            style="padding: 8px 0px;"
            :true-label="1"
            :false-label="0"
            @change="checkchange"
          >{{ item.title }}</el-checkbox>
        </template>
      </div>
    </div>

    <hr>
    【参考答案】
    <el-button type="danger" size="small" @click="showVideo = true">视频答案预览</el-button>
    <div v-if="showVideo" class="video" style="width:400px;height:300px">
      <video src="" controls="controls" style="width:100% ;height:100%" />
    </div>
    <hr>
    【答案解析】
    <div style="display: inline-block;">
      <span v-html="currentPreview.answer" />
    </div>
    <hr>
    【题目备注】
    <div style="display: inline-block;">
      <span>{{ currentPreview.remarks }}</span>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    dialogPreview: {
      type: Boolean,
      default: false
    },
    currentPreview: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      radio: 1,
      showVideo: false,
      A: true
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogPreview', false)
    }

  }
}
</script>

<style lang="less" scoped>
 .el-col-6 {
  padding:10px 0
 }
</style>
