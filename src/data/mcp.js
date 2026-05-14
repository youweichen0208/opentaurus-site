export const diagnosticsScenarios = [
  {
    label: "Scenario 01",
    title: "慢 SQL 为什么拖慢接口",
    description:
      "从自然语言问题出发，先找最近窗口里的慢 SQL，再对命中的语句做根因分析。这是最适合做成动态输入输出流的一类场景。",
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
    finalAnswer: [
      "最可疑 SQL 已被 `find_top_slow_sql` 命中，属于 `LIKE '%999%'` 加排序的组合。",
      "`diagnose_slow_query` 已指出前导通配符、排序和 offset 共同放大了代价。",
      "这条链路已经形成“发现 SQL -> 回到根因”的闭环。",
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
          "截图中已直接标出问题：前缀模糊匹配导致全表扫描，扫描规模约 25 万行。",
        ],
        proofs: [
          {
            summary: "查看原始证据截图",
            src: "/assets/taurusdb-testing-report/image-14.png",
            alt: "find_top_slow_sql 命中 LIKE 模糊匹配 SQL",
          },
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
    finalAnswer: [
      "当前卡顿由单个 blocker 持有热点行锁引起，等待方已经进入锁等待。",
      "`show_processlist` 和 `diagnose_lock_contention` 都指向同一条阻塞链。",
      "页面里展示的是“问题 -> blocker/waiter 关系 -> 结论”的完整过程。",
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
          "截图摘要已明确提示两会话并发更新同一行，可能产生锁竞争。",
        ],
        proofs: [
          {
            summary: "查看原始证据截图",
            src: "/assets/taurusdb-testing-report/image-19.png",
            alt: "show_processlist 捕获锁等待现场",
          },
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
        proofs: [
          {
            summary: "查看原始证据截图",
            src: "/assets/taurusdb-testing-report/image-13.png",
            alt: "diagnose_lock_contention 识别 blocker 和 waiter",
          },
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
      "这一类问题更接近“数据查询”而不是“事故诊断”。重点是让用户看到查询语句、执行解释和优化线索如何串起来。",
    agentTitle: "Cursor + OpenTaurus MCP",
    agentMode: "query + explain",
    userPrompt: "我想看这个查询为什么这么重，先给我解释一下它的执行方式。",
    agentReply: "我先确认实例能力，再结合查询模式解释可能命中的优化路径和当前瓶颈。",
    tools: ["list_taurus_features", "explain_sql_enhanced", "execute_readonly_sql"],
    streamLines: [
      "实例已识别为 TaurusDB，开始检查增强 explain 能否提供 offset、并行和 NDP 方向的提示...",
      "当前查询命中的是增强 explain 路径，不只是标准 EXPLAIN 文本。",
      "结果里已经出现 `taurusHints`，可以直接转成对人可读的执行解释。",
      "这种查询页的重点不是“有没有工具”，而是“结果解释是否能直接被用户理解”。",
    ],
    finalAnswer: [
      "这条查询已经命中 TaurusDB 增强 explain，返回中包含可读的优化提示。",
      "当前可以明确展示 offset pushdown、parallel query、NDP pushdown 等解释信息。",
      "页面应该把“查询结果”和“执行解释”作为一个完整问答来呈现。",
    ],
    outputCards: [
      {
        title: "`list_taurus_features` 上下文",
        meta: [
          { label: "kernel", value: "`8.0.22`" },
          { label: "mysql compatibility", value: "`8.0`" },
          { label: "enabled", value: "`offset_pushdown` / `parallel_query` / `ndp_pushdown`" },
          { label: "page role", value: "先给查询解释一个 TaurusDB 上下文" },
        ],
        proofs: [
          {
            summary: "查看原始证据截图",
            src: "/assets/taurusdb-testing-report/image-30.png",
            alt: "TaurusDB 实例能力探测结果",
          },
        ],
      },
      {
        title: "`explain_sql_enhanced` 提取结果",
        table: {
          headers: ["字段", "值"],
          rows: [
            ["type", "`index`"],
            ["key", "`PRIMARY`"],
            ["rows", "`5020`"],
            ["extra", "`Using offset pushdown`"],
            ["优化命中", "`offset_pushdown` ✅ / `parallel_query` ✅ / `ndp_pushdown` ❌"],
          ],
        },
        proofs: [
          {
            summary: "查看原始证据截图",
            src: "/assets/taurusdb-testing-report/image-44.png",
            alt: "offset_pushdown 场景",
          },
        ],
      },
    ],
  },
  {
    label: "Scenario 02",
    title: "Flashback Query 用来对比历史态和当前态",
    description:
      "这组更像“时间维度的数据查询”。用户的问题不是服务为什么挂了，而是某个时刻的数据到底是什么样。",
    agentTitle: "Cursor + OpenTaurus MCP",
    agentMode: "flashback comparison",
    userPrompt: "我怀疑这条记录被改过，帮我对比更新前和现在的值。",
    agentReply: "我先确认 flashback 能力已经开启，再按记录的时间点回查历史态，并和当前查询结果做对照。",
    tools: ["list_taurus_features", "flashback_query", "execute_readonly_sql"],
    streamLines: [
      "flashback 参数和表级 BACKQUERY 配置都已满足，可以继续做历史时刻回查...",
      "先读取更新前时间点 T1 对应的历史态，再读取当前值。",
      "两次查询对照显示，历史态和当前态确实不同，说明更新已经发生。",
      "这类页面应该重点突出“同一条记录在两个时间切片里的结果差异”。",
    ],
    finalAnswer: [
      "`flashback_query` 已经返回历史时刻的旧值。",
      "普通只读查询返回的是更新后的当前值，两者形成直接对照。",
      "这类能力更适合收在“数据查询”页，而不是和恢复、脱敏混在一起。",
    ],
    outputCards: [
      {
        title: "Flashback 前置条件",
        lines: [
          "实例参数 `innodb_rds_backquery_enable` 已开启。",
          "测试表以 `BACKQUERY=1` 创建，可进行历史视图回查。",
          "本次对比使用历史时点 `2026-05-13 11:04:39`。",
        ],
        proofs: [
          {
            summary: "查看原始证据截图",
            src: "/assets/taurusdb-testing-report/image-35.png",
            alt: "flashback 参数已开启",
          },
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
        proofs: [
          {
            summary: "查看原始证据截图",
            src: "/assets/taurusdb-testing-report/image-42.png",
            alt: "flashback_query 返回历史态，对比当前态",
          },
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
    agentTitle: "Cursor + OpenTaurus MCP",
    agentMode: "recycle bin recovery",
    userPrompt: "我误删了一张测试表，先确认能不能恢复，再帮我恢复回来。",
    agentReply: "我先检查 recycle bin 和实例能力，如果对象还在，再发起恢复并处理 confirmation token。",
    tools: ["list_taurus_features", "list_recycle_bin", "restore_recycle_bin_table"],
    streamLines: [
      "已确认实例开启 recycle bin，开始查询回收站对象列表...",
      "目标表删除后仍在 recycle bin 中，可继续恢复。",
      "第一次恢复请求按预期返回 `confirmation_token`，没有直接执行。",
      "带 token 二次调用后，恢复成功，继续校验表和记录数是否恢复。",
      "这一步最能体现 MCP 对高风险动作的 guardrail 模型。",
    ],
    finalAnswer: [
      "目标对象仍在 recycle bin 中，可恢复。",
      "恢复流程遵循两阶段确认，先拿 token，再执行恢复。",
      "恢复后表和样本数据都已回到删除前状态。",
    ],
    outputCards: [
      {
        title: "`restore_recycle_bin_table` 第一次返回",
        meta: [
          { label: "ok", value: "`false`" },
          { label: "error code", value: "`CONFIRMATION_REQUIRED`" },
          { label: "method", value: "`native_restore`" },
          { label: "destination", value: "`taurusdb_test.t_recycle_bin_test`" },
        ],
        lines: [
          "返回了明确的 `confirmation_token`，而不是直接执行恢复。",
          "这说明恢复类操作受 guardrail 保护，必须二次确认。",
        ],
        proofs: [
          {
            summary: "查看原始证据截图",
            src: "/assets/taurusdb-testing-report/image-53.png",
            alt: "第一次调用返回 confirmation token",
          },
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
        proofs: [
          {
            summary: "查看原始证据截图",
            src: "/assets/taurusdb-testing-report/image-54.png",
            alt: "第二次调用恢复成功",
          },
        ],
      },
    ],
  },
  {
    label: "Scenario 02",
    title: "Dynamic Masking 要展示双视角查询结果",
    description:
      "差异化不在于“参数开启”，而在于同一条数据在不同身份下返回不同内容，而且底表原值没有被改写。",
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
    finalAnswer: [
      "动态脱敏功能已开启并存在有效规则。",
      "`root` 视角返回原始值，受控用户视角返回脱敏值，且命中同一条记录。",
      "这类能力应该独立收在 TaurusDB 专属能力页。",
    ],
    outputCards: [
      {
        title: "Dynamic Masking 前提",
        lines: [
          "动态脱敏参数 `rds_dynamic_masking_enabled=ON`。",
          "查询目标为 `t_dynamic_masking_test` 表中 `id = 1` 的记录。",
          "比对维度为 `phone`、`email`、`id_no` 三个敏感字段。",
        ],
        proofs: [
          {
            summary: "查看原始证据截图",
            src: "/assets/taurusdb-testing-report/image-48.png",
            alt: "动态脱敏参数已开启",
          },
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
        proofs: [
          {
            summary: "查看高权限原始截图",
            src: "/assets/taurusdb-testing-report/image-58.png",
            alt: "高权限用户查询原始值",
          },
          {
            summary: "查看受控用户原始截图",
            src: "/assets/taurusdb-testing-report/image-60.png",
            alt: "受控用户查询脱敏值",
          },
        ],
      },
    ],
  },
];
