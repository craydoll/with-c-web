<template>
 <v-dialog
    v-model="show"
    max-width="800"
    persistent
  >
    <v-card>
        <div class="ly_contInner">
          <h2 class="cmp_heading_01">規約</h2>
          <div class="terms_notice">
            <p class="terms_notice_ttl">【重要】</p>
            <p class="terms_notice_txt">
              会員登録をされる前に、下記ご利用規約をよくお読みください。<br />
              規約には、本サービスを使用するに当たってのあなたの権利と義務が規定されております。「同意して会員登録へ」ボタンをクリックすると、あなたが本規約の全ての条件に同意したことになります。
            </p>
            <div class="el_btn_location">
              <div class="el_btn el_btn__arrowRight" @click="login">
                同意して会員登録へ
              </div>
            </div>
          </div>
          <div class="terms_cont scroll_wrapper">
            <div class="scroll_item">
              <Terms/>
            </div>
          </div>
        </div>
    </v-card>
 </v-dialog>
</template>
<script>
import Terms from '@/components/contents/termsOfService'
export default {
  components: {
    Terms
  },
  props: {
    modalShow: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      show:false,
    }
  },
  watch: {
    modalShow() {
      console.log('modalshow:' + this.modalShow)
      this.show = true
    },
  },
  methods: {
    login() {
      console.log('in loginButton')
      this.show = false
      this.$emit('login')
    }
  }  
}
</script>
