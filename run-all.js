import { spawn } from 'child_process';

console.log('🚀 Starting CareerCraft AI Full-Stack MERN Platform (Client + Server)...');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

// 1. Launch Server
const server = spawn(npmCmd, ['run', 'dev', '--prefix', 'server'], {
  stdio: 'inherit',
  shell: true,
});

// 2. Launch Client
const client = spawn(npmCmd, ['run', 'dev', '--prefix', 'client'], {
  stdio: 'inherit',
  shell: true,
});

const cleanup = () => {
  console.log('\nShutting down CareerCraft AI services...');
  server.kill();
  client.kill();
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
