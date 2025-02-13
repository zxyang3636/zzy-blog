# SSE(Server-Sent Events)

## 什么是 SSE

    服务器发送事件(Server-Sent Events，简称SSE)
    SSE，就是浏览器向服务器发送一个HTTP请求，然后服务器不断单向地向浏览器推送“信息”(message)。
    这种信息在格式上很简单，就是“信息”加上前缀“data:”，然后以“\n\n”结尾。

## SSE 应用场景

    服务器向浏览器“发送”数据，比如，每当收到新的电子邮件，服务器就向浏览器发送一个“通知”

![alt text](../../public/UQ51t4Il.png)

## SSE 与 Websocket

SSE 与 WebSocket 有相似功能，都是用来建立浏览器与服务器之间的通信渠道。两者的区别在于:

- WebSocket 是全双工通道，可以双向通信，功能更强;SSE 是单向通道，只能服务器向浏览器端发送。
- SSE 是一个轻量级协议，相对简单; WebSocket 是一种较重的协议，相对复杂。

## 实现方式 1

**前端**

![](../../public/JRdzSgdW.png)

**后端**

```java [MessageNoticeController]
@RestController
@RequestMapping("/messageObtain")
@Slf4j
public class MessageNoticeController {

    @PostMapping("/getStreamData")
    public String getStreamData(HttpServletResponse response) {
        response.setContentType("text/event-stream");
        response.setCharacterEncoding("utf-8");
        String str = "";
        while (true) {
            str = "data:" + new Date() + "\n\n";
            PrintWriter writer = null;
            try {
                Thread.sleep(1000);
                writer = response.getWriter();
            } catch (IOException | InterruptedException e) {
                throw new RuntimeException(e);
            }
            writer.write(str);
//            log.info(str);
            writer.flush();
        }
    }
}
```

::: tip
响应是主要的

response.setContentType("text/event-stream");
:::

## 实现方式 2

**前端**

```vue
<template>
  <div>
    <h1>SSE Messages</h1>
    <ul>
      <li v-for="message in messages" :key="message.id">{{ message.data }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

interface SseMessage {
  id: string;
  data: string;
}

const messages = ref<SseMessage[]>([]);

onMounted(() => {
  const eventSource = new EventSource('http://localhost:8080/api/sse/events');

  eventSource.onmessage = (event) => {
    const parsedData: SseMessage = JSON.parse(event.data);
    messages.value = [...messages.value, parsedData];
  };

  eventSource.onerror = () => {
    console.error('EventSource failed.');
    eventSource.close();
  };
});
</script>

<style scoped>
/* Add some styles here */
</style>
```

**后端**

```java
package com.example.demo.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@RestController
@RequestMapping("/api/sse")
public class SseController {

    private final ExecutorService executorService = Executors.newCachedThreadPool();

    @GetMapping(value = "/events", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter handleSse() {
        // 设置超时时间为1小时
        SseEmitter emitter = new SseEmitter(3600000L);

        // 处理客户端断开连接回调
        emitter.onCompletion(() -> {
            System.out.println("Connection completed");
        });

        // 设置超时回调
        emitter.onTimeout(() -> {
            System.out.println("Connection timed out");
            emitter.complete();
        });
         // 设置错误回调
        emitter.onError((ex) -> {
            System.err.println("SSE 连接出错: " + ex.getMessage());
            emitter.completeWithError(ex);
        });

        // 模拟每两秒发送一次消息到客户端，总共发送十次
        executorService.execute(() -> {
            try {
                for (int i = 0; i < 10; i++) {
                    SseEmitter.SseEventBuilder event = SseEmitter.event()
                            .data("SSE message " + i)
                            .id("" + i)
                            .name("sseEvent");

                    emitter.send(event);
                    Thread.sleep(2000);
                }
                emitter.complete();
            } catch (IOException | InterruptedException e) {
                emitter.completeWithError(e);
            }
        });

        return emitter;
    }
}

```

## 实现方式 3

```java
package com.example.ssedemo.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@RestController
@RequestMapping("/sse")
public class SseController {

    private final ExecutorService executor = Executors.newCachedThreadPool();

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamEvents() {
        // 创建一个 SseEmitter 实例，设置超时时间为 0（永不超时）
        SseEmitter emitter = new SseEmitter(0L);

        // 异步发送事件
        executor.execute(() -> {
            try {
                for (int i = 1; i <= 10; i++) {
                    // 模拟每秒发送一次数据
                    Thread.sleep(1000);
                    emitter.send(SseEmitter.event()
                            .id(String.valueOf(i))
                            .name("message")
                            .data("Event " + i));
                }
                // 完成事件流
                emitter.complete();
            } catch (IOException | InterruptedException e) {
                emitter.completeWithError(e);
            }
        });

        return emitter;
    }
}
```

```vue
<template>
  <div>
    <h1>Server-Sent Events (SSE) Demo</h1>
    <button @click="startSSE">Start SSE</button>
    <ul>
      <li v-for="(event, index) in events" :key="index">{{ event }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 定义响应式变量
const events = ref<string[]>([]);
let eventSource: EventSource | null = null;

// 启动 SSE 连接
const startSSE = () => {
  if (eventSource) {
    eventSource.close(); // 如果已经有连接，先关闭
  }

  // 创建 EventSource 连接到后端 SSE 端点
  eventSource = new EventSource('http://localhost:8080/sse/stream');

  // 监听消息事件
  eventSource.addEventListener('message', (event: MessageEvent) => {
    console.log('Received event:', event.data);
    events.value.push(event.data); // 将接收到的消息添加到列表中
  });

  // 监听错误事件
  eventSource.onerror = (error: Event) => {
    console.error('EventSource failed:', error);
    eventSource?.close(); // 关闭连接
  };
};
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 5px 0;
}
</style>
```