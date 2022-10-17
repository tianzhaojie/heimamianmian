<template>
  <div class="container">
    <el-card>
      <div slot="header" class="header">
        <span>试题录入</span>
      </div>
      <el-form ref="form" class="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="学科:" prop="subjectID">
          <el-select v-model="form.subjectID" placeholder="请选择" @change="detail">
            <el-option
              v-for="item in subjects"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="目录:" prop="catalogID">
          <el-select v-model="form.catalogID" placeholder="请选择">
            <el-option
              v-for="item in directorysList"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="企业:" prop="enterpriseID">
          <el-select v-model="form.enterpriseID" placeholder="请选择">
            <el-option
              v-for="item in lists"
              :key="item.id"
              :label="item.company"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="城市:" class="city" prop="province">
          <el-select v-model="form.province" placeholder="请选择" @change="getArea(form.province)">
            <el-option
              v-for="(item,index) in citys"
              :key="index"
              :label="item.city"
              :value="item.city"
            />
          </el-select>
          <el-select v-model="form.city" placeholder="请选择">
            <el-option
              v-for="(item,index) in areaList"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="方向:" prop="direction">
          <el-select v-model="form.direction" placeholder="请选择">
            <el-option
              v-for="(item,index) in direction"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="题型:" prop="questionType">
          <el-radio-group v-model="form.questionType">
            <el-radio :label="'1'">单选</el-radio>
            <el-radio :label="'2'">多选</el-radio>
            <el-radio :label="'3'">简答</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="难度:" prop="difficulty">
          <el-radio-group v-model="form.difficulty">
            <el-radio :label="'1'">简单</el-radio>
            <el-radio :label="'2'">一般</el-radio>
            <el-radio :label="'3'">困难</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="题干:" class="stem" prop="question">
          <quillEditor
            ref="myQuillEditor"
            v-model="form.question"
            :options="editorOption"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @change="onEditorChange($event)"
          />
          <!-- <div v-html="str" class="ql-editor">
            {{str}}
            </div> -->
        </el-form-item>
        <!-- 单选选项 -->
        <el-form-item v-if="form.questionType === '1' ? true : false" label="选项:">
          <el-col v-for="(item,index) in form.options" :key="index" class="options-item">
            <!-- <el-radio-group v-model="isRight"> -->
            <el-radio v-model="isRight" :label="item.code">{{ item.code }}:</el-radio>
            <!-- </el-radio-group> -->
            <el-input v-model.trim="item.title" style="width:240px" />
            <el-upload
              class="upload-demo"
              drag
              action="#"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :on-change="onChange"
              :http-request="onHttpRequest"
              multiple
            >
              <i class="el-icon-circle-close" />
              <img v-if="item.img" :src="img" alt="" style="width:98px;height:60px">
              <div class="el-upload__text"><em>上传图片</em></div>
            </el-upload>
          </el-col>
          <el-button type="danger" disabled="disabled" size="small">+增加选项与答案</el-button>
        </el-form-item>
        <!-- 多选选项 -->

        <el-form-item v-else-if="form.questionType === '2' ? true : false" label="选项:">
          <el-col v-for="(item) in form.options" :key="item.code" class="options-item">
            <!-- <el-checkbox-group v-model="ischeck"> -->
            <el-checkbox :value="ischeck" :label="item.isRight">{{ item.code }}:</el-checkbox>
            <!-- </el-checkbox-group> -->
            <el-input v-model.trim="item.title" style="width:240px" />
            <el-upload
              class="upload-demo"
              drag
              action="#"
              multiple
            >
              <i class="el-icon-circle-close" />
              <img v-if="item.img" :src="form.options.img" alt="">
              <div class="el-upload__text"><em>上传图片</em></div>
            </el-upload>
          </el-col>
          <el-button type="danger" size="small" @click="add">+增加选项与答案</el-button>
        </el-form-item>

        <el-form-item label="解析视频:" class="video">
          <el-input v-model="form.videoURL" style="width:400px" />
        </el-form-item>
        <el-form-item label="答案解析:" class="stem" prop="answer">
          <quillEditor
            ref="myQuillEditor"
            v-model="form.answer"
            :options="editorOption"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @change="onEditorChange($event)"
          />
          <!-- <div v-html="str" class="ql-editor">
            {{str}}
            </div> -->
        </el-form-item>
        <el-form-item label="题目备注:">
          <el-input
            v-model="form.remarks"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="试题标签:">
          <el-select
            v-model="form.tags"
            placeholder="请选择试题标签"
            multiple
            filterable
            allow-create
            default-first-option
            @change="tostring"
          >
            <el-option
              v-for="item in tagsList"
              :key="item.id"
              :label="item.tagName"
              :value="item.tagName"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">确认提交</el-button>
        </el-form-item>
      </el-form>

    </el-card>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor' // 调用编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { list } from '@/api/hmmm/companys'
import { add, detail } from '@/api/hmmm/questions'
import { list as tagsList } from '@/api/hmmm/tags'
import { simple } from '@/api/hmmm/subjects'
import { catalogsimple } from '@/api/hmmm/directorys'
import { direction } from '@/api/hmmm/constants'
import { datas, citys } from '@/api/hmmm/citys'
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKID3xf9PRFoCLK5cv0r0xfAj9OOAC4jCTWS',
  SecretKey: 'nLgLmyvnQzMVP4jLqCPUPwLgreIn9JH6'
})
// 还需要写基础题库传值id 渲染页面
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      rules: {
        subjectID: [{ required: true, message: '请选择学科', trigger: 'blur' }],
        catalogID: [{ required: true, message: '请选择目录', trigger: 'blur' }],
        enterpriseID: [{ required: true, message: '请选择企业', trigger: 'blur' }],
        province: [{ required: true, message: '请选择地区', trigger: 'blur' }],
        direction: [{ required: true, message: '请选择方向', trigger: 'blur' }],
        questionType: [{ required: true, message: '', trigger: 'change' }],
        difficulty: [{ required: true, message: '', trigger: 'change' }],
        question: [{ required: true, message: '请输入题干', trigger: 'change' }],
        answer: [{ required: true, message: '请输入题干', trigger: 'blur' }]
      },
      content: '',
      str: '',
      fileList: [],
      editorOption: {
        placeholder: '',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // 加粗，斜体，下划线，删除线
            // [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
            [{ list: 'ordered' }, { list: 'bullet' }], // 列表
            ['blockquote', 'code-block'], // 引用，代码块
            // [{ script: 'sub' }, { script: 'super' }], // 上下标
            // [{ indent: '-1' }, { indent: '+1' }], // 缩进
            // [{ direction: 'rtl' }], // 文本方向
            // [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
            // [{ header: [1, 2, 3, 4, 5, 6, false] }], // 几级标题
            // [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
            // [{ font: [] }], // 字体
            // ['clean'], // 清除字体样式
            ['image', 'link'] // 上传图片、上传视频
          ]
        }
      },
      page: {
        page: 1,
        pagesize: 10000
      },
      lists: [],
      subjects: [],
      directorysList: [],
      direction: direction,
      citys: datas,
      areaList: '',
      tagsList: '',
      isRadio: true,
      isRight: true,
      ischeck: [1],
      img: '',
      form: {
        // subject: '',
        subjectID: '',
        catalogID: '',
        directoryName: '',
        enterpriseID: '',
        direction: '',
        province: '',
        city: '',
        questionType: '1',
        difficulty: '1',
        question: '',
        options: [{ id: '', code: 'A', title: '', img: '', isRight: false },
          { id: '', code: 'B', title: '', img: '', isRight: false },
          { id: '', code: 'C', title: '', img: '', isRight: false },
          { id: '', code: 'D', title: '', img: '', isRight: false }],
        videoURL: '',
        answer: '',
        remarks: '',
        tags: ''
      },
      i: 0,
      id: this.$route.query.id
    }
  },
  computed: {
  },
  created() {
    this.getcompanys()
    this.getsubjects()
    this.getQuestions()
    // this.getdirectorysList()
    // this.gettagsList()
  },
  mounted() {
    const content = '' // 请求后台返回的内容字符串
    this.str = this.escapeStringHTML(content)
  },
  methods: {
    // 获取页面跳转过来的数据

    async getQuestions() {
      if (this.id) {
        const { data } = await detail({ id: this.id })
        console.log(data)
        this.form = data
      }
    },
    // 获取公司信息
    async  getcompanys() {
      const { data: { items }} = await list(this.page)
      console.log(items)
      this.lists = items
    },
    // 获取学科
    async getsubjects() {
      const { data } = await simple()
      console.log(data)
      this.subjects = data
    },
    // 获取目录
    async detail(value) {
      console.log(1)
      const { data } = await catalogsimple({ subjectID: 20 })
      this.directorysList = data
      this.gettagsList(value)
    },
    // 获取标签列表
    async gettagsList(value) {
      const { data: { items }} = await tagsList({ subjectID: value })
      this.tagsList = items
    },
    // 获取城市地区
    getArea(area) {
      console.log(area)
      this.areaList = citys(area)
      console.log(this.areaList)
    },
    // 选中对应选项
    getcode() {
      this.form.options.isRight = 1
    },
    async  handleAvatarSuccess(res, file) {
      // 返回图片地址
      console.log(file)
      this.form.options.img = file.url
    },
    // 图片校验
    beforeAvatarUpload(file) {
      console.log(file)
      // 要开始做文件上传的检查了
      // 文件类型 文件大小
      const types = ['image/jpeg', 'image/gif', 'image/bmp']
      if (!types.includes(file.type)) {
        this.$message.error(`上传图片只能是 +${types.join()}+  格式!`)
        return false
      }
    },
    onChange(file, fileList) {
      this.fileList.push(file)
    },
    onHttpRequest({ file }) {
      console.log(file)
      this.loading = true
      cos.putObject({
        Bucket: 'xzh-1314348557', /* 填入您自己的存储桶，必须字段 */
        Region: 'ap-nanjing', /* 存储桶所在地域，例如ap-beijing，必须字段 */
        Key: file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        Body: file, // 上传文件对象
        onProgress: function(progressData) {
          console.log(JSON.stringify(progressData))
        }
      }, (err, data) => {
        if (err) return
        this.loading = false
        console.log(data)
        this.img = 'https://' + data.Location
        // console.log(index)
        // this.form.options[index].img = 'https://' + data.Location
        // this.$emit('on-success', {
        //   imgUrl: 'https://' + data.Location
        // })
      })
    },
    // 随机顺序生成ABCDE...字母的函数
    setDesc() {
    // 随机顺序生成ABCDE...字母的函数
      const arr = []
      for (let i = 69; i < 91; i++) {
        arr[i] = String.fromCharCode(i)
      }
      return arr
    },
    // 增加选项
    add() {
      const random = this.setDesc().splice(69)
      const res = [...this.form.options, { id: '', code: random[this.i], title: '', img: '', isRight: false }]
      this.i++
      this.form.options = res
    },
    tostring() {
      // this.form.tags = this.form.tags.toString()
      // console.log(this.form.tags)
    },
    async submit() {
      await this.$refs.form.validate()
      if (this.form.questionType === '1') {
        this.form.options.map(item => {
          if (item.code === this.isRight) {
            item.isRight = true
            item.img = this.img
          } else {
            item.isRight = false
          }
        })
        // this.form = [...this.form]
      } else {
        this.form.options.map(item => {
          const flag = this.ischeck.some(key => key === item.code)
          console.log(flag)
          if (flag) {
            item.isRight = true
            item.img = this.img
          } else {
            item.isRight = false
          }
        })
      }
      this.form.tags = this.form.tags.toString()
      console.log(this.form.tags)
      await add(this.form)
      // 跳转页面
      // this.$route.push()
    },
    onEditorReady(editor) { // 准备编辑器
    },
    onEditorBlur() {}, // 失去焦点事件
    onEditorFocus() {}, // 获得焦点事件
    onEditorChange() {}, // 内容改变事件
    // 转码
    escapeStringHTML(str) {
      str = str.replace(/&lt;/g, '<')
      str = str.replace(/&gt;/g, '>')
      return str
    }
  }

}
</script>

<style scoped lang='scss'>
.container {
  padding: 20px;
  .form {
    // padding: 20px;
    :deep(.el-input__inner) {
      width: 400px;
    }
    .city {

      :deep(.el-input__inner) {
        width: 200px;
        margin-right: 5px;
      }
    }

    .quill-editor {
      height: 200px;
      :deep(.ql-toolbar.ql-snow ){
       height: 40px!important;
       line-height: 40px;
       padding: 0px 8px;
      }
    }
    .stem {
      height:239px;
      margin-bottom:22px;
    }
    .options-item {
      display: flex;
      align-items: center;
      height: 80px;
      line-height: 80px;
      padding-bottom: 20px;
      .el-radio {
        margin-right: 15px;
      }
      :deep(.el-input__inner) {
        width: 240px!important;
      }
    .upload-demo {
        margin-left: 5px;
        display: inline-block;
    vertical-align: middle;
    line-height: 1;
      // width: 100px;
      // height: 60px;
    :deep(.el-upload-dragger){
      position: relative;
      width: 100px;
      height: 60px;
      line-height: 60px;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      .el-icon-circle-close {
        position: absolute;
        right: 0px;
        top: 0px;
        transform: translate(50%,-50%);
        color: #999;
        background: #fff;
        font-size: 18px;
        z-index: 999;
      }
    }
  }
    }
  }
.el-input--medium {
    width: 400px;
    height: 96px!important;
    :deep(.el-textarea__inner) {
      min-height: 96px!important;
    }
    }
  .video {
    :deep(.el-input__inner) {
      width: 400px;
    }
  }
  }
</style>
