<script>
import { BASE_URL } from '../conts';
import axios from "axios";
import Preview from './Preview.vue'


export default {
    components: { Preview },
    data() {
        return {
            imageUploaded: false,
            loading: false,
            message: '',
            responseData: null,
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

                this.responseData = response.data.data;
                this.message = '';
                this.imageUploaded = false;
                this.loading = false;
            } 
            catch (error) {
                console.error('Error:', error);
                this.loading = false;
            }
        },
        copyHtmlCode() {
            const textarea = document.createElement('textarea');
            textarea.value = this.responseData;

            textarea.style.position = 'fixed';
            textarea.style.top = '0';
            textarea.style.left = '0';
            textarea.style.opacity = '0';

            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('HTML code copied to clipboard!');
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
                        <div v-if="responseData" class="col-span-12 flex justify-center items-center">
                            <Preview :htmlData="responseData"></Preview>
                        </div>
                        <div v-else-if="!loading" class="col-span-12 flex justify-center items-center h-full mt-44">
                            <label for="file-upload"
                                class="flex items-center justify-center px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-white cursor-pointer shadow-md" :class="imageUploaded ? 'disabled' : ''">
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
                    </div>
                </div>
                <div class="ml-4">
                    <button class="items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0" :class="!imageUploaded || loading ? 'disabled' : ''" @click="sendData">
                        <span v-if="!loading">Send<i class="fa-regular fa-paper-plane ml-2"></i></span>
                        <span v-else>Loading<i class="fa-solid fa-cog fa-spin ml-2"></i></span>
                    </button>
                    <button v-if="responseData" class="items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0 ml-2" @click="copyHtmlCode">
                        <span><i class="fa-solid fa-code"></i></span>
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