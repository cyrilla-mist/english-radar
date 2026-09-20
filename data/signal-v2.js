/* Sideglance Radar v0.2 Signal v2 enrichment. Keep this layer additive. */
(function () {
  var v2 = {
    'internet-lowkey': {
      identity: { category: 'Internet Culture', collections: ['everyday-internet-tone'], contexts: ['Comments', 'Casual chat', 'Social media'], tone: ['Softened', 'Casual', 'Understated'] },
      meaning: { core: 'Used to express something mildly, quietly, or without making it sound too strong.', zh: '其实有点 / 暗暗觉得 / 说真的有点', feeling: 'I mean this, but I’m not trying to make a huge deal of it.' },
      context: { whyPeopleUseIt: 'It lets people admit an opinion, preference, or feeling while keeping the tone casual and less intense.', culturalNote: 'It can sometimes genuinely mean quietly or secretly, so context still matters.' },
      usage: { commonPatterns: ['I lowkey want…', 'lowkey obsessed', 'that was lowkey good', 'I lowkey miss it'] },
      examples: [{ text: 'I lowkey want to rebuild the whole homepage.', zh: '我其实有点想重做整个主页。', context: 'Casual product discussion' }],
      boundaries: { natural: ['casual chat', 'comments', 'informal posts'], avoid: ['formal reports', 'academic writing'] },
      relations: [{ target: 'internet-highkey', type: 'contrast' }, { target: 'internet-ngl', type: 'similar' }, { target: 'internet-tbh', type: 'same-context' }]
    },
    'internet-cooked': {
      identity: { category: 'Internet Culture', collections: ['online-reactions-meme-culture'], contexts: ['Gaming', 'Comments', 'Casual chat'], tone: ['Dramatic', 'Humorous', 'Defeated'] },
      meaning: { core: 'Someone or something is in serious trouble, exhausted, badly losing, or unlikely to recover.', zh: '完了 / 寄了 / 没救了 / 被耗尽了', feeling: 'This situation is going very badly.' },
      context: { whyPeopleUseIt: 'It turns failure or difficulty into an exaggerated, meme-like reaction.', culturalNote: '“I’m cooked” can also mean “I’m exhausted.”' },
      usage: { commonPatterns: ['we’re cooked', 'I’m cooked', 'bro is cooked', 'this project is cooked'] },
      examples: [{ text: 'If this demo breaks tomorrow, we’re cooked.', zh: '如果这个演示明天出问题，我们就完了。', context: 'Deadline joke' }],
      boundaries: { natural: ['gaming', 'deadline jokes', 'sports', 'casual complaints'], avoid: ['formal status reporting'] },
      relations: [{ target: 'internet-locked-in', type: 'contrast' }, { target: 'internet-we-are-so-back', type: 'contrast' }, { target: 'sports-clutch', type: 'same-context' }]
    },
    'internet-touch-grass': {
      identity: { category: 'Internet Culture', collections: ['online-reactions-meme-culture'], contexts: ['Social media', 'Gaming', 'Online arguments'], tone: ['Teasing', 'Dismissive', 'Blunt'] },
      meaning: { core: 'A suggestion that someone should step away from the internet and reconnect with ordinary offline life.', zh: '别一直泡在网上了 / 出去接触一下现实', feeling: 'You are way too deep into this online thing.' },
      context: { whyPeopleUseIt: 'It mocks behavior that seems overly online, obsessive, detached from reality, or unnecessarily invested in internet drama.', culturalNote: 'It can be openly insulting rather than playful.' },
      usage: { commonPatterns: ['go touch grass', 'please touch grass', 'you need to touch grass'] },
      examples: [{ text: 'You’ve been arguing about this thread for six hours. Touch grass.', zh: '你已经为这个帖子吵了六小时，出去接触一下现实吧。', context: 'Online argument' }],
      boundaries: { natural: ['joking among friends', 'obvious online drama'], avoid: ['sensitive conversations', 'situations where bluntness may be taken personally'] },
      relations: [{ target: 'internet-chronically-online', type: 'often-paired' }, { target: 'internet-yapping', type: 'same-context' }]
    },
    'internet-ngl': {
      identity: { category: 'Internet Culture', collections: ['everyday-internet-tone'], contexts: ['Chat', 'Comments', 'Social media'], tone: ['Candid', 'Casual', 'Softened'] },
      meaning: { core: 'Introduces an honest opinion, admission, or reaction.', zh: '说实话 / 不瞒你说', feeling: 'I’m going to say what I actually think.' },
      context: { whyPeopleUseIt: 'It frames an opinion as candid while often making the statement feel less abrupt.', culturalNote: 'It often functions as a tone marker rather than a literal claim that the speaker was previously lying.' },
      usage: { commonPatterns: ['ngl, I liked it', 'ngl this is better', 'ngl I forgot'] },
      examples: [{ text: 'NGL, the old navigation was easier to use.', zh: '说实话，旧导航更容易用。', context: 'Informal product chat' }],
      boundaries: { natural: ['messages', 'comments', 'informal work chat'], avoid: ['formal reports', 'official communication'] },
      relations: [{ target: 'internet-tbh', type: 'similar' }, { target: 'internet-lowkey', type: 'same-context' }, { target: 'internet-fr', type: 'same-context' }]
    },
    'github-lgtm': {
      identity: { category: 'Developer Language', collections: ['developer-communication'], contexts: ['GitHub', 'Code review', 'Engineering chat'], tone: ['Concise', 'Positive', 'Work-casual'] },
      meaning: { core: 'The reviewer thinks the change looks acceptable or ready from their perspective.', zh: '我看没问题 / 看起来可以', feeling: 'I reviewed this and don’t see a blocker.' },
      context: { whyPeopleUseIt: 'Developer workflows favor short, repeatable signals that communicate review status quickly.', culturalNote: 'LGTM does not automatically mean formal approval, merge, deployment, or correctness.' },
      usage: { commonPatterns: ['LGTM', 'LGTM from me', 'looks good, LGTM'] },
      examples: [{ text: 'Tests pass and the mobile fix looks correct. LGTM.', zh: '测试通过了，移动端修复看起来没问题。', context: 'Pull request review' }],
      boundaries: { natural: ['PR review', 'engineering chat'], avoid: ['audiences unfamiliar with developer abbreviations'] },
      relations: [{ target: 'github-pr', type: 'often-paired' }, { target: 'github-merge', type: 'often-paired' }, { target: 'github-wip', type: 'contrast' }]
    },
    'product-ship-it': {
      identity: { category: 'Developer / Product Language', collections: ['developer-communication', 'building-products-online'], contexts: ['Product teams', 'GitHub', 'Startup chat'], tone: ['Decisive', 'Encouraging', 'Informal'] },
      meaning: { core: 'Release it, send it out, or stop polishing and move forward.', zh: '可以发了 / 上线吧 / 别再磨了', feeling: 'This is good enough to move forward.' },
      context: { whyPeopleUseIt: 'It reflects a builder culture that values getting usable work into the real world instead of endlessly polishing.', culturalNote: 'It does not necessarily mean the product is perfect.' },
      usage: { commonPatterns: ['ship it', 'let’s ship it', 'ready to ship', 'just ship it'] },
      examples: [{ text: 'The last blocker is fixed. Ship it.', zh: '最后一个阻塞问题修好了，可以发了。', context: 'Informal release decision' }],
      boundaries: { natural: ['product chat', 'engineering chat', 'informal release decisions'], avoid: ['formal release authorization'] },
      relations: [{ target: 'github-ship', type: 'similar' }, { target: 'product-mvp', type: 'same-context' }, { target: 'github-lgtm', type: 'often-paired' }]
    },
    'ai-agent': {
      identity: { category: 'AI Builder', collections: ['building-with-ai'], contexts: ['AI products', 'Engineering', 'Agent systems'], tone: ['Technical', 'Current', 'Often ambiguous'] },
      meaning: { core: 'An AI-enabled software system that can pursue a goal by deciding or coordinating steps, often using tools, state, or external systems.', zh: '能围绕目标执行一系列动作的 AI 系统，而不只是会聊天的模型', feeling: 'The system can do things toward a goal, not only answer once.' },
      context: { whyPeopleUseIt: 'The term distinguishes goal-directed AI workflows from simple one-shot generation, although products use the word with different levels of autonomy.', culturalNote: 'There is no single universally enforced product definition of “agent.”' },
      usage: { commonPatterns: ['AI agent', 'coding agent', 'agent workflow', 'agent tools', 'multi-agent system'] },
      examples: [{ text: 'The agent checks the issue, calls a repository tool, and prepares a patch.', zh: '这个 agent 检查 issue、调用仓库工具并准备补丁。', context: 'AI engineering system' }],
      boundaries: { natural: ['systems that perform goal-oriented multi-step work'], avoid: ['treating every chatbot, prompt, or automation script as an agent'] },
      relations: [{ target: 'ai-workflow', type: 'same-context' }, { target: 'ai-tool-calling', type: 'often-paired' }, { target: 'ai-memory', type: 'same-context' }]
    },
    'ai-rag': {
      identity: { category: 'AI Builder', collections: ['building-with-ai'], contexts: ['AI apps', 'Search', 'Knowledge systems'], tone: ['Technical', 'Precise'] },
      meaning: { core: 'A system retrieves relevant information and supplies it as context to a generative model before or during answer generation.', zh: '先检索相关资料，再让模型基于这些资料生成', feeling: 'Don’t rely only on what the model already knows—bring in relevant evidence.' },
      context: { whyPeopleUseIt: 'It helps applications answer using external or updated knowledge without retraining the model for every information change.', culturalNote: 'RAG does not automatically guarantee truth, good retrieval, or citations.' },
      usage: { commonPatterns: ['RAG pipeline', 'RAG system', 'retrieval step', 'RAG over docs'] },
      examples: [{ text: 'We use RAG to retrieve the relevant documentation before generating the answer.', zh: '我们用 RAG 在生成回答前检索相关文档。', context: 'AI knowledge system' }],
      boundaries: { natural: ['AI applications with an actual retrieval stage'], avoid: ['calling any prompt with pasted text RAG when no retrieval exists'] },
      relations: [{ target: 'ai-grounding', type: 'similar' }, { target: 'ai-context-window', type: 'same-context' }, { target: 'ai-hallucination', type: 'contrast' }]
    },
    'product-mvp': {
      identity: { category: 'Product Language', collections: ['building-products-online'], contexts: ['Startups', 'Product teams', 'Hackathons'], tone: ['Strategic', 'Practical'] },
      meaning: { core: 'The smallest product version that is sufficiently usable to test a real assumption or need.', zh: '先做一个足够能验证核心价值的最小版本', feeling: 'What is the least we can build that still teaches us something real?' },
      context: { whyPeopleUseIt: 'It helps teams reduce scope and test whether the core idea matters before investing in a larger product.', culturalNote: 'MVP is not the same thing as an unfinished mess, prototype, or PoC.' },
      usage: { commonPatterns: ['MVP scope', 'MVP feature', 'launch the MVP', 'MVP version'] },
      examples: [{ text: 'For the MVP, Decode only needs text input and one clear interpretation result.', zh: '对于 MVP，Decode 只需要文本输入和一个清晰的解释结果。', context: 'Product planning' }],
      boundaries: { natural: ['product planning', 'startup discussion', 'hackathon scope decisions'], avoid: ['using MVP merely to justify poor quality'] },
      relations: [{ target: 'product-poc', type: 'contrast' }, { target: 'product-prototype', type: 'same-context' }, { target: 'product-pmf', type: 'same-context' }, { target: 'product-ship-it', type: 'same-context' }]
    },
    'internet-tldr': {
      identity: { category: 'Community Language', collections: ['community-forum-conventions'], contexts: ['Reddit', 'Forums', 'GitHub', 'Long posts'], tone: ['Concise', 'Informal', 'Sometimes dismissive'] },
      meaning: { core: 'Usually marks a short summary of a longer piece of text; it can also literally express that someone did not read something because it was too long.', zh: '太长不看版 / 总结一下；作为回复时也可能真的有“懒得看”的语气', feeling: 'Give me the short version.' },
      context: { whyPeopleUseIt: 'Long-form online discussion created a need for quick summaries that let readers capture the main point.', culturalNote: 'When directed at someone else’s writing, it can sound dismissive.' },
      usage: { commonPatterns: ['TL;DR:', 'TLDR at the bottom', 'what’s the TL;DR?', 'TL;DR, please'] },
      examples: [{ text: 'TL;DR: the release is ready, but deployment is waiting on one permission.', zh: '总结：发布已经准备好，但部署还在等一个权限。', context: 'GitHub discussion' }],
      boundaries: { natural: ['forums', 'Reddit', 'GitHub discussion', 'casual documentation'], avoid: ['formal documents where Summary or Executive Summary is clearer'] },
      relations: [{ target: 'internet-yapping', type: 'same-context' }, { target: 'internet-eli5', type: 'same-context' }, { target: 'internet-op', type: 'same-context' }]
    },
    'internet-fr': {
      identity: { category: 'Internet Culture', collections: ['everyday-internet-tone'], contexts: ['Chat', 'Comments', 'Social media'], tone: ['Agreeing', 'Casual', 'Emphatic'] },
      meaning: { core: 'A compact way to agree or emphasize that something is genuinely true.', zh: '真的 / 确实 / 说真的', feeling: 'Yes, exactly—or I really mean this.' },
      context: { whyPeopleUseIt: 'Short chat language lets people add quick agreement or emphasis without interrupting the flow of a conversation.', culturalNote: 'FR can feel supportive, but it can also intensify a reaction rather than make a formal claim.' },
      usage: { commonPatterns: ['fr', 'fr fr', 'that was hard, fr', 'fr?'] },
      examples: [{ text: 'That onboarding flow is much clearer now, fr.', zh: '这个 onboarding 流程现在清楚多了，真的。', context: 'Informal product chat' }],
      boundaries: { natural: ['chat', 'comments', 'casual social posts'], avoid: ['formal writing', 'audiences unfamiliar with chat abbreviations'] },
      relations: [{ target: 'internet-ngl', type: 'same-context' }, { target: 'internet-tbh', type: 'same-context' }, { target: 'internet-based', type: 'similar' }]
    },
    'internet-tbh': {
      identity: { category: 'Internet Culture', collections: ['everyday-internet-tone'], contexts: ['Chat', 'Comments', 'Work chat'], tone: ['Frank', 'Casual', 'Reflective'] },
      meaning: { core: 'A shorthand that frames what follows as an honest personal opinion or admission.', zh: '坦白说 / 说实话', feeling: 'Here is my candid take.' },
      context: { whyPeopleUseIt: 'It makes a personal assessment feel conversational and signals that the speaker is about to be direct.', culturalNote: 'It is a tone marker, not proof that everything before it was dishonest.' },
      usage: { commonPatterns: ['TBH, I would…', 'tbh this works', 'tbh I forgot', 'to be honest'] },
      examples: [{ text: 'TBH, I would keep the simpler navigation for now.', zh: '坦白说，我现在会保留更简单的导航。', context: 'Informal product review' }],
      boundaries: { natural: ['casual messages', 'informal work chat', 'comments'], avoid: ['formal business writing', 'official decisions where precise wording matters'] },
      relations: [{ target: 'internet-ngl', type: 'similar' }, { target: 'internet-fr', type: 'same-context' }, { target: 'internet-lowkey', type: 'same-context' }]
    },
    'internet-locked-in': {
      identity: { category: 'Internet Culture', collections: ['online-reactions-meme-culture'], contexts: ['Gaming', 'Sports', 'Study chat'], tone: ['Focused', 'Motivated', 'Casual'] },
      meaning: { core: 'Fully focused, committed, or mentally ready for the task in front of you.', zh: '进入状态了 / 专注起来了 / 稳稳投入', feeling: 'I am dialed in and not getting distracted.' },
      context: { whyPeopleUseIt: 'Online communities turn intense focus into a memorable state that can be announced before a game, sprint, or challenge.', culturalNote: 'It can be sincere motivation or playful exaggeration; context decides how serious it is.' },
      usage: { commonPatterns: ['I’m locked in', 'locked in for the final push', 'we are locked in'] },
      examples: [{ text: 'Headphones on. I’m locked in for this release sprint.', zh: '戴上耳机，我要专注完成这次发布冲刺。', context: 'Engineering chat' }],
      boundaries: { natural: ['gaming', 'sports', 'study or work chat'], avoid: ['formal status reports', 'describing ordinary attention as a major commitment'] },
      relations: [{ target: 'internet-cooked', type: 'contrast' }, { target: 'product-ship-it', type: 'same-context' }, { target: 'internet-based', type: 'same-context' }]
    },
    'internet-based': {
      identity: { category: 'Internet Culture', collections: ['online-reactions-meme-culture'], contexts: ['Comments', 'Casual chat', 'Social media'], tone: ['Approving', 'Direct', 'Casual'] },
      meaning: { core: 'An informal reaction showing strong approval of an opinion or action, often because it feels honest or unafraid.', zh: '说得好 / 这观点我认可 / 很有道理', feeling: 'That is a bold point I respect.' },
      context: { whyPeopleUseIt: 'Online communities use it as a quick approval signal for opinions that seem authentic rather than carefully softened.', culturalNote: 'It is internet praise, not a claim that an argument is objectively correct.' },
      usage: { commonPatterns: ['based', 'that take is based', 'based response'] },
      examples: [{ text: 'You kept the ugly but useful empty state. Based.', zh: '你保留了那个不好看但实用的空状态，认可。', context: 'Design discussion' }],
      boundaries: { natural: ['comments', 'casual chat', 'social media reactions'], avoid: ['formal feedback', 'neutral professional evaluations'] },
      relations: [{ target: 'internet-ate', type: 'same-context' }, { target: 'internet-fr', type: 'similar' }, { target: 'internet-touch-grass', type: 'contrast' }]
    },
    'internet-ate': {
      identity: { category: 'Internet Culture', collections: ['online-reactions-meme-culture'], contexts: ['Comments', 'Fandom', 'Social media'], tone: ['Approving', 'Dramatic', 'Casual'] },
      meaning: { core: 'Praises a performance, idea, or look as impressively successful, usually with enthusiastic exaggeration.', zh: '表现绝了 / 做得太好了', feeling: 'You did that extremely well.' },
      context: { whyPeopleUseIt: 'Meme-like praise makes approval feel energetic and communal, especially around performances, designs, or posts.', culturalNote: 'The food metaphor is not literal; the force comes from playful exaggeration.' },
      usage: { commonPatterns: ['you ate', 'she ate that', 'ate and left no crumbs'] },
      examples: [{ text: 'You ate that launch announcement and left no confusion behind.', zh: '你把这次发布公告写得太好了，一点歧义都没留下。', context: 'Community reaction' }],
      boundaries: { natural: ['comments', 'fandom', 'casual praise'], avoid: ['formal performance reviews', 'measured professional reporting'] },
      relations: [{ target: 'internet-left-no-crumbs', type: 'often-paired' }, { target: 'internet-no-notes', type: 'similar' }, { target: 'internet-glazing', type: 'contrast' }]
    },
    'github-pr': {
      identity: { category: 'Developer Language', collections: ['developer-communication'], contexts: ['GitHub', 'Code review', 'Open source'], tone: ['Technical', 'Concise', 'Work-casual'] },
      meaning: { core: 'A proposed set of code changes submitted so collaborators can review and merge them.', zh: '提交给团队审核和合并的一组代码改动', feeling: 'Here is a change package ready for shared review.' },
      context: { whyPeopleUseIt: 'Git workflows make reviewable change sets central to collaboration, so PR became a compact shared object in developer conversation.', culturalNote: 'A PR is a review request, not automatically an approval or a release.' },
      usage: { commonPatterns: ['open a PR', 'review the PR', 'PR is ready', 'merge the PR'] },
      examples: [{ text: 'I opened a PR for the resolver fallback and added a regression test.', zh: '我为 resolver fallback 开了一个 PR，并加了回归测试。', context: 'GitHub workflow' }],
      boundaries: { natural: ['GitHub', 'code review', 'engineering chat'], avoid: ['audiences unfamiliar with Git workflows', 'formal project status without repository context'] },
      relations: [{ target: 'github-lgtm', type: 'often-paired' }, { target: 'github-merge', type: 'often-paired' }, { target: 'github-breaking-change', type: 'same-context' }]
    },
    'github-breaking-change': {
      identity: { category: 'Developer Language', collections: ['developer-communication'], contexts: ['APIs', 'Release notes', 'Code review'], tone: ['Technical', 'Cautionary', 'Precise'] },
      meaning: { core: 'A change that requires existing users or downstream systems to adapt because a previous contract no longer works.', zh: '会让现有使用方或下游系统需要适配的改动', feeling: 'This update may break someone who relied on the old behavior.' },
      context: { whyPeopleUseIt: 'Shared interfaces need a clear warning when compatibility is not preserved, especially across releases and dependencies.', culturalNote: 'It is about a changed contract, not merely a large or difficult implementation.' },
      usage: { commonPatterns: ['breaking change', 'breaking API change', 'document the breaking change'] },
      examples: [{ text: 'Renaming this response field is a breaking change for our clients.', zh: '重命名这个响应字段会让我们的客户端需要适配。', context: 'API review' }],
      boundaries: { natural: ['API design', 'release notes', 'dependency discussions'], avoid: ['calling an internal refactor breaking when the public contract is unchanged'] },
      relations: [{ target: 'github-pr', type: 'same-context' }, { target: 'github-merge', type: 'same-context' }, { target: 'product-ship-it', type: 'same-context' }]
    },
    'ai-tool-calling': {
      identity: { category: 'AI Builder', collections: ['building-with-ai'], contexts: ['AI tools', 'Engineering chat', 'Product teams'], tone: ['Technical', 'Precise', 'Work-casual'] },
      meaning: { core: 'A model-application pattern where the model requests a defined external function or tool for the application to execute.', zh: '模型请求应用调用已定义工具或函数', feeling: 'The model asks the system to take a structured action.' },
      context: { whyPeopleUseIt: 'AI products need a clear boundary between generating text and asking software to perform an action with structured inputs.', culturalNote: 'The model proposes the call; the application still controls execution, permissions, and results.' },
      usage: { commonPatterns: ['tool calling', 'tool call schema', 'the model calls a tool', 'function calling'] },
      examples: [{ text: 'Tool calling lets the assistant look up an order before replying.', zh: 'tool calling 让助手先查询订单，再生成回复。', context: 'AI product architecture' }],
      boundaries: { natural: ['AI engineering', 'agent systems', 'product architecture'], avoid: ['treating free-form text instructions as a completed tool call'] },
      relations: [{ target: 'ai-agent', type: 'often-paired' }, { target: 'ai-rag', type: 'same-context' }, { target: 'ai-memory', type: 'same-context' }]
    },
    'ai-hallucination': {
      identity: { category: 'AI Builder', collections: ['building-with-ai'], contexts: ['AI tools', 'Engineering chat', 'Knowledge systems'], tone: ['Technical', 'Cautionary', 'Neutral'] },
      meaning: { core: 'An AI-generated claim that sounds plausible but is unsupported, invented, or false.', zh: '听起来合理但没有依据的 AI 错误生成', feeling: 'The answer sounds confident, but the evidence is missing or wrong.' },
      context: { whyPeopleUseIt: 'AI teams need a concise way to discuss fluent outputs that fail contact with evidence or the real system state.', culturalNote: 'It describes an output problem, not a claim that a model has human-like perception.' },
      usage: { commonPatterns: ['hallucinated citation', 'the model hallucinated', 'reduce hallucinations', 'hallucination rate'] },
      examples: [{ text: 'The assistant invented a citation instead of admitting it could not find the source.', zh: '助手没有承认找不到来源，反而编造了引用。', context: 'AI reliability review' }],
      boundaries: { natural: ['AI evaluation', 'knowledge systems', 'engineering discussion'], avoid: ['using the label without checking whether the source was unavailable, ambiguous, or merely misunderstood'] },
      relations: [{ target: 'ai-rag', type: 'contrast' }, { target: 'ai-grounding', type: 'often-paired' }, { target: 'ai-context-window', type: 'same-context' }]
    },
    'product-poc': {
      identity: { category: 'Product Language', collections: ['building-products-online'], contexts: ['Product teams', 'Engineering chat', 'Startups'], tone: ['Technical', 'Experimental', 'Work-casual'] },
      meaning: { core: 'A small experiment that tests whether an idea is technically or practically possible before a larger build.', zh: '用于验证想法是否可行的小型实验', feeling: 'Can this work at all, before we invest in the full product?' },
      context: { whyPeopleUseIt: 'Teams use a PoC to reduce uncertainty about feasibility without pretending they have validated the whole product or market.', culturalNote: 'A PoC answers “can we make it work?”; it does not answer whether users want it.' },
      usage: { commonPatterns: ['build a PoC', 'technical PoC', 'PoC proves', 'PoC only tests'] },
      examples: [{ text: 'The PoC only tests whether the data can be imported; it is not production-ready.', zh: '这个 PoC 只验证数据能否导入，还不是可上线产品。', context: 'Engineering planning' }],
      boundaries: { natural: ['early engineering', 'startup planning', 'feasibility experiments'], avoid: ['presenting a PoC as a polished product or validated business'] },
      relations: [{ target: 'product-mvp', type: 'contrast' }, { target: 'product-prototype', type: 'same-context' }, { target: 'product-pmf', type: 'contrast' }]
    },
    'internet-yapping': {
      identity: { category: 'Community Language', collections: ['community-forum-conventions'], contexts: ['Chat', 'Comments', 'Casual chat'], tone: ['Teasing', 'Dismissive', 'Playful'] },
      meaning: { core: 'A casual way to say someone is talking at length, especially without getting to the point.', zh: '一直碎碎念 / 说个不停', feeling: 'There is a lot of talking here; where is the point?' },
      context: { whyPeopleUseIt: 'Internet speech turns “talking too much” into a playful label that can soften self-criticism or sharpen teasing.', culturalNote: 'It is light when self-directed, but can sound dismissive when aimed at someone in a serious conversation.' },
      usage: { commonPatterns: ['I’m yapping', 'stop yapping', 'all that yapping', 'let me stop yapping'] },
      examples: [{ text: 'I’ve been yapping for five minutes; the actual point is that the test passed.', zh: '我已经说了五分钟，重点其实是测试通过了。', context: 'Casual team chat' }],
      boundaries: { natural: ['casual chat', 'comments', 'self-mocking posts'], avoid: ['sensitive conversations', 'using it to dismiss someone who needs to be heard'] },
      relations: [{ target: 'internet-tldr', type: 'same-context' }, { target: 'internet-touch-grass', type: 'same-context' }, { target: 'internet-eli5', type: 'contrast' }]
    },
    'internet-eli5': {
      identity: { category: 'Community Language', collections: ['community-forum-conventions'], contexts: ['Reddit', 'Forums', 'Chat'], tone: ['Curious', 'Informal', 'Sometimes playful'] },
      meaning: { core: 'A request for a complex idea to be explained in plain language without assuming specialist knowledge.', zh: '请用简单易懂的话解释一下，不要默认我懂专业背景', feeling: 'Please give me the beginner-friendly version.' },
      context: { whyPeopleUseIt: 'Online communities use a shared shorthand to invite accessible explanations while making it clear that jargon should be unpacked.', culturalNote: 'The phrase is not an invitation to be condescending; a good answer keeps the underlying idea accurate.' },
      usage: { commonPatterns: ['ELI5:', 'can someone ELI5', 'ELI5 how this works', 'ELI5 the difference'] },
      examples: [{ text: 'ELI5: why does this model need a context window?', zh: '请用简单的话解释一下：为什么这个模型需要上下文窗口？', context: 'Community question' }],
      boundaries: { natural: ['forums', 'Reddit', 'beginner-friendly technical discussion'], avoid: ['reducing sensitive or genuinely complex issues to an oversimplified answer'] },
      relations: [{ target: 'internet-tldr', type: 'same-context' }, { target: 'ai-context-window', type: 'same-context' }, { target: 'internet-yapping', type: 'contrast' }]
    },
    'internet-highkey': {
      identity: { category: 'Internet Culture', collections: ['everyday-internet-tone'], contexts: ['Casual opinions', 'Personal preferences', 'Comments', 'Social chat'], tone: ['Emphatic', 'Direct', 'Casual'] },
      meaning: { core: 'Used to openly and emphatically admit a strong opinion, preference, or feeling.', zh: '明确地表达强烈的看法、偏好或感受', feeling: 'I am just going to admit this openly and strongly.' },
      context: { whyPeopleUseIt: 'It marks an admission as deliberate and unhidden, often making a strong personal reaction feel playful rather than formal.', culturalNote: 'Highkey works as a contrast to lowkey, which deliberately softens or downplays an admission.' },
      usage: { commonPatterns: ['I highkey want…', 'highkey obsessed', 'I highkey love it', 'highkey the best'] },
      examples: [{ text: 'I highkey want this feature in the next release.', zh: '我是真的很想在下一版加入这个功能。', context: 'Casual product chat' }, { text: 'Highkey, that was the best part of the whole event.', zh: '说真的，那是整场活动最精彩的部分。', context: 'Social reaction' }],
      boundaries: { natural: ['casual opinions', 'personal preferences', 'informal posts'], avoid: ['formal writing', 'using it as a universal replacement for really or very'], note: 'It emphasizes an openly admitted stance, not just intensity.' },
      relations: []
    },
    'internet-no-cap': {
      identity: { category: 'Internet Culture', collections: ['everyday-internet-tone'], contexts: ['Comments', 'Casual chat', 'Social media'], tone: ['Direct', 'Emphatic', 'Casual'] },
      meaning: { core: 'Emphasizes that the speaker is not exaggerating, bluffing, or dressing up the truth.', zh: '强调没有夸张、没有吹牛，接下来是实话', feeling: 'I am being completely serious about this.' },
      context: { whyPeopleUseIt: 'It reassures an informal audience that a strong claim is meant sincerely rather than as hype or performance.', culturalNote: 'No cap can sound emphatic or playful; it is not a neutral substitute for honestly in every setting.' },
      usage: { commonPatterns: ['no cap', 'no cap, this is…', 'I’m serious, no cap', '... no cap'] },
      examples: [{ text: 'No cap, this is the cleanest fix we’ve shipped all month.', zh: '不夸张，这是我们这个月发出的最干净的修复。', context: 'Developer chat' }, { text: 'No cap, I replayed that clip five times.', zh: '真的不夸张，我把那段视频重播了五遍。', context: 'Casual reaction' }],
      boundaries: { natural: ['casual reactions', 'comments', 'informal team chat'], avoid: ['formal reports', 'situations where plain wording is clearer'], note: 'Use it to reject exaggeration or bluffing, not simply to mean “very.”' },
      relations: [{ target: 'internet-fr', type: 'similar' }]
    },
    'internet-its-giving': {
      identity: { category: 'Internet Culture', collections: ['online-reactions-meme-culture'], contexts: ['Comments', 'Fandom', 'Social media'], tone: ['Playful', 'Evaluative', 'Casual'] },
      meaning: { core: 'Reads something as carrying a recognizable vibe, reference, archetype, era, or aesthetic.', zh: '看出某种熟悉的氛围、风格或参照感', feeling: 'This reminds me of a recognizable type of energy.' },
      context: { whyPeopleUseIt: 'It compresses a longer cultural comparison into a quick vibe reading that other online users can recognize.', culturalNote: 'The expression depends on the audience understanding the reference or vibe named after “giving.”' },
      usage: { commonPatterns: ["it’s giving…", 'this is giving…', 'the whole look is giving…', 'it’s giving main character'] },
      examples: [{ text: "This color palette? It’s giving late-night archive.", zh: '这个配色？很有深夜档案的感觉。', context: 'Design reaction' }, { text: 'The tiny jacket is giving retired rock star.', zh: '这件小夹克很有“退休摇滚明星”的感觉。', context: 'Playful comment' }],
      boundaries: { natural: ['vibe reactions', 'fandom posts', 'casual design commentary'], avoid: ['formal specifications', 'forcing the construction when there is no recognizable reference or vibe'], note: 'The phrase names an impression rather than giving a precise technical evaluation.' },
      relations: [{ target: 'internet-ate', type: 'same-context' }]
    },
    'internet-delulu': {
      identity: { category: 'Internet Culture', collections: ['online-reactions-meme-culture'], contexts: ['Fandom', 'Comments', 'Casual chat'], tone: ['Playful', 'Self-mocking', 'Teasing'] },
      meaning: { core: 'A playful, self-aware label for unrealistic optimism, fantasy, or wishful thinking.', zh: '带自知之明地说自己有点不切实际、在幻想', feeling: 'I know this hope is unrealistic, but I am entertaining it anyway.' },
      context: { whyPeopleUseIt: 'It lets people mock their own hopeful fantasies in a compact, humorous way, especially in fandom and stan culture.', culturalNote: 'The slang grew from fandom language and spread into broader self-mocking internet speech.' },
      usage: { commonPatterns: ['I’m being delulu', 'delulu is the solulu', 'a little delulu', 'delulu but hopeful'] },
      examples: [{ text: 'I’m being delulu, but maybe the feature will launch tomorrow.', zh: '我知道自己有点想太美，但也许这个功能明天就上线。', context: 'Self-mocking product chat' }, { text: 'Delulu take: the band is secretly announcing a tour tonight.', zh: '幻想一下：乐队今晚其实会突然宣布巡演。', context: 'Fandom speculation' }],
      boundaries: { natural: ['self-directed jokes', 'harmless fandom optimism', 'casual chat'], avoid: ['serious mental-health discussion', 'describing real delusions', 'mocking vulnerable people'], note: 'Self-aware playful use is safer than applying it to someone else’s serious condition.' },
      relations: [{ target: 'internet-chronically-online', type: 'same-context' }]
    },
    'internet-chronically-online': {
      identity: { category: 'Internet Culture', collections: ['online-reactions-meme-culture'], contexts: ['Comments', 'Social media', 'Casual chat'], tone: ['Teasing', 'Critical', 'Observational'] },
      meaning: { core: 'Describes thinking, behavior, references, or interpretations shaped so deeply by internet culture that ordinary offline perspective seems distant.', zh: '思维、表达或判断被网络文化深度塑造，甚至脱离普通线下视角', feeling: 'This reaction makes sense inside the internet, but feels strange or detached offline.' },
      context: { whyPeopleUseIt: 'It gives people a compact way to point out when online norms or references have started shaping someone’s worldview unusually strongly.', culturalNote: 'It can be observational or self-deprecating, but when aimed at someone in an argument it can dismiss their perspective.' },
      usage: { commonPatterns: ['so chronically online', 'that’s chronically online', 'chronically online take', 'I’m chronically online'] },
      examples: [{ text: 'That take is so chronically online that nobody in the room understood it.', zh: '这个观点太网络化了，房间里没人听懂。', context: 'Offline conversation' }, { text: 'I know I’m chronically online when I recognize every niche reference in this thread.', zh: '我连这个帖子里的每个冷门梗都认识时，就知道自己真的泡网太深了。', context: 'Self-observation' }],
      boundaries: { natural: ['self-deprecation', 'light observations about internet-shaped behavior'], avoid: ['treating it as a neutral synonym for using the internet a lot', 'using it to dismiss someone during a serious argument'], note: 'The criticism is about perspective and cultural immersion, not screen time alone.' },
      relations: []
    },
    'internet-we-are-so-back': {
      identity: { category: 'Internet Culture', collections: ['online-reactions-meme-culture'], contexts: ['Sports', 'Fandom', 'Casual chat'], tone: ['Excited', 'Hopeful', 'Playful'] },
      meaning: { core: 'An exaggerated reaction to a positive reversal after things looked bad, uncertain, or over.', zh: '在事情好转或出现转机时夸张地庆祝“我们又行了”', feeling: 'A small comeback makes it feel like everything is restored.' },
      context: { whyPeopleUseIt: 'Meme language turns a minor recovery into a dramatic comeback narrative that a group can celebrate together.', culturalNote: 'The phrase is funniest when there was an implied setback, decline, or “it’s over” moment first.' },
      usage: { commonPatterns: ['we are so back', 'we’re so back', 'WE ARE SO BACK', 'the comeback is real'] },
      examples: [{ text: 'The build passed on the first try. We are so back.', zh: '构建一次就通过了，我们又行了。', context: 'Engineering chat' }, { text: 'The team finally scored in the second half. We are so back.', zh: '球队终于在下半场进球了，我们又行了。', context: 'Sports reaction' }],
      boundaries: { natural: ['comeback jokes', 'sports and fandom reactions', 'casual team chat after a setback'], avoid: ['formal progress reports', 'using it for ordinary good news with no prior reversal'], note: 'The recovery framing is central; it is not just a generic way to say things are good.' },
      relations: []
    },
    'internet-iykyk': {
      identity: { category: 'Internet Culture', collections: ['online-reactions-meme-culture'], contexts: ['Social media', 'Fandom', 'Casual chat'], tone: ['Knowing', 'Playful', 'Suggestive'] },
      meaning: { core: 'Signals that a reference or experience is intentionally left unexplained for people who already share the background.', zh: '故意不解释共同背景，让有相关经历的人自行会意', feeling: 'The people who share this history will recognize it without a full explanation.' },
      context: { whyPeopleUseIt: 'It creates a quick feeling of shared recognition and belonging by leaving the accumulated background implicit.', culturalNote: 'That same insider feeling can become gatekeeping when clarity or access matters more than the joke.' },
      usage: { commonPatterns: ['IYKYK', 'that place, IYKYK', 'the old days, IYKYK', 'if you know, you know'] },
      examples: [{ text: 'That late-night noodle shop is the best. IYKYK.', zh: '那家深夜面馆最好吃，懂的都懂。', context: 'Shared local reference' }, { text: 'The old deploy script had a personality. IYKYK.', zh: '以前那个部署脚本很有“个性”，懂的都懂。', context: 'Developer in-joke' }],
      boundaries: { natural: ['shared fandom references', 'inside jokes', 'audiences likely to know the background'], avoid: ['formal instructions', 'situations where people need clear information', 'using it to exclude newcomers'], note: 'It should signal shared context, not replace an explanation that others genuinely need.' },
      relations: [{ target: 'internet-lore', type: 'same-context' }]
    },
    'internet-imo': {
      identity: { category: 'Internet Culture', collections: ['everyday-internet-tone'], contexts: ['Casual opinions', 'Personal preferences', 'Chat'], tone: ['Reflective', 'Casual', 'Qualified'] },
      meaning: { core: 'Frames what follows as the speaker’s personal judgment or perspective rather than an objective universal fact.', zh: '把后面的话标记为个人看法，而不是客观定论', feeling: 'This is my take, not an unquestionable fact.' },
      context: { whyPeopleUseIt: 'It gives people a compact way to mark personal stance without writing a longer disclaimer.' },
      usage: { commonPatterns: ['IMO, …', 'imo this is…', 'that’s better imo', 'but imo…'] },
      examples: [{ text: 'IMO, the shorter intro gets to the point faster.', zh: '我个人觉得，较短的开场更快切入重点。', context: 'Casual product opinion' }, { text: 'imo this is the best version so far.', zh: '我觉得这是目前最好的版本。', context: 'Informal reaction' }],
      boundaries: { natural: ['casual opinions', 'personal preferences', 'informal posts'], avoid: ['formal writing', 'assuming it automatically makes a harsh opinion polite'], note: 'It softens certainty, not necessarily the interpersonal force of the opinion.' },
      relations: [{ target: 'internet-idk', type: 'same-context' }]
    },
    'internet-idk': {
      identity: { category: 'Internet Culture', collections: ['everyday-internet-tone'], contexts: ['Chat', 'Casual replies', 'Comments'], tone: ['Uncertain', 'Hesitant', 'Sometimes Dismissive'] },
      meaning: { core: 'Can express genuine uncertainty, softening, hesitation, emotional distance, reluctance to commit, or mild dismissal depending on placement and tone.', zh: '可表示不确定、缓和、犹豫、疏离、不愿表态或轻微的敷衍', feeling: 'I am unsure—or I may be keeping some distance from this conversation.' },
      context: { whyPeopleUseIt: 'It lets people manage uncertainty and commitment quickly; punctuation and surrounding words can make the reply open, hesitant, or closed.' },
      usage: { commonPatterns: ['idk, maybe', 'idk man', 'idk.', 'idk if…'] },
      examples: [{ text: 'idk, maybe we should wait until tomorrow.', zh: '我也不确定，要不我们等到明天？', context: 'Hesitant suggestion' }, { text: 'idk man, that explanation still feels off.', zh: '我说不好，但那个解释还是让人觉得不太对。', context: 'Skeptical reply' }],
      boundaries: { natural: ['casual uncertainty', 'softened replies', 'informal disagreement'], avoid: ['formal decisions needing a clear answer', 'assuming it always means literal lack of knowledge'], note: '“idk.” can sound much more closed or dismissive than “idk, maybe”.' },
      relations: []
    },
    'internet-rn': {
      identity: { category: 'Internet Culture', collections: ['everyday-internet-tone'], contexts: ['Chat', 'Casual updates', 'Comments'], tone: ['Casual', 'Immediate', 'Conversational'] },
      meaning: { core: 'Compresses immediacy into casual digital conversation, marking a current state, feeling, priority, or temporary condition.', zh: '在随意数字交流中压缩“现在”的即时感，可标记当前状态、感受、优先事项或暂时情况', feeling: 'This is what is true or important at this exact moment.' },
      context: { whyPeopleUseIt: 'The abbreviation keeps chat moving quickly and makes the timing of a feeling or priority feel immediate.' },
      usage: { commonPatterns: ["I can't deal with this rn.", 'what are you doing rn?', 'rn I just need coffee.'] },
      examples: [{ text: "I can't deal with this rn.", zh: '我现在真的顾不上这个。', context: 'Immediate frustration' }, { text: 'what are you doing rn?', zh: '你现在在干什么？', context: 'Casual chat' }],
      boundaries: { natural: ['casual digital language', 'quick updates', 'informal chat'], avoid: ['formal prose', 'treating it as a universal written replacement for “right now”'] },
      relations: []
    },
    'internet-ikr': {
      identity: { category: 'Internet Culture', collections: ['everyday-internet-tone'], contexts: ['Chat', 'Comments', 'Shared reactions'], tone: ['Agreeing', 'Aligned', 'Emphatic'] },
      meaning: { core: 'Signals shared recognition and emotional alignment: the other person noticed exactly the same thing, not merely that they agree with a fact.', zh: '表示共同注意到同一件事并产生情绪上的同步，不只是普通同意', feeling: 'You noticed exactly the same thing I did.' },
      context: { whyPeopleUseIt: 'It quickly builds interpersonal alignment around a complaint, reaction, excitement, or obvious shared observation.' },
      usage: { commonPatterns: ['IKR?', 'ikr this part is perfect', 'I know, right?', 'ikr!'] },
      examples: [{ text: 'That ending came out of nowhere. IKR?', zh: '那个结局太突然了，你也这么觉得吧？', context: 'Shared reaction' }, { text: 'IKR! The tiny detail is what makes it work.', zh: '对吧！就是那个小细节让它成立了。', context: 'Enthusiastic agreement' }],
      boundaries: { natural: ['shared reactions', 'casual complaints', 'informal excitement'], avoid: ['formal communication', 'using it as a neutral yes without shared emotional context'] },
      relations: [{ target: 'internet-fr', type: 'similar' }]
    },
    'internet-rent-free': {
      identity: { category: 'Internet Culture', collections: ['online-reactions-meme-culture'], contexts: ['Comments', 'Fandom', 'Casual chat'], tone: ['Playful', 'Teasing', 'Dramatic'] },
      meaning: { core: 'Uses a housing metaphor to frame a person, scene, joke, song, moment, or idea as occupying mental space without paying for it.', zh: '用“免租住进脑子”的比喻表示某人、某事或某个念头持续占据注意力', feeling: 'This keeps coming back into my head whether I asked for it or not.' },
      context: { whyPeopleUseIt: 'The housing metaphor makes persistent attention vivid, playful, and slightly self-aware.' },
      usage: { commonPatterns: ['living rent-free in my head', 'that scene lives rent-free', 'rent-free in my brain'] },
      examples: [{ text: 'That one plot twist is living rent-free in my head.', zh: '那个反转一直白住在我脑子里。', context: 'Media reaction' }, { text: 'The way she said “okay” is living rent-free in my brain.', zh: '她说“好吧”的那个语气一直在我脑内循环。', context: 'Playful personal reaction' }],
      boundaries: { natural: ['playful self-directed comments', 'memorable media reactions', 'casual chat'], avoid: ['serious mental-health discussion', 'formal communication', 'mocking someone else for being fixated'], note: '“X lives rent-free in your head” can tease or criticize another person’s obsession.' },
      relations: []
    },
    'internet-left-no-crumbs': {
      identity: { category: 'Internet Culture', collections: ['online-reactions-meme-culture'], contexts: ['Comments', 'Fandom', 'Social media'], tone: ['Dramatic', 'Approving', 'Playful'] },
      meaning: { core: 'Extends the food metaphor in “ate” to praise a performance so completely that nothing was left behind.', zh: '把 ate 的食物比喻进一步加强，夸某人的表现彻底到一点可挑剔之处都不剩', feeling: 'That was so complete and impressive that there is nothing left to criticize.' },
      context: { whyPeopleUseIt: 'The intensified metaphor turns praise into a high-energy, meme-like social reaction.' },
      usage: { commonPatterns: ['left no crumbs', 'ate and left no crumbs', 'she left no crumbs'] },
      examples: [{ text: 'The final chorus? She left no crumbs.', zh: '最后那段副歌？她发挥得无可挑剔。', context: 'Fandom praise' }, { text: 'That explanation ate and left no crumbs.', zh: '那个解释讲得太漂亮了，一点漏洞都没留下。', context: 'Casual praise' }],
      boundaries: { natural: ['enthusiastic social praise', 'fandom reactions', 'meme-like comments'], avoid: ['measured professional evaluation', 'formal performance reviews'], note: 'It is an intensified extension of “ate”, not a separate literal food comment.' },
      relations: []
    },
    'internet-ratio': {
      identity: { category: 'Internet Culture', collections: ['online-reactions-meme-culture'], contexts: ['Social media', 'Comments', 'Online arguments'], tone: ['Competitive', 'Teasing', 'Public'] },
      meaning: { core: 'Turns a visible imbalance in platform engagement between an original post and a reply or counter-response into a public social judgment.', zh: '把原帖与回复之间公开可见的互动量差异转化为一种社会评价', feeling: 'The crowd’s visible response has become part of the argument.' },
      context: { whyPeopleUseIt: 'It compresses engagement metrics, public imbalance, and the feeling of a social verdict into one short reaction.', culturalNote: 'Platform mechanics and slang usage can evolve, so the concept is broader than one platform’s exact metric rule.' },
      usage: { commonPatterns: ['ratio', 'you got ratioed', 'the reply ratioed the post'] },
      examples: [{ text: 'The reply got far more engagement than the original post. Ratio.', zh: '那条回复的互动量远超原帖，评论区公开压过去了。', context: 'Public platform reaction' }, { text: 'People are calling it a ratio, but that does not settle who is right.', zh: '大家都说这是被 ratio 了，但这并不能决定谁才是对的。', context: 'Online argument' }],
      boundaries: { natural: ['discussing visible engagement dynamics', 'casual platform commentary'], avoid: ['formal analysis', 'treating popularity as proof of factual correctness'], note: 'A ratio reports public engagement dynamics, not truth.' },
      relations: []
    },
    'ai-workflow': {
      identity: { category: 'AI Builder', collections: ['building-with-ai'], contexts: ['AI product architecture', 'Engineering chat', 'Workflow design'], tone: ['Technical', 'Process-focused', 'Neutral'] },
      meaning: { core: 'An organized structure of steps, rules, tools, states, or handoffs that moves work from input toward an outcome.', zh: '由步骤、规则、工具、状态或交接组成、把工作从输入推进到结果的组织结构', feeling: 'This describes the shape of the process, not necessarily who is making each decision.' },
      context: { whyPeopleUseIt: 'Builders need to discuss how work is orchestrated independently of how much autonomy any one component has.', culturalNote: 'A workflow may contain agents, and an agent may operate inside a workflow; they are not opposites.' },
      usage: { commonPatterns: ['AI workflow', 'workflow orchestration', 'route through the workflow', 'workflow step'] },
      examples: [{ text: 'The workflow routes the request, retrieves the policy, calls the tool, validates the result, and drafts a response.', zh: '这个工作流会分发请求、检索政策、调用工具、验证结果，再起草回复。', context: 'AI architecture discussion' }, { text: 'The agent handles one step inside the workflow; the workflow still owns the handoffs.', zh: 'agent 只负责工作流中的一个步骤，整体交接仍由工作流负责。', context: 'Engineering design review' }],
      boundaries: { natural: ['AI architecture', 'engineering planning', 'orchestration discussions'], avoid: ['calling every multi-step application an agent', 'treating workflow and agent as mutually exclusive'], note: 'Workflow describes process structure, not necessarily component autonomy.' },
      relations: []
    },
    'ai-memory': {
      identity: { category: 'AI Builder', collections: ['building-with-ai'], contexts: ['AI product architecture', 'State design', 'Engineering chat'], tone: ['Technical', 'Practical', 'Precise'] },
      meaning: { core: 'A system-level persistence and retrieval mechanism that lets past information matter again later.', zh: '让过去的信息能够在之后再次发挥作用的系统级持久化与检索机制', feeling: 'The system can bring relevant past information forward again.' },
      context: { whyPeopleUseIt: 'Builders use memory to describe stored history, preferences, summaries, records, or checkpoints that can be retrieved across time.', culturalNote: 'Memory may use history, state, databases, summaries, embeddings, preferences, or checkpoints; it does not mean the base model permanently retained everything.' },
      usage: { commonPatterns: ['conversation memory', 'persistent memory', 'retrieve a memory', 'memory store'] },
      examples: [{ text: 'We store the user’s preferred output format and retrieve it on the next session.', zh: '我们保存用户偏好的输出格式，并在下一次会话中取回。', context: 'AI product behavior' }, { text: 'The summary is memory for the application, not a permanent change to the base model.', zh: '这个摘要是应用层的记忆，并不会永久改变基础模型。', context: 'AI architecture explanation' }],
      boundaries: { natural: ['state architecture', 'AI product design', 'persistence and retrieval discussions'], avoid: ['saying the model remembers every old chat automatically', 'equating memory with the current context window'], note: 'Memory can retrieve information into the context window later.' },
      relations: [{ target: 'ai-context-window', type: 'same-context' }]
    },
    'ai-context-window': {
      identity: { category: 'AI Builder', collections: ['building-with-ai'], contexts: ['Model calls', 'AI architecture', 'Engineering chat'], tone: ['Technical', 'Precise', 'Cautionary'] },
      meaning: { core: 'The information available to a model within the current inference or call, subject to the model’s context limits.', zh: '模型在当前推理或调用中能够看到的信息范围，受上下文容量限制', feeling: 'This is the working information the model has available right now.' },
      context: { whyPeopleUseIt: 'Builders use the term to reason about what a model can currently attend to, not merely to quote a token-capacity number.', culturalNote: 'A larger context does not mean every included detail is used equally well, and stored past information still has to be retrieved into the current context.' },
      usage: { commonPatterns: ['context window limit', 'fit in the context window', 'current context', 'long-context model'] },
      examples: [{ text: 'The full trace will not fit in the current context window, so we need a summary.', zh: '完整追踪记录放不进当前上下文窗口，所以我们需要摘要。', context: 'Model call planning' }, { text: 'Memory can retrieve the old preference into the next call’s context window.', zh: '记忆机制可以把旧偏好取回到下一次调用的上下文窗口里。', context: 'AI architecture discussion' }],
      boundaries: { natural: ['model-call planning', 'context limits', 'AI architecture discussions'], avoid: ['treating context size as long-term memory', 'assuming more context guarantees better use or better answers'], note: 'Past information existing somewhere does not mean the model can see it now.' },
      relations: []
    },
    'ai-grounding': {
      identity: { category: 'AI Builder', collections: ['building-with-ai'], contexts: ['AI reliability', 'Knowledge systems', 'Engineering chat'], tone: ['Technical', 'Cautionary', 'Evidence-focused'] },
      meaning: { core: 'Anchoring an output to an external basis such as evidence, retrieved material, structured state, constraints, a database, search result, or tool result.', zh: '让输出锚定在外部依据上，例如证据、检索资料、结构化状态、约束、数据库或工具结果', feeling: 'This answer should be traceable to something outside unsupported generation.' },
      context: { whyPeopleUseIt: 'Builders use grounding to describe how an answer is connected to relevant evidence or system state instead of relying only on unsupported model generation.', culturalNote: 'RAG can support grounding, but grounding is broader than RAG and never guarantees truth; sources, retrieval, interpretation, or reasoning can still fail.' },
      usage: { commonPatterns: ['grounded answer', 'ground the response in docs', 'grounding source', 'grounded generation'] },
      examples: [{ text: 'The answer is grounded in the policy database, so we can show which record supports it.', zh: '这个回答基于政策数据库，因此我们可以展示支持它的具体记录。', context: 'AI reliability review' }, { text: 'Adding documents is not enough; the retrieved passage must actually support the claim.', zh: '加入文档还不够，检索到的段落必须真的支持这个结论。', context: 'Knowledge-system design' }],
      boundaries: { natural: ['AI reliability', 'retrieval systems', 'evidence and tool-result discussions'], avoid: ['assuming more context automatically grounds an answer', 'claiming grounding makes hallucination impossible', 'treating grounding as identical to RAG'], note: 'A grounded answer can still be wrong when its source or reasoning fails.' },
      relations: []
    },
    'ai-system-prompt': {
      identity: { category: 'AI Builder', collections: ['building-with-ai'], contexts: ['AI product architecture', 'Prompt design', 'Engineering chat'], tone: ['Technical', 'Directive', 'Cautionary'] },
      meaning: { core: 'A high-priority instruction layer used to shape a model’s role, behavior, constraints, and task framing within an application.', zh: '应用中用于设定模型角色、行为、约束和任务框架的高优先级指令层', feeling: 'This is a behavioral instruction layer, not absolute control over the system.' },
      context: { whyPeopleUseIt: 'Builders need a central place for role instructions, behavioral defaults, constraints, and application framing without repeating them in every user message.', culturalNote: 'Real application behavior may also depend on code, tools, state, validators, permissions, and guardrails.' },
      usage: { commonPatterns: ['system prompt', 'system-level instruction', 'system prompt template', 'prompt hierarchy'] },
      examples: [{ text: 'The system prompt tells the assistant to answer as a concise support agent.', zh: 'system prompt 要求助手以简洁的客服角色回答。', context: 'Prompt design' }, { text: 'The system prompt says to return JSON, but the application validator still rejects invalid output.', zh: 'system prompt 要求返回 JSON，但应用验证器仍会拒绝格式无效的输出。', context: 'AI application architecture' }],
      boundaries: { natural: ['prompt design', 'AI product architecture', 'behavioral instruction discussions'], avoid: ['treating it as permanent model programming', 'assuming it guarantees deterministic compliance', 'using it as a security boundary by itself'], note: 'Rules that must be guaranteed should be enforced through application mechanisms.' },
      relations: []
    },
    'ai-eval': {
      identity: { category: 'AI Builder', collections: ['building-with-ai'], contexts: ['AI evaluation', 'Engineering chat', 'Model iteration'], tone: ['Technical', 'Evidence-focused', 'Cautionary'] },
      meaning: { core: 'A repeatable way to test AI-system behavior against representative cases, criteria, expected properties, or metrics.', zh: '用有代表性的案例、标准、预期性质或指标重复测试 AI 系统表现的方法', feeling: 'We need repeatable evidence to know whether this actually improved.' },
      context: { whyPeopleUseIt: 'AI behavior is probabilistic, so builders use evals to compare changes, surface regressions, and inspect failure modes instead of relying on a few memorable demos.', culturalNote: 'An eval is only as useful as the cases and criteria it represents; benchmark scores and LLM judges are not automatically the whole product truth.' },
      usage: { commonPatterns: ['run an eval', 'eval set', 'eval regression', 'LLM-as-judge eval'] },
      examples: [{ text: 'The new prompt improved the eval score, but it still fails on long customer histories.', zh: '新提示让 eval 分数提高了，但遇到较长的客户历史记录时仍然失败。', context: 'Model iteration' }, { text: 'Let’s add representative failure cases before calling the retrieval change better.', zh: '在说检索改动更好之前，我们先加入有代表性的失败案例。', context: 'Evaluation planning' }],
      boundaries: { natural: ['AI testing', 'regression tracking', 'model iteration discussions'], avoid: ['calling a few manual prompts a complete evaluation', 'treating one benchmark score as the whole product', 'assuming an LLM judge is automatically objective'], note: 'Cases and criteria define what the eval can actually tell you.' },
      relations: [{ target: 'ai-hallucination', type: 'same-context' }]
    },
    'github-ship': {
      identity: { category: 'GitHub / Development', collections: ['developer-communication', 'building-products-online'], contexts: ['Release decisions', 'Engineering chat', 'Product delivery'], tone: ['Decisive', 'Practical', 'Work-casual'] },
      meaning: { core: 'Marks the transition from private construction into real use, where users and real conditions can provide feedback.', zh: '表示从内部构建转向真实使用，让用户和现实条件开始提供反馈', feeling: 'Stop keeping this entirely inside the build process; put it in front of reality.' },
      context: { whyPeopleUseIt: 'Builder culture needs a compact word for crossing from iteration into release and learning from real use.', culturalNote: 'Shipping does not mean perfect, permanently complete, reliable by definition, or certified safe.' },
      usage: { commonPatterns: ['ship the fix', 'ready to ship', 'ship to users', 'ship and learn'] },
      examples: [{ text: 'The prototype is good enough for a small beta; let’s ship it and watch the feedback.', zh: '这个原型已经足够支持小范围测试了，我们上线看看真实反馈。', context: 'Product release decision' }, { text: 'We shipped the patch, but that does not mean the investigation is finished.', zh: '补丁已经发布，但这不代表调查工作已经结束。', context: 'Engineering follow-up' }],
      boundaries: { natural: ['release decisions', 'engineering chat', 'product delivery discussions'], avoid: ['treating shipped as perfect or permanently complete', 'equating shipping with safety or quality certification'], note: 'The useful transition is build → ship → reality feedback.' },
      relations: []
    }
  };

  window.SIDEGLANCE_SIGNAL_V2 = v2;
}());
