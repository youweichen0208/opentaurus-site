import { taurusScenarios } from "./mcp";

export const taurusNativeScenarioPages = [
  {
    slug: "recycle-bin-recovery",
    tag: "Scenario 01",
    navTitle: "Recycle Bin Recovery",
    title: "Recycle Bin 恢复流程",
    description:
      "先在测试库准备一张真实业务表并显式删除，再进入 Cursor + OpenTaurus MCP 的恢复链路，展示 confirmation token 如何把高风险恢复动作拆成二次确认流程。",
    terminalTitle: "recycle bin setup",
    terminalLines: [
      "mysql> CREATE TABLE taurusdb_test.t_recycle_bin_test (",
      "mysql>   id BIGINT PRIMARY KEY,",
      "mysql>   order_no VARCHAR(32) NOT NULL,",
      "mysql>   status VARCHAR(16) NOT NULL,",
      "mysql>   amount DECIMAL(10,2) NOT NULL,",
      "mysql>   created_at DATETIME NOT NULL",
      "mysql> );",
      "mysql> INSERT INTO taurusdb_test.t_recycle_bin_test",
      "mysql>   (id, order_no, status, amount, created_at)",
      "mysql> VALUES",
      "mysql>   (1, 'rb-20260513-001', 'paid', 128.50, '2026-05-13 10:30:00'),",
      "mysql>   (2, 'rb-20260513-002', 'pending', 88.00, '2026-05-13 10:33:00'),",
      "mysql>   (3, 'rb-20260513-003', 'paid', 256.00, '2026-05-13 10:35:00');",
      "mysql> DROP TABLE t_recycle_bin_test;",
    ],
    links: [
      { label: "返回专属能力总览", to: "/mcp/taurusdb" },
      { label: "Dynamic Masking", to: "/mcp/taurusdb/dynamic-masking" },
      { label: "Nonblocking DDL", to: "/mcp/taurusdb/nonblocking-ddl" },
    ],
    scenario: taurusScenarios[0],
    prep: {
      overviewTitle: "Recycle Bin",
      flowIntro:
        "下面按真实执行顺序展开：先在 MySQL 里准备对象，再删除制造问题现场，最后进入 Cursor + OpenTaurus MCP 的恢复流程。",
      demoStepTitle: "Cursor + OpenTaurus MCP 恢复流",
      demoStepDescription:
        "上面的数据库现场已经准备好，下面才是用户进入 Agent 对话后，MCP 如何发现回收站对象、返回 confirmation token，并执行二次确认恢复。",
      summary: [
        "基本功能：把误删表对象保留在 recycle bin 中，允许后续恢复，而不是删除后立刻不可逆。",
        "应用场景：误删测试表、误删演示数据表、上线前后人工清理误操作，都适合先查 recycle bin 再恢复。",
        "用处：把恢复动作变成有 guardrail 的两阶段流程，先拿 `confirmation_token`，再显式确认执行。",
      ],
      steps: [
        {
          title: "1. 建表并写入样本数据",
          terminalTitle: "recycle bin setup",
          interactions: [
            {
              commandLines: [
                "mysql> CREATE TABLE taurusdb_test.t_recycle_bin_test (",
                "mysql>   id BIGINT PRIMARY KEY,",
                "mysql>   order_no VARCHAR(32) NOT NULL,",
                "mysql>   status VARCHAR(16) NOT NULL,",
                "mysql>   amount DECIMAL(10,2) NOT NULL,",
                "mysql>   created_at DATETIME NOT NULL",
                "mysql> );",
              ],
              resultLines: [
                "Table `taurusdb_test.t_recycle_bin_test` created successfully.",
              ],
            },
            {
              commandLines: [
                "mysql> INSERT INTO taurusdb_test.t_recycle_bin_test",
                "mysql>   (id, order_no, status, amount, created_at)",
                "mysql> VALUES",
                "mysql>   (1, 'rb-20260513-001', 'paid', 128.50, '2026-05-13 10:30:00'),",
                "mysql>   (2, 'rb-20260513-002', 'pending', 88.00, '2026-05-13 10:33:00'),",
                "mysql>   (3, 'rb-20260513-003', 'paid', 256.00, '2026-05-13 10:35:00');",
              ],
              resultLines: [
                "Query OK, 3 rows affected.",
              ],
            },
            {
              commandLines: [
                "mysql> SELECT * FROM taurusdb_test.t_recycle_bin_test ORDER BY id;",
              ],
              resultLines: [
                "3 rows in set.",
              ],
              table: {
                headers: ["id", "order_no", "status", "amount", "created_at"],
                rows: [
                  ["1", "rb-20260513-001", "paid", "128.50", "2026-05-13 10:30:00"],
                  ["2", "rb-20260513-002", "pending", "88.00", "2026-05-13 10:33:00"],
                  ["3", "rb-20260513-003", "paid", "256.00", "2026-05-13 10:35:00"],
                ],
              },
            },
          ],
        },
        {
          title: "2. 显式删除，让对象进入 Recycle Bin",
          terminalTitle: "recycle bin setup",
          interactions: [
            {
              commandLines: [
                "mysql> DROP TABLE taurusdb_test.t_recycle_bin_test;",
              ],
              resultLines: [
                "Query OK, 0 rows affected.",
              ],
            },
            {
              commandLines: [
                "mysql> SHOW TABLES LIKE 't_recycle_bin_test';",
              ],
              resultLines: [
                "Empty set.",
                "Table `t_recycle_bin_test` is no longer visible in the current schema.",
                "Recycle bin object will be confirmed in the following MCP flow.",
              ],
            },
          ],
        },
      ],
    },
  },
  {
    slug: "dynamic-masking",
    tag: "Scenario 02",
    navTitle: "Dynamic Masking",
    title: "先造一条敏感数据，再验证不同身份看到的值",
    description:
      "这个场景先创建带手机号、邮箱、证件号的测试表，再配置动态脱敏规则。用户随后在 Cursor 里要求对比管理员与受控用户对同一条记录的查询结果。",
    terminalTitle: "dynamic masking setup",
    terminalLines: [
      "mysql> CREATE TABLE taurusdb_test.t_dynamic_masking_test (...);",
      "mysql> INSERT INTO taurusdb_test.t_dynamic_masking_test VALUES (...);",
      "mysql> ALTER INSTANCE SET rds_dynamic_masking_enabled = ON;",
      "mysql> CREATE MASKING POLICY mask_customer_sensitive ...;"
    ],
    links: [
      { label: "返回 TaurusDB 总览", to: "/mcp/taurusdb" },
      { label: "Recycle Bin", to: "/mcp/taurusdb/recycle-bin-recovery" },
      { label: "Flashback Query", to: "/mcp/taurusdb/flashback-query" },
      { label: "Enhanced Explain", to: "/mcp/taurusdb/enhanced-explain" },
    ],
    scenario: taurusScenarios[1],
    prep: {
      overviewTitle: "Dynamic Masking",
      flowIntro:
        "下面按真实执行顺序展开：先在 MySQL 里创建敏感数据并绑定脱敏规则，然后再进入 Cursor + OpenTaurus MCP 的双视角查询流程。",
      demoStepTitle: "Cursor + OpenTaurus MCP 双视角查询流",
      demoStepDescription:
        "上面的底表和规则已经准备好，下面才是用户进入 Agent 对话后，MCP 如何分别从高权限与受控用户视角读取同一条记录，并直接展示差异。",
      summary: [
        "基本功能：同一条底表记录对不同身份返回不同展示值，敏感字段按规则动态脱敏。",
        "应用场景：客服、运营、分析用户需要查业务数据，但不应该直接看到手机号、邮箱、证件号原文。",
        "用处：保持底表原值不变，把权限控制放在查询返回层，避免为脱敏复制多份数据。",
      ],
      steps: [
        {
          title: "1. 建表并插入敏感数据",
          terminalTitle: "dynamic masking setup",
          interactions: [
            {
              commandLines: [
                "mysql> CREATE TABLE taurusdb_test.t_dynamic_masking_test (",
                "mysql>   id BIGINT PRIMARY KEY,",
                "mysql>   customer_name VARCHAR(64) NOT NULL,",
                "mysql>   phone VARCHAR(20) NOT NULL,",
                "mysql>   email VARCHAR(128) NOT NULL,",
                "mysql>   id_no VARCHAR(32) NOT NULL,",
                "mysql>   city VARCHAR(32) NOT NULL",
                "mysql> );",
              ],
              resultLines: [
                "Table `taurusdb_test.t_dynamic_masking_test` created successfully.",
              ],
            },
            {
              commandLines: [
                "mysql> INSERT INTO taurusdb_test.t_dynamic_masking_test",
                "mysql>   (id, customer_name, phone, email, id_no, city)",
                "mysql> VALUES",
                "mysql>   (1, 'masking-a', '13812345678', 'masking-a@example.com', '330101199001011234', 'Hangzhou');",
              ],
              resultLines: [
                "Query OK, 1 row affected.",
              ],
            },
            {
              commandLines: [
                "mysql> SELECT id, phone, email, id_no",
                "mysql> FROM taurusdb_test.t_dynamic_masking_test;",
              ],
              resultLines: [
                "1 row in set.",
              ],
              table: {
                headers: ["id", "phone", "email", "id_no"],
                rows: [
                  ["1", "13812345678", "masking-a@example.com", "330101199001011234"],
                ],
              },
            },
          ],
        },
        {
          title: "2. 开启参数并绑定脱敏规则",
          terminalTitle: "dynamic masking setup",
          interactions: [
            {
              commandLines: [
                "mysql> ALTER INSTANCE SET rds_dynamic_masking_enabled = ON;",
              ],
              resultLines: [
                "Query OK, dynamic masking enabled.",
              ],
            },
            {
              commandLines: [
                "mysql> CREATE MASKING POLICY mask_customer_sensitive",
                "mysql>   ON taurusdb_test.t_dynamic_masking_test(phone, email, id_no)",
                "mysql>   FOR USER youweichen",
                "mysql>   USING '******';",
              ],
              resultLines: [
                "Masking policy `mask_customer_sensitive` created successfully.",
                "受控用户 `youweichen` 对 `phone`、`email`、`id_no` 的读取已经被规则接管。",
              ],
              table: {
                headers: ["target user", "columns", "masked value"],
                rows: [
                  ["youweichen", "phone / email / id_no", "******"],
                ],
              },
            },
          ],
        },
      ],
    },
  },
  {
    slug: "flashback-query",
    tag: "Scenario 03",
    navTitle: "Flashback Query",
    title: "按时间点回看历史态，再和当前态对照",
    description:
      "这个场景先准备一条可回查的记录，记录更新前后时间点，再进入 Cursor + OpenTaurus MCP 调用 flashback_query 对比历史态和当前态。",
    terminalTitle: "flashback query setup",
    terminalLines: [
      "mysql> CREATE TABLE taurusdb_test.t_flashback_query_test (...) BACKQUERY=1;",
      "mysql> INSERT INTO taurusdb_test.t_flashback_query_test VALUES (..., 'draft', ...);",
      "mysql> SELECT NOW() AS t1;",
      "mysql> UPDATE taurusdb_test.t_flashback_query_test SET status = 'published';",
      "mysql> SELECT NOW() AS t2;",
    ],
    links: [
      { label: "返回 TaurusDB 总览", to: "/mcp/taurusdb" },
      { label: "Dynamic Masking", to: "/mcp/taurusdb/dynamic-masking" },
      { label: "Enhanced Explain", to: "/mcp/taurusdb/enhanced-explain" },
      { label: "Nonblocking DDL", to: "/mcp/taurusdb/nonblocking-ddl" },
    ],
    scenario: taurusScenarios[3],
    prep: {
      overviewTitle: "Flashback Query",
      flowIntro:
        "下面按真实执行顺序展开：先开启可回查表并制造一次状态变更，再进入 Cursor + OpenTaurus MCP 对比历史态和当前态。",
      demoStepTitle: "Cursor + OpenTaurus MCP 历史态对照流",
      demoStepDescription:
        "上面的记录已经发生状态变化，下面展示 MCP 如何确认 flashback 前置条件，并按历史时间点回查旧值。",
      summary: [
        "基本功能：按历史时间点读取记录旧值，并与当前普通查询结果对照。",
        "应用场景：误更新排查、状态流转核对、审计前的快速事实确认。",
        "用处：不用先恢复数据，也能回答“某个时刻这条记录到底是什么值”。",
      ],
      steps: [
        {
          title: "1. 准备可回查表和初始记录",
          terminalTitle: "flashback query setup",
          interactions: [
            {
              commandLines: [
                "mysql> CREATE TABLE taurusdb_test.t_flashback_query_test (",
                "mysql>   id BIGINT PRIMARY KEY,",
                "mysql>   name VARCHAR(64) NOT NULL,",
                "mysql>   status VARCHAR(16) NOT NULL,",
                "mysql>   updated_at DATETIME NOT NULL",
                "mysql> ) BACKQUERY=1;",
              ],
              resultLines: ["Table created with BACKQUERY=1."],
            },
            {
              commandLines: [
                "mysql> INSERT INTO taurusdb_test.t_flashback_query_test",
                "mysql>   VALUES (1, 'flashback-a', 'draft', '2026-05-13 11:03:39');",
              ],
              resultLines: ["Query OK, 1 row affected."],
              table: {
                headers: ["id", "name", "status", "updated_at"],
                rows: [["1", "flashback-a", "draft", "2026-05-13 11:03:39"]],
              },
            },
          ],
        },
        {
          title: "2. 记录时间点并制造状态变化",
          terminalTitle: "flashback query setup",
          interactions: [
            {
              commandLines: ["mysql> SELECT NOW() AS t1;"],
              resultLines: ["t1 = 2026-05-13 11:04:39"],
            },
            {
              commandLines: [
                "mysql> UPDATE taurusdb_test.t_flashback_query_test",
                "mysql> SET status = 'published', updated_at = '2026-05-13 11:04:39'",
                "mysql> WHERE id = 1;",
              ],
              resultLines: ["Query OK, 1 row affected."],
            },
            {
              commandLines: ["mysql> SELECT id, name, status, updated_at FROM taurusdb_test.t_flashback_query_test WHERE id = 1;"],
              resultLines: ["1 row in set."],
              table: {
                headers: ["id", "name", "status", "updated_at"],
                rows: [["1", "flashback-a", "published", "2026-05-13 11:04:39"]],
              },
            },
          ],
        },
      ],
    },
  },
  {
    slug: "enhanced-explain",
    tag: "Scenario 04",
    navTitle: "Enhanced Explain",
    title: "单独验证 TaurusDB 增强 Explain 命中情况",
    description:
      "这个场景不再放在通用查询页里，而是专门展示 explain_sql_enhanced 如何识别 offset_pushdown、parallel_query、ndp_pushdown 等 TaurusDB 优化提示。",
    terminalTitle: "enhanced explain setup",
    terminalLines: [
      "mysql> SELECT ... LIMIT 100 OFFSET 500;",
      "mysql> EXPLAIN SELECT ...;",
      "tool> explain_sql_enhanced",
      "hints> offset_pushdown / parallel_query / ndp_pushdown",
    ],
    links: [
      { label: "返回 TaurusDB 总览", to: "/mcp/taurusdb" },
      { label: "Flashback Query", to: "/mcp/taurusdb/flashback-query" },
      { label: "Dynamic Masking", to: "/mcp/taurusdb/dynamic-masking" },
      { label: "Nonblocking DDL", to: "/mcp/taurusdb/nonblocking-ddl" },
    ],
    scenario: taurusScenarios[4],
    prep: {
      overviewTitle: "Enhanced Explain",
      flowIntro:
        "下面按真实执行顺序展开：先准备会触发不同优化方向的查询，再进入 Cursor + OpenTaurus MCP 读取增强 explain 结果。",
      demoStepTitle: "Cursor + OpenTaurus MCP 增强 Explain 验证流",
      demoStepDescription:
        "上面的查询上下文已经准备好，下面展示 MCP 如何把增强 explain 的 taurusHints 转成客户能理解的优化命中说明。",
      summary: [
        "基本功能：在标准执行计划之外返回 TaurusDB 专属优化提示。",
        "应用场景：确认 offset pushdown、parallel query、NDP pushdown 是否实际命中。",
        "用处：把“是否吃到 TaurusDB 优化”从猜测变成可解释结果。",
      ],
      steps: [
        {
          title: "1. 准备需要解释的查询形态",
          terminalTitle: "enhanced explain setup",
          interactions: [
            {
              commandLines: [
                "mysql> SELECT id, user_id, status, amount",
                "mysql> FROM taurusdb_test.t_orders_test",
                "mysql> ORDER BY id LIMIT 100 OFFSET 500;",
              ],
              resultLines: ["Query shape prepared for offset pushdown verification."],
            },
            {
              commandLines: [
                "mysql> SELECT /*+ parallel */ category, COUNT(*)",
                "mysql> FROM taurusdb_test.t_storage_test",
                "mysql> GROUP BY category;",
              ],
              resultLines: ["Query shape prepared for parallel query verification."],
            },
          ],
        },
        {
          title: "2. 记录增强 Explain 的关注点",
          terminalTitle: "enhanced explain setup",
          interactions: [
            {
              commandLines: ["tool> explain_sql_enhanced"],
              resultLines: [
                "Expected TaurusDB hints: offset_pushdown / parallel_query / ndp_pushdown.",
                "The MCP flow below turns those hints into readable conclusions.",
              ],
              table: {
                headers: ["hint", "customer meaning"],
                rows: [
                  ["offset_pushdown", "分页偏移下推，降低无效扫描"],
                  ["parallel_query", "并行执行，提高分析型查询吞吐"],
                  ["ndp_pushdown", "近数据处理下推，减少数据搬运"],
                ],
              },
            },
          ],
        },
      ],
    },
  },
  {
    slug: "nonblocking-ddl",
    tag: "Scenario 05",
    navTitle: "Nonblocking DDL",
    title: "先准备一张在被查询的表，再验证 DDL 不打断读流量",
    description:
      "这个场景强调的是执行期行为。先准备带样本数据的表，再让 DDL 与只读查询并发运行，验证查询在 DDL 期间仍能正常返回。",
    terminalTitle: "nonblocking ddl setup",
    terminalLines: [
      "mysql> CREATE TABLE taurusdb_test.t_nonblocking_ddl_test (...);",
      "mysql> INSERT INTO taurusdb_test.t_nonblocking_ddl_test VALUES (...);",
      "mysql> ALTER TABLE taurusdb_test.t_nonblocking_ddl_test ADD COLUMN remark VARCHAR(128) NULL;",
      "mysql> SELECT id, sku, inventory FROM taurusdb_test.t_nonblocking_ddl_test ORDER BY id;"
    ],
    links: [
      { label: "返回 TaurusDB 总览", to: "/mcp/taurusdb" },
      { label: "Recycle Bin", to: "/mcp/taurusdb/recycle-bin-recovery" },
      { label: "Dynamic Masking", to: "/mcp/taurusdb/dynamic-masking" },
    ],
    scenario: taurusScenarios[2],
    prep: {
      overviewTitle: "Nonblocking DDL",
      flowIntro:
        "下面按真实执行顺序展开：先在 MySQL 里准备业务表和样本数据，再进入 Cursor + OpenTaurus MCP 对照 DDL 与并发查询时间线。",
      demoStepTitle: "Cursor + OpenTaurus MCP 在线 DDL 验证流",
      demoStepDescription:
        "上面的测试表已经准备好，下面展示 MCP 如何确认 nonblocking_ddl 能力，并把 DDL 期间查询侧仍能返回这件事讲清楚。",
      summary: [
        "基本功能：执行 DDL 时尽量不阻断正在进行的只读访问，把 schema 变更对业务读流量的影响降到最低。",
        "应用场景：在线加列、结构微调、灰度升级阶段，需要一边改 schema 一边保持查询可用。",
        "用处：把“能不能边改表边继续查”这件事讲清楚，方便客户理解 TaurusDB 在变更窗口里的价值。",
      ],
      steps: [
        {
          title: "1. 准备带数据的业务表",
          terminalTitle: "nonblocking ddl setup",
          interactions: [
            {
              commandLines: [
                "mysql> CREATE TABLE taurusdb_test.t_nonblocking_ddl_test (",
                "mysql>   id BIGINT PRIMARY KEY,",
                "mysql>   sku VARCHAR(32) NOT NULL,",
                "mysql>   inventory INT NOT NULL,",
                "mysql>   updated_at DATETIME NOT NULL",
                "mysql> );",
              ],
              resultLines: [
                "Table `taurusdb_test.t_nonblocking_ddl_test` created successfully.",
              ],
            },
            {
              commandLines: [
                "mysql> INSERT INTO taurusdb_test.t_nonblocking_ddl_test",
                "mysql>   (id, sku, inventory, updated_at)",
                "mysql> VALUES",
                "mysql>   (1, 'sku-001', 120, '2026-05-13 11:20:00'),",
                "mysql>   (2, 'sku-002', 85, '2026-05-13 11:21:00');",
              ],
              resultLines: [
                "Query OK, 2 rows affected.",
              ],
            },
            {
              commandLines: [
                "mysql> SELECT id, sku, inventory, updated_at",
                "mysql> FROM taurusdb_test.t_nonblocking_ddl_test",
                "mysql> ORDER BY id;",
              ],
              resultLines: [
                "2 rows in set.",
              ],
              table: {
                headers: ["id", "sku", "inventory", "updated_at"],
                rows: [
                  ["1", "sku-001", "120", "2026-05-13 11:20:00"],
                  ["2", "sku-002", "85", "2026-05-13 11:21:00"],
                ],
              },
            },
          ],
        },
        {
          title: "2. 触发 DDL，并保持只读查询在线",
          terminalTitle: "nonblocking ddl setup",
          interactions: [
            {
              commandLines: [
                "mysql> ALTER TABLE taurusdb_test.t_nonblocking_ddl_test",
                "mysql>   ADD COLUMN remark VARCHAR(128) NULL;",
              ],
              resultLines: [
                "Query OK, table altered successfully.",
              ],
            },
            {
              commandLines: [
                "mysql> SELECT id, sku, inventory",
                "mysql> FROM taurusdb_test.t_nonblocking_ddl_test",
                "mysql> ORDER BY id;",
              ],
              resultLines: [
                "2 rows in set.",
                "这说明观察重点不是“DDL 有没有执行”，而是“执行期间读流量是否被长时间阻塞”。",
              ],
              table: {
                headers: ["id", "sku", "inventory"],
                rows: [
                  ["1", "sku-001", "120"],
                  ["2", "sku-002", "85"],
                ],
              },
            },
          ],
        },
      ],
      resultSummary: [
        "这段验证的重点不是“DDL 执行成功”本身，而是 schema 变更期间只读查询没有被明显打断。",
        "这说明 TaurusDB 的价值不只是在变更能力存在，而是在变更窗口里尽量维持业务查询连续性。",
        "对客户来说，重点不是多了一个 `ALTER TABLE` 示例，而是理解“边改表边继续查”为什么重要。",
      ],
    },
  },
];

export function getTaurusNativeScenario(slug) {
  return taurusNativeScenarioPages.find((item) => item.slug === slug);
}
