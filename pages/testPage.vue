<template>
    <v-card height="200">
    <ChartContainer
      :labels="labels"
      :val="value"
    />
  </v-card>
</template>
<script>
import ChartContainer from '@/components/ChartContainer'

export default {
  components: {
    ChartContainer
  },
  data: () => ({
      labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"],
      value: [50, 74, 80, 70, 75, 30, 25, 35, 20, 80, 85, 50, 85, 60, 70, 75],
  }),
}
</script>
