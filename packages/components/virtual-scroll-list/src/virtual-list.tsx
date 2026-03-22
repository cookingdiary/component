import { defineComponent, DefineComponent, onBeforeMount, ref } from "vue";
import { RangeOptions, updateType, virtualProps } from './props'
import { initVirtual } from "./virtual";
import VirtualItem from './virtual-item'

export default defineComponent({
    name: 'z-virtual-scroll-list',
    props: virtualProps,
    setup(props, { }) {
        const range = ref<RangeOptions | null>(null)

        const update: updateType = newRange => {
            range.value = newRange
        }

        let virtual: ReturnType<typeof initVirtual>

        const getUniqueIdFromDataSources = (): string[] => {
            const { dataSources, dataKey } = props
            return dataSources.map(dataSource => (dataSource as any)[dataKey])
        }

        const installVirtual = () => {
            virtual = initVirtual({
                keeps: props.keeps,
                buffer: Math.round(props.keeps / 3),
                uniqueIds: getUniqueIdFromDataSources(),
                estimateSize: props.estimateSize
            }, update)

        }

        onBeforeMount(() => {
            installVirtual()
        })
        function genRenderComponent() {
            const slots = []
            const { start, end } = range.value!
            const { dataSources, dataComponent, dataKey } = props
            for (let index = start; index <= end; index++) {
                const dataSource = dataSources[index]
                const uniqueKey = (dataSource as any)[dataKey]
                if (dataSource) {
                    // slots.push(<dataComponent key={uniqueKey} source={dataSource}></dataComponent>)
                    slots.push(
                        <VirtualItem uniqueKey={uniqueKey} dataSource={dataSource} onItemResize={onItemResize} ></VirtualItem>
                    )
                }
            }
            return slots
        }
        function onItemResize(id: string | number, size: number) {
            console.log('size');
            virtual.saveSize(id, size)

        }

        const root = ref<HTMLElement | null>()
        function onScroll() {
            if (root.value) {
                const offset = root.value.scrollTop
                virtual.handleScroll(offset)
            }

        }
        return () => {
            const { padFront, padBehind } = range.value!
            const paddingStyle = {
                padding: `${padFront}px 0 ${padBehind}px`
            }


            return (
                <div onScroll={onScroll} ref={root}><div style={paddingStyle}>{genRenderComponent()}</div></div>
            )
        }
    }
})