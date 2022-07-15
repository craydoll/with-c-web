<template>
    <v-card height="200">
    <ChartContainer
      :labels="labels"
      :val="value"
    />
  </v-card>
</template>
<script>
import ChartContainer from '@/components/studyTimeChart'

export default {
  components: {
    ChartContainer
  },
  data: () => ({
      labels: ["国語", "算数/数学", "理科", "社会", "英語", "その他"],
      value: [50, 74, 80, 70, 75, 30],
  }),
}
</script>
