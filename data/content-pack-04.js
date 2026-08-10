window.ENGLISH_RADAR_CONTENT_PACK_04 = {
  "app": "English Radar Content Pack",
  "schemaVersion": 1,
  "pack": {
    "id": "english-radar-content-pack-04",
    "name": "Community Discourse",
    "description": "10 audited Signals for reading tone, roles, pile-ons, platform context, and internet-native discussion patterns.",
    "version": "1.0.0",
    "source": "english-radar-community-discourse-audit",
    "sourceLabel": "English Radar audited community discourse",
    "preparedAt": "2026-08-10",
    "auditStatus": "complete",
    "auditCompletedAt": "2026-08-10",
    "sourcePolicy": "A reliable dictionary, platform help center, or authoritative language reference for every Signal.",
    "editorialAudit": {
      "status": "complete",
      "completedAt": "2026-08-10",
      "signalCount": 10,
      "quizCount": 20,
      "sourceCoverage": "10/10 platform or authoritative language references",
      "notionAuditPages": [
        "Content Pack 04｜Community Discourse｜Signal Audit",
        "Content Pack 04｜Relation & Quiz Audit"
      ]
    }
  },
  "signals": [
    {
      "id": "cd-op", "term": "OP", "displayTerm": "OP", "speechText": "O P", "pronunciation": "/ˌoʊ ˈpiː/", "category": "Community Discourse",
      "platforms": ["Reddit", "Forums", "Comment sections"], "tone": ["Neutral", "Community-specific"], "status": "Established", "formality": "Very informal",
      "meaningEn": "The person who originally created a post or discussion.", "meaningZh": "发帖人；最初创建这条帖子或讨论的人。",
      "exampleEn": "OP, could you add the steps that fixed the issue?", "exampleZh": "楼主，你能补充一下解决问题的步骤吗？",
      "useWhen": "Use it when the audience already understands community shorthand and you are referring to the original poster.", "avoidWhen": "Avoid it in formal writing or when the audience may not know the abbreviation; say original poster instead.",
      "chineseFeeling": "不是泛指“发言的人”，而是这条帖子最初的作者。",
      "originalMeaningEn": "An abbreviation of original poster.", "originalMeaningZh": "original poster 的缩写，指最初发布内容的人。",
      "culturalContextEn": "Discussion platforms need a short way to distinguish the person who started a post from later commenters.", "culturalContextZh": "社区讨论中需要快速区分发帖人和后续评论者，因此形成了这种角色缩写。",
      "relatedTerms": ["cd-thread", "cd-lurker"],
      "confusedWith": [{"term": "author", "differenceEn": "Author is broader; OP specifically identifies the creator of a particular online post.", "differenceZh": "author 范围更广；OP 特指某条网络帖子的最初发布者。"}],
      "sourceName": "Reddit Help", "sourceUrl": "https://support.reddithelp.com/hc/en-us/articles/205313845-What-do-these-expressions-mean", "editorialSourceType": "platform glossary", "auditedAt": "2026-08-10"
    },
    {
      "id": "cd-thread", "term": "thread", "displayTerm": "THREAD", "speechText": "thread", "pronunciation": "/θred/", "category": "Community Discourse",
      "platforms": ["Reddit", "X", "Forums", "Discord"], "tone": ["Neutral", "Community-specific"], "status": "Established", "formality": "Informal",
      "meaningEn": "A connected sequence of posts or replies organized around one discussion.", "meaningZh": "围绕同一话题串联起来的一组帖子或回复。",
      "exampleEn": "The answer is buried somewhere in the thread.", "exampleZh": "答案就在这个讨论串的某条回复里。",
      "useWhen": "Use it for a connected online discussion rather than one isolated message.", "avoidWhen": "Do not assume every platform uses thread for exactly the same interface object; check the local platform context.",
      "chineseFeeling": "重点是“连成一串的讨论”，不是普通的一条消息。",
      "originalMeaningEn": "A thread is originally a long, thin strand; online it became a metaphor for connected contributions.", "originalMeaningZh": "thread 原本是细长的线；在网络语境中借来比喻连贯展开的讨论。",
      "culturalContextEn": "The metaphor makes a long exchange easier to visualize as one connected conversation instead of separate messages.", "culturalContextZh": "这个隐喻把多条回复理解成一条连续的线，帮助读者把分散消息看成一个整体。",
      "relatedTerms": ["cd-op", "cd-lurker"],
      "confusedWith": [{"term": "post", "differenceEn": "A post can stand alone; a thread emphasizes the connected discussion that grows around it.", "differenceZh": "post 可以独立存在；thread 更强调围绕内容展开的连续讨论。"}],
      "sourceName": "Reddit Help", "sourceUrl": "https://support.reddithelp.com/hc/en-us/articles/205313845-What-do-these-expressions-mean", "editorialSourceType": "platform glossary", "auditedAt": "2026-08-10"
    },
    {
      "id": "cd-lurker", "term": "lurk / lurker", "displayTerm": "LURK / LURKER", "speechText": "lurk, lurker", "pronunciation": "/lɜːrk/", "category": "Community Discourse",
      "platforms": ["Reddit", "Forums", "Discord"], "tone": ["Neutral", "Community-specific"], "status": "Established", "formality": "Very informal",
      "meaningEn": "To read or watch a community without posting or commenting; a lurker is someone who does this.", "meaningZh": "只看不发言地浏览社区；lurker 指这种潜水者。",
      "exampleEn": "I mostly lurk in this server, but this question made me reply.", "exampleZh": "我平时主要在这个服务器潜水，但这个问题让我回复了。",
      "useWhen": "Use it casually for quiet observation in an online community.", "avoidWhen": "Avoid using lurker as an accusation that someone is suspicious; it can be neutral self-description.",
      "chineseFeeling": "更接近“潜水、只看不说”，不一定带负面含义。",
      "originalMeaningEn": "To lurk originally means to stay hidden or wait out of sight.", "originalMeaningZh": "lurk 原本指躲藏、隐伏或在看不见的地方等待。",
      "culturalContextEn": "Online communities made silent participation visible as a recognizable role, even when the reader leaves no public contribution.", "culturalContextZh": "网络社区把“没有公开发言但持续阅读”变成一种可被识别的参与方式。",
      "relatedTerms": ["cd-thread", "cd-op"],
      "confusedWith": [{"term": "observer", "differenceEn": "Observer is general; lurker carries a specifically online, usually silent-community sense.", "differenceZh": "observer 是一般性的观察者；lurker 更明确地指网络社区中的沉默浏览者。"}],
      "sourceName": "Reddit Help", "sourceUrl": "https://support.reddithelp.com/hc/en-us/articles/205313845-What-do-these-expressions-mean", "editorialSourceType": "platform glossary", "auditedAt": "2026-08-10"
    },
    {
      "id": "cd-ratio", "term": "ratio", "displayTerm": "RATIO", "speechText": "ratio", "pronunciation": "/ˈreɪʃiˌoʊ/", "category": "Community Discourse",
      "platforms": ["X", "Social media", "Comments"], "tone": ["Critical", "Dismissive", "Sarcastic"], "status": "Community-specific", "formality": "Very informal",
      "meaningEn": "A social-media reaction in which replies or criticism overwhelm the original post, often signaling public disapproval.", "meaningZh": "社交媒体上回复或批评声势压过原帖，常暗示公众反对或嘲讽。",
      "exampleEn": "That take got ratioed within minutes.", "exampleZh": "那个观点几分钟内就被大量反对回复压过去了。",
      "useWhen": "Use it when discussing visible reaction patterns on social media, especially a post receiving disproportionate negative replies.", "avoidWhen": "Do not use it as a neutral synonym for disagreement; it can frame a public pile-on as a victory or humiliation.",
      "chineseFeeling": "不是数学里的“比率”，而是带有“被舆论压倒、被群嘲”的网络评价。",
      "originalMeaningEn": "A ratio is a mathematical comparison between quantities.", "originalMeaningZh": "ratio 原本是比较两个数量关系的数学术语。",
      "culturalContextEn": "On social media, visible reply-to-like or reply-to-share patterns became a shorthand for judging whether a post was publicly rejected.", "culturalContextZh": "社交媒体把回复、点赞和转发的可见比例变成了判断一条发言是否遭到公开反对的快捷信号。",
      "relatedTerms": ["cd-dogpile", "cd-hot-take"],
      "confusedWith": [{"term": "disagreement", "differenceEn": "Disagreement is any difference of opinion; a ratio implies a visible, often overwhelming public reaction.", "differenceZh": "disagreement 只是意见不同；ratio 强调公开且通常压倒性的回应声势。"}],
      "sourceName": "Dictionary.com", "sourceUrl": "https://www.dictionary.com/e/slang/l-ratio/", "editorialSourceType": "slang reference", "auditedAt": "2026-08-10"
    },
    {
      "id": "cd-dogpile", "term": "dogpile", "displayTerm": "DOGPILE", "speechText": "dogpile", "pronunciation": "/ˈdɔːɡpaɪl/", "category": "Community Discourse",
      "platforms": ["Comments", "Social media", "Forums"], "tone": ["Critical", "Hostile", "Community-specific"], "status": "Established", "formality": "Very informal",
      "meaningEn": "A situation where many people simultaneously criticize or attack one person or position online.", "meaningZh": "很多人同时围上来批评或攻击一个人或一种观点。",
      "exampleEn": "The thread turned into a dogpile after the screenshot spread.", "exampleZh": "截图传播后，这个讨论串变成了众人围攻。",
      "useWhen": "Use it to describe a group response that becomes concentrated on one target.", "avoidWhen": "Avoid using it for ordinary disagreement or a balanced discussion; the word implies crowd pressure and can be serious.",
      "chineseFeeling": "比“大家不同意”更重，带有多人围攻同一目标的感觉。",
      "originalMeaningEn": "A dogpile originally describes people or animals piling on top of one another.", "originalMeaningZh": "dogpile 原本指人或动物一层层扑到一起的堆叠。",
      "culturalContextEn": "The physical pile-on became a metaphor for many online participants converging on one target at once.", "culturalContextZh": "现实中的“扑成一堆”被借来形容网络上多人同时集中火力的行为。",
      "relatedTerms": ["cd-ratio", "cd-touch-grass"],
      "confusedWith": [{"term": "debate", "differenceEn": "A debate involves opposing positions; a dogpile emphasizes an uneven crowd targeting one person or side.", "differenceZh": "debate 是双方或多方观点交锋；dogpile 强调力量不对等的集中围攻。"}],
      "sourceName": "Merriam-Webster", "sourceUrl": "https://www.merriam-webster.com/dictionary/dogpile", "editorialSourceType": "dictionary reference", "auditedAt": "2026-08-10"
    },
    {
      "id": "cd-doomscroll", "term": "doomscroll", "displayTerm": "DOOMSCROLL", "speechText": "doomscroll", "pronunciation": "/ˈduːmˌskroʊl/", "category": "Community Discourse",
      "platforms": ["Social media", "News feeds", "Casual chat"], "tone": ["Cautionary", "Reflective", "Casual"], "status": "Common", "formality": "Informal",
      "meaningEn": "To keep scrolling through upsetting or negative news even though it makes you feel worse.", "meaningZh": "明知越看越焦虑，却不停刷负面新闻或糟糕信息。",
      "exampleEn": "I need to stop doomscrolling before bed.", "exampleZh": "我得在睡前停止刷那些让人焦虑的消息。",
      "useWhen": "Use it for a repeated online behavior involving negative or alarming content.", "avoidWhen": "Do not use it for every long browsing session; the negative emotional content is part of the meaning.",
      "chineseFeeling": "不是普通“刷屏”，而是被坏消息吸住、越刷越停不下来。",
      "originalMeaningEn": "A blend of doom and scroll, combining a sense of catastrophe with continuous feed browsing.", "originalMeaningZh": "由 doom 和 scroll 组合而成，把灾难感和连续刷信息结合起来。",
      "culturalContextEn": "Endless feeds make it easy to keep consuming alarming updates, so the behavior became a named feature of internet life.", "culturalContextZh": "无限滚动的信息流让人容易持续摄入令人不安的更新，于是这种网络行为有了专门名称。",
      "relatedTerms": ["cd-touch-grass", "cd-rent-free"],
      "confusedWith": [{"term": "browse", "differenceEn": "Browse is neutral; doomscroll includes repeated exposure to distressing content and difficulty stopping.", "differenceZh": "browse 是中性的浏览；doomscroll 包含反复接触负面内容和难以停下来的意味。"}],
      "sourceName": "Merriam-Webster", "sourceUrl": "https://www.merriam-webster.com/dictionary/doomscroll", "editorialSourceType": "dictionary reference", "auditedAt": "2026-08-10"
    },
    {
      "id": "cd-touch-grass", "term": "touch grass", "displayTerm": "TOUCH GRASS", "speechText": "touch grass", "pronunciation": "/tʌtʃ ɡræs/", "category": "Community Discourse",
      "platforms": ["Gaming", "Social media", "Casual chat"], "tone": ["Teasing", "Dismissive", "Blunt"], "status": "Common", "formality": "Very informal",
      "meaningEn": "A blunt suggestion that someone should step away from the internet and reconnect with offline life.", "meaningZh": "直接建议某人离开网络一会儿，回到现实生活中。",
      "exampleEn": "You have argued about this for six hours. Touch grass.", "exampleZh": "你已经为这事吵了六小时，出去透透气吧。",
      "useWhen": "Use it only in clearly informal relationships where teasing or bluntness is acceptable.", "avoidWhen": "Avoid saying it to strangers or someone in distress; it can sound dismissive, insulting, or impatient.",
      "chineseFeeling": "常是“别沉迷网上了”的调侃，但很容易听起来像在训人。",
      "originalMeaningEn": "The phrase literally refers to touching grass outdoors.", "originalMeaningZh": "字面上是去户外摸一摸草。",
      "culturalContextEn": "Internet communities use an offline physical image to criticize obsessive online arguments or excessive screen time.", "culturalContextZh": "网络社区用一个具体的户外动作来讽刺过度沉迷争论或屏幕的人。",
      "relatedTerms": ["cd-doomscroll", "cd-dogpile"],
      "confusedWith": [{"term": "take a break", "differenceEn": "Take a break can be caring and neutral; touch grass is often teasing or dismissive.", "differenceZh": "take a break 可以是关心且中性的建议；touch grass 常带调侃或否定感。"}],
      "sourceName": "Merriam-Webster", "sourceUrl": "https://www.merriam-webster.com/slang/touch-grass", "editorialSourceType": "slang reference", "auditedAt": "2026-08-10"
    },
    {
      "id": "cd-hot-take", "term": "hot take", "displayTerm": "HOT TAKE", "speechText": "hot take", "pronunciation": "/ˈhɑːt teɪk/", "category": "Community Discourse",
      "platforms": ["X", "Comments", "Sports", "Fandom"], "tone": ["Provocative", "Playful", "Dramatic"], "status": "Common", "formality": "Informal",
      "meaningEn": "A deliberately provocative or unusual opinion, often presented as if it may spark disagreement.", "meaningZh": "带有挑衅性或不寻常的观点，通常预期会引发争论。",
      "exampleEn": "Hot take: the remake is better than the original.", "exampleZh": "大胆说一句：重制版比原版更好。",
      "useWhen": "Use it to signal that an opinion is intentionally bold, debatable, or likely to provoke reactions.", "avoidWhen": "Do not assume a hot take is necessarily wrong; the label describes presentation and controversy, not truth value.",
      "chineseFeeling": "接近“我知道这话可能有争议，但我要说”，不等于观点一定错误。",
      "originalMeaningEn": "Take can mean an opinion or interpretation; hot adds urgency, controversy, or strong reaction.", "originalMeaningZh": "take 可以表示观点或解读；hot 增加了紧迫、争议或强烈反应的意味。",
      "culturalContextEn": "Fast-moving media and online debate reward short labels that warn readers an opinion is intentionally provocative.", "culturalContextZh": "快速传播的媒体和网络讨论需要一种简短标签，提前提醒读者这是一条可能引发争议的观点。",
      "relatedTerms": ["cd-ratio", "cd-low-key"],
      "confusedWith": [{"term": "wrong opinion", "differenceEn": "A hot take may be correct; it is marked as bold or controversial rather than objectively false.", "differenceZh": "hot take 可能是正确的；它强调大胆或有争议，不等于客观错误。"}],
      "sourceName": "Merriam-Webster", "sourceUrl": "https://www.merriam-webster.com/dictionary/hot%20take", "editorialSourceType": "dictionary reference", "auditedAt": "2026-08-10"
    },
    {
      "id": "cd-low-key", "term": "low-key / high-key", "displayTerm": "LOW-KEY / HIGH-KEY", "speechText": "low key, high key", "pronunciation": "/ˌloʊ ˈkiː/", "category": "Community Discourse",
      "platforms": ["TikTok", "X", "Casual chat", "Comments"], "tone": ["Casual", "Softened", "Emphatic"], "status": "Common", "formality": "Very informal",
      "meaningEn": "Low-key softens or downplays an admission; high-key intensifies it or makes it openly obvious.", "meaningZh": "low-key 用来弱化或低调承认；high-key 用来加强语气、明确表示。",
      "exampleEn": "I low-key miss the old design, but I high-key love the new search.", "exampleZh": "我其实有点想念旧设计，但我是真的很喜欢新的搜索功能。",
      "useWhen": "Use these expressions in casual speech or online writing to tune how strongly an opinion is presented.", "avoidWhen": "Avoid them in formal reports, academic writing, or situations where the intensity must be stated precisely.",
      "chineseFeeling": "low-key 接近“其实有点、暗暗地”；high-key 接近“非常明显地、毫不掩饰地”。",
      "originalMeaningEn": "Low-key originally describes something kept discreet or unobtrusive; high-key is its emphatic contrast in informal usage.", "originalMeaningZh": "low-key 原本表示低调、不显眼；high-key 在非正式用法中形成了相反的强调效果。",
      "culturalContextEn": "Online speakers use the contrast to signal whether a feeling is being quietly admitted or openly amplified.", "culturalContextZh": "网络表达借助这组反差来标记一种感受是被轻轻承认，还是被公开放大。",
      "relatedTerms": ["cd-hot-take", "cd-rent-free"],
      "confusedWith": [{"term": "quietly", "differenceEn": "Low-key can soften an opinion or intensity; it does not only describe speaking volume.", "differenceZh": "low-key 不只是声音小，也可以弱化观点或情绪的强度。"}],
      "sourceName": "Merriam-Webster", "sourceUrl": "https://www.merriam-webster.com/dictionary/low-key", "editorialSourceType": "dictionary reference", "auditedAt": "2026-08-10"
    },
    {
      "id": "cd-rent-free", "term": "rent-free", "displayTerm": "RENT-FREE", "speechText": "rent free", "pronunciation": "/ˈrent friː/", "category": "Community Discourse",
      "platforms": ["Comments", "Fandom", "Social media", "Casual chat"], "tone": ["Playful", "Teasing", "Dramatic"], "status": "Common", "formality": "Very informal",
      "meaningEn": "Describes a person, idea, or moment that keeps occupying someone’s thoughts without effort or permission.", "meaningZh": "某个人、想法或时刻一直占据脑海，仿佛不用付租金就住在那里。",
      "exampleEn": "That one plot twist is living rent-free in my head.", "exampleZh": "那个反转一直在我脑子里挥之不去。",
      "useWhen": "Use it playfully for a memorable or repeatedly recalled idea, person, image, or moment.", "avoidWhen": "Avoid it in serious mental-health discussions or when the person may not welcome teasing about persistent thoughts.",
      "chineseFeeling": "把反复想起的东西夸张地说成“白住在脑子里”。",
      "originalMeaningEn": "Rent-free literally means occupying a property without paying rent.", "originalMeaningZh": "rent-free 字面上指住在某处却不用支付租金。",
      "culturalContextEn": "The metaphor turns an involuntary recurring thought into a humorous image of someone taking up space in the mind.", "culturalContextZh": "这个隐喻把挥之不去的想法想象成有人在脑内占空间却不付租金，因此带有夸张玩笑感。",
      "relatedTerms": ["cd-low-key", "cd-doomscroll"],
      "confusedWith": [{"term": "I cannot stop thinking about it", "differenceEn": "That sentence is direct and neutral; rent-free is a playful metaphor that exaggerates the persistence.", "differenceZh": "直接说“我停不下来地想它”更中性；rent-free 是夸张且带玩笑的隐喻。"}],
      "sourceName": "Merriam-Webster", "sourceUrl": "https://www.merriam-webster.com/dictionary/rent-free", "editorialSourceType": "dictionary reference", "auditedAt": "2026-08-10"
    }
  ]
};
