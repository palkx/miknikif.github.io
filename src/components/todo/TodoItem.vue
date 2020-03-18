<template>
  <v-row
    align="center"
    class="item flex-nowrap"
    no-gutters
    style="padding: 0 8px;"
    v-ripple
  >
    <v-checkbox
      v-model="task.completed"
      :color="(task.completed && 'grey') || 'primary'"
    >
    </v-checkbox>
    <v-tooltip bottom max-width="400px" open-delay="300">
      <template v-slot:activator="{ on }">
        <div
          v-on="on"
          align="start"
          :class="(task.completed && 'grey--text') || 'primary--text'"
          class="ml-4 text-truncate"
          v-text="task.description"
          :style="getTextDecoration(task)"
        ></div>
      </template>
      <div align="start" style="overflow-wrap: break-word;">
        {{ task.description }}
      </div>
    </v-tooltip>

    <v-spacer></v-spacer>
    <v-scroll-x-transition>
      <v-icon v-if="task.completed" color="success">
        mdi-check
      </v-icon>
    </v-scroll-x-transition>
    <v-icon color="error" @click="deleteTask(task)">
      mdi-delete
    </v-icon>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import Task from "@/components/todo/Task.ts";

@Component
export default class TodoItem extends Vue {
  @Prop({ required: true }) readonly task!: Task;

  @Watch("task.completed")
  taskStateChanged() {
    this.$emit("state-changed");
  }

  getTextDecoration(task: Task) {
    if (task.completed) {
      return "text-decoration: line-through;";
    } else {
      return "";
    }
  }

  deleteTask(task: Task) {
    this.$emit("delete-task", task);
  }
}
</script>
