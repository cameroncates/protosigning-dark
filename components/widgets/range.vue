<template>
    <div style="width:150px">
        <p class="w-100 text-sm pb-1 m-0">{{title}} <span v-if="dropdown" class="btn text-sm p-0 m-0">&#9207;</span></p>
        <div class="d-flex bg-light-2 bd-round">
            <button class="btn material-icons text-primary p-0 text-md scale-6">trip_origin</button>
        </div>
    </div>
  
</template>

<script>
export default {
    props: {
        title: {
            required: true
        },
        dropdown: {
            required: false
        }
    },
    mounted() {
        console.log(this.dropdown, this.title)
    }
}
</script>

<style>

</style>