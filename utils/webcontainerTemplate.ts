export const reactViteTemplate = {
  'package.json': {
    file: {
      contents: JSON.stringify({
        name: 'react-app',
        version: '1.0.0',
        private: true,
        scripts: {
          dev: 'vite',
        },
        dependencies: {
          react: '^18.2.0',
          'react-dom': '^18.2.0',
        },
        devDependencies: {
          vite: '^4.0.0',
          '@vitejs/plugin-react': '^4.0.0',
        },
      }, null, 2),
    },
  },
  'index.html': {
    file: {
      contents: `
        <!DOCTYPE html>
        <html>
          <head><title>React Vite App</title></head>
          <body>
            <div id="root"></div>
            <script type="module" src="/src/main.jsx"></script>
          </body>
        </html>
      `,
    },
  },
  'vite.config.js': {
    file: {
      contents: `
        import { defineConfig } from 'vite';
        import react from '@vitejs/plugin-react';

        export default defineConfig({
          plugins: [react()],
        });
      `,
    },
  },
  'src/main.jsx': {
    file: {
      contents: `
        import React from 'react';
        import ReactDOM from 'react-dom/client';
        import App from './App';

        ReactDOM.createRoot(document.getElementById('root')).render(<App />);
      `,
    },
  },
  'src/App.jsx': {
    file: {
      contents: `
        import React from 'react';

        function App() {
          return <h1>Hello from WebContainers + React + Vite!</h1>;
        }

        export default App;
      `,
    },
  },
};
