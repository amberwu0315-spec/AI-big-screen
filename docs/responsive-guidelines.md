# 触控屏自适应规范

本项目优先按 1920x1080 横屏触控屏设计。4K 16:9 屏幕通过同一套比例自动放大，不需要重新调整布局。

## 页面分类

### 大屏展示 / 流程页

适用：产品碳流程、企业大屏、全屏叙事中的设计稿舞台。

规则：以 1920x1080 或明确的局部设计尺寸作为坐标系，外层统一等比缩放。新增缩放逻辑必须优先使用 `src/components/common/ScaledStage.tsx` 里的工具：

- `TOUCH_SCREEN_DESIGN_WIDTH = 1920`
- `TOUCH_SCREEN_DESIGN_HEIGHT = 1080`
- `getFitScale`
- `useViewportFitScale`
- `useElementFitScale`
- `ScaledStage`

固定像素允许出现在缩放舞台内部，因为它们属于设计稿坐标。

### 展示介绍页

适用：首页、能力介绍页、轮播介绍页。

规则：优先使用 `clamp()`、`vw/vh/dvh`、百分比、flex/grid。导航、按钮、标题、间距应使用可缩放尺寸，不新增散落的 `window.innerWidth / 1920` 计算。

### 配置 / 表格 / 表单页

适用：驾驶舱编辑态、CBAM 税费计算器、数据表格组件。

规则：不做整体页面缩放。使用响应式网格、最小宽度、滚动容器和断点，保证触控操作可用。

## 硬规则

- 非缩放舞台内，不新增大面积固定 `px` 布局。
- 不重复手写 `ResizeObserver + scale()`；先使用公共缩放工具。
- 大屏新增页面默认以 1920x1080 为基准。
- 图表和 canvas 必须跟随容器 resize。
- 触控按钮点击区域建议不小于 44px，主操作建议不小于 48px。
