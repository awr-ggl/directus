<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { Item, Field } from "@directus/types";
import { LayoutOptions } from "./types";
import Row from "./row.vue";
import { convertToNestedItems } from "./functions";

const router = useRouter();

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
    props.items ?? [],
    props.primaryKeyField.field,
    props.layoutOptions.parentField ?? "parent_id",
    props.layoutOptions.childrenField ?? "children",
  );
  return nestedItems;
});

const handleClick = ({ item, event }: { item: Item; event: PointerEvent }): void => {
  const primaryKey = item[props.primaryKeyField.field];

  if (props.showSelect === 'none' || !props.selectMode) {
    const route = `/content/${props.collection}/${primaryKey}`;
    if (event.ctrlKey || event.metaKey) {
      window.open(router.resolve(route).href, '_blank');
    } else {
      router.push(route);
    }
    return;
  }

  if (selection.value?.includes(primaryKey) === false) {
    selection.value = selection.value.concat(primaryKey);
  } else {
    selection.value = selection.value.filter((item) => item !== primaryKey);
  }
};
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
        :text-click-handler="handleClick"
      />
    </ul>
  </div>
</template>
