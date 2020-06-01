<template>
<div v-if="root.show" class="p-absolute h-100 overflow-auto bg-white animated fadeInLeft faster" :style="root.style">
    <button @click="root.show = false" class="btn btn-block text-right material-icons">chevron_left</button>

    <div id="template-data" class="border d-flex flex-wrap justify-content-center" ref="container">        
    </div>

</div>
</template>

<script>
import { SVG } from '@svgdotjs/svg.js'
export default {
    props: {
        g: { rquired: true }
    },
    data() {
        return {
            root: {
                show: false,
                style: { left: '0px', top: '0px', width: '360px', zIndex: '10000'}
            },
            container: { node: null },
            draw: { $: null, types: ["g", "path", "circle"] },
        }
    },
    watch: {
      g: function(current, previous) {
            setTimeout(() => {
                this.root.show = true
                let $this = this
                $("#template-data").html("")
                console.log(this.container.node)
                let children = $children({ child: current, parent_tag: 'svg' })
                children.each(function(i) {
                    if($this.draw.types.includes(this.tagName)) {
                        let svg = SVG($parent(current, 'svg')).clone()
                        let data = SVG(this).clone()
                        svg.clear()
                        svg.add(data)
                        svg.addTo("#template-data").size( i==0 ? "100%" : "45%", i==0 ? "100%" : "45%")
                        svg.addClass('p-3 m-2 bg-light')
                    }
                })                
            }, 500);
      }  
    },
    methods: {
        $init() {
            this.container.node = $(this.$refs.container)
            console.log(this.container.node, 'node')
        },
    },
    mounted() {
        this.$nextTick(() => this.$init())
        console.log(this.g, 'g')
    }
}
</script>

<style>

</style>