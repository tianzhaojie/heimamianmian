<template>
  <div class="container">
    <el-dialog
      width="60%"
      title="题目预览"
      :visible="preview"
      @close="close"
    >
      <div class="topic">
        <el-row style="padding:10px 0">
          <el-col :span="6">【题型】:单选题</el-col>
          <el-col :span="6">【编号】:单选题</el-col>
          <el-col :span="6">【难度】:单选题</el-col>
          <el-col :span="6">【标签】:单选题</el-col>
        </el-row>
        <el-row style="padding:10px 0">
          <el-col :span="6">【学科】:单选题</el-col>
          <el-col :span="6">【目录】:单选题</el-col>
          <el-col :span="6">【方向】:单选题</el-col>
        </el-row>
        <hr>
        <div>【题干】：</div>
        <p style="color: rgb(0, 0, 254);">猫有几只眼睛？</p>
        <el-row>
          <div>单选题 选项：(以下选中的选项为正确答案)</div>
          <el-col style="8px 0"><el-radio v-model="radio" label="1">备选项</el-radio></el-col>
          <el-col><el-radio v-model="radio" label="1">备选项</el-radio></el-col>
          <el-col><el-radio v-model="radio" label="1">备选项</el-radio></el-col>
          <el-col><el-radio v-model="radio" label="1">备选项</el-radio></el-col>
        </el-row>
        <hr>
        <div class="video">
          【参考答案】：<el-button type="danger" size="small">视频答案预览</el-button>
        </div>
        <hr>
        <p class="answer">
          【答案解析】:https://cn.vuejs.org/ 有答案
        </p>
        <hr>
        <p class="answer">【题目备注】:https://cn.vuejs.org/ 有答案 </p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    preview: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // isShow: this.isPreview
      radio: ''
    }
  },
  created() {},
  methods: {
    close() {
      console.log(1)

      // this.$parent.isPreview = false
      this.$emit('update:preview', false)
    }
  }
}
</script>

<style scoped lang='scss'>
.topic {
  // padding: 20px;
  .answer {
    margin:14px 0;
    height: 30px;
    line-height: 30px;
  }
}
</style>
