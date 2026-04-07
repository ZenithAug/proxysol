import { spawn } from 'node:child_process';

const cwd = process.cwd();
const children = [];

function spawnProcess(command, args) {
  const child = spawn(command, args, {
    cwd,
    stdio: 'inherit',
    shell: false,
  });

  children.push(child);
  return child;
}

const claimsApi = spawnProcess('node', ['server/claims-server.mjs']);
const client = spawnProcess('vite', ['--host', '127.0.0.1']);

function shutdown(exitCode = 0) {
  for (const child of children) {
    if (!child.killed) {
      child.kill('SIGINT');
    }
  }
  process.exit(exitCode);
}

for (const child of [claimsApi, client]) {
  child.on('exit', (code) => {
    shutdown(code ?? 0);
  });
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
