const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..');
const destDir = process.argv[2] ? path.resolve(process.argv[2]) : path.join(__dirname, '../../enlightlab-widget');

console.log(`Starting extraction...`);
console.log(`Source directory: ${srcDir}`);
console.log(`Destination directory: ${destDir}`);

// Helper to copy directory recursively
function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Helper to copy single file
function copyFileSync(src, dest) {
  if (!fs.existsSync(src)) return;
  const destParent = path.dirname(dest);
  if (!fs.existsSync(destParent)) {
    fs.mkdirSync(destParent, { recursive: true });
  }
  fs.copyFileSync(src, dest);
}

try {
  // 1. Create clean folder structure
  fs.mkdirSync(destDir, { recursive: true });
  fs.mkdirSync(path.join(destDir, 'config'), { recursive: true });
  fs.mkdirSync(path.join(destDir, 'data'), { recursive: true });
  fs.mkdirSync(path.join(destDir, 'public'), { recursive: true });
  fs.mkdirSync(path.join(destDir, 'scripts'), { recursive: true });

  // 2. Copy Widget specific code & configurations
  console.log(`- Copying client configs and Knowledge Base...`);
  copyFileSync(path.join(srcDir, 'config', 'client.json'), path.join(destDir, 'config', 'client.json'));
  copyDirSync(path.join(srcDir, 'clients'), path.join(destDir, 'clients'));

  console.log(`- Copying RAG indexing scripts...`);
  copyFileSync(path.join(srcDir, 'scripts', 'index-kb.js'), path.join(destDir, 'scripts', 'index-kb.js'));
  copyFileSync(path.join(srcDir, 'scripts', 'test-rag.js'), path.join(destDir, 'scripts', 'test-rag.js'));

  console.log(`- Copying public widget assets...`);
  copyFileSync(path.join(srcDir, 'public', 'widget.js'), path.join(destDir, 'public', 'widget.js'));

  console.log(`- Copying widget-service backend library...`);
  copyDirSync(path.join(srcDir, 'src', 'lib', 'widget-service'), path.join(destDir, 'src', 'lib', 'widget-service'));

  console.log(`- Copying UI Pages & Router API routes...`);
  copyDirSync(path.join(srcDir, 'src', 'app', 'widget'), path.join(destDir, 'src', 'app', 'widget'));
  copyDirSync(path.join(srcDir, 'src', 'app', 'widget-test'), path.join(destDir, 'src', 'app', 'widget-test'));
  copyDirSync(path.join(srcDir, 'src', 'app', 'api', 'widget'), path.join(destDir, 'src', 'app', 'api', 'widget'));

  // 3. Copy Layout and Styling
  console.log(`- Copying app shells and global styles...`);
  copyFileSync(path.join(srcDir, 'src', 'app', 'globals.css'), path.join(destDir, 'src', 'app', 'globals.css'));
  copyFileSync(path.join(srcDir, 'src', 'app', 'layout.tsx'), path.join(destDir, 'src', 'app', 'layout.tsx'));

  // 4. Generate clean config files (no better-auth, database, or prisma configs)
  console.log(`- Generating standalone package.json...`);
  const pkgJson = {
    name: "enlightlab-ai-widget",
    version: "1.0.0",
    private: true,
    scripts: {
      "dev": "next dev",
      "build": "next build",
      "start": "next start"
    },
    dependencies: {
      "next": "16.2.4",
      "react": "19.2.5",
      "react-dom": "19.2.5",
      "lucide-react": "^1.20.0",
      "react-markdown": "^10.1.0",
      "retell-client-js-sdk": "^2.0.7"
    },
    devDependencies: {
      "typescript": "^6.0.3",
      "@types/node": "^25.6.0",
      "@types/react": "^19.2.14",
      "@types/react-dom": "^19.2.3",
      "tailwindcss": "^4.2.4",
      "@tailwindcss/postcss": "^4.2.4"
    }
  };
  fs.writeFileSync(path.join(destDir, 'package.json'), JSON.stringify(pkgJson, null, 2), 'utf8');

  console.log(`- Generating next.config.ts...`);
  const nextConfig = `import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  output: 'standalone'
};
export default nextConfig;
`;
  fs.writeFileSync(path.join(destDir, 'next.config.ts'), nextConfig, 'utf8');

  console.log(`- Generating tsconfig.json...`);
  const tsConfig = {
    compilerOptions: {
      target: "ES2017",
      lib: ["dom", "dom.iterable", "esnext"],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: "esnext",
      moduleResolution: "bundler",
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: "preserve",
      incremental: true,
      plugins: [{ name: "next" }],
      paths: {
        "@/*": ["./src/*"]
      }
    },
    include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    exclude: ["node_modules"]
  };
  fs.writeFileSync(path.join(destDir, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2), 'utf8');

  console.log(`- Generating template .env file...`);
  const envTemplate = `# AI Widget Standalone Server Environment
GEMINI_API_KEY=""
RETELL_API_KEY=""
HUBSPOT_ACCESS_TOKEN=""
`;
  fs.writeFileSync(path.join(destDir, '.env.template'), envTemplate, 'utf8');

  // Copy .env if present
  if (fs.existsSync(path.join(srcDir, '.env'))) {
    console.log(`- Backing up local API keys to .env...`);
    const originalEnv = fs.readFileSync(path.join(srcDir, '.env'), 'utf8');
    const lines = originalEnv.split('\n');
    let extractedKeys = [];
    lines.forEach(line => {
      if (line.startsWith('GEMINI_API_KEY') || line.startsWith('RETELL_API_KEY') || line.startsWith('HUBSPOT_ACCESS_TOKEN')) {
        extractedKeys.push(line.trim());
      }
    });
    fs.writeFileSync(path.join(destDir, '.env'), extractedKeys.join('\n'), 'utf8');
  }

  console.log(`\n🎉 SUCCESS! Standalone widget project extracted to: ${destDir}`);
  console.log(`\nTo run it:\n1. cd into that folder\n2. Run 'npm install'\n3. Run 'npm run dev' to start standalone development!`);

} catch (err) {
  console.error("Extraction failed:", err);
}
