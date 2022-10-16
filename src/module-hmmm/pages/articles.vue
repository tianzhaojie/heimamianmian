<template>
  <div class="container">
    <el-card class="box-card cardp">
      <!-- 标题 -->
      <div class="title-x">
        <div class="x-fl">
          <!-- 搜索框 -->
          <el-form ref="searchFrom" :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="目录名称">
              <el-input v-model="formInline.keyword" />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="formInline.state" placeholder="请选择">
                <el-option label="启用" value="1" />
                <el-option label="禁用" value="0" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button @click="resetForm()">清除</el-button>
              <el-button type="primary" @click="onSubmit">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 新增目录 -->
        <div class="x-fr">
          <el-button type="success" icon="el-icon-edit" @click="onrevise">新增目录</el-button>
        </div>
      </div>
      <!-- 消息提示 -->
      <el-alert type="info" show-icon>
        <template #title>
          数据一共{{ tableData.counts }}条
        </template>
      </el-alert>
      <!-- 列表 -->
      <el-table v-loading="loading" :data="tableData.items" style="width: 100%" :header-cell-style="{background:'#fafafa'}">
        <el-table-column
          type="index"
          label="序号"
        />
        <el-table-column
          label="文章标题"
          width="180"
        >
          <template slot-scope="{row}">
            <span>{{ row.title }}</span>
            <el-link v-show="row.videoURL=== null? false :true " style="margin-left: 5px;color: blue;" icon="el-icon-film" @click="checkVideoFun(row)" />
          </template>
        </el-table-column>
        <el-table-column
          prop="visits"
          label="阅读人数"
          width="180"
        />
        <el-table-column
          prop="username"
          label="录入人"
        />
        <el-table-column
          prop="createTime"
          label="录入时间"
        />
        <el-table-column
          prop="state"
          label="状态"
        >
          <template slot-scope="{row}">
            {{ row.state===1? '已启用' : '已禁用' }}
          </template></el-table-column>
        <el-table-column
          label="操作"
        >
          <template slot-scope="{row}">
            <el-link :underline="false" type="primary" @click="handleClick(row)">预览</el-link>&nbsp;
            <el-link :underline="false" type="primary" @click="changeState(row)">{{ row.state===1? '启用' : '禁用' }}</el-link>&nbsp;
            <el-link :underline="false" :type="row.state===1? 'primary':'info'" :disabled="row.state===1? false : true" @click="companys(row)">修改</el-link>&nbsp;
            <el-link :underline="false" :type="row.state===1? 'primary':'info'" :disabled="row.state===1? false : true" @click="remove(row)">删除</el-link>&nbsp;
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部分页 -->
      <el-row>
        <el-col :span="24" :push="16"><div class="grid-content bg-purple-dark">
          <div class="block">
            <el-pagination
              background
              :current-page.sync="page.page"
              :page-sizes="[2, 5, 10, 15]"
              :page-size.sync="page.pagesize"
              layout="prev, pager, next, sizes, jumper"
              :total="tableData.counts"
              @current-change="list"
              @size-change="list"
            />
          </div>
        </div></el-col>
      </el-row>
    </el-card>
    <!-- 新增弹窗 -->
    <TheDirectory v-if="formBase" :dialog-visible.sync="dialogVisible" :titles="titles" :form-base="formBase" @newDataes="add" />
    <!-- 修改弹窗 -->
    <TheDirectory v-if="rowss" :dialog-visible.sync="dialogVisible1" :titles="titless" :form-base="rowss" @newDataes="update" />
    <!-- 预览文章 -->
    <el-dialog
      title="预览文章"
      :visible.sync="dialogVisible2"
      width="60%"
    ><span><h2 style="padding:0;margin:0 0 10px 0;">{{ preview?.title }}</h2>
      <div style="padding-left:10px;margin:0 0 10px 0;">
        <span class="margin">{{ preview?.createTime }}</span>
        <span class="margin">{{ preview?.username }}</span>
        <span class="el-icon-view margin" />
        <span>{{ preview?.visits }}</span>
      </div>
      <div class="articlesContent" v-html="preview?.articleBody" />
    </span></el-dialog>
    <!-- 视频弹窗 -->
    <div v-if="videoState == true" class="mask" @click="masksCloseFun" />
    <div v-if="videoState == true" class="videomasks">
      <video :src="videoSrc" controls="controls" autoplay />
    </div>
  </div>
</template>
<script>
import { list, changeState, remove, detail } from '../../api/hmmm/articles'
import TheDirectory from './components/TheDirectory.vue'

export default {
  components: {
    TheDirectory
  },
  data() {
    return {
      // https://v-cdn.zjol.com.cn/277003.mp4
      // https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/11c70c96529b6e6938567ec1aa0910e0.mp4
      videoSrc: '',
      videoState: false,
      titles: '新增技巧',
      titless: '修改文章',
      formBase: {
        title: '',
        articleBody: '',
        videoURL: ''
      },
      page: {
        page: 1, // 页数
        pagesize: 10 // 页尺寸
      },
      formInline: {
        keyword: '', // 关键字
        state: ''// 状态
      },
      rules: {
        directoryName: [{ required: true, message: '目录名称不能为空', trigger: 'blur' }, {
          min: 1, max: 6, message: '目录名名为1-6位'
        }]
      },
      tableData: [], // 列表数据
      rows: {
        id: '',
        state: ''
      }, // 状态数据
      dialogVisible: false, // 新增弹窗
      dialogVisible1: false, // 修改弹窗
      dialogVisible2: false, // 修改弹窗
      loading: false,
      rowss: {
        id: '',
        title: '',
        articleBody: '',
        videoURL: ''
      }, // 修改数据
      preview: {}, // 预览数据
      TrueIsFalse: ''
    }
  },
  created() {
    this.list()
  },
  methods: {
    // 获取列表
    async list() {
      try {
        const { data } = await list(this.page)
        this.tableData = data
      } catch (e) {
        this.$message.error('请刷新重试')
      }
    },
    // 搜索
    async onSubmit() {
      const res = { ...this.formInline, ...this.page }
      const { data } = await list(res)
      this.tableData = data
    },
    // 清除
    resetForm() {
      this.formInline = {
        keyword: '', // 关键字
        state: ''// 状态
      }
    },
    // 预览弹窗
    async handleClick(row) {
      this.dialogVisible2 = true
      const { data } = await detail(row)
      this.preview = data
      console.log(data)
    },
    // 新增弹窗
    onrevise() {
      this.dialogVisible = true
    },
    // 新增
    async add() {
      try {
        this.loading = true
        this.$message.success('新增成功')
        this.list()
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    // 状态修改
    async changeState(row) {
      const state = !row.state
      this.rows.state = !state ? 0 : 1
      this.rows.id = row.id
      await changeState(this.rows)
      this.list()
      this.$message.success('操作成功')
    },
    // 内容修改弹窗
    companys(row) {
      this.rowss.id = row.id
      this.rowss.title = row.title
      this.rowss.articleBody = row.articleBody
      this.rowss.videoURL = row.videoURL
      this.dialogVisible1 = true
    },
    // 修改
    async update() {
      try {
        this.loading = true
        this.$message.success('修改成功')
        this.list()
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    // 删除
    async remove(row) {
      await this.$confirm(`此操作将永久删除该文章, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await remove(row)
      this.list()
    },
    // 点击按钮出现弹窗播放视频

    checkVideoFun(row) {
      if (row.videoURL === '' || row.videoURL === null) {
        this.$message.error('视屏不存在')
      } else {
        const content = row.videoURL.match(/http.*\.(mp4|png|jpg)/gi)
        if (content !== null) {
          this.videoSrc = row.videoURL.trim()
          this.videoState = true
          console.log(this.videoSrc)
        } else {
          this.$message.error('加载失败/路径错误')
        }
      }
    },
    masksCloseFun() {
      this.videoState = false
    }
  }
}

</script>

<style scoped lang='less'>
.mask{
position:fixed;
top:0;
left:0;
bottom:0;
right:0;
z-index:888;
background-color: #000000;
opacity: .6; }
// 内容层 z-index要比遮罩大，否则会被遮盖

.videomasks{
max-width: 1200px;
position: fixed;
left: 50%;
top: 50%;
z-index: 999;
transform: translate(-50%,-50%); }
.videomasks video{
width: 100%;
height: 100%;
}
video:focus {
  // 隐藏轮廓
  // outline: auto 0px;
  outline: medium;
}
.cardp{
  margin: 10px;
}
.inp-xz {
  width: 280px;
}
 .articlesContent{
 width: 100%;
padding: 10px;
 background-color: #f5f5f5;
 }
 .margin{
 margin-right: 10px;
 }
</style>
