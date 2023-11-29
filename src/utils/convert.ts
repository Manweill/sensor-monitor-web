import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import orderBy from 'lodash/orderBy';

export const convertToTree = (
  array: any[],
  pid = 'pid',
  key = 'id',
  childrenName = 'children',
  strict = true,
) => {
  const targetData: any[] = [];
  const list = !strict
    ? cloneDeep(array)
    : cloneDeep(array).map((m) => {
        m[childrenName] = [];
        return m;
      });
  list.forEach((currentData) => {
    const parentData = find(list, { [key]: currentData[pid] });
    if (!parentData) {
      targetData.push(currentData);
    } else {
      parentData[childrenName] = parentData[childrenName] || [];
      parentData[childrenName].push(currentData);
    }
  });
  return targetData;
};

export const sortTree = (
  treeList: any[],
  field: string[] = ['sortNo'],
  orders: ['asc' | 'desc'] = ['asc'],
) => {
  const orderList = orderBy(treeList, field, orders);
  return orderList.map((n) => {
    if (n.children && n.children.length) {
      n.children = sortTree(n.children, field, orders);
    }
    return n;
  });
};
