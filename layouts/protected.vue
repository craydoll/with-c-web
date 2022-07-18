<template>
  <v-app>
    <v-app-bar id="header" prominent app flat color="#c9bc9c" >
      <v-container class="ly_headerInner header_flx" app>
        <h1 class="header_logo">
          <NuxtLink to="/">
            <img src="assets/img/logo/logo_02.svg" alt="withプラス" />
          </NuxtLink>
        </h1>
        <div class="header_logo_eco">
          <img src="assets/img/logo/logo_eco.svg" alt="ecoの志士" />
        <v-btn
          v-if="isTeacher"
          absolute
          small
          right
          bottom
          fab
          to="/userList2"
        >        
          <v-icon
            class="mr-2"
          >mdi-account-school</v-icon>
          </v-btn>
        <v-btn
          v-if="isAdmin"
          class="mx-15"
          absolute
          small
          right
          bottom
          fab
          to="/userList"
        > 
          <v-icon
            absolute
            class="mr-2"
          >mdi-account-wrench</v-icon>
        </v-btn>
        </div>
        <!-- Hamburger-icon -->
        <v-app-bar-nav-icon v-if="isMobile" class="max1090_b hamburger_icon" @click="drawer = true">
        <button class="openMenu">
          <span class="openMenu__icon line01"></span>
          <span class="openMenu__icon line02"></span>
          <span class="openMenu__icon line03"></span>
        </button>
        </v-app-bar-nav-icon>
        <!-- Hamburger-icon -->
        <nav v-else class="max1090_n">
          <ul class="header_nav">
            <li class="nav__item"><NuxtLink to="/#howTo">使い方</NuxtLink></li>
            <li class="nav__item">
              <NuxtLink to="/study_record">これまでの<br />学習記録</NuxtLink>
            </li>
            <li class="nav__item"><NuxtLink to="/#point">ポイントについて</NuxtLink></li>
            <li class="nav__item"><NuxtLink to="/prize">ゲットできる商品</NuxtLink></li>
            <li class="nav__item">
            <RecordButton :loggedin="isLoggedIn" @login="termsModal"/>
            </li>
          </ul>
        </nav>
      </v-container>

      <div class="align-self-center">
        <v-btn v-if="isLoggedIn" name="profile" :small="isMobile" fab @click="showProfile=true">
          <v-avatar size="50">
            <img
            :src="avatar.img"
            alt="avatar"
            >
          </v-avatar>
        </v-btn>

        <TermsModal
          :modal-show="showTerms"
          @login="loginBtn"
        />
        <LoginModal
          :modal-show="showLogin"
        />
        <ProfileModal
          :modal-show="showProfile"
          @close="modalClosed"
        />
      </div>
    </v-app-bar>
    <v-navigation-drawer
      v-if="isMobile"
      v-model="drawer"
      fixed
      temporary
      app
    >
      <div class="sp-menu">
     <v-list
        nav
      >
          <v-list-item class="header-nav-item"><a href="#howTo">使い方</a></v-list-item>
          <v-list-item class="header-nav-item">
            <a href="#record">これまでの学習記録</a>
          </v-list-item>
          <v-list-item class="header-nav-item">
            <a href="#point">ポイントについて</a>
          </v-list-item>
          <v-list-item class="header-nav-item">
            <a href="prize">ゲットできる商品</a>
          </v-list-item>
          <v-list-item class="header-nav-item">
            <RecordButton :loggedin="isLoggedIn" @login="loginBtn"/>
          </v-list-item>
     </v-list>
      </div>
    </v-navigation-drawer>    
    <v-main id="#body" app>
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
import ProfileModal from '@/components/profileModal'
import LoginModal from '@/components/loginModal'
import TermsModal from '@/components/termsModal'
import Avatars from '@/plugins/firestore/avatars'
import RecordButton from '@/components/recordButton'

export default {
  name: 'DefaultLayout',
  components: {
    ProfileModal,
    LoginModal,
    TermsModal,
    RecordButton,
  },
  middleware: 'authenticated',
  data() {
    return {
      isLoggedIn: false,
      user: null,
      avatar: 'fig_chr_noimage.png',
      showProfile: false,
      showLogin: false,
      showTerms: false,
      drawer: false,
      isTeacher: false,
      isAdmin: false,
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
<style>
html {
  font-size: 10px;
}
.v-application{
  font-size: 10px;
  font-family: "corporate-logo-ver2" !important;
}
</style>