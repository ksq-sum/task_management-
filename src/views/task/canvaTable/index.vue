<template>
  <v-container>
    <table class="table">
      <thead>
        <tr>
          <th>任务名称</th>
          <th>阶段</th>
          <th>资产类型</th>
          <th>制作者</th>
          <th>任务状态</th>
          <th>流程审核</th>
          <th>内部审核</th>
          <th>流程审核</th>
          <th>剩余天数</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(group, groupIndex) in groupedDesserts">
          <tr @click="toggleGroup(groupIndex)">
            <td colspan="9" class="group-header">{{ group.category }}</td>
          </tr>
          <template v-if="isGroupOpen(groupIndex)">
            <tr v-for="dessert in group.items" :key="dessert.name">
              <td>{{ dessert.name }}</td>
              <td>{{ dessert.calories }}</td>
              <td>{{ dessert.fat }}</td>
              <td>{{ dessert.carbs }}</td>

              <td style="display: flex; justify-content: center">
                <button>{{ dessert.protein }}</button>
              </td>

              <td>{{ dessert.fat }}</td>
              <td>{{ dessert.carbs }}</td>
              <td>{{ dessert.protein }}</td>
              <td>{{ dessert.iron }}</td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      desserts: [
        {
          name: "task01-Design",
          calories: "Design",
          fat: "Chars",
          carbs: "张三",
          protein: "待审核",
          iron: "12",
          gluten: false,
          category: "task01"
        },
        {
          name: "task01-Mod",
          calories: "Mod",
          fat: "Chars",
          carbs: "张三",
          protein: "待审核",
          iron: "12",
          gluten: true,
          category: "task01"
        },
        {
          name: "task01-Textrue",
          calories: "Textrue",
          fat: "Chars",
          carbs: "张三",
          protein: "待审核",
          iron: "12",
          gluten: true,
          category: "task01"
        },
        {
          name: "task01-Rig",
          calories: "Rig",
          fat: "Chars",
          carbs: "张三",
          protein: "待审核",
          iron: "12",
          gluten: true,
          category: "task01"
        },
        {
          name: "task02-Design",
          calories: "Design",
          fat: "Chars",
          carbs: "张三",
          protein: "待审核",
          iron: "12",
          gluten: false,
          category: "task02"
        }
      ],
      openGroups: [] // 用于存储展开的组索引
    };
  },
  computed: {
    groupedDesserts() {
      const groups = {};
      this.desserts.forEach(dessert => {
        if (!groups[dessert.category]) {
          groups[dessert.category] = {
            category: dessert.category,
            items: []
          };
        }
        groups[dessert.category].items.push(dessert);
      });

      // 初始化 openGroups，默认展开所有组
      this.openGroups = Object.keys(groups).map((_, index) => index);

      return Object.values(groups);
    }
  },
  methods: {
    toggleGroup(groupIndex) {
      console.log(groupIndex);
      const index = this.openGroups.indexOf(groupIndex);
      if (index > -1) {
        this.openGroups.splice(index, 1); // 收起
      } else {
        this.openGroups.push(groupIndex); // 展开
      }
    },
    isGroupOpen(groupIndex) {
      console.log(groupIndex);
      return this.openGroups.includes(groupIndex);
    }
  }
};
</script>

<style scoped lang="scss">
@import "./index";
</style>
