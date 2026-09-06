/* 项目清单 —— 新增项目只要在这里加一项 */

var PROJECTS = [
  {
    name: 'CubeLibrary',
    icon: 'assets/icons/cubelibrary.png',
    fig: 'PRJ.01',
    stack: 'Python · Cython',
    status: 'active',
    featured: true,
    url: 'https://github.com/A6TVhmj/CubeLibrary',
    desc: '纯 Python + Cython 实现的魔方桌面工作站：交互式展开图、两阶段极速求解与最少步最优解、残缺状态（? / 小写）自动补全、WCA 计时器与 Ao5/Ao12、交换子与共轭公式解析。',
    points: [
      '整套剪枝表约 3.6MB，是经典实现（数百 MB）的数百分之一，速度仍可与 Cube Explorer 打平',
      '残缺补全用约束枚举 + 估算门控替代爆搜，Cython 实现比 Python 版快数百倍',
      '四语言 × 15 主题热切换'
    ]
  },
  {
    name: 'Auto366',
    icon: 'assets/icons/auto366.png',
    // 原图是白色图形加透明底，亮色主题下不可见，另备深色版
    iconLight: 'assets/icons/auto366-light.png',
    fig: 'PRJ.02',
    stack: 'JavaScript',
    status: 'active',
    featured: true,
    role: '协作者',
    url: 'https://github.com/CyrilGuoCODE/Auto366',
    desc: '天学网自动化答题工具（CyrilGuoCODE 主导，我是协作者）。自动检测练习文件、提取答案并填写，附带听力答案提取等辅助功能。',
    points: [
      '我负责自动填空模块：修复大量兼容性与稳定性问题（v0.9.9 更新日志署名）',
      '仓库已有 30+ star，有 B 站介绍视频与在线答案查看器'
    ]
  },
  {
    name: 'QRQLL',
    icon: 'assets/icons/qrqll.png',
    fig: 'PRJ.03',
    stack: 'Python · Waitress',
    status: 'active',
    featured: true,
    url: 'https://github.com/A6TVhmj/QRQLL',
    desc: '轻量跨平台的本地 Mock 服务工具，内置生产级 Waitress 引擎，同时提供 GUI 与 CLI 两个版本。在受限的客户端环境里，它能把一个本地服务包装成完整可用的页面。',
    points: [
      '全屏网页内嵌，横竖屏 CSS 彻底分离，自适应铺满客户端屏幕',
      '25%~150% 实时缩放、本地资源目录自动分发、配置 JSON 导入导出',
      '防误触的远程关闭指令（客户端二次确认后退出服务端）'
    ]
  },
  {
    name: 'LLA-ADB',
    icon: 'assets/icons/lla-adb.png',
    fig: 'PRJ.04',
    stack: 'Python · ADB',
    status: 'shipped',
    featured: true,
    url: 'https://github.com/A6TVhmj/LLA-ADB',
    desc: 'Lemon Link Assistant 6.0 —— 图形化的 Android 设备助手：通过 ADB 把文件送进设备，并集成网易云音乐与 Bilibili 下载器。给那些不方便直接传文件的安卓设备用。',
    points: [
      '设备自动检测、自定义目标路径、批量上传与实时进度',
      '已发布打包 Release，双击 exe 即可运行，不用装 Python 也不用配 ADB'
    ]
  }
];

function statusTag(s) {
  if (s === 'active')  return '<span class="tag done">Active</span>';
  if (s === 'shipped') return '<span class="tag done">Shipped</span>';
  return '<span class="tag draft">WIP</span>';
}

function projectCard(p) {
  return '<article class="card cross">' +
    '<div class="card-head">' +
      '<h3>' + p.name + '</h3>' +
      '<span class="card-meta">' + p.fig + '</span>' +
    '</div>' +
    '<div class="row-m" style="margin:8px 0 12px">' +
      '<span>' + p.stack + '</span>' +
      statusTag(p.status) +
      (p.role ? '<span>' + p.role + '</span>' : '') +
    '</div>' +
    '<p>' + p.desc + '</p>' +
    (p.points && p.points.length
      ? '<ul style="margin:14px 0 0;padding-left:18px;font-size:14.5px;line-height:1.7;color:var(--body)">' +
        p.points.map(function (t) { return '<li style="margin:6px 0">' + t + '</li>'; }).join('') +
        '</ul>'
      : '') +
    '<p style="margin-top:16px">' +
      '<a class="line mono" style="font-size:12px;letter-spacing:.14em" href="' + p.url +
      '" target="_blank" rel="noopener">OPEN →</a>' +
    '</p>' +
  '</article>';
}
