<template>
  <div class='container'>
    <el-card>
      <div slot="header" class="header">
       <span>试题录入</span>
     </div>
      <el-form class="form" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="学科:">
        <el-select v-model="value" placeholder="请选择">
             <el-option
               v-for="item in options"
               :key="item.value"
               :label="item.label"
               :value="item.value">
             </el-option>
         </el-select>
        </el-form-item>
        <el-form-item label="目录:">
            <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="企业:">
            <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="城市:">
            <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="方向:">
            <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="题型:">
          <el-radio-group v-model="radio">
           <el-radio :label="3">单选</el-radio>
           <el-radio :label="6">多选</el-radio>
           <el-radio :label="9">简答</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="难度:">
          <el-radio-group v-model="radio">
           <el-radio :label="3">简单</el-radio>
           <el-radio :label="6">一般</el-radio>
           <el-radio :label="9">困难</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="题干:" style="height:239px;margin-bottom:22px">
            <quillEditor v-model="content" :options="editorOption"  ref="myQuillEditor"
            @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
            @change="onEditorChange($event)"
            ></quillEditor>
            <div v-html="str" class="ql-editor">
            {{str}}
            </div>
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
        placeholder: '请在这里输入',
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
      }

    }
  },
  methods: {
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
    editor () {
      return this.$refs.myQuillEditor.quill
    }
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
  }
}
</style>
