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
    agentResponses: [
      {
        title: "回复 1",
        lines: [
          "实例已经识别为 TaurusDB，能力探测里显示 `offset_pushdown`、`parallel_query`、`ndp_pushdown` 都已开启。",
          "所以这次不是只给标准 EXPLAIN，而是走增强 explain 路径。",
        ],
      },
      {
        title: "回复 2",
        lines: [
          "增强 explain 结果里已经出现 `Using offset pushdown`，并且直接标出了 `offset_pushdown` ✅ / `parallel_query` ✅ / `ndp_pushdown` ❌。",
          "页面应该把“查询结果”和“执行解释”作为一个完整问答来呈现。",
        ],
      },
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
          "这类能力更适合收在“数据查询”页，而不是和恢复、脱敏混在一起。",
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
];
