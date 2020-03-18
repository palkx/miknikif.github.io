<template>
  <v-container
    class="px-2 mb-5 py-0"
    style="max-width: 500px;  min-width: 200px; "
  >
    <h2 class="display-1 success--text">
      Simple Todo
    </h2>

    <v-text-field
      class="mt-4"
      style="min-width: 200px"
      label="What's your next todo?"
      hide-details
      outlined
      v-model="description"
      @keydown.enter="create"
      clearable
      append-icon="mdi-plus"
      @click:append="create"
    ></v-text-field>
    <v-text-field
      class="my-2"
      style="width: 30%; min-width: 200px"
      label="Category"
      outlined
      hide-details
      v-model="type"
      clearable
      @keydown.enter="create"
    ></v-text-field>

    <v-fade-transition>
      <div v-if="allTasks() > 0">
        <v-divider class="my-2"></v-divider>
        <v-row no-gutters>
          <h2 class="primary--text">Filters</h2>
          <v-spacer></v-spacer>
          <v-progress-circular
            :value="progress()"
            color="primary"
          ></v-progress-circular>
        </v-row>
        <v-row no-gutters>
          <h4 class="primary--text">State</h4>
        </v-row>
        <v-row no-gutters>
          <v-radio-group v-model="stateFilter" row hide-details>
            <v-radio
              class="state-filter ma-2"
              :label="'All(' + allTasks() + ')'"
              value="all"
            ></v-radio>
            <v-radio
              class="state-filter ma-2"
              :label="'Incomplete(' + remainingTasks() + ')'"
              value="incomplete"
            ></v-radio>
            <v-radio
              class="state-filter ma-2"
              :label="'Completed(' + completedTasks() + ')'"
              value="completed"
            ></v-radio>
          </v-radio-group>
        </v-row>
        <v-fade-transition>
          <div v-if="showTypes()" class="mt-4">
            <v-row no-gutters>
              <h4 class="primary--text">Category</h4>
            </v-row>
            <v-row align="center" no-gutters>
              <v-checkbox
                class="state-filter ma-2"
                v-for="type of allTypes"
                v-model="selectedTypes"
                :label="type"
                :key="type"
                :value="type"
                hide-details
              ></v-checkbox>
            </v-row>
          </div>
        </v-fade-transition>

        <v-divider class="mb-4"></v-divider>

        <v-card>
          <v-slide-y-transition class="py-0" group tag="v-list">
            <template v-for="(task, i) of filterdTasks">
              <v-divider v-if="i !== 0" :key="`${task.id}-divider`"></v-divider>
              <todo-item
                :key="`${task.id}-item`"
                :task="task"
                @delete-task="deleteTask"
              ></todo-item>
            </template>
          </v-slide-y-transition>
        </v-card>
      </div>
    </v-fade-transition>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Task from "@/components/todo/Task.ts";
import TodoItem from "@/components/todo/TodoItem.vue";

@Component({
  components: {
    TodoItem
  }
})
export default class Todo extends Vue {
  DEFAULT = "default";

  private tasks: Task[] = [];
  private allTypes: string[] = [];
  private selectedTypes: string[] = [];
  private nextId = 0;
  private stateFilter = "all";
  private description = "";
  private type = "";

  mounted() {
    addEventListener("beforeunload", this.saveData);
    this.loadData();
  }

  loadData() {
    if (localStorage.nextId) {
      this.nextId = parseInt(localStorage.nextId);
    }
    if (localStorage.tasks) {
      for (const json of JSON.parse(localStorage.tasks)) {
        const task = new Task(0, this.DEFAULT);
        Object.assign(task, json);
        this.tasks.push(task);
      }
    }
    this.resetAllTypes();
  }

  resetAllTypes() {
    const set = new Set(this.tasks.map(task => task.type));
    this.allTypes = [...set];
    this.allTypes.sort((x, y) => {
      return x === this.DEFAULT ? -1 : y == this.DEFAULT ? 1 : 0;
    });
    if (this.selectedTypes.length === 0) {
      this.selectedTypes.push(this.DEFAULT);
    }
  }

  get filterdTasks(): Task[] {
    return this.tasks
      .filter(task => {
        return (
          this.stateFilter === "all" ||
          (task.completed && this.stateFilter === "completed") ||
          (!task.completed && this.stateFilter === "incomplete")
        );
      })
      .filter(task => {
        return this.selectedTypes.includes(task.type);
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

  showTypes(): boolean {
    return (
      this.allTypes.length > 1 ||
      (this.allTypes.length === 1 && this.allTypes[0] != "default")
    );
  }

  create() {
    if (this.description.trim() === "") {
      return;
    }
    let type = this.type;
    if (type === "" || type === null) {
      type = this.DEFAULT;
    }
    this.tasks.push(new Task(this.nextId, this.description, type));
    this.nextId++;
    this.description = "";
    this.resetAllTypes();
  }

  saveData() {
    localStorage.nextId = this.nextId;
    localStorage.tasks = JSON.stringify(this.tasks);
  }

  deleteTask(task: Task) {
    const index = this.tasks.indexOf(task);
    if (index > -1) {
      this.tasks.splice(index, 1);
    }
    this.resetAllTypes();
  }
}
</script>

<style>
@media only screen and (max-width: 700px) {
  .state-filter {
    width: 40%;
  }
}
</style>
