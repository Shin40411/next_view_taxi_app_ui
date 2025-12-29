// vite.config.ts
import path from "path";
import { defineConfig } from "file:///D:/PHANMEM_THO/alotaxi-v2/node_modules/vite/dist/node/index.js";
import react from "file:///D:/PHANMEM_THO/alotaxi-v2/node_modules/@vitejs/plugin-react-swc/index.mjs";
import checker from "file:///D:/PHANMEM_THO/alotaxi-v2/node_modules/vite-plugin-checker/dist/esm/main.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    checker({
      typescript: true
      // eslint: {
      //   lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
      // },
    })
  ],
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), "node_modules/$1")
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), "src/$1")
      }
    ]
  },
  server: {
    port: 8081
  },
  preview: {
    port: 8081
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxQSEFOTUVNX1RIT1xcXFxhbG90YXhpLXYyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxQSEFOTUVNX1RIT1xcXFxhbG90YXhpLXYyXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9QSEFOTUVNX1RITy9hbG90YXhpLXYyL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djJztcclxuaW1wb3J0IGNoZWNrZXIgZnJvbSAndml0ZS1wbHVnaW4tY2hlY2tlcic7XHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtcclxuICAgIHJlYWN0KCksXHJcbiAgICBjaGVja2VyKHtcclxuICAgICAgdHlwZXNjcmlwdDogdHJ1ZSxcclxuICAgICAgLy8gZXNsaW50OiB7XHJcbiAgICAgIC8vICAgbGludENvbW1hbmQ6ICdlc2xpbnQgXCIuL3NyYy8qKi8qLntqcyxqc3gsdHMsdHN4fVwiJyxcclxuICAgICAgLy8gfSxcclxuICAgIH0pLFxyXG4gIF0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IFtcclxuICAgICAge1xyXG4gICAgICAgIGZpbmQ6IC9efiguKykvLFxyXG4gICAgICAgIHJlcGxhY2VtZW50OiBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ25vZGVfbW9kdWxlcy8kMScpLFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZmluZDogL15zcmMoLispLyxcclxuICAgICAgICByZXBsYWNlbWVudDogcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdzcmMvJDEnKSxcclxuICAgICAgfSxcclxuICAgIF0sXHJcbiAgfSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIHBvcnQ6IDgwODEsXHJcbiAgfSxcclxuICBwcmV2aWV3OiB7XHJcbiAgICBwb3J0OiA4MDgxLFxyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW1RLE9BQU8sVUFBVTtBQUNwUixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFdBQVc7QUFDbEIsT0FBTyxhQUFhO0FBSXBCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFFBQVE7QUFBQSxNQUNOLFlBQVk7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUlkLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTDtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sYUFBYSxLQUFLLEtBQUssUUFBUSxJQUFJLEdBQUcsaUJBQWlCO0FBQUEsTUFDekQ7QUFBQSxNQUNBO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixhQUFhLEtBQUssS0FBSyxRQUFRLElBQUksR0FBRyxRQUFRO0FBQUEsTUFDaEQ7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxFQUNSO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
