# Version Control

**Status:** Accepted (D-049) · **Version:** 1.0 · **Date:** 2026-10-12 · **Owner:** Product Manager
**Repository:** git, at the project root (`TRANSPORT-MANAGEMENT-SYSTEM/`). No remote yet.

---

## 1. What is under version control

Everything in the project folder except what `.gitignore` excludes: the documents, the decision log, the prototypes, the sign-off form, the mail mirror, and the scripts.

**Never committed:**

| Item | Why | Where it lives |
|---|---|---|
| `.env` and `.env.*` files, keys, tokens | Secrets | Password manager; hosting secret stores |
| Returned sign-off forms (`DOCS/SIGN-OFF/returns/`) | Personal names and signatures | Restricted folder outside the repository. The decision log cites them by file name and date |
| Database dumps, backups, and exports of member data | Personal data | Backup storage with restricted access (`DEVOPS/DEVOPS-PLAN.md` §5) |
| Build output and dependencies | Generated | Rebuilt from source |

Email in the mail mirror is business addressing only. Before any real member's contact details are added to the repository, the rule above applies.

---

## 2. Branches

| Branch | Holds | Who merges |
|---|---|---|
| `main` | The agreed state. Every commit on `main` passes the checks for its area | Product manager (documents); a second reviewer (code) |
| `docs/<topic>` | Documentation changes before a freeze | PM |
| `change/CR-###` | A change to a frozen document, linked to a change request | PM, and the document's owner |
| `frontend/F0` … `frontend/F5` | Frontend stages (see `ROADMAP/DEVELOPMENT-STRATEGY.md` §6) | Frontend lead, reviewed by a second developer |
| `backend/B0` … `backend/B5` | Backend stages (see `ROADMAP/DEVELOPMENT-STRATEGY.md` §7) | Backend lead, reviewed by a second developer |
| `fix/<topic>` | Defect fixes | The owner of the affected area |

Once a remote exists, `main` is protected: no direct commits, and every merge is reviewed.

---

## 3. Tags

| Tag | Meaning |
|---|---|
| `docs-baseline-2026-10-12` | The state before the transport sign-off. Kept as the reference point |
| `docs-v1.0` | The documentation freeze after sign-off. Changes after this are change requests |
| `docs-v1.x` | Later frozen versions, after approved change requests |
| `pilot-1`, `pilot-2` … | Releases used in the pilot |
| `release-1.0` | Production release after the launch review |

Tags are annotated. Each carries a message that names the decisions it depends on.

---

## 4. Commit messages

```
<area>: <short summary in the imperative>

<what changed, and why, in two or three lines>

Refs: D-045, Q-033, CR-004
Generated with [Devin](https://devin.ai)
Co-Authored-By: Devin <158243242+devin-ai-integration[bot]@users.noreply.github.com>
```

- `area` is the folder or stage: `docs/policy`, `sign-off`, `frontend/F1`, `backend/B0`.
- `Refs:` lists every decision, question or change request the commit depends on. A commit touching a frozen file without a `CR-` reference is rejected at review.
- Keep commits small enough to review in one sitting.

---

## 5. Change control after the freeze

1. Open a change request: a dated entry in the decision log with the affected file, the reason, and the owner's approval.
2. Branch `change/CR-###` from `main`.
3. Make the change. Update the file's status line with the new version (`Frozen v1.1`) if behaviour changes.
4. Review by the PM and the document's owner.
5. Merge to `main`, then tag `docs-v1.x` if the change is a behaviour change.

Wording fixes with no behaviour change go straight to `main` as `docs/…` commits, with the reason in the message.

---

## 6. Rules that always apply

- Never rewrite history on `main` or on any shared branch. To undo, make a new commit that reverts the old one.
- Deleting a branch, force-pushing, or removing a tag requires explicit confirmation from the sponsor.
- Nothing is pushed to a remote without the sponsor's go-ahead.
- Git identity is set per team member. Git configuration is not changed by scripts.
- A release tag is created only from a commit that has passed the QA release gate (D-019).

---

## 7. Setting up a remote (when the sponsor chooses a host)

1. Create an empty repository on the chosen host, owned by the church or the sponsor, not by an individual developer.
2. Add it as `origin` and push `main` and the tags.
3. Protect `main`: require review, and block force-push.
4. Add the repository's owner and two administrators with access.

Until then, the repository is local and the baseline tag is the reference.
