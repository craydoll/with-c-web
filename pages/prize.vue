<template>
  <body class="prize">
    <main>
      <section class="prize_prizeList">
        <div class="ly_contInner">
          <h1 class="cmp_heading_05">ポイントで交換できるもの</h1>
          <ul class="bl_circleList bl_circleList__SPcol1">
            <li
              v-for="(item, i) in prizeList"
              :key="i"
              class="bl_circleList_item"
            >
              <a href="">
                <div class="bl_circleList_frame">
                  <img :src="item.img" alt="" />
                </div>
                <div class="bl_circleList_body">
                  <p class="bl_circleList_ttl">{{item.name}}</p>
                  <div class="bl_circleList_txt">
                    <dl>
                      <dt>交換ポイント：</dt>
                      <dd>{{item.point}}pt</dd>
                    </dl>
                    <dl>
                      <dt>市場価格：</dt>
                      <dd>¥{{item.market_price}}</dd>
                    </dl>
                    <dl>
                      <dt>残り：</dt>
                      <dd>{{item.stock}}セット</dd>
                    </dl>
                    <dl>
                      <dt>掲載日：</dt>
                      <dd>{{item.reg_date | format-date}}</dd>
                    </dl>
                    <dl>
                      <dt>提供者：</dt>
                      <dd>{{item.donor}}</dd>
                    </dl>
                  </div>
                  <p class="bl_circleList_btnPos">
                    <span class="bl_circleList_btn">
                      交換する
                    </span>
                  </p>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </section>
      <section>
        <div class="ly_contInner">
          <div class="col2">
            <div class="col2_item">
              <h2 class="cmp_heading_02">
                交換会場
              </h2>
              <p class="cmp_heading_03">
                商品は、以下会場にて受け取りが可能です。要予約となります。<br>
                <br>
                ●新宿会場：東京都新宿区西新宿6-12-30芸能花伝舎内<br>
                ●新江古田会場：東京都中野区江原町2-14-17サニー第三熊の坂201
              </p>
            </div>
            <div class="col2_item">
              <h2 class="cmp_heading_02">
                ポイントの使い方
              </h2>
              <p class="cmp_heading_03">
                欲しい商品の＜交換するボタン＞を押し、<br>
                <br>
                ・数量<br>
                ・受取日<br>
                ・会場選択<br>
                ・残りポイント<br>
                <br>
                を確認の上、「決定」ボタンを押してください。
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</template>
<script>
import Prizes from '@/plugins/firestore/prizes'
export default {

  layout: 'protected',
  data() {
    return {
        prizeList: [],
      }
  },
  async mounted () {
    this.prizeList = await Prizes.getAllItems()

  },  
}
</script>
