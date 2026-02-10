<template>
  <div id="background" />
  <div class="whole-content">
    <div class="stats">
      <h2>Your Stats</h2>
      <span>Car: {{ car }}</span>
      <span>Hotness: {{ hotness }}</span>
      <span>Wins: {{ wins }}</span>
    </div>
    <div>
      <div v-if="gameState === GameState.Searching">
        <h2>You are a cool young lesbian with a mean streak and a love for cars</h2>
        <button @click="gameState = GameState.Found">
          Go looking for lesbians
        </button>
      </div>
      <div v-else-if="gameState === GameState.Found">
        <h2>You found a lesbian!</h2>
        <div class="multibutton">
          <button @click="battle(BattleType.HotBattle)">
            Challenge her to a makeout battle
          </button>
          <button @click="battle(BattleType.CarBattle)">
            Challenge her to a car race
          </button>
        </div>
      </div>
      <div v-else-if="gameState === GameState.Victory">
        <h2>Victory!</h2>
        <h3>{{ victoryMessage }}</h3>
        <button @click="restart()">
          Play again
        </button>
      </div>
      <div v-else-if="gameState === GameState.Defeat">
        <h2>Defeat!</h2>
        <h3>{{ defeatMessage }}</h3>
        <button @click="restart(true)">
          Start Over...
        </button>
      </div>
    </div>
  </div>
  <div class="audio-controls">
    <div>
      <span
        v-if="isAudioPlaying"
        class="pi pi-volume-up"
        @click="toggleAudio"
      />
      <span
        v-else
        class="pi pi-volume-off"
        @click="toggleAudio"
      />
    </div>
    <span>Music by <a href="https://pixabay.com/music/techno-trance-heavy-german-techno-beat-dark-industrial-instrumental-403003/">nickpanek</a></span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import theme from '@/assets/cars-theme.mp3'

const GameState = {
    Searching: 0,
    Found: 1,
    HotBattle: 2,
    CarBattle: 3,
    Victory: 4,
    Defeat: 5
}

const BattleType = {
    HotBattle: 0,
    CarBattle: 1
}

const getStat = () => {
    return Math.floor(Math.random() * 6)+1;
}

const car = ref(getStat());
const hotness = ref(getStat());
const wins = ref(0);
const gameState = ref(GameState.Searching);
const victoryMessage = ref('');
const defeatMessage = ref('');
const audio = ref(new Audio(theme));
const isAudioPlaying = ref(false);

const toggleAudio = () => {
    if (isAudioPlaying.value) {
        stopAudio();
    } else {
        startAudio();
    }
}
const startAudio = () => {
    audio.value.loop = true;
    isAudioPlaying.value = true;
    audio.value.play().catch(error => {
        console.log('Audio autoplay was prevented:', error);
        isAudioPlaying.value = false;
    });
}
const stopAudio = () => {
    audio.value.pause();
    isAudioPlaying.value = false;
}

const battle = (type: number) => {
    const opponent = getStat();
    if (type === BattleType.HotBattle) {
        if (opponent > hotness.value) {
            defeatMessage.value = 'You lost the hot battle!';
            gameState.value = GameState.Defeat;
        } else {
            victoryMessage.value = 'You won the hot battle!';
            gameState.value = GameState.Victory;
            wins.value++;
            hotness.value++;
        }
    } else if (type === BattleType.CarBattle) {
        if (opponent > car.value) {
            defeatMessage.value = 'You lost the car battle!';
            gameState.value = GameState.Defeat;
        } else {
            victoryMessage.value = 'You won the car battle!';
            gameState.value = GameState.Victory;
            car.value++;
            wins.value++;
        }
    }
}

const restart = (reset: boolean = false) => {
    gameState.value = GameState.Searching;
    victoryMessage.value = '';
    defeatMessage.value = '';
    if (reset) {
        car.value = getStat();
        hotness.value = getStat();
        wins.value = 0;
    }
}

onMounted(() => {
    if (window.AudioContext) {
        const audioContext = new AudioContext();
        audioContext.suspend();
    }
    startAudio();
});

onUnmounted(() => {
    stopAudio();
});

</script>

<style scoped>
#background {
    background-color: black;
    position: absolute;
    height: 100vh;
    width: 100vw;
    left: 0;
    top: 0;
    z-index: -1;
}

.audio-controls {
    position: absolute;
    bottom: 10px;
    left: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    span {
        cursor: default;
        font-size: 1rem;
    }
    a {
        color: white;
        text-decoration: none;
    }
}

.whole-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10vh;
}

.stats {
    top: 0px;
    left: 50px;
    display: flex;
    flex-direction: column;
    gap: 0.1vh;
    h2 {
        margin: 0;
    }
}

.multibutton {
    display: flex;
    flex-direction: column;
    gap: 0.5vh;
}
</style>