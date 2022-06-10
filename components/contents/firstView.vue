<template>
  <section class="fv">
    <img class="sdgs_logo" src="assets/img/logo/logo_sdg.svg" alt="" />
    <div class="fv_container">
      <!-- fv画像 -->
      <img
        class="max768_n"
        src="assets/img/fig/fig_fv_07.png"
        alt="withプラスで勉強の集中力をレベルアップ"
      />
      <img
        class="max768_b"
        src="assets/img/fig/fig_fv_06.png"
        alt="withプラスで勉強の集中力をレベルアップ"
      />
      <!-- fv画像 -->
      <!-- fvタイトル -->
      <!-- <div class="fv_contents max768_n">
        <img src="assets/img/logo/logo.svg" alt="" />
        <div class="fv_chr">
          <img src="assets/img/chr/fig_chr_samurai.png" alt="エコ侍" />
          <img src="assets/img/chr/fig_chr_musume.png" alt="エコ町娘" />
        </div>
        <p class="fv_ttl">集中力を<span>レベルアップ</span>しよう！</p>
      </div> -->
      <!-- fvタイトル -->
      <div class="el_btn_location">
        <p class="el_deco_bracket">キミの集中力レベルは？</p>
          <RecordButton :loggedin="loggedin" @login="pressLogin"/>
      </div>
    </div>
  </section>
</template>
<script>
import RecordButton from '@/components/recordButton'
export default {
  components: {
    RecordButton
  },
  props: {
    loggedin: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  methods: {
    pressLogin() {
      console.log('in pressLogin')
      this.$nuxt.$emit('showLoginModal')
    }
  }
}
</script>