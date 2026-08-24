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
    }
  };

  window.SIDEGLANCE_SIGNAL_V2 = v2;
}());
