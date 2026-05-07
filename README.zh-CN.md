# Zhijing Wu 个人主页

[English README](README.md)

这个仓库是 Zhijing Wu 的静态 GitHub Pages 个人主页。网站面向学术和求职展示，包含响应式个人信息栏、项目与科研经历、技能证书，以及 Life & Notes 页面。

## 在线网站

- GitHub Pages 仓库：`Zhijing-W/Zhijing-W.github.io`
- 网站地址：`https://zhijing-w.github.io`

## 网站内容

- 主页包含个人照片、教育背景、工作经历、项目、科研、技能和证书。
- `life.html` 用于展示生活记录、学生工作和荣誉。
- 背景采用纯白网格，并保留少量荧光绿色点缀。
- 个人信息栏在桌面、平板和手机宽度下都会保持统一的照片比例与清晰排版。
- 内置隐藏编辑模式，可以在不直接改 HTML 的情况下更新内容。

## 本地预览

可以直接打开主页：

```bash
open index.html
```

也可以在仓库根目录启动一个本地服务：

```bash
python3 -m http.server 8000
```

然后访问：

```text
http://localhost:8000/index.html
```

## 修改内容

主要可编辑内容放在：

```text
data/site-content.js
```

页面运行时会从这个数据文件渲染内容。这样可以让 HTML 结构保持稳定，也让后续增删改模块更安全。

### 隐藏编辑模式

1. 打开 `index.html` 或线上网站。
2. 连续点击 `Zhijing Wu` 五次。
3. 在编辑器里选择要修改的内容模块。
4. 修改 JSON 内容。
5. 点击 `Apply Preview` 先在页面上预览。
6. 点击 `Save to GitHub` 保存到仓库里的 `data/site-content.js`。

### GitHub Token 安全说明

网站不会把 GitHub token 写进公开代码。隐藏编辑器保存到 GitHub 时，需要一个只对本仓库开放 repository contents 读写权限的 fine-grained token。token 只保存在当前浏览器标签页的会话里，不会提交到仓库。

## 文件结构

```text
.
├── index.html              # 主页
├── life.html               # Life & Notes 页面
├── styles.css              # 视觉样式与响应式布局
├── script.js               # 数据渲染、交互、粒子和隐藏编辑器
├── data/
│   └── site-content.js     # 可编辑网站内容
├── assets/
│   ├── profile-original.jpg
│   ├── profile-960.jpg
│   └── profile-480.jpg
└── files/
    └── Wu_Zhijing_Resume.pdf
```

## 发布方式

网站由 GitHub Pages 自动发布。把修改推送到 `main` 分支后，GitHub Pages 会自动部署。

```bash
git add .
git commit -m "Update personal homepage"
git push origin main
```

部署通常需要一点时间。如果线上网站暂时没有变化，可以等待一会儿后清除浏览器缓存再刷新。
