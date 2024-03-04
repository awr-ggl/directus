<script setup lang="ts">
import { computed } from "vue";
import { Item, Field } from "@directus/types";
import { LayoutOptions } from "./types";
import Row from "./row.vue";
import { convertToNestedItems } from "./functions";

defineOptions({
  inheritAttrs: false,
});

type PropsType = {
  layoutOptions: LayoutOptions;
  primaryKeyField: Field;
  collection: string;
  items?: Item[];
  loading: boolean;
};
const props = defineProps<PropsType>();

const nestedTopLevelItems = computed(() => {
  const nestedItems = convertToNestedItems(
    props.items,
    props.primaryKeyField.field,
    props.layoutOptions.parentField,
    props.layoutOptions.childrenField,
  );
  return nestedItems;
});
</script>

<template>
  <div v-if="!loading">
    <ul>
      <Row
        v-for="item in nestedTopLevelItems"
        :key="item.id"
        :item="item"
        :collection="props.collection"
        :primary-key-field="props.primaryKeyField.field"
        :children-field="props.layoutOptions.childrenField"
      />
    </ul>
  </div>
</template>
