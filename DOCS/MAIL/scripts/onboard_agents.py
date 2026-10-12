"""VLTHRTEAM onboarding mailer — one clean thread per member.

USAGE
  # onboard everyone in the roster:
  py onboard_agents.py

  # onboard ONE new member (after adding them to onboard_roster.json):
  py onboard_agents.py --only newmember@agentmail.to

  # preview payloads, nothing sent:
  py onboard_agents.py --dry-run

SETUP
  set -a; source C:/Users/Sav-Dev/Documents/TCN/.env.local; set +a
  (AGENTMAIL_PM_SCOPED must be set — the PM inbox-scoped key)

HOW TO ADD A MEMBER
  Edit onboard_roster.json — copy any entry, change to/role/name/files/intro/questions.
  'files' are keys into FILES below; add new doc mappings there if needed.
  'human: true' sends plain-language mail with no attachments and no protocol envelope.
  Thread IDs are appended to onboard_threads.log for local mirroring.

SUBJECT FORMAT — instantly recognizable:
  [VLTHRLAB | ONBOARDING] Welcome, <Name> — <Role>
"""
import base64, datetime, json, os, sys, urllib.request

ROOT = r"C:\Users\Sav-Dev\Documents\TCN\IKD\TRANSPORT-TEAM"
MS = os.path.join(ROOT, "TRANSPORT-MANAGEMENT-SYSTEM")
HERE = os.path.dirname(os.path.abspath(__file__))
ROSTER = os.path.join(HERE, "onboard_roster.json")
THREAD_LOG = os.path.join(HERE, "onboard_threads.log")
SENDER = "vlthrlab-pm@agentmail.to"

# Doc packet keys -> (absolute path, attachment filename). Max ~5 per member.
FILES = {
    "agents":    (os.path.join(MS, "AGENTS.md"), "AGENTS.md"),
    "brd":       (os.path.join(ROOT, "BRD for TCN Ikorodu Transport App.md"), "BRD-TCN-Ikorodu-Transport-App.md"),
    "minutes":   (os.path.join(MS, "DOCS", "DECISION-LOGS", "MEETING-MINUTES-02-Systems-Scope.md"), "MEETING-MINUTES-02-Systems-Scope.md"),
    "pmlog":     (os.path.join(MS, "DOCS", "DECISION-LOGS", "PM-DECISION-LOG-AND-ROADMAP.md"), "PM-DECISION-LOG-AND-ROADMAP.md"),
    "comms":     (os.path.join(MS, "DOCS", "AGENT-COMMUNICATIONS-WORKFLOW.md"), "AGENT-COMMUNICATIONS-WORKFLOW.md"),
    "sysmap":    (os.path.join(MS, "DOCS", "SYSTEMS-MAPPING.md"), "SYSTEMS-MAPPING.md"),
    "registry":  (os.path.join(MS, "DOCS", "REGISTRY", "team-registry.yaml"), "team-registry.yaml"),
    "vlthrteam": (os.path.join(MS, "DOCS", "VLTHRTEAM.md"), "VLTHRTEAM.md"),
    "lifecycle": (os.path.join(MS, "DOCS", "CANONICAL-PROJECT-LIFECYCLE.yaml"), "CANONICAL-PROJECT-LIFECYCLE.yaml"),
}

ENVELOPE = """---
protocol: tcn-mail-v1
type: M
entity: ONBOARD-{role}
from: pm@vlthrlab-pm.agentmail.to
to: [{to}]
context_refs: [AGENTS.md, DOCS/REGISTRY/team-registry.yaml]
requires_ack: true
---

"""

READINESS = """
## READINESS CHECK — reply on this thread with:

1. **Confirm you read AGENTS.md** and can follow the mail protocol (envelope header, `[TYPE][ENTITY-ID]` subjects, one thread per issue).
2. **Your stack/tools**: what you work in, what you need access to (repos, credentials, services).
3. **Automation readiness**: can you poll your inbox / receive webhooks, or do you work only when prompted? Be honest — it shapes how I route to you.
4. **Immediate blockers**: anything in the attached docs that stops you starting your current task.
5. **Your three questions**: per AGENTS.md, ask me the highest-value questions for your domain — I'll answer or escalate.
"""


def attach(*keys):
    out = []
    for k in keys:
        path, name = FILES[k]
        with open(path, "rb") as fh:
            out.append({"filename": name,
                        "content_type": "text/yaml" if name.endswith(".yaml") else "text/markdown",
                        "content": base64.b64encode(fh.read()).decode()})
    return out


def subject_for(job):
    # Clean, human-scannable: brand + purpose + who they are to us
    if job.get("human"):
        return "[VLTHRLAB] TCN Transport App - a few questions for the Transport Dept"
    return f"[VLTHRLAB | ONBOARDING] Welcome, {job['name']} - {job['title']}"


def build(job):
    greeting = f"Hi {job['name']},\n\n" if not job.get("human") else "Hello,\n\n"
    files_note = ""
    if job["files"]:
        names = [FILES[k][1] for k in job["files"]]
        files_note = "\n**Attached (read AGENTS.md first):**\n" + "\n".join(f"- `{n}`" for n in names) + "\n"
    body = (ENVELOPE.format(role=job["role"], to=job["to"]) + greeting + job["intro"]
            + files_note + job["questions"] + READINESS
            + f"\n— PM ({SENDER})\n")
    return {
        "to": job["to"],
        "subject": subject_for(job),
        "text": body,
        "attachments": attach(*job["files"]) if job["files"] else [],
    }


def send(payload, key):
    req = urllib.request.Request(
        f"https://api.agentmail.to/v0/inboxes/{SENDER}/messages/send",
        data=json.dumps(payload).encode(),
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req) as r:
            return r.status, json.loads(r.read())
    except urllib.error.HTTPError as e:
        return e.code, e.read()[:400]


def log_thread(job, thread_id):
    ts = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    with open(THREAD_LOG, "a", encoding="utf-8") as f:
        f.write(f"{ts}\t{thread_id}\t{job['role']}\t{job['to']}\n")


if __name__ == "__main__":
    jobs = json.load(open(ROSTER, encoding="utf-8"))["members"]
    only = None
    if "--only" in sys.argv:
        only = sys.argv[sys.argv.index("--only") + 1]
        jobs = [j for j in jobs if j["to"] == only]
        if not jobs:
            sys.exit(f"no roster entry for {only}")
    dry = "--dry-run" in sys.argv
    key = None if dry else os.environ["AGENTMAIL_PM_SCOPED"]
    for j in jobs:
        payload = build(j)
        if dry:
            size = len(json.dumps(payload))
            print(f"DRY {j['role']:12} -> {j['to']:45} subj={payload['subject']!r} bytes={size}")
        else:
            status, resp = send(payload, key)
            tid = (resp.get("thread_id") or resp.get("message_id")) if isinstance(resp, dict) else resp
            print(f"{j['role']:12} -> {status} thread={tid}")
            if status == 200 and isinstance(tid, str):
                log_thread(j, tid)
