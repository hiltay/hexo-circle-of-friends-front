<template>
  <span>{{ url }}</span>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import useMainStore from "@/stores/main"
const manageStore = useMainStore();
const { url } = storeToRefs(manageStore)
</script>

<style scoped>
#cf-state {
  position: relative;
  font-size: 16px;
  border-radius: 8px;
  box-shadow: none;
  max-width: 810px;
  margin: auto;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 8px 0;
}

#cf-change .cf-change-now {
  color: var(--lmm-hover);
  font-weight: 800;
}

.cf-state-data {
  width: 100%;
  display: flex;
}

.cf-data-friends, .cf-data-active, .cf-data-article {
  height: 60px;
  background: transparent;
  display: flex;
  flex-direction: column;
  width: 33%;
  cursor: pointer;
}
.cf-label {
  font-size: 16px;
  padding: 0 3%;
  align-self: center;
  text-align: center;
  width: 100%;
  height: 30px;
}

.cf-message {
  align-self: center;
  text-align: center;
  padding: 0 3%;
  width: 50%;
  font-size: 20px;
}

#panel-btn{
  position: absolute;
  right: 0;
  bottom: 0;
}
</style>
