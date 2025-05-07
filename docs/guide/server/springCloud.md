# 微服务

### **单体架构**

单体架构:将业务的所有功能集中在一个项目中开发，打成一个包部署

优点:
- 架构简单
- 部署成本低

缺点:

- 团队协作成本高
- 系统发布效率低
- 系统可用性差

**总结:**

单体架构适合开发功能相对简单，规模较小的项目。


### **微服务**

可以独立运行和独立部署的服务

微服务是一种软件架构风格，它是以专注于单一职责的很多小型项目为基础，组合出复杂的大型应用。

- 粒度小
- 团队自治
- 服务自治

### SpringCloud

SpringCloud是目前国内使用最广泛的微服务框架。官网地址：https://spring.io/projects/spring-cloud

SpringCloud集成了各种微服务功能组件，并基于SpringBoot实现了这些组件的自动装配，从而提供了良好的开箱即用体验：

![image](https://s1.imagehub.cc/images/2025/04/28/1d011c0b8f705d58ed7f03f49b542884.png)

## 服务拆分

**什么时候拆分?**

- 创业型项目:先采用单体架构，快速开发，快速试错。随着规模扩大，逐渐拆分。

- 确定的大型项目:资金充足，目标明确，可以直接选择微服务架构，避免后续拆分的麻烦


**怎么拆分?**

从拆分目标来说，要做到:
- 高内聚:每个微服务的职责要尽量单一，包含的业务相互关联度高、完整度高。
- 低耦合:每个微服务的功能要相对独立，尽量减少对其它微服务的依赖，

从拆分方式来说，一般包含两种方式:

- 纵向拆分:按照业务模块来拆分
- 横向拆分:抽取公共服务，提高复用性

工程结构有两种:

1. 独立Project
2. Maven聚合

## 服务调用

把原本本地方法调用，改造成跨微服务的远程调用（RPC，即Remote Produce Call）。

### RestTemplate
Spring给我们提供了一个RestTemplate的API，可以方便的实现Http请求的发送。

**使用步骤**

```java
@Bean
public RestTemplate restTemplate() {
    return new RestTemplate();
}
```

```java
@RequiredArgsConstructor


private final RestTemplate restTemplate; // final修饰成员变量，意味着必须初始化
```

`@RequiredArgsConstructor`会将类的每一个`final`字段或者`@NonNull`标记字段生成一个构造方法


调用
```java
ResponseEntity<List<ItemDTO>> response = restTemplate.exchange("http://localhost:8081/items?ids={ids}",
        HttpMethod.GET,
        null,
        new ParameterizedTypeReference<List<ItemDTO>>() {},
        Map.of("ids", CollUtil.join(itemIds, ",")));
if (!response.getStatusCode().is2xxSuccessful()) {
    return;
}
List<ItemDTO> items = response.getBody();
if (CollUtils.isEmpty(items)) {
    return;
}
```

参数分别是：
- 请求路径
- 请求方式
- 请求实体
- 返回值类型
- 请求参数

Java发送http请求可以使用Spring提供的RestTemplate，使用的基本步骤如下：
- 注册RestTemplate到Spring容器
- 调用RestTemplate的API发送请求，常见方法有：
  - getForObject：发送Get请求并返回指定类型对象
  - PostForObject：发送Post请求并返回指定类型对象
  - put：发送PUT请求
  - delete：发送Delete请求
  - exchange：发送任意类型请求，返回ResponseEntity



## 服务注册和发现
刚刚手动发送Http请求的方式存在一些问题。

假如商品微服务被调用较多，为了应对更高的并发，我们进行了多实例部署

此时，每个`item-service`的实例其IP或端口不同，问题来了：
- `item-service`这么多实例，`cart-service`如何知道每一个实例的地址？
- http请求要写url地址，`cart-service`服务到底该调用哪个实例呢？
- 如果在运行过程中，某一个`item-service`实例宕机，`cart-service`依然在调用该怎么办？
- 如果并发太高，`item-service`临时多部署了N台实例，`cart-service`如何知道新实例的地址？

#### **注册中心原理**
在微服务远程调用的过程中，包括两个角色：
- 服务提供者：提供接口供其它微服务访问，比如item-service
- 服务消费者：调用其它微服务提供的接口，比如cart-service
![](https://zzyang.oss-cn-hangzhou.aliyuncs.com/img/Snipaste_2025-05-07_20-04-22.png)


#### **总结**
1. 服务治理中的三个角色分别是什么?

- 服务提供者:暴露服务接口，供其它服务调用
- 服务消费者:调用其它服务提供的接口
- 注册中心:记录并监控微服务各实例状态，推送服务变更信息

2. 消费者如何知道提供者的地址?

- 服务提供者会在启动时注册自己信息到注册中心，消费者可以从注册中心订阅和拉取服务信息

3. 消费者如何得知服务状态变更?
- 服务提供者通过心跳机制向注册中心报告自己的健康状态，当心跳异常时注册中心会将异常服务剔除，并通知订阅了该服务的消费者

4. 当提供者有多个实例时，消费者该选择哪一个?
- 消费者可以通过负载均衡算法，从多个实例中选择一个

### Nacos注册中心

目前开源的注册中心框架有很多，国内比较常见的有：
- `Eureka`：`Netflix`公司出品，目前被集成在`SpringCloud`当中，一般用于Java应用
- `Nacos`：`Alibaba`公司出品，目前被集成在`SpringCloudAlibaba`中，一般用于Java应用
- `Consul`：`HashiCorp`公司出品，目前集成在`SpringCloud`中，不限制微服务语言

以上几种注册中心都遵循SpringCloud中的API规范，因此在业务开发使用上没有太大差异。由于Nacos是国内产品，中文文档比较丰富，而且同时具备配置管理功能

Nacos是目前国内企业中占比最多的注册中心组件。它是阿里巴巴的产品，目前已经加入`SpringCloudAlibaba`中。

Nacos博客地址：[博客](https://nacos.io/blog/nacos-gvr7dx_awbbpb_gg16sv97bgirkixe/?spm=5238cd80.2ef5001f.0.0.3f613b7cTCVaJH)

#### 搭建
1. 执行sql文件

文件地址：[地址](https://zzyang.oss-cn-hangzhou.aliyuncs.com/sql/nacos.sql)

表结构如下

![](https://zzyang.oss-cn-hangzhou.aliyuncs.com/sql/Snipaste_2025-05-07_20-44-14.png)

2. docker中安装nacos

上传nacos.tar镜像
```Bash
docker load -i nacos.tar
```

3. 编写并上传`custom.env`文件

```
PREFER_HOST_MODE=hostname
MODE=standalone
SPRING_DATASOURCE_PLATFORM=mysql
MYSQL_SERVICE_HOST=192.168.146.131
MYSQL_SERVICE_DB_NAME=nacos
MYSQL_SERVICE_PORT=3306
MYSQL_SERVICE_USER=root
MYSQL_SERVICE_PASSWORD=123
MYSQL_SERVICE_DB_PARAM=characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Shanghai
```

4. 执行`nacos`

```Bash
docker run -d \
--name nacos \
--env-file ./nacos/custom.env \
-p 8848:8848 \
-p 9848:9848 \
-p 9849:9849 \
--restart=always \
nacos/nacos-server:v2.1.0-slim
```

5. 访问 http://192.168.146.131:8848/nacos/

首次访问会跳转到登录页，账号密码都是`nacos`

### 服务注册

注册到Nacos，步骤如下：
- 引入依赖
- 配置Nacos地址
- 重启

**步骤**

1. 引入依赖
```xml
<!--nacos 服务注册发现-->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

2. 配置Nacos

application.yml中添加nacos地址配置：

```yml
spring:
  application:
    name: item-service # 服务名称
  cloud:
    nacos:
      server-addr: 192.168.146.131:8848 # nacos地址
```

3. 重启项目

![](https://zzyang.oss-cn-hangzhou.aliyuncs.com/img/Snipaste_2025-05-07_21-24-42.png)

### 服务发现

服务的消费者要去nacos订阅服务，这个过程就是服务发现，步骤如下：
- 引入依赖
- 配置Nacos地址
- 发现并调用服务


消费者需要连接nacos以拉取和订阅服务，因此服务发现的前两步与服务注册是一样，后面再加上服务调用即可：

**步骤：**

1. 还是先添加依赖
```xml
<!--nacos 服务注册发现-->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

2. 添加yml文件
```yml
spring:
  cloud:
    nacos:
      server-addr: 192.168.150.101:8848
```

3. 发现并调用服务

接下来，服务调用者cart-service就可以去订阅item-service服务了。不过item-service有多个实例，而真正发起调用时只需要知道一个实例的地址。
因此，服务调用者必须利用负载均衡的算法，从多个实例中挑选一个去访问。常见的负载均衡算法有：
- 随机
- 轮询
- IP的hash
- 最近最少访问
- ...
这里我们可以选择最简单的随机负载均衡。

服务发现需要用到一个工具，DiscoveryClient，SpringCloud已经帮我们自动装配，我们可以直接注入使用：

```java
@RequiredArgsConstructor
public class


private final DiscoveryClient discoveryClient;



// 1.根据服务名称，拉取服务的实例列表
List<ServiceInstance> instances = discoveryClient.getInstances("item-service");
if (CollUtils.isEmpty(instances)) {
    return;
}
// 2.负载均衡，挑选一个实例
ServiceInstance instance = instances.get(RandomUtil.randomInt(instances.size()));
// 3.获取实例的IP和端口
ResponseEntity<List<ItemDTO>> response = restTemplate.exchange(instance.getUri() + "/items?ids={ids}",
        HttpMethod.GET,
        null,
        new ParameterizedTypeReference<List<ItemDTO>>() {
        },
        Map.of("ids", CollUtil.join(itemIds, ",")));
```

## OpenFeign
OpenFeign是一个声明式的http客户端，是SpringCloud在Eureka公司开源的Feign基础上改造而来。官方地址：https://github.com/OpenFeign/feign

其作用就是基于SpringMVC的常见注解，帮我们优雅的实现http请求的发送。



### 快速入门
OpenFeign已经被SpringCloud自动装配，实现起来非常简单：

1. 引入依赖，包括OpenFeign和负载均衡组件SpringCloudLoadBalancer
```xml
  <!--openFeign-->
  <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-starter-openfeign</artifactId>
  </dependency>
  <!--负载均衡器-->
  <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-starter-loadbalancer</artifactId>
  </dependency>
```

2. 通过@EnableFeignClients注解，启用OpenFeign功能
```java
@MapperScan("com.hmall.cart.mapper")
@SpringBootApplication
@EnableFeignClients
public class CartApplication {
    public static void main(String[] args) {
        SpringApplication.run(CartApplication.class, args);
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
```

3. 创建client文件夹ItemClient接口
```java
@FeignClient("item-service")
public interface ItemClient {

    @GetMapping("/items")
    List<ItemDTO> queryItemByIds(@RequestParam("ids") Collection ids);
}
```

4. 注入并调用
```java
@RequiredArgsConstructor

private final ItemClient itemClient;


Set<Long> itemIds = vos.stream().map(CartVO::getItemId).collect(Collectors.toSet());

List<ItemDTO> items = itemClient.queryItemByIds(itemIds);

if (CollUtils.isEmpty(items)) {
    return;
}
```

feign替我们完成了服务拉取、负载均衡、发送http请求的所有工作，是不是看起来优雅多了。

而且，这里我们不再需要RestTemplate了，还省去了RestTemplate的注册。


:::warning
注意：负载均衡早期用的是**springCloud**里的`Ribbon`，现在新版本都是用`loadbalancer`
:::