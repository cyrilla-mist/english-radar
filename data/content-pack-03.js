window.ENGLISH_RADAR_CONTENT_PACK_03 = {
  "app": "English Radar Content Pack",
  "schemaVersion": 1,
  "pack": {
    "id": "english-radar-content-pack-03",
    "name": "Interface Structure & Overlays",
    "description": "10 audited UI Vocabulary Signals covering navigation structure, peer-content switching, overlays, and lightweight feedback.",
    "version": "1.0.0",
    "source": "english-radar-signal-candidates",
    "sourceLabel": "English Radar audited interface vocabulary",
    "preparedAt": "2026-08-07",
    "auditStatus": "complete",
    "auditCompletedAt": "2026-08-07",
    "sourcePolicy": "Official documentation for every Signal.",
    "editorialAudit": {
      "status": "complete",
      "completedAt": "2026-08-07",
      "signalCount": 10,
      "quizCount": 20,
      "sourceCoverage": "10/10 official-documentation references",
      "notionAuditPages": [
        "Content Pack 03｜Interface Structure & Overlays｜Candidate Audit 01",
        "Content Pack 03｜Relation & Quiz Audit 01",
        "Content Pack 03｜Import Manifest"
      ]
    }
  },
  "signals": [
    {
      "id": "ui-navigation",
      "term": "navigation",
      "displayTerm": "NAVIGATION",
      "speechText": "navigation",
      "pronunciation": "/ˌnævɪˈɡeɪʃən/",
      "category": "UI Vocabulary",
      "radarType": "interface",
      "platforms": [
        "product interface"
      ],
      "tone": [
        "Technical",
        "Neutral"
      ],
      "status": "Common",
      "formality": "Neutral",
      "meaningEn": "The overall system that lets users move between pages, functions, and levels.",
      "meaningZh": "导航体系；帮助用户在页面、功能和层级间移动的整体结构。",
      "exampleEn": "The new navigation makes the dictionary easier to reach.",
      "exampleZh": "新的导航结构让词典更容易找到。",
      "useWhen": "Referring to the overall movement structure of a product.",
      "useWhenZh": "用于指产品中整体的移动与到达结构。",
      "avoidWhen": "For one isolated back button or one small command list.",
      "avoidWhenZh": "单独一个返回按钮或一小组命令通常不应称为整个 Navigation。",
      "chineseFeeling": "产品里的路线系统",
      "contentStatus": "active",
      "quizStatus": "ready",
      "sourceType": "imported",
      "uiArea": [
        "general-product-ui"
      ],
      "originalMeaningEn": "Planning and following a route to a destination.",
      "originalMeaningZh": "规划并沿着路线前往目的地。",
      "productMeaningEn": "The overall system that lets users move between pages, functions, and levels.",
      "productMeaningZh": "导航体系；帮助用户在页面、功能和层级间移动的整体结构。",
      "whyProductsUseItEn": "It answers where the user is, where they can go, and how to return.",
      "whyProductsUseItZh": "它回答用户“现在在哪里、可以去哪里、怎么返回”。",
      "commonInterfaces": [
        "Information architecture and movement across a product."
      ],
      "realInterfaceExamples": [
        {
          "surface": "product interface",
          "exampleEn": "The new navigation makes the dictionary easier to reach.",
          "exampleZh": "新的导航结构让词典更容易找到。"
        }
      ],
      "relatedTerms": [
        "ui-sidebar",
        "ui-breadcrumb",
        "ui-tab"
      ],
      "confusedWith": [
        {
          "term": "Toolbar",
          "differenceEn": "Navigation moves users among destinations; a toolbar exposes actions for the current context.",
          "differenceZh": "Navigation 负责在目的地之间移动；Toolbar 主要展示当前上下文中的操作。"
        }
      ],
      "interfaceTargets": [
        {
          "page": "product-interface",
          "area": "general-product-ui",
          "label": "Navigation"
        }
      ],
      "usageBoundaryEn": "Referring to the overall movement structure of a product. For one isolated back button or one small command list.",
      "usageBoundaryZh": "用于指产品中整体的移动与到达结构。 单独一个返回按钮或一小组命令通常不应称为整个 Navigation。",
      "sourceName": "W3C WAI-ARIA APG — Landmark Regions",
      "sourceUrl": "https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/",
      "auditedAt": "2026-08-07",
      "editorialSourceType": "official-documentation"
    },
    {
      "id": "ui-sidebar",
      "term": "sidebar",
      "displayTerm": "SIDEBAR",
      "speechText": "sidebar",
      "pronunciation": "/ˈsaɪdˌbɑːr/",
      "category": "UI Vocabulary",
      "radarType": "interface",
      "platforms": [
        "product interface"
      ],
      "tone": [
        "Technical",
        "Neutral"
      ],
      "status": "Common",
      "formality": "Neutral",
      "meaningEn": "A fixed or collapsible side area containing navigation, projects, filters, or tools.",
      "meaningZh": "侧边栏；放置导航入口、项目列表、筛选或工具的区域。",
      "exampleEn": "Open the project from the sidebar.",
      "exampleZh": "从侧边栏打开该项目。",
      "useWhen": "Naming a persistent or collapsible side area with navigation or tools.",
      "useWhenZh": "用于命名常驻或可折叠、承载导航或工具的侧边区域。",
      "avoidWhen": "For a temporary mobile panel that behaves more like a drawer.",
      "avoidWhenZh": "如果移动端面板主要从边缘临时拉出并覆盖页面，更接近 Drawer。",
      "chineseFeeling": "侧边导航区",
      "contentStatus": "active",
      "quizStatus": "ready",
      "sourceType": "imported",
      "uiArea": [
        "general-product-ui"
      ],
      "originalMeaningEn": "A bar or section positioned beside the main area.",
      "originalMeaningZh": "位于主要区域旁边的一条栏或区域。",
      "productMeaningEn": "A fixed or collapsible side area containing navigation, projects, filters, or tools.",
      "productMeaningZh": "侧边栏；放置导航入口、项目列表、筛选或工具的区域。",
      "whyProductsUseItEn": "It stays beside the main content so frequent destinations remain easy to reach.",
      "whyProductsUseItZh": "它位于主内容旁边，让高频入口保持易于到达。",
      "commonInterfaces": [
        "Navigation and project organization."
      ],
      "realInterfaceExamples": [
        {
          "surface": "product interface",
          "exampleEn": "Open the project from the sidebar.",
          "exampleZh": "从侧边栏打开该项目。"
        }
      ],
      "relatedTerms": [
        "ui-navigation",
        "ui-drawer"
      ],
      "confusedWith": [
        {
          "term": "Drawer",
          "differenceEn": "A sidebar is usually persistent or collapsible within the layout; a drawer emphasizes an edge panel that opens and closes.",
          "differenceZh": "Sidebar 通常常驻或在布局内折叠；Drawer 更强调从边缘打开和关闭的面板行为。"
        }
      ],
      "interfaceTargets": [
        {
          "page": "product-interface",
          "area": "general-product-ui",
          "label": "Sidebar"
        }
      ],
      "usageBoundaryEn": "Naming a persistent or collapsible side area with navigation or tools. For a temporary mobile panel that behaves more like a drawer.",
      "usageBoundaryZh": "用于命名常驻或可折叠、承载导航或工具的侧边区域。 如果移动端面板主要从边缘临时拉出并覆盖页面，更接近 Drawer。",
      "sourceName": "IBM Carbon Design System — UI Shell Left Panel",
      "sourceUrl": "https://carbondesignsystem.com/components/UI-shell-left-panel/usage/",
      "auditedAt": "2026-08-07",
      "editorialSourceType": "official-documentation"
    },
    {
      "id": "ui-toolbar",
      "term": "toolbar",
      "displayTerm": "TOOLBAR",
      "speechText": "toolbar",
      "pronunciation": "/ˈtuːlˌbɑːr/",
      "category": "UI Vocabulary",
      "radarType": "interface",
      "platforms": [
        "product interface"
      ],
      "tone": [
        "Technical",
        "Neutral"
      ],
      "status": "Common",
      "formality": "Neutral",
      "meaningEn": "A control area that displays frequently used editing or action buttons.",
      "meaningZh": "工具栏；集中显示编辑、格式、缩放或分享等高频操作。",
      "exampleEn": "Use the toolbar to format the selected text.",
      "exampleZh": "使用工具栏设置所选文字的格式。",
      "useWhen": "Naming a visible strip of action controls.",
      "useWhenZh": "用于命名一条可见的高频操作控件区域。",
      "avoidWhen": "For a hidden list of commands; that is usually a menu.",
      "avoidWhenZh": "隐藏起来的命令列表通常更接近 Menu，而不是 Toolbar。",
      "chineseFeeling": "常用工具区",
      "contentStatus": "active",
      "quizStatus": "ready",
      "sourceType": "imported",
      "uiArea": [
        "general-product-ui"
      ],
      "originalMeaningEn": "A bar that holds tools.",
      "originalMeaningZh": "用来放置工具的一条栏。",
      "productMeaningEn": "A control area that displays frequently used editing or action buttons.",
      "productMeaningZh": "工具栏；集中显示编辑、格式、缩放或分享等高频操作。",
      "whyProductsUseItEn": "It keeps context-relevant actions visible and reduces extra menu steps.",
      "whyProductsUseItZh": "它让当前上下文中的高频操作保持可见，减少额外菜单步骤。",
      "commonInterfaces": [
        "Editing and creation interfaces."
      ],
      "realInterfaceExamples": [
        {
          "surface": "product interface",
          "exampleEn": "Use the toolbar to format the selected text.",
          "exampleZh": "使用工具栏设置所选文字的格式。"
        }
      ],
      "relatedTerms": [
        "ui-navigation"
      ],
      "confusedWith": [
        {
          "term": "Navigation",
          "differenceEn": "A toolbar exposes actions for the current task; navigation moves users to other destinations or levels.",
          "differenceZh": "Toolbar 展示当前任务的操作；Navigation 负责把用户带到其他目的地或层级。"
        }
      ],
      "interfaceTargets": [
        {
          "page": "product-interface",
          "area": "general-product-ui",
          "label": "Toolbar"
        }
      ],
      "usageBoundaryEn": "Naming a visible strip of action controls. For a hidden list of commands; that is usually a menu.",
      "usageBoundaryZh": "用于命名一条可见的高频操作控件区域。 隐藏起来的命令列表通常更接近 Menu，而不是 Toolbar。",
      "sourceName": "W3C WAI-ARIA APG — Toolbar Pattern",
      "sourceUrl": "https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/",
      "auditedAt": "2026-08-07",
      "editorialSourceType": "official-documentation"
    },
    {
      "id": "ui-tab",
      "term": "tab",
      "displayTerm": "TAB",
      "speechText": "tab",
      "pronunciation": "/tæb/",
      "category": "UI Vocabulary",
      "radarType": "interface",
      "platforms": [
        "product interface"
      ],
      "tone": [
        "Technical",
        "Neutral"
      ],
      "status": "Common",
      "formality": "Neutral",
      "meaningEn": "A selectable label in a tab list that activates and displays its associated panel of content.",
      "meaningZh": "标签页切换项；在一组并列内容中，点击某个 tab 会显示对应的内容面板。",
      "exampleEn": "Open the Activity tab to see recent changes.",
      "exampleZh": "打开 Activity 标签页查看最近的变更。",
      "useWhen": "Naming one selectable item in a tabbed interface that switches to its associated panel.",
      "useWhenZh": "用于命名标签页界面中负责切换对应内容面板的可选项。",
      "avoidWhen": "For the product's whole movement system or a link that mainly takes the user to a different hierarchy level; those are broader navigation patterns.",
      "avoidWhenZh": "如果表示整个产品的移动系统，或主要跳转到其他层级，就不应把它简单叫 Tab。",
      "chineseFeeling": "同一块界面里切换并列内容的“页签”。",
      "contentStatus": "active",
      "quizStatus": "ready",
      "sourceType": "imported",
      "uiArea": [
        "general-product-ui"
      ],
      "originalMeaningEn": "A small projecting label or flap used to identify or reach a section, like the tab on a file folder.",
      "originalMeaningZh": "像文件夹标签一样，用于识别或快速到达某个部分的小突出标签或页签。",
      "productMeaningEn": "A selectable label in a tab list that activates and displays its associated panel of content.",
      "productMeaningZh": "标签页切换项；在一组并列内容中，点击某个 tab 会显示对应的内容面板。",
      "whyProductsUseItEn": "The interface metaphor comes from physical file-folder tabs: a small labeled edge lets you jump directly to one section among peers.",
      "whyProductsUseItZh": "这个界面比喻来自实体文件夹页签：一个小标签让你在并列部分中直接跳转。",
      "commonInterfaces": [
        "Peer-section switching inside one view, such as profile sections, settings categories, dashboards, and editor panels."
      ],
      "realInterfaceExamples": [
        {
          "surface": "product interface",
          "exampleEn": "Open the Activity tab to see recent changes.",
          "exampleZh": "打开 Activity 标签页查看最近的变更。"
        }
      ],
      "relatedTerms": [
        "ui-breadcrumb",
        "ui-accordion",
        "ui-navigation"
      ],
      "confusedWith": [
        {
          "term": "Breadcrumb",
          "differenceEn": "Tabs switch peer panels in the same view; a breadcrumb shows hierarchical location and parent levels.",
          "differenceZh": "Tabs 在同一视图中切换并列面板；Breadcrumb 展示当前位置的层级路径和父级。"
        }
      ],
      "interfaceTargets": [
        {
          "page": "product-interface",
          "area": "general-product-ui",
          "label": "Tab"
        }
      ],
      "usageBoundaryEn": "Naming one selectable item in a tabbed interface that switches to its associated panel. For the product's whole movement system or a link that mainly takes the user to a different hierarchy level; those are broader navigation patterns.",
      "usageBoundaryZh": "用于命名标签页界面中负责切换对应内容面板的可选项。 如果表示整个产品的移动系统，或主要跳转到其他层级，就不应把它简单叫 Tab。",
      "sourceName": "W3C WAI-ARIA APG — Tabs Pattern",
      "sourceUrl": "https://www.w3.org/WAI/ARIA/apg/patterns/tabs/",
      "auditedAt": "2026-08-07",
      "editorialSourceType": "official-documentation"
    },
    {
      "id": "ui-breadcrumb",
      "term": "breadcrumb",
      "displayTerm": "BREADCRUMB",
      "speechText": "breadcrumb",
      "pronunciation": "/ˈbrɛdˌkrʌm/",
      "category": "UI Vocabulary",
      "radarType": "interface",
      "platforms": [
        "product interface"
      ],
      "tone": [
        "Technical",
        "Neutral"
      ],
      "status": "Common",
      "formality": "Neutral",
      "meaningEn": "A hierarchical trail of links that shows the current page's position and provides access to parent levels.",
      "meaningZh": "面包屑导航；按层级展示当前位置，并提供返回上级页面的链接路径。",
      "exampleEn": "Use the breadcrumb to return to the project overview.",
      "exampleZh": "通过面包屑导航返回项目总览。",
      "useWhen": "Naming a visible hierarchy trail such as Home / Projects / English Radar.",
      "useWhenZh": "用于命名 Home / Projects / English Radar 这类可见的层级路径。",
      "avoidWhen": "For primary top-level navigation or a list of unrelated recent pages; breadcrumb implies parent-child hierarchy.",
      "avoidWhenZh": "不要把顶层主导航或互不相关的最近页面列表叫 Breadcrumb；它强调父子层级。",
      "chineseFeeling": "告诉你“我现在在哪一层、上一级是什么”的层级路径。",
      "contentStatus": "active",
      "quizStatus": "ready",
      "sourceType": "imported",
      "uiArea": [
        "general-product-ui"
      ],
      "originalMeaningEn": "A small piece of bread left behind; the UI metaphor echoes a trail of crumbs that shows the route back.",
      "originalMeaningZh": "一路留下的小块面包屑；UI 借用“面包屑轨迹”的比喻来显示返回路径。",
      "productMeaningEn": "A hierarchical trail of links that shows the current page's position and provides access to parent levels.",
      "productMeaningZh": "面包屑导航；按层级展示当前位置，并提供返回上级页面的链接路径。",
      "whyProductsUseItEn": "Like leaving breadcrumbs along a route, the interface leaves a visible trail of hierarchy so users can see where they are and move upward.",
      "whyProductsUseItZh": "像沿路留下的面包屑一样，界面保留可见层级路径，让用户知道当前位置并向上返回。",
      "commonInterfaces": [
        "Hierarchical websites, documentation, dashboards, file structures, and admin systems."
      ],
      "realInterfaceExamples": [
        {
          "surface": "product interface",
          "exampleEn": "Use the breadcrumb to return to the project overview.",
          "exampleZh": "通过面包屑导航返回项目总览。"
        }
      ],
      "relatedTerms": [
        "ui-navigation",
        "ui-tab",
        "ui-sidebar"
      ],
      "confusedWith": [
        {
          "term": "Navigation",
          "differenceEn": "Breadcrumb is a hierarchical trail to the current page; primary navigation lists major destinations rather than parent levels.",
          "differenceZh": "Breadcrumb 是当前位置的层级路径；Primary Navigation 展示主要目的地，而不是父级链条。"
        }
      ],
      "interfaceTargets": [
        {
          "page": "product-interface",
          "area": "general-product-ui",
          "label": "Breadcrumb"
        }
      ],
      "usageBoundaryEn": "Naming a visible hierarchy trail such as Home / Projects / English Radar. For primary top-level navigation or a list of unrelated recent pages; breadcrumb implies parent-child hierarchy.",
      "usageBoundaryZh": "用于命名 Home / Projects / English Radar 这类可见的层级路径。 不要把顶层主导航或互不相关的最近页面列表叫 Breadcrumb；它强调父子层级。",
      "sourceName": "W3C WAI-ARIA APG — Breadcrumb Pattern",
      "sourceUrl": "https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/",
      "auditedAt": "2026-08-07",
      "editorialSourceType": "official-documentation"
    },
    {
      "id": "ui-accordion",
      "term": "accordion",
      "displayTerm": "ACCORDION",
      "speechText": "accordion",
      "pronunciation": "/əˈkɔːrdiən/",
      "category": "UI Vocabulary",
      "radarType": "interface",
      "platforms": [
        "product interface"
      ],
      "tone": [
        "Technical",
        "Neutral"
      ],
      "status": "Common",
      "formality": "Neutral",
      "meaningEn": "A vertically stacked set of headings that expand or collapse to reveal or hide associated sections of content.",
      "meaningZh": "手风琴式折叠区；多个纵向标题可以展开或收起各自对应的内容。",
      "exampleEn": "The advanced options are hidden inside an accordion.",
      "exampleZh": "高级选项收在一个可展开的折叠区里。",
      "useWhen": "Naming stacked expandable sections where each header controls its own content panel.",
      "useWhenZh": "用于命名纵向排列、每个标题可以控制自身内容展开或收起的区域。",
      "avoidWhen": "For switching between peer panels where only the selected section is shown as a tabbed interface; that pattern is Tabs.",
      "avoidWhenZh": "如果通过标签在并列面板之间切换，更接近 Tabs，而不是 Accordion。",
      "chineseFeeling": "一条条能展开/收起的折叠内容区。",
      "contentStatus": "active",
      "quizStatus": "ready",
      "sourceType": "imported",
      "uiArea": [
        "general-product-ui"
      ],
      "originalMeaningEn": "A musical instrument whose folded bellows expand and collapse.",
      "originalMeaningZh": "一种通过折叠风箱伸缩来演奏的手风琴。",
      "productMeaningEn": "A vertically stacked set of headings that expand or collapse to reveal or hide associated sections of content.",
      "productMeaningZh": "手风琴式折叠区；多个纵向标题可以展开或收起各自对应的内容。",
      "whyProductsUseItEn": "The expanding and collapsing sections resemble the folded bellows of an accordion instrument.",
      "whyProductsUseItZh": "内容区的展开和收起像手风琴风箱的伸缩。",
      "commonInterfaces": [
        "FAQs, settings groups, forms, documentation, and dense pages where sections need progressive disclosure."
      ],
      "realInterfaceExamples": [
        {
          "surface": "product interface",
          "exampleEn": "The advanced options are hidden inside an accordion.",
          "exampleZh": "高级选项收在一个可展开的折叠区里。"
        }
      ],
      "relatedTerms": [
        "ui-tab"
      ],
      "confusedWith": [
        {
          "term": "Tab",
          "differenceEn": "Accordion sections expand and collapse vertically; tabs select among peer panels in a tabbed interface.",
          "differenceZh": "Accordion 纵向展开/收起内容区；Tabs 在并列面板之间进行选择切换。"
        }
      ],
      "interfaceTargets": [
        {
          "page": "product-interface",
          "area": "general-product-ui",
          "label": "Accordion"
        }
      ],
      "usageBoundaryEn": "Naming stacked expandable sections where each header controls its own content panel. For switching between peer panels where only the selected section is shown as a tabbed interface; that pattern is Tabs.",
      "usageBoundaryZh": "用于命名纵向排列、每个标题可以控制自身内容展开或收起的区域。 如果通过标签在并列面板之间切换，更接近 Tabs，而不是 Accordion。",
      "sourceName": "W3C WAI-ARIA APG — Accordion Pattern",
      "sourceUrl": "https://www.w3.org/WAI/ARIA/apg/patterns/accordion/",
      "auditedAt": "2026-08-07",
      "editorialSourceType": "official-documentation"
    },
    {
      "id": "ui-drawer",
      "term": "drawer",
      "displayTerm": "DRAWER",
      "speechText": "drawer",
      "pronunciation": "/drɔːr/",
      "category": "UI Vocabulary",
      "radarType": "interface",
      "platforms": [
        "product interface"
      ],
      "tone": [
        "Technical",
        "Neutral"
      ],
      "status": "Common",
      "formality": "Neutral",
      "meaningEn": "A panel that opens from an edge of the screen, often temporarily, to expose navigation, settings, filters, or secondary actions.",
      "meaningZh": "抽屉式面板；从屏幕边缘滑出或展开，用来放导航、设置、筛选或次级操作。",
      "exampleEn": "Open the filter drawer to narrow the results.",
      "exampleZh": "打开筛选抽屉来缩小结果范围。",
      "useWhen": "Naming an edge-attached panel that can open and close over or beside the main content.",
      "useWhenZh": "用于命名贴着屏幕边缘、可在主内容上方或旁边打开和关闭的面板。",
      "avoidWhen": "For a side area that is persistently visible as part of the normal layout; that is more naturally a sidebar or side navigation.",
      "avoidWhenZh": "如果侧边区域长期作为正常布局的一部分持续可见，更自然的词是 Sidebar 或 Side Navigation。",
      "chineseFeeling": "从屏幕边缘“拉出来”的临时侧边面板。",
      "contentStatus": "active",
      "quizStatus": "ready",
      "sourceType": "imported",
      "uiArea": [
        "general-product-ui"
      ],
      "originalMeaningEn": "A sliding storage compartment that pulls out from a cabinet or desk.",
      "originalMeaningZh": "可以从柜子或书桌里拉出的滑动储物格。",
      "productMeaningEn": "A panel that opens from an edge of the screen, often temporarily, to expose navigation, settings, filters, or secondary actions.",
      "productMeaningZh": "抽屉式面板；从屏幕边缘滑出或展开，用来放导航、设置、筛选或次级操作。",
      "whyProductsUseItEn": "It behaves like a physical drawer: normally tucked away at an edge, then pulled out when needed.",
      "whyProductsUseItZh": "它像实体抽屉：平时收在边缘，需要时再拉出来。",
      "commonInterfaces": [
        "Mobile navigation, filters, account panels, secondary controls, and responsive layouts."
      ],
      "realInterfaceExamples": [
        {
          "surface": "product interface",
          "exampleEn": "Open the filter drawer to narrow the results.",
          "exampleZh": "打开筛选抽屉来缩小结果范围。"
        }
      ],
      "relatedTerms": [
        "ui-sidebar",
        "ui-modal"
      ],
      "confusedWith": [
        {
          "term": "Sidebar",
          "differenceEn": "Drawer emphasizes an edge panel that opens and closes; Sidebar emphasizes a side region that remains part of the layout.",
          "differenceZh": "Drawer 强调从边缘打开/关闭的面板；Sidebar 强调作为布局组成部分存在的侧边区域。"
        }
      ],
      "interfaceTargets": [
        {
          "page": "product-interface",
          "area": "general-product-ui",
          "label": "Drawer"
        }
      ],
      "usageBoundaryEn": "Naming an edge-attached panel that can open and close over or beside the main content. For a side area that is persistently visible as part of the normal layout; that is more naturally a sidebar or side navigation.",
      "usageBoundaryZh": "用于命名贴着屏幕边缘、可在主内容上方或旁边打开和关闭的面板。 如果侧边区域长期作为正常布局的一部分持续可见，更自然的词是 Sidebar 或 Side Navigation。",
      "sourceName": "Material UI — Drawer",
      "sourceUrl": "https://mui.com/material-ui/react-drawer/",
      "auditedAt": "2026-08-07",
      "editorialSourceType": "official-documentation"
    },
    {
      "id": "ui-popover",
      "term": "popover",
      "displayTerm": "POPOVER",
      "speechText": "popover",
      "pronunciation": "/ˈpoʊpˌoʊvər/",
      "category": "UI Vocabulary",
      "radarType": "interface",
      "platforms": [
        "product interface"
      ],
      "tone": [
        "Technical",
        "Neutral"
      ],
      "status": "Common",
      "formality": "Neutral",
      "meaningEn": "An overlay anchored to another interface element that displays additional content or controls above the page.",
      "meaningZh": "锚定式浮层；依附某个触发元素，在页面上方弹出额外内容或操作。",
      "exampleEn": "Click the avatar to open the account popover.",
      "exampleZh": "点击头像打开账户浮层。",
      "useWhen": "Naming an anchored overlay that can contain richer content or controls than a tooltip.",
      "useWhenZh": "用于命名依附触发元素、可以承载比 Tooltip 更丰富内容或操作的浮层。",
      "avoidWhen": "For tiny non-interactive helper text shown only on hover/focus; use Tooltip. For a blocking centered workflow, use Modal or Dialog.",
      "avoidWhenZh": "仅在悬停/聚焦时显示的简短非交互帮助应使用 Tooltip；阻断式居中流程更接近 Modal 或 Dialog。",
      "chineseFeeling": "贴着某个按钮或元素弹出来的一小块浮层。",
      "contentStatus": "active",
      "quizStatus": "ready",
      "sourceType": "imported",
      "uiArea": [
        "general-product-ui"
      ],
      "originalMeaningEn": "Something that pops over or appears above another surface.",
      "originalMeaningZh": "突然弹出或出现在另一层表面之上的东西。",
      "productMeaningEn": "An overlay anchored to another interface element that displays additional content or controls above the page.",
      "productMeaningZh": "锚定式浮层；依附某个触发元素，在页面上方弹出额外内容或操作。",
      "whyProductsUseItEn": "The content visually pops over the existing interface while remaining tied to a trigger or anchor element.",
      "whyProductsUseItZh": "内容会覆盖在现有界面之上，同时仍与触发元素或锚点保持关联。",
      "commonInterfaces": [
        "Contextual actions, compact forms, date pickers, profile menus, and richer contextual information."
      ],
      "realInterfaceExamples": [
        {
          "surface": "product interface",
          "exampleEn": "Click the avatar to open the account popover.",
          "exampleZh": "点击头像打开账户浮层。"
        }
      ],
      "relatedTerms": [
        "ui-tooltip",
        "ui-modal"
      ],
      "confusedWith": [
        {
          "term": "Tooltip",
          "differenceEn": "A popover can contain richer or interactive content; a tooltip is brief contextual help and is usually non-interactive.",
          "differenceZh": "Popover 可以承载更丰富甚至可交互的内容；Tooltip 通常只是简短、非交互式的上下文提示。"
        }
      ],
      "interfaceTargets": [
        {
          "page": "product-interface",
          "area": "general-product-ui",
          "label": "Popover"
        }
      ],
      "usageBoundaryEn": "Naming an anchored overlay that can contain richer content or controls than a tooltip. For tiny non-interactive helper text shown only on hover/focus; use Tooltip. For a blocking centered workflow, use Modal or Dialog.",
      "usageBoundaryZh": "用于命名依附触发元素、可以承载比 Tooltip 更丰富内容或操作的浮层。 仅在悬停/聚焦时显示的简短非交互帮助应使用 Tooltip；阻断式居中流程更接近 Modal 或 Dialog。",
      "sourceName": "Material UI — Popover",
      "sourceUrl": "https://mui.com/material-ui/react-popover/",
      "auditedAt": "2026-08-07",
      "editorialSourceType": "official-documentation"
    },
    {
      "id": "ui-tooltip",
      "term": "tooltip",
      "displayTerm": "TOOLTIP",
      "speechText": "tooltip",
      "pronunciation": "/ˈtuːlˌtɪp/",
      "category": "UI Vocabulary",
      "radarType": "interface",
      "platforms": [
        "product interface"
      ],
      "tone": [
        "Technical",
        "Neutral"
      ],
      "status": "Common",
      "formality": "Neutral",
      "meaningEn": "A small contextual label or help message that appears when a user hovers over or focuses a specific interface element.",
      "meaningZh": "工具提示；用户悬停或聚焦某个界面元素时出现的简短说明。",
      "exampleEn": "Hover over the icon to see its tooltip.",
      "exampleZh": "把鼠标移到图标上即可看到工具提示。",
      "useWhen": "Providing brief, non-interactive contextual help tied to one specific element.",
      "useWhenZh": "用于给某个具体界面元素提供简短、非交互式的上下文帮助。",
      "avoidWhen": "For interactive content, multiple actions, or a form inside the overlay; use a popover or dialog instead.",
      "avoidWhenZh": "如果浮层内包含可交互内容、多项操作或表单，应使用 Popover 或 Dialog，而不是 Tooltip。",
      "chineseFeeling": "鼠标放上去或键盘聚焦时冒出来的一句小提示。",
      "contentStatus": "active",
      "quizStatus": "ready",
      "sourceType": "imported",
      "uiArea": [
        "general-product-ui"
      ],
      "originalMeaningEn": "A short tip or hint associated with a tool or control.",
      "originalMeaningZh": "与某个工具或控件关联的简短提示或说明。",
      "productMeaningEn": "A small contextual label or help message that appears when a user hovers over or focuses a specific interface element.",
      "productMeaningZh": "工具提示；用户悬停或聚焦某个界面元素时出现的简短说明。",
      "whyProductsUseItEn": "It provides a tip about the purpose or meaning of a tool or control without occupying permanent interface space.",
      "whyProductsUseItZh": "它解释工具或控件的用途，同时不长期占据界面空间。",
      "commonInterfaces": [
        "Icon-only buttons, truncated labels, unfamiliar controls, and concise contextual help."
      ],
      "realInterfaceExamples": [
        {
          "surface": "product interface",
          "exampleEn": "Hover over the icon to see its tooltip.",
          "exampleZh": "把鼠标移到图标上即可看到工具提示。"
        }
      ],
      "relatedTerms": [
        "ui-popover"
      ],
      "confusedWith": [
        {
          "term": "Popover",
          "differenceEn": "Tooltip is brief contextual help and usually non-interactive; Popover can contain richer interactive content.",
          "differenceZh": "Tooltip 是简短且通常不可交互的上下文帮助；Popover 可以承载更丰富的交互内容。"
        }
      ],
      "interfaceTargets": [
        {
          "page": "product-interface",
          "area": "general-product-ui",
          "label": "Tooltip"
        }
      ],
      "usageBoundaryEn": "Providing brief, non-interactive contextual help tied to one specific element. For interactive content, multiple actions, or a form inside the overlay; use a popover or dialog instead.",
      "usageBoundaryZh": "用于给某个具体界面元素提供简短、非交互式的上下文帮助。 如果浮层内包含可交互内容、多项操作或表单，应使用 Popover 或 Dialog，而不是 Tooltip。",
      "sourceName": "Adobe Spectrum — Tooltip",
      "sourceUrl": "https://spectrum.adobe.com/page/tooltip/",
      "auditedAt": "2026-08-07",
      "editorialSourceType": "official-documentation"
    },
    {
      "id": "ui-toast",
      "term": "toast",
      "displayTerm": "TOAST",
      "speechText": "toast",
      "pronunciation": "/toʊst/",
      "category": "UI Vocabulary",
      "radarType": "interface",
      "platforms": [
        "product interface"
      ],
      "tone": [
        "Technical",
        "Neutral"
      ],
      "status": "Common",
      "formality": "Neutral",
      "meaningEn": "A brief, temporary notification that appears without taking over the user's current task.",
      "meaningZh": "轻量临时通知；短暂出现来确认结果或提示状态，不打断当前操作。",
      "exampleEn": "A toast confirms that the changes were saved.",
      "exampleZh": "一个轻提示通知你更改已经保存。",
      "useWhen": "Showing a brief confirmation or low-priority notification that should not block the user's workflow.",
      "useWhenZh": "用于展示不应阻断当前流程的简短确认或低优先级通知。",
      "avoidWhen": "For information that requires an immediate decision, detailed interaction, or strong interruption; use a dialog or higher-priority alert pattern.",
      "avoidWhenZh": "如果信息要求立即决策、详细交互或强制打断，应使用 Dialog 或更高优先级的 Alert pattern。",
      "chineseFeeling": "操作后短暂冒出来的轻提示，比如“Saved”或“Uploaded”。",
      "contentStatus": "active",
      "quizStatus": "ready",
      "sourceType": "imported",
      "uiArea": [
        "general-product-ui"
      ],
      "originalMeaningEn": "A slice of bread browned by heat; the UI term is now a conventional component name rather than a literal visual metaphor.",
      "originalMeaningZh": "经加热烤成褐色的一片面包；在 UI 中 Toast 已成为约定俗成的组件名称，不宜按字面理解。",
      "productMeaningEn": "A brief, temporary notification that appears without taking over the user's current task.",
      "productMeaningZh": "轻量临时通知；短暂出现来确认结果或提示状态，不打断当前操作。",
      "whyProductsUseItEn": "Toast is an established UI component term for a small transient message that surfaces briefly and then disappears or can be dismissed.",
      "whyProductsUseItZh": "Toast 已成为 UI 中短暂出现、随后消失或可关闭的小型消息组件的固定名称。",
      "commonInterfaces": [
        "Save confirmations, upload completion, lightweight success/error feedback, and low-priority status messages."
      ],
      "realInterfaceExamples": [
        {
          "surface": "product interface",
          "exampleEn": "A toast confirms that the changes were saved.",
          "exampleZh": "一个轻提示通知你更改已经保存。"
        }
      ],
      "relatedTerms": [
        "ui-modal"
      ],
      "confusedWith": [
        {
          "term": "Dialog",
          "differenceEn": "A toast is transient and non-blocking; a dialog is appropriate when the user must make or confirm a decision.",
          "differenceZh": "Toast 是短暂且非阻断的；当用户必须作出或确认决策时，更适合使用 Dialog。"
        }
      ],
      "interfaceTargets": [
        {
          "page": "product-interface",
          "area": "general-product-ui",
          "label": "Toast"
        }
      ],
      "usageBoundaryEn": "Showing a brief confirmation or low-priority notification that should not block the user's workflow. For information that requires an immediate decision, detailed interaction, or strong interruption; use a dialog or higher-priority alert pattern.",
      "usageBoundaryZh": "用于展示不应阻断当前流程的简短确认或低优先级通知。 如果信息要求立即决策、详细交互或强制打断，应使用 Dialog 或更高优先级的 Alert pattern。",
      "sourceName": "Adobe Spectrum — Toast",
      "sourceUrl": "https://spectrum.adobe.com/page/toast/",
      "auditedAt": "2026-08-07",
      "editorialSourceType": "official-documentation"
    }
  ]
};
