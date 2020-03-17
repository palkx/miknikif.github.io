<template>
  <v-container style="max-width: 500px; padding: 0;">
    <h2 class="display-1 success--text pl-4">
      Simple Todo
    </h2>

    <v-text-field
      style="margin-top: 30px;"
      label="What's your next todo?"
      outlined
      v-model="description"
      @keydown.enter="create"
      clearable
      append-icon="mdi-plus"
      @click:append="create"
    ></v-text-field>

    <v-divider class="mt-4"></v-divider>

    <v-row class="my-1" align="center">
      <v-radio-group v-model="stateFilter" row>
        <v-radio :label="'All(' + allTasks() + ')'" value="all"></v-radio>
        <v-radio
          :label="'Incomplete(' + remainingTasks() + ')'"
          value="incomplete"
        ></v-radio>
        <v-radio
          :label="'Completed(' + completedTasks() + ')'"
          value="completed"
        ></v-radio>
      </v-radio-group>

      <v-spacer></v-spacer>

      <v-progress-circular
        :value="progress()"
        color="primary"
        class="mr-2"
      ></v-progress-circular>
    </v-row>

    <v-divider class="mb-4"></v-divider>

    <v-card>
      <v-slide-y-transition class="py-0" group tag="v-list">
        <template v-for="(task, i) of filterdTasks()">
          <v-divider v-if="i !== 0" :key="`${task.id}`"></v-divider>

          <v-list-item :key="`${task.id}`">
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
          </v-list-item>
        </template>
      </v-slide-y-transition>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Task from "@/components/todo/Task.ts";

@Component
export default class Todo extends Vue {
  private tasks: Task[] = [];
  private allTypes: string[] = [];
  private selectedTypes: string[] = [];
  private nextId = 0;
  private stateFilter = "all";
  private description = "";

  mounted() {
    this.description = "aaaa";
    this.create();
    this.description = "bbbb";
    this.create();
    this.description = "cccc";
    this.create();
  }

  filterdTasks(): Task[] {
    // TODO filterdTasks called while input changed
    return this.tasks
      .filter(task => {
        return (
          this.stateFilter === "all" ||
          (task.completed && this.stateFilter === "completed") ||
          (!task.completed && this.stateFilter === "incomplete")
        );
      })
      .filter(task => {
        return task.type === "" || this.selectedTypes.includes(task.type);
      });
  }

  completedTasks() {
    return this.tasks.filter(task => task.completed).length;
  }

  progress() {
    return (this.completedTasks() / this.tasks.length) * 100;
  }

  remainingTasks() {
    return this.allTasks() - this.completedTasks();
  }

  allTasks() {
    return this.tasks.length;
  }

  create() {
    if (this.description.trim() === "") {
      return;
    }
    this.tasks.push(new Task(this.nextId, this.description));
    this.nextId++;
    this.description = "";
  }
}
</script>
