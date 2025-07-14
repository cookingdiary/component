<template>
    <div :class="bem.b()">
        <template v-for="node in flattenTree">
            <div :class="bem.e('element')">{{ node.label }}</div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { createNameSpace } from '@zi-shui/utils/create';
import { treeProps, TreeNode, TreeOption } from './tree';
import { computed, ref, watch } from 'vue'

defineOptions({
    name: 'z-tree'
})

const bem = createNameSpace('tree')

const props = defineProps(treeProps)

function createOptions(key: string, label: string, children: string) {
    return {
        getKey(node: TreeOption) {
            return node[key] as string
        },
        getLabel(node: TreeOption) {
            return node[label] as string 
        },
        getChildren(node: TreeOption) {
            return node[children] as TreeOption[]
        }
    }
}
const TreeOptions = createOptions(
    props.keyField,
    props.labelField,
    props.childrenField
)
function createTree(data: TreeOption[]): any {
    function traversal(data: TreeOption[], parent?: TreeNode | null) {
        return data.map(node => {
            const children = TreeOptions.getChildren(node) || []
            const treeNode: TreeNode = {
                key: TreeOptions.getKey(node),
                label: TreeOptions.getLabel(node),
                children: [],
                rawNode: node,
                level: parent ? parent.level + 1 : 0,
                isLeaf: node.isLeaf ?? children.length == 0

            }
            if (children.length > 0) {
                treeNode.children = traversal(children, treeNode);
            }
            return treeNode
        })
    }

    const result: TreeNode[] = traversal(data)
    return result

}
const tree = ref<TreeNode[]>([])

watch(() => props.data,
    (data: TreeOption[]) => {        
        tree.value = createTree(data)
        console.log(tree.value);
    }, 
    { immediate: true })

const expandedKeysSet = ref(new Set(props.defaultExpandedKeys))
console.log(props.defaultExpandedKeys);

const flattenTree = computed(() => {
    const expandedKeys = expandedKeysSet.value

    let flattenNodes: TreeNode[] = []; //拍平结果

    const nodes = tree.value || [];
    const stack: TreeNode[] = [];

    for (let i = nodes.length - 1; i >= 0; --i) {
        stack.push(nodes[i])
    }

    while (stack.length) {
        const node = stack.pop();
        if (!node) continue
        flattenNodes.push(node)
        if (expandedKeys.has(node.key)) {
            const children = node.children;
            if (children) {
                for (let i = node.children.length - 1; i >= 0; --i) {
                    stack.push(node.children[i]);
                }
            }
        }

    }
    return flattenNodes

})
console.log(flattenTree.value);

</script>
