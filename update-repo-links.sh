#!/bin/bash

# 更新所有文档中的仓库链接
echo "更新仓库链接: continuous-learning → continuous-learning-skill"

# 更新所有.md文件中的仓库链接
find . -name "*.md" -type f | while read file; do
    echo "处理: $file"
    # 更新GitHub仓库链接
    sed -i '' 's|https://github.com/fjmw123/continuous-learning|https://github.com/fjmw123/continuous-learning-skill|g' "$file"
    sed -i '' 's|https://github.com/yourusername/continuous-learning|https://github.com/fjmw123/continuous-learning-skill|g' "$file"
    sed -i '' 's|git clone https://github.com/yourusername/continuous-learning|git clone https://github.com/fjmw123/continuous-learning-skill|g' "$file"
done

# 更新所有.json文件中的仓库链接
find . -name "*.json" -type f | while read file; do
    echo "处理: $file"
    sed -i '' 's|https://github.com/fjmw123/continuous-learning|https://github.com/fjmw123/continuous-learning-skill|g' "$file"
    sed -i '' 's|https://github.com/yourusername/continuous-learning|https://github.com/fjmw123/continuous-learning-skill|g' "$file"
done

echo "✅ 仓库链接更新完成！"