<template>
  <div class="login">
      <Modal class="login-modal" v-model="loginModal" width="466" :closable="false" :mask-closable="false">
        <h2><span class="login-icon"><img :src="require('@/assets/images/logo.png')" alt=""></span> <span class="babelname">
            <h1>iAccount</h1>
            <p>运营管理平台</p>
          </span> </h2>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate">
            <Form-item prop="name">
              <Input v-model="formValidate.name" placeholder="请输入姓名" icon="person" />
            </Form-item>
            <Form-item prop="password">
              <Input v-model="formValidate.password" @keyup.native.enter="handleSubmit('formValidate')" type="password" placeholder="请输入密码" icon="locked" />
            </Form-item>
            <Row class="login-line-last">
              <Col span="12">
                <Checkbox-group v-model="formValidate.remember">
                  <Checkbox label="记住我"></Checkbox>
                </Checkbox-group>
              </Col>
              <Col span="12">
                <a style="float:right" @click="toRegister">忘记密码？</a>
              </Col>
            </Row>
          </Form>
        <div slot="footer">
          <Button type="primary" size="large" long :loading="modal_loading" @click="handleSubmit('formValidate')">登 录</Button>
        </div>
      </Modal>
  </div>
</template>
<script>
import '@/assets/styles/login.less'
import Cookies from 'js-cookie'
export default {
  name: 'login',
  data () {
    return {
      loginModal: true,
      modal_loading: false,
      formValidate: {
        name: '',
        password: ''
      },
      ruleValidate: {
        name: [
          {required: true, message: '姓名不能为空', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '密码错误', trigger: 'blur'}
        ]

      }
    }
  },
  methods: {
    handleSubmit (name) {
      this.modal_loading = true
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$api
            .login({name: this.formValidate.name, passWord: this.formValidate.password})
            .then((res) => {
              if (res.returnCode === '0000') {
                Cookies.set('token', res.token, {path: '/', expires: 2})
                Cookies.set('userId', res.userId, {path: '/', expires: 2})
                // sessionStorage.setItem('token', res.token)
                // sessionStorage.setItem('userId', res.userId)
                sessionStorage.setItem('MENUS', JSON.stringify(res.permTreeRoot.children))
                let url = (Cookies.get('currentUrl') || (Cookies.get('currentUrl') === 'undefined')) ? Cookies.get('currentUrl') : '/index'
                this.$router.push(url)
              } else {
                this.$Message.error(res.returnMsg)
              }
            })
          this.modal_loading = false
        } else {
          this.modal_loading = false
          return false
        }
      })
    },
    toRegister () {
      this.$router.push('/register1')
    }
  }
}
</script>
<style lang="less" scoped>
 
</style>
