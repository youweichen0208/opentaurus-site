export const diagnosticsScenarios = [
  {
    label: "Scenario 01",
    title: "慢 SQL 为什么拖慢接口",
    description:
      "从自然语言问题出发，先找最近窗口里的慢 SQL，再对命中的语句做根因分析。这是最适合做成动态输入输出流的一类场景。",
    customerScene: "订单列表或订单检索接口突然变慢，业务方只知道“查询卡”，但不知道是哪条 SQL、慢在哪里。",
    proofGoal: "证明 MCP 能从慢 SQL 排名定位到具体语句，再把模糊匹配、排序和 OFFSET 的代价解释成可执行原因。",
    customerTakeaway: "客户能判断下一步应优先改查询模式、索引设计或分页方式，而不是盲目扩容。",
    agentTitle: "Cursor + OpenTaurus MCP",
    agentMode: "slow sql diagnosis",
    userPrompt: "这个订单查询最近很慢，帮我找出最可疑的 SQL 并说明原因。",
    agentReply: "我先找最近窗口里的慢 SQL，再对命中的查询做根因分析。",
    tools: ["find_top_slow_sql", "diagnose_slow_query", "list_taurus_features"],
    streamLines: [
      "开始扫描慢 SQL 排名，优先看 rows examined 和排序代价异常高的语句...",
      "已命中 `WHERE note LIKE '%999%' ORDER BY created_at DESC LIMIT 100 OFFSET 500`。",
      "继续下钻单条 SQL，检查前导通配符、全表扫描和排序代价是否叠加。",
      "诊断结果显示这条语句同时受模糊匹配和排序影响，属于 scan-heavy 形态。",
      "返回时会同时给出“命中哪条 SQL”和“为什么慢”。",
    ],
    agentResponses: [
      {
        title: "回复 1",
        lines: [
          "我已经命中最可疑 SQL：`SELECT id, user_id, status, amount, created_at FROM t_orders_test WHERE note LIKE '%999%' ORDER BY created_at DESC LIMIT 100 OFFSET 500`。",
          "`find_top_slow_sql` 里直接显示这条语句平均延迟 `517.85ms`，`rows examined` 约 `250,600`。",
        ],
      },
      {
        title: "回复 2",
        lines: [
          "`diagnose_slow_query` 已确认主要代价来自前导通配符 `LIKE '%999%'`、`ORDER BY created_at DESC` 排序和 `OFFSET 500`。",
          "这条链路已经形成“发现 SQL -> 回到根因”的闭环。",
        ],
      },
    ],
    outputCards: [
      {
        title: "`find_top_slow_sql` 提取结果",
        meta: [
          { label: "summary", value: "Top slow SQL discovery returned ok." },
          { label: "top digest", value: "`SELECT ... FROM t_orders_test ...`" },
          { label: "avg latency", value: "`517.85ms`" },
          { label: "rows examined", value: "`250,600`" },
        ],
        lines: [
          "最可疑 SQL：`SELECT id, user_id, status, amount, created_at FROM t_orders_test WHERE note LIKE '%999%' ORDER BY created_at DESC LIMIT 100 OFFSET 500`",
          "问题点已经收敛出来：前缀模糊匹配导致全表扫描，扫描规模约 25 万行。",
        ],
      },
      {
        title: "`diagnose_slow_query` 输出摘要",
        table: {
          headers: ["维度", "结论"],
          rows: [
            ["匹配模式", "前导通配符 `LIKE '%999%'`，难以利用索引"],
            ["执行代价", "全表扫描叠加 `ORDER BY created_at DESC` 排序"],
            ["分页模式", "`OFFSET 500` 继续放大扫描与排序成本"],
          ],
        },
      },
    ],
  },
  {
    label: "Scenario 02",
    title: "锁竞争要能指出 blocker 和 waiter",
    description:
      "不是只回一张 processlist，而是把“谁在挡谁”讲清楚。这类场景特别适合用流式分析展示中间推理步骤。",
    customerScene: "更新接口卡住或事务迟迟不返回，应用侧只能看到请求超时，数据库侧需要确认是谁持锁。",
    proofGoal: "证明 MCP 能把 processlist 快照转换成 blocker / waiter 关系，并指出热点表和等待资源。",
    customerTakeaway: "客户能先处理持锁会话，再考虑业务热点行拆分或事务边界优化。",
    agentTitle: "Cursor + OpenTaurus MCP",
    agentMode: "lock contention diagnosis",
    userPrompt: "这个更新语句卡住了，帮我看是谁在挡它。",
    agentReply: "我先抓实时会话，再定位 blocker 和 waiter 的关系，确认是不是热点行锁。",
    tools: ["show_processlist", "diagnose_lock_contention", "describe_table"],
    streamLines: [
      "先抓 processlist，确认是否已经出现等待中的 update 会话...",
      "已看到 waiter 卡在同一热点行，阻塞链路存在。",
      "继续运行 `diagnose_lock_contention`，识别 blocker session 与热点表。",
      "结果显示 blocker 持有 `t_hot_counter_test` 行锁，waiter 正在等待同一资源。",
      "这类输出可以直接回答“是谁挡住了你”。",
    ],
    agentResponses: [
      {
        title: "回复 1",
        lines: [
          "实时会话里已经看到会话 `201835` 和 `201838` 并发执行 `UPDATE t_hot_counter_test ...`，目标都是 `counter_key='global'`。",
          "其中等待方已经进入锁等待，这不是单条 SQL 自己慢，而是资源被占住了。",
        ],
      },
      {
        title: "回复 2",
        lines: [
          "`diagnose_lock_contention` 已把 blocker/waiter 关系收敛到同一条阻塞链：热点表是 `t_hot_counter_test`，Top blocker 是会话 `55860`。",
          "页面里展示的是“问题 -> blocker/waiter 关系 -> 结论”的完整过程。",
        ],
      },
    ],
    outputCards: [
      {
        title: "`show_processlist` 提取结果",
        meta: [
          { label: "summary", value: "Returned `9` processlist rows." },
          { label: "sleep sessions", value: "`6`" },
          { label: "running updates", value: "会话 `201835`、`201838`" },
          { label: "risk note", value: "并发更新同一行 `counter_key='global'`" },
        ],
        lines: [
          "会话 `201835` 正在执行 `UPDATE t_hot_counter_test ...`，已运行 `26s`。",
          "会话 `201838` 正在执行同一条更新，已运行 `23s`。",
          "两会话并发更新同一行，已经具备典型锁竞争特征。",
        ],
      },
      {
        title: "`diagnose_lock_contention` 提取结果",
        table: {
          headers: ["字段", "值"],
          rows: [
            ["严重程度", "Warning"],
            ["当前锁等待数", "1"],
            ["阻塞会话数", "1"],
            ["被锁表", "`t_hot_counter_test`"],
            ["最长等待时间", "`>= 60s`"],
            ["Top blocker", "会话 `55860`，用户 `youweichen`"],
          ],
        },
      },
    ],
  },
  {
    label: "Scenario 03",
    title: "单 blocker 挡住多个 waiter",
    description:
      "报告里已经验证单个事务可以同时阻塞多个等待会话，页面需要把聚合型锁等待从普通单 waiter 场景里拆出来。",
    customerScene: "多个更新请求同时堆积，表面上像一批慢 SQL，实际可能是一个未提交事务造成的等待扇出。",
    proofGoal: "证明 MCP 能把多个 waiter 聚合到同一个 blocker，而不是把每个等待会话孤立展示。",
    customerTakeaway: "客户能快速定位最该处理的持锁源头，避免逐条排查等待 SQL。",
    agentTitle: "Cursor + OpenTaurus MCP",
    agentMode: "multi waiter lock graph",
    userPrompt: "现在不止一个更新卡住了，帮我看是不是同一个会话在挡多个请求。",
    agentReply: "我先抓实时会话，再把等待中的 update 聚合到同一个 blocker 上。",
    tools: ["show_processlist", "diagnose_lock_contention", "describe_table"],
    streamLines: [
      "processlist 中同时出现两个等待中的 `UPDATE t_hot_counter_test` 会话...",
      "两个 waiter 都在更新 `counter_key='global'`，等待资源指向同一热点行。",
      "`diagnose_lock_contention` 已把关系收敛成单 blocker / 多 waiter。",
      "输出重点是 blocker 扇出关系，而不是只展示一张会话列表。",
      "这说明 MCP 能处理聚合型锁等待现场。",
    ],
    agentResponses: [
      {
        title: "回复 1",
        lines: [
          "我看到了两个等待中的更新会话，它们都卡在 `t_hot_counter_test` 的同一热点行。",
          "这不是两个独立慢 SQL，而是同一个 blocker 造成的等待扇出。",
        ],
      },
      {
        title: "回复 2",
        lines: [
          "`diagnose_lock_contention` 已识别单 blocker 关联多个 waiter，适合直接给出“先处理哪个持锁会话”的建议。",
          "报告判定这条聚合型锁等待链路已经通过。",
        ],
      },
    ],
    outputCards: [
      {
        title: "多 waiter 现场",
        meta: [
          { label: "blocker", value: "单个未提交事务" },
          { label: "waiters", value: "两个等待中的 update 会话" },
          { label: "hot table", value: "`t_hot_counter_test`" },
          { label: "wait key", value: "`counter_key='global'`" },
        ],
        lines: [
          "报告证据摘要：`show_processlist` 同时捕获两个等待会话。",
          "`diagnose_lock_contention` 将两个 waiter 聚合到同一个 blocker 上。",
        ],
      },
      {
        title: "页面结论",
        lines: [
          "这类场景要展示“一个 blocker 正在挡多个请求”，否则用户只能看到零散的 processlist。",
          "MCP 的价值是把多个等待会话归并成同一条阻塞链，降低排障时的判断成本。",
        ],
      },
    ],
  },
  {
    label: "Scenario 04",
    title: "Metadata Lock 要指出 DDL 等待",
    description:
      "报告已验证 DDL 被事务上下文阻塞，并且 processlist 明确出现 `Waiting for table metadata lock`。",
    customerScene: "上线变更时 `ALTER TABLE` 长时间不返回，团队需要判断是 DDL 本身慢，还是被已有事务挡住。",
    proofGoal: "证明 MCP 能识别 `Waiting for table metadata lock`，并继续追到阻塞 DDL 的事务上下文。",
    customerTakeaway: "客户能先提交或结束 blocker，再重试 DDL，减少变更窗口里的误判。",
    agentTitle: "Cursor + OpenTaurus MCP",
    agentMode: "metadata lock diagnosis",
    userPrompt: "ALTER TABLE 一直不返回，帮我判断是不是 metadata lock。",
    agentReply: "我会先看 processlist 的等待状态，再确认 DDL 被哪个事务上下文挡住。",
    tools: ["show_processlist", "diagnose_lock_contention", "describe_table"],
    streamLines: [
      "已捕获 `ALTER TABLE` 进入等待状态...",
      "processlist 中出现 `Waiting for table metadata lock`，可以确认是 MDL 等待。",
      "继续用 `diagnose_lock_contention` 查 blocker，避免只停留在状态描述。",
      "诊断结果把 DDL 等待和未提交事务上下文关联起来。",
      "这一页需要把 DDL 等待和行锁等待拆开呈现。",
    ],
    agentResponses: [
      {
        title: "回复 1",
        lines: [
          "`ALTER TABLE` 的等待状态不是普通执行慢，而是 `Waiting for table metadata lock`。",
          "这说明有事务上下文阻止了 DDL 获取元数据锁。",
        ],
      },
      {
        title: "回复 2",
        lines: [
          "`diagnose_lock_contention` 已识别 metadata lock blocker。",
          "处理顺序应该先定位并结束/提交 blocker，再重试 DDL。",
        ],
      },
    ],
    outputCards: [
      {
        title: "Metadata Lock 证据",
        table: {
          headers: ["阶段", "观察结果"],
          rows: [
            ["事务现场", "会话 A 持有事务上下文"],
            ["DDL 侧", "`ALTER TABLE` 进入等待"],
            ["processlist", "`Waiting for table metadata lock`"],
            ["诊断结果", "识别 metadata lock blocker"],
          ],
        },
        lines: [
          "报告证据摘要：DDL 等待状态已明确落到 `Waiting for table metadata lock`。",
          "诊断输出不只描述等待状态，还能继续指向 metadata lock blocker。",
        ],
      },
    ],
  },
  {
    label: "Scenario 05",
    title: "连接堆积限定为实时快照诊断",
    description:
      "报告明确说本次证据来自 processlist，不宣称 CES 时间序列联动。页面也应该把能力边界说清楚。",
    customerScene: "应用连接池或临时任务制造大量连接，数据库侧需要先确认当前是否已经出现空闲连接堆积。",
    proofGoal: "证明 MCP 能基于 processlist 快照识别 `Sleep` 会话堆积，同时清楚标注这不是 CES 基线诊断。",
    customerTakeaway: "客户能先从连接池配置、空闲连接释放和应用会话来源排查，不把它误解成存储或 SQL 问题。",
    agentTitle: "Cursor + OpenTaurus MCP",
    agentMode: "connection spike snapshot",
    userPrompt: "数据库连接数突然很多，先帮我看是不是空闲连接堆积。",
    agentReply: "我先读取 processlist 快照，再按会话状态和用户维度归因。",
    tools: ["show_processlist", "diagnose_connection_spike"],
    streamLines: [
      "processlist 快照中出现大量 `Sleep` 会话...",
      "会话状态分布已经能支撑实时连接堆积判断。",
      "`diagnose_connection_spike` 返回连接堆积结论。",
      "本次证据不扩展为 CES / Cloud Eye 指标联动结论。",
      "页面上需要明确这是实时快照级诊断。",
    ],
    agentResponses: [
      {
        title: "回复 1",
        lines: [
          "当前快照里 `Sleep` 会话堆积明显，连接压力来自空闲连接占用。",
          "这一步先回答“现在是不是连接堆积”。",
        ],
      },
      {
        title: "回复 2",
        lines: [
          "`diagnose_connection_spike` 已给出结构化结论；报告的限定是：实时 processlist 诊断已可用。",
          "CES 基线或时间序列指标联动暂不写成已验证结论。",
        ],
      },
    ],
    outputCards: [
      {
        title: "连接堆积输出边界",
        meta: [
          { label: "evidence source", value: "`show_processlist`" },
          { label: "dominant state", value: "`Sleep` sessions" },
          { label: "tool result", value: "`diagnose_connection_spike` ok" },
          { label: "not claimed", value: "CES baseline linkage" },
        ],
        lines: [
          "报告证据摘要：processlist 中已出现大量 `Sleep` 会话。",
          "`diagnose_connection_spike` 基于实时快照返回连接堆积结论。",
        ],
      },
    ],
  },
  {
    label: "Scenario 06",
    title: "存储压力要展示表、临时表和可疑 SQL",
    description:
      "报告里的存储压力不是单一容量告警，而是同时返回表存储占用、临时磁盘表、扫描密集 SQL 和排序/临时表负载。",
    customerScene: "实例存储或临时空间压力上升，客户需要知道是哪些表、哪些查询模式在制造压力。",
    proofGoal: "证明 MCP 能把表级占用、临时磁盘表、扫描密集 SQL 和排序负载放到同一条证据链里。",
    customerTakeaway: "客户能优先处理大表、GROUP BY / ORDER BY 负载和临时表来源，而不是只看容量数字。",
    agentTitle: "Cursor + OpenTaurus MCP",
    agentMode: "storage pressure diagnosis",
    userPrompt: "帮我看存储压力来自哪些表和 SQL，先不要只给容量结论。",
    agentReply: "我会拉取表级占用、临时表信号和可疑 SQL，组合成一条证据链。",
    tools: ["diagnose_storage_pressure", "find_top_slow_sql", "describe_table"],
    streamLines: [
      "`diagnose_storage_pressure` 已返回表级存储和 SQL 证据...",
      "结果中出现临时磁盘表、扫描密集 SQL、排序和临时表负载。",
      "可疑 SQL 包括 `t_storage_test GROUP BY category, payload`。",
      "同时也能关联到 `t_orders_test ORDER BY note DESC` 这类排序负载。",
      "这类诊断要把压力来源拆成表、临时对象和 SQL 三层。",
    ],
    agentResponses: [
      {
        title: "回复 1",
        lines: [
          "当前结果不是只显示存储用量，而是已经给出表占用和 SQL 方向。",
          "`t_storage_test` 与 `t_orders_test` 是需要优先看的对象。",
        ],
      },
      {
        title: "回复 2",
        lines: [
          "报告判定本地 SQL / 表级证据链已足够，但没有把 CES 存储时间序列写入已验证结论。",
          "页面应按这个边界展示，不额外夸大云指标联动。",
        ],
      },
    ],
    outputCards: [
      {
        title: "`diagnose_storage_pressure` 摘要",
        table: {
          headers: ["证据层", "已看到的内容"],
          rows: [
            ["表级占用", "返回表存储占用"],
            ["临时对象", "临时磁盘表信号"],
            ["扫描 SQL", "`t_storage_test GROUP BY category, payload`"],
            ["排序负载", "`t_orders_test ORDER BY note DESC`"],
          ],
        },
        lines: [
          "报告证据摘要：`diagnose_storage_pressure` 已同时返回表存储、临时表和 SQL 侧证据。",
          "页面结论限定为本地 SQL / 表级证据链已充分，不扩展为 CES 时间序列闭环。",
        ],
      },
    ],
  },
];

export const queryScenarios = [
  {
    label: "Scenario 01",
    title: "先理解这条查询会怎么跑",
    description:
      "这一类问题更接近“数据查询”而不是“事故诊断”。重点是让用户看到查询语句、标准 explain 和只读访问链路如何串起来。",
    customerScene: "客户有一条业务查询能返回结果，但担心扫描过重，需要先用通用方式理解它怎么执行。",
    proofGoal: "证明 MCP 能安全执行只读查询，并用标准 explain 把访问路径、索引和扫描规模讲清楚。",
    customerTakeaway: "客户能判断这条查询是否需要改过滤条件、索引或分页方式；TaurusDB 专属优化另到专属能力页查看。",
    agentTitle: "Cursor + OpenTaurus MCP",
    agentMode: "readonly query + explain",
    userPrompt: "我想看这个查询为什么这么重，先给我解释一下它的执行方式。",
    agentReply: "我先用只读查询确认结果，再用标准 explain 解释访问路径和当前瓶颈。",
    tools: ["execute_readonly_sql", "explain_sql", "list_taurus_features"],
    streamLines: [
      "先执行只读查询，确认语句能返回业务结果且没有写入风险...",
      "继续运行标准 explain，查看访问类型、索引、扫描行数和 extra 信息。",
      "把 explain 字段翻译成业务可理解的查询路径说明。",
      "这种查询页的重点是安全读取和通用执行解释，专属增强能力独立放到 TaurusDB Native。",
    ],
    agentResponses: [
      {
        title: "回复 1",
        lines: [
          "只读查询已经返回结果，接下来用标准 explain 看它的访问路径。",
          "当前页只展示通用查询解释，不把 `explain_sql_enhanced` 混在这里。",
        ],
      },
      {
        title: "回复 2",
        lines: [
          "标准 explain 可以说明访问类型、索引和扫描规模。",
          "如果客户关心 offset pushdown、parallel query、NDP pushdown，应进入 TaurusDB 专属能力页。",
        ],
      },
    ],
    outputCards: [
      {
        title: "只读查询上下文",
        meta: [
          { label: "access mode", value: "`readonly`" },
          { label: "query role", value: "读取当前态数据" },
          { label: "explain type", value: "standard explain" },
          { label: "native features", value: "moved to TaurusDB Native" },
        ],
      },
      {
        title: "`explain_sql` 提取结果",
        table: {
          headers: ["字段", "值"],
          rows: [
            ["type", "`index`"],
            ["key", "`PRIMARY`"],
            ["rows", "`5020`"],
            ["extra", "`Using where`"],
            ["解释重点", "访问路径 / 索引 / 扫描规模"],
          ],
        },
        lines: [
          "这个页面只承接通用 explain 解释，避免和 TaurusDB 专属优化能力混在一起。",
          "`explain_sql_enhanced` 已移动到 TaurusDB 专属能力页单独展示。",
        ],
      },
    ],
  },
];

export const taurusScenarios = [
  {
    label: "Scenario 01",
    title: "Recycle Bin 恢复必须把 confirmation token 流展示出来",
    description:
      "这个能力最能体现工具的安全边界。重点不是“能恢复”，而是“第一次不直接执行，第二次带 token 才真正恢复”。",
    customerScene: "用户误删测试表或演示数据表，需要先确认对象是否还在回收站，再安全恢复。",
    proofGoal: "证明 MCP 不会直接执行高风险恢复，而是先定位对象、返回 confirmation token，再二次确认。",
    customerTakeaway: "客户能理解恢复动作既可用又有 guardrail，不会因为一句自然语言误触发危险操作。",
    agentTitle: "Cursor + OpenTaurus MCP",
    agentMode: "recycle bin recovery",
    userPrompt: "我误删了一张测试表，先确认能不能恢复，再帮我恢复回来。",
    agentReply: "我先检查 recycle bin 和实例能力，如果对象还在，再发起恢复并处理 confirmation token。",
    tools: ["list_taurus_features", "list_recycle_bin", "restore_recycle_bin_table"],
    streamLines: [
      "已确认实例开启 recycle bin，开始查询回收站对象列表...",
      "目标表删除后仍在 recycle bin 中，回收对象指向 `taurusdb_test@t_recycle_bin_test@6a0532d4`，目标恢复位置是 `taurusdb_test.t_recycle_bin_test`。",
      "第一次恢复请求按预期返回 `CONFIRMATION_REQUIRED`，并明确给出 `confirmation_token` 与 `native_restore` 方法，没有直接执行。",
      "带 token 二次调用后，恢复成功，返回 `ok=true`、`destination_table=t_recycle_bin_test`、`duration_ms=206`，随后继续校验表和记录数。",
      "这一步最能体现 MCP 对高风险动作的 guardrail 模型。",
    ],
    agentResponses: [
      {
        title: "回复 1",
        lines: [
          "我已经确认目标对象还在 recycle bin，可以恢复。",
          "第一次 `restore_recycle_bin_table` 没有直接执行，而是返回 `CONFIRMATION_REQUIRED` 和 `confirmation_token`，这一步必须显式展示出来。",
        ],
      },
      {
        title: "回复 2",
        lines: [
          "二次调用带上 token 后恢复成功，目标表 `t_recycle_bin_test` 已回到原库。",
          "恢复后表和样本数据都已回到删除前状态。",
        ],
      },
    ],
    outputCards: [
      {
        title: "`list_recycle_bin` 与恢复上下文",
        meta: [
          { label: "recycle bin", value: "`enabled`" },
          { label: "recycle table", value: "`taurusdb_test@t_recycle_bin_test@6a0532d4`" },
          { label: "destination", value: "`taurusdb_test.t_recycle_bin_test`" },
        ],
        lines: [
          "目标表删除后没有丢失，而是进入 recycle bin，恢复动作有明确的源对象和目标位置。",
          "第一次恢复返回中的 `confirmation_token` 已放进上面的流式处理中，不再单独做一张卡片。",
        ],
      },
      {
        title: "二次确认后的恢复结果",
        table: {
          headers: ["字段", "值"],
          rows: [
            ["ok", "`true`"],
            ["recycle_table", "`taurusdb_test@t_recycle_bin_test@6a0532d4`"],
            ["method", "`native_restore`"],
            ["destination_table", "`t_recycle_bin_test`"],
            ["duration_ms", "`206`"],
          ],
        },
        lines: [
          "报告证据摘要：第一次恢复返回 `confirmation_token`，第二次带 token 后恢复成功。",
          "恢复后重新查询到目标表，样本记录数为 `3`。",
        ],
      },
      {
        title: "为什么这段演示重要",
        lines: [
          "恢复类操作没有被一句话直接执行，而是被 MCP 强制拆成“定位对象 -> 返回 confirmation_token -> 确认后恢复”三步。",
          "这说明 OpenTaurus MCP 展示的不只是数据库能力本身，还把高风险动作放进了可确认、可审计的 guardrail 流程。",
          "对客户来说，重点不是“能恢复一张表”，而是“恢复这类危险操作不会被误触发”。",
        ],
      },
    ],
  },
  {
    label: "Scenario 02",
    title: "Dynamic Masking 要展示双视角查询结果",
    description:
      "差异化不在于“参数开启”，而在于同一条数据在不同身份下返回不同内容，而且底表原值没有被改写。",
    customerScene: "客服、运营或分析账号需要查业务数据，但不应该直接看到手机号、邮箱、证件号原文。",
    proofGoal: "证明 MCP 能分别用高权限和受控用户视角读取同一条记录，并展示原文与脱敏值的差异。",
    customerTakeaway: "客户能确认动态脱敏发生在查询返回层，底表原值没有被复制或改写。",
    agentTitle: "Cursor + OpenTaurus MCP",
    agentMode: "dynamic masking comparison",
    userPrompt: "帮我验证动态脱敏是否真的生效，把管理员和受控用户的查询结果对比出来。",
    agentReply: "我先确认脱敏规则，再分别读取高权限和受控用户的结果，核对是不是同一条底表记录。",
    tools: ["list_taurus_features", "execute_readonly_sql", "describe_table"],
    streamLines: [
      "动态脱敏参数已开启，规则也已经存在，可以继续做双视角验证...",
      "高权限 `root` 查询返回手机号、邮箱、证件号原始值。",
      "受控用户 `youweichen` 查询同一条记录时，敏感字段自动返回脱敏值。",
      "主键和非敏感字段一致，说明两次查询命中的是同一条底表记录。",
      "结论是动态脱敏只影响查询展示，不改写底表数据。",
    ],
    agentResponses: [
      {
        title: "回复 1",
        lines: [
          "动态脱敏参数 `rds_dynamic_masking_enabled=ON`，目标是 `t_dynamic_masking_test` 表中 `id = 1` 的同一条记录。",
          "我先用 `root` 视角读取原始值，再用受控用户视角读取脱敏值。",
        ],
      },
      {
        title: "回复 2",
        lines: [
          "`root` 看到的是 `13812345678`、`masking-a@example.com`、`330101199001011234`；受控用户看到的都是 `******`。",
          "这类能力应该独立收在 TaurusDB 专属能力页。",
        ],
      },
    ],
    outputCards: [
      {
        title: "Dynamic Masking 前提",
        lines: [
          "动态脱敏参数 `rds_dynamic_masking_enabled=ON`。",
          "查询目标为 `t_dynamic_masking_test` 表中 `id = 1` 的记录。",
          "比对维度为 `phone`、`email`、`id_no` 三个敏感字段。",
        ],
      },
      {
        title: "双视角查询结果",
        table: {
          headers: ["字段", "`root` 视角", "受控用户视角"],
          rows: [
            ["phone", "`13812345678`", "`******`"],
            ["email", "`masking-a@example.com`", "`******`"],
            ["id_no", "`330101199001011234`", "`******`"],
          ],
        },
        lines: [
          "报告证据摘要：高权限 `root` 可见原始值，受控用户 `youweichen` 看到脱敏值。",
          "两次查询主键和非敏感字段一致，说明命中的是同一条底表记录。",
        ],
      },
      {
        title: "为什么这段演示重要",
        lines: [
          "动态脱敏演示的重点不是“参数开了”，而是同一条记录在不同身份下返回了不同结果。",
          "这说明 OpenTaurus MCP 展示的不只是规则存在，而是能把“谁看到原文、谁看到脱敏值”直接讲清楚。",
          "对客户来说，重点不是复制一份脱敏数据，而是在不改写底表的前提下把查询权限边界落到结果层。",
        ],
      },
    ],
  },
  {
    label: "Scenario 05",
    title: "Nonblocking DDL 要展示 DDL 期间读流量仍返回",
    description:
      "报告里的结论是基础行为已验证：DDL 与并发查询时间线可见，查询侧没有明显阻塞。页面不扩展成大表压测结论。",
    customerScene: "上线窗口里需要加列或微调 schema，但业务读请求不能因为 DDL 被长时间打断。",
    proofGoal: "证明 MCP 能确认 nonblocking_ddl 能力，并对照 DDL 与并发查询时间线。",
    customerTakeaway: "客户能把关注点从“DDL 是否成功”转到“变更期间读流量是否还能返回”。",
    agentTitle: "Cursor + OpenTaurus MCP",
    agentMode: "nonblocking ddl verification",
    userPrompt: "帮我验证这次在线 DDL 期间查询是否还能正常返回。",
    agentReply: "我先确认实例能力，再对照 DDL 与并发查询时间线。",
    tools: ["list_taurus_features", "execute_readonly_sql", "explain_sql_enhanced"],
    streamLines: [
      "`list_taurus_features` 显示 `nonblocking_ddl` 可用且已启用...",
      "DDL 与并发查询的时间线已经记录。",
      "查询侧在 DDL 执行期间仍能返回结果，没有看到明显阻塞。",
      "本次只支撑基础 nonblocking DDL 行为验证，不扩展到大表压测。",
      "页面需要把“DDL 成功”和“读流量未被明显打断”分开讲。",
    ],
    agentResponses: [
      {
        title: "回复 1",
        lines: [
          "实例能力里包含 `nonblocking_ddl`，可以继续看执行期行为。",
          "我会把 DDL 时间线和并发查询返回结果放在同一个上下文里判断。",
        ],
      },
      {
        title: "回复 2",
        lines: [
          "当前证据显示 DDL 期间查询侧仍正常返回。",
          "报告判定为通过，但结论范围限定在基础行为验证，不写成复杂大表 DDL 压测结论。",
        ],
      },
    ],
    outputCards: [
      {
        title: "Nonblocking DDL 行为证据",
        meta: [
          { label: "feature", value: "`nonblocking_ddl` enabled" },
          { label: "timeline", value: "DDL + concurrent query" },
          { label: "read side", value: "queries returned" },
          { label: "scope", value: "basic behavior verification" },
        ],
        lines: [
          "报告证据摘要：实例能力状态包含 `nonblocking_ddl`。",
          "DDL 与并发查询时间线显示，DDL 执行期间查询侧仍能正常返回。",
        ],
      },
      {
        title: "为什么这段演示重要",
        lines: [
          "用户真正关心的不是 `ALTER TABLE` 能否执行，而是执行期间读请求是否被明显打断。",
          "这段演示把 schema 变更窗口里的业务连续性呈现出来，同时保留报告里的结论边界。",
        ],
      },
    ],
  },
  {
    label: "Scenario 03",
    title: "Flashback Query 用来对比历史态和当前态",
    description:
      "这是 TaurusDB 的时间维度查询能力。用户的问题不是服务为什么挂了，而是某个时刻的数据到底是什么样。",
    customerScene: "业务怀疑某条记录被误改，需要回看更新前的值，并和当前状态直接对比。",
    proofGoal: "证明 MCP 能确认 flashback 前置条件，再按时间点返回历史态并对照当前态。",
    customerTakeaway: "客户能判断记录是否被更新、更新了哪些字段，以及是否需要进一步恢复或审计。",
    agentTitle: "Cursor + OpenTaurus MCP",
    agentMode: "flashback query",
    userPrompt: "我怀疑这条记录被改过，帮我对比更新前和现在的值。",
    agentReply: "我先确认 flashback 能力已经开启，再按记录的时间点回查历史态，并和当前查询结果做对照。",
    tools: ["list_taurus_features", "flashback_query", "execute_readonly_sql"],
    streamLines: [
      "flashback 参数和表级 BACKQUERY 配置都已满足，可以继续做历史时刻回查...",
      "先读取更新前时间点 T1 对应的历史态，再读取当前值。",
      "两次查询对照显示，历史态和当前态确实不同，说明更新已经发生。",
      "这类页面应该重点突出“同一条记录在两个时间切片里的结果差异”。",
    ],
    agentResponses: [
      {
        title: "回复 1",
        lines: [
          "flashback 前置条件已经满足：`innodb_rds_backquery_enable` 已开启，目标表也以 `BACKQUERY=1` 创建。",
          "本次历史时点使用 `2026-05-13 11:04:39`。",
        ],
      },
      {
        title: "回复 2",
        lines: [
          "`flashback_query` 返回的历史态里，`status` 还是 `draft`；当前普通查询返回的是 `published`。",
          "这类能力已经作为 TaurusDB 专属能力独立展示。",
        ],
      },
    ],
    outputCards: [
      {
        title: "Flashback 前置条件",
        lines: [
          "实例参数 `innodb_rds_backquery_enable` 已开启。",
          "测试表以 `BACKQUERY=1` 创建，可进行历史视图回查。",
          "本次对比使用历史时点 `2026-05-13 11:04:39`。",
        ],
      },
      {
        title: "`flashback_query` 与当前态对比",
        table: {
          headers: ["字段", "历史态", "当前态"],
          rows: [
            ["id", "`1`", "`1`"],
            ["name", "`flashback-a`", "`flashback-a`"],
            ["status", "`draft`", "`published`"],
            ["updated_at", "`11:03:39`", "`11:04:39`"],
          ],
        },
        lines: [
          "报告证据摘要：`flashback_query` 已按历史时刻返回旧值，并与当前普通查询形成对照。",
          "相对时间回查也已验证，但页面重点保留历史态 / 当前态差异。",
        ],
      },
    ],
  },
  {
    label: "Scenario 04",
    title: "Enhanced Explain 要覆盖三类 TaurusDB 优化提示",
    description:
      "报告已经验证 offset pushdown、parallel query、NDP pushdown 三条 explain 增强路径。它属于 TaurusDB 查询优化的专属展示。",
    customerScene: "客户想确认 TaurusDB 的查询优化能力不是宣传项，而是能在 explain 结果里被实际识别。",
    proofGoal: "证明 MCP 能覆盖 offset pushdown、parallel query、NDP pushdown 三类增强 explain 场景。",
    customerTakeaway: "客户能用同一套问答方式判断查询是否命中特定 TaurusDB 优化能力。",
    agentTitle: "Cursor + OpenTaurus MCP",
    agentMode: "enhanced explain",
    userPrompt: "帮我确认增强 explain 不是只返回标准计划，要看 TaurusDB 的优化提示是否命中。",
    agentReply: "我先探测实例能力，再分别检查 offset、parallel 和 NDP 的增强提示。",
    tools: ["list_taurus_features", "explain_sql_enhanced", "execute_readonly_sql"],
    streamLines: [
      "`list_taurus_features` 显示 `offset_pushdown`、`parallel_query`、`ndp_pushdown` 可用...",
      "offset 场景已经在增强 explain 中出现可读提示。",
      "parallel query 场景命中成功，说明增强 explain 不只服务分页查询。",
      "NDP pushdown 场景也有实测记录支撑。",
      "这类页面要展示 `taurusHints` 如何变成人能读懂的解释。",
    ],
    agentResponses: [
      {
        title: "回复 1",
        lines: [
          "实例被识别为 TaurusDB，相关优化能力处于可用或已启用状态。",
          "我会按 offset、parallel、NDP 三类场景分别读取增强 explain 输出。",
        ],
      },
      {
        title: "回复 2",
        lines: [
          "三类增强 explain 场景都有实测闭环，返回中能看到 `taurusHints` 和可读优化解释。",
          "这说明页面可以把增强 explain 作为 TaurusDB 查询体验的重点能力，而不是普通 EXPLAIN 的附属说明。",
        ],
      },
    ],
    outputCards: [
      {
        title: "三类增强 explain 覆盖",
        table: {
          headers: ["优化方向", "报告结论"],
          rows: [
            ["offset_pushdown", "场景命中成功"],
            ["parallel_query", "场景命中成功"],
            ["ndp_pushdown", "场景命中成功"],
            ["输出形态", "`taurusHints` + 可读解释"],
          ],
        },
        lines: [
          "报告证据摘要：三类增强 explain 路径都已有实测闭环。",
          "页面用结构化表格承载覆盖范围，避免把它混在通用查询页里。",
        ],
      },
    ],
  },
];
