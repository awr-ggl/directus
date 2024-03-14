import { Item } from "@directus/types";

export function convertToNestedItems(
  items: Item[],
  primaryKeyField: string,
  parentField: string,
  childrenField: string,
): Item[] {
  let nestedItems: Item[] = [];
  const itemMap: Record<any, Item[]> = { 0: [] };

  items.map((item) => {
    const parent = item[parentField];
    const isTopLevel = !parent;

    const recordId = isTopLevel ? 0 : parent;
    if (itemMap[recordId] === undefined) {
      itemMap[recordId] = [];
    }
    itemMap[recordId]!.push(item);
  });

  if (itemMap[0] === undefined) {
    return [];
  }

  for (const index in itemMap[0]) {
    let item = itemMap[0][index]!;
    item = setChildrenItems(itemMap, item, primaryKeyField, item[primaryKeyField], childrenField);
    nestedItems.push(item);
  }

  return nestedItems;
}

function setChildrenItems(
  itemMap: Record<any, Item[]>,
  item: Item,
  primaryKeyField: string,
  parentId: any,
  childrenField: string,
): Item {
  const childrenIds = item[childrenField].map(function (i: any) {
    if (typeof i == 'object') {
      return i[primaryKeyField];
    }

    return i;
  });
  if (!childrenIds) {
    return item;
  }

  const childrenItems: Item[] = [];
  for (const childrenId of childrenIds) {
    let childItem = itemMap[parentId]?.filter((item) => item[primaryKeyField] === childrenId).at(0)!;
    if (!childItem) {
      continue;
    }
    childItem = setChildrenItems(itemMap, childItem, primaryKeyField, childItem[primaryKeyField], childrenField);
    childrenItems.push(childItem);
  }

  item[childrenField] = childrenItems;
  return item;
}
