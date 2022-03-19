<template>
  <div class="chart-container">
    <line-chart
      :chart-data="chartData"
      :options="options"
    />
  </div>
</template>
<script>
import LineChart from "@/components/LineChart"

export default {
  name: "ChartContainer",
  components: { LineChart },
  props: {
    labels: {
      type: Array,
      default: null
    },
    val: {
      type: Array,
      default: null
    }
  },
  data: () => ({
    chartData: null,
    options: {}
  }),
  watch: {
    val() {
      this.fillData()
    }
  },
  mounted() {
    this.fillData()
  },
  methods: {
    fillData() {
      console.log('labels:' + JSON.stringify(this.labels))
      console.log('vals:' + JSON.stringify(this.val))
      this.chartData = {
        labels: this.labels,
        datasets: [
          {
            type: "line",
            label: "集中力", // 凡例とツールチップに表示されるデータセットのラベル
            data: this.val,
            fill: true
          }
        ]
      }
      this.options = {
        responsive: true, // コンテナサイズが変更された際に、チャートキャンバスサイズを変更します
        maintainAspectRatio: false,
        title: {
          // タイトル
          // See https://misc.0o0o.org/chartjs-doc-ja/configuration/title.html
          display: true, // タイトルを表示します。
          position: "top", // タイトルの位置
          fontSize: 12, // タイトルのフォントサイズ
          padding: 10, // タイトルテキストの上下に追加するピクセル数
          text: "集中力のグラフ"
        },
        legend: {
          // 凡例に関する設定
          // See https://misc.0o0o.org/chartjs-doc-ja/configuration/legend.html
          display: true, // 凡例を表示します。
          position: "bottom" // 凡例の位置
        },
        tooltips: {
          // ツールチップに関する設定
          // See https://misc.0o0o.org/chartjs-doc-ja/configuration/tooltip.html
          display: true // キャンバス上でツールチップを有効にします
        },
        elements: {
          // 要素に関する設定
          // See https://misc.0o0o.org/chartjs-doc-ja/configuration/elements.html
          point: {
            pointStyle: "circle", // 点のスタイル。
            backgroundColor: "white", // 点の塗りつぶし色。
            borderWidth: 5, // 点の境界線の幅。
            borderColor: "red",
            radius: 8, // 点の半径
          },
          line: {
            tension: 0,  // ベジェ曲線の張力
            backgroundColor: 'rgb(232, 234, 246, 0.1)', // 線の塗りつぶしの色。
            borderWidth: 5, // 線の太さ。
            borderColor: "red", // 線のストロークの色。

          }
        },
        scales: {
          y: {
            stacked: true,
            ticks: {
              color: "#E8EAF6",
            },
            grid: {
              color: "rgb(232, 234, 246, 0.1)"
            },
          },
          x: {
            ticks: {
              color: "#E8EAF6",
            },
            grid: {
              color: "rgb(232, 234, 246, 0.1)"
            }
          }
        }
      }
    }
  }
}
</script>