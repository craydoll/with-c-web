<template>
<div>
  <body>
      <section class="record_result">
        <div class="ly_contInner ly_contInner_bg">
          <div class="record_result_body">
            <p class="record_result_ttl el_deco_line">* エラーだよ *</p>
            <p class="record_result_date">{{ message }}</p>
            <div class="el_btn_location">
              <NuxtLink class="el_btn el_btn__lor record_screen_btn" to="/">
                トップページへ戻る
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>
  </body>
</div>
</template>
<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      message: 'aaaa',
    }
  },
  mounted() {
    // クエリパラメータよりメッセージ受け取り
    this.message = this.$route.query.mes
  },
}
</script>
