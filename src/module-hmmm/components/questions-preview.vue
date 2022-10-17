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
          <el-col :span="6">【编号】:{{ detailList.id }}</el-col>
          <el-col :span="6">【难度】:{{ detailList.difficulty ? formatterFn(detailList.difficulty) : '' }}</el-col>
          <el-col :span="6">【标签】:{{ detailList.tags }}</el-col>
        </el-row>
        <el-row style="padding:10px 0">
          <el-col :span="6">【学科】:{{ detailList.subjectName }}</el-col>
          <el-col :span="6">【目录】:{{ detailList.directoryName }}</el-col>
          <el-col :span="6">【方向】:{{ detailList.direction }}</el-col>
        </el-row>
        <hr>
        <div>【题干】：</div>
        <p style="color: rgb(0, 0, 254);" v-html=" detailList.question " />
        <el-row>
          <div>{{ detailList.questionType ? formatterType(detailList.questionType) : '' }} 选项：（以下选中的选项为正确答案）</div>
          <el-col v-for="item in detailList.options" :key="item.id" style="8px 0">
            <el-radio-group v-model="radio">
              <el-radio
                style="padding:8px 0"
                :label="item.isRight"
              >{{ item.title }}</el-radio>
            </el-radio-group>

          </el-col>

        </el-row>
        <hr>
        <div style="height:340px">
          【参考答案】：<el-button type="danger" size="small" @click="detailList.videoURL ? isShow = true : isShow = false">视频答案预览</el-button>
          <div v-if="isShow" class="video">
            <video controls="controls" :src="detailList.videoURL" style="height:300px;width:400px" />

          </div>
        </div>
        <hr>
        <el-row type="flex" align="center">
          <span class="answerParsing">【答案解析】：</span>
          <div class="answer" v-html=" detailList.answer " />
        </el-row>
        <hr>
        <p class="answer">【题目备注】：{{ detailList.remarks }}</p>
        <el-row type="flex" justify="end">
          <el-button type="primary" @click="close">关闭</el-button>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { difficulty, questionType } from '@/api/hmmm/constants'
export default {
  props: {
    preview: {
      type: Boolean,
      default: false
    },
    detailList: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // isShow: this.isPreview
      radio: 1,
      difficulty,
      questionType,
      isShow: false
    }
  },
  computed: {

  },
  created() {},
  methods: {
    close() {
      console.log(1)

      // this.$parent.isPreview = false
      this.$emit('update:preview', false)
    },
    formatterFn(value) {
      const res = this.difficulty.find(item => item.value === +value)
      return res.label
    },
    formatterType(value) {
      const res = this.questionType.find(item => item.value === +value)
      return res.label
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
  :deep(p) {
    margin: 0px!important;
  }
  }
}
.answerParsing {
  line-height: 58px;
}
.video {
  margin-top: 5px;
  width: 400px;
  height: 300px;
}
</style>
