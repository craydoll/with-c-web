<template>
  <v-container fluid class="ma-0 pa-0">
      <section>
        <div class="ly_contInner ly_contInner_bg">

          <section class="intro">
            <div class="ly_contInner">
              <h2 class="cmp_heading_05">キャラクター紹介</h2>
              <ul class="intro_list">

                <li
                  v-for="(item, i) in charList"
                  :key="i"                
                  class="intro_item"
                >
                  <div class="intro_item_body">
                    <div class="intro_pic">
                      <v-img
                        class=""
                        :src="item.img"
                        :alt="item.name"
                      />
                    </div>
                    <div class="intro_desc">
                      <h3 class="intro_desc_name">{{item.name}}</h3>
                      <p class="intro_desc_belief">信条：{{item.belief}}</p>
                      <p></p>
                      <pre class="intro_desc_txt pre"> {{item.summary}} </pre>
                    </div>
                  </div>
                  <div class="intro_sdgsNum">
                    <v-img class="intro_sdgsNum_fig" :src="item.sdgs_img" max-width="75" alt=""/>
                    <div>
                      <span class="intro_sdgsNum_ttl">担当SDGS項目</span>
                      <p>{{item.sdgs}}</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </section>

        </div>
      </section>
    <footer class="bgc_br tac">
      <img class="footer_logo" src="assets/img/logo/logo.svg" alt="" />
    </footer>
  </v-container>
</template>
<script>
import Avatars from '@/plugins/firestore/avatars'
export default {
  layout: 'protected',
  data () {
    return {
      charList: []
    }
  },  
  async mounted() {
    const ret = await Avatars.getAllItems()
    this.charList = ret
  }
}
</script>
<style scoped>
.pre {
  white-space:pre-wrap;
  word-wrap:break-word;
}
</style>