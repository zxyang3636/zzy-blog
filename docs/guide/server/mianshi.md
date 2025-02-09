# 面试指北

## Java 基础

### **==**和**equals**的区别是什么？

- ==既可以比较基本数据类型,也可以比较引用数据类型
- ==在比较基本数据类型时, 比较的是值, 在比较引用数据类型时, 比较对象的地址
- equals 只能比较引用数据类型, 比较对象中的内容是否相同, 在没有重写的情况下也是比较对象的地址

### String str="i" 与 String str=new String("i") 一样吗？

- String str="i"会将其分配到常量池中，常量池中没有重复的元素，如果常量池中存在 i，就将 i 的地址赋给变量，如果没有就创建一个再赋给变量。

- 字符串字面量，通常存储在 JVM 的字符串常量池中。常量池中没有重复的元素，如果字符串常量池中已经存在相同的字符串（例如，之前已经使用过 "i"），则不会创建新的对象，而是直接引用池中的现有对象。如果没有就创建一个再赋给变量。

- String str=new String(“i”)会将对象分配到堆中，即使内存一样，还是会重新创建一个新的对象。

### 接口和抽象类有什么区别？

- 声明方法的存在而不去实现它的类叫抽象类。接口是抽象类的变体，接口中的所有方法都是抽象的。

- 接口可以被多个类实现，而一个类只能继承一个抽象类。

- 接口中的成员变量默认为 public static final 类型，而抽象类中的成员变量可以是 public、protected、private 等各种类型。

- 接口不能包含抽象构造方法和抽象静态方法，而抽象类可以有构造方法。

- 接口中的方法只有声明，没有具体实现，实现接口的类需要提供具体的实现。
  抽象类中的方法可以有具体的实现，子类可以直接继承并使用。抽象类的子类必须为父类中的所有抽象方法提供实现，否则它自己也是抽象类
- jdk1.8 之后，接口可以使用 default 关键字，实现类是默认实现的，那个实现类需要使用，再具体实现就可以
- 抽象类与接口都不能被实例化，但是可以指向具体的子类的实例

### String 有哪些常用方法？

1. equals
2. contains
3. trim
4. getBytes
5. toUpperCase
6. toLowerCase
7. replace
8. indexOf
9. substring
10. startWith

### 什么是反射？

> 反射就是动态加载对象，并对对象进行剖析，通过 class、constructor、field、method 四个方法，获取一个类的各个组成部分。

> 对于任意一个类，都能够知道这个类的所有属性和方法；对于任意一个对象，都能够调用它的任意一个方法，这种动态获取信息以及动态调用对象方法的功能称为 Java 反射机制。

### 反射获取实例对象的方式

1. 使用 Class 类的静态方法 forName()

使用 Class.forName()

2. 通过的类的 class 属性获得该类的 Class 实例

类名.Class

3. 利用对象调用 getClass()方法获得对象的 Class 实例

对象.getClass()

4. 基本数据类型封装，可以用 TYPE 属性获得对应数据类型的 Class 实例

封装类.TYPE

### JDK 代理与 CGLIB 代理的区别

- 使用 JDK 代理的委托类对象必须基于接口，目标类必须实现至少一个接口；使用 CGLib 代理的委托对象不需要实现接口
- CGLib 通过生成目标类的子类来实现代理， 有一些限制不能代理 final 类、不能代理 final 方法
- CGLib 第一次加载较慢，因为需要生成子类
- JDK 代理是 Java 原生支持不需要依赖, CGLib 通过继承方式代理 需要依赖 jar 包
  :::info
  Spring 会根据情况自动选择代理方式：
  1. 如果目标类实现了接口，默认使用 JDK 动态代理
  2. 如果目标类没有实现接口，使用 CGLib
     :::

**JDK 代理**
:::tip
JDK 内置的 Proxy 动态代理通过反射机制在运行时动态地创建代理类。被代理的类必须实现接口，未实现接口则没办法完成动态代理。JDK 代理的核心是`Proxy`类和`InvocationHandler`接口。`Proxy`类通过调用其静态方法`newProxyInstance()`来返回代理对象，而`InvocationHandler`接口中的`invoke`方法则使用反射在目标对象上调用方法并传入参数。
:::

**CGLIB 代理**
:::tip
CGLIB 在运行时动态生成被代理类的子类，并重写父类中的方法来实现代理功能。cglib 可以在运行时动态生成字节码，cglib 继承被代理的类，重写方法，织入通知，动态生成字节码并运行，通过 `MethodInterceptor` 接口来实现方法调用的拦截，重写 intercept，在调用方法的前后织入横切内容。

使用 cglib 可以实现动态代理，即使被代理的类没有实现接口，但被代理的类必须不是 final 类。
:::
可以看看这篇文章
[为什么需要代理模式](https://www.cnblogs.com/best/p/5679656.html#_label0)

### throw 和 throws 的区别？

- **throw**：
  throw 语句用在方法体内，表示抛出异常，由方法体内的语句处理。
- throw 是具体向外抛出异常的动作，所以它抛出的是一个异常实例对象(任何 `Throwable` 类型的实例)，执行 throw 一定是抛出了某种异常。该语句后面的代码将不成执行
- **throws**：
  throws 语句是用在方法声明后面，表示如果抛出异常，由该方法的调用者来进行异常的处理。
- throws 主要是声明这个方法会抛出某种类型的异常(只能声明 `Exception` 类型及其子类的异常)，让它的使用者要知道需要捕获的异常的类型。throws 表示出现异常的一种可能性，并不一定会发生这种异常。

### final、finally、finalize 有什么区别？

- final 可以修饰类，变量，方法，修饰的类不能被继承，修饰的变量不能重新赋值，修饰的方法不能被重写
- finally 是异常处理语句结构的一部分，表示总是执行。常用于一些流的关闭。
- finalize 是 Object 类的一个方法，当对象被垃圾回收器（GC）回收之前，会调用此方法。Java 9 后标记为废弃（@Deprecated），不推荐使用。有更好的替代方案（AutoCloseable，try-with-resources ，Cleaner）

### 常见的异常类有哪些？

运行时异常：

- ArithmeticException（算术异常）
- ClassCastException （类转换异常）
- IllegalArgumentException （非法参数异常）
- IndexOutOfBoundsException （下标越界异常）
- NullPointerException （空指针异常）
- ArrayStoreException：试图将错误类型的对象存储到一个对象数组时抛出的异常；
- SecurityException （安全异常）

受检异常(编译时异常)：

- SQLException 提供有关数据库访问错误或其他错误的信息的异常。
- IOException 表示发生了某种 I / O 异常的信号。此类是由失败或中断的 I / O 操作产生的
- FileNotFoundException 当试图打开指定路径名表示的文件失败时，抛出此异常。
- ClassNotFoundException 找不到具有指定名称的类的定义。
- NoSuchMethodException：无法找到某一方法时，抛出；
- EOFException 当输入过程中意外到达文件或流的末尾时，抛出此异常。

:::tip
受检异常在编译时需要被处理，‌ 即要么使用 try-catch 块捕获，‌ 要么在方法签名中使用 throws 关键字声明可能抛出的异常
:::

### String、StringBuffer、StringBuilder 区别？

第一个：可变性
String 内部的 value 值是 final 修饰的，所以它是不可变类。所以每次修改 String 的值，都会产生一个新的对象。
StringBuffer 和 StringBuilder 是可变类，字符串的变更不会产生新的对象。

第二个：线程安全性
String 是不可变类，所以它是线程安全的。
StringBuffer 是线程安全的，因为它每个操作方法都加了 synchronized 同步关键字。
StringBuilder 不是线程安全的。
所以在多线程环境下对字符串进行操作，应该使用 StringBuffer，否则使用 StringBuilder

第三个：性能方面
String 的性能是最的低的，因为不可变意味着在做字符串拼接和修改的时候，需要重新创建新的对象以及分配内存。
其次是 StringBuffer 要比 String 性能高，因为它的可变性使得字符串可以直接被修改最后是
StringBuilder，它比 StringBuffer 的性能高，因为 StringBuffer 加了同步锁。

第四个：存储方面
String 存储在字符串常量池里面
StringBuffer 和 StringBuilder 存储在堆内存空间。

### 在 Java 中，什么时候用重载，什么时候用重写？

- 重载是多态的集中体现，要以统一的方式处理不同类型数据的时候，可以用重载

- 是建立在继承关系上的，子类在继承父类的基础上，增加新的功能，可以用重写

### 重写、重载规则？

方法重载的规则？

- 方法名一致，参数列表中参数的**顺序**，**类型**，**个数**不同。
- 重载与方法的**返回值**(返回类型)无关，存在于父类和子类，同类中。
- 可以抛出不同的**异常**。
- 可以有不同**修饰符**。

方法重写的规则？

- 参数列表、方法名、返回值类型必须完全一致，**构造方法**不能被重写；
- 声明为 **final** 的方法不能被重写；
- 声明为 **static** 的方法不存在重写(重写和多态联合才有意义);
- **访问权限**不能比父类更低;
- 重写之后的方法不能抛出更宽泛的**异常**
- 子类无法重写父类的私有**private**方法

### 实例化对象有哪几种方式

new

clone()

通过反射机制创建

序列化反序列化 将一个对象实例化后，进行序列化，再反序列化，也可以获得一个对象

###

## 并发编程
