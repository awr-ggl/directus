<template>
  <div class="field">
    <div class="type-label">Parent field</div>
    <v-select
      v-model="parentFieldWritable"
      :items="parentFieldOptions"
      item-text="name"
      item-value="field"
    />
  </div>
  <div class="field">
    <div class="type-label">Children field</div>
    <v-select
      v-model="childrenFieldWritable"
      :items="childrenFieldOptions"
      item-text="name"
      item-value="field"
    />
  </div>
</template>

<script lang="ts">
import { useCollection, useSync } from "@directus/extensions-sdk";
import { computed, defineComponent, PropType, toRefs, Ref } from "vue";
import { LayoutOptions } from "./types";
export default defineComponent({
  inheritAttrs: false,
  props: {
    collection: { type: String, required: true },
    layoutOptions: { type: Object as PropType<LayoutOptions>, required: true },
  },
  setup(props, { emit }) {
    const { collection: collectionKey } = toRefs(props);
    const collection = useCollection(collectionKey);

    const layoutOptions: Ref<LayoutOptions> = useSync(
      props,
      "layoutOptions",
      emit,
    );

    const parentFieldOptions = computed(() =>
      collection.fields.value.filter(
        (f) => f.meta?.interface === "select-dropdown-m2o",
      ),
    );

    const parentFieldWritable = computed({
      get() {
        return layoutOptions.value?.parentField;
      },
      set(newValue) {
        layoutOptions.value = Object.assign({}, layoutOptions.value, {
          parentField: newValue,
        });
      },
    });

    const childrenFieldOptions = computed(() =>
      collection.fields.value.filter(
        (f) => f.meta?.interface === "list-o2m-tree-view",
      ),
    );

    const childrenFieldWritable = computed({
      get() {
        return layoutOptions.value?.childrenField;
      },
      set(newValue) {
        layoutOptions.value = Object.assign({}, layoutOptions.value, {
          childrenField: newValue,
        });
      },
    });

    return {
      parentFieldOptions,
      parentFieldWritable,
      childrenFieldOptions,
      childrenFieldWritable,
    };
  },
});
</script>
