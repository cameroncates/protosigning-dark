<template>
<div class="d-flex" id="root" ref="root" :style="{height: root['h']+'px'}">
    <!-- LEFT -->
    <div class="bg-white box-shadow overflow-auto" ref="left" :style="{width: left['w']+'px', height: left['h']+'px'}">
        <div class="w-100 text-right">
            <button class="btn material-icons p-2">chevron_left</button>
        </div>
        <div class="ml-4 mr-4 mt-2 mb-2 bd-bottom" v-for="(obj, key) in left['data']" :key="key">
            <button @click="left[key] = !left[key]" class="btn no-btn p-0 mt-2 mb-1">
                <span :class="left[key] ? 'font-weight-bold' : ''">{{key}}</span>
                <span class="material-icons btn p-0 text-md transition-3" :style="left[key] ? {transform: 'rotate(90deg)'} : {transform: 'rotate(0deg)'}">chevron_right</span>
            </button>
            <div v-if="left[key]" class="animated fadeInRight faster">
                <div v-for="(nested, key) in obj" :key="key">
                    <div class="d-flex" :class="nested[0]['heading'] ? 'mt-4 mb-2' : 'mb-3 justify-content-between'">
                        <div v-for="(item, i) in nested" :key="i">
                            <w-range v-if="item['range']" :title="item['text']" :dropdown="item['dropdown']" />
                            <w-dropdown v-else-if="item['dropdown']" :title="item['text']" :w="item['w']" :selected="item['selected']" :list="item['list']" @item_selected="$dropdown_ev" />
                            <w-toggle v-else-if="item['toggle']" :title="item['text']" />
                            <w-inputValue v-else-if="item['input']" :title="item['text']"  :width="item['width']" :icon="item['icon']" />     
                            <div v-else-if="item['button']">
                                <p v-if="item['title']" class="w-100 text-center text-sm pb-1 m-0">{{item['title']}}</p>
                                <button class="w-100 btn p-1 m-0" :class="'icon-'+item['code']"></button>
                            </div>                                           
                            <p class="w-100 m-0 p-0 font-weight-bold text-sm" v-else-if="item['heading']">{{item['text']}}</p>
                        </div>
                    </div>                
                </div>
            </div>
        </div>
    </div>

    <!-- RIGHT  -->
    <div class="p-1 m-0" ref="right" :style="{width: right['w']+'px', height: right['h']+'px'}">
        <!-- TOP -->
        <div class="d-flex justify-content-between" ref="top">
            <div></div>
            <div>
                <button class="btn material-icons">chevron_left</button>
                <button class="btn no-btn border bd-2 pl-3 pr-3 pt-1 pb-1 bg-white">1 / 5</button>
                <button class="btn material-icons">chevron_right</button>
            </div>
            <div class="d-flex">
                <button class="btn d-flex"><span class="material-icons">group_add</span> <span class="text-danger font-weight-bold text-sm">(9+)</span></button>
                <button class="btn material-icons">more_vert</button>
            </div>
        </div>
        <!-- WORKAREA -->
        <div class="p-2 transition-3 w-100 d-flex align-items-center justify-content-center overflow-auto" ref="workarea" :style="{height: workarea['h'] + 'px'}">
            <div id="svg-container" :style="{width: canvas.w + 'px', height: canvas.h + 'px'}" class="border bd-2 p-relative hov-elem" @mouseleave="canvas.props.show = false">
                <!-- PROPS -->
                <div class="p-absolute text-right hov-tg scale-0" style="right:-16px;top:-16px">
                    <button @click="canvas.props.show = !canvas.props.show" class="btn text-white p-1 box-shadow bd-round material-icons transition-3" :class="canvas.props.show ? 'rotate-45 bg-danger' : 'rotate-0 bg-primary'">{{canvas.props.show ? 'add': 'more_vert'}}</button>
                    <div class="bg-white mt-2 box-shadow p-2 animated fadeIn faster" v-if="canvas.props.show">
                        <button @click="$canvas(item['icon'])" class="btn btn-block text-dark text-left" v-for="(item, i) in canvas.props.list" :key="i" :class="item.break ? 'bd-bottom p-0' : 'p-2'">
                            <span v-if="!item.break">
                                <span class="mr-4" :class="'icon-'+item['icon']"></span>
                                <span>{{item.title}}</span>
                            </span>
                        </button>
                    </div>
                </div>
                <svg 
                    id="svg" ref="svg"
                    width="100%" height="100%"
                    overflow="visible" version="1.1">
                    <rect id="canvas-bg" width="100%" height="100%" fill="#ffffff" x="0" y="0" stroke-width='2'></rect>
                </svg>
            </div>
        </div>
    </div>

    <!-- TOOLS -->
    <div ref="tools" class="p-absolute bd-round p-1 box-shadow bg-white z-1000 transition-3" :style="{left: tools['l'] + 'px', top: tools['t'] + 'px' }">
        <button @click="$draw($event, item, i)" v-for="(item, i) in tools['data']" :key="i" 
            class="btn no-btn btn-block p-3 bd-round text-lg" :class="['icon-'+item['class'], item['class'] == draw['type'] ? 'bg-primary text-white box-shadow' : '']">
        </button>
        <button @click="$templates()" class="btn btn-block bd-round">
            <span class="icon-horizontal-more"></span>
        </button>
    </div>

    <!-- LAYERS -->
    <div class="p-absolute animated zoomIn faster" style="right:10px" :style="{top:(window.h/4) + 'px'}">
        <button @click="$layers()" v-for="(item, i) in right.list" :key="i" :class="'icon-'+item['icon']" class="btn btn-block text-lg p-2 bd-round">
            <span v-if="item.paths">
                <span class="text-lg" v-for="j in item.paths" :key="j" :class="'path'+(j)"></span>
            </span>
            <!-- <span class="text-lg" v-for="(sub, j) in item['paths']" :key="j" :class="sub"></span> -->
        </button>
    </div>

    <!-- ADD -->
    <div class="p-absolute" style="right:25px;bottom:25px">
        <div class="bg-white box-shadow bd-round animated zoomIn faster" v-if="add.show">
            <button @click="$add(item.value)" v-for="(item, i) in add.list" :key="i" :class="'icon-'+item['icon']" class="btn btn-block text-lg p-3 bd-round">
                <span class="text-lg" v-for="(sub, j) in item['paths']" :key="j" :class="sub"></span>
            </button>
        </div>
        <button @click="add.show = !add.show" class="btn text-lg transition-3 mt-3 btn-block text-white p-3 box-shadow bd-round icon-add" :class="add.show ? 'rotate-45 bg-danger' : 'rotate-0 bg-primary'"></button>
    </div>

    <!-- loading  -->
    <button v-if="loading.$" class="btn btn-primary p-2 pl-3 pr-3 animated fadeInUp faster p-absolute z-1300 text-white bd-round box-shadow transition-3" style="left:25px; bottom:25px">
        <span class="spinner-border spinner-border-sm"></span>
        <span class="text-small ml-2">{{loading.msg}}</span>
    </button>

    <!-- CANVAS RESOLUTION -->
    <!-- <div ref="resolution" class="p-absolute">
        <input type="text" style="width:30px" class="bg-none bd-0 text-sm text-center text-primary" v-model="canvas.w">
        <span class="text-sm font-weight-bold">x</span>
        <input type="text" style="width:30px" class="bg-none bd-0 text-sm text-center text-primary" v-model="canvas.h">
    </div> -->
    <!-- CANVAS FULL-SCREEN -->
    <!-- <button ref="full-screen" class="btn p-2 p-absolute text-lg bd-round icon-full-screen"></button> -->
    <!-- CANVAS PROS -->
    <!-- <div ref="canvas-props" class="transition-3 p-absolute">
        <button @click="$canvas(item['icon'])" class="btn btn-block p-2 bd-round text-dark" :class="'icon-'+item['icon']" v-for="(item, i) in canvas.props.list" :key="i"></button>
    </div> -->
    <!-- CANVAS CUSTOMIZATIONS -->
    <!-- <div ref="canvas-customizations" class="transition-3 p-absolute">
        <button class="btn btn-block text-dark bd-round p-2" :class="'icon-'+item['icon']" v-for="(item, i) in canvas.customizations.list" :key="i"></button>
    </div> -->
    <canvas width="1000" height="1000" class="border p-absolute d-none"></canvas>
</div>
</template>

<script>
import vue from 'vue'

import profile from '@/assets/svg/computer.svg'
import w_range from '@/components/widgets/range.vue'
import w_toggle from '@/components/widgets/toggle.vue'
import w_inputValue from '@/components/widgets/input-value.vue'
import w_dropdown from '@/components/widgets/dropdown.vue'
import w_popup_v from '@/components/widgets/popup-vertical.vue'

import c_draw from '@/components/editor-draw.vue'
import c_zoom_overlay from '@/components/editor-zoom-overlay.vue'
import c_templates from '@/components/editor-templates.vue'
import c_layers from '@/components/editor-layers.vue'
import c_code from '@/components/editor-code.vue'
import { SVG } from '@svgdotjs/svg.js'

import JSON_editor from '@/assets/json/editor.json'
import Canvg, { compressSpaces } from 'canvg';
import rotate_ico from '@/assets/svg/rotate.svg'
import rotate_png from '@/assets/png/rotate.png'
let v = null
let c_ID = null

export default {
    components: {
        "w-range": w_range,
        "w-toggle": w_toggle,
        "w-inputValue": w_inputValue,
        "w-dropdown": w_dropdown,
        w_popup_v,
        c_draw,
        c_templates,
        c_code
    },
    data() {
        return {
            add: { list:[], show: false },
            loading: { $: false, msg: ""},
            window: { w: 0, h: 0},
            root: { node: null, w: 0, h: 0, },
            left: { node: null, w: 360, h: 0, data: null, "Text": false, "Size & Rotation": false, "Alignment":false, "Shape": false  },
            right: { node: null, w: 0, h: 0, list: [] },
            top: { node: null, w:0, h: 38 },
            workarea: { node: null, w:0, h:0 },
            tools: { node: null, l:0, t:0, data: null, show: false },
            draw: { $: null, array: [], hasPlots: false, template: null , type: "select", C: null },
            textarea: {node: null, resize: null, fontsize: 50, x: 0, y:0, w:100,h:100},
            control: { type: { "1": null, "2": null, "3": null, "4": null }, cursor: null  }, // 4: RESIZERS, 1: STRECHNESS, 3: END-POINT 2:PATH-TO
            canvas: { node: null, $: null, props: { node:null, list: [], show: false }, customizations: { node:null, list: [] }, w: 800, h: 800, rect: { x:110, y:0 }, resolution: null, full_screen: null },
            ev: { mousedown: false },
            coords: {
                down: {x: 0, y: 0}
            },
            transform: {
                translate: { x:0, y:0 },
                scale: { x:1, y:1 }
            },
            DOMRect: { component: null, canvas: null },
            components: {},
            component: { count: {}, type: ["textarea", "polyline", "polygon", "path", "square", "rectangle", "circle", "ellipse", "pencil", "draw-line"] },
            layers: []
        }
    },
    methods: {
        $dropdown_ev(payload) {
            switch(payload.type) {
                case "Font-Family":
                    this.draw.$.font("family", payload.style.fontFamily)
                    break
                case "Size":
                    this.draw.$.font("size", payload.style.size)
                    break
            }
        },
        async $save() {
            const canvas = document.querySelector('canvas');
            const ctx = canvas.getContext('2d');            
            v = await Canvg.from(ctx, $("#svg-container > svg")[0].outerHTML);
            $(canvas).removeClass("d-none")
            v.start();
            
        },
        $canvas(p) {
            switch(p) {
                case "download":
                    this.$save()
                    break
                case "code":
                    let { html, instance } = this.$component(c_code, { code: this.canvas.node[0].outerHTML})
                    $(document.body).prepend(html)
                    break
            }
        },
        $templates() {
            let { html, instance } = this.$component(c_templates, { w: this.left['w'] })
            instance.$on("$select", (payload) => {
                this.loading.msg = "Please wait while the file is ready"
                this.loading.$ = true
                if(payload.type == "elements") {
                    let file = payload['file_url']
                    setTimeout(() => {
                        $readFile(file, (data) => {
                            // this.draw.$ = SVG($(data)[0]).clone()
                            // this.draw.type = "select"
                            // this.draw.$.addTo(this.canvas.$.node)
                            this.canvas.$.add($(data)[0])
                            this.loading.msg = ""
                            this.loading.$ = false
                        })                        
                    }, 500);
                }
            })
            $(document.body).prepend(html)
        },
        $layers() {
            let { html, instance } = this.$component(c_layers, {components: this.layers })
            this.layers = instance.components
            $(document.body).prepend(html)
        },
        $draw(e, elem, i) {
            this.draw.$ = null
            this.draw.type = elem.class
            if(elem.more) {
                let { html, instance } = this.$component(c_draw, { e, shapes: elem.data })
                instance.$on("$draw", (payload) => {
                    this.tools['data'][i]['class'] = this.draw.type = payload
                    this.draw.type = payload
                })
                $(document.body).prepend(html)
            }
        },
        $add(item) {
            let $this = this
            switch(item) {
                case "image":
                    $uploadFile((img) => {
                        this.draw.$ = this.canvas.$.image(img).size(this.canvas.w/2, this.canvas.h/2)
                    })
                    break
                case "page":
                    break
            }
        },
        $init() {
            this.root.node = $(this.$refs['root'])
            this.left.node = $(this.$refs['left'])
            this.right.node = $(this.$refs['right'])
            this.top.node = $(this.$refs['top'])
            this.tools.node = $(this.$refs['tools'])
            this.canvas.$ = SVG("#svg")
            this.canvas.node = $(this.$refs['svg'])
            this.canvas.props.node = $(this.$refs['canvas-props'])
            this.canvas.customizations.node = $(this.$refs['canvas-customizations'])
            this.canvas.props.list = JSON_editor.canvas['props']
            this.canvas.customizations.list = JSON_editor.canvas['customizations']
            this.canvas.resolution = $(this.$refs['resolution'])
            this.canvas.full_screen = $(this.$refs['full-screen'])
            this.add.list = JSON_editor['add']
            this.right.list = JSON_editor['right']

            this.left.data = JSON_editor['left']
            this.tools.data = JSON_editor['tools']

            this.right.workarea = $(this.$refs['workarea'])

            this.$w_h()
            // this.$templates()
        },
        $init_component(component = this.draw.$, transform) {
            let id =  component.type +"-"+ (this.component.count[component.type] ? this.component.count[component.type] +=1 : this.component.count[component.type] = 1)
            component.attr("id", id)
            this.components[id] = {
                id,
                type: component.type,
                node: component.node,
                w: this.DOMRect.component.width,
                h: this.DOMRect.component.height,
                width: { w:0, $w:0 },
                height: { h:0, $h:0 },
                x: { $x:0, x:0},
                y: { $y:0, y:0},                
                translate: { $x: transform.translate.x, $y: transform.translate.y, x:0, y:0 },
                scale: { $x: transform.scale.x, $y: transform.scale.y, x:1, y:1 },
                scaleX: 1,
                scaleY: 1,
                rotate: {$:0, rotated: 0},
                fontsize: 50,
                text: component.type == "text" ? component.text() : null
            }
            c_ID = id
            this.layers.push(this.components[id])
        },
        $w_h() {
            this.window.w = $(window).width()
            this.window.h = $(window).height()
            this.root['h'] = this.window.h
            this.left['h'] =this.window.h
            this.right['h'] =this.window.h
            this.right['w'] = this.window.w - this.left['w']
            setTimeout(() =>  this.workarea['h'] = this.window.h - this.top.node.outerHeight() - 10 , 1)
            this.$x_y(this.window)
        },
        $x_y({ w, h }) {
            this.tools['l'] = this.left['w'] + 10
            setTimeout(() =>  this.tools['t'] = (h - this.tools.node.outerHeight())/2 , 100)
            setTimeout(() => this.$canvas_properties(), 320);

        },
        $canvas_properties() {
            let DOMRect = this.canvas.node[0].getBoundingClientRect(),
                left = this.canvas.node.offset().left,
                top = this.canvas.node.offset().top
            
            this.canvas.resolution.css({
                left: left,
                top: top - this.canvas.resolution.outerHeight()
            })
            this.canvas.full_screen.css({
                left: left + DOMRect.width - this.canvas.full_screen.outerWidth(),
                top: top  + DOMRect.height - (this.canvas.full_screen.outerHeight())
            })
            this.canvas.props.node.css({
                left: left + DOMRect.width,
                top: DOMRect.top
            })
            this.canvas.customizations.node.css({
                left: left - this.canvas.customizations.node.outerWidth(),
                top: DOMRect.top + (DOMRect.height/2 - this.canvas.customizations.node.outerHeight()/2)
            })

        },
        $component(component, props = null) {
            let ComponentClass = vue.extend(component)
            let instance = new ComponentClass({ propsData: props })
            instance.$mount()
            return {
                html: instance.$el,
                instance
            }
        },
        $m_down(e) {
            if(!$hasParentId(e.target, "svg")) return
            this.ev.mousedown = true
            this.coords.down.x = e.offsetX 
            this.coords.down.y = e.offsetY
            this.DOMRect.canvas = this.canvas.node[0].getBoundingClientRect()
            let { x, y } = this.coords.down
            let pointArray = ["polyline", "path", "polygon"],
                no_styling = ["text", "select", "textarea", "template", "insert-template"],
                DOMRect = null,
                $this = this,
                transform = {
                    translate: { x:0, y:0 },
                    scale: { x:1, y:1 }
                }
            switch(this.draw.type) {
                case "insert-template":
                    this.draw.$ = this.draw.template.clone()
                    this.draw.$.addTo(this.canvas.$.node)
                    transform.translate.x = x
                    transform.translate.y = y
                    transform.scale.x = transform.scale.y = 0
                    this.draw.$.transform({
                        translate: [x, y],
                        scale: [0, 0]
                    })
                    this.DOMRect.component = this.draw.$.node.getBoundingClientRect()
                    this.draw.$.each(function(i, children) {
                        !$this.draw.$.attr("id") ? $this.$init_component($this.draw.$, transform) : ""
                        this.dblclick(function() { $this.$resizers(this.node.parentNode) })
                    })
                    break
                case "select":
                    this.$resizers(e.target)
                    break
                case "rectangle":
                case "square":
                    this.draw.$ = this.canvas.$.rect(5, 5)
                    break
                case "ellipse":
                    this.draw.$ = this.canvas.$.ellipse(5, 5)
                    break
                case "circle":
                    this.draw.$ = this.canvas.$.circle(5)
                    break
                case "draw-line":
                    let A = [0,0], B = [0,0]
                    this.draw.$ = this.canvas.$.line([A, B])
                    break
                case "pencil":
                    this.draw.$ = this.canvas.$.path('M0 0 L 1 1').move(x, y).fill("none")
                    this.draw.array = this.draw.$.array()
                    break
                case "text":
                    x -= this.textarea.fontsize/2
                    y -= this.textarea.fontsize/2
                    this.textarea.node = $("<textarea></textarea>")
                    this.textarea.node.addClass("p-absolute transition-3")
                    this.textarea.node.css({
                        left: e.clientX-(this.textarea.fontsize/2), 
                        top: e.clientY-(this.textarea.fontsize/2),
                        width: this.textarea.w,
                        height: this.textarea.h,
                        fontSize: this.textarea.fontsize,
                        resize: "none",
                        textAlign:"center"
                    })
                    $(document.body).append(this.textarea.node)
                    setTimeout(() => this.textarea.node.focus() , 100)

                    this.textarea.node.keyup(() => {
                        this.draw.$ ? this.draw.$.remove() : ""
                        this.draw.$ = this.canvas.$.text(this.textarea.node.val()).move(x, y).font({ size: this.textarea.fontsize}).opacity(0)
                        DOMRect = this.draw.$.node.getBoundingClientRect()
                        this.textarea.node.css({
                            width: DOMRect.width + this.textarea.w,
                            height: DOMRect.height + this.textarea.h
                        })
                    })
                    this.draw.type = "textarea"
                    break
                case "textarea":
                    this.textarea.node.remove()
                    this.draw.$.opacity(1)
                    break
                case "polyline":
                case "polygon":
                    if(!this.draw.hasPlots) {
                        this.draw.$ = this.draw.type == "polygon" ? this.canvas.$.polygon() : this.canvas.$.polyline()
                        this.draw.$.plot([[0,0], [5,5]]).move(x,y).fill("red")
                        this.draw.array = this.draw.$.array()
                        this.draw.hasPlots = true
                        this.control.type["3"] = this.canvas.$.group()
                    } else {
                        this.draw.array.push([x,y])
                        this.draw.$.plot(this.draw.array)
                    }
                    this.$polygon_controls("endPoint", {points: $lastIndexOf(this.draw.array).val })
                    break
                case "path":
                    if(!this.draw.hasPlots) {
                        this.draw.$ = this.canvas.$.path('M 0,0').move(x, y).fill("red")
                        this.draw.array = this.draw.$.array()
                        this.draw.hasPlots = true                      
                        this.draw.C = null
                        this.control.type["3"] = this.canvas.$.group()
                    } else {
                        this.draw.array.push(this.draw.C)
                        this.draw.$.plot(this.draw.array)
                        this.draw.C = ["C", x,y, x,y, x,y]
                    }
                    this.$path_controls( "endPoint", { points: $lastIndexOf(this.draw.array).val } )
                    break
            }

            if(!no_styling.includes(this.draw.type)) {
                if(pointArray.includes(this.draw.$.type)) {
                    this.draw.$.opacity(0.5).stroke({ color: "black", width: 5})
                } else {
                    this.draw.$.move(x, y).fill("red").stroke({ color: "black", width: 5})
                }
            }
            this.draw.$ ? this.DOMRect.component = this.draw.$.node.getBoundingClientRect() : ""
            this.draw.$ && !this.draw.$.attr("id") ? this.$init_component(this.draw.$, transform) : ""
        },
        $m_move(e) {
            if((!this.ev.mousedown && !this.draw.hasPlots) || !$hasParentId(e.target, "svg")) return 
            let { x, y } = this.coords.down
            let x2 = e.offsetX - x
            let y2 = e.offsetY - y,
                X = e.offsetX,
                Y = e.offsetY,
                w = null,
                gain_w = null, gain_h = null,
                xAxis = null, yAxis = null
            switch(this.draw.type) {
                case "template":
                    this.components[c_ID].scale.$x =  (x2/512) > 1 ? 1: (x2/512)
                    this.components[c_ID].scale.$y =  (y2/512) > 1 ? 1: (y2/512)
                    let {$x, $y } = this.components[c_ID].scale
                    this.draw.$.transform({
                        translate: [ this.components[c_ID].translate.$x, this.components[c_ID].translate.$y],
                        scale: [this.components[c_ID].scale.$x, this.components[c_ID].scale.$y],
                        origin: "top left"
                    })
                    break
                case "rectangle":
                    this.draw.$.size(x2, y2)
                    break
                case "square":
                    let size = x2>y2 ? x2 : y2
                    this.draw.$.size(size, size)
                    break
                case "circle":
                    let radius = x2>y2 ? x2 : y2
                    this.draw.$.radius(radius)
                    break
                case "ellipse":
                    this.draw.$.size(x2*2, y2*2)
                    break
                case "draw-line":
                    $lineTo(this.draw.$, { x2, y2 })
                    break
                case "pencil":
                    $pencilDrawing(this.draw.$, this.draw.array, { x2: X, y2: Y })
                    break
                case "polyline":
                case "polygon":
                    $polyTo(this.draw.$, this.draw.array, { x2: X, y2: Y } )
                    break
                case "path":
                    let array = this.draw.array,
                        last = $lastIndexOf(array),
                        x_pos = x+x2, y_pos = y+y2,
                        x_neg = x-x2, y_neg = y-y2

                    if(this.ev.mousedown) {
                        this.draw.C = ["C", x_pos, y_pos, x_neg,y_neg, X, Y]
                        if(last.val[0] == "C") {
                            array[last.i][3] = x_neg
                            array[last.i][4] = y_neg
                            this.draw.$.plot(array)
                        }
                        this.$path_controls( "stretch", { points: [x_pos,y_pos, x,y, x_neg,y_neg] } )
                    } else {
                        this.draw.C = this.draw.C ? ["C", this.draw.C[1],this.draw.C[2], X,Y, X,Y] : ["C", x,y, X,Y, X,Y]
                        this.$path_controls( "pathTo", { points: this.draw.C, start: {x, y} } )
                    }
                    break

            }
            if(this.draw.type == "select") {
                switch(this.draw.$.type) {
                    case "text":
                    case "g":
                        switch(this.control.cursor) {
                            case "se-resize":
                            case "ne-resize":
                                switch(this.draw.$.type) {
                                    case "text":
                                        this.draw.$.font({size: this.components[c_ID].fontsize + x2*0.50/Math.abs(this.components[c_ID].scale.x)})
                                        break
                                    case "g":
                                        this.components[c_ID].scale.$x = this.components[c_ID].scale.x + (x2/512)
                                        this.components[c_ID].scale.$y = this.components[c_ID].scale.y + (y2/512)
                                        break
                                }
                                break
                            case "sw-resize":
                            case "nw-resize":
                                switch(this.draw.$.type) {
                                    case "text":
                                        xAxis = this.draw.$.x()
                                        w = this.DOMRect.component.width
                                        this.draw.$.font({size: this.components[c_ID].fontsize - x2*0.50/Math.abs(this.components[c_ID].scale.x)})
                                        gain_w = this.draw.$.node.getBoundingClientRect().width-w
                                        this.draw.$.x(xAxis-gain_w)
                                        break
                                    case "g":
                                        break
                                }
                                break
                            case "s-resize":
                                this.components[c_ID].scale.$y = this.components[c_ID].scale.y + y2/512
                                break
                            case "n-resize":
                                this.components[c_ID].scale.$y = this.components[c_ID].scale.y - y2/512
                                break
                            case "e-resize":
                                this.components[c_ID].scale.$x = this.components[c_ID].scale.x + x2/512
                                break
                            case "w-resize":
                                this.components[c_ID].scale.$x = this.components[c_ID].scale.x - x2/512
                                break
                            case "move":
                                this.components[c_ID].translate.$x = this.components[c_ID].translate.x + x2
                                this.components[c_ID].translate.$y = this.components[c_ID].translate.y + y2
                                break
                            case "rotate":                                
                                this.components[c_ID].rotate.$ = this.components[c_ID].rotate.rotated + $angle(e, this.DOMRect.component)
                                break
                        }
                        break
                    case "rect":
                    case "path":
                    case "polyline":
                    case "polygon":
                    case "line":
                    case "circle":
                    case "ellipse":
                    case "image":
                        this.components[c_ID].width.$w = this.components[c_ID].width.w + x2
                        this.components[c_ID].height.$h = this.components[c_ID].height.h + y2
                        this.components[c_ID].x.$x = this.components[c_ID].x.x + x2
                        this.components[c_ID].y.$y = this.components[c_ID].y.y + y2
                        gain_w = -x2
                        gain_h = -y2
                        switch(this.control.cursor) {
                            case "se-resize":
                                this.draw.$.width(this.components[c_ID].width.$w)
                                this.draw.$.height(this.components[c_ID].height.$h)
                                break
                            case "e-resize":
                                this.draw.$.width(this.components[c_ID].width.$w)
                                break
                            case "s-resize":
                                this.draw.$.height(this.components[c_ID].height.$h)
                                break
                            case "w-resize":
                                this.draw.$.x(this.components[c_ID].x.x - gain_w)
                                this.draw.$.width(this.components[c_ID].width.$w + 2*gain_w)
                                break
                            case "nw-resize":
                                this.draw.$.x(this.components[c_ID].x.x - gain_w)
                                this.draw.$.y(this.components[c_ID].y.y - gain_h)
                                this.draw.$.width(this.components[c_ID].width.$w + 2*gain_w)
                                this.draw.$.height(this.components[c_ID].height.$h + 2*gain_h)
                                break
                            case "sw-resize":
                                this.draw.$.x(this.components[c_ID].x.x - gain_w)
                                this.draw.$.width(this.components[c_ID].width.$w + 2*gain_w)
                                this.draw.$.height(this.components[c_ID].height.$h)
                                break
                            case "n-resize":
                                this.draw.$.y(this.components[c_ID].y.y - gain_h)
                                this.draw.$.height(this.components[c_ID].height.$h + 2*gain_h)
                                break
                            case "ne-resize":
                                this.draw.$.y(this.components[c_ID].y.y - gain_h)
                                this.draw.$.width(this.components[c_ID].width.$w)
                                this.draw.$.height(this.components[c_ID].height.$h + 2*gain_h)
                                break
                            case "move":
                                this.draw.$.x(this.components[c_ID].x.$x)
                                this.draw.$.y(this.components[c_ID].y.$y)
                                break
                            case "rotate":
                                this.components[c_ID].rotate.$ = this.components[c_ID].rotate.rotated + $angle(e, this.DOMRect.component)
                                break
                        }
                        break
                }
                this.draw.$.transform({
                    scale: [this.components[c_ID].scale.$x, this.components[c_ID].scale.$y],
                    translate: [this.components[c_ID].translate.$x, this.components[c_ID].translate.$y],
                    rotate: this.components[c_ID].rotate.$,                    
                    origin: "center center"
                })
                this.$resizers(this.draw.$.node)

            }
        },
        $m_up(e) {
            this.ev.mousedown = false
            this.control.cursor = null         
            // !this.draw.hasPlots && this.draw.type !== "textarea" ? this.draw.type = "select" : ""
            // this.draw.$ ? this.$resizers(this.draw.$.node) : ""
            if(this.draw.$ && this.components[c_ID]) {
                this.components[c_ID].scale.x = this.components[c_ID].scale.$x
                this.components[c_ID].scale.y = this.components[c_ID].scale.$y
                this.components[c_ID].translate.x = this.components[c_ID].translate.$x
                this.components[c_ID].translate.y = this.components[c_ID].translate.$y
                this.components[c_ID].rotate.rotated = this.components[c_ID].rotate.$
                this.components[c_ID].fontsize = this.draw.$.font('size')
                this.components[c_ID].width.w = this.draw.$.width()
                this.components[c_ID].height.h = this.draw.$.height()
                this.components[c_ID].x.x = this.draw.$.x()
                this.components[c_ID].y.y = this.draw.$.y()
            }
        },
        $key_up(e) {
            console.log(e.keyCode)
            switch(e.keyCode) {
                case 46:
                    this.draw.$.remove()
                    this.control["4"].remove()
                    break
                case 27: // ESCAPE KEY
                    switch(this.draw.type) {
                        case "path":
                            this.$path_controls("remove", {})
                            break
                    }
                    this.draw.hasPlots = false
                    this.draw.$ ? this.draw.$.opacity(1) : ""
                    break
            }
        },
        $dbl_click(e) {            
            switch(this.draw.type) {
                case "path":
                    this.$path_controls("remove", {})
                    break
                case "select":
                    e.target.parentNode.tagName == "g" && $(e.target.parentNode).attr("type") !== "controls" ? e.target = e.target.parentNode : ""
                    this.$resizers(e.target)
                    break
            }
            this.draw.hasPlots = false
            // this.draw.$.opacity(1)
        },
        $ctrl_point_grip() {
            this.controls ? this.controls.remove() : ''            
            this.controls = this.canvas.$.group()
            let counter = 0
            let colors = ["pink", "green", "blue", "orange"]
            for(let i=0; i<this.draw.array.length; i++) {
                counter = 0
                for(let j=1; j<this.draw.array[i].length; j+=2) {
                    let c = this.canvas.$.circle(10+(counter*2)).fill("none").move(this.draw.array[i][j], this.draw.array[i][j+1])
                    c.stroke({
                        color: colors[counter]
                    })
                    counter++
                    this.controls.add(c)
                }
            }
        },    
        // RESIZERS
        $resizers(elem) {
            if($(elem.parentNode).attr("type") == "controls") return
            if($(elem).attr("id") == "canvas-bg") {
                if(this.control["4"]) 
                    this.control["4"].remove()                
                return
            }
            elem.tagName == "tspan" ? elem = elem.parentNode : ""

            this.DOMRect.component = elem.getBoundingClientRect()
            this.draw.$ = SVG(elem)
            this.draw.$.attr("cursor", "move")
            this.control["4"] ? this.control["4"].remove() : ""
            this.control["4"] = this.canvas.$.group()
            this.control["4"].attr("type", "controls")
            let x = this.DOMRect.component.x - this.DOMRect.canvas.x,
                y = this.DOMRect.component.y - this.DOMRect.canvas.y,
                w = this.DOMRect.component.width,
                h = this.DOMRect.component.height,
                r = 8,
                c = null,
                $this = this,
                gap = 10,
                z = [
                    { x: x-gap-r/2, y: y-gap-r/2, cursor: "nw-resize" },
                    { x: (x+ (x+w))/2, y: y-gap-r/2, cursor: "n-resize" },
                    { x: x+w, y: y-gap-r/2, cursor: "ne-resize" },
                    { x: x+w, y: (y+ (y+h))/2, cursor: "e-resize" },
                    { x: x+w, y: y+h, cursor: "se-resize" },
                    { x: (x+ (x+w))/2, y: y+h, cursor: "s-resize" },
                    { x: x-gap-r/2, y: y+h, cursor: "sw-resize" },
                    { x: x-gap-r/2, y: (y+ (y+h))/2, cursor: "w-resize" },
                    { x: (x + (x+w))/2, y: y-gap*4, cursor: "move"}
                ],
                rect = this.canvas.$.rect(0,0)
                            .fill("none")
                            .stroke({ color: "#22C", dasharray: [5,5], width: 2 })
                            .attr({ x: x-gap, y: y-gap, width: w+gap+(gap/2), height:h+gap+(gap/2), cursor: "move" }),
                line = this.canvas.$.line([ [z[1].x+r/2,z[1].y], [z[8].x+r/2,z[8].y] ]).fill("red").stroke({color: "blue"}),
                rotate = this.canvas.$.image(rotate_ico).move(z[5].x-gap/2, z[5].y + gap*2).size(gap*2, gap*2).attr({ cursor: `url(${rotate_png}) 10 10, auto`})

            this.control["4"].add(rect)
            this.control["4"].add(line)
            this.control["4"].add(rotate)

            rotate.mousedown(function() { $this.control.cursor = "rotate" })
            rect.mousedown(function() { $this.control.cursor = "move" })
            this.draw.$.mousedown(function() { $this.control.cursor = "move" })

            for(let i=0; i<z.length; i++) {
                c = this.canvas.$.circle(r).fill("#22C").move(z[i].x, z[i].y).attr({cursor: z[i].cursor})
                c.mousedown(function() { $this.control.cursor = this.attr("cursor") })
                this.control["4"].add(c)
            }
            c.fill("#00ffff").stroke({ color: "#22C", width:2})
            this.control["4"].front()
            // this.draw.$.node.parentNode.tagName !== "g" ? this.draw.$.front() : ""
            c_ID = this.draw.$.attr("id")
        },

        // CONTROLS...
        $path_controls(type, props) {
            let { points, start } = props
            switch(type) {
                case "stretch":
                    this.control.type["1"] ? this.control.type["1"].remove() : ""
                    this.control.type["1"] = $pathStretchness(this.canvas.$, points)
                    break
                case "pathTo":
                    this.control.type["2"] ? this.control.type["2"].remove() : ""
                    this.control.type["2"] = $pathTo(this.canvas.$, points, { x: start.x, y: start.y } )
                    break
                case "endPoint":
                    this.control.type["3"].add($pathEndpoint(this.canvas.$, points))
                    break
                case "remove":
                    this.control.type["1"] ? this.control.type["1"].remove() : ""
                    this.control.type["2"] ? this.control.type["2"].remove() : ""
                    this.draw.$.opacity(1)
                    break
            }
        },
        $polygon_controls(type, props) {
            let { points } = props
            switch(type) {
                case "endPoint":
                    this.control.type["3"].add($polygonEndpoint(this.canvas.$, points))
                    break
            }
        }
    },
    mounted() {
        // this.$nextTick(() => )
        $(window).resize(() => this.$w_h())
        $(window).mousedown((e) => this.$m_down(e))
        $(window).mousemove((e) => this.$m_move(e))
        $(window).mouseup((e) => this.$m_up(e))
        $(window).keyup((e) => this.$key_up(e))
        $(window).dblclick((e) => this.$dbl_click(e))
        window.onload = () => {
            this.$init()     
        }

    }
}
</script>

<style>
.active-elem {
    background-color:rgba(0, 123, 255, 1) !important;
    color:rgb(0, 123, 255) !important;
    color: white !important
}
.z-1300 {
    z-index: 1300;
}
.rotate-90 {
    transform: rotate(90deg) !important;
}
.rotate-0 {
    transform: rotate(0deg) !important;
}
.rotate-45 {
    transform: rotate(135deg) !important;
}
#root * {
   -webkit-user-select: none;
   -moz-user-select: none;
   -ms-user-select: none;
   user-select: none;
}
</style>