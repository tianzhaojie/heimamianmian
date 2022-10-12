<template>

  <el-card>
    <div class="addQuestions">
      <span>
        说明：目前支持学科和关键字条件筛选
      </span>
      <el-button type="success" icon="el-icon-edit" size="small">新增试题</el-button>
    </div>
    <el-form :model="formInline" class="demo-form-inline">
      <el-row>
        <el-col :span="6">
          <el-form-item label="学科" style="width:100" label-width="80px">
            <el-select v-model="formInline.region" placeholder="活动区域" size="small" style="width:100%" />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="二级目录" label-width="80px">
            <el-select v-model="formInline.region" placeholder="活动区域" size="small" style="width:282px">
              <el-option label="区域一" value="shanghai" />
              <el-option label="区域二" value="beijing" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="标签" label-width="80px">
            <el-select v-model="formInline.region" placeholder="活动区域" size="small" style="width:100%">
              <el-option label="区域一" value="shanghai" />
              <el-option label="区域二" value="beijing" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="标签" label-width="80px">
            <el-select v-model="formInline.region" placeholder="活动区域" size="small" style="width:100%">
              <el-option label="区域一" value="shanghai" />
              <el-option label="区域二" value="beijing" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="标签" label-width="80px">
            <el-select v-model="formInline.region" placeholder="活动区域" size="small" style="width:100%">
              <el-option label="区域一" value="shanghai" />
              <el-option label="区域二" value="beijing" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="标签" label-width="80px">
            <el-select v-model="formInline.region" placeholder="活动区域" size="small" style="width:100%">
              <el-option label="区域一" value="shanghai" />
              <el-option label="区域二" value="beijing" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="标签" label-width="80px">
            <el-select v-model="formInline.region" placeholder="活动区域" size="small" style="width:100%">
              <el-option label="区域一" value="shanghai" />
              <el-option label="区域二" value="beijing" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="标签" label-width="80px">
            <el-select v-model="formInline.region" placeholder="活动区域" size="small" style="width:100%">
              <el-option label="区域一" value="shanghai" />
              <el-option label="区域二" value="beijing" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="标签" label-width="80px">
            <el-select v-model="formInline.region" placeholder="活动区域" size="small" style="width:100%">
              <el-option label="区域一" value="shanghai" />
              <el-option label="区域二" value="beijing" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="标签" label-width="80px">
            <el-select v-model="formInline.region" placeholder="活动区域" size="small" style="width:100%">
              <el-option label="区域一" value="shanghai" />
              <el-option label="区域二" value="beijing" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="标签" label-width="80px">
            <el-select v-model="formInline.region" placeholder="活动区域" size="small" style="width:100%">
              <el-option label="区域一" value="shanghai" />
              <el-option label="区域二" value="beijing" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item style="text-align: right;" label-width="80px">
            <el-button>搜索</el-button>
            <el-button>清除</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <el-alert
        title="消息提示的文案"
        type="info"
        show-icon
      />
    </div>
  </el-card>

</template>

<script>

export default {

  data() {
    return {
      formInline: {
        user: '',
        region: ''
      }
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!')
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
