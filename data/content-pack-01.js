window.ENGLISH_RADAR_CONTENT_PACK_01 = {
  "app": "English Radar Content Pack",
  "schemaVersion": 1,
  "pack": {
    "id": "english-radar-content-pack-01",
    "name": "Product Interface & Builder Workflow",
    "description": "24 audited UI and builder workflow Signals prepared from the English Radar content pipeline.",
    "version": "1.0.0",
    "source": "english-radar-signal-candidates",
    "preparedAt": "2026-08-07",
    "auditStatus": "complete",
    "auditCompletedAt": "2026-08-07",
    "sourcePolicy": "Official documentation or an authoritative primary reference for every Signal.",
    "editorialAudit": {
      "status": "complete",
      "completedAt": "2026-08-07",
      "signalCount": 24,
      "quizCount": 48,
      "sourceCoverage": "24/24 official or authoritative primary references",
      "notionAuditPages": [
        "Content Pack 01｜Source Audit 01",
        "Content Pack 01｜Source Audit 02",
        "Content Pack 01｜Source Audit 03"
      ]
    }
  },
  "signals": [
    {
      "id": "ui-dashboard",
      "term": "dashboard",
      "displayTerm": "DASHBOARD",
      "speechText": "dashboard",
      "pronunciation": "/ˈdæʃbɔːrd/",
      "category": "UI Vocabulary",
      "radarType": "interface",
      "platforms": [
        "analytics product",
        "admin console",
        "project management tool"
      ],
      "tone": [
        "Technical",
        "Neutral"
      ],
      "status": "Common",
      "formality": "Neutral",
      "meaningEn": "A central screen showing key data, status, and actions.",
      "meaningZh": "展示关键数据、状态和入口的总览页。",
      "exampleEn": "The dashboard shows your learning progress and recent activity.",
      "exampleZh": "总览页显示学习进度和近期活动。",
      "useWhen": "Use it for a central screen with several important metrics, statuses, alerts, or actions.",
      "useWhenZh": "用于需要集中展示状态、指标和快捷入口的页面。",
      "avoidWhen": "Avoid it for a page with only one simple function or one isolated piece of content. Treat the Dashboard–Overview distinction as a common naming tendency, not a universal rule.",
      "avoidWhenZh": "只有单一功能或单一内容时不必叫 Dashboard；也不要把 Dashboard 与 Overview 的区别理解成所有产品都必须遵守的固定规则。",
      "chineseFeeling": "像产品的“仪表盘”：把关键状态、指标和快捷操作集中到一个总览界面。",
      "contentStatus": "active",
      "quizStatus": "ready",
      "sourceType": "imported",
      "uiArea": [
        "general-product-ui"
      ],
      "originalMeaningEn": "A vehicle instrument panel that gathers speed, fuel, and other status information.",
      "originalMeaningZh": "车辆中的仪表板，用来集中显示速度、油量等状态。",
      "productMeaningEn": "A central screen showing key data, status, and actions.",
      "productMeaningZh": "展示关键数据、状态和入口的总览页。",
      "whyProductsUseItEn": "It lets users judge the current situation at a glance, like reading an instrument panel.",
      "whyProductsUseItZh": "让用户像看仪表盘一样快速判断当前情况。",
      "commonInterfaces": [
        "analytics product",
        "admin console",
        "project management tool"
      ],
      "realInterfaceExamples": [
        {
          "surface": "analytics product",
          "exampleEn": "The dashboard shows your learning progress and recent activity.",
          "exampleZh": "总览页显示学习进度和近期活动。"
        }
      ],
      "relatedTerms": [
        "ui-overview",
        "ui-activity"
      ],
      "confusedWith": [
        {
          "term": "Overview",
          "differenceEn": "Dashboard often emphasizes active metrics and controls, while Overview emphasizes a high-level summary. Product naming can vary.",
          "differenceZh": "Dashboard 常更强调动态指标和操作；Overview 常更强调高层摘要。不同产品的命名可能不同。"
        }
      ],
      "interfaceTargets": [
        {
          "page": "product-interface",
          "area": "general-product-ui",
          "label": "Dashboard"
        }
      ],
      "usageBoundaryEn": "Use it for a central screen with several important metrics, statuses, alerts, or actions. Avoid it for a page with only one simple function or one isolated piece of content. Treat the Dashboard–Overview distinction as a common naming tendency, not a universal rule.",
      "usageBoundaryZh": "用于需要集中展示状态、指标和快捷入口的页面。只有单一功能或单一内容时不必叫 Dashboard；也不要把 Dashboard 与 Overview 的区别理解成所有产品都必须遵守的固定规则。",
      "sourceName": "GitHub Personal Dashboard",
      "sourceUrl": "https://docs.github.com/en/account-and-profile/get-started/personal-dashboard-quickstart",
      "auditedAt": "2026-08-06",
      "editorialSourceType": "official-documentation"
    },
    {
      "id": "ui-workspace",
      "term": "workspace",
      "displayTerm": "WORKSPACE",
      "speechText": "workspace",
      "pronunciation": "/ˈwɜːrkˌspeɪs/",
      "category": "UI Vocabulary",
      "radarType": "interface",
      "platforms": [
        "collaboration app",
        "design tool",
        "knowledge management app"
      ],
      "tone": [
        "Technical",
        "Neutral"
      ],
      "status": "Common",
      "formality": "Neutral",
      "meaningEn": "A digital environment where people create, manage, and collaborate.",
      "meaningZh": "用于创建、管理和协作的数字工作空间。",
      "exampleEn": "Create a separate workspace for the research team.",
      "exampleZh": "为研究团队建立独立工作空间。",
      "useWhen": "Use it for a main digital environment containing multiple projects, pages, resources, or members.",
      "useWhenZh": "用于包含多项目、多页面或多人协作的主要环境。",
      "avoidWhen": "A single page, document, or task is usually too small to call a workspace, although product information architectures may use the label differently.",
      "avoidWhenZh": "单个页面、单个文档或单个任务通常不应泛称 Workspace；但不同产品也可能把较小范围的协作区命名为 Workspace，因此应结合实际信息架构判断。",
      "chineseFeeling": "不是一个页面，而是持续工作的数字空间，里面可以包含多个项目、页面和协作成员。",
      "contentStatus": "active",
      "quizStatus": "ready",
      "sourceType": "imported",
      "uiArea": [
        "general-product-ui"
      ],
      "originalMeaningEn": "A physical place where work is carried out.",
      "originalMeaningZh": "工作空间，进行工作的地方。",
      "productMeaningEn": "A digital environment where people create, manage, and collaborate.",
      "productMeaningZh": "用于创建、管理和协作的数字工作空间。",
      "whyProductsUseItEn": "The word suggests a persistent environment containing many pages, projects, tools, and collaborators rather than one screen.",
      "whyProductsUseItZh": "强调这里不是单个页面，而是一整套持续工作的环境。",
      "commonInterfaces": [
        "collaboration app",
        "design tool",
        "knowledge management app"
      ],
      "realInterfaceExamples": [
        {
          "surface": "collaboration app",
          "exampleEn": "Create a separate workspace for the research team.",
          "exampleZh": "为研究团队建立独立工作空间。"
        }
      ],
      "relatedTerms": [
        "ui-settings",
        "ui-onboarding"
      ],
      "confusedWith": [
        {
          "term": "Project",
          "differenceEn": "A Workspace often contains multiple projects, pages, or members; a Project is usually one bounded initiative. Product structures can vary.",
          "differenceZh": "Workspace 常包含多个项目、页面或成员；Project 通常是一个有边界的具体事项。不同产品结构可能不同。"
        }
      ],
      "interfaceTargets": [
        {
          "page": "product-interface",
          "area": "general-product-ui",
          "label": "Workspace"
        }
      ],
      "usageBoundaryEn": "Use it for a main digital environment containing multiple projects, pages, resources, or members. A single page, document, or task is usually too small to call a workspace, although product information architectures may use the label differently.",
      "usageBoundaryZh": "用于包含多项目、多页面或多人协作的主要环境。单个页面、单个文档或单个任务通常不应泛称 Workspace；但不同产品也可能把较小范围的协作区命名为 Workspace，因此应结合实际信息架构判断。",
      "sourceName": "Notion Workspaces",
      "sourceUrl": "https://www.notion.com/help/create-delete-and-switch-workspaces",
      "auditedAt": "2026-08-07",
      "editorialSourceType": "official-documentation"
    },
    {
      "id": "ui-overview",
      "term": "overview",
      "displayTerm": "OVERVIEW",
      "speechText": "overview",
      "pronunciation": "/ˈoʊvərˌvjuː/",
      "category": "UI Vocabulary",
      "radarType": "interface",
      "platforms": [
        "project page",
        "repository",
        "cloud console"
      ],
      "tone": [
        "Technical",
        "Neutral"
      ],
      "status": "Common",
      "formality": "Neutral",
      "meaningEn": "A high-level summary of the most important information.",
      "meaningZh": "关键内容的整体概览。",
      "exampleEn": "Start with the overview before opening the detailed report.",
      "exampleZh": "先查看概览，再打开详细报告。",
      "useWhen": "Use it for a concise high-level summary that leads into detailed sections.",
      "useWhenZh": "用于先提供全局信息，再引导进入细节。",
      "avoidWhen": "If the page centers on live metrics, alerts, and operational controls, Dashboard may be more precise. Product naming is not fully standardized.",
      "avoidWhenZh": "页面主要用于实时指标、告警和操作控制时，Dashboard 可能更准确；但不同产品对 Overview 与 Dashboard 的命名并不完全统一。",
      "chineseFeeling": "先看整体轮廓和关键摘要，再进入详细页面；强调全局理解，不一定强调实时控制。",
      "contentStatus": "active",
      "quizStatus": "ready",
      "sourceType": "imported",
      "uiArea": [
        "general-product-ui"
      ],
      "originalMeaningEn": "A view of something as a whole.",
      "originalMeaningZh": "从整体上查看，形成概览。",
      "productMeaningEn": "A high-level summary of the most important information.",
      "productMeaningZh": "关键内容的整体概览。",
      "whyProductsUseItEn": "It tells users to understand the whole picture before opening details.",
      "whyProductsUseItZh": "告诉用户先看全局，再进入细节。",
      "commonInterfaces": [
        "project page",
        "repository",
        "cloud console"
      ],
      "realInterfaceExamples": [
        {
          "surface": "project page",
          "exampleEn": "Start with the overview before opening the detailed report.",
          "exampleZh": "先查看概览，再打开详细报告。"
        }
      ],
      "relatedTerms": [
        "ui-dashboard",
        "ui-activity"
      ],
      "confusedWith": [
        {
          "term": "Dashboard",
          "differenceEn": "Overview often summarizes the whole, while Dashboard more often combines live metrics and controls. This is not a universal rule.",
          "differenceZh": "Overview 常偏整体摘要；Dashboard 更常结合实时指标和操作入口。这不是普遍硬规则。"
        }
      ],
      "interfaceTargets": [
        {
          "page": "product-interface",
          "area": "general-product-ui",
          "label": "Overview"
        }
      ],
      "usageBoundaryEn": "Use it for a concise high-level summary that leads into detailed sections. If the page centers on live metrics, alerts, and operational controls, Dashboard may be more precise. Product naming is not fully standardized.",
      "usageBoundaryZh": "用于先提供全局信息，再引导进入细节。页面主要用于实时指标、告警和操作控制时，Dashboard 可能更准确；但不同产品对 Overview 与 Dashboard 的命名并不完全统一。",
      "sourceName": "Vercel Deployments Overview",
      "sourceUrl": "https://vercel.com/docs/deployments/overview",
      "auditedAt": "2026-08-06",
      "editorialSourceType": "official-documentation"
    },
    {
      "id": "ui-settings",
      "term": "settings",
      "displayTerm": "SETTINGS",
      "speechText": "settings",
      "pronunciation": "/ˈsetɪŋz/",
      "category": "UI Vocabulary",
      "radarType": "interface",
      "platforms": [
        "mobile app",
        "web app",
        "account console"
      ],
      "tone": [
        "Technical",
        "Neutral"
      ],
      "status": "Common",
      "formality": "Neutral",
      "meaningEn": "A section for controlling how an app or account works.",
      "meaningZh": "控制应用或账户行为的设置区域。",
      "exampleEn": "Open Settings to change the account permissions.",
      "exampleZh": "打开 Settings 修改账户权限。",
      "useWhen": "Use it for a broad area controlling application, account, privacy, security, or feature behavior.",
      "useWhenZh": "用于范围较广的应用或账户控制选项。",
      "avoidWhen": "Preferences may sound more natural for purely personal choices, but products often use Settings and Preferences interchangeably.",
      "avoidWhenZh": "只涉及个人偏好时，Preferences 可能更自然；但不同平台和产品会交替使用 Settings 与 Preferences，二者不存在跨产品统一的硬边界。",
      "chineseFeeling": "应用或账户的总控制区，范围比个人偏好更广，可包含隐私、安全、权限和功能行为。",
      "contentStatus": "active",
      "quizStatus": "ready",
      "sourceType": "imported",
      "uiArea": [
        "general-product-ui"
      ],
      "originalMeaningEn": "Parameters or adjusted states that determine how something operates.",
      "originalMeaningZh": "设置、调节后的状态或参数。",
      "productMeaningEn": "A section for controlling how an app or account works.",
      "productMeaningZh": "控制应用或账户行为的设置区域。",
      "whyProductsUseItEn": "The label signals broad control over application, account, privacy, security, and feature behavior.",
      "whyProductsUseItZh": "表示这里控制产品如何运行。",
      "commonInterfaces": [
        "mobile app",
        "web app",
        "account console"
      ],
      "realInterfaceExamples": [
        {
          "surface": "mobile app",
          "exampleEn": "Open Settings to change the account permissions.",
          "exampleZh": "打开 Settings 修改账户权限。"
        }
      ],
      "relatedTerms": [
        "ui-preferences",
        "ui-toggle"
      ],
      "confusedWith": [
        {
          "term": "Preferences",
          "differenceEn": "Settings is often broader and may include security or permissions; Preferences often emphasizes personal choices. Products may use either label.",
          "differenceZh": "Settings 通常范围更广，可包含安全和权限；Preferences 常强调个人选择。产品也可能交替使用两者。"
        }
      ],
      "interfaceTargets": [
        {
          "page": "product-interface",
          "area": "general-product-ui",
          "label": "Settings"
        }
      ],
      "usageBoundaryEn": "Use it for a broad area controlling application, account, privacy, security, or feature behavior. Preferences may sound more natural for purely personal choices, but products often use Settings and Preferences interchangeably.",
      "usageBoundaryZh": "用于范围较广的应用或账户控制选项。只涉及个人偏好时，Preferences 可能更自然；但不同平台和产品会交替使用 Settings 与 Preferences，二者不存在跨产品统一的硬边界。",
      "sourceName": "Apple Human Interface Guidelines — Settings",
      "sourceUrl": "https://developer.apple.com/design/human-interface-guidelines/settings",
      "auditedAt": "2026-08-06",
      "editorialSourceType": "official-documentation"
    },
    {
      "id": "ui-preferences",
      "term": "preferences",
      "displayTerm": "PREFERENCES",
      "speechText": "preferences",
      "pronunciation": "/ˈprefərənsɪz/",
      "category": "UI Vocabulary",
      "radarType": "interface",
      "platforms": [
        "desktop app",
        "learning app",
        "creative tool"
      ],
      "tone": [
        "Technical",
        "Neutral"
      ],
      "status": "Common",
      "formality": "Neutral",
      "meaningEn": "Personal choices that customize the user experience.",
      "meaningZh": "用于个性化体验的偏好设置。",
      "exampleEn": "Your preferences control speech rate and session length.",
      "exampleZh": "偏好设置控制语速和学习长度。",
      "useWhen": "Use it for theme, language, display, notification style, and other personal experience choices.",
      "useWhenZh": "用于主题、语言、显示和其他个性化选择。",
      "avoidWhen": "Security, permissions, and system-level configuration more often belong under Settings or Configuration. The distinction is a naming tendency, not a universal rule.",
      "avoidWhenZh": "安全、权限或系统级配置通常更适合放在 Settings 或 Configuration；同时不要把 Preferences 与 Settings 的区别当作所有产品都遵守的固定规则。",
      "chineseFeeling": "偏向“我更喜欢怎样使用产品”，强调主题、语言、语速等个人体验选择，不是系统级控制。",
      "contentStatus": "active",
      "quizStatus": "ready",
      "sourceType": "imported",
      "uiArea": [
        "general-product-ui"
      ],
      "originalMeaningEn": "Choices reflecting what a person likes or favors.",
      "originalMeaningZh": "偏好，更喜欢的选择。",
      "productMeaningEn": "Personal choices that customize the user experience.",
      "productMeaningZh": "用于个性化体验的偏好设置。",
      "whyProductsUseItEn": "It sounds softer than settings and frames options as user choices rather than system control.",
      "whyProductsUseItZh": "比 Settings 更柔和，强调个人选择。",
      "commonInterfaces": [
        "desktop app",
        "learning app",
        "creative tool"
      ],
      "realInterfaceExamples": [
        {
          "surface": "desktop app",
          "exampleEn": "Your preferences control speech rate and session length.",
          "exampleZh": "偏好设置控制语速和学习长度。"
        }
      ],
      "relatedTerms": [
        "ui-settings",
        "ui-toggle"
      ],
      "confusedWith": [
        {
          "term": "Settings",
          "differenceEn": "Preferences often focuses on personal experience choices, while Settings can control the wider app or account. The boundary is not fixed.",
          "differenceZh": "Preferences 常聚焦个人体验；Settings 可控制更广泛的应用和账户行为。二者边界并不固定。"
        }
      ],
      "interfaceTargets": [
        {
          "page": "product-interface",
          "area": "general-product-ui",
          "label": "Preferences"
        }
      ],
      "usageBoundaryEn": "Use it for theme, language, display, notification style, and other personal experience choices. Security, permissions, and system-level configuration more often belong under Settings or Configuration. The distinction is a naming tendency, not a universal rule.",
      "usageBoundaryZh": "用于主题、语言、显示和其他个性化选择。安全、权限或系统级配置通常更适合放在 Settings 或 Configuration；同时不要把 Preferences 与 Settings 的区别当作所有产品都遵守的固定规则。",
      "sourceName": "Apple Support — Third-party App Settings",
      "sourceUrl": "https://support.apple.com/guide/personal-safety/third-party-app-settings-ips37f0fef41/web",
      "auditedAt": "2026-08-06",
      "editorialSourceType": "official-documentation"
    },
    {
      "id": "ui-backup",
      "term": "backup",
      "displayTerm": "BACKUP",
      "speechText": "backup",
      "pronunciation": "/ˈbækˌʌp/",
      "category": "UI Vocabulary",
      "radarType": "interface",
      "platforms": [
        "operating system",
        "cloud service",
        "local-first app"
      ],
      "tone": [
        "Technical",
        "Neutral"
      ],
      "status": "Common",
      "formality": "Neutral",
      "meaningEn": "A saved copy of data used for recovery.",
      "meaningZh": "用于恢复的数据副本。",
      "exampleEn": "Create a backup before replacing your local library.",
      "exampleZh": "替换本地词库前先创建备份。",
      "useWhen": "Use it for a saved copy intentionally created to recover from data loss or damage.",
      "useWhenZh": "用于防止数据丢失并支持恢复。",
      "avoidWhen": "A normal export is not automatically a complete backup; use Backup when the copy contains what is needed for later recovery.",
      "avoidWhenZh": "普通文件导出不一定构成完整 Backup；只有当副本包含后续恢复所需的数据、结构或设置时，才适合强调 backup。",
      "chineseFeeling": "为防止主数据丢失而保留的一份可恢复副本；重点不是“导出去”，而是以后能找回。",
      "contentStatus": "active",
      "quizStatus": "ready",
      "sourceType": "imported",
      "uiArea": [
        "general-product-ui"
      ],
      "originalMeaningEn": "Reserve support or a substitute kept available if the main option fails.",
      "originalMeaningZh": "后援、备用支持。",
      "productMeaningEn": "A saved copy of data used for recovery.",
      "productMeaningZh": "用于恢复的数据副本。",
      "whyProductsUseItEn": "The word implies a second copy that can recover information if the main data is lost.",
      "whyProductsUseItZh": "表示主数据发生问题时，还有一份备用版本。",
      "commonInterfaces": [
        "operating system",
        "cloud service",
        "local-first app"
      ],
      "realInterfaceExamples": [
        {
          "surface": "operating system",
          "exampleEn": "Create a backup before replacing your local library.",
          "exampleZh": "替换本地词库前先创建备份。"
        }
      ],
      "relatedTerms": [
        "ui-restore",
        "ui-settings"
      ],
      "confusedWith": [
        {
          "term": "Export",
          "differenceEn": "A Backup is designed for later recovery; an Export mainly outputs selected data in a transferable format. One file can sometimes serve both purposes.",
          "differenceZh": "Backup 为后续恢复而设计；Export 主要输出可转移的数据。某些文件也可能同时承担两种作用。"
        }
      ],
      "interfaceTargets": [
        {
          "page": "product-interface",
          "area": "general-product-ui",
          "label": "Backup"
        }
      ],
      "usageBoundaryEn": "Use it for a saved copy intentionally created to recover from data loss or damage. A normal export is not automatically a complete backup; use Backup when the copy contains what is needed for later recovery.",
      "usageBoundaryZh": "用于防止数据丢失并支持恢复。普通文件导出不一定构成完整 Backup；只有当副本包含后续恢复所需的数据、结构或设置时，才适合强调 backup。",
      "sourceName": "Apple Support — How to Back Up",
      "sourceUrl": "https://support.apple.com/118426",
      "auditedAt": "2026-08-07",
      "editorialSourceType": "official-documentation"
    },
    {
      "id": "ui-restore",
      "term": "restore",
      "displayTerm": "RESTORE",
      "speechText": "restore",
      "pronunciation": "/rɪˈstɔːr/",
      "category": "UI Vocabulary",
      "radarType": "interface",
      "platforms": [
        "backup tool",
        "operating system",
        "application settings"
      ],
      "tone": [
        "Technical",
        "Neutral"
      ],
      "status": "Common",
      "formality": "Neutral",
      "meaningEn": "To bring data or settings back from a saved state.",
      "meaningZh": "从保存状态恢复数据或设置。",
      "exampleEn": "Restore the backup after reinstalling the app.",
      "exampleZh": "重新安装应用后恢复备份。",
      "useWhen": "Use it when data, settings, or a version is recovered from a backup or saved state.",
      "useWhenZh": "用于从备份或历史状态找回数据。",
      "avoidWhen": "Use Reset for returning to defaults and Rollback for reversing a deployed version.",
      "avoidWhenZh": "回到初始默认状态应使用 Reset，而不是 Restore；撤回线上部署则更适合 Rollback。",
      "chineseFeeling": "把之前保存过的数据或状态重新带回来；不是恢复默认值，也不是只撤销最近一步。",
      "contentStatus": "active",
      "quizStatus": "ready",
      "sourceType": "imported",
      "uiArea": [
        "general-product-ui"
      ],
      "originalMeaningEn": "To return something to an earlier or proper condition.",
      "originalMeaningZh": "恢复到原来的状态。",
      "productMeaningEn": "To bring data or settings back from a saved state.",
      "productMeaningZh": "从保存状态恢复数据或设置。",
      "whyProductsUseItEn": "The action brings back a state that existed before rather than creating a new one.",
      "whyProductsUseItZh": "强调找回之前存在的状态，而不是创建全新内容。",
      "commonInterfaces": [
        "backup tool",
        "operating system",
        "application settings"
      ],
      "realInterfaceExamples": [
        {
          "surface": "backup tool",
          "exampleEn": "Restore the backup after reinstalling the app.",
          "exampleZh": "重新安装应用后恢复备份。"
        }
      ],
      "relatedTerms": [
        "ui-backup",
        "ui-settings"
      ],
      "confusedWith": [
        {
          "term": "Reset",
          "differenceEn": "Restore brings back a saved state; Reset usually returns something to defaults.",
          "differenceZh": "Restore 找回保存状态；Reset 通常回到默认状态。"
        },
        {
          "term": "Rollback",
          "differenceEn": "Restore commonly recovers data or settings from a saved copy; Rollback reverses a deployed version or environment state.",
          "differenceZh": "Restore 常从保存副本恢复数据或设置；Rollback 撤回已部署的版本或环境状态。"
        }
      ],
      "interfaceTargets": [
        {
          "page": "product-interface",
          "area": "general-product-ui",
          "label": "Restore"
        }
      ],
      "usageBoundaryEn": "Use it when data, settings, or a version is recovered from a backup or saved state. Use Reset for returning to defaults and Rollback for reversing a deployed version.",
      "usageBoundaryZh": "用于从备份或历史状态找回数据。回到初始默认状态应使用 Reset，而不是 Restore；撤回线上部署则更适合 Rollback。",
      "sourceName": "Apple Support — Restore from Backup",
      "sourceUrl": "https://support.apple.com/118105",
      "auditedAt": "2026-08-07",
      "editorialSourceType": "official-documentation"
    },
    {
      "id": "ui-feed",
      "term": "feed",
      "displayTerm": "FEED",
      "speechText": "feed",
      "pronunciation": "/fiːd/",
      "category": "UI Vocabulary",
      "radarType": "interface",
      "platforms": [
        "social platform",
        "news app",
        "community product"
      ],
      "tone": [
        "Technical",
        "Neutral"
      ],
      "status": "Common",
      "formality": "Neutral",
      "meaningEn": "A continuously updated stream of content or items presented to a user.",
      "meaningZh": "持续更新并按顺序呈现给用户的信息流或内容流。",
      "exampleEn": "Your feed shows new posts and recommendations from the communities you follow.",
      "exampleZh": "你的信息流会显示所关注社区的新帖子和推荐内容。",
      "useWhen": "Use it for a scrollable stream that keeps receiving posts, updates, news, or recommendations.",
      "useWhenZh": "用于持续刷新、可滚动浏览、由多条内容组成的信息流。",
      "avoidWhen": "A fixed content library is not a feed. Items waiting for review or action are often labeled Inbox, although products may overlap the two.",
      "avoidWhenZh": "固定内容库不应叫 Feed；等待用户处理的内容通常更适合叫 Inbox，但不同产品的 Feed 与 Inbox 仍可能部分重叠。",
      "chineseFeeling": "信息流、动态流；重点是内容持续到来，而不是已经整理好的固定收藏。",
      "contentStatus": "active",
      "quizStatus": "ready",
      "sourceType": "imported",
      "uiArea": [
        "general-product-ui"
      ],
      "originalMeaningEn": "To supply food or continuously provide something.",
      "originalMeaningZh": "原本表示给人或动物提供食物，也可表示持续输入或供应某种内容。",
      "productMeaningEn": "A continuously updated stream of content or items presented to a user.",
      "productMeaningZh": "持续更新并按顺序呈现给用户的信息流或内容流。",
      "whyProductsUseItEn": "Content is continuously supplied to the user, so the interface behaves like an incoming stream.",
      "whyProductsUseItZh": "内容像被持续“输送”进系统一样到达用户面前。",
      "commonInterfaces": [
        "social platform",
        "news app",
        "community product"
      ],
      "realInterfaceExamples": [
        {
          "surface": "social platform",
          "exampleEn": "Your feed shows new posts and recommendations from the communities you follow.",
          "exampleZh": "你的信息流会显示所关注社区的新帖子和推荐内容。"
        }
      ],
      "relatedTerms": [
        "ui-activity",
        "ui-filter"
      ],
      "confusedWith": [
        {
          "term": "Inbox",
          "differenceEn": "A Feed often supports continuous browsing, while an Inbox often supports reviewing or triaging incoming items. Products may overlap the two.",
          "differenceZh": "Feed 常用于连续浏览；Inbox 常用于查看或处理进入的条目。不同产品可能存在重叠。"
        }
      ],
      "interfaceTargets": [
        {
          "page": "product-interface",
          "area": "general-product-ui",
          "label": "Feed"
        }
      ],
      "usageBoundaryEn": "Use it for a scrollable stream that keeps receiving posts, updates, news, or recommendations. A fixed content library is not a feed. Items waiting for review or action are often labeled Inbox, although products may overlap the two.",
      "usageBoundaryZh": "用于持续刷新、可滚动浏览、由多条内容组成的信息流。固定内容库不应叫 Feed；等待用户处理的内容通常更适合叫 Inbox，但不同产品的 Feed 与 Inbox 仍可能部分重叠。",
      "sourceName": "GitHub Organization News Feed",
      "sourceUrl": "https://docs.github.com/en/organizations/collaborating-with-groups-in-organizations/about-your-organizations-news-feed",
      "auditedAt": "2026-08-07",
      "editorialSourceType": "official-documentation"
    },
    {
      "id": "ui-activity",
      "term": "activity",
      "displayTerm": "ACTIVITY",
      "speechText": "activity",
      "pronunciation": "/ækˈtɪvəti/",
      "category": "UI Vocabulary",
      "radarType": "interface",
      "platforms": [
        "collaboration app",
        "repository",
        "account security page"
      ],
      "tone": [
        "Technical",
        "Neutral"
      ],
      "status": "Common",
      "formality": "Neutral",
      "meaningEn": "A record or view of actions and events that happened in a product.",
      "meaningZh": "记录用户、团队或系统近期操作与事件的动态区域。",
      "exampleEn": "The activity panel shows who edited the document and when.",
      "exampleZh": "动态面板显示谁在什么时候编辑了文档。",
      "useWhen": "Use it for a chronological view of edits, comments, logins, releases, or other actions.",
      "useWhenZh": "用于展示用户、团队或系统已经执行的动作和事件。",
      "avoidWhen": "Immediate attention items are often better labeled Notification or Inbox, while formal compliance records are better labeled Audit Log. Product naming can vary.",
      "avoidWhenZh": "需要用户立即处理的提醒通常更适合叫 Notification 或 Inbox；严格合规记录更适合叫 Audit Log。不要把这种区分写成所有产品都遵守的绝对规则。",
      "chineseFeeling": "近期动态、操作记录；重点是“发生了什么”。",
      "contentStatus": "active",
      "quizStatus": "ready",
      "sourceType": "imported",
      "uiArea": [
        "general-product-ui"
      ],
      "originalMeaningEn": "Actions, events, or the state of being active.",
      "originalMeaningZh": "活动、行动或处于活跃状态。",
      "productMeaningEn": "A record or view of actions and events that happened in a product.",
      "productMeaningZh": "记录用户、团队或系统近期操作与事件的动态区域。",
      "whyProductsUseItEn": "The label groups things that happened, focusing on actions and events rather than only alerts.",
      "whyProductsUseItZh": "产品用 Activity 概括“发生过的动作”，比单纯的消息提醒更关注行为记录。",
      "commonInterfaces": [
        "collaboration app",
        "repository",
        "account security page"
      ],
      "realInterfaceExamples": [
        {
          "surface": "collaboration app",
          "exampleEn": "The activity panel shows who edited the document and when.",
          "exampleZh": "动态面板显示谁在什么时候编辑了文档。"
        }
      ],
      "relatedTerms": [
        "ui-feed",
        "ui-dashboard"
      ],
      "confusedWith": [
        {
          "term": "Notification",
          "differenceEn": "Activity often summarizes events or actions; a Notification is often an individual update that attracts attention. Product naming varies.",
          "differenceZh": "Activity 常汇总事件或动作；Notification 常是吸引注意的单项提醒。产品命名可能不同。"
        }
      ],
      "interfaceTargets": [
        {
          "page": "product-interface",
          "area": "general-product-ui",
          "label": "Activity"
        }
      ],
      "usageBoundaryEn": "Use it for a chronological view of edits, comments, logins, releases, or other actions. Immediate attention items are often better labeled Notification or Inbox, while formal compliance records are better labeled Audit Log. Product naming can vary.",
      "usageBoundaryZh": "用于展示用户、团队或系统已经执行的动作和事件。需要用户立即处理的提醒通常更适合叫 Notification 或 Inbox；严格合规记录更适合叫 Audit Log。不要把这种区分写成所有产品都遵守的绝对规则。",
      "sourceName": "GitHub Organization News Feed",
      "sourceUrl": "https://docs.github.com/en/organizations/collaborating-with-groups-in-organizations/about-your-organizations-news-feed",
      "auditedAt": "2026-08-07",
      "editorialSourceType": "official-documentation"
    },
    {
      "id": "ui-onboarding",
      "term": "onboarding",
      "displayTerm": "ONBOARDING",
      "speechText": "onboarding",
      "pronunciation": "/ˈɑːnˌbɔːrdɪŋ/",
      "category": "UI Vocabulary",
      "radarType": "interface",
      "platforms": [
        "SaaS app",
        "team tool",
        "learning app"
      ],
      "tone": [
        "Technical",
        "Neutral"
      ],
      "status": "Common",
      "formality": "Neutral",
      "meaningEn": "A first-use experience or set of guidance that helps a new user understand, set up, and begin using a product.",
      "meaningZh": "帮助新用户理解产品、完成必要设置并开始使用的首次体验或一组引导。",
      "exampleEn": "The onboarding flow helps new users create their first workspace.",
      "exampleZh": "新手引导流程帮助新用户创建第一个工作空间。",
      "useWhen": "Use it for the connected first-use process of setup, explanation, and reaching an initial success.",
      "useWhenZh": "用于新用户首次进入产品时的连续引导和初始设置。",
      "avoidWhen": "Do not call every help article, long-term training resource, or isolated hint onboarding. It should serve a new user's entry into the product and first value.",
      "avoidWhenZh": "普通帮助中心、长期培训或任意单独提示不应自动称为 Onboarding；只有当它服务于新用户进入产品和开始获得价值时才适合这样命名。",
      "chineseFeeling": "新手上手流程；不只是教功能，还包括让用户顺利进入产品。",
      "contentStatus": "active",
      "quizStatus": "ready",
      "sourceType": "imported",
      "uiArea": [
        "general-product-ui"
      ],
      "originalMeaningEn": "Bringing a new person on board and helping them join a group.",
      "originalMeaningZh": "把新成员带上船、带入组织或帮助其加入。",
      "productMeaningEn": "A first-use experience or set of guidance that helps a new user understand, set up, and begin using a product.",
      "productMeaningZh": "帮助新用户理解产品、完成必要设置并开始使用的首次体验或一组引导。",
      "whyProductsUseItEn": "The product treats entry as a guided transition into a new environment, not just a single lesson.",
      "whyProductsUseItZh": "像把新成员“带上船”一样，让用户顺利进入产品环境并知道下一步怎么做。",
      "commonInterfaces": [
        "SaaS app",
        "team tool",
        "learning app"
      ],
      "realInterfaceExamples": [
        {
          "surface": "SaaS app",
          "exampleEn": "The onboarding flow helps new users create their first workspace.",
          "exampleZh": "新手引导流程帮助新用户创建第一个工作空间。"
        }
      ],
      "relatedTerms": [
        "ui-workspace",
        "ui-empty-state"
      ],
      "confusedWith": [
        {
          "term": "Tutorial",
          "differenceEn": "A Tutorial teaches a specific task; Onboarding serves the broader first-use transition and first value. They can overlap.",
          "differenceZh": "Tutorial 教具体操作；Onboarding 服务于更广的首次使用和首次价值体验。两者可以重叠。"
        }
      ],
      "interfaceTargets": [
        {
          "page": "product-interface",
          "area": "general-product-ui",
          "label": "Onboarding"
        }
      ],
      "usageBoundaryEn": "Use it for the connected first-use process of setup, explanation, and reaching an initial success. Do not call every help article, long-term training resource, or isolated hint onboarding. It should serve a new user's entry into the product and first value.",
      "usageBoundaryZh": "用于新用户首次进入产品时的连续引导和初始设置。普通帮助中心、长期培训或任意单独提示不应自动称为 Onboarding；只有当它服务于新用户进入产品和开始获得价值时才适合这样命名。",
      "sourceName": "Apple Human Interface Guidelines — Onboarding",
      "sourceUrl": "https://developer.apple.com/design/human-interface-guidelines/onboarding",
      "auditedAt": "2026-08-07",
      "editorialSourceType": "official-documentation"
    },
    {
      "id": "ui-empty-state",
      "term": "empty state",
      "displayTerm": "EMPTY STATE",
      "speechText": "empty state",
      "pronunciation": "/ˈempti steɪt/",
      "category": "UI Vocabulary",
      "radarType": "interface",
      "platforms": [
        "project list",
        "inbox",
        "search results"
      ],
      "tone": [
        "Technical",
        "Neutral"
      ],
      "status": "Common",
      "formality": "Neutral",
      "meaningEn": "A designed interface shown when a valid section currently contains no data or items.",
      "meaningZh": "当某个有效页面或区域暂时没有数据、记录或内容时显示的界面状态。",
      "exampleEn": "The empty state invites the user to add their first Signal.",
      "exampleZh": "空状态会引导用户添加第一条 Signal。",
      "useWhen": "Use it when a page works correctly but has no data, no results, or no user-created items yet.",
      "useWhenZh": "用于页面正常工作但尚无内容、搜索无结果或用户尚未创建数据的情况。",
      "avoidWhen": "Use an Error State for loading failures, permission problems, or server errors. A blank screen by itself is not a designed Empty State.",
      "avoidWhenZh": "加载失败、无权限或服务器错误应使用相应 Error State，而不是 Empty State；纯粹的空白页面也不等于经过设计的 Empty State。",
      "chineseFeeling": "空状态；不是一片空白，而是有解释和下一步的“暂无内容”界面。",
      "contentStatus": "active",
      "quizStatus": "ready",
      "sourceType": "imported",
      "uiArea": [
        "general-product-ui"
      ],
      "originalMeaningEn": "A condition in which no content or items are present.",
      "originalMeaningZh": "处于没有内容或项目的状态。",
      "productMeaningEn": "A designed interface shown when a valid section currently contains no data or items.",
      "productMeaningZh": "当某个有效页面或区域暂时没有数据、记录或内容时显示的界面状态。",
      "whyProductsUseItEn": "It names a valid interface state rather than treating the absence of content as an error.",
      "whyProductsUseItZh": "它描述的是界面当前“没有内容”的状态，而不是系统出错。",
      "commonInterfaces": [
        "project list",
        "inbox",
        "search results"
      ],
      "realInterfaceExamples": [
        {
          "surface": "project list",
          "exampleEn": "The empty state invites the user to add their first Signal.",
          "exampleZh": "空状态会引导用户添加第一条 Signal。"
        }
      ],
      "relatedTerms": [
        "ui-onboarding",
        "ui-placeholder"
      ],
      "confusedWith": [
        {
          "term": "Error State",
          "differenceEn": "An Empty State is a valid interface with no content; an Error State means expected content failed to load or cannot be accessed.",
          "differenceZh": "Empty State 是正常但无内容；Error State 表示应有内容加载失败或无法访问。"
        }
      ],
      "interfaceTargets": [
        {
          "page": "product-interface",
          "area": "general-product-ui",
          "label": "Empty State"
        }
      ],
      "usageBoundaryEn": "Use it when a page works correctly but has no data, no results, or no user-created items yet. Use an Error State for loading failures, permission problems, or server errors. A blank screen by itself is not a designed Empty State.",
      "usageBoundaryZh": "用于页面正常工作但尚无内容、搜索无结果或用户尚未创建数据的情况。加载失败、无权限或服务器错误应使用相应 Error State，而不是 Empty State；纯粹的空白页面也不等于经过设计的 Empty State。",
      "sourceName": "Atlassian Design System — Empty State",
      "sourceUrl": "https://atlassian.design/components/empty-state/",
      "auditedAt": "2026-08-07",
      "editorialSourceType": "official-documentation"
    },
    {
      "id": "ui-placeholder",
      "term": "placeholder",
      "displayTerm": "PLACEHOLDER",
      "speechText": "placeholder",
      "pronunciation": "/ˈpleɪsˌhoʊldər/",
      "category": "UI Vocabulary",
      "radarType": "interface",
      "platforms": [
        "form",
        "template",
        "loading interface"
      ],
      "tone": [
        "Technical",
        "Neutral"
      ],
      "status": "Common",
      "formality": "Neutral",
      "meaningEn": "Temporary text or content that occupies a place until the user enters or the system supplies the real value.",
      "meaningZh": "在真实输入或内容出现前暂时占据位置的提示文字或替代内容。",
      "exampleEn": "Use the placeholder to show the expected format, not as the only field label.",
      "exampleZh": "可以用占位提示展示预期格式，但不要把它当作唯一字段标签。",
      "useWhen": "Use it for temporary input hints, template fields, or content waiting to be replaced.",
      "useWhenZh": "用于暂时提示将要输入或显示什么，并且内容随后会被替换。",
      "avoidWhen": "Do not use placeholder text as a permanent label, critical instruction, or saved default value. Loading placeholders are more precisely described as skeletons.",
      "avoidWhenZh": "不能用 Placeholder 代替永久 Label、关键说明或已保存的 Default Value；加载骨架更准确地称为 Skeleton，而不是把所有临时界面都笼统叫 Placeholder。",
      "chineseFeeling": "占位提示；看得见但不是最终内容，也通常不会作为真实数据提交。",
      "contentStatus": "active",
      "quizStatus": "ready",
      "sourceType": "imported",
      "uiArea": [
        "general-product-ui"
      ],
      "originalMeaningEn": "Something temporarily holding a position until real content replaces it.",
      "originalMeaningZh": "暂时占住某个位置、等待真实内容替换的东西。",
      "productMeaningEn": "Temporary text or content that occupies a place until the user enters or the system supplies the real value.",
      "productMeaningZh": "在真实输入或内容出现前暂时占据位置的提示文字或替代内容。",
      "whyProductsUseItEn": "It reserves a place and indicates what is expected before final content exists.",
      "whyProductsUseItZh": "它的作用是“先占住这个位置”，随后会被用户输入或真实内容替换。",
      "commonInterfaces": [
        "form",
        "template",
        "loading interface"
      ],
      "realInterfaceExamples": [
        {
          "surface": "form",
          "exampleEn": "Use the placeholder to show the expected format, not as the only field label.",
          "exampleZh": "可以用占位提示展示预期格式，但不要把它当作唯一字段标签。"
        }
      ],
      "relatedTerms": [
        "ui-empty-state",
        "ui-settings"
      ],
      "confusedWith": [
        {
          "term": "Default Value",
          "differenceEn": "A Default Value is real prefilled content; a Placeholder is temporary guidance and is not submitted as the user's value.",
          "differenceZh": "Default Value 是真实预填内容；Placeholder 是临时提示，不会自动作为用户值提交。"
        },
        {
          "term": "Label",
          "differenceEn": "A Label permanently identifies a field; a Placeholder disappears when the user enters a value.",
          "differenceZh": "Label 持续说明字段是什么；Placeholder 会在用户输入后消失。"
        },
        {
          "term": "Skeleton",
          "differenceEn": "A Skeleton represents loading structure; Placeholder text usually hints at expected input.",
          "differenceZh": "Skeleton 表示加载中的内容结构；Placeholder 文字通常提示预期输入。"
        }
      ],
      "interfaceTargets": [
        {
          "page": "product-interface",
          "area": "general-product-ui",
          "label": "Placeholder"
        }
      ],
      "usageBoundaryEn": "Use it for temporary input hints, template fields, or content waiting to be replaced. Do not use placeholder text as a permanent label, critical instruction, or saved default value. Loading placeholders are more precisely described as skeletons.",
      "usageBoundaryZh": "用于暂时提示将要输入或显示什么，并且内容随后会被替换。不能用 Placeholder 代替永久 Label、关键说明或已保存的 Default Value；加载骨架更准确地称为 Skeleton，而不是把所有临时界面都笼统叫 Placeholder。",
      "sourceName": "MDN — placeholder Attribute",
      "sourceUrl": "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/placeholder",
      "auditedAt": "2026-08-07",
      "editorialSourceType": "official-documentation"
    },
    {
      "id": "ui-filter",
      "term": "filter",
      "displayTerm": "FILTER",
      "speechText": "filter",
      "pronunciation": "/ˈfɪltər/",
      "category": "UI Vocabulary",
      "radarType": "interface",
      "platforms": [
        "dictionary",
        "task list",
        "analytics table"
      ],
      "tone": [
        "Technical",
        "Neutral"
      ],
      "status": "Common",
      "formality": "Neutral",
      "meaningEn": "A control or rule that narrows visible results according to selected criteria.",
      "meaningZh": "根据选定条件缩小当前显示结果范围的筛选功能。",
      "exampleEn": "Filter the dictionary by category and mastery level.",
      "exampleZh": "按照分类和掌握程度筛选词典。",
      "useWhen": "Use it to narrow a result set by category, date, status, source, or another property.",
      "useWhenZh": "用于按照明确属性或条件缩小结果集合。",
      "avoidWhen": "Use Sort when only the order changes. Keyword lookup is usually Search, although some products implement search as filtering.",
      "avoidWhenZh": "只改变排列顺序应使用 Sort；关键词查找通常属于 Search，但部分产品会把即时关键词搜索实现为过滤，因此应结合界面行为判断。",
      "chineseFeeling": "筛选；把不符合条件的暂时隐藏，不是删除数据。",
      "contentStatus": "active",
      "quizStatus": "ready",
      "sourceType": "imported",
      "uiArea": [
        "general-product-ui"
      ],
      "originalMeaningEn": "A device or process that lets selected material pass while excluding the rest.",
      "originalMeaningZh": "过滤器；让某些内容通过并排除其他内容的装置或过程。",
      "productMeaningEn": "A control or rule that narrows visible results according to selected criteria.",
      "productMeaningZh": "根据选定条件缩小当前显示结果范围的筛选功能。",
      "whyProductsUseItEn": "The interface lets only matching items pass into the current view.",
      "whyProductsUseItZh": "像物理过滤器一样，只让符合条件的内容进入当前视图。",
      "commonInterfaces": [
        "dictionary",
        "task list",
        "analytics table"
      ],
      "realInterfaceExamples": [
        {
          "surface": "dictionary",
          "exampleEn": "Filter the dictionary by category and mastery level.",
          "exampleZh": "按照分类和掌握程度筛选词典。"
        }
      ],
      "relatedTerms": [
        "ui-feed",
        "ui-dashboard"
      ],
      "confusedWith": [
        {
          "term": "Sort",
          "differenceEn": "Filter changes which items are visible; Sort changes the order of the same items.",
          "differenceZh": "Filter 改变显示哪些项目；Sort 改变同一批项目的顺序。"
        },
        {
          "term": "Search",
          "differenceEn": "Search usually begins with a query; Filter usually begins with selected criteria. Some products combine them.",
          "differenceZh": "Search 通常从查询词开始；Filter 通常从预设条件开始。部分产品会把两者结合。"
        }
      ],
      "interfaceTargets": [
        {
          "page": "product-interface",
          "area": "general-product-ui",
          "label": "Filter"
        }
      ],
      "usageBoundaryEn": "Use it to narrow a result set by category, date, status, source, or another property. Use Sort when only the order changes. Keyword lookup is usually Search, although some products implement search as filtering.",
      "usageBoundaryZh": "用于按照明确属性或条件缩小结果集合。只改变排列顺序应使用 Sort；关键词查找通常属于 Search，但部分产品会把即时关键词搜索实现为过滤，因此应结合界面行为判断。",
      "sourceName": "Carbon Design System — Filtering",
      "sourceUrl": "https://carbondesignsystem.com/patterns/filtering/",
      "auditedAt": "2026-08-07",
      "editorialSourceType": "official-documentation"
    },
    {
      "id": "ui-toggle",
      "term": "toggle",
      "displayTerm": "TOGGLE",
      "speechText": "toggle",
      "pronunciation": "/ˈtɑːɡəl/",
      "category": "UI Vocabulary",
      "radarType": "interface",
      "platforms": [
        "settings panel",
        "display control",
        "feature control"
      ],
      "tone": [
        "Technical",
        "Neutral"
      ],
      "status": "Common",
      "formality": "Neutral",
      "meaningEn": "A control that switches a setting or view between two defined states.",
      "meaningZh": "在两个明确状态之间进行切换的界面控制。",
      "exampleEn": "Use the toggle to turn Interface Learning Mode on or off.",
      "exampleZh": "使用切换开关开启或关闭界面学习模式。",
      "useWhen": "Use it when a setting or view has two clear states and can be switched directly.",
      "useWhenZh": "用于存在两个清楚状态且用户可直接来回切换的设置或视图。",
      "avoidWhen": "Do not use a toggle for one-time actions. Use Radio Buttons or Select for three or more mutually exclusive options, and Disclosure for expand/collapse behavior.",
      "avoidWhenZh": "一次性提交动作不应使用 Toggle；三个以上互斥选项更适合 Radio Buttons 或 Select；单纯展开或收起内容通常应使用 Disclosure。",
      "chineseFeeling": "切换开关；重点是两个状态之间来回变化。",
      "contentStatus": "active",
      "quizStatus": "ready",
      "sourceType": "imported",
      "uiArea": [
        "general-product-ui"
      ],
      "originalMeaningEn": "To switch back and forth between two positions or states.",
      "originalMeaningZh": "在两个位置或状态之间切换，也可指用于切换的开关机构。",
      "productMeaningEn": "A control that switches a setting or view between two defined states.",
      "productMeaningZh": "在两个明确状态之间进行切换的界面控制。",
      "whyProductsUseItEn": "Each activation moves the product directly between two clear states.",
      "whyProductsUseItZh": "强调每次操作都会在两个状态之间来回切换。",
      "commonInterfaces": [
        "settings panel",
        "display control",
        "feature control"
      ],
      "realInterfaceExamples": [
        {
          "surface": "settings panel",
          "exampleEn": "Use the toggle to turn Interface Learning Mode on or off.",
          "exampleZh": "使用切换开关开启或关闭界面学习模式。"
        }
      ],
      "relatedTerms": [
        "ui-settings",
        "ui-preferences"
      ],
      "confusedWith": [
        {
          "term": "Radio Group",
          "differenceEn": "A Toggle switches between two relative states; a Radio Group selects one option from several.",
          "differenceZh": "Toggle 在两个相对状态之间切换；Radio Group 从多个选项中选择一个。"
        },
        {
          "term": "Disclosure",
          "differenceEn": "A Disclosure expands or collapses content; a Toggle changes a setting or state.",
          "differenceZh": "Disclosure 展开或收起内容；Toggle 改变设置或状态。"
        }
      ],
      "interfaceTargets": [
        {
          "page": "product-interface",
          "area": "general-product-ui",
          "label": "Toggle"
        }
      ],
      "usageBoundaryEn": "Use it when a setting or view has two clear states and can be switched directly. Do not use a toggle for one-time actions. Use Radio Buttons or Select for three or more mutually exclusive options, and Disclosure for expand/collapse behavior.",
      "usageBoundaryZh": "用于存在两个清楚状态且用户可直接来回切换的设置或视图。一次性提交动作不应使用 Toggle；三个以上互斥选项更适合 Radio Buttons 或 Select；单纯展开或收起内容通常应使用 Disclosure。",
      "sourceName": "Apple Human Interface Guidelines — Toggles",
      "sourceUrl": "https://developer.apple.com/design/human-interface-guidelines/toggles",
      "auditedAt": "2026-08-07",
      "editorialSourceType": "official-documentation"
    },
    {
      "id": "ui-modal",
      "term": "modal",
      "displayTerm": "MODAL",
      "speechText": "modal",
      "pronunciation": "/ˈmoʊdəl/",
      "category": "UI Vocabulary",
      "radarType": "interface",
      "platforms": [
        "confirmation dialog",
        "permission flow",
        "compact creation form"
      ],
      "tone": [
        "Technical",
        "Neutral"
      ],
      "status": "Common",
      "formality": "Neutral",
      "meaningEn": "A layered dialog that places the interface in a temporary focused mode.",
      "meaningZh": "覆盖在当前页面上、要求用户集中处理或关闭后才能返回的临时对话层。",
      "exampleEn": "The confirmation opens in a modal above the current page.",
      "exampleZh": "确认内容会以模态窗口显示在当前页面上方。",
      "useWhen": "Use it for a short focused confirmation, choice, or compact form requiring a response.",
      "useWhenZh": "用于短小、聚焦并需要用户明确回应的临时任务。",
      "avoidWhen": "Avoid modals for long workflows, complex editing, or tasks that require frequent reference to background content. A floating layer is not truly modal if the background remains interactive.",
      "avoidWhenZh": "长流程、复杂编辑或需要频繁参考背景内容的任务不适合放入 Modal；如果背景仍可正常交互，也不应仅因视觉上浮层就称为真正的 Modal。",
      "chineseFeeling": "模态对话框、弹出层；重点不是“弹出来”，而是暂时把注意力和操作锁定在这里。",
      "contentStatus": "active",
      "quizStatus": "ready",
      "sourceType": "imported",
      "uiArea": [
        "general-product-ui"
      ],
      "originalMeaningEn": "Related to a mode or particular state.",
      "originalMeaningZh": "与 mode（模式、状态）有关；表示某种特定模式。",
      "productMeaningEn": "A layered dialog that places the interface in a temporary focused mode.",
      "productMeaningZh": "覆盖在当前页面上、要求用户集中处理或关闭后才能返回的临时对话层。",
      "whyProductsUseItEn": "The interface enters a temporary mode that must be handled before returning to the page.",
      "whyProductsUseItZh": "Modal 出现后，界面进入一种临时模式，用户需要先处理这个层再继续原页面。",
      "commonInterfaces": [
        "confirmation dialog",
        "permission flow",
        "compact creation form"
      ],
      "realInterfaceExamples": [
        {
          "surface": "confirmation dialog",
          "exampleEn": "The confirmation opens in a modal above the current page.",
          "exampleZh": "确认内容会以模态窗口显示在当前页面上方。"
        }
      ],
      "relatedTerms": [
        "ui-settings",
        "ui-empty-state"
      ],
      "confusedWith": [
        {
          "term": "Popover",
          "differenceEn": "A Modal makes the background unavailable and manages focus; a Popover is lighter and usually anchored to a nearby control.",
          "differenceZh": "Modal 会限制背景交互并管理焦点；Popover 更轻量，通常依附于附近控件。"
        },
        {
          "term": "Dedicated Page",
          "differenceEn": "A Dedicated Page is better for long, complex workflows; a Modal is better for short, focused tasks.",
          "differenceZh": "Dedicated Page 更适合长而复杂的流程；Modal 更适合短小聚焦的任务。"
        }
      ],
      "interfaceTargets": [
        {
          "page": "product-interface",
          "area": "general-product-ui",
          "label": "Modal"
        }
      ],
      "usageBoundaryEn": "Use it for a short focused confirmation, choice, or compact form requiring a response. Avoid modals for long workflows, complex editing, or tasks that require frequent reference to background content. A floating layer is not truly modal if the background remains interactive.",
      "usageBoundaryZh": "用于短小、聚焦并需要用户明确回应的临时任务。长流程、复杂编辑或需要频繁参考背景内容的任务不适合放入 Modal；如果背景仍可正常交互，也不应仅因视觉上浮层就称为真正的 Modal。",
      "sourceName": "W3C WAI-ARIA — Modal Dialog Pattern",
      "sourceUrl": "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/",
      "auditedAt": "2026-08-07",
      "editorialSourceType": "official-documentation"
    },
    {
      "id": "builder-build",
      "term": "build",
      "displayTerm": "BUILD",
      "speechText": "build",
      "pronunciation": "/bɪld/",
      "category": "GitHub / Development",
      "platforms": [
        "CI/CD",
        "software development",
        "engineering chat"
      ],
      "tone": [
        "Technical",
        "Work casual"
      ],
      "status": "Common",
      "formality": "Neutral",
      "meaningEn": "To create software, or the generated version produced from source code and dependencies.",
      "meaningZh": "开发软件；也可指由源代码和依赖生成的可运行版本或构建结果。",
      "exampleEn": "The latest build passed all automated checks.",
      "exampleZh": "最新构建版本通过了全部自动检查。",
      "useWhen": "Use it for creating software or generating a runnable or testable artifact.",
      "useWhenZh": "用于描述开发产品，或生成可运行、可测试的软件产物。",
      "avoidWhen": "Do not use it as a synonym for placing the artifact into an environment or formally releasing it.",
      "avoidWhenZh": "不要把 Build 直接等同于 Deploy 或 Release。",
      "chineseFeeling": "构建、打包出来的版本；既能表示“做产品”，也能表示一次具体构建结果。",
      "contentStatus": "active",
      "quizStatus": "ready",
      "sourceType": "imported",
      "sourceName": "GitHub Actions — Workflow Artifacts",
      "sourceUrl": "https://docs.github.com/en/actions/concepts/workflows-and-actions/workflow-artifacts",
      "auditedAt": "2026-08-06",
      "editorialSourceType": "official-documentation"
    },
    {
      "id": "builder-deploy",
      "term": "deploy",
      "displayTerm": "DEPLOY",
      "speechText": "deploy",
      "pronunciation": "/dɪˈplɔɪ/",
      "category": "GitHub / Development",
      "platforms": [
        "CI/CD",
        "cloud platform",
        "engineering chat"
      ],
      "tone": [
        "Technical",
        "Work casual"
      ],
      "status": "Common",
      "formality": "Neutral",
      "meaningEn": "To place and configure software in an environment where it can run.",
      "meaningZh": "把软件放入并配置到某个可运行环境中。",
      "exampleEn": "Deploy the tested build to staging before the production release.",
      "exampleZh": "正式发布前，先把测试通过的构建版本部署到 Staging 环境。",
      "useWhen": "Use it when code or a service is placed into a specific runtime environment.",
      "useWhenZh": "用于代码或服务进入具体运行环境的技术过程。",
      "avoidWhen": "Use build for generating an artifact and release for formal availability.",
      "avoidWhenZh": "只生成构建产物时使用 Build；强调正式版本可用时使用 Release。",
      "chineseFeeling": "部署到环境；重点是技术落地，不一定代表已经公开发布。",
      "contentStatus": "active",
      "quizStatus": "ready",
      "sourceType": "imported",
      "sourceName": "GitHub Actions — Control Deployments",
      "sourceUrl": "https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/control-deployments",
      "auditedAt": "2026-08-06",
      "editorialSourceType": "official-documentation"
    },
    {
      "id": "builder-release",
      "term": "release",
      "displayTerm": "RELEASE",
      "speechText": "release",
      "pronunciation": "/rɪˈliːs/",
      "category": "GitHub / Development",
      "platforms": [
        "GitHub",
        "product team",
        "software distribution"
      ],
      "tone": [
        "Technical",
        "Work casual"
      ],
      "status": "Common",
      "formality": "Neutral",
      "meaningEn": "To make a defined software version formally available, often with a version number and release notes.",
      "meaningZh": "将一个明确的软件版本正式提供给用户，通常伴随版本号和发布说明。",
      "exampleEn": "The team released version 1.2.1 after the main branch checks passed.",
      "exampleZh": "Main 分支检查通过后，团队正式发布了 1.2.1 版本。",
      "useWhen": "Use it for the formal availability of a defined version, feature, or package.",
      "useWhenZh": "用于正式版本、功能或软件包对用户可用的发布节点。",
      "avoidWhen": "A private deployment to staging is not by itself a public release.",
      "avoidWhenZh": "只把代码部署到内部 Staging 环境时，不应称为正式 Release。",
      "chineseFeeling": "正式发版；重点是版本状态和可用性，不只是把代码放上服务器。",
      "contentStatus": "active",
      "quizStatus": "ready",
      "sourceType": "imported",
      "sourceName": "GitHub — About Releases",
      "sourceUrl": "https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases",
      "auditedAt": "2026-08-06",
      "editorialSourceType": "official-documentation"
    },
    {
      "id": "builder-roadmap",
      "term": "roadmap",
      "displayTerm": "ROADMAP",
      "speechText": "roadmap",
      "pronunciation": "/ˈroʊdˌmæp/",
      "category": "Product Design",
      "platforms": [
        "product management",
        "public planning",
        "startup teams"
      ],
      "tone": [
        "Technical",
        "Work casual"
      ],
      "status": "Common",
      "formality": "Neutral",
      "meaningEn": "A high-level plan showing product direction, priorities, and possible stages over time.",
      "meaningZh": "展示产品方向、优先级和可能阶段的高层规划。",
      "exampleEn": "The roadmap prioritizes content expansion before account features.",
      "exampleZh": "路线图优先安排内容扩充，再考虑账户功能。",
      "useWhen": "Use it for medium- or long-term direction, priorities, and stages.",
      "useWhenZh": "用于表达中长期方向、优先级和阶段安排。",
      "avoidWhen": "Use a schedule or detailed project plan when exact dates, owners, dependencies, and fixed delivery commitments are required. A roadmap can still contain broad time ranges.",
      "avoidWhenZh": "需要精确日期、责任人、依赖和固定交付时间时，应使用 Schedule 或具体项目计划；Roadmap 也可能包含时间范围，因此不能简单理解为“完全没有日期”。",
      "chineseFeeling": "产品路线图；看方向和优先级，不等于每一项都已经确定日期。",
      "contentStatus": "active",
      "quizStatus": "ready",
      "sourceType": "imported",
      "sourceName": "Atlassian — Product Roadmaps",
      "sourceUrl": "https://www.atlassian.com/agile/product-management/product-roadmaps",
      "auditedAt": "2026-08-07",
      "editorialSourceType": "official-documentation"
    },
    {
      "id": "builder-rollback",
      "term": "rollback",
      "displayTerm": "ROLLBACK",
      "speechText": "rollback",
      "pronunciation": "/ˈroʊlˌbæk/",
      "category": "GitHub / Development",
      "platforms": [
        "incident response",
        "deployment platform",
        "database migration"
      ],
      "tone": [
        "Technical",
        "Work casual"
      ],
      "status": "Common",
      "formality": "Neutral",
      "meaningEn": "To return a deployed system or version to a previous known state after a problem.",
      "meaningZh": "在部署出现问题后，将系统或版本退回到之前已知可用的状态。",
      "exampleEn": "The team rolled back the deployment after login failed in production.",
      "exampleZh": "登录功能在 Production 出现故障后，团队回滚了这次部署。",
      "useWhen": "Use it to reverse a problematic deployment, migration, or release and restore service stability.",
      "useWhenZh": "用于撤回有问题的部署、迁移或发布，使运行系统恢复到之前状态。",
      "avoidWhen": "Use Revert for undoing a source commit, Restore for recovering data from a saved copy, and Backup for creating that copy.",
      "avoidWhenZh": "只撤销某次源代码提交时 revert 更具体；从备份找回用户数据时 restore 更准确；创建可恢复副本则应使用 backup。",
      "chineseFeeling": "回滚版本、撤回部署；重点是让运行中的系统迅速退回稳定状态。",
      "contentStatus": "active",
      "quizStatus": "ready",
      "sourceType": "imported",
      "sourceName": "Vercel — Promote and Roll Back Production Deployments",
      "sourceUrl": "https://vercel.com/docs/deployments/promote-preview-to-production",
      "auditedAt": "2026-08-07",
      "editorialSourceType": "official-documentation"
    },
    {
      "id": "builder-hotfix",
      "term": "hotfix",
      "displayTerm": "HOTFIX",
      "speechText": "hotfix",
      "pronunciation": "/ˈhɑːtˌfɪks/",
      "category": "GitHub / Development",
      "platforms": [
        "incident response",
        "security",
        "release workflow"
      ],
      "tone": [
        "Technical",
        "Work casual"
      ],
      "status": "Common",
      "formality": "Neutral",
      "meaningEn": "A small urgent change made to resolve a serious problem in a live system.",
      "meaningZh": "为解决线上系统中的严重问题而快速制作并发布的小范围紧急修复。",
      "exampleEn": "The team shipped a hotfix for the broken sign-in flow.",
      "exampleZh": "团队为失效的登录流程发布了紧急修复。",
      "useWhen": "Use it for an urgent, narrowly scoped correction to a serious production problem.",
      "useWhenZh": "用于线上严重问题需要立即修复且改动范围受控的情况。",
      "avoidWhen": "Do not call ordinary low-priority bugs, planned features, or large refactors hotfixes. Not every patch or bugfix is a hotfix, and urgency does not remove the need for validation.",
      "avoidWhenZh": "普通低优先级 bug、计划内功能或大规模重构不应称为 hotfix；紧急也不等于可以跳过验证。不要把所有 patch 或 bugfix 都自动归为 hotfix。",
      "chineseFeeling": "线上紧急修复；强调严重性、速度和小范围，不是所有修 Bug 都叫 Hotfix。",
      "contentStatus": "active",
      "quizStatus": "ready",
      "sourceType": "imported",
      "sourceName": "GitLab — Cherry-pick Changes and Hotfixes",
      "sourceUrl": "https://docs.gitlab.com/topics/git/cherry_pick/",
      "auditedAt": "2026-08-07",
      "editorialSourceType": "official-documentation"
    },
    {
      "id": "builder-refactor",
      "term": "refactor",
      "displayTerm": "REFACTOR",
      "speechText": "refactor",
      "pronunciation": "/ˌriːˈfæktər/",
      "category": "GitHub / Development",
      "platforms": [
        "code review",
        "maintenance",
        "software architecture"
      ],
      "tone": [
        "Technical",
        "Work casual"
      ],
      "status": "Common",
      "formality": "Neutral",
      "meaningEn": "To improve the internal structure of code without intentionally changing its external behavior.",
      "meaningZh": "在不刻意改变外部行为的前提下，改善代码内部结构。",
      "exampleEn": "We refactored the quiz registry without changing the user-facing behavior.",
      "exampleZh": "我们重构了 Quiz Registry，但没有改变用户可见行为。",
      "useWhen": "Use it for internal structural improvement while preserving existing behavior and contracts.",
      "useWhenZh": "用于内部结构改进，并希望现有外部行为和契约保持一致。",
      "avoidWhen": "Do not call feature additions, visible behavior changes, or a complete implementation replacement a refactor without qualification. The refactor–rewrite boundary depends on scope.",
      "avoidWhenZh": "加入新功能、改变用户可见行为或完全替换实现时，不应只称为 refactor；仍需测试确认没有回归。Refactor 与 rewrite 的边界应按实际改动范围判断。",
      "chineseFeeling": "重构内部代码；原则上功能表现不变，但代码组织更清楚。",
      "contentStatus": "active",
      "quizStatus": "ready",
      "sourceType": "imported",
      "sourceName": "Martin Fowler — Refactoring",
      "sourceUrl": "https://refactoring.com/",
      "auditedAt": "2026-08-07",
      "editorialSourceType": "official-documentation"
    },
    {
      "id": "builder-staging",
      "term": "staging",
      "displayTerm": "STAGING",
      "speechText": "staging",
      "pronunciation": "/ˈsteɪdʒɪŋ/",
      "category": "GitHub / Development",
      "platforms": [
        "CI/CD",
        "cloud platform",
        "quality assurance"
      ],
      "tone": [
        "Technical",
        "Work casual"
      ],
      "status": "Common",
      "formality": "Neutral",
      "meaningEn": "A pre-production environment used for final testing in conditions that resemble the live system.",
      "meaningZh": "在正式上线前，用于接近真实环境进行最终测试的预发布环境。",
      "exampleEn": "Verify the migration in staging before touching production data.",
      "exampleZh": "在处理 Production 数据前，先在 Staging 环境验证迁移。",
      "useWhen": "Use it for integrated, production-like checks before a version reaches real users.",
      "useWhenZh": "用于上线前的集成验证、部署检查和接近真实条件的最终测试。",
      "avoidWhen": "Do not automatically call a developer's local machine staging or expose staging as the stable live service.",
      "avoidWhenZh": "个人本地开发环境不应自动称为 Staging，也不要让用户把它当作正式服务。",
      "chineseFeeling": "预发布环境、上线前最后排练；比本地测试更接近真实线上。",
      "contentStatus": "active",
      "quizStatus": "ready",
      "sourceType": "imported",
      "sourceName": "GitHub Actions — Control Deployments",
      "sourceUrl": "https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/control-deployments",
      "auditedAt": "2026-08-06",
      "editorialSourceType": "official-documentation"
    },
    {
      "id": "builder-production",
      "term": "production",
      "displayTerm": "PRODUCTION",
      "speechText": "production",
      "pronunciation": "/prəˈdʌkʃən/",
      "category": "GitHub / Development",
      "platforms": [
        "live operations",
        "cloud platform",
        "incident response"
      ],
      "tone": [
        "Technical",
        "Work casual"
      ],
      "status": "Common",
      "formality": "Neutral",
      "meaningEn": "The live environment where a software system serves real users and handles real operations or data.",
      "meaningZh": "软件正式服务真实用户、处理真实业务或数据的线上运行环境。",
      "exampleEn": "The issue appeared only in production because the live data was different.",
      "exampleZh": "由于真实数据不同，这个问题只在 Production 环境中出现。",
      "useWhen": "Use it for the live system, service, or data environment used by real users.",
      "useWhenZh": "用于指真实用户正在使用的正式系统、服务和数据环境。",
      "avoidWhen": "Do not call a test, demo, preview, or local environment production.",
      "avoidWhenZh": "测试站、演示站、预览链接或本地环境不应随意称为 Production。",
      "chineseFeeling": "正式线上环境、真实用户环境；这里的错误会真正影响用户和数据。",
      "contentStatus": "active",
      "quizStatus": "ready",
      "sourceType": "imported",
      "sourceName": "Vercel Deployments Overview",
      "sourceUrl": "https://vercel.com/docs/deployments/overview",
      "auditedAt": "2026-08-06",
      "editorialSourceType": "official-documentation"
    }
  ]
};
