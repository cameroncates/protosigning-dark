<template>
    <div class="container-fluid justify-content-center d-flex" id="edit-component-container" ref="edit-container" v-if="visible">
        <div class="align-self-center p-2 bg-light row w-25" id="edit-component">
            <button class="col-md-12 text-right mt-2" @click="visible=false"><span class="icon-close"></span></button>
            <h6 class="col-md-12 mb-5">currently linked to : <strong class="text-primary">{{href}}</strong></h6>
            <h5 class="col-md-12 mb-0">Change Link</h5>
            <p class="col-md-12 mb-3"><strong>Note:</strong> When the user clicks on this button, it will redirect to the page you select from below</p>
            <select name="cars" class="col-md-12 custom-select mb-3" @change="linked($event)">
                <option selected disabled>Select Page to Link</option>
                <option 
                v-for="(item, i) in pages"
                :value="item.title"
                :key="i">{{item.title}}</option>
            </select>
        </div>
    </div>        

  
</template>

<script>
export default {
    props: {
        e: {
            required: true
        },
        pages: {
            required: true
        }
    },
    data() {
        return {
            href: null,
            visible: true
        }
    },
    methods: {
        linked(e) {
            let val = $(e.target).val().split(" ").join("_")
            $(this.e.target).attr("link-to", val)
            this.href = val + ".html" 
            // console.log()
        }
        
    },
    mounted() {
        this.href = $(this.e.target).attr("link-to")
    }
}
</script>

<style>
</style>