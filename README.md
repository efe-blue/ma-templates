# ma-templates
存放ma-cli官方模板zip包
meta.json中存放所有模板的地址信息

## 模板添加说明

### `src`文件夹  
用于存放模板文件，Eg：origin模板
* `src/tplName/.ma-cli`
>       模板配置文件夹
* `src/tplNmae/.ma-cli/template.config.json`
>       模板配置文件字段说明
>       name: 模板名
>       pagesPath: pages文件夹相对路径
>       compoPath: components文件夹相对路径
>       app.json: app.json文件相对路径

### `zips`文件夹  
用于存放模板文件压缩包  
**Eg：** `origin.zip`为`src/origin`的压缩包  

### `meta.json`文件   
存放所有模板的有关信息
>       文件字段说明
>       official: 官方模板
>       github: github模板
>       name: 模板名
>       description: 模板简述信息