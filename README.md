# Morandi · 纸与墨（DeepSeek Harness）

将 [obsidian-morandi-theme](https://github.com/xwtaidev/obsidian-morandi-theme) 的莫兰迪色板适配为 DeepSeek Harness 的 Web 主题 bundle：浅色是纸白、深褐文字和冷陶棕；深色是暖墨背景、雾白文字和冷雾蓝强调。颜色依据用途调整了明度，以兼顾正文、链接、主按钮和状态提示的可读性。图标为本项目原创。

## 使用

这是独立工程，不会自行安装或写入 DSH 的配置/目标目录。请在支持 `theme.overrideTokens` 的 DeepSeek Harness 中打开 **插件 → 添加插件 → 安装第三方插件**，输入本目录的**绝对路径**并确认安装。也可以让 Harness 助手通过 `plugin_manager` 的 `install_bundle` 操作安装本目录。之后在插件管理器中启用该 bundle；具体生效状态和警告以安装器返回结果为准。更新已安装的包后可能需要重启以加载新模块。无需构建或安装运行时依赖。

这是语义 token 覆盖层，不是外观设置中新增的一项主题：在 DSH 外观设置中仍可选浅色、深色或跟随系统。选择跟随系统时由 DSH 监听系统明暗变化并选择对应色值。正文、代码、终端的字号与字体仍由 DSH 设置控制。Markdown 一级至三级标题默认使用系统衬线字体，用户设置了正文字体时则优先使用该字体；标题字号和行高随 DSH 正文字号调整。主题不注入样式表，不读取或修改其他包 DOM，也不下载字体。

## 禁用、卸载与覆盖顺序

在插件管理器禁用或移除此 bundle 即释放它注册的 token 层，恢复先前的主题或覆盖层。若同时启用两个主题，DSH 按覆盖层**注册顺序逐 token** 合成：后注册的同名 token 获胜，仅被其中一个主题定义的 token 保留；禁用后注册的主题后，之前的对应 token 会重新显现。重启、重新启用或重新注册可能改变次序；要获得确定外观建议只启用一个主题。部分未覆盖或由其他包硬编码的颜色仍由 DSH 或其他包控制。

## 测试

需要支持 `node:test` 的 Node.js（建议 Node 18 或更新版本），无需第三方依赖：

```sh
cd dsh-morandi-theme
npm test
```

测试在隔离的 VM 中加载真实客户端模块，使用模拟 theme/effect 服务验证注册、明暗及跟随系统切换、覆盖顺序与卸载；另检查包元数据、入口语法、标题字体回退和字号变量、用户字体设置以及代表性色彩对比度。模拟测试不等同于在实际 GUI 中的视觉或兼容性验证。

## 来源与许可

色彩设计改编自 [obsidian-morandi-theme](https://github.com/xwtaidev/obsidian-morandi-theme)（Copyright © 2026 xwtaidev），保留其 MIT 许可和版权声明，详见 [LICENSE](LICENSE)。本工程参考 DSH 官方 decoration 模板的 bundle 结构；不包含原主题的 Obsidian CSS 或字体设置。
