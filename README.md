<a name="readme-top"></a>

[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/sipt/tab-player">
    <img src="public/icon-128.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Tab Player</h3>

  <p align="center">
    以一种简便的方式来管理你的 Chrome 标签。
    <br />
    <br />
    <a href="https://chrome.google.com/webstore/detail/tab-player/jnmgfgjcefakjoeoinpncbilkdnikbgc">Install</a>
    ·
    <a href="https://github.com/sipt/tab-player/issues">Report Bug</a>
    ·
    <a href="https://github.com/sipt/tab-player/issues">Request Feature</a>
  </p>
</div>

![Screen Shot](doc/screen.jpg)

<details>
  <summary>目录</summary>
  <ol>
    <li>
      <a href="#项目介绍">项目介绍</a>
    </li>
    <li>
      <a href="#使用">使用</a>
      <ul>
        <li><a href="#Tab 筛选">Tab 筛选</a></li>
        <li><a href="#Tab 操作">Tab 操作</a></li>
        <li><a href="#暗黑/明亮模式切换">暗黑/明亮模式切换</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#赞赏">赞赏</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## 项目介绍

[![Tab Player Screen Shot][product-screenshot]](https://github.com/sipt/tab-player)

在使用 Chrome 浏览网页时，可能会打开很多标签页，这时候使用 Tab Player 可以轻松清理不需要的或目前无用的标签页，使 Chrome 更加清爽。

虽然已经有很多 Chrome 插件可以管理标签页，但试用了很多都不能完全满足我的需求：

- 可以通过关键词模糊匹配或与标签页当前的状态配合，快速批量选中。
- 可以支持跨窗口选择，但也可以根据窗口来隔离。
- 可以手动选择标签页，或排除一些不想关闭的标签页。
- 可以快捷操作关闭和 Pin，支持全键盘操作。
- 界面更美观。

因此，我想与有相同需求的人分享这个插件。

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 安装

前往 [Chrome Web Store - Tab Player](https://chrome.google.com/webstore/detail/tab-player/jnmgfgjcefakjoeoinpncbilkdnikbgc) 安装插件

<!-- USAGE EXAMPLES -->

## 使用

### Tab 筛选

你可以使用关键词（包含在 title 或 URL 中）进行筛选：

- 可以使用保留词进行筛选（`@loading`，`@unloaded`，`@complete`，`@pinned`，`@unpinned`，`@audible`）。当使用保留词时，只能使用一个，并且需要放在输入框开头，用空格与后面的关键词分开。
- 可以使用鼠标左键点击标签页来添加额外的标签页或取消选定的标签页。
- 可以使用鼠标左键点击窗口来锁定筛选生效的窗口。

![Input Filter](doc/SCR-20230724-qvt.png)

### Tab 操作

可以在输入框中直接输入 `Enter` 或点击输入框右侧的 Magic 按钮，弹出可操作选项。支持全键盘操作，切换焦点使用 `Tab` 键。目前支持 `Close` 和 `Pin`。

![Operate Tab](doc/SCR-20230724-qzl.png)

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### 暗黑/明亮模式切换

点击右上角的 月亮 或 太阳 按钮进行切换。

<!-- ROADMAP -->

## Roadmap

- [x] 1.0 基础功能支持
  - 灵感来源💡：在使用 Chrome 过程中，个人习惯会打开很多的 Tab。所以想能有个方便的方式批量关闭这些 Tab。
  - [x] 支持关键词筛选
  - [x] 支持保留词筛选
  - [x] 支持 鼠标选择/取消选择 Tab
  - [x] 支持 鼠标选择/取消选择 Window
  - [x] 支持 关闭/Pin Tab
  - [x] 支持关闭 Window
  - [x] 支持暗黑/明亮主题
- [ ] 1.1 Amazing! Group & Switch Tab
  - 灵感来源💡：有时候在处理一个问题时，会打开很多个Tab，但他们又归属于一个来源，所以希望它们可以在一个 Group 中。我在处理一个新的问题时，可以再新建一个 Group，原生的交互关不友好。Tab 之前的切换也希望可以像操作系统中的 `Alt(Opt)+Tab` 或 Cmd+` 一样丝滑。
  - [ ] Tab 切换
  - [ ] Group 切换
  - [ ] Group 创建与列表
- [ ] 1.2 SmartBox & Options
  - [ ] 支持智能规则筛选（SmartBox）
    - [ ] Tab Status
    - [ ] Tab 长期不活跃
    - [ ] 预置策略
  - [ ] Options
- [ ] 1.3 待计划。。。

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 赞赏

觉得这个项目不错，给个 Star 或 请我我喝杯咖啡：
|微信赞赏|支付宝赞赏|
|---|---|
|![微信赞赏](doc/wechat.jpeg)|![支付宝赞赏](doc/alipay.jpg)|

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[stars-shield]: https://img.shields.io/github/stars/sipt/tab-player.svg
[stars-url]: https://github.com/sipt/tab-player/stargazers
[issues-shield]: https://img.shields.io/github/issues/sipt/tab-player.svg
[issues-url]: https://github.com/sipt/tab-player/issues
[license-shield]: https://img.shields.io/github/license/sipt/tab-player.svg
[license-url]: https://github.com/sipt/tab-player/blob/master/LICENSE.txt
[product-screenshot]: doc/demo-video.gif
