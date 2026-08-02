(function () {
  'use strict';

  var storage = window.EnglishRadarStorage;
  var items = storage ? storage.getInbox() : [];
  var editingId = null;
  var editingMode = null;
  var deletingId = null;
  var form = document.querySelector('[data-inbox-form]');
  var feedback = document.querySelector('[data-inbox-feedback]');

  function now() { return new Date().toISOString(); }
  function setFeedback(message) { if (feedback) feedback.textContent = message || ''; }
  function value(formElement, name) { var field = formElement.elements[name]; return field ? field.value.trim() : ''; }
  function field(labelText, name, current, multiline, required) {
    var wrapper = document.createElement('div'); wrapper.className = 'form-field';
    var label = document.createElement('label'); label.htmlFor = 'edit-' + name; label.textContent = labelText + (required ? ' *' : ''); wrapper.appendChild(label);
    var input = document.createElement(multiline ? 'textarea' : 'input'); input.id = 'edit-' + name; input.name = name; input.value = current || ''; if (multiline) input.rows = 3; input.maxLength = 800; if (required) input.required = true; wrapper.appendChild(input); return wrapper;
  }
  function selectField(labelText, name, current, values, required) {
    var wrapper = document.createElement('div'); wrapper.className = 'form-field'; var label = document.createElement('label'); label.htmlFor = 'edit-' + name; label.textContent = labelText + (required ? ' *' : ''); wrapper.appendChild(label); var select = document.createElement('select'); select.id = 'edit-' + name; select.name = name; values.forEach(function (optionValue) { var option = document.createElement('option'); option.value = optionValue; option.textContent = optionValue; option.selected = optionValue === current; select.appendChild(option); }); wrapper.appendChild(select); return wrapper;
  }
  function splitList(value) { return value.split(',').map(function (part) { return part.trim(); }).filter(Boolean); }
  function joinList(value) { return Array.isArray(value) ? value.join(', ') : ''; }
  function find(id) { return items.find(function (item) { return item && item.id === id; }); }
  function saveItems(message) { var saved = storage && storage.saveInbox(items); if (!saved) { setFeedback('Inbox could not be saved in this browser.'); return false; } setFeedback(message || ''); return true; }
  function refresh() { items = storage ? storage.getInbox() : []; render(); }
  function makeButton(label, className, handler) { var button = document.createElement('button'); button.type = 'button'; button.className = className || ''; button.textContent = label; button.addEventListener('click', handler); return button; }
  function actionRow(item, decoded) {
    var actions = document.createElement('div'); actions.className = 'inbox-actions';
    if (decoded) {
      var link = document.createElement('a'); link.href = './learn.html?mode=lookup&source=inbox&signal=' + encodeURIComponent(item.decodedSignal.id); link.textContent = 'View in Dictionary'; actions.appendChild(link); actions.appendChild(makeButton('Edit decode', '', function () { editingId = item.id; editingMode = 'decode'; render(); })); actions.appendChild(makeButton('Move back to undecoded', '', function () { if (storage && storage.updateInboxItem(item.id, { status: 'undecoded', decodedSignal: null, updatedAt: now() })) refresh(); else setFeedback('Inbox could not be saved in this browser.'); }));
    } else {
      actions.appendChild(makeButton('Decode', '', function () { editingId = item.id; editingMode = 'decode'; render(); })); actions.appendChild(makeButton('Edit', '', function () { editingId = item.id; editingMode = 'capture'; render(); }));
    }
    actions.appendChild(makeButton('Delete', 'delete-action', function () { deletingId = item.id; render(); })); return actions;
  }
  function confirmRow(item) {
    var row = document.createElement('div'); row.className = 'delete-confirm'; row.appendChild(document.createTextNode('Delete this signal? ')); row.appendChild(makeButton('Cancel', '', function () { deletingId = null; render(); })); row.appendChild(makeButton('Delete', 'delete-action', function () { if (storage && storage.deleteInboxItem(item.id)) { deletingId = null; refresh(); } else setFeedback('Inbox could not be saved in this browser.'); })); return row;
  }
  function editForm(item, mode) {
    var isDecode = mode === 'decode'; var target = isDecode && item.decodedSignal ? item.decodedSignal : {};
    var edit = document.createElement('form'); edit.className = 'inline-edit-form'; edit.noValidate = true;
    if (!isDecode) { edit.appendChild(field('Expression', 'expression', item.expression, false, true)); edit.appendChild(field('Source', 'source', item.source, false, false)); edit.appendChild(field('Original sentence', 'originalSentence', item.originalSentence, true, false)); edit.appendChild(field('Personal note', 'personalNote', item.personalNote, true, false)); }
    else { edit.appendChild(field('Meaning in Chinese', 'meaningZh', target.meaningZh, true, true)); edit.appendChild(selectField('Category', 'category', target.category || 'Internet Culture', ['Internet Culture', 'AI Builder', 'GitHub', 'Product Design', 'Fandom', 'Sports', 'Everyday English', 'Other'], true)); edit.appendChild(field('Meaning in English', 'meaningEn', target.meaningEn, true, false)); edit.appendChild(field('Pronunciation', 'pronunciation', target.pronunciation, false, false)); edit.appendChild(field('Speech text', 'speechText', target.speechText, false, false)); edit.appendChild(field('Platforms', 'platforms', joinList(target.platforms), false, false)); edit.appendChild(field('Tone', 'tone', joinList(target.tone), false, false)); edit.appendChild(field('Example in English', 'exampleEn', target.exampleEn, true, false)); edit.appendChild(field('Example in Chinese', 'exampleZh', target.exampleZh, true, false)); edit.appendChild(field('Use it when', 'useWhen', target.useWhen, true, false)); edit.appendChild(field('Avoid it when', 'avoidWhen', target.avoidWhen, true, false)); edit.appendChild(field('Chinese feeling', 'chineseFeeling', target.chineseFeeling, true, false)); }
    var errors = document.createElement('span'); errors.className = 'field-error'; errors.setAttribute('aria-live', 'polite'); edit.appendChild(errors);
    edit.appendChild(makeButton('Save', 'inline-save', function () {
      var expression = isDecode ? item.expression.trim() : value(edit, 'expression');
      if (!expression) { errors.textContent = 'Expression is required.'; return; }
      if (isDecode && !value(edit, 'meaningZh')) { errors.textContent = 'Meaning in Chinese is required.'; return; }
      if (isDecode && !value(edit, 'category')) { errors.textContent = 'Category is required.'; return; }
      var updates;
      if (!isDecode) updates = { expression: expression, source: value(edit, 'source'), originalSentence: value(edit, 'originalSentence'), personalNote: value(edit, 'personalNote'), updatedAt: now() };
      else {
        var old = item.decodedSignal || {}; var id = old.id || 'personal-' + item.id;
        updates = { status: 'decoded', updatedAt: now(), decodedSignal: Object.assign({}, old, { id: id, term: expression, displayTerm: expression.toUpperCase(), speechText: value(edit, 'speechText') || expression, pronunciation: value(edit, 'pronunciation'), category: value(edit, 'category'), platforms: splitList(value(edit, 'platforms')), tone: splitList(value(edit, 'tone')), status: 'Personal', formality: 'Very informal', meaningEn: value(edit, 'meaningEn'), meaningZh: value(edit, 'meaningZh'), exampleEn: value(edit, 'exampleEn'), exampleZh: value(edit, 'exampleZh'), useWhen: value(edit, 'useWhen'), avoidWhen: value(edit, 'avoidWhen'), chineseFeeling: value(edit, 'chineseFeeling') }) };
      }
      if (storage && storage.updateInboxItem(item.id, updates)) { editingId = null; editingMode = null; refresh(); setFeedback(isDecode ? 'Signal decoded.' : 'Inbox item updated.'); } else setFeedback('Inbox could not be saved in this browser.');
    }));
    edit.appendChild(makeButton('Cancel', '', function () { editingId = null; editingMode = null; render(); })); return edit;
  }
  function renderItem(item) {
    var decoded = item.status === 'decoded' && item.decodedSignal && item.decodedSignal.id; var article = document.createElement('article'); article.className = 'inbox-item';
    var heading = document.createElement('div'); heading.className = 'inbox-item-heading'; heading.appendChild(document.createElement('strong')).textContent = decoded ? item.decodedSignal.displayTerm : item.expression; heading.appendChild(document.createElement('span')).textContent = decoded ? 'DECODED' : 'UNDECODED'; article.appendChild(heading);
    if (decoded) { article.appendChild(document.createElement('p')).textContent = item.decodedSignal.meaningZh || '—'; var meta = document.createElement('div'); meta.className = 'inbox-item-meta'; meta.textContent = (item.decodedSignal.category || '—') + ' · Updated ' + (item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : '—'); article.appendChild(meta); } else { [['Source', item.source], ['Original sentence', item.originalSentence], ['Personal note', item.personalNote], ['Saved', item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—']].forEach(function (pair) { var line = document.createElement('p'); line.className = 'inbox-detail'; var label = document.createElement('span'); label.textContent = pair[0]; line.appendChild(label); line.appendChild(document.createTextNode(pair[1] || '—')); article.appendChild(line); }); }
    if (editingId === item.id) article.appendChild(editForm(item, editingMode)); else if (deletingId === item.id) article.appendChild(confirmRow(item)); else article.appendChild(actionRow(item, decoded)); return article;
  }
  function render() {
    var undecoded = items.filter(function (item) { return item && item.status !== 'decoded'; }).sort(function (a, b) { return new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime(); });
    var decoded = items.filter(function (item) { return item && item.status === 'decoded'; }).sort(function (a, b) { return new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime(); });
    ['undecoded', 'decoded'].forEach(function (kind) { var list = document.querySelector('[data-inbox-list="' + kind + '"]'); var empty = document.querySelector('[data-inbox-empty="' + kind + '"]'); var values = kind === 'undecoded' ? undecoded : decoded; list.textContent = ''; empty.hidden = values.length > 0; values.forEach(function (item) { list.appendChild(renderItem(item)); }); document.querySelectorAll('[data-inbox-count="' + kind + '"], [data-inbox-heading="' + kind + '"]').forEach(function (node) { node.textContent = String(values.length); }); });
  }
  if (form) form.addEventListener('submit', function (event) { event.preventDefault(); var expression = value(form, 'expression'); var error = document.querySelector('[data-error="expression"]'); error.textContent = ''; if (!expression) { error.textContent = 'Expression is required.'; form.elements.expression.focus(); return; } var stamp = now(); var item = { id: 'inbox-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6), expression: expression, source: value(form, 'source'), originalSentence: value(form, 'originalSentence'), personalNote: value(form, 'personalNote'), status: 'undecoded', createdAt: stamp, updatedAt: stamp, decodedSignal: null }; if (!storage || !storage.addInboxItem(item)) { setFeedback('Inbox could not be saved in this browser.'); return; } form.reset(); setFeedback('Signal captured.'); refresh(); });
  render();
}());
