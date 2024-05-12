<template>
    <iframe :srcdoc="htmlData" frameborder="0" width="100%" height="100%" class="h-screen"></iframe>
</template>

<script>
export default {
    props: {
        htmlData: {
            type: String,
            required: true
        }
    }
}
</script>


<style >

</style>