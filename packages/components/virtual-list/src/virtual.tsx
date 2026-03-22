import { createNameSpace } from "@zi-shui/utils/create";
import { transform } from "typescript";
import { defineComponent, onMounted,reactive,ref,computed,watch } from "vue";

export default defineComponent({
    name: 'ZVirtualList',
    props: {
        size: {
            type: Number,
            default: 35,
        },
        remain: {
            type: Number,
            default: 8
        },
        items: {
            type: Array,
            default: () => []
        }
    },
    setup(props, { slots }) {
        const bem = createNameSpace('vl')
        const wrapperRef = ref<HTMLElement>()
        const barRef = ref<HTMLElement>()

        const state = reactive({
            start:0,
            end:props.remain
        })

        const offset = ref(0)

        const prev = computed(() => {
            return Math.min(state.start, props.remain);
        })
        const next = computed(() => {
            return Math.min(state.end, props.items.length - state.end)
        })
        const visibleData = computed(()=>{
            return props.items.slice(state.start - prev.value,state.end+next.value)
        })
        const handleScroll = () =>{
            const scrollTop = wrapperRef.value!.scrollTop;
            state.start = Math.floor(scrollTop / props.size);
            state.end = state.start + props.remain;
            offset.value = state.start * props.size - props.size * prev.value;
        } 

        
        watch(()=>props.items,()=>{
            wrapperRef.value!.style.height = props.remain * props.size + 'px';
            barRef.value!.style.height = props.items.length * props.size + 'px';
        })

        onMounted(()=>{
            wrapperRef.value!.style.height = props.remain * props.size + 'px';
            barRef.value!.style.height = props.items.length * props.size + 'px';
        })
        return () => {
            return (<div class={bem.b()} ref={wrapperRef} onScroll={handleScroll}>
                <div class={bem.e('scroll-bar')} ref={barRef}></div>
                <div class={bem.e('scroll-list')} style={{transform:`translate3d(0,${offset.value}px,0)`}}>
                    {visibleData.value.map((node,idx)=> slots.default!({node}))}
                </div>
            </div>)
        }
    }
})