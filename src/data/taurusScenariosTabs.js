export const taurusScenarios = [
  {
    id: "masking",
    label: "Dynamic Masking",
    tagline: "敏感字段按身份动态脱敏",
    steps: [
      { type: "chat", user: "帮我查一下 customer_name='masking-a' 的手机号" },
      { type: "tool", name: "execute_readonly_sql", args: '(sql: "SELECT * FROM t_dynamic_masking_test WHERE customer_name=\'masking-a\'")' },
      { type: "result", label: "当前身份：受控用户 youweichen", lines: [
        'customer_name: masking-a',
        'phone:    ******',
        'email:    ******',
        'id_no:    ******',
      ]},
      { type: "chat", agent: "脱敏生效。同一底表记录用 root 账户查询返回原始值。" },
      { type: "result", label: "同一记录 · 高权限用户 root", lines: [
        'phone:    138****5678',
        'email:    masking-a@example.com',
        'id_no:    3301****1234',
      ], success: true },
      { type: "chat", agent: "底表原值未被改写，仅查询结果层脱敏。规则对 youweichen 生效，root 不受影响。" },
    ],
  },
  {
    id: "explain",
    label: "Enhanced Explain",
    tagline: "TaurusDB 专属优化命中识别",
    steps: [
      { type: "chat", user: "帮我验证 TaurusDB 的三个 explain hint 是否命中" },
      { type: "tool", name: "explain_sql_enhanced", args: '(sql: "SELECT ... ORDER BY id LIMIT 100 OFFSET 500")' },
      { type: "result", label: "hint: offset_pushdown", lines: [
        '分页偏移已下推，降低无效扫描',
        'TaurusDB 优化已命中',
      ]},
      { type: "tool", name: "explain_sql_enhanced", args: '(sql: "SELECT /*+ parallel */ category, COUNT(*) ... GROUP BY category")' },
      { type: "result", label: "hint: parallel_query", lines: [
        '已启用并行执行，提高分析型查询吞吐',
        'TaurusDB 优化已命中',
      ]},
      { type: "result", label: "hint: ndp_pushdown", lines: [
        '聚合下推到近数据处理层，减少数据搬运',
        'TaurusDB 优化已命中',
      ]},
    ],
  },
  {
    id: "ddl",
    label: "Nonblocking DDL",
    tagline: "在线加列不阻断读流量",
    steps: [
      { type: "chat", user: "帮我做 online schema 变更，加个 remark 字段" },
      { type: "tool", name: "execute_ddl", args: '(sql: "ALTER TABLE t_nonblocking_ddl_test ADD COLUMN remark VARCHAR(128)")' },
      { type: "result", label: "DDL 执行结果", lines: [
        'DDL 执行中...',
        '✔ schema 变更成功',
      ]},
      { type: "chat", agent: "DDL 期间并发查询是否正常返回？" },
      { type: "tool", name: "execute_readonly_sql", args: '(sql: "SELECT id, sku, inventory FROM t_nonblocking_ddl_test")' },
      { type: "result", label: "并发查询结果", lines: [
        '✔ 2 rows in set',
        'DDL 期间未出现读流量阻塞',
      ], success: true },
    ],
  },
  {
    id: "recycle",
    label: "Recycle Bin",
    tagline: "误删表秒级恢复",
    steps: [
      { type: "chat", user: "t_recycle_bin_test 表不见了，帮我恢复" },
      { type: "tool", name: "list_recycle_bin", args: "()" },
      { type: "result", label: "回收站查询结果", lines: [
        '✔ 找到 t_recycle_bin_test',
        '删除时间: 2026-05-13 10:35:00',
      ]},
      { type: "chat", agent: "这是高风险操作，需要二次确认。回复「确认」执行恢复。" },
      { type: "chat", user: "确认" },
      { type: "result", label: "恢复执行结果", lines: [
        '确认 token 已生成',
        '正在执行恢复...',
        '✔ t_recycle_bin_test 恢复成功，3 rows recovered',
      ], success: true },
    ],
  },
];

export function getTaurusScenario(id) {
  return taurusScenarios.find((s) => s.id === id);
}
