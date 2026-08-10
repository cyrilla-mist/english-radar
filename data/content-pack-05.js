window.ENGLISH_RADAR_CONTENT_PACK_05 = {
  app: 'English Radar Content Pack',
  schemaVersion: 1,
  pack: {
    id: 'english-radar-content-pack-05',
    name: 'Product Naming',
    description: '10 Signals for understanding why products name destinations, collections, states, and information spaces the way they do.',
    version: '1.0.0',
    source: 'english-radar-product-naming-audit',
    sourceLabel: 'English Radar audited product naming',
    preparedAt: '2026-08-10',
    auditStatus: 'complete',
    auditCompletedAt: '2026-08-10',
    sourcePolicy: 'Official product documentation and design-system terminology; generalized examples where a brand-specific label was not independently verified.',
    editorialAudit: { signalCount: 10, quizCount: 20, reviewed: true }
  },
  signals: [
    {
      id: 'pn-explore', term: 'explore', displayTerm: 'EXPLORE', speechText: 'explore', pronunciation: '/ɪkˈsplɔːr/', category: 'Product Naming',
      platforms: ['content platforms', 'creative tools', 'productivity apps'], tone: ['Curious', 'Open-ended', 'Neutral'], status: 'Common', formality: 'Neutral',
      meaningEn: 'To travel through or examine something in order to learn about it.', meaningZh: '探索、浏览并了解原本不熟悉的内容。',
      originalMeaningEn: 'To travel through an unfamiliar place or examine it carefully.', originalMeaningZh: '原本指到陌生地方考察、探索。',
      productMeaningEn: 'A destination for browsing content or possibilities before the user has a specific item in mind.', productMeaningZh: '产品中用于主动浏览未知内容或可能性的入口；用户通常还没有明确目标。',
      whyProductsUseItEn: 'Explore frames discovery as an active journey and invites browsing without requiring a precise query.', whyProductsUseItZh: '它把浏览说成主动探索，鼓励用户先看看有什么，而不是要求用户先想好关键词。',
      commonInterfaces: ['content platform', 'marketplace', 'creative tool'],
      realInterfaceExamples: [{ surface: 'content platform', exampleEn: 'Explore topics, collections, and recommendations.', exampleZh: '探索主题、合集和推荐内容。' }],
      exampleEn: 'Open Explore when you want ideas but do not know the exact title.', exampleZh: '还没有明确标题、只是想找灵感时，可以打开 Explore。',
      useWhen: 'Use it when users can browse categories, recommendations, or unfamiliar possibilities.', useWhenZh: '用于分类、推荐或未知内容的主动浏览。',
      avoidWhen: 'Do not use it as a synonym for exact keyword lookup; Search is clearer when the target is already known.', avoidWhenZh: '目标已经明确时不要把精确查找笼统叫 Explore；这时 Search 更准确。',
      relatedTerms: ['pn-discover', 'pn-library'],
      confusedWith: [
        { term: 'Discover', differenceEn: 'Explore emphasizes the user browsing possibilities; Discover emphasizes the system helping the user encounter something new.', differenceZh: 'Explore 更强调用户主动浏览可能性；Discover 更强调系统帮助用户遇见新内容。' },
        { term: 'Search', differenceEn: 'Search starts with a known target or query; Explore starts with curiosity and an open field.', differenceZh: 'Search 通常从已知目标或关键词开始；Explore 从好奇和开放浏览开始。' }
      ],
      culturalContextEn: 'The metaphor of exploration makes an unfamiliar catalog feel navigable rather than empty.', culturalContextZh: '“探索”的隐喻让陌生内容目录显得可以慢慢发现，而不是一个空白页面。',
      sourceName: 'Apple Human Interface Guidelines — Search fields', sourceUrl: 'https://developer.apple.com/design/human-interface-guidelines/search-fields', editorialSourceType: 'official-design-guidance', auditedAt: '2026-08-10'
    },
    {
      id: 'pn-discover', term: 'discover', displayTerm: 'DISCOVER', speechText: 'discover', pronunciation: '/dɪˈskʌvər/', category: 'Product Naming',
      platforms: ['content platforms', 'search products', 'recommendation systems'], tone: ['Curious', 'Inviting', 'Neutral'], formality: 'Neutral', status: 'Common',
      meaningEn: 'To find something that was not previously known or noticed.', meaningZh: '发现原本不知道或没有注意到的内容。',
      originalMeaningEn: 'To find, learn, or become aware of something for the first time.', originalMeaningZh: '原本指第一次找到、了解到或意识到某事。',
      productMeaningEn: 'A product destination where the system or catalog helps users encounter relevant content they did not explicitly request.', productMeaningZh: '产品中帮助用户遇见此前没有明确寻找的相关内容的入口。',
      whyProductsUseItEn: 'Discover promises useful surprise and suggests that the product will surface possibilities, not merely wait for instructions.', whyProductsUseItZh: '它承诺“发现惊喜”，暗示产品会主动呈现可能有用的内容，而不是只等待用户下指令。',
      commonInterfaces: ['recommendation feed', 'media app', 'product catalog'],
      realInterfaceExamples: [{ surface: 'recommendation surface', exampleEn: 'Discover something new based on your interests.', exampleZh: '根据你的兴趣发现新内容。' }],
      exampleEn: 'Discover can show a reader an author they never searched for.', exampleZh: 'Discover 可以把读者从未主动搜索过的作者呈现出来。',
      useWhen: 'Use it when the product curates or recommends unfamiliar items for the user.', useWhenZh: '用于产品根据兴趣、行为或目录主动推荐未知内容。',
      avoidWhen: 'Avoid implying that Discover is only a manual browsing directory; that is closer to Explore.', avoidWhenZh: '不要把 Discover 只理解成手动浏览目录；那更接近 Explore。',
      relatedTerms: ['pn-explore', 'pn-saved'],
      confusedWith: [
        { term: 'Explore', differenceEn: 'Discover foregrounds what the system helps reveal; Explore foregrounds the user’s open-ended browsing.', differenceZh: 'Discover 突出系统帮助呈现什么；Explore 突出用户如何开放浏览。' },
        { term: 'Search', differenceEn: 'Search retrieves a known target; Discover introduces items the user may not have named.', differenceZh: 'Search 找已知目标；Discover 引入用户可能没有说出名称的内容。' }
      ],
      culturalContextEn: 'Discover borrows the feeling of finding something valuable by chance, while still implying product curation.', culturalContextZh: 'Discover 借用了“偶然发现有价值事物”的感觉，同时暗示产品在背后进行筛选。',
      sourceName: 'Google Search Central — Discover', sourceUrl: 'https://developers.google.com/search/docs/appearance/google-discover', editorialSourceType: 'official-documentation', auditedAt: '2026-08-10'
    },
    {
      id: 'pn-draft', term: 'draft', displayTerm: 'DRAFT', speechText: 'draft', pronunciation: '/dræft/', category: 'Product Naming',
      platforms: ['writing tools', 'design tools', 'email apps', 'project tools'], tone: ['Neutral', 'Process-oriented'], formality: 'Neutral', status: 'Common',
      meaningEn: 'A preliminary version that is not yet final or published.', meaningZh: '尚未定稿、发布或完成的草稿版本。',
      originalMeaningEn: 'A preliminary written version; historically, a drawing or plan prepared before completion.', originalMeaningZh: '原本指未定稿的文字版本，也可指完成前的草图或方案。',
      productMeaningEn: 'An editable item whose work can continue and whose final visibility or status has not been reached.', productMeaningZh: '产品中仍可编辑、尚未完成最终发布或提交状态的内容。',
      whyProductsUseItEn: 'Draft signals reversibility and ongoing work without labeling the current version as bad or broken.', whyProductsUseItZh: 'Draft 表示可继续修改和回退的工作状态，不等于内容质量差或出了问题。',
      commonInterfaces: ['design tool', 'document editor', 'email app'],
      realInterfaceExamples: [{ surface: 'file browser', exampleEn: 'Move the draft to a project when it is ready to share.', exampleZh: '准备好分享后，把 draft 移到 project。' }],
      exampleEn: 'The article is still a draft, so readers cannot see the final version.', exampleZh: '这篇文章仍是 draft，所以读者看不到最终版本。',
      useWhen: 'Use it for unfinished but intentionally retained work that remains editable.', useWhenZh: '用于尚未完成但有意保留、且仍可编辑的内容。',
      avoidWhen: 'Do not use it to mean a defective or low-quality version; a draft may already be strong.', avoidWhenZh: '不要把它理解成有缺陷或质量低的版本；draft 也可能内容很好。',
      relatedTerms: ['pn-saved', 'pn-history'],
      confusedWith: [
        { term: 'Published', differenceEn: 'A draft remains in progress; Published indicates the content has been made available in its intended final channel.', differenceZh: 'Draft 仍在进行中；Published 表示内容已经进入预期的公开或可用渠道。' },
        { term: 'History', differenceEn: 'History records past versions or events; Draft describes the current unfinished state.', differenceZh: 'History 记录过去的版本或事件；Draft 描述当前尚未完成的状态。' }
      ],
      sourceName: 'Figma Help — Guide to files and projects', sourceUrl: 'https://help.figma.com/hc/en-us/articles/1500005554982-Guide-to-files-and-projects', editorialSourceType: 'official-documentation', auditedAt: '2026-08-10'
    },
    {
      id: 'pn-collection', term: 'collection', displayTerm: 'COLLECTION', speechText: 'collection', pronunciation: '/kəˈlekʃən/', category: 'Product Naming',
      platforms: ['content platforms', 'research tools', 'developer tools', 'media apps'], tone: ['Organized', 'Curated', 'Neutral'], formality: 'Neutral', status: 'Common',
      meaningEn: 'A group of related items gathered together.', meaningZh: '聚合在一起的一组相关内容或对象。',
      originalMeaningEn: 'The act of gathering, or a group of things gathered together.', originalMeaningZh: '原本指收集行为，也指被收集在一起的一组事物。',
      productMeaningEn: 'A named group of related items assembled for browsing, sharing, curation, or a particular purpose.', productMeaningZh: '产品中按主题、用途或选择聚合的一组相关内容，通常可浏览或分享。',
      whyProductsUseItEn: 'Collection is flexible: it groups items without forcing a strict folder hierarchy or a fixed playback order.', whyProductsUseItZh: 'Collection 足够灵活，可以聚合内容，但不强迫用户接受严格文件夹层级或固定播放顺序。',
      commonInterfaces: ['media app', 'research tool', 'developer platform'],
      realInterfaceExamples: [{ surface: 'content catalog', exampleEn: 'Add related resources to a collection.', exampleZh: '把相关资源加入 collection。' }],
      exampleEn: 'The editor made a collection of references for the campaign.', exampleZh: '编辑为这次活动整理了一个 reference collection。',
      useWhen: 'Use it for a curated or user-created group of related items.', useWhenZh: '用于经过选择或由用户创建的一组相关内容。',
      avoidWhen: 'Do not imply that every collection is a physical folder or has one required hierarchy.', avoidWhenZh: '不要假定所有 collection 都是实体文件夹或必须遵循固定层级。',
      relatedTerms: ['pn-library', 'pn-saved', 'pn-spaces'],
      confusedWith: [
        { term: 'Library', differenceEn: 'A Library suggests a durable resource area for browsing and reuse; a Collection is a selected group assembled around a topic or purpose.', differenceZh: 'Library 更像长期可访问、可浏览复用的资源区；Collection 更像围绕主题或用途挑选出来的一组内容。' },
        { term: 'Folder', differenceEn: 'A Folder usually implies hierarchy and storage organization; a Collection can be flatter, curated, or cross-cutting.', differenceZh: 'Folder 通常暗示层级和存储组织；Collection 可以更扁平、更偏策展，也可以跨越原有层级。' }
      ],
      sourceName: 'Hugging Face Hub — Collections', sourceUrl: 'https://huggingface.co/docs/hub/en/collections', editorialSourceType: 'official-documentation', auditedAt: '2026-08-10'
    },
    {
      id: 'pn-library', term: 'library', displayTerm: 'LIBRARY', speechText: 'library', pronunciation: '/ˈlaɪbreri/', category: 'Product Naming',
      platforms: ['creative tools', 'media apps', 'developer tools', 'knowledge products'], tone: ['Organized', 'Reference-oriented', 'Neutral'], formality: 'Neutral', status: 'Common',
      meaningEn: 'A collection of resources or materials organized for access and use.', meaningZh: '为访问和使用而组织起来的资源或材料集合。',
      originalMeaningEn: 'A place or collection where books and other resources are kept for reading or reference.', originalMeaningZh: '原本指保存书籍和资料、供阅读或参考的场所或集合。',
      productMeaningEn: 'A durable resource area where users expect to browse, reuse, manage, or reference accumulated items.', productMeaningZh: '产品中长期可访问的资源集合；用户通常预期可以浏览、复用、管理或查阅其中内容。',
      whyProductsUseItEn: 'Library borrows the idea of organized public resources and makes stored content feel reusable rather than merely archived.', whyProductsUseItZh: 'Library 借用了“有组织的公共资源”的概念，让内容显得可以反复查阅和复用，而不只是被存放起来。',
      commonInterfaces: ['creative tool', 'media app', 'developer platform'],
      realInterfaceExamples: [{ surface: 'creative asset area', exampleEn: 'Browse your library of reusable assets.', exampleZh: '浏览可重复使用的资源库。' }],
      exampleEn: 'The team keeps approved templates in the Library for reuse.', exampleZh: '团队把已批准的模板放在 Library 中反复使用。',
      useWhen: 'Use it for a lasting resource collection designed for browsing and reuse.', useWhenZh: '用于长期保留、可浏览并可复用的资源集合。',
      avoidWhen: 'Do not use it for a short-lived processing queue or a single temporary draft.', avoidWhenZh: '短期处理队列或单个临时草稿不适合叫 Library。',
      relatedTerms: ['pn-collection', 'pn-saved', 'pn-history'],
      confusedWith: [
        { term: 'Collection', differenceEn: 'A Library is usually a durable resource area; a Collection is a selected group that may be narrower or more temporary.', differenceZh: 'Library 通常是长期资源区；Collection 可以是更窄或更临时的一组精选内容。' },
        { term: 'Archive', differenceEn: 'An Archive emphasizes keeping inactive material; a Library emphasizes access, browsing, and reuse.', differenceZh: 'Archive 强调保留已不活跃的内容；Library 强调访问、浏览和复用。' }
      ],
      sourceName: 'Figma Help — Enable access to libraries in your drafts', sourceUrl: 'https://help.figma.com/hc/en-us/articles/360038743434-Enable-access-to-libraries-in-your-drafts', editorialSourceType: 'official-documentation', auditedAt: '2026-08-10'
    },
    {
      id: 'pn-queue', term: 'queue', displayTerm: 'QUEUE', speechText: 'queue', pronunciation: '/kjuː/', category: 'Product Naming',
      platforms: ['upload tools', 'review systems', 'media apps', 'developer tools'], tone: ['Process-oriented', 'Neutral'], formality: 'Neutral', status: 'Common',
      meaningEn: 'A line or ordered group waiting for service or processing.', meaningZh: '等待处理、服务或按顺序执行的一列内容。',
      originalMeaningEn: 'A line of people or things waiting their turn.', originalMeaningZh: '原本指排队等待轮到自己的队列。',
      productMeaningEn: 'An ordered set of pending items that will be processed, reviewed, uploaded, or played in sequence.', productMeaningZh: '产品中等待处理、审核、上传或播放的一组有顺序内容。',
      whyProductsUseItEn: 'Queue tells users that order and waiting are part of the model, not accidental delay or an unorganized inbox.', whyProductsUseItZh: 'Queue 明确告诉用户：等待顺序本身就是系统结构的一部分，不是偶然延迟或杂乱收件箱。',
      commonInterfaces: ['media app', 'upload service', 'job processing tool'],
      realInterfaceExamples: [{ surface: 'upload workflow', exampleEn: 'Three files are waiting in the upload queue.', exampleZh: '有三个文件正在上传队列中等待。' }],
      exampleEn: 'The next item in the review queue will be assigned automatically.', exampleZh: 'Review queue 中的下一个项目会被自动分配。',
      useWhen: 'Use it when pending items have an order or will be processed in turn.', useWhenZh: '用于待处理项目具有顺序、会依次执行的场景。',
      avoidWhen: 'Do not use it for unordered saved items or one-off notifications.', avoidWhenZh: '无顺序的保存内容或一次性通知不应叫 Queue。',
      relatedTerms: ['pn-saved', 'pn-history'],
      confusedWith: [
        { term: 'Inbox', differenceEn: 'An Inbox is a holding area for incoming items; a Queue emphasizes order and pending processing.', differenceZh: 'Inbox 是新进入内容的暂存区；Queue 强调顺序和等待处理。' },
        { term: 'Notifications', differenceEn: 'Notifications attract attention; a Queue describes work or content waiting in a sequence.', differenceZh: 'Notifications 用来吸引注意；Queue 描述按顺序等待处理的工作或内容。' }
      ],
      sourceName: 'Apple Human Interface Guidelines — Search fields', sourceUrl: 'https://developer.apple.com/design/human-interface-guidelines/search-fields', editorialSourceType: 'official-design-guidance', auditedAt: '2026-08-10'
    },
    {
      id: 'pn-hub', term: 'hub', displayTerm: 'HUB', speechText: 'hub', pronunciation: '/hʌb/', category: 'Product Naming',
      platforms: ['developer tools', 'enterprise products', 'content platforms'], tone: ['Centralizing', 'Neutral'], formality: 'Neutral', status: 'Common',
      meaningEn: 'A central place that connects routes, activities, or resources.', meaningZh: '连接多个路径、活动或资源的中心节点。',
      originalMeaningEn: 'The central part of a wheel or a place where routes meet.', originalMeaningZh: '原本指车轮中心，也可指交通路线汇聚的地方。',
      productMeaningEn: 'A central destination that connects several resources, workflows, or functions without necessarily containing all of them.', productMeaningZh: '产品中连接多个资源、流程或功能的中心入口；它不一定把所有内容都直接存放在里面。',
      whyProductsUseItEn: 'Hub uses a transport metaphor to promise connection and orientation rather than one narrow task.', whyProductsUseItZh: 'Hub 借用了交通枢纽的隐喻，强调连接和导航，而不是单一具体任务。',
      commonInterfaces: ['developer platform', 'enterprise product', 'content platform'],
      realInterfaceExamples: [{ surface: 'developer platform', exampleEn: 'The project hub links docs, deployments, and activity.', exampleZh: '项目 hub 连接文档、部署和活动记录。' }],
      exampleEn: 'Use the team hub to reach the tools and resources for this workspace.', exampleZh: '通过 team hub 进入这个工作环境所需的工具和资源。',
      useWhen: 'Use it for a central connection point across multiple resources or functions.', useWhenZh: '用于连接多个资源或功能的中心入口。',
      avoidWhen: 'Do not assume Hub means a full workspace, dashboard, or home page in every product.', avoidWhenZh: '不要假定 Hub 在所有产品中都等于完整 Workspace、Dashboard 或 Home。',
      relatedTerms: ['pn-spaces', 'pn-library'],
      confusedWith: [
        { term: 'Workspace', differenceEn: 'A Workspace usually denotes the environment where work happens; a Hub mainly connects people to places, tools, or resources.', differenceZh: 'Workspace 通常表示工作发生的环境；Hub 主要负责把人连接到不同空间、工具或资源。' },
        { term: 'Dashboard', differenceEn: 'A Dashboard foregrounds status, metrics, or controls; a Hub foregrounds navigation and connection.', differenceZh: 'Dashboard 突出状态、指标或控制；Hub 突出导航和连接。' }
      ],
      sourceName: 'Hugging Face Hub — Collections', sourceUrl: 'https://huggingface.co/docs/hub/en/collections', editorialSourceType: 'official-documentation', auditedAt: '2026-08-10'
    },
    {
      id: 'pn-spaces', term: 'spaces', displayTerm: 'SPACES', speechText: 'spaces', pronunciation: '/ˈspeɪsɪz/', category: 'Product Naming',
      platforms: ['collaboration tools', 'creative tools', 'developer platforms'], tone: ['Flexible', 'Contextual', 'Neutral'], formality: 'Neutral', status: 'Product-specific',
      meaningEn: 'Separate areas or environments associated with particular activities or groups.', meaningZh: '围绕不同活动、团队或语境划分的相对独立区域。',
      originalMeaningEn: 'Areas or dimensions available for people or things to occupy.', originalMeaningZh: '原本指可供人或物占据的空间或范围。',
      productMeaningEn: 'Multiple relatively independent contexts inside one product, each with its own content, people, tools, or purpose.', productMeaningZh: '同一产品内多个相对独立的上下文区域，各自拥有内容、成员、工具或用途。',
      whyProductsUseItEn: 'Spaces sounds lighter and more flexible than Workspace, allowing a product to describe parallel contexts without defining one universal hierarchy.', whyProductsUseItZh: 'Spaces 比 Workspace 更轻、更灵活，可以描述并行上下文，而不必规定一套统一层级。',
      commonInterfaces: ['collaboration tool', 'community platform', 'developer platform'],
      realInterfaceExamples: [{ surface: 'collaboration product', exampleEn: 'Create separate spaces for research and delivery.', exampleZh: '为研究和交付创建不同的 spaces。' }],
      exampleEn: 'The team uses separate spaces for public discussion and private planning.', exampleZh: '团队用不同的 spaces 区分公开讨论和私人计划。',
      useWhen: 'Use it when a product contains several distinct contexts that belong to one broader system.', useWhenZh: '用于一个大系统内存在多个相对独立语境的场景。',
      avoidWhen: 'Do not treat Spaces as a universal technical standard; the boundaries vary by product.', avoidWhenZh: '不要把 Spaces 当作统一技术标准；不同产品对它的边界差异很大。',
      relatedTerms: ['pn-hub', 'pn-collection'],
      confusedWith: [
        { term: 'Workspace', differenceEn: 'Workspace often names the environment where work is organized; Spaces may name several parallel contexts inside or around that environment.', differenceZh: 'Workspace 常命名组织工作的环境；Spaces 可以命名其中或周围多个并行上下文。' },
        { term: 'Project', differenceEn: 'A Project usually has a bounded outcome; a Space can persist as a context for many projects or activities.', differenceZh: 'Project 通常有明确目标和边界；Space 可以作为多个项目或活动长期共用的上下文。' }
      ],
      culturalContextEn: 'Space is a deliberately broad metaphor: it makes product structure feel inhabitable without promising a fixed folder hierarchy.', culturalContextZh: 'Space 是一种有意保持宽泛的隐喻，让产品结构像可进入的环境，但不承诺固定文件夹层级。',
      sourceName: 'Hugging Face Hub — Collections', sourceUrl: 'https://huggingface.co/docs/hub/en/collections', editorialSourceType: 'official-documentation', auditedAt: '2026-08-10'
    },
    {
      id: 'pn-history', term: 'history', displayTerm: 'HISTORY', speechText: 'history', pronunciation: '/ˈhɪstəri/', category: 'Product Naming',
      platforms: ['creative tools', 'developer tools', 'account products', 'media apps'], tone: ['Record-oriented', 'Neutral'], formality: 'Neutral', status: 'Common',
      meaningEn: 'A record of past events, actions, or states.', meaningZh: '过去发生过的事件、操作或状态记录。',
      originalMeaningEn: 'A record or account of events that happened in the past.', originalMeaningZh: '原本指对过去事件的记录或叙述。',
      productMeaningEn: 'A chronological record that helps users review what happened, changed, or was accessed earlier.', productMeaningZh: '产品中按时间记录过去发生了什么、改变了什么或访问过什么的区域。',
      whyProductsUseItEn: 'History sets a temporal expectation: users look backward through events or versions instead of searching for an active destination.', whyProductsUseItZh: 'History 建立了时间维度预期：用户是在回看事件或版本，而不是寻找一个当前活动空间。',
      commonInterfaces: ['versioned tool', 'account product', 'media app'],
      realInterfaceExamples: [{ surface: 'versioned editor', exampleEn: 'Review the file history before restoring an earlier version.', exampleZh: '恢复早期版本前，先查看文件 history。' }],
      exampleEn: 'The activity history shows when the setting changed.', exampleZh: 'Activity history 会显示设置何时发生变化。',
      useWhen: 'Use it for chronological records of past actions, versions, or events.', useWhenZh: '用于过去操作、版本或事件的时间顺序记录。',
      avoidWhen: 'Do not use it for inactive storage alone; Archive is about retention, while History is about what happened over time.', avoidWhenZh: '不要把所有不活跃存储都叫 History；Archive 强调保留，History 强调时间上的发生过程。',
      relatedTerms: ['pn-saved', 'pn-library'],
      confusedWith: [
        { term: 'Activity', differenceEn: 'Activity often summarizes actions or events as a current stream; History looks backward across a chronological record.', differenceZh: 'Activity 常把动作或事件作为当前动态呈现；History 回看一段时间内的记录。' },
        { term: 'Archive', differenceEn: 'Archive stores inactive material; History records past events or states, whether or not they remain active.', differenceZh: 'Archive 保存不活跃内容；History 记录过去事件或状态，不等于存档。' }
      ],
      sourceName: 'Figma Help — Guide to files and projects', sourceUrl: 'https://help.figma.com/hc/en-us/articles/1500005554982-Guide-to-files-and-projects', editorialSourceType: 'official-documentation', auditedAt: '2026-08-10'
    },
    {
      id: 'pn-saved', term: 'saved', displayTerm: 'SAVED', speechText: 'saved', pronunciation: '/seɪvd/', category: 'Product Naming',
      platforms: ['content platforms', 'media apps', 'shopping tools', 'research tools'], tone: ['Personal', 'Practical', 'Neutral'], formality: 'Neutral', status: 'Common',
      meaningEn: 'Kept for future use rather than discarded or forgotten.', meaningZh: '被保留下来、以后还要使用或回看的内容。',
      originalMeaningEn: 'Kept safe, rescued, or stored for later use.', originalMeaningZh: '原本指被保存、保护下来，留待以后使用。',
      productMeaningEn: 'A user-oriented collection of items intentionally marked for later return, without necessarily expressing a public rating or permanent archive.', productMeaningZh: '用户主动标记、准备以后回来查看的一组内容；不一定表示点赞、收藏评级或永久归档。',
      whyProductsUseItEn: 'Saved describes the user’s intention in plain language and avoids claiming that every retained item is a favorite.', whyProductsUseItZh: 'Saved 直接描述用户的意图，不会把所有保留内容都解释成喜欢或高评价。',
      commonInterfaces: ['content platform', 'shopping tool', 'research app'],
      realInterfaceExamples: [{ surface: 'content platform', exampleEn: 'Find articles you saved for later.', exampleZh: '查看你保存下来以后阅读的文章。' }],
      exampleEn: 'The Saved area contains recipes the user plans to revisit.', exampleZh: 'Saved 区域里是用户准备以后再看的食谱。',
      useWhen: 'Use it for items a user deliberately keeps for later access or return.', useWhenZh: '用于用户主动保留、准备以后访问或回看的内容。',
      avoidWhen: 'Do not equate Saved with liked, favorited, archived, or permanently stored unless the product defines that behavior.', avoidWhenZh: '除非产品明确如此定义，不要把 Saved 等同于 liked、Favorites、Archive 或永久存储。',
      relatedTerms: ['pn-collection', 'pn-library', 'pn-history'],
      confusedWith: [
        { term: 'Favorites', differenceEn: 'Favorites often signals preference or affection; Saved primarily signals an intention to return later.', differenceZh: 'Favorites 常表达偏好或喜欢；Saved 主要表达以后还会回来查看。' },
        { term: 'Archive', differenceEn: 'Archive usually removes something from an active area while keeping it; Saved keeps a user-selected shortcut or return intention.', differenceZh: 'Archive 通常把内容移出活动区域但保留；Saved 强调用户主动留下以后返回的入口。' }
      ],
      sourceName: 'Apple Human Interface Guidelines — Search fields', sourceUrl: 'https://developer.apple.com/design/human-interface-guidelines/search-fields', editorialSourceType: 'official-design-guidance', auditedAt: '2026-08-10'
    }
  ]
};
if (window.EnglishRadarBundledPackRegistry) window.EnglishRadarBundledPackRegistry.registerPack(window.ENGLISH_RADAR_CONTENT_PACK_05);
