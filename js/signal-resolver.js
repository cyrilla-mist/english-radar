/* Provider-neutral normalized access for legacy and Signal v2 records. */
(function () {
  function list(value) {
    if (Array.isArray(value)) return value.slice();
    return value == null || value === '' ? [] : [value];
  }
  function relation(value, defaultType) {
    return (Array.isArray(value) ? value : []).map(function (item) {
      if (typeof item === 'string') return { target: item, type: defaultType || 'same-context' };
      return { target: item && (item.target || item.id || item.term) || '', type: item && item.type || defaultType || 'same-context' };
    }).filter(function (item) { return item.target; });
  }
  function resolve(raw) {
    var signal = raw || {};
    var overlay = (window.SIDEGLANCE_SIGNAL_V2 || {})[signal.id] || {};
    var v2 = signal.signalV2 || signal.v2 || overlay || {};
    var identity = v2.identity || {};
    var meaning = v2.meaning || {};
    var context = v2.context || {};
    var usage = v2.usage || {};
    var examples = Array.isArray(v2.examples) ? v2.examples : [];
    var boundaries = v2.boundaries || {};
    var legacyIdentity = signal.signalIdentity || {};
    var legacyExample = { text: signal.exampleEn || '', zh: signal.exampleZh || '' };
    return {
      id: signal.id || '', term: signal.term || '',
      identity: {
        category: identity.category || legacyIdentity.category || signal.category || '',
        collections: list(identity.collections), contexts: list(identity.contexts || legacyIdentity.usageContext || signal.usageContext),
        platforms: list(identity.platforms || signal.platforms), tone: list(identity.tone || legacyIdentity.tone || signal.tone)
      },
      meaning: {
        core: meaning.core || signal.meaningEn || '', zh: meaning.zh || signal.meaningZh || '',
        feeling: meaning.feeling || signal.chineseFeeling || ''
      },
      context: { whyPeopleUseIt: context.whyPeopleUseIt || signal.whyProductsUseItEn || signal.useWhen || '', culturalNote: context.culturalNote || signal.culturalContextEn || '' },
      usage: { commonPatterns: list(usage.commonPatterns) },
      examples: (examples.length ? examples : [legacyExample]).map(function (item) { return { text: item.text || item.exampleEn || '', zh: item.zh || item.exampleZh || '', context: item.context || '' }; }),
      boundaries: { natural: list(boundaries.natural || signal.useWhen), avoid: list(boundaries.avoid || signal.avoidWhen), note: boundaries.note || '' },
      relations: relation(v2.relations).concat(relation(signal.relatedTerms)).concat(relation(signal.confusedWith, 'contrast'))
    };
  }
  window.SideglanceSignalResolver = { resolve: resolve };
}());
