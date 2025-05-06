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


private final RestTemplate restTemplate;
```

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