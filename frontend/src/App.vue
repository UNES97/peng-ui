<script>
import Chat from './components/Chat.vue'
import Sidebar from './components/Sidebar.vue'

export default {
    components: { Chat, Sidebar }
}
</script>


<template>
    <div class="flex h-screen antialiased text-gray-800">
        <div class="flex flex-row h-full w-full overflow-x-hidden">
            <Sidebar></Sidebar>
            <Chat></Chat>
        </div>
    </div>
</template>

<style>
</style>