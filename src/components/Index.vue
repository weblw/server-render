<template>
  <div>
    Index Page
    <p>num:{{$store.state.count}}</p>
    <button @click="$store.commit('add')">add</button>
  </div>
</template>
<script>
export default {
  name: 'Index'
}
</script>