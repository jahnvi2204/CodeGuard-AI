module.exports = {
  apps: [{
    name: 'codeguard-backend',
    script: 'server.js',
    instances: 'max', // Use all available cores
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'development',
      PORT: 5002
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: process.env.PORT || 5002
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    merge_logs: true,
    kill_timeout: 5000,
    restart_delay: 1000,
    max_restarts: 10,
    min_uptime: '10s'
  }],

  deploy: {
    production: {
      user: 'ubuntu',
      host: 'your-server-ip',
      ref: 'origin/main',
      repo: 'git@github.com:jahnvi2204/CodeGuard-AI.git',
      path: '/var/www/codeguard-ai',
      'post-deploy': 'cd codeGuardAI/backend && npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
