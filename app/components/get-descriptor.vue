<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { descriptors } from './descriptors'

const state = reactive({
  email: ''
})

const descriptor = ref('')

const isDescriptorEmpty = computed(() => descriptor.value === '')

async function onSubmit() {
  if (!state.email) {
    return;
  }
  const descriptorList = descriptors
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(state.email))
  const dataView = new DataView(digest.slice(-8))
  const randomValue = dataView.getBigUint64(0, true)
  const index = Number(randomValue % BigInt(descriptorList.length))
  descriptor.value = descriptorList[index]
}
</script>

<template>
  <div v-if="isDescriptorEmpty" class="flex justify-center">
    <div class="w-1/2">
      <UForm class="space-y-4" :state="state" @submit="onSubmit">
        <UFormField label="Email" description="Digite seu e-mail para ver o seu descriptor que será usado no workshop:">
          <UInput placeholder="Digite seu e-mail aqui" class="w-full" v-model="state.email"/>
        </UFormField>
        <UButton type="submit">
          Ok
        </UButton>
      </UForm>
    </div>
  </div>
  <ProsePre v-else>
    <code>
      {{ descriptor }}
    </code>
  </ProsePre>
</template>

<style scoped>

</style>
