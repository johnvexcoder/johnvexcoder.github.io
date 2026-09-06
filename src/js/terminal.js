(function () {
  let terminalOpen = false;
  let history = [];
  let historyIndex = -1;
  let previousFocus = null;

  const BANNER = [
    '',
    ' <span class="b">J0hnvexcoder — portfolio terminal</span>',
    ' <span class="c">type `help` to see available commands. decorative only.</span>',
    ''
  ].join('\n');

  const COMMANDS = {
    help: function () {
      return [
        '',
        ' <span class="b">Available commands:</span>',
        '   <span class="a">help</span>      show this help',
        '   <span class="a">about</span>     what i do',
        '   <span class="a">projects</span>  see my projects',
        '   <span class="a">homelab</span>   my infrastructure',
        '   <span class="a">tech</span>      the stack i use',
        '   <span class="a">github</span>    my open source',
        '   <span class="a">contact</span>   how to reach me',
        '   <span class="a">theme</span>     toggle dark / light',
        '   <span class="a">clear</span>     clear the terminal',
        '   <span class="a">exit</span>      close terminal',
        ''
      ].join('\n');
    },
    about: function () {
      return [
        '',
        ' <span class="b">About me</span>',
        ' Web developer, IT enthusiast, Linux homelab builder.',
        ' I work with: web development, servers, networking,',
        ' cybersecurity, Docker, Proxmox, and open source.',
        ' Currently studying penetration testing.',
        ' Based in the Philippines.',
        ''
      ].join('\n');
    },
    projects: function () {
      const projects = [
        { name: 'HomeLab-OS', desc: 'self-hosted NOC dashboard' },
        { name: 'MovieFlix', desc: 'private media streaming platform' },
        { name: 'CompressMe', desc: 'image compression tool (GUI + CLI)' },
        { name: 'Python-Keybr', desc: 'terminal typing trainer' },
        { name: 'DistroZSH', desc: 'framework-free ZSH config' },
        { name: 'Starbucks Portal', desc: 'UI concept project' }
      ];
      return [
        '',
        ' <span class="b">My projects:</span>',
        '   ' + projects.map(function (p) {
          return '<span class="a">' + p.name + '</span> — ' + p.desc;
        }).join('\n    '),
        '',
        ' More on <span class="a">github.com/johnvexcoder</span>',
        ''
      ].join('\n');
    },
    homelab: function () {
      return [
        '',
        ' <span class="b">Homelab: pve0</span>',
        ' Hardware: Lenovo ThinkCentre M710q',
        ' CPU: Intel Core i5-7500',
        ' RAM: 16 GB DDR4',
        ' Storage: 2 TB SSD',
        ' Virtualization: Proxmox VE',
        ' Guests: Debian x2, Ubuntu',
        ' Services: Jellyfin, Plex, HomeLab-OS, Uptime Kuma,', 
        '           MovieFlix, AdGuard, Home Assistant, NFS,',
        '           LibrePhotos, HomeLab Agent',
        ' Backup: TrueNAS',
        ''
      ].join('\n');
    },
    tech: function () {
      return [
        '',
        ' <span class="b">Tech stack & tools:</span>',
        ' Languages: Python, JavaScript, HTML, CSS, Java',
        ' Frameworks: Next.js, React',
        ' Systems: Linux, Debian, Ubuntu, Fedora, Kali',
        ' Infra: Docker, Proxmox, Nginx, Tailscale, Uptime Kuma',
        ' Databases: SQLite, PostgreSQL',
        ''
      ].join('\n');
    },
    github: function () {
      return [
        '',
        ' <span class="b">GitHub:</span>',
        ' <span class="a">github.com/johnvexcoder</span>',
        ' I build open source software in the open.',
        ' Open the repo in a new tab?',
        ''
      ].join('\n');
    },
    contact: function () {
      return [
        '',
        ' <span class="b">Contact:</span>',
        ' Email: <span class="a">johnangelodejoya@gmail.com</span>',
        ' GitHub: <span class="a">github.com/johnvexcoder</span>',
        ' WhatsApp: <span class="a">+63 933 104 5271</span>',
        ''
      ].join('\n');
    },
    theme: function () {
      const toggle = document.getElementById('theme-toggle');
      if (toggle) toggle.click();
      return '<span class="c">// toggled theme</span>';
    },
    clear: function () {
      return 'CLEAR';
    },
    exit: function () {
      closeTerminal();
      return '<span class="c">// goodbye</span>';
    },
    ls: function () {
      return [
        '<span class="a">home/</span>   <span class="a">about/</span>   <span class="a">projects/</span>   <span class="a">homelab/</span>   <span class="a">contact/</span>',
        '<span class="c">// try cd into one, or just use the nav bar above</span>'
      ].join('\n');
    },
    'whoami': function () {
      return '<span class="b">j0hn</span><span class="c">@</span><span class="a">pve0</span> — John De Joya (J0hnvexcoder)';
    },
    date: function () {
      return '<span class="g">' + new Date().toLocaleString() + '</span>';
    },
    unknown: function () {
      return '<span class="r">command not found:</span> <span class="a">' + arguments[0] + '</span> — try <span class="y">help</span>';
    }
  };

  function getPrompt() {
    return '<span class="g">j0hn</span><span class="c">@</span><span class="a">portfol.io</span><span class="c">:</span><span class="a">~</span><span class="c">$</span>';
  }

  function printLine(html) {
    const body = document.getElementById('terminal-body');
    const div = document.createElement('div');
    div.innerHTML = html;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  function printPrompt() {
    const body = document.getElementById('terminal-body');
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.gap = '6px';
    div.style.alignItems = 'center';
    div.innerHTML = getPrompt() + ' <span style="flex:1">' + escapeHtml(lastCommand || '') + '</span>';
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  let lastCommand = '';

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function processCommand(input) {
    const trimmed = input.trim();
    if (!trimmed) return;

    lastCommand = trimmed;
    history.push(trimmed);
    historyIndex = history.length;

    const args = trimmed.split(/\s+/);
    const cmd = args[0].toLowerCase();
    const cmdFn = COMMANDS[cmd];

    const output = cmdFn
      ? cmdFn.apply(null, args.slice(1))
      : COMMANDS.unknown(args[0]);

    if (output === 'CLEAR') {
      const body = document.getElementById('terminal-body');
      body.innerHTML = '';
      return;
    }

    if (output) {
      printLine(output);
    }
    printPrompt();
  }

  function openTerminal() {
    terminalOpen = true;
    const term = document.getElementById('terminal');
    const body = document.getElementById('terminal-body');
    previousFocus = document.activeElement;
    term.inert = false;
    term.setAttribute('aria-hidden', 'false');
    term.classList.add('open');
    document.body.classList.add('modal-open');
    body.innerHTML = '';
    lastCommand = '';
    printLine(BANNER);
    printPrompt();
    setTimeout(function () {
      const input = document.getElementById('terminal-input');
      input.focus();
    }, 50);
  }

  function closeTerminal() {
    if (!terminalOpen) return;
    terminalOpen = false;
    const term = document.getElementById('terminal');
    term.classList.remove('open');
    term.setAttribute('aria-hidden', 'true');
    term.inert = true;
    document.body.classList.remove('modal-open');
    if (previousFocus && previousFocus.focus) previousFocus.focus();
  }

  function initTerminal() {
    const launcher = document.getElementById('launch-terminal');
    const terminal = document.getElementById('terminal');
    const input = document.getElementById('terminal-input');
    const closeButton = document.getElementById('terminal-close');

    launcher.addEventListener('click', openTerminal);
    if (closeButton) closeButton.addEventListener('click', closeTerminal);

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        processCommand(input.value);
        input.value = '';
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (history.length > 0) {
          historyIndex = Math.max(0, historyIndex - 1);
          input.value = history[historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (history.length > 0) {
          historyIndex = Math.min(history.length, historyIndex + 1);
          input.value = historyIndex === history.length ? '' : history[historyIndex];
        }
      } else if (e.key === 'Escape') {
        closeTerminal();
      }
    });

    terminal.addEventListener('click', function (e) {
      if (e.target === terminal) {
        closeTerminal();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && terminalOpen) closeTerminal();
      if (e.key === 'Tab' && terminalOpen) {
        e.preventDefault();
        input.focus();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', initTerminal);
})();
