<script setup lang="ts">
import { useRouter } from "vue-router";
import { Item } from "@directus/types";
import Self from "./row.vue";

const router = useRouter();

type PropsType = {
  item: Item;
  collection: string;
  primaryKeyField: string;
  childrenField?: string;
};
const props = defineProps<PropsType>();

const handleClick = (id: any) => {
  router.push(`/content/${props.collection}/${id}`);
};
</script>

<template>
  <li>
    <a @click="handleClick(props.item[props.primaryKeyField])" href="javascript:;">
      <span>{{ props.item.name }}</span>
    </a>
    <ul v-if="props.item[props.childrenField].length > 0">
      <Self
        v-for="item in props.item[props.childrenField]"
        :key="item.id"
        :item="item"
        :collection="props.collection"
        :primary-key-field="props.primaryKeyField"
        :children-field="props.childrenField"
      />
    </ul>
  </li>
</template>
