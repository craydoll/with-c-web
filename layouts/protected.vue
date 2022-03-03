<template>
  <v-app>
    <v-app-bar app absolute prominent flat class="justify-center" color="#c9bc9c">
      <div class="ly_headerInner header_flx">
        <v-app-bar-title>
          <a href=""><img src="assets/img/logo/logo.svg" alt="ロゴ" /></a>
        </v-app-bar-title>
        <nav class="max768_n">
          <ul class="header_nav">
            <li class="nav__item"><a href="">使い方</a></li>
            <li class="nav__item"><a href="">これまでの学習記録</a></li>
            <li class="nav__item"><a href="">ポイントについて</a></li>
            <li class="nav__item"><a href="">規約</a></li>
            <li class="nav__item"><a href="">お問合せ</a></li>
          </ul>
        </nav>
      </div>
        <div class="align-self-center">
        <v-btn v-if="isLoggedIn" name="profile" fab @click="showProfile=true">
          <v-avatar size="62">
            <img
            :src="`assets/img/chr/${avatar}`"
            alt="avatar"
          >
          </v-avatar>
        </v-btn>
        <v-btn v-else large @click="loginBtn">
          ログイン
          <LoginModal
            :modal-show="showLogin"
          />          
        </v-btn>
          <ProfileModal
            :modal-show="showProfile"
            @close="modalClosed"
          />          
        </div>
    </v-app-bar>
     <v-main>
      <v-container fluid class="ma-0 pa-0">
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
import ProfileModal from '@/components/profileModal'
import LoginModal from '@/components/loginModal'
export default {
  name: 'DefaultLayout',
  components: {
    ProfileModal,
    LoginModal
  },
  middleware: 'authenticated',
  data() {
    return {
      isLoggedIn: false,
      user: null,
      avatar: 'fig_chr_noimage.png',
      showProfile: false,
      showLogin: false
    }
  },
  async mounted() {
    this.$adobeFonts(document)
    this.isLoggedIn = await this.$store.getters['auth/isLoggedIn']
    this.user = await this.$store.getters['auth/user']
    console.log('user is ' + JSON.stringify(this.user))
    // ログインしている場合
    if (this.isLoggedIn) {
      if (this.user !== null) {
        // ユーザー登録されている場合
        this.avatar = this.user.avatar
      } else {
        // まだユーザー登録されていない
        this.showProfile = true
      }
    }
  },
  methods: {
    modalClosed(avatar) {
      this.showProfile = false
      if (avatar) {
        this.avatar = avatar
      }
      location.reload();
    },
    loginBtn() {
      console.log('in loginBtn')
      this.showLogin = true
    }
  }
}
</script>
<style>
html {
  font-size: 10px
}
</style>