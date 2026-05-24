export type AbilitySectionKey = 'understand' | 'scenario' | 'mechanism' | 'value'

export type AbilityContentItem = string | {
  title: string
  description: string
}

export type Ability = {
  id: string
  name: string
  shortName: string
  description: string
  hasDrilldown: boolean
  navLabels?: {
    mechanism?: string
  }
  understand: {
    whatTitle: string
    what: string[]
    scenarioTitle: string
    scenarios: AbilityContentItem[]
    problems: AbilityContentItem[]
  }
  value: {
    summary?: string
    gains: AbilityContentItem[]
    values: AbilityContentItem[]
  }
}

export const abilitySectionOrder: AbilitySectionKey[] = ['understand', 'scenario', 'mechanism', 'value']
export const carbonAccountingSectionOrder: AbilitySectionKey[] = ['understand', 'mechanism']
export const overviewAbilityOrder = [
  'carbon-accounting',
  'supply-chain',
  'carbon-assets',
  'energy',
  'esg',
  'cbam',
] as const

export const getAbilitySectionOrder = (ability: Pick<Ability, 'id'> | undefined) => {
  if (ability?.id === 'carbon-accounting') {
    return carbonAccountingSectionOrder
  }

  return abilitySectionOrder
}

export const abilitySectionNames: Record<AbilitySectionKey, string> = {
  understand: '能力简介',
  scenario: '适用场景',
  mechanism: '如何运转',
  value: '得到什么',
}

export const abilities: Ability[] = [
  {
    id: 'cbam',
    name: 'CBAM 合规管理',
    shortName: 'CBAM',
    description: '面向欧盟碳边境调节机制（CBAM），针对钢铁、铝、水泥、化肥等管控品类，提供从工艺解构、排放核算到合规申报的全流程合规支持。系统内置动态对齐欧盟规则的核算模型与税额预演能力，赋能对欧出口企业实现高效常态化履约申报。',
    hasDrilldown: false,
    understand: {
      whatTitle: 'A. 这是什么',
      what: ['面向欧盟碳边境调节机制（CBAM），针对钢铁、铝、水泥、化肥等管控品类，提供从工艺解构、排放核算到合规申报的全流程合规支持。系统内置动态对齐欧盟规则的核算模型与税额预演能力，赋能对欧出口企业实现高效常态化履约申报。'],
      scenarioTitle: '应用/协作场景',
      scenarios: [],
      problems: [
        {
          title: '核算规则复杂严格',
          description: 'CBAM 对核算边界、计算方法（默认值或实测值）等有严格规定，与国内标准和 ISO 等国际标准差异较大，企业往往缺乏符合欧盟方法学的核算能力。',
        },
        {
          title: '数据穿透与追溯难',
          description: '复杂商品还需计算上游前体的隐含碳排放，跨国、跨企业的供应链数据不透明，链上企业配合度低，企业难以获取真实、完整的数据链。',
        },
        {
          title: '填报门槛高难度大',
          description: 'CBAM 填报表全英文、条目繁杂、计算逻辑复杂，非专业人士填报易导致关键数据遗漏或核算结果错配，引发合规退回。',
        },
        {
          title: '合规审核通过难',
          description: '若按实际值填报则需经欧盟认可的第三方机构现场审核，验厂材料复杂、流程严格，验核颗粒度细化至设备级。',
        },
      ],
    },
    value: {
      summary: '让 CBAM 合规从被动的出口业务卡点，转化为稳住欧盟市场、压低碳关税成本、保有持续出口竞争力的常态化能力。',
      gains: [
        {
          title: '符合规则顺利出口',
          description: '排放边界、前体物穿透及因子选用严格遵守欧盟最新 CBAM 要求，全流程计算要素可随时调取追溯。',
        },
        {
          title: '降低碳关税成本风险',
          description: '根据企业实际出口情况制定 CBAM 填报策略，平衡出口收益与合规成本，维稳欧洲市场规模并持续扩张。',
        },
        {
          title: '建立长效合规机制',
          description: '通过常态化的上游协同，企业逐步建立起覆盖管控品类的实测数据基础，CBAM 核算质量从一次性应付走向可累积提升。',
        },
      ],
      values: [
        {
          title: '合规无忧，打通欧盟贸易壁垒',
          description: '全面满足 CBAM 各项合规硬性要求，完善全套申报与溯源资料，消除出口通关阻碍，稳固欧盟市场份额。',
        },
        {
          title: '精准控费，合理优化碳税支出',
          description: '依托智能核算与最优 CBAM 填报方案，精准把控隐含碳排放数值，减少不必要碳关税支出，有效提升外贸产品盈利空间。',
        },
        {
          title: '能力沉淀，构建供应链碳优势',
          description: '建立标准化碳数据管理模式，沉淀碳数据治理与碳管控实战能力，同步契合全球低碳贸易趋势，塑造行业绿色竞争优势。',
        },
      ],
    },
  },
  {
    id: 'energy',
    name: '能碳管理',
    shortName: '能碳',
    description: '围绕企业电、热、燃料、蒸汽等多种能源介质，构建覆盖数据接入、实时监控、计量结算、运行优化与经济性分析的一体化能源管理体系。同步服务于碳盘查与产品碳足迹核算，让能源治理与碳管理共享同一数据底座。',
    hasDrilldown: false,
    understand: {
      whatTitle: 'A. 这是什么',
      what: ['围绕运行监测、异常识别与优化调整的能碳管理能力'],
      scenarioTitle: '应用/协作场景',
      scenarios: [
        {
          title: '全局能源监控',
          description: '覆盖电、热、燃料、蒸汽、压缩空气等多种能源介质，打造覆盖组织、产线、机组、设备等多颗粒度的实时监控视图。',
        },
        {
          title: '能耗分析、优化与对标',
          description: '对用能单元在一个时间周期内的用能结构、成本、能效等进行计算和分析，并提出优化用能配置、清洁能源使用等推荐策略。',
        },
        {
          title: '直连碳核算',
          description: '能耗活动数据按碳核算口径标准化沉淀，直接对接碳盘查与产品碳足迹核算，避免下游碳管理场景重复进行数据归集。',
        },
      ],
      problems: [
        {
          title: '用能异常洞察滞后',
          description: '传统能源台账缺乏向产线、机组、设备层级穿透的能力，用能异常难以即时洞察，错失干预最佳窗口。',
        },
        {
          title: '能耗管控粗放低效',
          description: '缺乏全域实时能耗统筹分析手段，粗颗粒度的能耗管控无法精准定位高耗点位，难以实现精细化节能管控。',
        },
        {
          title: '无法直接打通碳管理场景',
          description: '能耗数据的标准化程度不足，无法直接对接碳盘查与产品碳足迹核算的口径要求，下游碳管理场景需重复完成数据归集与清洗。',
        },
      ],
    },
    value: {
      summary: '推动企业能源管理从粗放结算迈向精细化运营，实现用能全过程的可监控、可归因与可优化。',
      gains: [
        {
          title: '用能可视化',
          description: '从设备级到工厂级的多层级实时用能视图，能流分析清晰可见，能效智能平衡与优化。',
        },
        {
          title: '损耗归因',
          description: '通过耗差分析与设备性能诊断，把“实际能耗 vs 标杆”的差异拆解为可执行的优化点。',
        },
        {
          title: '成本穿透',
          description: '打通能耗与费率，可按组织、产线、产品穿透分析能源成本。',
        },
      ],
      values: [
        {
          title: '降本增效',
          description: '通过精细化监控与运行优化，智能挖掘节能空间与降本机会。',
        },
        {
          title: '风控合规',
          description: '把控能耗与碳排放指标，精准匹配双碳政策要求，满足各类低碳考核与监管申报需求。',
        },
        {
          title: '能碳数据贯通',
          description: '能耗数据按碳核算口径标准化沉淀，无缝衔接碳盘查与产品碳足迹核算场景。',
        },
      ],
    },
  },
  {
    id: 'supply-chain',
    name: '供应链碳管理',
    shortName: '供应链',
    description: '构建全景式供应链碳排放图谱，赋能链主企业量化并穿透管理多级上游的真实碳排放数据，将范围三黑盒转化为清晰的管理抓手，驱动整条价值链的风险管控与协同降碳。',
    hasDrilldown: false,
    understand: {
      whatTitle: 'A. 这是什么',
      what: ['构建全景式供应链碳排放图谱，赋能链主企业量化并穿透管理多级上游的真实碳排放数据，将范围三黑盒转化为清晰的管理抓手，驱动整条价值链的风险管控与协同降碳。'],
      scenarioTitle: '应用/协作场景',
      scenarios: [
        {
          title: '上游供应商碳摸排',
          description: '一键联动上下游企业，批量开展供应商碳排放摸底排查，快速梳理供应链层级碳底数，摸清源头碳排放实况，筑牢全链条低碳管理基础。',
        },
        {
          title: '供应链碳数据协同',
          description: '打通上下游能耗、排放数据链路，实现供需两端碳数据高效同步共享，破除信息壁垒，完成全链条数据统一归集汇总。',
        },
        {
          title: '分级低碳准入管控',
          description: '建立供应商碳评级与低碳准入标准，依据碳排放水平完成资质筛选与等级划分，优先遴选低碳合作主体，优化供应链低碳结构。',
        },
        {
          title: '全链碳足迹溯源',
          description: '依托统一核算标准，追踪原材料至成品全流程碳排放轨迹，精准完成产业链碳足迹溯源，支撑绿色采购与低碳供应链体系搭建。',
        },
      ],
      problems: [
        {
          title: '范围三底层数据失真',
          description: '缺少真实供应商数据，导致范围三核算结果粗糙、无法溯源，难以经受合规披露与外部审计的双重检验。',
        },
        {
          title: '供应商数据主权顾虑',
          description: '供应商担忧生产工艺、能耗结构等核心商业机密泄露，不愿上传真实碳排放数据，导致底层实测数据采集难以落地。',
        },
        {
          title: '跨级供应链管理盲区',
          description: '传统碳管理手段通常仅能触达一级供应商，缺乏向二、三级供应链深度穿透的能力，无法掌握完整价值链碳排放结构。',
        },
        {
          title: '减排目标协同与追踪低效',
          description: '面对多层级供应商集群，难以高效统筹数据调研进度，且对供应商减排目标（如 SBTi）设定情况及合规资质过期的风险预警严重滞后。',
        },
      ],
    },
    value: {
      summary: '驱动供应链碳数据由“静态估算”向“动态资产”跃升，实现链主合规风控与供应商绿色出海的双向赋能。',
      gains: [
        {
          title: '碳数据合规可信',
          description: '精准归集供应链真实碳排放数据，完善范围三排放及产品碳足迹完整数据凭证，轻松满足信息披露要求，高效通过各类合规核查。',
        },
        {
          title: '碳排放链路全景可视',
          description: '链主企业突破单级视角限制，获得深层多级供应商的动态碳排图谱与即时风险看板。',
        },
        {
          title: '数据安全共建互信',
          description: '区块链技术赋能，打消企业核心数据泄露的顾虑，构建起互信互认的高质量数据提报生态。',
        },
      ],
      values: [
        {
          title: '链主合规与评级',
          description: '高效响应 SBTi 目标分解、CDP 供应链问卷及国际品牌方的绿色采购刚性要求。',
        },
        {
          title: '提升绿色竞争优势',
          description: '以高质量上游实测碳数据为支撑，优化链主企业终端产品的碳足迹表现，构筑绿色竞争壁垒。',
        },
        {
          title: '产业链协同减排',
          description: '与多级上游建立数据透明、进度可见的减碳协同机制，让净零目标具备可分解、可执行的落地路径。',
        },
      ],
    },
  },
  {
    id: 'esg',
    name: 'ESG 合规披露',
    shortName: 'ESG',
    description: '遵循 CDP、MSCI 等国际评级体系及各大交易所披露指引，构建“底层数据一次采集、多披露场景自动适配”的统一可持续数据底座，将宏大的 ESG 战略拆解为可落地的执行方案。',
    hasDrilldown: false,
    understand: {
      whatTitle: 'A. 这是什么',
      what: ['遵循 CDP、MSCI 等国际评级体系及各大交易所披露指引，构建“底层数据一次采集、多披露场景自动适配”的统一可持续数据底座，将宏大的 ESG 战略拆解为可落地的执行方案。'],
      scenarioTitle: '应用/协作场景',
      scenarios: [
        {
          title: '主流 ESG 评级动态响应',
          description: '对标 MSCI ESG 评级等主流打分模型，实时呈现 E/S/G 三维评分动态，精准定位失分项并推动内部优化整改。',
        },
        {
          title: '高标准资本市场报告披露',
          description: '针对不同财年与交易所要求，一站式生成符合规范的 GRI 可持续发展报告、港交所 ESG 报告及 A 股 ESG 年报的数据底稿。',
        },
        {
          title: '供应链及大客户联合尽调',
          description: '业务端快速调取系统内经审核的标准化数据，高效、高质量响应跨国品牌客户、欧盟进口商下发的特定 ESG 及双碳问卷核查。',
        },
        {
          title: '集团级目标下达与跨部门协同',
          description: '向各级分子公司及职能部门定点下发数据采集任务，线上完成填报、校验与审批闭环。',
        },
      ],
      problems: [
        {
          title: '披露框架多套并行',
          description: 'CDP、MSCI、GRI 以及 A/H 股可持续发展报告等众多标准并存，指标要求既有重叠又存差异，企业每年需应对多套口径填报。',
        },
        {
          title: '跨部门数据割裂与归集低效',
          description: 'E/S/G 三维度的数据深度散落在 EHS、HR、法务、采购等多个孤立部门，年度披露季临时手工索要数据，沟通与整合成本极高。',
        },
        {
          title: '口径冲突与外部审计风险',
          description: '由于缺乏统一的数据源管理体系，同一底层数据在不同报告、不同年份的披露中极易出现计算逻辑与口径不一致，面临评级降级或监管问询风险。',
        },
        {
          title: '管理过程黑盒与进度失控',
          description: '面对庞杂的披露项目，管理层难以实时掌握各部门数据填报、审核进度及指标达成现状，往往在报告出具期才发现数据缺失或严重滞后。',
        },
      ],
    },
    value: {
      summary: '让 ESG 管理从“一次性的合规交付”进阶为持续创造评级价值、融资价值与品牌价值的常态化治理能力。',
      gains: [
        {
          title: '数据一次采集多维复用',
          description: '终结重复填表，核心指标一键映射至多种问卷与报告，大幅削减人工二次加工动作。',
        },
        {
          title: '全链路口径一致与溯源',
          description: '对外披露的每一个关键数字，均可在系统内回溯到原始填报记录与审批轨迹，足以应对严苛的第三方审核。',
        },
        {
          title: '显著压缩报告交付周期',
          description: '数据归集从线下催收转为线上协同，年度 ESG 披露的准备周期大大缩短。',
        },
      ],
      values: [
        {
          title: '提振评级表现与资本市场认可',
          description: '以数据完整性与披露透明度，提升 MSCI、CDP 等核心评级，增强资本市场认可度。',
        },
        {
          title: '夯实数据底座赋能战略决策',
          description: '协助企业摸清 E、S、G 各维度数据，通过「青钥」平台转化为支撑长期战略决策的量化数据底座。',
        },
        {
          title: '稳固出海与绿色供应链话语权',
          description: '建立经得起审核的 ESG 数据基础与披露能力，将合规履约转化为国际绿色贸易竞争中的核心优势。',
        },
      ],
    },
  },
  {
    id: 'carbon-assets',
    name: '碳资产管理',
    shortName: '碳资产',
    description: '面向纳入全国及地方碳市场的控排企业，提供以统一碳资产账本为中枢的一站式管理平台，让碳排放权从合规负担转化为可量化、可经营的企业资产。',
    hasDrilldown: false,
    understand: {
      whatTitle: 'A. 这是什么',
      what: ['面向纳入全国及地方碳市场的控排企业，提供以统一碳资产账本为中枢的一站式管理平台，让碳排放权从合规负担转化为可量化、可经营的企业资产。'],
      scenarioTitle: '应用/协作场景',
      scenarios: [
        {
          title: '碳资产全局管理',
          description: '在统一碳账本下管理多组织、多类型的碳资产持仓，实时呈现余额、冻结、可用与估值等指标。',
        },
        {
          title: '碳交易与决策支持',
          description: '联动市场实时价格跟踪资产估值，为挂单、成交与套保决策提供决策依据。',
        },
        {
          title: 'CCER项目挖掘与开发',
          description: '盘点集团内可开发为CCER的减排项目潜力，识别开发优先级，将自有减排能力转化为可交易的碳信用。',
        },
      ],
      problems: [
        {
          title: '多组织持仓散乱难统管',
          description: '集团下属多个工厂、产线分别持有配额与CCER，资产分散在不同账户与系统中，缺乏统一碳账本与组织穿透能力。',
        },
        {
          title: '交易决策凭经验',
          description: '缺乏持仓估值与市场报价的实时联动，何时买、何时卖、买多少、卖多少，只能依赖经验判断，容易错失交易窗口。',
        },
        {
          title: 'CCER开发潜力被埋没',
          description: '集团内可开发为CCER的减排项目分散在各业务单元，缺少自上而下的潜力盘点机制。',
        },
      ],
    },
    value: {
      summary: '把分散的配额与CCER变成一本可看、可算、可经营的碳资产账，让企业从被动履约走向主动经营。',
      gains: [
        {
          title: '碳资产可视化',
          description: '多组织、多类型碳资产持仓在同一账本中呈现，余额、冻结、可用、估值实时可见。',
        },
        {
          title: '缺口与成本透明',
          description: '年度履约缺口与预计履约成本动态测算，为资金安排与采购计划提供前置依据。',
        },
        {
          title: '数据驱动交易决策',
          description: '持仓估值、市场报价与缺口测算联动，交易决策从经验驱动转向数据驱动。',
        },
        {
          title: 'CCER潜力可盘点',
          description: '系统化识别集团内可开发的CCER项目，将自有减排能力转化为账本上的资产增量。',
        },
      ],
      values: [
        {
          title: '履约风险可控',
          description: '履约缺口提前可见、可测算、可对冲，避免临近清缴时段的被动高价买入。',
        },
        {
          title: '碳资产经营增值',
          description: '通过持仓结构优化与减排项目开发，把碳排放权从单纯的合规成本，转化为可量化、可经营的低碳资产。',
        },
        {
          title: '管理决策升级',
          description: '让碳资产管理从合规事项升级为企业级经营议题，进入财务与战略决策的视野。',
        },
      ],
    },
  },
  {
    id: 'carbon-accounting',
    name: '碳核算',
    shortName: '碳核算',
    description: '从产品、企业到供应链，构建不同层级，从活动数据归集、模型计算、报告输出到审核认证的一体化碳管理体系。',
    hasDrilldown: true,
    navLabels: {
      mechanism: '体验核算',
    },
    understand: {
      whatTitle: 'A. 这是什么',
      what: [
        '一个覆盖产品碳足迹与企业碳足迹两类场景的智能核算能力',
        '通过 AI 辅助数据理解、建模核算与结果分析，提升核算效率与结果可用性',
      ],
      scenarioTitle: 'C. 应用场景',
      scenarios: [
        '产品碳足迹核算',
        '企业碳足迹核算',
        '多源资料整理与核算准备',
        '核算结果对比分析与报告输出',
      ],
      problems: [
        '核算资料分散，整理成本高',
        '建模和核算门槛高，上手慢',
        '结果分析依赖人工，效率低',
        '不同核算对象下，过程难统一、结果难复用',
      ],
    },
    value: {
      gains: ['输出产品 / 企业碳足迹报告', '形成可分析、可对比的核算结果', '沉淀可复用的核算过程与证据材料'],
      values: ['降低核算门槛', '提升核算效率', '增强结果分析与复用能力'],
    },
  },
]

const abilitiesById = abilities.reduce<Record<string, Ability>>((accumulator, ability) => {
  accumulator[ability.id] = ability
  return accumulator
}, {})

export const overviewAbilities = overviewAbilityOrder
  .map((abilityId) => abilitiesById[abilityId])
  .filter((ability): ability is Ability => Boolean(ability))

const legacyAbilityIdMap: Record<string, string> = {
  'cbam-compliance': 'cbam',
  'energy-management': 'energy',
  'supply-chain-carbon': 'supply-chain',
  'esg-management': 'esg',
  'carbon-asset': 'carbon-assets',
}

export const normalizeAbilityId = (abilityId: string | undefined) => {
  if (!abilityId) {
    return undefined
  }

  return legacyAbilityIdMap[abilityId] ?? abilityId
}

export const getAbilityById = (abilityId: string | undefined) => {
  const normalizedAbilityId = normalizeAbilityId(abilityId)

  return abilities.find((ability) => ability.id === normalizedAbilityId)
}

export const normalizeAbilitySection = (section: string | undefined): AbilitySectionKey | undefined => {
  if (section === 'understanding') {
    return 'understand'
  }

  if (!section || !(section in abilitySectionNames)) {
    return undefined
  }

  return section as AbilitySectionKey
}

export const getAbilitySectionName = (section: string | undefined) => {
  const normalizedSection = normalizeAbilitySection(section)

  if (!normalizedSection) {
    return undefined
  }

  return abilitySectionNames[normalizedSection]
}

export const getAbilitySectionLabel = (ability: Ability, section: AbilitySectionKey) => {
  if (section === 'mechanism') {
    return ability.navLabels?.mechanism ?? abilitySectionNames.mechanism
  }

  return abilitySectionNames[section]
}
