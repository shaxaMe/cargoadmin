<template>
    <div>
         <div class="opacity-0 absolute w-full h-full z-10 top-0 left-0">
          <input @change="_uploadImage" ref="imgInput" class="opacity-0 absolute w-full h-24 z-10" type="file">
        </div>
        <Modal v-model="isOpen" maxWidth="500px" @_save="save">
           <div class="w-full">
                <img :src="img" alt="al">
           </div>
        </Modal>
    </div>
</template>

<script setup>

const emit=defineEmits(['save']);
const isOpen = ref(false);
const imgInput = ref(null);
const img = ref(null);
const _uploadImage = (e) => {
const file = e.target.files[0];
const reader = new FileReader();
reader.onload = (e) => {
  img.value = e.target.result;
}
reader.readAsDataURL(file);// Add the file directly to FormData
isOpen.value = true;


// open modal to view and save image

}
const save = () => {
    let data = new FormData();
    data.append('photo', imgInput.value.files[0]); // Add the image to FormData
    useApi('/v1/user/info', {
    method: 'PATCH',
    body: data // Send FormData directly as the request body
}).then((response) => {
    img.value = response.photo; // Update the image URL
    emit('save',img.value); // Emit event to save the image
    // img.value = null; // Reset image
    isOpen.value = false;
});

}
</script>

<style lang="scss" scoped>

</style>