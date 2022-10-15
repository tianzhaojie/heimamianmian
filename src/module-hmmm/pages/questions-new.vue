<template>
  <div class='container'>
    <el-card >
      <div slot="header" class="header">
       <span>试题录入</span>
     </div>
      <el-form class="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="学科:">
        <el-select v-model="form.subject" placeholder="请选择">
           <el-option
               v-for="item in subjects"
               :key="item.value"
               :label="item.label"
               :value="item.value">
             </el-option>
         </el-select>
        </el-form-item>
        <el-form-item label="目录:">
            <el-select v-model="form.directoryName" placeholder="请选择">
                <el-option
                  v-for="item in directorysList"
                  :key="item.id"
                  :label="item.directoryName"
                  :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="企业:">
            <el-select v-model="form.company" placeholder="请选择">
                <el-option
                  v-for="item in lists"
                  :key="item.id"
                  :label="item.company"
                  :value="item.company">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="城市:" class="city">
            <el-select v-model="form.citys" placeholder="请选择" @change="getArea(form.citys)">
                <el-option
                  v-for="(item,index) in citys"
                  :key="index"
                  :label="item.city"
                  :value="item.city">
                </el-option>
            </el-select>
            <el-select v-model="form.area" placeholder="请选择" >
                <el-option
                  v-for="(item,index) in areaList"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="方向:">
            <el-select v-model="form.direction" placeholder="请选择">
                <el-option
                  v-for="(item,index) in direction"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="题型:">
          <el-radio-group v-model="form.questionType">
           <el-radio :label="'1'">单选</el-radio>
           <el-radio :label="'2'">多选</el-radio>
           <el-radio :label="'3'">简答</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="难度:">
          <el-radio-group v-model="form.difficulty">
           <el-radio :label="'1'">简单</el-radio>
           <el-radio :label="'2'">一般</el-radio>
           <el-radio :label="'3'">困难</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="题干:" class="stem" >
            <quillEditor v-model="content" :options="editorOption"  ref="myQuillEditor"
            @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
            @change="onEditorChange($event)"
            ></quillEditor>
            <!-- <div v-html="str" class="ql-editor">
            {{str}}
            </div> -->
        </el-form-item>
        <!-- 单选选项 -->
        <el-form-item v-if="form.questionType === '1' ? true : false" label="选项:">
          <el-col class="options-item" v-for="item in form.options" :key="item.id">
            <el-radio v-model="item.code" :label="item.code">{{item.code}}:</el-radio>
            <el-input v-model="item.title" style="width:240px"></el-input>
            <el-upload
             class="upload-demo"
             drag
             action="#"
             multiple>
             <i class="el-icon-circle-close"></i>
             <img v-if="item.img" :src="form.options.img" alt="">
            <div class="el-upload__text"><em>上传图片</em></div>
            </el-upload>
          </el-col>
          <!-- <el-radio-group v-model="form.options.code" style="width:100%" @change="getcode">
            <el-col class="options-item">
            <el-radio :label="'A'">A:</el-radio>
            <el-input v-model="form.options.title" style="width:240px"></el-input>
            <el-upload
             class="upload-demo"
             drag
             action="#"
             multiple>
             <i class="el-icon-circle-close"></i>
             <img v-if="form.options.img" :src="form.options.img" alt="">
            <div class="el-upload__text"><em>上传图片</em></div>
            </el-upload>
            </el-col>
            <el-col class="options-item">
            <el-radio :label="'B'">B:</el-radio>
            <el-input v-model="form.options.title" style="width:240px"></el-input>
            <el-upload
             class="upload-demo"
             drag
             action="#"
             multiple>
             <i class="el-icon-circle-close"></i>
             <img v-if="form.options.img" :src="form.options.img" alt="">
            <div class="el-upload__text"><em>上传图片</em></div>
            </el-upload>
            </el-col>
            <el-col class="options-item">
            <el-radio :label="'C'">C:</el-radio>
            <el-input v-model="form.options.title" style="width:240px"></el-input>
            <el-upload
             class="upload-demo"
             drag
             action="#"
             multiple>
             <i class="el-icon-circle-close"></i>
             <img v-if="form.options.img" :src="form.options.img" alt="">
            <div class="el-upload__text"><em>上传图片</em></div>
            </el-upload>
            </el-col>
            <el-col class="options-item">
            <el-radio :label="'D'">D:</el-radio>
            <el-input v-model="form.options.title" style="width:240px"></el-input>
            <el-upload
             class="upload-demo"
             drag
             action="#"
             multiple>
             <i class="el-icon-circle-close"></i>
             <img v-if="form.options.img" :src="form.options.img" alt="">
            <div class="el-upload__text"><em>上传图片</em></div>
            </el-upload>
            </el-col>
          </el-radio-group> -->
             <el-button type="danger" disabled="disabled" size="small">+增加选项与答案</el-button>
        </el-form-item>
        <!-- 多选选项 -->
        <el-form-item v-else-if="form.questionType === '2' ? true : false" label="选项:">
          <el-radio-group v-model="radio" style="width:100%">
            <el-col class="options-item">
            <el-radio :label="3">A:</el-radio>
            <el-input v-model="form.options.title" style="width:240px"></el-input>
            <el-upload
             class="upload-demo"
             drag
             action="#"
             multiple>
             <i class="el-icon-circle-close"></i>
            <div class="el-upload__text"><em>上传图片</em></div>
            </el-upload>
            </el-col>
            <el-col class="options-item">
            <el-radio :label="6">B:</el-radio>
            <el-input v-model="form.options.title" style="width:240px"></el-input>
            <el-upload
             class="upload-demo"
             drag
             action="#"
             multiple>
             <i class="el-icon-circle-close"></i>
            <div class="el-upload__text"><em>上传图片</em></div>
            </el-upload>
            </el-col>
            <el-col class="options-item">
            <el-radio :label="9">C:</el-radio>
            <el-input v-model="input" style="width:240px"></el-input>
            <el-upload
             class="upload-demo"
             drag
             action="#"
             multiple>
             <i class="el-icon-circle-close"></i>
            <div class="el-upload__text"><em>上传图片</em></div>
            </el-upload>
            </el-col>
            <el-col class="options-item">
            <el-radio :label="12">D:</el-radio>
            <el-input v-model="input" style="width:240px"></el-input>
            <el-upload
             class="upload-demo"
             drag
             action="#"
             multiple>
             <i class="el-icon-circle-close"></i>
            <div class="el-upload__text"><em>上传图片</em></div>
            </el-upload>
            </el-col>
            </el-radio-group>
             <el-button type="danger"  size="small">+增加选项与答案</el-button>
        </el-form-item>
        <el-form-item label="解析视频:" class="video">
          <el-input v-model="form.videoURL" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="答案解析:" class="stem" >
            <quillEditor v-model="form.answer" :options="editorOption"  ref="myQuillEditor"
            @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
            @change="onEditorChange($event)"
            ></quillEditor>
            <!-- <div v-html="str" class="ql-editor">
            {{str}}
            </div> -->
        </el-form-item>
        <el-form-item label="题目备注:">
          <el-input
           type="textarea"
           :rows="2"
           placeholder="请输入内容"
           v-model="form.remarks">
          </el-input>
        </el-form-item>
        <el-form-item label="试题标签:">
        <el-select v-model="form.tags" placeholder="请选择试题标签">
           <el-option
               v-for="item in tagsList"
               :key="item.id"
               :label="item.tagName"
               :value="item.tagName">
             </el-option>
         </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">确认提交</el-button>
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
import { list as tagsList } from '@/api/hmmm/tags'
import { simple } from '@/api/hmmm/subjects'
import { directorysList } from '@/api/hmmm/directorys'
import { direction } from '@/api/hmmm/constants'
import { datas, citys } from '@/api/hmmm/citys'
export default {
  components: {
    quillEditor
  },
  data () {
    return {
      formData: {},
      rules: {},
      content: '',
      str: '',
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
      form: {
        subject: '',
        directoryName: '',
        company: '',
        direction: '',
        citys: '',
        area: '',
        questionType: '1',
        difficulty: '1',
        question: '',
        options: [{ id: '', code: 'A', title: '', img: '', isRight: 0 },
          { id: '', code: 'B', title: '', img: '', isRight: 0 },
          { id: '', code: 'C', title: '', img: '', isRight: 0 },
          { id: '', code: 'D', title: '', img: '', isRight: 0 }],
        videoURL: '',
        answer: '',
        remarks: '',
        tags: ''
      }
    }
  },
  created () {
    this.getcompanys()
    this.getsubjects()
    this.getdirectorysList()
    this.gettagsList()
  },
  watch: {
    questionType: {

    }
  },
  methods: {
    // 获取公司信息
    async  getcompanys () {
      const { data: { items } } = await list(this.page)
      console.log(items)
      this.lists = items
    },
    // 获取学科
    async getsubjects () {
      const { data } = await simple()
      console.log(data)
      this.subjects = data
    },
    // 获取目录
    async getdirectorysList () {
      const { data: { items } } = await directorysList(this.page)
      console.log(items)
      this.directorysList = items
    },
    // 获取标签列表
    async gettagsList () {
      const { data: { items } } = await tagsList(this.page)
      this.tagsList = items
    },
    // 获取城市地区
    getArea (area) {
      // console.log(citys)
      this.areaList = citys(area)
    },
    // 选中对应选项
    getcode () {
      this.form.options.isRight = 1
    },
    onEditorReady (editor) { // 准备编辑器
    },
    onEditorBlur () {}, // 失去焦点事件
    onEditorFocus () {}, // 获得焦点事件
    onEditorChange () {}, // 内容改变事件
    // 转码
    escapeStringHTML (str) {
      str = str.replace(/&lt;/g, '<')
      str = str.replace(/&gt;/g, '>')
      return str
    }
  },
  computed: {
  },
  mounted () {
    const content = '' // 请求后台返回的内容字符串
    this.str = this.escapeStringHTML(content)
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

      width: 100px;
      height: 60px;
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
        right: -9px;
        top: -9px;
        color: #999;
        background: #fff;
        font-size: 18px;
        z-index: 1;
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
