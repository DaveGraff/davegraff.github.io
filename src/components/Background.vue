<template>
  <div id="full-screen">
    <div 
      v-if="!imageLoaded"
      class="placeholder"
    />
    <img
      ref="imageRef"
      :src="imageSrc"
      :style="{ 
        opacity: imageLoaded ? 1 : 0,
        transition: skipFade ? 'none' : 'opacity 2s ease-in-out'
      }"
      alt="Background"
      @load="onImageLoad"
    >
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const imageRef = ref<HTMLImageElement>()
const imageLoaded = ref(false)
const imageSrc = ref('')
const observer = ref<IntersectionObserver>()
const skipFade = ref(false)

const onImageLoad = () => {
  imageLoaded.value = true
}

const loadImage = () => {
  // Check if image is already cached by timing the load
  const startTime = performance.now()
  const img = new Image()
  
  img.onload = () => {
    const loadTime = performance.now() - startTime
    // If load time is very short (< 50ms), it's likely cached
    if (loadTime < 50) {
      skipFade.value = true
      imageLoaded.value = true
    }
    imageSrc.value = '/background.jpg'
  }
  
  img.onerror = () => {
    imageSrc.value = '/background.jpg'
  }
  
  img.src = '/background.jpg'
}

onMounted(() => {
  // Set up intersection observer for lazy loading
  observer.value = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        loadImage()
        observer.value?.disconnect()
      }
    },
    { threshold: 0.1 }
  )
  
  observer.value.observe(imageRef.value!)
})

onUnmounted(() => {
  observer.value?.disconnect()
})
</script>

<style scoped>
#full-screen {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
}

.placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  background-size: cover;
  background-position: center;
}

img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: opacity 2s ease-in-out;
}
</style>
