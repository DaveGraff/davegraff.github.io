<script setup lang="ts">
import Background from '../components/Background.vue'
</script>

<template>
    <Background />

    <h1>Hi, I'm Dave.</h1>

    <div class="card">
        <p>
            I've worked as a software engineer since 2020 in financial and medical systems.
        </p>
        <p>
            In my free time I enjoy spending time in nature, reading, and staying active
        </p>
        <p>
            I mainly work full-stack with Vue/django, but I've also dabbled with infrastructure and AI (of course).
            I'm always up to try something new
        </p>
    </div>
</template>
<style lang="css" scoped>
.card p {
    font-weight: bold;
    font-size: 1.2em;
}
</style>