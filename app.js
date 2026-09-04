// StartFEST 2026 schedule app — vanilla JS, no build step.

(() => {
  'use strict';

  const STORAGE = { selections: 'sf-selections', name: 'sf-name', theme: 'sf-theme', asked: 'sf-asked-name' };

  const state = {
    tab: '1', // '1' | '2' | 'agenda'
    selections: new Set(loadJSON(STORAGE.selections, [])),
    userName: localStorage.getItem(STORAGE.name) || '',
    expanded: new Set(),
    pendingStar: null,
  };

  const $ = (sel) => document.querySelector(sel);
  const view = $('#view');

  // ── Storage helpers ────────────────────────────────────────────────────────
  function loadJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  }
  function persistSelections() {
    try { localStorage.setItem(STORAGE.selections, JSON.stringify([...state.selections])); } catch { /* private mode */ }
  }

  // ── Time helpers (all Mountain Time) ───────────────────────────────────────
  const toMin = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
  function fmt12(hhmm) {
    const [h, m] = hhmm.split(':').map(Number);
    const am = h < 12;
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${String(m).padStart(2, '0')} ${am ? 'AM' : 'PM'}`;
  }

  function denverNow() {
    const override = new URLSearchParams(location.search).get('t');
    if (override && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(override)) {
      return { date: override.slice(0, 10), minutes: toMin(override.slice(11, 16)) };
    }
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: CONFERENCE.timezone, year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: false,
    }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    const hour = get('hour') === '24' ? '00' : get('hour');
    return { date: `${get('year')}-${get('month')}-${get('day')}`, minutes: Number(hour) * 60 + Number(get('minute')) };
  }

  // ── Data helpers ───────────────────────────────────────────────────────────
  const byId = Object.fromEntries(SESSIONS.map((s) => [s.id, s]));

  function trackClass(track) { return TRACKS[track] || 'resource'; }

  function hashCode(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
    return Math.abs(h);
  }

  function demoAttendees(session) {
    const h = hashCode(session.id);
    const count = 3 + (h % 6);
    const names = [];
    for (let i = 0; i < count; i++) names.push(DEMO_ATTENDEES[(h + i * 7) % DEMO_ATTENDEES.length]);
    return [...new Set(names)];
  }

  function attendeesFor(session) {
    const names = demoAttendees(session);
    const you = state.selections.has(session.id) && state.userName;
    return { names, you };
  }

  const overlaps = (a, b) => a.day === b.day && toMin(a.start) < toMin(b.end) && toMin(b.start) < toMin(a.end);

  function conflictIdsIn(sessions) {
    const ids = new Set();
    for (let i = 0; i < sessions.length; i++) {
      for (let j = i + 1; j < sessions.length; j++) {
        if (overlaps(sessions[i], sessions[j])) { ids.add(sessions[i].id); ids.add(sessions[j].id); }
      }
    }
    return ids;
  }

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const initials = (name) => name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const avatarColor = (name) => `hsl(${hashCode(name) % 360} 45% 45%)`;

  // ── Calendar export ────────────────────────────────────────────────────────
  function icsDate(dateStr, hhmm) { return `${dateStr.replaceAll('-', '')}T${hhmm.replace(':', '')}00`; }

  function buildICS(sessions) {
    const lines = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//StartFEST 2026//Schedule//EN', 'CALSCALE:GREGORIAN',
      'BEGIN:VTIMEZONE', 'TZID:America/Denver',
      'BEGIN:DAYLIGHT', 'TZOFFSETFROM:-0700', 'TZOFFSETTO:-0600', 'TZNAME:MDT', 'DTSTART:19700308T020000',
      'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU', 'END:DAYLIGHT',
      'BEGIN:STANDARD', 'TZOFFSETFROM:-0600', 'TZOFFSETTO:-0700', 'TZNAME:MST', 'DTSTART:19701101T020000',
      'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU', 'END:STANDARD', 'END:VTIMEZONE',
    ];
    for (const s of sessions) {
      const date = CONFERENCE.days.find((d) => d.day === s.day).date;
      const desc = [s.speaker, s.org].filter(Boolean).join(' — ');
      lines.push(
        'BEGIN:VEVENT',
        `UID:${s.id}@startfest2026`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
        `DTSTART;TZID=America/Denver:${icsDate(date, s.start)}`,
        `DTEND;TZID=America/Denver:${icsDate(date, s.end)}`,
        `SUMMARY:${s.title.replace(/,/g, '\\,')}`,
        `LOCATION:${(s.room + ' · ' + CONFERENCE.venue).replace(/,/g, '\\,')}`,
        `DESCRIPTION:${desc.replace(/,/g, '\\,')}`,
        'END:VEVENT',
      );
    }
    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
  }

  function downloadICS(sessions, filename) {
    const blob = new Blob([buildICS(sessions)], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), { href: url, download: filename });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  function googleCalLink(s) {
    // MDT is UTC-6 in June.
    const date = CONFERENCE.days.find((d) => d.day === s.day).date;
    const utc = (hhmm) => {
      const total = toMin(hhmm) + 360;
      const d = new Date(`${date}T00:00:00Z`);
      d.setUTCMinutes(total);
      return d.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
    };
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `${s.title} · StartFEST`,
      dates: `${utc(s.start)}/${utc(s.end)}`,
      location: `${s.room} · ${CONFERENCE.venue}`,
      details: [s.speaker, s.org].filter(Boolean).join(' — '),
    });
    return `https://calendar.google.com/calendar/render?${params}`;
  }

  // ── Now / Next banner ──────────────────────────────────────────────────────
  function renderNowBanner() {
    const banner = $('#nowBanner');
    const now = denverNow();
    const dayMeta = CONFERENCE.days.find((d) => d.date === now.date);
    const day1 = CONFERENCE.days[0];

    const row = (chip, chipClass, title, sub) => `
      <div class="now-row">
        <span class="now-chip ${chipClass}">${chip}</span>
        <div class="what"><strong>${title}</strong>${sub ? `<span>${sub}</span>` : ''}</div>
      </div>`;

    if (!dayMeta) {
      const before = now.date < day1.date;
      banner.innerHTML = `<div class="rows">${row(
        before ? 'Soon' : 'Wrapped', before ? 'next' : '',
        before ? `StartFEST starts ${day1.full} · 9:00 AM MDT` : 'That’s a wrap on StartFEST 2026!',
        before ? 'First up: Welcome — Mainstage' : 'Thanks for coming. See you next year!',
      )}</div>`;
      return;
    }

    const todays = SESSIONS.filter((s) => s.day === dayMeta.day && !s.isBreak);
    const live = todays.filter((s) => toMin(s.start) <= now.minutes && now.minutes < toMin(s.end));
    const upcoming = todays.filter((s) => toMin(s.start) > now.minutes).sort((a, b) => toMin(a.start) - toMin(b.start));
    const nextStart = upcoming[0]?.start;
    const next = nextStart ? upcoming.filter((s) => s.start === nextStart) : [];

    const label = (list) => {
      const starred = list.filter((s) => state.selections.has(s.id));
      const pick = (starred[0] || list[0]);
      const extra = list.length - 1;
      const star = state.selections.has(pick.id) ? ' <span class="mine">★ on your agenda</span>' : '';
      return {
        title: esc(pick.title) + (extra > 0 ? ` <span style="color:var(--text-3);font-weight:600">+${extra} more</span>` : ''),
        sub: `${esc(pick.room)} · ${fmt12(pick.start)}–${fmt12(pick.end)}${star}`,
      };
    };

    let html = '';
    if (live.length) { const l = label(live); html += row('Now', 'live', l.title, l.sub); }
    if (next.length) { const n = label(next); html += row('Next', 'next', `${n.title}`, n.sub); }
    if (!html) html = row('Done', '', `Day ${dayMeta.day} has wrapped`, dayMeta.day === 1 ? 'Day 2 kicks off Wednesday at 8:45 AM' : 'Thanks for coming!');
    banner.innerHTML = `<div class="rows">${html}</div>`;
  }

  // ── Session card ───────────────────────────────────────────────────────────
  function sessionCard(s, { conflict = false, showDay = false } = {}) {
    const selected = state.selections.has(s.id);
    const expanded = state.expanded.has(s.id);
    const { names, you } = attendeesFor(s);
    const goingCount = names.length + (you ? 1 : 0);
    const dayLabel = showDay ? `${CONFERENCE.days.find((d) => d.day === s.day).label} · ` : '';

    const attendeeChips = [
      you ? `<span class="attendee you"><span class="avatar" style="background:${avatarColor(state.userName)}">${initials(state.userName)}</span>${esc(state.userName)} (you)</span>` : '',
      ...names.map((n) => `<span class="attendee"><span class="avatar" style="background:${avatarColor(n)}">${initials(n)}</span>${esc(n)}</span>`),
    ].join('');

    return `
      <article class="card ${selected ? 'selected' : ''} ${conflict ? 'conflict' : ''}" data-id="${s.id}">
        <div class="card-main" data-action="expand" role="button" tabindex="0" aria-expanded="${expanded}" aria-label="${esc(s.title)} — details">
          <div class="card-body">
            <div class="badges">
              ${s.track && s.track !== 'Mainstage' ? `<span class="track-badge" style="background:var(--track-${trackClass(s.track)})">${esc(s.track)}</span>` : ''}
              <span class="room-chip">📍 ${esc(s.room)}</span>
            </div>
            <h3 class="card-title">${esc(s.title)}</h3>
            ${s.speaker || s.org ? `<p class="card-speaker">${esc(s.speaker)}${s.speaker && s.org ? ' · ' : ''}${esc(s.org)}</p>` : ''}
            <p class="card-going">${dayLabel}${fmt12(s.start)}–${fmt12(s.end)} · 👥 ${goingCount} going${expanded ? '' : ' · tap for details'}</p>
          </div>
          <button class="star-btn ${selected ? 'on' : ''}" data-action="star"
            aria-label="${selected ? 'Remove from' : 'Add to'} my agenda">${selected ? '★' : '☆'}</button>
        </div>
        ${expanded ? `
        <div class="card-details">
          <h4>Who's going</h4>
          <div class="attendees">${attendeeChips}</div>
          <div class="detail-actions">
            <a class="btn" href="${googleCalLink(s)}" target="_blank" rel="noopener">📅 Google Calendar</a>
            <button class="btn" data-action="ics">⬇️ .ics file</button>
          </div>
        </div>` : ''}
      </article>`;
  }

  // ── Day view ───────────────────────────────────────────────────────────────
  function renderDay(dayNum) {
    const dayMeta = CONFERENCE.days.find((d) => d.day === dayNum);
    const sessions = SESSIONS.filter((s) => s.day === dayNum);
    const now = denverNow();
    const isToday = now.date === dayMeta.date;

    const slots = [];
    for (const s of sessions) {
      const key = `${s.start}-${s.end}`;
      const last = slots[slots.length - 1];
      if (last && last.key === key && !s.isBreak && !last.isBreak) last.items.push(s);
      else slots.push({ key, start: s.start, end: s.end, isBreak: !!s.isBreak, items: [s] });
    }

    let html = `<div class="day-heading"><h2>Day ${dayNum} — ${dayMeta.full}</h2><span>${sessions.filter((s) => !s.isBreak).length} sessions</span></div>`;
    for (const slot of slots) {
      if (slot.isBreak) {
        html += `<div class="break-row">☕ ${esc(slot.items[0].title)} · ${fmt12(slot.start)}–${fmt12(slot.end)}</div>`;
        continue;
      }
      const liveNow = isToday && toMin(slot.start) <= now.minutes && now.minutes < toMin(slot.end);
      html += `
        <section class="timeslot">
          <p class="time">${fmt12(slot.start)} – ${fmt12(slot.end)}${liveNow ? '<span class="live-dot">● happening now</span>' : ''}</p>
          <div class="slot-cards">
            ${slot.items.map((s) => `<div class="${slot.items.length === 1 ? 'full' : ''}">${sessionCard(s)}</div>`).join('')}
          </div>
        </section>`;
    }
    view.innerHTML = html;
  }

  // ── Agenda view ────────────────────────────────────────────────────────────
  function renderAgenda() {
    const picked = SESSIONS.filter((s) => state.selections.has(s.id))
      .sort((a, b) => a.day - b.day || toMin(a.start) - toMin(b.start));
    const conflicts = conflictIdsIn(picked);

    let html = `
      <div class="agenda-header">
        <h2>My Agenda</h2>
        <p>${state.userName ? `Hi ${esc(state.userName)} — ` : ''}${picked.length} session${picked.length === 1 ? '' : 's'} selected${conflicts.size ? ` · <strong style="color:var(--danger)">${conflicts.size} overlapping</strong>` : ''}</p>
        <div class="agenda-tools">
          ${picked.length ? `<button class="btn primary" data-action="ics-all">📅 Add all to calendar (.ics)</button>` : ''}
          <button class="btn" data-action="edit-name">👤 ${state.userName ? 'Change name' : 'Set your name'}</button>
        </div>
      </div>`;

    if (!picked.length) {
      html += `
        <div class="empty-state">
          <div class="big">🗓️</div>
          <h3>Nothing here yet</h3>
          <p>Tap the ☆ star on any session to build your personal agenda.</p>
          <button class="btn primary" data-action="go-day1">Browse the schedule</button>
        </div>`;
      view.innerHTML = html;
      return;
    }

    let lastDay = 0;
    let lastConflictKey = '';
    for (const s of picked) {
      if (s.day !== lastDay) {
        const meta = CONFERENCE.days.find((d) => d.day === s.day);
        html += `<div class="day-heading"><h2>Day ${s.day} — ${meta.full}</h2></div>`;
        lastDay = s.day;
        lastConflictKey = '';
      }
      const inConflict = conflicts.has(s.id);
      if (inConflict) {
        const peers = picked.filter((p) => p.id !== s.id && overlaps(p, s)).map((p) => p.title);
        const key = `${s.day}-${[s.title, ...peers].sort().join('|')}`;
        if (key !== lastConflictKey) {
          html += `<div class="conflict-note">⚠️ You've selected ${peers.length + 1} sessions that overlap in this time block — pick one, or plan to hop rooms.</div>`;
          lastConflictKey = key;
        }
      }
      html += sessionCard(s, { conflict: inConflict, showDay: false });
      html += '<div style="height:0.6rem"></div>';
    }
    view.innerHTML = html;
  }

  // ── Render root ────────────────────────────────────────────────────────────
  function render() {
    renderNowBanner();
    for (const t of ['1', '2', 'agenda']) {
      $(`#tab-${t}`).setAttribute('aria-selected', String(state.tab === t));
    }
    const count = state.selections.size;
    const badge = $('#agendaCount');
    badge.hidden = count === 0;
    badge.textContent = count;

    if (state.tab === 'agenda') renderAgenda();
    else renderDay(Number(state.tab));
  }

  // ── Name dialog ────────────────────────────────────────────────────────────
  const nameDialog = $('#nameDialog');
  function openNameDialog() {
    $('#nameInput').value = state.userName;
    nameDialog.showModal();
  }
  $('#nameSave').addEventListener('click', () => {
    const val = $('#nameInput').value.trim();
    if (val) {
      state.userName = val;
      try { localStorage.setItem(STORAGE.name, val); } catch { /* ignore */ }
    }
    nameDialog.close();
    render();
    if (val) toast(`Welcome, ${val}! You'll show up in "Who's going".`);
  });
  $('#nameSkip').addEventListener('click', () => { nameDialog.close(); render(); });
  $('#nameInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('#nameSave').click(); });

  // ── Toast ──────────────────────────────────────────────────────────────────
  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
  }

  // ── Interactions ───────────────────────────────────────────────────────────
  function toggleStar(id) {
    const s = byId[id];
    if (state.selections.has(id)) {
      state.selections.delete(id);
      toast('Removed from your agenda');
    } else {
      state.selections.add(id);
      const clash = SESSIONS.filter((o) => state.selections.has(o.id) && o.id !== id && overlaps(o, s));
      toast(clash.length ? `⚠️ Added — overlaps with “${clash[0].title}”` : 'Added to your agenda ★');
      if (!state.userName && !localStorage.getItem(STORAGE.asked)) {
        try { localStorage.setItem(STORAGE.asked, '1'); } catch { /* ignore */ }
        setTimeout(openNameDialog, 350);
      }
    }
    persistSelections();
    render();
  }

  view.addEventListener('click', (e) => {
    const star = e.target.closest('[data-action="star"]');
    const card = e.target.closest('.card');
    if (star && card) { e.stopPropagation(); toggleStar(card.dataset.id); return; }

    const ics = e.target.closest('[data-action="ics"]');
    if (ics && card) { downloadICS([byId[card.dataset.id]], `startfest-${card.dataset.id}.ics`); return; }

    if (e.target.closest('[data-action="ics-all"]')) {
      const picked = SESSIONS.filter((s) => state.selections.has(s.id));
      downloadICS(picked, 'startfest-my-agenda.ics');
      toast('Calendar file downloaded — open it to import');
      return;
    }
    if (e.target.closest('[data-action="edit-name"]')) { openNameDialog(); return; }
    if (e.target.closest('[data-action="go-day1"]')) { state.tab = '1'; render(); return; }

    const main = e.target.closest('[data-action="expand"]');
    if (main && card) {
      const id = card.dataset.id;
      state.expanded.has(id) ? state.expanded.delete(id) : state.expanded.add(id);
      render();
    }
  });

  view.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-action="expand"]')) {
      e.preventDefault();
      const card = e.target.closest('.card');
      if (!card) return;
      const id = card.dataset.id;
      state.expanded.has(id) ? state.expanded.delete(id) : state.expanded.add(id);
      render();
    }
  });

  for (const t of ['1', '2', 'agenda']) {
    $(`#tab-${t}`).addEventListener('click', () => { state.tab = t; render(); window.scrollTo({ top: 0 }); });
  }

  // ── Theme ──────────────────────────────────────────────────────────────────
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    $('#themeToggle').textContent = theme === 'dark' ? '☀️' : '🌙';
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#101116' : '#f7f7f5';
  }
  const savedTheme = localStorage.getItem(STORAGE.theme);
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme || (systemDark ? 'dark' : 'light'));
  $('#themeToggle').addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(STORAGE.theme, next); } catch { /* ignore */ }
    applyTheme(next);
  });

  // Default to whichever conference day is live (or day 1 otherwise).
  const today = denverNow().date;
  const liveDay = CONFERENCE.days.find((d) => d.date === today);
  if (liveDay) state.tab = String(liveDay.day);

  render();
  setInterval(renderNowBanner, 60_000);
})();
