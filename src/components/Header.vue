<template>
  <header class="site-header">
    <div class="container">
      <h1 class="logo">Dave Graff</h1>
      <nav class="navigation">
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/contact">Contact</router-link></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  margin-right: 1rem;
  margin-left: 1rem;
}

.logo {
  font-size: 2.5rem;
  font-weight: bold;
}

.navigation ul {
  list-style: none;
  display: flex;
  gap: 1rem;
  margin: 0;
  padding: 0;
}

.navigation a {
  color: white;
  text-decoration: none;
}

.navigation a:hover {
  text-decoration: underline;
}
</style>