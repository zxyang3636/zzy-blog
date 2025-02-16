# 线程池

## 为什么要使用线程池？

在没有使用线程池之前，是这样执行任务的

一个线程只能执行一个任务，不能连续执行任务

```java [Task]
public class Task implements Runnable {
    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName());
    }
}
```

```java [Main]
public class Main {
    public static void main(String[] args) {
        Task task = new Task();
        Thread thread = new Thread(task);
        thread.start();
    }
}
```

![](../../public/img/230480sdaf.png)

这暴露了一个问题，线程不能复用，重复创建和销毁线程耗时耗资源，若能复用就好了，复用的好处就是省时省资源

看线程池如何执行⤵️

创建只有一个线程的线程池，这个线程池中只有一个线程，重点是它里面的线程可以复用

```java
public class Main {
    public static void main(String[] args) {
        Runnable task1 = new Task();
        Runnable task2 = new Task();
        Runnable task3 = new Task();

        ExecutorService threadPool = Executors.newSingleThreadExecutor();
        threadPool.execute(task1);
        threadPool.execute(task2);
        threadPool.execute(task3);

        threadPool.shutdown();
    }
}
```
说明一个线程执行了3个任务
![](../../public/img/30294805.png)

## **线程池的好处**
1. 降低资源消耗:通过重复利用已创建的线程降低线程创建和销毁造成的消耗
2. 提高响应速度:当有任务时，任务可以不需要等到线程创建就能立即执行
3. 提高线程的可管理性:线程是稀缺资源，如果无限制的创建，不仅会消耗系统资源，还会降低系统的稳定性，线程池可以进行统一的分配，调优和监控

## 什么是线程池

线程池是一种基于池化思想管理线程的工具

在没有线程池之前，当有任务需要执行时，我们会创建一个线程，然后将任务传递给线程，并且一个线程只能执行一个任务，如果还有任务，我们就只能再创建一个线程去执行它，当任务执行完时，线程就销毁了，重复创建和销毁线程是一件很耗时耗资源的事，如果线程能复用，那么就减少很多不必要的消耗，于是线程池就孕育而生了，事先将线程创建好，当有任务需要执行时，提交给线程池，线程池分配线程去执行，有再多的任务也不怕线程池中的线程能复用，执行完一个任务，再接着执行其他任务，当所有任务都执行完时，我们可以选择关闭线程池，也可以选择等待接收任务。

<br>

## 原生方式创建线程池

**线程池核心UML类图**

![](../../public/img/1414142354364363.png)

`ThreadPoolExecutor`是线程池核心类，它一共有四个构造方法

![](../../public/img/fjowieqgongfwopej.png)

最复杂的说起，它一共有7个参数⤵️
```java [ThreadPoolExecutor.java]
public ThreadPoolExecutor(int corePoolSize,
                        int maximumPoolSize,
                        long keepAliveTime,
                        TimeUnit unit,
                        BlockingQueue<Runnable> workQueue,
                        ThreadFactory threadFactory,
                        RejectedExecutionHandler handler) 
```

参数含义：
| 参数        |      描述      |
| ------------- | :-----------:|
| corePoolSize      | 核心线程数|
| maximumPoolSize      |   最大线程数   |
| keepAliveTime      |   空闲线程存活时间   |
| unit      |   时间单位   |
| workQueue |   任务队列   |
| threadFactory |   线程工厂   |
| handler |   拒绝任务策略   |

**参数解析：**
![](../../public/img/wqeoirugnoasidfj.png)

核心线程的好处：只要线程池不关闭，就不会被销毁

最大线程数：表示线程池中最多允许有25个线程

除去核心线程之外的线程是非核心线程，非核心线程没有执行任务的话，是要被清理的，在被清理之前能存活多久取决于第三个和第四个参数；
当任务都执行完以后，所有线程都成了空闲线程，还是要分核心与非核心线程，再过十秒，若非核心线程没有工作，就要被销毁，剩下的都是核心线程

workQueue是任务队列，线程池中的线程们也都是在这领取的任务，我一般用的是 `LinkedBlockingQueue`链式阻塞队列，基于链表的阻塞队列；还有一个常用的是`ArrayBlockingQueue`数组阻塞队列，这是一个基于数组的阻塞队列

threadFactory：线程工厂，指定线程该如何生产，它是一个接口,实现它里面的 newThread 方法,可以自定义线程的相关设置; 例如：可以指定线程名称，还可以指定是否为后台线程

```java [ThreadFactory.java]
public interface ThreadFactory {

    /**
    *  构造一个新线程，可以指定线程名称、优先级等等
    *
    * @param r 新线程执行的任务
    * @return 构造的新线程，如果创建线程的请求被拒绝，则为 nulL
    */
    Thread newThread(Runnable r);
}
```
![](../../public/img/4368029840918.png)

如果你不想自定义线程工厂，那么可以使用，Executors类中的默认线程工程
![](../../public/img/23-49-230486867.png)

handler：任务拒绝策略，什么情况下我们提交给线程池的任务会被拒绝呢，要满足以下四种情况
1. 线程池中线程已满
2. 无法继续扩容
3. 没有空闲线程，所有线程都在执行任务
4. 任务队列已满，无法再存入新任务

同时满足这四种情况时，我们提交给线程池的任务才会被拒绝

线程池拒绝我们的方式也有四种：
![](../../public/img/230948U08409234.png)

示例：

自定义线程工厂
```java [CustomThreadFactory.java]
public class CustomThreadFactory implements ThreadFactory {
    private final AtomicInteger i = new AtomicInteger(1);

    @Override
    public Thread newThread(Runnable r) {
        // 创建线程，执行任务
        Thread thread = new Thread(r);
        // 设置线程名称
        thread.setName("线程" + i.getAndIncrement() + "号");
        // 返回线程
        return thread;
    }
}
```

```java
public class Task implements Runnable {
    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName());
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        // 创建任务
        Runnable task1 = new Task();
        Runnable task2 = new Task();
        Runnable task3 = new Task();
        // 创建线程池
        ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(5, 25, 10L,
                TimeUnit.SECONDS, 
                new LinkedBlockingQueue<>(), 
                new CustomThreadFactory(), 
                new ThreadPoolExecutor.AbortPolicy());
        // 提交任务
        threadPoolExecutor.execute(task1);
        threadPoolExecutor.execute(task2);
        threadPoolExecutor.execute(task3);
        // 关闭线程池
        threadPoolExecutor.shutdown();
    }
}
```

![](../../public/img/230586006707982731.png)

## 这 3 种创建线程池的方式有风险

分别是 

1. 固定大小线程池 `FixedThreadPool`
2. 单个线程的线程池 `SingleThreadExecuton`
3. 可缓存的线程池 `CachedThreadPool`

这三种创建方式都在Executors 工具类中
![](../../public/img/124987597912395646gggg.png)

所有已new开头的都能创建线程池
![](../../public/img/sadlfjweoinbszc.png)
一共有12个这样的方法，去掉重载方法后，就剩下6个
![](../../public/img/sadfkjl4598982.png)



![](../../public/img/asdl;fkj23947.png)