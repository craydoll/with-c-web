<template>
  <div class="chart-container">
    <BarChart
      :chart-data="chartData"
      :options="options"
      :styles="myStyles"
      :height="height"
    />
  </div>
</template>
<script>
import BarChart from "@/components/BarChart"

export default {
  name: "ChartContainer",
  components: { BarChart },
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
    options: {},
    myStyles: null,
    height: 100
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
      console.log('in fillData:' + this.val)
      this.chartData = {
        labels: this.labels,
        datasets: [
          {
            label: '学習時間',            
            data: this.val,
            backgroundColor: [
              'rgba(255, 99, 132)',
              'rgba(54, 162, 235)',
              'rgba(255, 206, 86)',
              'rgba(75, 192, 192)',
              'rgba(153, 102, 255)',
              'rgba(255, 159, 64)',
              'rgba(153, 102, 255)',
              'rgba(86, 200, 86)',
            ]
          }
        ]
      }
      this.options = {
        legend: {
          // 凡例に関する設定
          // See https://misc.0o0o.org/chartjs-doc-ja/configuration/legend.html
          display: false, // 凡例を表示します。
          // position: "bottom" // 凡例の位置
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: '教科'
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              stepSize: 10,
            }
          }]
        }
      }
    }
  }
}
</script>