import { Ref, ref, toRefs, ComputedRef } from "vue";
import { Field } from "@directus/types";
import {
  defineLayout,
  useCollection,
  useItems,
  useSync,
} from "@directus/extensions-sdk";
import LayoutComponent from "./layout.vue";
import OptionsSlot from "./options.vue";

function transformFieldsAsString(
  fields: ComputedRef<Field[]>,
): Ref<string[] | null | undefined> {
  let stringifiedFields: string[] = [];
  const values = fields.value;
  for (const value of values) {
    stringifiedFields.push(value.field);
  }
  return ref(stringifiedFields);
}

export default defineLayout({
  id: "nested_tree",
  name: "Nested Tree",
  icon: "account_tree",
  component: LayoutComponent,
  slots: {
    options: OptionsSlot,
    sidebar: () => null,
    actions: () => null,
  },
  setup(props, { emit }) {
    const { collection, filter, search } = toRefs(props);
    const {
      info,
      primaryKeyField,
      fields: fieldsInCollection,
    } = useCollection(collection);

    const transformed = transformFieldsAsString(fieldsInCollection);
    const { items, loading, error } = useItems(collection, {
      fields: transformed,
      filter,
      search,
      limit: ref(-1),
      sort: ref(undefined),
      page: ref(undefined),
    });

    const layoutOptions = useSync(props, "layoutOptions", emit);
    return {
      info,
      primaryKeyField,
      items,
      loading,
      filter,
      search,
      fieldsInCollection,
      error,
      collection,
      layoutOptions,
    };
  },
});
