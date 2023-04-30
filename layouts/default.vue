<template>
  <v-app>
    <v-app-bar id="header" app :prominent="!isMobile" flat color="#c9bc9c" >
      <v-container class="ly_headerInner header_flx" app>
        <h1 class="header_logo">
          <NuxtLink to="/">
            <img src="/assets/img/logo/logo_02.svg" alt="withプラス" />
          </NuxtLink>
        </h1>
        <div class="header_logo_eco">
          <img src="/assets/img/logo/logo_eco.svg" alt="ecoの志士" />
        </div>
      </v-container>
    </v-app-bar>
    <v-main id="#body">
        <Nuxt />
    </v-main>
    <footer class="bgc_br" color="#c9bc9c">
      <div class="ly_contInner">
        <div class="footer_menu">
          <ul class="">
            <li class="nav__item"><a href="/#howTo">使い方</a></li>
            <li class="nav__item"><NuxtLink to="/study_record">これまでの学習記録</NuxtLink></li>
            <li class="nav__item"><a href="/#point">ポイントについて</a></li>
            <li class="nav__item"><NuxtLink to="/prize">ゲットできる商品</NuxtLink></li>
            <li class="nav__item">
              <NuxtLink to="characterList">キャラクター紹介</NuxtLink>
            </li>
          </ul>
          <ul class="">
            <li class="nav__item"><a href="/terms">規約</a></li>
            <li class="nav__item">
              <NuxtLink to="privacy">個人情報保護方針</NuxtLink>
            </li>
            <li class="nav__item"><a href="/#contact">お問合せ</a></li>
          </ul>
        </div>
        <img class="footer_logo" src="assets/img/logo/logo_02.svg" alt="" />
      </div>
      <small>
        &copy;(般社)ステップアップ教育支援機構
      </small>      
    </footer>  
  </v-app>
</template>
<script>
import Avatars from '@/plugins/firestore/avatars'

export default {
  name: 'DefaultLayout',
  data() {
    return {
    }
  },
  computed: {
    isMobile () {
      return this.$vuetify.breakpoint.mobile
    }
  },
  created() {
    // emitイベントを補足
     this.$nuxt.$on('showLoginModal', this.termsModal)
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
        this.avatar = await Avatars.getItem(this.user.avatar)
        this.isTeacher = this.user.isTeacher
        this.isAdmin = this.user.isAdmin
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
    termsModal() {
      console.log('in showTerms')
      this.showTerms = true
    },
    loginBtn() {
      console.log('in loginBtn')
      this.showLogin = true
    },
  }
}
</script>
<style scoped>
html {
  font-size: 10px
}
.v-application{
    font-family: "corporate-logo-ver2" !important;
}
.v-application a {color: #000;}
</style>