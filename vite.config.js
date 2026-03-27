import { defineConfig } from 'vite'

// Because we're deploying to GitHub Pages at https://<username>.github.io/edgescatering/
// The base needs to be exactly the name of the repository.
export default defineConfig({
  base: '/edgescatering/',
})
