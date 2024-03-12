<script setup lang="ts">
import { Item } from "@directus/types";
import Self from "./row.vue";

type PropsType = {
  item: Item;
  collection: string;
  primaryKeyField: string;
  childrenField: string;
  textClickHandler: ({ item, event }: { item: Item, event: PointerEvent }) => void,
	isSelectedFn: (primaryKey: any) => boolean,
};
const props = defineProps<PropsType>();
</script>

<template>
  <li>
    <button @click="textClickHandler({ item: props.item, event: $event })">
      <span :class="props.isSelectedFn(props.item.id) ? 'selected' : null">{{ props.item.name }}</span>
		</button>
    <ul v-if="props.item[props.childrenField].length > 0">
      <Self
        v-for="item in props.item[props.childrenField]"
        :key="item.id"
        :item="item"
        :collection="props.collection"
        :primary-key-field="props.primaryKeyField"
        :children-field="props.childrenField"
        :text-click-handler="handleClick"
        :is-selected-fn="isSelectedFn"
      />
    </ul>
  </li>
</template>

<style lang="css" scoped>
.selected {
  text-decoration: underline;
}
</style>
