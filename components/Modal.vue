<script setup>
import Dialog from "primevue/dialog";

const props = defineProps(['modelValue','maxWidth','loading','title']);
const emit = defineEmits(['update:modelValue','_save']);

const visible = ref(false);

const btnLoad = computed(()=>{
  return props.loading;
})

function _close() {
  // visible.value = false;
  emit('_close');
}
function save() {
  // visible.value = false;
  emit('_save');
}
watch(()=>props.modelValue, () => {
    visible.value = props.modelValue;
})

watch(() => visible.value, (visible) => {
    emit('update:modelValue', visible);
})
</script>
<template>
  <div>
    <Dialog
      v-model:visible="visible"
      modal
      :header="props.title??`Transport qo’shish`"
      class="max-lg:!w-[90dvw]"
      :style="{ width: maxWidth?maxWidth:'70dvw' }"
    >
     <slot></slot>
      <div class="flex justify-end gap-2 mt-10 max-md:flex-col">
        <Button
          type="button"
          label="Bekor qilish"
          severity="secondary"
          @click="_close"
        ></Button>
        <Button type="button" @click="save" class="max-md:-order-1"><Icon v-if="!!btnLoad" name="line-md:loading-twotone-loop" /> Saqlash</Button>
      </div>
    </Dialog>
  </div>
</template>
<style lang="scss"></style>
