<template>
  <v-app>
    <v-app-bar app prominent fixed flat class="justify-center" color="#c9bc9c" scroll-target="#body">
      <div class="ly_headerInner header_flx">
        <v-app-bar-title>
          <NuxtLink to="/"><img src="assets/img/logo/logo.svg" alt="withプラス" /></NuxtLink>
        </v-app-bar-title>
        <div class="header_logo_eco">
          <img src="assets/img/logo/logo_eco.svg" alt="ecoの志士" />
        </div>
        <nav class="max1090_n">
          <ul class="header_nav">
            <li class="nav__item"><a href="#howTo">使い方</a></li>
            <li class="nav__item">
              <a href="#record">これまでの<br />学習記録</a>
            </li>
            <li class="nav__item"><a href="#point">ポイントについて</a></li>
            <li class="nav__item"><a href="prize.html">ゲットできる商品</a></li>
            <li class="nav__item">
              <a class="el_btn el_btn__arrowRight" href="">測定スタート</a>
            </li>
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
    <v-main id="#body">
      <v-container fluid class="ma-0 pa-0">
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer height="180px"  class="bgc_br" color="#c9bc9c">
      <div class="d-flex justify-space-between ly_contInner">
        <div class="">
          <ul class="">
            <li class="nav__item"><a href="#howTo">使い方</a></li>
            <li class="nav__item"><a href="#record">これまでの学習記録</a></li>
            <li class="nav__item"><a href="#point">ポイントについて</a></li>
            <li class="nav__item"><NuxtLink to="prizeList">ゲットできる商品</NuxtLink></li>
            <li class="nav__item">
              <NuxtLink to="characterList">キャラクター紹介</NuxtLink>
            </li>
          </ul>
        </div>
        <div>
          <ul class="">
            <li class="nav__item"><a href="#terms">規約</a></li>
            <li class="nav__item">
              <NuxtLink to="privacyPage.html">個人情報保護方針</NuxtLink>
            </li>
            <li class="nav__item"><a href="#contact">お問合せ</a></li>
          </ul>
        </div>
        <img class="footer_logo" src="assets/img/logo/logo.svg" alt="" />
      </div>
    </v-footer>    
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