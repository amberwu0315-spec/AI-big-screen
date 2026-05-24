import re

file_path = "/Users/watermelonwu/Downloads/ai-carbon-interactive-screen-main/src/components/ui/animated-beam.tsx"

with open(file_path, "r") as f:
    content = f.read()

old_logic = """        const svgWidth = containerRect.width
        const svgHeight = containerRect.height
        setSvgDimensions({ width: svgWidth, height: svgHeight })

        const startX =
          rectA.left - containerRect.left + rectA.width / 2 + startXOffset
        const startY =
          rectA.top - containerRect.top + rectA.height / 2 + startYOffset
        const endX =
          rectB.left - containerRect.left + rectB.width / 2 + endXOffset
        const endY =
          rectB.top - containerRect.top + rectB.height / 2 + endYOffset"""

new_logic = """        const svgWidth = containerRef.current.offsetWidth
        const svgHeight = containerRef.current.offsetHeight
        setSvgDimensions({ width: svgWidth, height: svgHeight })

        const scaleX = containerRect.width / svgWidth || 1
        const scaleY = containerRect.height / svgHeight || 1

        const startX =
          (rectA.left - containerRect.left + rectA.width / 2) / scaleX + startXOffset
        const startY =
          (rectA.top - containerRect.top + rectA.height / 2) / scaleY + startYOffset
        const endX =
          (rectB.left - containerRect.left + rectB.width / 2) / scaleX + endXOffset
        const endY =
          (rectB.top - containerRect.top + rectB.height / 2) / scaleY + endYOffset"""

if old_logic in content:
    content = content.replace(old_logic, new_logic)
else:
    print("Could not find old_logic in animated-beam.tsx")

with open(file_path, "w") as f:
    f.write(content)

print("done")
