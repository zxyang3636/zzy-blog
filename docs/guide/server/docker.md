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


## 命令解读

```Bash
docker run -d \
  --name mysql \
  -p 3306:3306 \
  -e TZ=Asia/Shanghai \
  -e MYSQL_ROOT_PASSWORD=123 \
  mysql
  ```

  就是因为Docker会自动搜索并下载MySQL。注意：这里下载的不是安装包，而是镜像。镜像中不仅包含了MySQL本身，还包含了其运行所需要的环境、配置、系统级函数库。因此它在运行时就有自己独立的环境，就可以跨系统运行，也不需要手动再次配置环境了。这套独立运行的隔离环境我们称为容器。

说明：
- 镜像：英文是image
- 容器：英文是container

解读：
>- docker run -d ：创建并运行一个容器，-d则是让容器以后台进程运行
>- --name mysql  : 给容器起个名字叫mysql，你可以叫别的
>- -p 3306:3306 : 设置端口映射。
>  - 容器是隔离环境，外界不可访问。但是可以将宿主机端口映射容器内到端口，当访问宿主机指定端口时，就是在访问容器内的端口了。
>  - 容器内端口往往是由容器内的进程决定，例如MySQL进程默认端口是3306，因此容器内端口一定是3306；而宿主机端口则可以任意指定，一般与容器内保持一致。
>  - 格式： -p 宿主机端口:容器内端口，示例中就是将宿主机的3306映射到容器内的3306端口
>- -e TZ=Asia/Shanghai : 配置容器内进程运行时的一些参数
>  - 格式：-e KEY=VALUE，KEY和VALUE都由容器内进程决定
>  - 案例中，TZ=Asia/Shanghai是设置时区；MYSQL_ROOT_PASSWORD=123是设置MySQL默认密码
>- mysql : 设置镜像名称，Docker会根据这个名字搜索并下载镜像
>  - 格式：REPOSITORY:TAG，例如mysql:8.0，其中REPOSITORY可以理解为镜像名，TAG是版本号
>  - 在未指定TAG的情况下，默认是最新版本，也就是mysql:latest

![alt text](../../public/img/1914680004151607296.png)

镜像的名称不是随意的，而是要到DockerRegistry中寻找，镜像运行时的配置也不是随意的，要参考镜像的帮助文档，这些在DockerHub网站或者软件的官方网站中都能找到。

![](../../public/img/Snipaste_2025-04-22_21-58-58.png)


## 常见命令

|命令|说明|
|----|----|
|docker pull|拉取镜像
|docker push|推送镜像到DockerRegistry
|docker images|查看本地镜像
|docker rmi|删除本地镜像
|docker run|创建并运行容器（不能重复创建）
|docker stop|停止指定容器
|docker start|启动指定容器
|docker restart|重新启动容器
|docker rm|删除指定容器
|docker ps|查看运行的容器
|docker ps -a|查看所有容器
|docker logs|查看容器运行日志
|docker exec|进入容器
|docker save|保存镜像到本地压缩文件
|docker load|加载本地压缩文件到镜像
|docker inspect|查看容器详细信息


Docker最常见的命令就是操作镜像、容器的命令，详见官方文档： https://docs.docker.com/


![](../../public/img/Snipaste_2025-04-22_22-11-48.png)


**如何保存下载好的镜像，并打包？**

```Bash
[root@localhost ~]# docker save --help

Usage:  docker save [OPTIONS] IMAGE [IMAGE...]

Save one or more images to a tar archive (streamed to STDOUT by default)

Aliases:
  docker image save, docker save

Options:
  -o, --output string   Write to a file, instead of STDOUT


[root@localhost ~]# docker save -o nginx.tar nginx:latest


[root@localhost ~]# ll
总用量 192044
-rw-------. 1 root root      1241 6月  22 2024 anaconda-ks.cfg
-rw-------. 1 root root 196647424 4月  22 22:32 nginx.tar
 
```


**如何加载回来呢？**

docker load -i nginx.tar

```Bash
[root@localhost ~]# docker load --help

Usage:  docker load [OPTIONS]

Load an image from a tar archive or STDIN

Aliases:
  docker image load, docker load

Options:
  -i, --input string   Read from tar archive file, instead of STDIN
  -q, --quiet          Suppress the load output
[root@localhost ~]# docker load -i nginx.tar
ea680fbff095: Loading layer [==================================================>]   77.9MB/77.9MB
bd903131a05e: Loading layer [==================================================>]  118.7MB/118.7MB
9aad78ecf380: Loading layer [==================================================>]  3.584kB/3.584kB
9e3c6e8c1e25: Loading layer [==================================================>]  4.608kB/4.608kB
8d83f6b79143: Loading layer [==================================================>]   2.56kB/2.56kB
ccc5aac17fc4: Loading layer [==================================================>]   5.12kB/5.12kB
d1e3e4dd1aaa: Loading layer [==================================================>]  7.168kB/7.168kB
Loaded image: nginx:latest
[root@localhost ~]# docker images
REPOSITORY            TAG       IMAGE ID       CREATED        SIZE
nginx                 latest    4e1b6bae1e48   6 days ago     192MB
uums-web              1         d1c9ee2b1a26   8 months ago   946MB
zzy                   1.0.0     5d520aecab93   8 months ago   877MB
tomcat                8         2d2bccf89f53   3 years ago    678MB
redis                 5.0       c5da061a611a   3 years ago    110MB
mysql                 5.6       dd3b2a5dcb48   3 years ago    303MB
centos                7         eeb6ee3f44bd   3 years ago    204MB
mysql                 8.0.25    5c62e459e087   3 years ago    556MB
eclipse/centos_jdk8   latest    5bd02d36ed35   6 years ago    877MB
[root@localhost ~]# 
```

**nginx常规操作**

```Bash
docker pull nginx

docker images

docker run -d --name nginx -p 80:80 nginx

#查看运行中容器
docker ps
# 也可以加格式化方式访问，格式会更加清爽
docker ps --format "table {{.ID}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}\t{{.Names}}"

#停止容器
docker stop nginx

#再次启动nginx容器
docker start nginx

#查看容器详细信息
docker inspect nginx

# 进入容器,查看容器内目录
docker exec -it nginx bash
# 或者，可以进入MySQL
docker exec -it mysql mysql -uroot -p

#删除容器
docker rm nginx
# 发现无法删除，因为容器运行中，强制删除容器
docker rm -f nginx

#查看日志
docker logs -f nginx

#动态查看日志
docker logs -f bef8969d1e0c


```
补充：

默认情况下，每次重启虚拟机我们都需要手动启动Docker和Docker中的容器。通过命令可以实现开机自启：

```Bash
# Docker开机自启
systemctl enable docker

# Docker容器开机自启
docker update --restart=always [容器名/容器id]
```