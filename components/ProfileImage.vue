<template>
    <div>
         <div class="opacity-0 absolute w-full h-full z-10 top-0 left-0">
          <input @change="_uploadImage" class="opacity-0 absolute w-full h-24 z-10" type="file">
        </div>
    </div>
</template>

<script setup>

const emit=defineEmits(['save']);
const isOpen = ref(false);
const img = ref(null);
const _uploadImage = (e) => {
const file = e.target.files[0];
// const reader = new FileReader();
// reader.onload = (e) => {
//   img.value = e.target.result;
// }
// reader.readAsDataURL(file);
 // Add the file directly to FormData

// useApi('/v1/user/info', {
//     method: 'PATCH',
//     body: data // Send FormData directly as the request body
// }).then((response) => {
//     img.value = response.photo; // Update the image URL
//     isOpen.value = true;
// });
// open modal to view and save image

}
const save = () => {
emit('save',img.value); // Emit event to save the image
img.value = null; // Reset image
isOpen.value = false;
}
</script>

<style lang="scss" scoped>

</style>