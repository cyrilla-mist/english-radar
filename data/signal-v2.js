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
      relations: [{ target: 'product-ship', type: 'similar' }, { target: 'product-mvp', type: 'same-context' }, { target: 'github-lgtm', type: 'often-paired' }]
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
    }
  };

  window.SIDEGLANCE_SIGNAL_V2 = v2;
}());
