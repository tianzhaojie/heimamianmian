<template>

  <el-card>
    <div class="addQuestions">
      <span>
        说明：目前支持学科和关键字条件筛选
      </span>
      <el-button type="success" icon="el-icon-edit" size="small">新增试题</el-button>
    </div>
    <el-form ref="form" :model="formData" class="demo-form-inline">
      <el-row>
        <el-col :span="6">
          <el-form-item label="学科" style="width:100" label-width="80px">
            <el-select v-model="formData.subjectID" placeholder="请选择" size="small" style="width:100%" @change="changeSelect">
              <el-option v-for="item in subjectList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="二级目录" label-width="80px">
            <el-select v-model="formData.catalogID" placeholder="活动区域" size="small" style="width:282px">
              <el-option v-for="item in catalogList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="标签" label-width="80px">
            <el-select v-model="formData.tags" placeholder="活动区域" size="small" style="width:100%">
              <el-option v-for="item in tagList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="关键字" label-width="80px">
            <el-input v-model="formData.keyword" placeholder="根据题干搜索" size="small" style="width:100%" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="试题类型" label-width="80px">
            <el-select v-model="formData.questionType" placeholder="请选择" size="small" style="width:100%">
              <el-option v-for="item in questionTypeList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="难度" label-width="80px">
            <el-select v-model="formData.difficulty" placeholder="请选择" size="small" style="width:100%">
              <el-option v-for="item in difficultyList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="方向" label-width="80px">
            <el-select v-model="formData.direction" placeholder="请选择" size="small" style="width:100%">
              <el-option v-for="(item,index) in directionList" :key="index" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="录入人" label-width="80px">
            <el-select v-for="item in userInfo" :key="item.id" v-model="formData.creatorID" placeholder="请选择" size="small" style="width:100%">
              <el-option :label="item.username" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="题目备注" label-width="80px">
            <el-input v-model="formData.remarks" size="small" style="width:100%" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="企业简称" label-width="80px">
            <el-input v-model="formData.shortName" size="small" style="width:100%" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="标签" label-width="80px">
            <el-select v-model="formData.province" placeholder="请选择" size="small" style="width:48% ;margin-right:2%" @change="cityChange">
              <el-option v-for="item in cityList" :key="item" :label="item" :value="item" />
            </el-select>
            <el-select v-model="formData.city" placeholder="请选择" size="small" style="width:50%">
              <el-option v-for="item in lowerCitys" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>

        </el-col>

        <el-col :span="6">
          <el-form-item style="text-align: right;" label-width="80px">
            <el-button @click="submit">搜索</el-button>
            <el-button @click="reset">清除</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <el-alert
        type="info"
        show-icon
      >
        <template #title>
          数据一共{{ total }}条
        </template>
      </el-alert>
    </div>
  </el-card>

</template>

<script>
import { simple } from '@/api/hmmm/subjects'
import { catalogsimple } from '@/api/hmmm/directorys'
import { TagSimple } from '@/api/hmmm/tags'
import { usersimple } from '@/api/base/users'
import { provinces, citys } from '@/api/hmmm/citys'
import { questionType, difficulty, direction } from '@/api/hmmm/constants'
export default {
  props: {
    total: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      formData: {
        // 学科ID
        subjectID: '',
        // 目录名称
        catalogID: '',
        tags: '',
        // 关键字
        keyword: '',
        // 试题类型
        questionType: '',
        // 难度
        difficulty: '',
        // 方向
        direction: '',
        // 录入人
        creatorID: '',
        // 题目备注
        remarks: '',
        // 企业简称
        shortName: '',
        // 所在省份
        province: '',
        // 所在城市
        city: ''
      },
      directionList: direction,
      difficultyList: difficulty,
      questionTypeList: questionType,
      // 城市列表
      cityList: provinces(),
      // 城市下级市
      lowerCitys: [],
      // 学科列表
      subjectList: [],
      // 二级目录列表
      catalogList: [],
      // 标签列表
      tagList: [],
      // 用户
      userInfo: []
    }
  },
  created() {
    this.getSubjectList()
    this.getusersimple()
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    },
    async getSubjectList() {
      const { data } = await simple()
      this.subjectList = data
    },
    async changeSelect() {
      const { data } = await catalogsimple({ subjectID: this.formData.subjectID })
      this.catalogList = data
      const res = await TagSimple({ subjectID: this.formData.subjectID })
      this.tagList = res.data
    },
    // 获取用户信息
    async getusersimple() {
      const { data } = await usersimple()
      this.userInfo = data
    },
    cityChange(data) {
      this.lowerCitys = citys(data)
    },
    reset() {
      this.formData = {
        // 学科ID
        subjectID: '',
        // 目录名称
        catalogID: '',
        tags: '',
        // 关键字
        keyword: '',
        // 试题类型
        questionType: '',
        // 难度
        difficulty: '',
        // 方向
        direction: '',
        // 录入人
        creatorID: '',
        // 题目备注
        remarks: '',
        // 企业简称
        shortName: '',
        // 所在省份
        province: '',
        // 所在城市
        city: ''
      }
    },
    submit(data) {
      this.formData
      const obj = {}
      for (const key in this.formData) {
        console.log(key)
        if (this.formData[key] !== '') {
          obj[key] = this.formData[key]
        }
      }
      this.$parent.getList(obj)
    }
  }
}
</script>

<style scoped lang='less'>
.addQuestions{
  span {
    font-size: 12px;
    color: pink;
  }
  display: flex;
  justify-content: space-between;
}

</style>
