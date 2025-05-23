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


### 连接池

OpenFeiqn对Http请求做了优雅的伪装，不过其底层发起http请求，依赖于其它的框架。这些框架可以自己选择，包括以下三种:
- HttpURLconnection:默认实现，不支持连接池
- Apache HttpClient:支持连接池
- OKHttp:支持连接池
具体源码可以参考FeignBlockingLoadBalancerClient类中的delegate成员变量

**使用步骤**

1. 引入依赖
```xml
<!--OK http 的依赖 -->
<dependency>
  <groupId>io.github.openfeign</groupId>
  <artifactId>feign-okhttp</artifactId>
</dependency>
```


2. 开启连接池功能
```yml
feign:
  okhttp:
    enabled: true # 开启OKHttp功能
```
重启服务，连接池就生效了。


### 实践

一个服务中的FeignClient需要被其他多个服务调用，我们就需要在每个不同服务中定义多个相同接口，这不是重复编码吗？ 有什么办法能加避免重复编码呢？

避免重复编码的办法就是抽取。不过这里有两种抽取思路：
- 思路1：抽取到微服务之外的公共module
- 思路2：每个微服务自己抽取一个module

![](https://zzyang.oss-cn-hangzhou.aliyuncs.com/img/Snipaste_2025-05-09_21-34-30.png)

方案1抽取更加简单，工程结构也比较清晰，但缺点是整个项目耦合度偏高。

方案2抽取相对麻烦，工程结构相对更复杂，但服务之间耦合度降低。

**方案2步骤**


抽取Feign客户端，新建一个moudule，`xxxx-api`

该模块依赖如下
```xml
 <!--open feign-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
<!-- load balancer-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-loadbalancer</artifactId>
</dependency>
<!-- swagger 注解依赖 -->
<dependency>
    <groupId>io.swagger</groupId>
    <artifactId>swagger-annotations</artifactId>
    <version>1.6.6</version>
    <scope>compile</scope>
</dependency>
```

把公共的客户端拷贝到该`xxxxx-api`模块



现在，任何微服务要调用`公共的FeignClient`中的接口，只需要引入`xxxx-api`模块依赖即可，无需自己编写Feign客户端了。


在其他服务中引入该api模块
```xml
  <!--feign模块-->
  <dependency>
      <groupId>com.heima</groupId>
      <artifactId>hm-api</artifactId>
      <version>1.0.0</version>
  </dependency>
```

重启项目，发现报错了：
![](https://zzyang.oss-cn-hangzhou.aliyuncs.com/img/Snipaste_2025-05-09_21-46-03.png)

这里因为ItemClient现在定义到了com.hmall.api.client包下，而cart-service的启动类定义在com.hmall.cart包下，扫描不到ItemClient，所以报错了。

解决办法很简单，在cart-service的启动类上添加声明即可，两种方式：

- 方式1：声明扫描包：
```java
@EnableFeignClients(basePackages = "com.hmall.api.client")
public class CartApplication {}
```

- 方式2：声明要用的FeignClient

```java
@EnableFeignClients(clients = {ItemClient.class})
public class CartApplication {}
```




### 日志配置
OpenFeign只会在FeignClient所在包的日志级别为DEBUG时，才会输出日志。而且其日志级别有4级:
- NONE:不记录任何日志信息，这是默认值。
- BASIC:仅记录请求的方法，URL以及响应状态码和执行时间
- HEADERS:在BASIC的基础上，额外记录了请求和响应的头信息
- FULL:记录所有请求和响应的明细，包括头信息、请求体、元数据。

由于Feign默认的日志级别就是NONE，所以默认我们看不到请求日志


在hm-api模块下新建一个配置类
```java

import feign.Logger;
import org.springframework.context.annotation.Bean;

public class DefaultFeignConfig {
    @Bean
    public Logger.Level feignLogLevel(){
        return Logger.Level.FULL;
    }
}
```

**配置**

在其他服务Module模块启动类中配置

接下来，要让日志级别生效，还需要配置这个类。有两种方式：
- 局部生效：在某个FeignClient中配置，只对当前FeignClient生效

```java
@FeignClient(value = "item-service", configuration = DefaultFeignConfig.class)
```

- 全局生效：在@EnableFeignClients中配置，针对所有FeignClient生效。
```java
@EnableFeignClients(defaultConfiguration = DefaultFeignConfig.class)
```


日志格式：
```java
22:18:52:730 DEBUG 9844 --- [nio-8082-exec-1] com.hmall.api.client.ItemClient          : [ItemClient#queryItemByIds] <--- HTTP/1.1 200  (1280ms)
22:18:52:730 DEBUG 9844 --- [nio-8082-exec-1] com.hmall.api.client.ItemClient          : [ItemClient#queryItemByIds] connection: keep-alive
22:18:52:730 DEBUG 9844 --- [nio-8082-exec-1] com.hmall.api.client.ItemClient          : [ItemClient#queryItemByIds] content-type: application/json
22:18:52:730 DEBUG 9844 --- [nio-8082-exec-1] com.hmall.api.client.ItemClient          : [ItemClient#queryItemByIds] date: Fri, 09 May 2025 14:18:52 GMT
22:18:52:730 DEBUG 9844 --- [nio-8082-exec-1] com.hmall.api.client.ItemClient          : [ItemClient#queryItemByIds] keep-alive: timeout=60
22:18:52:730 DEBUG 9844 --- [nio-8082-exec-1] com.hmall.api.client.ItemClient          : [ItemClient#queryItemByIds] transfer-encoding: chunked
22:18:52:730 DEBUG 9844 --- [nio-8082-exec-1] com.hmall.api.client.ItemClient          : [ItemClient#queryItemByIds] 
22:18:52:732 DEBUG 9844 --- [nio-8082-exec-1] com.hmall.api.client.ItemClient          : [ItemClient#queryItemByIds] [{"id":"100000006163","name":"巴布豆(BOBDOG)柔薄悦动婴儿拉拉裤XXL码80片(15kg以上)","price":67100,"stock":10000,"image":"https://m.360buyimg.com/mobilecms/s720x720_jfs/t23998/350/2363990466/222391/a6e9581d/5b7cba5bN0c18fb4f.jpg!q70.jpg.webp","category":"拉拉裤","brand":"巴布豆","spec":"{}","sold":11,"commentCount":33343434,"isAD":false,"status":2}]
22:18:52:732 DEBUG 9844 --- [nio-8082-exec-1] com.hmall.api.client.ItemClient          : [ItemClient#queryItemByIds] <--- END HTTP (371-byte body)
```

### 总结

- 如何利用OpenFeign实现远程调用?
1. 引入OpeFeign和SpringCloudLoadBalancer依赖
2. 利用@EnableFeignClients注解开启OpenFeiqn功能
3. 编写FeignClient
---
- 如何配置OpenFeign的连接池?
1. 引入http客户端依赖，例如OKHttp、HttpClient
2. 配置yaml文件，打开OpenFeign连接池开关
---
- OpenFeign使用的最佳实践方式是什么?

1. 由服务提供者编写独立module，将FeignClient及DTO抽取
---
- 如何配置OpenFeign输出日志的级别?
1. 声明类型为Logger.Level的Bean
2. 在@FeignClient或@EnableFeignclient注解上使用



## 网关路由

**网关**

就是网络的关口，负责请求的路由、转发、身份校验。

- 网关可以做安全控制，也就是登录身份校验，校验通过才放行
- 通过认证后，网关再根据请求判断应该访问哪个微服务，将请求转发过去

![](https://zzyang.oss-cn-hangzhou.aliyuncs.com/img/Snipaste_2025-05-12_20-16-42.png)

在SpringCloud当中，提供了两种网关实现方案：
- Netflix Zuul：早期实现，目前已经淘汰
- SpringCloudGateway：基于Spring的WebFlux技术，完全支持响应式编程，吞吐能力更强
![](https://zzyang.oss-cn-hangzhou.aliyuncs.com/img/Snipaste_2025-05-12_20-18-38.png)


### 使用步骤

1. 首先，我们要在根目录下创建一个新的module，命名为hm-gateway，作为网关微服务：

2. 引入依赖
```xml
 <dependencies>
    <!--common-->
    <dependency>
        <groupId>com.heima</groupId>
        <artifactId>hm-common</artifactId>
        <version>1.0.0</version>
    </dependency>
    <!--网关-->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-gateway</artifactId>
    </dependency>
    <!--nacos discovery-->
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    </dependency>
    <!--负载均衡-->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-loadbalancer</artifactId>
    </dependency>
</dependencies>
<build>
    <finalName>${project.artifactId}</finalName>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>
```



3. 启动类

```java
@SpringBootApplication
public class GatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }
}
```

4. 配置路由

接下来，在hm-gateway模块的resources目录新建一个application.yaml文件


```yaml
server:
  port: 8080
spring:
  application:
    name: gateway
  cloud:
    nacos:
      server-addr: 192.168.150.101:8848
    gateway:
      routes:
        - id: item # 路由规则id，自定义，唯一
          uri: lb://item-service # 路由的目标服务，lb代表负载均衡，会从注册中心拉取服务列表
          predicates: # 路由断言，判断当前请求是否符合当前规则，符合则路由到目标服务
            - Path=/items/**,/search/** # 这里是以请求路径作为判断规则
        - id: cart
          uri: lb://cart-service
          predicates:
            - Path=/carts/**
        - id: user
          uri: lb://user-service
          predicates:
            - Path=/users/**,/addresses/**
        - id: trade
          uri: lb://trade-service
          predicates:
            - Path=/orders/**
        - id: pay
          uri: lb://pay-service
          predicates:
            - Path=/pay-orders/**

```


### 路由属性
网关路由对应的Java类型是`RouteDefinition`，其中常见的属性有

四个属性含义如下：
- `id`：路由的唯一标示
- `predicates`：路由断言，其实就是匹配条件
- `filters`：路由过滤条件，后面讲
- `uri`：路由目标地址，`lb://`代表负载均衡，从注册中心获取目标微服务的实例列表，并且负载均衡选择一个访问。

我们重点关注predicates，也就是路由断言。SpringCloudGateway中支持的断言类型有很多：

Spring提供了12种基本的`RoutePredicateFactory`实现:

|  名称  |    说明       |   示例        |
|  ----  |---------------|    ----|
|   After |      是某个时间点后的请求     |    - After=2037-01-20T17:42:47.789-07:00[America/Denver]    |
|  Before  |     是某个时间点之前的请求      |    - Before=2031-04-13T15:14:47.433+08:00[Asia/Shanghai]    |
|  Between  |    是某两个时间点之前的请求       |- Between=2037-01-20T17:42:47.789-07:00[America/Denver], 2037-01-21T17:42:47.789-07:00[America/Denver]|
|  Cookie  |      请求必须包含某些cookie     |     - Cookie=chocolate, ch.p   |
|  Header  |      请求必须包含某些header     |    - Header=X-Request-Id, \d+    |
|   Host |       请求必须是访问某个host（域名）    |    - Host=**.somehost.org,**.anotherhost.org    |
|   Method |     请求方式必须是指定方式      |     - Method=GET,POST   |
|   Path |       请求路径必须符合指定规则     |    - Path=/red/{segment},/blue/**    |
|  Query  |         请求参数必须包含指定参数   |     - Query=name, Jack或者- Query=name   |
|  RemoteAddr  |    请求者的ip必须是指定范围        |    - RemoteAddr=192.168.1.1/24    |
|  weight  |       权重处理     |        |



#### 路由过滤器

网关中提供了33种路由过滤器，每种过滤器都有独特的作用。

![](https://zzyang.oss-cn-hangzhou.aliyuncs.com/img/Snipaste_2025-05-12_21-34-18.png)

**测试1**
在gateway中配置

```yaml{13-14} yaml
spring:
  application:
    name: gateway
  cloud:
    nacos:
      server-addr: 192.168.146.131:8848
    gateway:
      routes:
        - id: item-service
          uri: lb://item-service
          predicates:
            - Path=/items/**,/search/**
          filters:
            - AddRequestHeader=truth, 123456
```

```java
public PageDTO<ItemDTO> queryItemByPage(PageQuery query, @RequestHeader(value = "truth", required = false) String truth) {
        System.out.println("truth" + truth);
```


**测试2**
默认过滤器，对所有路由都生效

```yaml{23-24}  yaml
    gateway:
      routes:
        - id: item-service
          uri: lb://item-service
          predicates:
            - Path=/items/**,/search/**
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/addresses/**,/users/**
        - id: cart-service
          uri: lb://cart-service
          predicates:
            - Path=/carts/**
        - id: pay-service
          uri: lb://pay-service
          predicates:
            - Path=/pay-orders/**
        - id: trade-service
          uri: lb://trade-service
          predicates:
            - Path=/orders/**
      default-filters:
        - AddRequestHeader=truth, 123456
```

### 网关过滤器

登录校验必须在请求转发到微服务之前做，否则就失去了意义。而网关的请求转发是Gateway内部代码实现的，要想在请求转发之前做登录校验，就必须了解Gateway内部工作的基本原理。

![](https://zzyang.oss-cn-hangzhou.aliyuncs.com/img/Snipaste_2025-05-12_21-55-02.png)

如图所示：
1. 客户端请求进入网关后由`HandlerMapping`对请求做判断，找到与当前请求匹配的路由规则（Route），然后将请求交给`WebHandler`去处理。
2. `WebHandler`则会加载当前路由下需要执行的过滤器链（Filter chain），然后按照顺序逐一执行过滤器（后面称为Filter）。
3. 图中`Filter`被虚线分为左右两部分，是因为`Filter`内部的逻辑分为`pre`和`post`两部分，分别会在请求路由到微服务之前和之后被执行。
4. 只有所有`Filter`的`pre`逻辑都依次顺序执行通过后，请求才会被路由到微服务。
5. 微服务返回结果后，再倒序执行`Filter`的`post`逻辑。
6. 最终把响应结果返回。

最终请求转发是有一个名为`NettyRoutingFilter`的过滤器来执行的，而且这个过滤器是整个过滤器链中顺序最靠后的一个。**如果我们能够定义一个过滤器，在其中实现登录校验逻辑，并且将过滤器执行顺序定义到`NettyRoutingFilter`之前**，这就符合我们的需求了！

那么，该如何实现一个网关过滤器呢？

网关过滤器链中的过滤器有两种：
- `GatewayFilter`：路由过滤器，作用范围比较灵活，可以是任意指定的路由`Route`. 
- `GlobalFilter`：全局过滤器，作用范围是所有路由，不可配置。


### 自定义过滤器
无论是GatewayFilter还是GlobalFilter都支持自定义，只不过编码方式、使用方式略有差别。

网关过滤器有两种，分别是:
- `GatewayFilter`:路由过滤器，作用于任意指定的路由;默认不生效，要配置到路由后生效。
- `GlobalFilter`:全局过滤器，作用范围是所有路由;声明后自动生效



#### GlobalFilter

![](https://zzyang.oss-cn-hangzhou.aliyuncs.com/img/Snipaste_2025-05-14_20-22-25.png)

`gateway`包下创建`filters`,再创建`MyGlobalFilter`
```java
@Component
public class MyGlobalFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // 模拟登录校验
        ServerHttpRequest exchangeRequest = exchange.getRequest();
        HttpHeaders headers = exchangeRequest.getHeaders();
        System.out.println("headers:" + headers);
        // 放行
        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
    // 过滤器执行顺序，值越小，优先级越高
        return 0;
    }
}
```


### 实现登录校验
需求:在网关中基于过滤器实现登录校验功能

```java [AuthGlobalFilter.java]
@Component
@RequiredArgsConstructor
@Slf4j
public class AuthGlobalFilter implements GlobalFilter, Ordered {

    private final AuthProperties authProperties;
    private final JwtTool jwtTool;
    private final AntPathMatcher antPathMatcher = new AntPathMatcher();

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        if (isExculed(request.getPath().toString())) {
            return chain.filter(exchange);
        }
        String token = null;
        List<String> headers = request.getHeaders().get("authorization");
        if (headers != null && !headers.isEmpty()) {
            token = headers.get(0);
        }
        Long userId = null;
        try {
            userId = jwtTool.parseToken(token);
        } catch (UnauthorizedException e) {
            ServerHttpResponse response = exchange.getResponse();
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return response.setComplete();
        }
        // 传递用户信息
        log.info("userId:{}", userId);

        return chain.filter(exchange);
    }

    private boolean isExculed(String string) {
        for (String excludePath : authProperties.getExcludePaths()) {
            if (antPathMatcher.match(excludePath, string)) {
                return true;
            }
        }
        return false;
    }

    @Override
    public int getOrder() {
        return 0;
    }
}
```

```yaml [application.yaml]
hm:
  jwt:
    location: classpath:hmall.jks
    alias: hmall
    password: hmall123
    tokenTTL: 30m
  auth:
    excludePaths:
      - /search/**
      - /users/login
      - /items/**
      - /hi
```

**utils**
```java
@Component
public class JwtTool {
    private final JWTSigner jwtSigner;

    public JwtTool(KeyPair keyPair) {
        this.jwtSigner = JWTSignerUtil.createSigner("rs256", keyPair);
    }

    /**
     * 创建 access-token
     *
     * @param
     * @return access-token
     */
    public String createToken(Long userId, Duration ttl) {
        // 1.生成jws
        return JWT.create()
                .setPayload("user", userId)
                .setExpiresAt(new Date(System.currentTimeMillis() + ttl.toMillis()))
                .setSigner(jwtSigner)
                .sign();
    }

    /**
     * 解析token
     *
     * @param token token
     * @return 解析刷新token得到的用户信息
     */
    public Long parseToken(String token) {
        // 1.校验token是否为空
        if (token == null) {
            throw new UnauthorizedException("未登录");
        }
        // 2.校验并解析jwt
        JWT jwt;
        try {
            jwt = JWT.of(token).setSigner(jwtSigner);
        } catch (Exception e) {
            throw new UnauthorizedException("无效的token", e);
        }
        // 2.校验jwt是否有效
        if (!jwt.verify()) {
            // 验证失败
            throw new UnauthorizedException("无效的token");
        }
        // 3.校验是否过期
        try {
            JWTValidator.of(jwt).validateDate();
        } catch (ValidateException e) {
            throw new UnauthorizedException("token已经过期");
        }
        // 4.数据格式校验
        Object userPayload = jwt.getPayload("user");
        if (userPayload == null) {
            // 数据为空
            throw new UnauthorizedException("无效的token");
        }

        // 5.数据解析
        try {
           return Long.valueOf(userPayload.toString());
        } catch (RuntimeException e) {
            // 数据格式有误
            throw new UnauthorizedException("无效的token");
        }
    }
}
```

```java [AuthProperties.java]
@Data
@Component
@ConfigurationProperties(prefix = "hm.auth")
public class AuthProperties {
    private List<String> includePaths;
    private List<String> excludePaths;
}
```


```java [JwtProperties.java]
@Data
@ConfigurationProperties(prefix = "hm.jwt")
public class JwtProperties {
    private Resource location;
    private String password;
    private String alias;
    private Duration tokenTTL = Duration.ofMinutes(10);
}
```

```java [SecurityConfig.java]
@Configuration
@EnableConfigurationProperties(JwtProperties.class)
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public KeyPair keyPair(JwtProperties properties){
        // 获取秘钥工厂
        KeyStoreKeyFactory keyStoreKeyFactory =
                new KeyStoreKeyFactory(
                        properties.getLocation(),
                        properties.getPassword().toCharArray());
        //读取钥匙对
        return keyStoreKeyFactory.getKeyPair(
                properties.getAlias(),
                properties.getPassword().toCharArray());
    }
}
```


具体作用如下：
- `AuthProperties`：配置登录校验需要拦截的路径，因为不是所有的路径都需要登录才能访问
- `JwtProperties`：定义与JWT工具有关的属性，比如秘钥文件位置
- `SecurityConfig`：工具的自动装配
- `JwtTool`：JWT工具，其中包含了校验和解析token的功能
- `hmall.jks`：秘钥文件

:::info
`@ConfigurationProperties(prefix = "hm.auth")` 是 Spring Boot 提供的一个注解，用于将配置文件（如 `application.properties` 或 `application.yml`）中的属性值绑定到 Java 对象中。
<br>
<br>

`AntPathMatcher` 是 Spring 框架提供的一个工具类，用于匹配路径模式（`Path Patterns`）。在权限控制中验证用户是否有权访问某个路径。
:::

```java
antPathMatcher.match("/user/*.json", "/user/profile.json"); // true
antPathMatcher.match("/**/*.html", "/pages/home/index.html"); // true
```


### 网关传递用户

1. 我们修改登录校验拦截器的处理逻辑，保存用户信息到请求头中：
```java
@Component
@RequiredArgsConstructor
@Slf4j
public class AuthGlobalFilter implements GlobalFilter, Ordered {

    private final AuthProperties authProperties;
    private final JwtTool jwtTool;
    private final AntPathMatcher antPathMatcher = new AntPathMatcher();

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        if (isExculed(request.getPath().toString())) {
            return chain.filter(exchange);
        }
        String token = null;
        List<String> headers = request.getHeaders().get("authorization");
        if (headers != null && !headers.isEmpty()) {
            token = headers.get(0);
        }
        Long userId = null;
        try {
            userId = jwtTool.parseToken(token);
        } catch (UnauthorizedException e) {
            ServerHttpResponse response = exchange.getResponse();
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return response.setComplete();
        }
        // 传递用户信息
        String userInfo = userId.toString();
        ServerWebExchange serverWebExchange = exchange.mutate()  // mutate就是对下游请求做更改
                .request(builder -> builder.header("user-info", userInfo))
                .build();
        log.info("userId:{}", userId);

        return chain.filter(serverWebExchange);
    }

    private boolean isExculed(String string) {
        for (String excludePath : authProperties.getExcludePaths()) {
            if (antPathMatcher.match(excludePath, string)) {
                return true;
            }
        }
        return false;
    }

    @Override
    public int getOrder() {
        return 0;
    }
}
```

2. 在hm-common中编写`SpringMVC`拦截器，获取登录用户

需求:由于每个微服务都可能有获取登录用户的需求，因此我们直接在hm-common模块定义拦截器
这样微服务只需要引入依赖即可生效，无需重复编写。

```java [UserInfoInterceptor.java]
public class UserInfoInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 获取登录用户信息
        String userInfo = request.getHeader("user-info");
        // 是否获取了用户，如果有存入ThreadLocal
        if (StrUtil.isNotBlank(userInfo)) {
            UserContext.setUser(Long.valueOf(userInfo));
        }
        // 放行
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        UserContext.removeUser();
    }
}
```

```java [MvcConfig.java]
@Configuration
@ConditionalOnClass(DispatcherServlet.class)
public class MvcConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new UserInfoInterceptor());
    }
}
```

不过，需要注意的是，这个配置类默认是不会生效的，因为它所在的包是`com.hmall.common.config`，与其它微服务的扫描包不一致，无法被扫描到，因此无法生效。
基于`SpringBoot`的自动装配原理，我们要将其添加到`resources`目录下的`META-INF/spring.factories`文件中：

common的`resources`下的`META-INF`
``` [spring.factories]
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
  com.hmall.common.config.MyBatisConfig,\
  com.hmall.common.config.JsonConfig,\
  com.hmall.common.config.MvcConfig
```

`common`的`utils`包下的`UserContext`
```java [UserContext.java]
public class UserContext {
    private static final ThreadLocal<Long> tl = new ThreadLocal<>();

    /**
     * 保存当前登录用户信息到ThreadLocal
     * @param userId 用户id
     */
    public static void setUser(Long userId) {
        tl.set(userId);
    }

    /**
     * 获取当前登录用户信息
     * @return 用户id
     */
    public static Long getUser() {
        return tl.get();
    }

    /**
     * 移除当前登录用户信息
     */
    public static void removeUser(){
        tl.remove();
    }
}
```

:::tip
`@ConditionalOnClass` 的作用是检查类路径中是否存在指定的类。如果存在，则加载被标注的配置或组件；否则，忽略该配置。

在微服务或多模块项目中，可以根据运行时的类路径动态加载不同的配置。我们希望他在网关中不要加载，因为网关是基于`WebFlux`加载会报错
:::


### OpenFeign传递用户
微服务之间传递用户信息

前端发起的请求都会经过网关再到微服务，由于我们之前编写的过滤器和拦截器功能，微服务可以轻松获取登录用户信息。

但有些业务是比较复杂的，请求到达微服务后还需要调用其它多个微服务。比如下单业务，流程如下：
![](https://zzyang.oss-cn-hangzhou.aliyuncs.com/img/Snipaste_2025-05-14_21-52-23.png)

下单的过程中，需要调用商品服务扣减库存，调用购物车服务清理用户购物车。而清理购物车时必须知道当前登录的用户身份。但是，**订单服务调用购物车时并没有传递用户信息**，购物车服务无法知道当前用户是谁！

由于微服务获取用户信息是通过拦截器在请求头中读取，因此要想实现微服务之间的用户信息传递，就**必须在微服务发起调用时把用户信息存入请求头**。



OpenFeign中提供了一个拦截器接口，所有由OpenFeign发起的请求都会先调用拦截器处理请求：

由于FeignClient全部都是在hm-api模块，因此我们在hm-api模块的com.hmall.api.config.DefaultFeignConfig中编写这个拦截器：


在hm-api中的config的`DefaultFeignConfig`中
```java
public class DefaultFeignConfig {
    @Bean
    public Logger.Level feignLogLevel() {
        return Logger.Level.FULL;
    }

    @Bean
    public RequestInterceptor userInfoRequestInterceptor() {
        return new RequestInterceptor() {
            @Override
            public void apply(RequestTemplate requestTemplate) {
                Long userId = UserContext.getUser();
                if (userId != null) {
                    requestTemplate.header("user-info", userId.toString());
                }
            }
        };
    }
}
```

启动类上配置
```java
@EnableFeignClients(basePackages = "com.hmall.api.client", defaultConfiguration = DefaultFeignConfig.class)
public class TradeApplication {}
```

好了，现在微服务之间通过OpenFeign调用时也会传递登录用户信息了。









![](https://zzyang.oss-cn-hangzhou.aliyuncs.com/img/Snipaste_2025-05-14_22-07-04.png)




## 配置管理

- 微服务重复配置过多，维护成本高
- 业务配置经常变动，每次修改都要重启服务
- 网关路由配置写死，如果变更要重启网关

### 配置共享


1. 添加配置到`Nacos`

添加一些共享配置到`Nacos`中，包括:`Jdbc`、`MybatisPlus`、日志、`Swagger`、`OpenFeign`等配置

```yaml [shared-jdbc.yaml]
spring:
  datasource:
    url: jdbc:mysql://${hm.db.host}:${hm.db.port:3306}/${hm.db.database}?useUnicode=true&characterEncoding=UTF-8&autoReconnect=true&serverTimezone=Asia/Shanghai
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: ${hm.db.un:root}
    password: ${hm.db.pw:123}
mybatis-plus:
  configuration:
    default-enum-type-handler: com.baomidou.mybatisplus.core.handlers.MybatisEnumTypeHandler
  global-config:
    db-config:
      update-strategy: not_null
      id-type: auto
```

```yaml [shared-log.yaml]
logging:
  level:
    com.hmall: debug
  pattern:
    dateformat: HH:mm:ss:SSS
  file:
    path: "logs/${spring.application.name}"
```

```yaml [shared-swagger.yaml]
knife4j:
  enable: true
  openapi:
    title: ${hm.swagger.title:黑马商城接口文档}
    description: ${hm.swagger.desc:黑马商城接口文档}
    email: zxyang3636@163.com
    concat: zzyang
    url: https://www.zzyang.top
    version: v1.0.0
    group:
      default:
        group-name: default
        api-rule: package
        api-rule-resources:  # Swagger扫描到Controller，会把Controller接口信息作为接口文档信息
          - ${hm.swagger.package}
```

2. 拉取共享配置

![](https://zzyang.oss-cn-hangzhou.aliyuncs.com/img/Snipaste_2025-05-15_19-56-07.png)

读取Nacos配置是SpringCloud上下文（ApplicationContext）初始化时处理的，发生在项目的引导阶段。然后才会初始化SpringBoot上下文，去读取application.yaml。
也就是说引导阶段，application.yaml文件尚未读取，根本不知道nacos 地址，该如何去加载nacos中的配置文件呢？

SpringCloud在初始化上下文的时候会先读取一个名为bootstrap.yaml(或者bootstrap.properties)的文件，如果我们将nacos地址配置到bootstrap.yaml中，那么在项目引导阶段就可以读取nacos中的配置了。

**引入依赖**

```xml
  <!--nacos配置管理-->
  <dependency>
      <groupId>com.alibaba.cloud</groupId>
      <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
  </dependency>
  <!--读取bootstrap文件-->
  <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-starter-bootstrap</artifactId>
  </dependency>
```

新建`bootstrap.yaml`

在cart-service中的resources目录新建一个bootstrap.yaml文件：

*内容如下：*
```yaml
spring:
  application:
    name: cart-service # 服务名称
  profiles:
    active: dev
  cloud:
    nacos:
      server-addr: 192.168.146.131:8848 # nacos地址
      config:
        file-extension: yaml # 文件后缀名
        shared-configs: # 共享配置
          - dataId: shared-jdbc.yaml # 共享mybatis配置
          - dataId: shared-log.yaml # 共享日志配置
          - dataId: shared-swagger.yaml # 共享日志配置
```


修改`application.yaml`

```yaml
server:
  port: 8082
feign:
  okhttp:
    enabled: true # 开启OKHttp连接池支持
hm:
  swagger:
    title: 购物车服务接口文档
    package: com.hmall.cart.controller
  db:
    database: hm-cart
```

重启服务，发现所有配置都生效了。

### 配置热更新

![](https://zzyang.oss-cn-hangzhou.aliyuncs.com/img/wechat_2025-05-15_202238_944.png)

1. 新建配置文件
```java [CartProperties.java]
@Data
@Component
@ConfigurationProperties(prefix = "hm.cart")
public class CartProperties {
    private Integer maxItems;
}
```

**注入**
```java
@Service
@RequiredArgsConstructor
public class CartServiceImpl extends ServiceImpl<CartMapper, Cart> implements ICartService {}

private final CartProperties cartProperties;

```

**改造代码**
```java
  private void checkCartsFull(Long userId) {
        int count = lambdaQuery().eq(Cart::getUserId, userId).count().intValue();
        if (count >= cartProperties.getMaxItems()) {
            throw new BizIllegalException(StrUtil.format("用户购物车课程不能超过{}", cartProperties.getMaxItems()));
        }
    }

```

2. nacos中创建

注意文件的dataId格式：
```
[服务名]-[spring.active.profile].[后缀名]
```

文件名称由三部分组成：
- 服务名：我们是购物车服务，所以是cart-service
- spring.active.profile：就是spring boot中的spring.active.profile，可以省略，则所有profile共享该配置
- 后缀名：例如yaml

我们直接使用`cart-service.yaml`这个名称，则不管是dev还是local环境都可以共享该配置。

```yaml [cart-service.yaml]
hm:
  cart:
    maxItems: 1 # 购物车商品数量上限
```

后续修改`maxItems`，无需重启服务，配置热更新就生效了！

### 动态路由

监听Nacos配置变更可以参考官方文档： https://nacos.io/zh-cn/docs/sdk.html


1. 网关中引入依赖
```xml
 <!--nacos配置管理-->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
</dependency>
<!--读取bootstrap文件-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-bootstrap</artifactId>
</dependency>
```


网关的bootstrap.yaml文件
```yaml [bootstrap.yaml]
spring:
  application:
    name: gateway
  cloud:
    nacos:
      server-addr: 192.168.146.131:8848
      config:
        file-extension: yaml
        shared-configs:
          - data-id: shared-log.yaml
  profiles:
    active: dev
```

```yaml [application.yaml]
server:
  port: 8080

hm:
  jwt:
    location: classpath:hmall.jks
    alias: hmall
    password: hmall123
    tokenTTL: 30m
  auth:
    excludePaths:
      - /search/**
      - /users/login
      - /items/**
      - /hi
```

网关中，新建`routers/DynamicRouteLoader.java`

```java
@Slf4j
@Component
@RequiredArgsConstructor
public class DynamicRouteLoader {

    private final NacosConfigManager nacosConfigManager;
    private final RouteDefinitionWriter writer;

    private final String dataId = "gateway-routes.json";
    private final String group = "DEFAULT_GROUP";

    private final Set<String> routeIds = new HashSet<>();

    @PostConstruct
    public void initRouteConfigListener() throws NacosException {
        // 项目启动时，先拉取一次配置，并添加配置监听器
        String configInfo = nacosConfigManager.getConfigService()
                .getConfigAndSignListener(dataId, group, 5000, new Listener() {
                    @Override
                    public Executor getExecutor() {
                        return null;
                    }

                    @Override
                    public void receiveConfigInfo(String configInfo) {
                        // 2.监听到配置变更，更新路由表
                        updateConfigInfo(configInfo);
                    }
                });
        // 3.第一次读取到配置，也需要更新到路由表
        updateConfigInfo(configInfo);
    }

    public void updateConfigInfo(String configInfo) {
        log.debug("监听到路由配置信息：{}", configInfo);
        // 1.解析配置信息，转为RouteDefinition
        List<RouteDefinition> routeDefinitionList = JSONUtil.toList(configInfo, RouteDefinition.class);
        // 删除旧的路由表
        for (String routeId : routeIds) {
            writer.delete(Mono.just(routeId));
        }
        routeIds.clear();
        // 2.更新路由表
        for (RouteDefinition routeDefinition : routeDefinitionList) {
            // 更新路由表
            writer.save(Mono.just(routeDefinition)).subscribe();
            // 记录路由id，便于下一次更新时删除
            routeIds.add(routeDefinition.getId());
        }
    }
}
```



nacos配置

![](https://zzyang.oss-cn-hangzhou.aliyuncs.com/img/Snipaste_2025-05-15_22-16-38.png)

`gateway-routes.json`

```json
[
    {
        "id": "item",
        "predicates": [{
            "name": "Path",
            "args": {"_genkey_0":"/items/**", "_genkey_1":"/search/**"}
        }],
        "filters": [],
        "uri": "lb://item-service"
    },
    {
        "id": "cart",
        "predicates": [{
            "name": "Path",
            "args": {"_genkey_0":"/carts/**"}
        }],
        "filters": [],
        "uri": "lb://cart-service"
    },
    {
        "id": "user",
        "predicates": [{
            "name": "Path",
            "args": {"_genkey_0":"/users/**", "_genkey_1":"/addresses/**"}
        }],
        "filters": [],
        "uri": "lb://user-service"
    },
    {
        "id": "trade",
        "predicates": [{
            "name": "Path",
            "args": {"_genkey_0":"/orders/**"}
        }],
        "filters": [],
        "uri": "lb://trade-service"
    },
    {
        "id": "pay",
        "predicates": [{
            "name": "Path",
            "args": {"_genkey_0":"/pay-orders/**"}
        }],
        "filters": [],
        "uri": "lb://pay-service"
    }
]
```

