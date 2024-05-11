<script>
import { BASE_URL } from '../conts';
import axios from "axios";
export default {
    data() {
        return {
            imageUploaded: false,
            loading: false,
            message: '',
        };
    },
    methods: {
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.imageUploaded = true;
            }
        },
        async sendData() {
            try {
                if (!this.imageUploaded) {
                    return;
                }
                this.loading = true;
                const formData = new FormData();
                formData.append('image', document.getElementById('file-upload').files[0]);
                formData.append('message', this.message);

                const response = await axios.post(`${BASE_URL}api/generate`, formData);

                console.log(response.data);

                this.message = '';
                this.imageUploaded = false;
                this.loading = false;
            } 
            catch (error) {
                console.error('Error:', error);
                this.loading = false;
            }
        }
    }
}
</script>


<template>
    <div class="flex flex-col flex-auto h-full p-6">
        <div class="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
            <div class="flex flex-col h-full overflow-x-auto mb-4">
                <div class="flex flex-col h-full">
                    <div class="grid grid-cols-12 gap-y-2">
                        <div v-if="!loading" class="col-span-12 flex justify-center items-center h-full mt-44">
                            <label for="file-upload"
                                class="flex items-center justify-center px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-white cursor-pointer shadow-md">
                                <i class="fa-solid fa-cloud-arrow-up mr-2"></i>
                                <span>Upload a Screenshot of UI</span>
                            </label>
                            <input id="file-upload" type="file" class="hidden" @change="handleFileUpload"/>
                        </div>   
                        <div v-else class="col-span-12 flex items-center justify-center h-full">
                            <img class="flex items-center justify-center w-80" src="/images/loading.gif" alt="Loading">
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
                <div class="flex-grow">
                    <div class="relative w-full">
                        <input type="text"
                            class="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10" v-model="message"/>
                        <button
                            class="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                                </path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="ml-4">
                    <button class="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0" :class="!imageUploaded || loading ? 'disabled' : ''" @click="sendData">
                        <span v-if="!loading">Send<i class="fa-regular fa-paper-plane ml-2"></i></span>
                        <span v-else>Loading<i class="fa-solid fa-cog fa-spin ml-2"></i></span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>


<style>
.disabled {
    pointer-events: none;
    opacity: 0.7;
}
</style>