<template>
  <v-app>
    <v-app-bar app prominent fixed flat class="justify-center" color="#c9bc9c" scroll-target="#body">
      <div class="ly_headerInner header_flx">
        <v-app-bar-title>
          <NuxtLink to="/"><img src="assets/img/logo/logo.svg" alt="ロゴ" /></NuxtLink>
        </v-app-bar-title>
        <nav class="max768_n">
          <ul class="header_nav">
            <li class="nav__item"><NuxtLink to="/#howTo">使い方</NuxtLink></li>
            <li class="nav__item"><NuxtLink to="/#record">これまでの学習記録</NuxtLink></li>
            <li class="nav__item"><NuxtLink to="/#aboutPoint">ポイントについて</NuxtLink></li>
            <li class="nav__item"><NuxtLink to="/#terms">規約</NuxtLink></li>
            <li class="nav__item"><NuxtLink to="/privacyPage">個人情報保護方針</NuxtLink></li>
            <li class="nav__item"><a href="/#contact">お問合せ</a></li>
          </ul>
        </nav>
        <!-- Hamburger-icon -->
        <div class="max970_b hamburger_icon">
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
            <li class="header-nav-item"><a href="#terms">規約</a></li>
            <li class="header-nav-item"><NuxtLink to="privacyPage">個人情報保護方針</NuxtLink></li>
            <li class="header-nav-item"><a href="#contact">お問合せ</a></li>
          </ul>
        </div>
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