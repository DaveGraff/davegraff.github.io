<template>
  <h1>Barbell Load Calculator</h1>
  <div class="main-calculate-options">
    <div class="weight-input">
      <label for="weight" >Weight: </label>
      <input id="weight" type="number" v-model="weight" />
    </div>
    <div class="weight-input">
      <label for="barbell-weight">Barbell Weight: </label>
      <select id="barbell-weight" v-model="selectedBarbellWeight">
        <option v-for="(value, name) in BarbellWeight" :key="name" :value="value">{{ name }}</option>
        </select>
    </div>
    <button class="calculate-btn" @click="calculate">Calculate</button>
  </div>
  <div v-if="resultText" class="result-text">
    <h2>{{ resultText }}</h2>
  </div>
  <div class="weight-options">
    <label for="plates">Available Plates</label>
      <div v-for="{ weight, plate } in sortedWeights" :key="weight" class="plate-row">
        <span>{{ weight }}lbs:</span>
        <div class="weight-count-options">
          <button @click="decrementPlate(weight)">-</button>
          <span>{{ plate.count }}</span>
          <button @click="incrementPlate(weight)">+</button>
        </div>
      </div>
    <button @click="saveWeights">Save</button>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';

interface Plate {
  weight: number;
  count: number;
}

const BarbellWeight = {
  Standard: 45,
  Lightweight: 35,
  None: 0,
} as const;

const WEIGHT_KEY = 'weights';
const DEFAULT_WEIGHTS: Record<number, Plate> = {
  45: { weight: 45, count: 4 },
  25: { weight: 25, count: 2 },
  10: { weight: 10, count: 4 },
  5: { weight: 5, count: 2 },
  2.5: { weight: 2.5, count: 2 },
  1.25: { weight: 1.25, count: 2 },
};

const weights: Record<number, Plate> = reactive({});
const selectedBarbellWeight = ref(45);
const weight = ref(0);
const resultText = ref('');

const sortedWeights = computed(() => {
  return Object.entries(weights)
    .sort((a, b) => Number(b[0]) - Number(a[0]))
    .map(([weight, plate]) => ({ weight: Number(weight), plate }));
});

const savedWeights = localStorage.getItem(WEIGHT_KEY);
if (savedWeights) {
  Object.assign(weights, JSON.parse(savedWeights));
} else {
  Object.assign(weights, DEFAULT_WEIGHTS);
}

const incrementPlate = (weight: number) => {
  if (weights[weight]) {
    weights[weight].count++;
  }
};

const decrementPlate = (weight: number) => {
  if (weights[weight] && weights[weight].count > 0) {
    weights[weight].count--;
  }
};

const saveWeights = () => {
  localStorage.setItem(WEIGHT_KEY, JSON.stringify(weights));
};

const weightsToString = (inputWeights: Record<number, Plate>) => {
  return Object.entries(inputWeights)
    .sort((a, b) => Number(b[0]) - Number(a[0]))
    .map(([weight, plate]) => `${plate.count}x${weight}lbs`)
    .join('\n');
};

const calculate = () => {
  if (!weight.value) {
    resultText.value = 'Please enter a weight';
    return;
  }

  if (weight.value < selectedBarbellWeight.value) {
    resultText.value = 'Weight must be greater than barbell weight';
    return;
  }

  var remainingWeight = weight.value - selectedBarbellWeight.value;
  var platesNeeded: Record<number, Plate> = {};
  for (const [_, plate] of Object.entries(sortedWeights.value)) {
    if (remainingWeight < 2 * plate.weight) {
      continue;
    }

    const maxPlatesPossible = Math.floor(remainingWeight/plate.weight)
    const evenPlates = maxPlatesPossible % 2 == 1 ? maxPlatesPossible - 1 : maxPlatesPossible;

    if (evenPlates > plate.plate.count) {
      platesNeeded[plate.weight] = { ...plate.plate, count: plate.plate.count };
      remainingWeight -= plate.plate.count * plate.weight;
    } else {
      platesNeeded[plate.weight] = { ...plate.plate, count: evenPlates };
      remainingWeight -= evenPlates * plate.weight;
    }
  }
  
  if (remainingWeight > 0) {
    resultText.value = 'Cannot achieve exact weight with available plates';
    return;
  }
  
  resultText.value = weightsToString(platesNeeded);
};
</script>

<style scoped>
.calculate-btn {
    float: right;
    justify-self: flex-end;
}

.main-calculate-options {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.weight-options {
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    background-color: white;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    max-width: 200px;

    .plate-row {
        opacity: 1;
        display: flex;
        justify-content: space-between;
        gap: 0.5rem;
        margin: 0.25rem 0;
    }

    button {
        height: 24px;
        padding: 0.25rem 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

@media (max-width: 768px) {
    .weight-options {
        position: static;
        transform: none;
        max-width: 100%;
        margin-top: 1rem;
    }
}

.weight-count-options {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    opacity: 1;
}

.result-text h2 {
    white-space: pre-line;
}
</style>