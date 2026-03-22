import { defineComponent, onMounted, onUpdated, ref } from "vue"
import { virtualItemProps } from "./props"
export default defineComponent({
    name: 'virtual-item',
    props: virtualItemProps,
    emit: ['itemResize'],
    setup(props, { emit }) {
        const root = ref<HTMLElement | null>(null)
        function dispatch(){
            emit('itemResize', props.uniqueKey, root.value?.offsetHeight)
        }
        onUpdated(dispatch)
        onMounted(dispatch)
        return () => {
            const { component: Comp, source, uniqueKey } = props
            return (
                Comp && (
                    <div key={uniqueKey} ref={root}>
                        <Comp source={source}></Comp>
                    </div>
                )
            )
        }
    }


})