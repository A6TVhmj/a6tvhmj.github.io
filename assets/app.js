/* ============================================================
   蓝图手记 — 站点脚本
   主题切换 / 顶栏 / 页脚 / 文章数据
   ============================================================ */

/* ---------- 主题（先在 <head> 内联执行防闪烁，这里做兜底） ---------- */
(function () {
  var t = localStorage.getItem('bp-theme');
  if (!t) {
    t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  document.documentElement.setAttribute('data-theme', t);
})();

function toggleTheme() {
  var cur = document.documentElement.getAttribute('data-theme');
  var next = cur === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('bp-theme', next);
  syncThemeLabel();
  // 有些图标分明暗两版，主题变了要跟着换
  if (typeof refreshIcons === 'function') refreshIcons();
}

function syncThemeLabel() {
  var el = document.getElementById('theme-label');
  if (!el) return;
  var cur = document.documentElement.getAttribute('data-theme');
  // 暗色时提示可切到"描图纸"，亮色时提示可切到"蓝图"
  el.textContent = cur === 'light' ? 'DARK' : 'LIGHT';
}

/* ---------- 顶栏 / 页脚 ---------- */

var NAV = [
  { href: 'index.html',    label: 'Index'    },
  { href: 'projects.html', label: 'Projects' },
  { href: 'posts.html',    label: 'Notes'    },
  { href: 'about.html',    label: 'About'    }
];

function renderChrome(current) {
  var top = document.getElementById('topbar');
  if (top) {
    top.innerHTML =
      '<div class="wrap">' +
        '<a class="brand" href="index.html">A6TVhmj</a>' +
        '<nav class="nav">' +
          NAV.map(function (n) {
            var cur = n.href === current ? ' aria-current="page"' : '';
            return '<a href="' + n.href + '"' + cur + '>' + n.label + '</a>';
          }).join('') +
          '<button class="themetoggle" type="button" onclick="toggleTheme()" ' +
            'aria-label="切换明暗主题">◐ <span id="theme-label">LIGHT</span></button>' +
        '</nav>' +
      '</div>';
  }

  var foot = document.getElementById('footer');
  if (foot) {
    foot.innerHTML =
      '<div class="wrap">' +
        '<span>© ' + new Date().getFullYear() + ' A6TVhmj · BUILT WITH PLAIN HTML</span>' +
        '<span>SHEET ' + (current || 'index.html').replace('.html', '').toUpperCase() + '</span>' +
      '</div>';
  }
  bindPageFlip(current);
  syncThemeLabel();
}

/* ---------- 翻页：一页一屏，上下滚动即切换 ---------- */

function navIndex(current) {
  for (var i = 0; i < NAV.length; i++) {
    if (NAV[i].href === current) return i;
  }
  return -1;
}

/* 竖屏与窄屏下页面回归常规滚动，滚动翻页会与之冲突 */
function pageFlipEnabled() {
  return !matchMedia('(orientation: portrait), (max-width: 720px)').matches;
}

function bindPageFlip(current) {
  var i = navIndex(current);
  if (i < 0) return;

  if (!pageFlipEnabled()) return;

  var prev = NAV[i - 1] ? NAV[i - 1].href : null;
  var next = NAV[i + 1] ? NAV[i + 1].href : null;
  if (!prev && !next) return;

  var main = document.querySelector('main');
  var fired = false;
  var acc = 0;                 // 累计滚动量，防误触
  var NEED = 90;
  var decay;

  function go(href, dir) {
    if (fired || !href) return;
    fired = true;
    document.body.classList.add(dir > 0 ? 'leave-up' : 'leave-down');
    // 记住来向，让下一页从对应方向进场
    try { sessionStorage.setItem('flip-dir', String(dir)); } catch (e) {}
    setTimeout(function () { location.href = href; }, 200);
  }

  function push(dy) {
    if (fired) return;

    // 旋转屏幕后可能已切到常规滚动模式，此时不再翻页
    if (!pageFlipEnabled()) { acc = 0; return; }
    // 换方向就清零，避免上下抖动累加
    if (dy * acc < 0) acc = 0;
    acc += dy;

    // 先判定再安排衰减，避免顺序颠倒时阈值被提前清零
    if (acc >= NEED) { go(next, 1); return; }
    if (acc <= -NEED) { go(prev, -1); return; }

    clearTimeout(decay);
    decay = setTimeout(function () { acc = 0; }, 260);
  }

  addEventListener('wheel', function (e) {
    // 内部可滚动区域（如长正文）先让它自己滚
    if (scrollableAncestor(e.target, e.deltaY)) return;
    push(e.deltaY);
  }, { passive: true });

  var ty = null;
  addEventListener('touchstart', function (e) { ty = e.touches[0].clientY; acc = 0; }, { passive: true });
  addEventListener('touchmove', function (e) {
    if (ty === null) return;
    var d = ty - e.touches[0].clientY;
    ty = e.touches[0].clientY;
    if (scrollableAncestor(e.target, d)) return;
    push(d * 1.6);
  }, { passive: true });
  addEventListener('touchend', function () { ty = null; acc = 0; }, { passive: true });

  addEventListener('keydown', function (e) {
    if (e.key === 'PageDown' || e.key === 'ArrowDown') { e.preventDefault(); go(next, 1); }
    if (e.key === 'PageUp'   || e.key === 'ArrowUp')   { e.preventDefault(); go(prev, -1); }
  });

  // 进场动画：方向与来向一致
  var d = 0;
  try { d = parseInt(sessionStorage.getItem('flip-dir') || '0', 10); } catch (e) {}
  if (d && main) {
    document.body.classList.add(d > 0 ? 'enter-up' : 'enter-down');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.body.classList.remove('enter-up', 'enter-down');
      });
    });
  }
  try { sessionStorage.removeItem('flip-dir'); } catch (e) {}
}

/* 若事件源在一个还能继续滚的容器里，则不翻页 */
function scrollableAncestor(el, dy) {
  while (el && el !== document.body) {
    if (el.scrollHeight > el.clientHeight + 1) {
      var top = el.scrollTop;
      var max = el.scrollHeight - el.clientHeight;
      if (dy > 0 && top < max - 1) return true;
      if (dy < 0 && top > 1) return true;
    }
    el = el.parentElement;
  }
  return false;
}

/* ---------- 分节标题（尺寸线） ---------- */

function dimHeading(text, note) {
  return '<div class="dim-h">' +
           '<h2>' + text + '</h2>' +
           (note ? '<span class="note">' + note + '</span>' : '') +
           '<span class="rule"></span>' +
         '</div>';
}

/* ---------- 文章索引 ---------- */

function loadPosts() {
  return fetch('posts.json', { cache: 'no-cache' })
    .then(function (r) { return r.json(); })
    .then(function (list) {
      return list.slice().sort(function (a, b) {
        return (a.date < b.date) ? 1 : (a.date > b.date ? -1 : 0);
      });
    })
    .catch(function () { return []; });
}

function postRow(p) {
  var tag = p.status === 'draft'
    ? '<span class="tag draft">Draft</span>'
    : '<span class="tag done">Published</span>';
  var cats = (p.tags || []).map(function (t) { return '#' + t; }).join('  ');
  return '<a class="row cross" href="post.html?p=' + encodeURIComponent(p.slug) + '">' +
           '<div class="row-m">' +
             '<span>' + p.date + '</span>' +
             '<span>' + (p.category || '') + '</span>' +
             tag +
             (cats ? '<span>' + cats + '</span>' : '') +
           '</div>' +
           '<div class="row-t">' + p.title + '</div>' +
           (p.summary ? '<div class="row-d">' + p.summary + '</div>' : '') +
         '</a>';
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
