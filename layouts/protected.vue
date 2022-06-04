<template>
  <v-app>
    <v-app-bar id="header" app prominent flat color="#c9bc9c" >
      <div class="ly_headerInner header_flx" app>
        <h1 class="header_logo">
          <NuxtLink to="/">
            <img src="assets/img/logo/logo.svg" alt="withプラス" />
          </NuxtLink>
        </h1>
        <div class="header_logo_eco">
          <img src="assets/img/logo/logo_eco.svg" alt="ecoの志士" />
        </div>
        <nav class="max1090_n">
          <ul class="header_nav">
            <li class="nav__item"><NuxtLink to="/#howTo">使い方</NuxtLink></li>
            <li class="nav__item">
              <NuxtLink to="/study_record">これまでの<br />学習記録</NuxtLink>
            </li>
            <li class="nav__item"><NuxtLink to="/#point">ポイントについて</NuxtLink></li>
            <li class="nav__item"><NuxtLink to="/prize">ゲットできる商品</NuxtLink></li>
            <li class="nav__item">
              <NuxtLink class="el_btn el_btn__arrowRight" to="/record">測定スタート</NuxtLink>
            </li>
          </ul>
        </nav>
        <!-- Hamburger-icon -->
        <div class="max1090_b hamburger_icon">
          <button class="openMenu">
            <span class="openMenu__icon line01"></span>
            <span class="openMenu__icon line02"></span>
            <span class="openMenu__icon line03"></span>
          </button>
        </div>
        <!-- Hamburger-icon -->
        <div class="sp-menu">
          <ul>
            <li class="header-nav-item"><a href="#howTo">使い方</a></li>
            <li class="header-nav-item">
              <a href="#record">これまでの学習記録</a>
            </li>
            <li class="header-nav-item">
              <a href="#point">ポイントについて</a>
            </li>
            <li class="header-nav-item">
              <a href="prize">ゲットできる商品</a>
            </li>
            <li class="header-nav-item">
              <a class="el_btn" href="">測定スタート</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="align-self-center">
        <v-btn v-if="isLoggedIn" name="profile" fab @click="showProfile=true">
          <v-avatar size="62">
            <img
            :src="avatar.img"
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
    <v-main id="#body" app>
        <Nuxt />
    </v-main>
    <v-footer height="180px"  class="bgc_br" color="#c9bc9c">
      <div class="d-flex justify-space-between ly_contInner">
        <div class="">
          <ul class="">
            <li class="nav__item"><a href="/index#howTo">使い方</a></li>
            <li class="nav__item"><NuxtLink to="/study_record">これまでの学習記録</NuxtLink></li>
            <li class="nav__item"><a href="/index#point">ポイントについて</a></li>
            <li class="nav__item"><NuxtLink to="/prize">ゲットできる商品</NuxtLink></li>
            <li class="nav__item">
              <NuxtLink to="characterList">キャラクター紹介</NuxtLink>
            </li>
          </ul>
        </div>
        <div>
          <ul class="">
            <li class="nav__item"><a href="#terms">規約</a></li>
            <li class="nav__item">
              <NuxtLink to="privacy">個人情報保護方針</NuxtLink>
            </li>
            <li class="nav__item"><a href="#contact">お問合せ</a></li>
          </ul>
        </div>
        <img class="footer_logo" src="/assets/img/logo/logo.svg" alt="" />
      </div>
    </v-footer>    
  </v-app>
</template>
<script>
import ProfileModal from '@/components/profileModal'
import LoginModal from '@/components/loginModal'
import Avatars from '@/plugins/firestore/avatars'
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
        this.avatar = await Avatars.getItem(this.user.avatar)
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