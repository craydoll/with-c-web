<template>
  <section id="point" class="aboutPoint ly_pdg_bottom_sm">
    <div class="ly_contInner">
      <h2 class="cmp_heading_01">ポイントを利用しよう</h2>
      <div class="bl_media_chr">
        <div class="bl_media_chr_explain">
          <h3 class="aboutPoint_point_ttl">現在のポイント数</h3>
          <p class="aboutPoint_point">{{point}}ポイント</p>
        </div>
        <div class="bl_media_chr_fig">
          <div class="el_bubble">
            おぬしの現在の<br /><span>ポイント数</span
            >がわかるぞよ。<br />増やすには集中することじゃ！
          </div>
          <div class="bl_media_chr_character">
            <img src="assets/img/chr/fig_chr_kizoku.png" alt="" />
            <p class="bl_media_chr_chrName">
              エコ貴族<br class="max768_b" />（えこきぞく）
            </p>
          </div>
        </div>
      </div>
      <div class="flx">
        <div class="aboutPoint_expain">
          <div>
            <h3 class="cmp_heading_02">「withポイント」について</h3>
            <p class="cmp_heading_03">
              「手元測定」モードで集中力の測定をしながら学習すると、集中時間に応じて「withポイント」がたまります。このポイントは教材や食材など、さまざまなモノに交換することが可能です。
              交換できる商品はその都度更新されますので、特に食材は早めに受け取るようにしてください。
            </p>
          </div>
        </div>
        <div class="aboutPoint_expain">
          <div>
            <h3 class="cmp_heading_02">ポイントで交換できるもの</h3>
            <p class="cmp_heading_03">
              文房具やノートなど、様々な商品と交換できます。<br/>
              ポイントで交換できるものに関しては詳しくは下のボタンから。<br />
              <br />
              <NuxtLink
                class="el_btn el_btn__lor el_btn__arrowRight"
                to="prize"
                >商品を見てみる</NuxtLink
              >
            </p>
            <p>
              ※
              交換出来る商品は、食事つき個別指導型無料塾「ステップアップ塾」への支援者による善意の商品です。<br />
              ※ ポイントの有効期限は、最終ログイン日から3年間(仮)です。
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  data () {
    return {
      point: 0
    }
  },
  async mounted() {
    // storeよりユーザー取ってくる
    this.isLoggedIn = await this.$store.getters['auth/isLoggedIn']
    this.user = await this.$store.getters['auth/user']
    if (this.user && this.user.point) {
      this.point = this.user.point
    } else {
      this.point = '--'
    }
  }
}
</script>