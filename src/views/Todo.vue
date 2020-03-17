<template>
  <v-container style="max-width: 500px; padding: 0; min-width: 200px">
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
    <v-text-field
      style="width: 30%; min-width: 200px"
      label="Category"
      outlined
      v-model="type"
      clearable
      @keydown.enter="create"
    ></v-text-field>

    <v-fade-transition>
      <div v-if="allTasks() > 0">
        <v-row class="my-1">
          <h2 class="success--text">Todo status</h2>
          <v-spacer></v-spacer>
          <v-progress-circular
            :value="progress()"
            color="primary"
            class="mr-2"
          ></v-progress-circular>
        </v-row>
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
        </v-row>

        <v-fade-transition>
          <div v-if="allTypes.length > 1">
            <v-row class="my-1">
              <h2 class="success--text">Todo category</h2>
            </v-row>
            <v-row class="my-1" align="center">
              <v-checkbox
                style="margin: 10px;"
                v-for="type of allTypes"
                v-model="selectedTypes"
                :label="showType(type)"
                :key="type"
                :value="showType(type)"
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

              <v-list-item :key="`${task.id}-item`">
                <v-list-item-action>
                  <v-checkbox
                    v-model="task.completed"
                    :color="(task.completed && 'grey') || 'primary'"
                  >
                    <template v-slot:label>
                      <div
                        :class="
                          (task.completed && 'grey--text') || 'primary--text'
                        "
                        class="ml-4"
                        v-text="task.description"
                        :style="getTextType(i)"
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
      </div>
    </v-fade-transition>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Task from "@/components/todo/Task.ts";

@Component
export default class Todo extends Vue {
  private tasks: Task[] = [];
  private allTypes: string[] = [];
  private selectedTypes: string[] = ["default"];
  private nextId = 0;
  private stateFilter = "all";
  private description = "";
  private type = "";

  mounted() {
    this.loadData();
  }

  loadData() {
    if (localStorage.nextId) {
      this.nextId = parseInt(localStorage.nextId);
    }
    if (localStorage.tasks) {
      for (const json of JSON.parse(localStorage.tasks)) {
        const task = new Task(0, "");
        Object.assign(task, json);
        this.tasks.push(task);
      }
    }
    const set = new Set(this.tasks.map(task => this.showType(task.type)));
    set.add("default");
    this.allTypes = [...set];
  }

  get filterdTasks(): Task[] {
    console.log("filterdTasks");

    return this.tasks
      .filter(task => {
        return (
          this.stateFilter === "all" ||
          (task.completed && this.stateFilter === "completed") ||
          (!task.completed && this.stateFilter === "incomplete")
        );
      })
      .filter(task => {
        return this.selectedTypes.includes(this.showType(task.type));
      });
  }

  changeAndSave(task: Task) {
    task.completed = !task.completed;
    this.saveData();
  }

  getTextType(index: number) {
    if (this.tasks[index].completed) {
      return "text-decoration: line-through;";
    } else {
      return "";
    }
  }

  showType(type: string): string {
    return type === "" ? "default" : type;
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
    this.tasks.push(new Task(this.nextId, this.description, this.type));
    this.nextId++;
    this.description = "";
    if (!this.allTypes.includes(this.type)) {
      this.allTypes.push(this.type);
    }
  }

  saveData() {
    localStorage.nextId = this.nextId;
    localStorage.tasks = JSON.stringify(this.tasks);
  }

  @Watch("tasks", { deep: true })
  onTaskChanged() {
    this.saveData();
  }
}
</script>
