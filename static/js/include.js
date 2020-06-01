function $get_window_based_height(top_elem) {
    return ($(window).height() - top_elem.outerHeight())
}
function $gcd(a, b) {
    return (b == 0) ? a : gcd (b, a%b);
}
async function $aspect_ratio({width, height}) {
    let r = await $gcd(width, height)
    return {
        x: width/r,
        y: height/r
    }
}
function $neg_w_h({ w, h, x, y}) {
    if(w < 0) {
        x += w
        w *= -1
    }
    if(h < 0) {
        y += h
        h *= -1
    }
    return { w, h, x, y}
}
function $lastIndexOf(arr) {
    return {
        i: arr.length - 1,
        val: arr[arr.length - 1]
    }
}
function $indexOf(arr, index) {
    return {
        i: index,
        val: arr[index]
    }
}
function $remove_last_index(arr) {
    arr.splice(arr.length-1, 1)
}
function $distance(a1, a2) {
    let x = { x1: a1[1], x2: a1[2] },
        y = { y1: a2[1], y2: a2[2] }
    return Math.sqrt(Math.pow(x.x1 - y.y1, 2) + Math.pow(x.x2 - y.y2, 2) )
}
function $get_index(arr, index) {
    return {
        index,
        value: arr[index]
    }
}

function $radToDeg(radians)
{
  var pi = Math.PI;
  return radians * (180/pi);
}
function $angle(e, box) {
    var boxCenter=[box.x + box.width/2, box.y + box.height/2];
    var angle = Math.atan2(e.pageX - boxCenter[0], - (e.pageY - boxCenter[1]) )*(180/Math.PI) + 180
    return Math.round(angle)
}
function $hasParentId(elem, id) {
    try {
        if ($(elem).attr("id") == id) return true;
        return elem.parentNode && this.$hasParentId(elem.parentNode, id);
    }
    catch(err) {
        return false
    }
}
function $hasParentTag(elem, tag) {
    try {
        if (elem.tagName == tag) return elem;
        return elem.parentNode && this.$hasParentTag(elem.parentNode, tag);
    }
    catch(err) {
        return false
    }    
}
function $parent(elem, tag) {
    try {
        if (elem.tagName == tag) return elem;
        return elem.parentNode && this.$parent(elem.parentNode, tag);
    }
    catch(err) {
        return false
    }    

}
function $children({ child, parent_tag }) {
    try {
        if (child.tagName == parent_tag) return $(child).find("*");
        return child.parentNode && this.$children({ child: child.parentNode, parent_tag } );
    }
    catch(err) {
        return false
    }    

}
function $datetime() {
    // For todays date;
    Date.prototype.today = function () { 
        return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
    }
    // For the time now
    Date.prototype.timeNow = function () {
        return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
    }        
    var datetime = new Date().today() + " @ " + new Date().timeNow();
    return datetime
    
}
async function $readFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    await rawFile.open("GET",file,false);
    rawFile.onreadystatechange = function() {
        if(rawFile.readyState === 4) {
            if(rawFile.status === 200 || rawFile.status === 0)
            {
                callback(rawFile.responseText)
            }
        }
    }
    rawFile.send(null);                
}
function $lineTo(ref, { x2, y2 }) {
    let points = ref.array(),
        A = points[0],
        B = [points[0][0] + x2, points[0][1] + y2]
    ref.plot([A, B])
}
function $pencilDrawing(ref, array, {x2, y2}) {
    let { val } = $lastIndexOf(array)
    let p1 = val,
        p2 = ["L", x2, y2]
    if($distance(p1, p2) > 5) {
        array.push(p2)
        ref.plot(array)
    }
}
function $polyTo(ref, array, { x2, y2 }) {
    let { i } = $lastIndexOf(array)
    array[i] = [x2, y2]
    ref.plot(array)    
}

function $pathStretchness(SVG, array) {
    let g = SVG.group(),
        line = SVG.line([ [array[0],array[1]], [array[4],array[5]] ]).stroke({ color: "black", width: 1}),
        j = 0,
        colors = [
        { fill: "#EEE", stroke: "#55F"},
        { fill: "#0FF", stroke: "#0FF"},
        { fill: "#0FF", stroke: "#00F"},
    ]
    g.add(line)
    for(let i=0; i<array.length; i+=2) {
        let c = SVG.circle(8).fill(colors[j].fill).move(array[i]-4, array[i+1]-4)
        c.stroke({
            color: colors[j++].stroke,
        })
        g.add(c)
    }
    return g
}
function $pathTo(SVG, array, start) {
    let { x, y } = start
    let d = SVG.path().fill("none").stroke({color: "black", width: 1})
    d.plot([ ["M",x,y], array ] )
    return d
}
function $pathEndpoint(SVG, array) {
    let { i } = $lastIndexOf(array)
    let c = SVG.circle(8).fill("#0FF")
    .move( array[i-1]-4, array[i]-4)
    .stroke({ color: "#00F", width: 2 })
    .attr({ cursor: "move" })
    return c
}
function $polygonEndpoint(SVG, array) {
    let c = SVG.circle(8).fill("#0FF")
    .move( array[0]-4, array[1]-4)
    .stroke({ color: "#00F", width: 2 })
    .attr({ cursor: "move" })
    return c
}

function $textResize(direction, { node, mouseX, fontsize, canvas }) {
    let DOMRect = {
        elem: node.getBoundingClientRect(),
        canvas: canvas.getBoundingClientRect()
    },
        width = DOMRect.elem.width,
        cursor = (mouseX - (DOMRect.elem.x - DOMRect.canvas.x)),
        d = width - cursor,
        c = 0
    while(d<-5 || d>5) {
        if(c > 500) break
        d>5 ? fontsize-- : d<5 ? fontsize++ : ""

        width = DOMRect.elem.width
        cursor = (mouseX - (DOMRect.elem.x - DOMRect.canvas.x))
        d = width - cursor
        node.font({ size: fontsize})     
        c++
    }                 
}

function $uploadFile(callback) {
    let input = $("<input>")
    input.attr("type", "file")
    $(document.body).append(input)
    input.addClass("display-none")
    input.click()
    input.change(function(e) {
        if (this.files && this.files[0]) {
            var reader = new FileReader();        
            reader.onload = function(e) {
                input.remove()
                callback(e.target.result)
            }                
            reader.readAsDataURL(this.files[0]);
        }        
    })
}
// from data url
function $img_wh(src, callback) {
    let img = new Image();
    img.src = src;
    img.onload = () =>
    {
        callback({
            width: img.width,
            height: img.height
        })
    }
}
function $validateSVG(svg, id) {
    svg = $("<svg " + svg.split("<svg ")[1])
    svg.attr('template-id', id)
    console.log(svg, 'svg')
    svg.removeAttr("id x y width height")
    // svg.wrapInner("<g></g>")
    return svg[0]
}