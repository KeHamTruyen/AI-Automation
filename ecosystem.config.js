module.exports = {
  apps: [
    {
      name: 'ai-marketing-app',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: process.cwd(),
      instances: 2,                    // Số instances (cluster mode)
      exec_mode: 'cluster',            // Cluster mode cho load balancing
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/app-error.log',
      out_file: './logs/app-out.log',
      time: true,
      watch: false,
      max_memory_restart: '1G',
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
    },
    {
      name: 'ai-marketing-scheduler',
      script: 'node_modules/tsx/dist/cli.mjs',
      args: 'scripts/scheduler-worker.ts',
      interpreter: 'node',
      cwd: process.cwd(),
      instances: 1,                    // Chỉ 1 instance cho scheduler
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
      error_file: './logs/scheduler-error.log',
      out_file: './logs/scheduler-out.log',
      time: true,
      watch: false,
      max_memory_restart: '500M',
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
    },
  ],
}
