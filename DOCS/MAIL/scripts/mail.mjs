import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const MAIL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PM_BOX = 'vlthrlab-pm@agentmail.to';
const ROLES = {
  PM: ['PM', PM_BOX],
  DS: ['DS', 'vlthr-asset-generator@agentmail.to'],
  QA: ['QA', 'victoria-3416@agentmail.to'],
  SECRETARY: ['SECRETARY', 'vlthr-secretary@agentmail.to'],
  BACKEND: ['BACKEND', 'saviour-backend-engineer@agentmail.to'],
  FULLSTACK: ['FULLSTACK', 'fullstack-guy@agentmail.to'],
  DATABASE: ['DATABASE', 'sayveeyhur@agentmail.to'],
  UIUX: ['UIUX', 'uiux-expert@agentmail.to'],
  LIAISON: ['LIAISON', 'vlthrlabs@gmail.com'],
  SECURITY: ['PM', `${PM_BOX} (routed for SECURITY)`],
  DEVOPS: ['PM', `${PM_BOX} (routed for DEVOPS)`],
  FRONTEND: ['PM', `${PM_BOX} (routed for FRONTEND)`],
  INTEGRATIONS: ['PM', `${PM_BOX} (routed for INTEGRATIONS)`],
};
const TYPES = 'QDHRBEMC';
const [cmd, ...rest] = process.argv.slice(2);
const opt = (k, d) => { const i = rest.indexOf(`--${k}`); return i < 0 ? d : rest[i + 1]; };
const list = (s) => s.split(',').map((x) => x.trim()).filter(Boolean);
const box = (r) => { const x = ROLES[r]; if (!x) throw new Error(`unknown role ${r}`); return x[1]; };
const folderOf = (r) => ROLES[r][0];
const now = () => new Date().toISOString();
const check = (t) => { if (!t || t.length !== 1 || !TYPES.includes(t)) throw new Error(`type must be one of ${TYPES}`); return t; };
const uuid7 = () => {
  const b = crypto.randomBytes(16);
  const ms = BigInt(Date.now());
  for (let i = 0; i < 6; i++) b[i] = Number((ms >> BigInt(40 - 8 * i)) & 0xffn);
  b[6] = (b[6] & 0x0f) | 0x70;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = b.toString('hex');
  return [h.slice(0, 8), h.slice(8, 12), h.slice(12, 16), h.slice(16, 20), h.slice(20)].join('-');
};
const slug = (s) => s.toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-|-$/g, '').split('-').slice(0, 6).join('-');
const cc = (type, from) => ('DBE'.includes(type) && from !== 'PM' ? [PM_BOX] : []);
const envelope = ({ type, entity, from, to, replyTo, summary, ref, action, priority }) => [
  '```yaml',
  `message_id: ${uuid7()}`,
  `correlation_id: ${entity.toLowerCase()}`,
  `type: ${type}`,
  `from: ${box(from)}`,
  `to: [${to.map(box).join(', ')}]`,
  `cc: [${cc(type, from).join(', ')}]`,
  `reply_to: ${replyTo ?? 'null'}`,
  `timestamp: ${now()}`,
  `priority: ${priority}`,
  'payload:',
  `  summary: "${summary}"`,
  `  context_ref: "${ref}"`,
  `  action_required: ${action}`,
  'metadata:',
  '  artifact_links: []',
  '  deadline: null',
  '```',
].join('\n');
const walk = (dir, out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== 'scripts') walk(p, out); }
    else if (/^THREAD-.*\.md$/.test(e.name)) out.push(p);
  }
  return out;
};

if (cmd === 'new') {
  const from = opt('from', 'PM');
  const to = list(opt('to', from));
  const type = check(opt('type'));
  const entity = opt('entity');
  const summary = opt('summary').replace(/"/g, "'");
  const body = fs.readFileSync(opt('body'), 'utf8').trim();
  const ref = opt('ref', 'DECISION-LOGS/PM-DECISION-LOG-AND-ROADMAP.md');
  const id = crypto.randomBytes(4).toString('hex');
  const dir = path.join(MAIL, folderOf(to[0]));
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `THREAD-${id}-${slug(summary)}.md`);
  const env = envelope({ type, entity, from, to, replyTo: null, summary, ref, action: opt('action', 'true'), priority: opt('priority', 'normal') });
  fs.writeFileSync(file, `# THREAD-${id} - [${type}][${entity}] ${summary}\n\n**Thread ID:** \`${id}\`\n**Entity:** ${entity}\n**Participants:** ${[from, ...to].map(box).join(', ')}\n**Status:** open\n**Labels:** [${type.toLowerCase()}, ${entity.toLowerCase()}, status-open]\n\n---\n\n## 1. ${box(from)} to ${to.map(box).join(', ')}, ${now()}\n\n${env}\n\n${body}\n`);
  console.log(path.relative(MAIL, file));
} else if (cmd === 'append') {
  const file = opt('file');
  const text = fs.readFileSync(file, 'utf8');
  const m = text.split('\n')[0].match(/\[([A-Z])\]\[([^\]]+)\]/);
  const type = check(opt('type', m ? m[1] : 'C'));
  const entity = opt('entity', m ? m[2] : 'THREAD');
  const from = opt('from', 'PM');
  const to = list(opt('to', 'PM'));
  const summary = opt('summary').replace(/"/g, "'");
  const body = fs.readFileSync(opt('body'), 'utf8').trim();
  const ids = [...text.matchAll(/message_id: (\S+)/g)].map((x) => x[1]);
  const n = Math.max(0, ...[...text.matchAll(/^## (\d+)\./gm)].map((x) => +x[1])) + 1;
  const env = envelope({ type, entity, from, to, replyTo: ids.at(-1) ?? null, summary, ref: opt('ref', 'DECISION-LOGS/PM-DECISION-LOG-AND-ROADMAP.md'), action: opt('action', 'true'), priority: opt('priority', 'normal') });
  let out = `${text.trimEnd()}\n\n## ${n}. ${box(from)}, ${now()}\n\n${env}\n\n${body}\n`;
  if (opt('status', '')) out = out.replace(/\*\*Status:\*\* .*/, `**Status:** ${opt('status')}`);
  fs.writeFileSync(file, out);
  console.log(`${path.relative(MAIL, file)} message ${n}`);
} else if (cmd === 'index') {
  const rows = walk(MAIL).sort().map((p) => {
    const t = fs.readFileSync(p, 'utf8');
    const m = t.split('\n')[0].match(/^# THREAD-([0-9a-f]+) \S+ \[(\w)\]\[([^\]]+)\]/);
    const status = (t.match(/\*\*Status:\*\* (.*)/) || [])[1] ?? '';
    const msgs = [...t.matchAll(/^## \d+\./gm)].length;
    const last = [...t.matchAll(/timestamp: (\S+)/g)].map((x) => x[1]).at(-1) ?? '';
    return `| ${m?.[1] ?? '?'} | ${m?.[2] ?? '?'} | ${m?.[3] ?? '?'} | ${status} | ${msgs} | ${last} | ${path.relative(MAIL, p).split(path.sep).join('/')} |`;
  });
  fs.writeFileSync(path.join(MAIL, 'INDEX.md'), ['# Mail Index', '', `Generated ${now()} by scripts/mail.mjs index. Do not edit by hand.`, '', '| Thread | Type | Entity | Status | Messages | Last message | File |', '|---|---|---|---|---|---|---|', ...rows, ''].join('\n'));
  console.log(`indexed ${rows.length} threads`);
} else {
  console.log('usage: mail.mjs new --from ROLE --to ROLE[,ROLE] --type T --entity ID --summary "..." --body FILE [--priority normal|blocking] [--action true|false] [--ref PATH]\n       mail.mjs append --file THREAD.md --from ROLE [--to ROLE] --type T --summary "..." --body FILE [--entity ID] [--status TEXT]\n       mail.mjs index');
}
