# json-treeview

利用ReactJS实现基于json数据生成treeview，并提供编辑等功能
- Demo: https://john04047210.github.io/json-treeview/examples/index.html

## Getting started
--------------------
1. 下载源码
  
  ```sh
  git clone https://github.com/john04047210/json-treeview.git
  ```
2. 进入工程路径
  - 安装环境
 ```sh
 cd json-treeview
 npm install
 ```
- 编译
 ```sh
 npm run build
 ```
- 启动测试
 ```sh
 npm run server
 ```
3. 已知问题
  - 编辑状态，删除失效
  - 点击选择安装，追加按钮，删除按钮等会触发li上的click事件
  - 编辑状态，需要追加Title修改功能