<template>
  <el-dialog
    v-model="dialogVisible"
    width="80%"
    title="设置"
    fullscreen
    :show-close="false"
    @close="closeDialog"
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="header">
        <h3 :id="titleId" :class="titleClass">设置</h3>
        <el-button type="danger" :icon="Close" text @click="close"> </el-button>
      </div>
    </template>

    <el-form
      ref="formRef"
      :model="formData"
      label-width="50px"
      label-position="left"
      :rules="formRules"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model.trim="formData.name" placeholder="请输入倒计时名称"></el-input>
      </el-form-item>
      <el-form-item label="时间" prop="time">
        <input v-model="formData.time" class="datetime" type="datetime-local" />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="formData.type" placeholder="请选择倒计时类型" style="width: 100%">
          <el-option value="once">一次</el-option>
          <el-option value="always">总是</el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="my-footer">
        <span class="msg">
          已添加倒计时数 <b class="cnt">{{ count }}</b>
        </span>
        <div>
          <el-button type="primary" size="small" @click="closeDialog">返回</el-button>
          <el-button type="primary" size="small" @click="submitForm">添加</el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import {
  ElDialog,
  ElForm,
  ElFormItem,
  ElButton,
  ElInput,
  ElMessage,
  FormRules,
  FormInstance,
  ElSelect,
  ElOption
} from 'element-plus'
import { Close } from '@element-plus/icons-vue'
import { computed, ref, watch } from 'vue'
import { useCounttimeStore, ICounttime } from '@renderer/stores/useCountimeStore'
const props = defineProps({
  visible: {
    type: Boolean
  }
})
const emits = defineEmits(['closeDialog'])
const formData = ref<ICounttime>({
  name: '',
  time: '',
  type: ''
})
const formRules: FormRules = {
  name: {
    required: true,
    message: '请输入名称',
    trigger: 'blur'
  },
  time: {
    required: true,
    message: '请选择时间',
    trigger: 'blur'
  },
  type: {
    required: true,
    message: '请选择类型',
    trigger: 'blur'
  }
}
const formRef = ref<FormInstance>()
const submitForm = () => {
  formRef.value?.validate((isvalid) => {
    if (isvalid) {
      addCounttime()
    } else {
      console.log('参数错误')
    }
  })
}
const dialogVisible = ref(false)
watch(
  () => props.visible,
  () => {
    dialogVisible.value = props.visible
  }
)
const count = computed(() => useCounttimeStore().count)
const closeDialog = () => {
  formData.value = { name: '', time: '', type: '' }
  dialogVisible.value = false
  formRef.value?.resetFields()
  emits('closeDialog', false)
}
const successMessage = () => {
  ElMessage.success('添加成功')
}
const infoMessage = () => {
  ElMessage.info('只能添加三个倒计时')
}
const addCounttime = () => {
  const counttimeStore = useCounttimeStore()
  const datetime = formData.value.time
  formData.value.time = dayjs(datetime).format('YYYY-MM-DD HH:mm:ss')
  if (formData.value.type == 'always') {
    formData.value.time = formData.value.time.split(' ')[1]
  }
  const result = counttimeStore.addCounttimeAction({ ...formData.value })
  result ? successMessage() : infoMessage()
  closeDialog()
}
</script>

<style lang="scss">
.el-dialog {
  user-select: none;
  .el-dialog__header {
    height: 18px;
    padding: 3px 0 0 18px;
  }
  .el-dialog__body {
    padding: 18px 10px 0px 10px;
  }
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.my-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 20px;
  .msg {
    color: #636e72;
    font-size: 15px;
    .cnt {
      color: #ff7675;
    }
  }
}
.datetime {
  width: 100%;
  height: 30px;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  color: #606266;
  list-style: 30px;
  font-size: 16px;

  cursor: pointer;
  &:hover {
    border: 1px solid #cbced4;
  }
  &:focus-visible {
    outline: 1px solid #409eff;
  }
}
.el-form-item {
  margin: 0;
  padding: 0;
  height: 29px;
}
</style>
