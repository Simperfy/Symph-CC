// TEXT EDITOR: VSCode
// DESCRIPTION:
// I Assumed that the parent of root is always null (shall the requirements changed it's super easy to modify the code without introducing new bugs)
// I wrote documentation as I'm assuming the code I will write will be read by other developers in the future

/**
 * @typedef {Object[]} Items
 * @property {Number} items[].id     - The ID
 * @property {Number} items[].seqId  - sequence ID
 * @property {Number} items[].parent - parent ID
 * @property {String} items[].name   - filename
 */

/**
 * @description returns sorted items based on parent and seqId
 * @param {Items} items        - Items array of Object
 */
const transformItems = (items) => {
    // let's do divide and conquer
    const childrenGroup = [
        // { parent: 5, childrenArr: [] },
    ];

    // group children by their respective parent
    for (const item of items) {
        const children = childrenGroup.find(child => child.parent === item.parent);
        if (!children) childrenGroup.push({ parent: item.parent, childrenArr: [item]});
        else children.childrenArr.push(item);
    }

    // sort children array by seqId
    childrenGroup.forEach(child => child.childrenArr.sort((item1, item2) => item1.seqId < item2.seqId ? -1 : 1));

    const result = [];
    // shall the parent of root changes other value other than "null" value, just add the condition here
    const rootParentGroup = childrenGroup.find(child => child.parent === null || child.parent === 0);
    // recursively group the children starting from root and store the results
    rootParentGroup.childrenArr.forEach(child => result.push(...groupChildren([child], childrenGroup)));

    return result;
}

/**
 * @description A recursive function that returns the array of grouped children
 * @param {Items} child                            - child Object
 *
 * @param {Object[]} childrenGroup                 - Children Group Object
 * @param {Number} childrenGroup[].parent          - The parent ID
 * @param {Items} childrenGroup[].childrenArr      - Children Array
 *
 * @param {Number} currentChildIndex               - current id of the item looking for children
 *
 * @param {Number} depth                           - depth of the tree
 *
 * @returns {Items} items                          - sorted result of items
 */
const groupChildren = (child, childrenGroup, currentChildIndex = 0, depth=0) => {
    // add the depth
    child = child.map(child => {
        if (child.depth === undefined) child.depth = depth;
        return child;
    });

    const index = child.findIndex(c => c.id === child[currentChildIndex].id);

    const childrenToAppend = childrenGroup.find(c => c.parent === child[index].id);

    if (childrenToAppend !== undefined) {
        child.splice(index+1, 0, ...childrenToAppend.childrenArr);
        return groupChildren(child, childrenGroup, ++currentChildIndex, ++depth);
    }

    return child;
}

module.exports = transformItems;
