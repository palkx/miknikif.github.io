<template>
  <v-list-item>
    <v-list-item-action>
      <v-checkbox
        v-model="task.completed"
        :color="(task.completed && 'grey') || 'primary'"
      >
        <template v-slot:label>
          <div
            :class="(task.completed && 'grey--text') || 'primary--text'"
            class="ml-4"
            v-text="task.description"
            :style="getTextDecoration(task)"
          ></div>
        </template>
      </v-checkbox>
    </v-list-item-action>

    <v-spacer></v-spacer>

    <v-scroll-x-transition>
      <v-icon v-if="task.completed" color="success">
        mdi-check
      </v-icon>
    </v-scroll-x-transition>
    <v-icon color="error" @click="deleteTask(task)">
      mdi-delete
    </v-icon>
  </v-list-item>
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
