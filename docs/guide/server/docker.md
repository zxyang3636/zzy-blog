# Docker

## 安装docker

1. 卸载旧版

```shell
yum remove docker \
    docker-client \
    docker-client-latest \
    docker-common \
    docker-latest \
    docker-latest-logrotate \
    docker-logrotate \
    docker-engine \
    docker-selinux 
```

2. 配置Docker的yum库

首先要安装一个yum工具
```Bash
sudo yum install -y yum-utils device-mapper-persistent-data lvm2

```

安装成功后，执行命令，配置Docker的yum源

```Bash
sudo yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

sudo sed -i 's+download.docker.com+mirrors.aliyun.com/docker-ce+' /etc/yum.repos.d/docker-ce.repo
```

更新yum，建立缓存

```Bash
sudo yum makecache fast
```

3. 安装docker
```Bash
yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

4. 启动和校验
```Bash
# 启动Docker
systemctl start docker

# 停止Docker
systemctl stop docker

# 重启
systemctl restart docker

# 设置开机自启
systemctl enable docker

# 执行docker ps命令，如果不报错，说明安装启动成功
docker ps
```

5. 配置镜像加速
[Docker/DockerHub 国内镜像源/加速列表](https://xuanyuan.me/blog/archives/1154)

镜像地址可能会变更，如果失效可以百度找最新的docker镜像。
配置镜像步骤如下：

```Bash
# 创建目录
mkdir -p /etc/docker

# 复制内容
tee /etc/docker/daemon.json <<-'EOF'
{
    "registry-mirrors": [
        "http://hub-mirror.c.163.com",
        "https://mirrors.tuna.tsinghua.edu.cn",
        "http://mirrors.sohu.com",
        "https://ustc-edu-cn.mirror.aliyuncs.com",
        "https://ccr.ccs.tencentyun.com",
        "https://docker.m.daocloud.io",
        "https://docker.awsl9527.cn"
    ]
}
EOF

# 重新加载配置
systemctl daemon-reload

# 重启Docker
systemctl restart docker
```


## 镜像和容器

当我们利用Docker安装应用时，Docker:会自动搜索并下载应用镜像(image)。镜像不仅包含应用本身，还包含应用
运行所需要的环境、配置、系统函数库。Docker会在运行镜像时创建一个隔离环境，称为容器(container)。

**镜像仓库**: 存储和管理镜像的平台，Docker官方维护了一个公共仓库:[DockerHub](https://hub.docker.com/)
![](../../public/img/Snipaste_2025-04-21_22-57-55.png)

**总结**

>Docker是做什么的?
>
>Docker可以帮助我们下载应用镜像，创建并运行镜像的容器，从而快速部署应用

>什么是镜像?
>
>将应用所需的函数库、依赖、配置等与应用一起打包得到的就是镜像

>什么是容器?
>
>为每个镜像的应用进程创建的隔离运行环境就是容器

>什么是镜像仓库?
>
>存储和管理镜像的服务就是镜像仓库 DockerHub是目前最大的镜像仓库，其中包含各种常见的应用镜像