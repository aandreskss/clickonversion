"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ChevronDown,
  Building2,
  Calendar,
  User,
  FileText,
  Save,
  Loader2,
  MessageSquare,
  Flag,
  GitBranch,
  Lock,
  Eye,
  EyeOff,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { StatusBadge } from "@/components/admin/status-badge"
import { PriorityBadge } from "@/components/admin/priority-badge"
import { StatusTransitionDialog } from "@/components/admin/status-transition-dialog"
import type {
  AdminRequest,
  AdminRequestStatus,
  SpecialistProfile,
  StatusLogEntry,
} from "@/types/admin"
import type { RequestMilestone, Comment } from "@/types/portal"

// ── Types ─────────────────────────────────────────────────────────────────────

interface QueueItemData {
  request: AdminRequest
  milestones: RequestMilestone[]
  comments: Comment[]
  statusLog: StatusLogEntry[]
}

// ── RequestActions ─────────────────────────────────────────────────────────────

function RequestActions({
  requestId,
  currentStatus,
}: {
  requestId: string
  currentStatus: AdminRequestStatus
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-[#FF5A1F] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#E44D18] transition-colors"
      >
        <GitBranch className="w-4 h-4" />
        Cambiar estado
      </button>
      <StatusTransitionDialog
        requestId={requestId}
        currentStatus={currentStatus}
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={() => router.refresh()}
      />
    </>
  )
}

// ── RequestDetailsPanel ────────────────────────────────────────────────────────

function RequestDetailsPanel({ request }: { request: AdminRequest }) {
  const [specialists, setSpecialists] = useState<SpecialistProfile[]>([])
  const [notes, setNotes] = useState(request.internalNotes ?? "")
  const [savingNotes, setSavingNotes] = useState(false)
  const [savedNotes, setSavedNotes] = useState(false)
  const [assigningSpecialist, setAssigningSpecialist] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch("/api/admin/specialists")
      .then((r) => r.json())
      .then((d: { items?: SpecialistProfile[] }) => setSpecialists(d.items ?? []))
      .catch(() => {})
  }, [])

  async function saveNotes() {
    setSavingNotes(true)
    try {
      await fetch(`/api/admin/queue/${request.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internalNotes: notes }),
      })
      setSavedNotes(true)
      setTimeout(() => setSavedNotes(false), 2000)
    } finally {
      setSavingNotes(false)
    }
  }

  async function handleSpecialistChange(specialistId: string) {
    setAssigningSpecialist(true)
    try {
      await fetch(`/api/admin/queue/${request.id}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ specialistId: specialistId || null }),
      })
      router.refresh()
    } finally {
      setAssigningSpecialist(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Info card */}
      <div className="bg-[#14171A] border border-[#3D4A5C] rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-[#F7F7F3]">Detalles</h3>

        <div className="space-y-3">
          {/* Organization */}
          <div className="flex items-start gap-2.5">
            <Building2 className="w-4 h-4 text-[#546072] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-[#8A9099]">Organización</p>
              <p className="text-sm text-[#F7F7F3] font-medium">
                {request.org?.name ?? "—"}
              </p>
            </div>
          </div>

          {/* Estimated start */}
          <div className="flex items-start gap-2.5">
            <Calendar className="w-4 h-4 text-[#546072] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-[#8A9099]">Inicio estimado</p>
              <p className="text-sm text-[#F7F7F3]">
                {request.estimatedStart
                  ? new Date(request.estimatedStart).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "Sin definir"}
              </p>
            </div>
          </div>

          {/* Specialist */}
          <div className="flex items-start gap-2.5">
            <User className="w-4 h-4 text-[#546072] mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-[#8A9099] mb-1">Especialista</p>
              <div className="relative">
                <select
                  value={request.assignedSpecialistId ?? ""}
                  onChange={(e) => handleSpecialistChange(e.target.value)}
                  disabled={assigningSpecialist}
                  className="w-full bg-[#0B0D0F] border border-[#3D4A5C] rounded-lg px-3 py-1.5 text-sm text-[#F7F7F3] focus:outline-none focus:border-[#FF5A1F] transition-colors appearance-none pr-8 disabled:opacity-50"
                >
                  <option value="">Sin asignar</option>
                  {specialists.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.displayName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#546072]" />
              </div>
            </div>
          </div>

          {/* Created / Updated */}
          <div className="pt-2 border-t border-[#3D4A5C]">
            <div className="flex justify-between text-xs text-[#546072]">
              <span>Creado</span>
              <span>{new Date(request.createdAt).toLocaleDateString("es-ES")}</span>
            </div>
            <div className="flex justify-between text-xs text-[#546072] mt-1">
              <span>Actualizado</span>
              <span>{new Date(request.updatedAt).toLocaleDateString("es-ES")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Internal notes */}
      <div className="bg-[#14171A] border border-[#3D4A5C] rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#546072]" />
          <h3 className="text-sm font-semibold text-[#F7F7F3]">Notas internas</h3>
        </div>
        <textarea
          rows={5}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notas privadas del equipo (no visibles para el cliente)…"
          className="w-full bg-[#0B0D0F] border border-[#3D4A5C] rounded-lg px-3 py-2.5 text-sm text-[#F7F7F3] placeholder:text-[#546072] focus:outline-none focus:border-[#FF5A1F] transition-colors resize-none"
        />
        <button
          type="button"
          onClick={saveNotes}
          disabled={savingNotes || notes === (request.internalNotes ?? "")}
          className="flex items-center gap-2 px-4 py-2 bg-[#FF5A1F] text-white text-sm font-medium rounded-lg hover:bg-[#E44D18] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {savingNotes ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {savedNotes ? "Guardado" : "Guardar notas"}
        </button>
      </div>
    </div>
  )
}

// ── RequestTabs ────────────────────────────────────────────────────────────────

type TabKey = "activity" | "milestones" | "history"

function RequestTabs({
  request,
  milestones: initialMilestones,
  comments: initialComments,
  statusLog,
}: {
  request: AdminRequest
  milestones: RequestMilestone[]
  comments: Comment[]
  statusLog: StatusLogEntry[]
}) {
  const [tab, setTab] = useState<TabKey>("activity")
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [milestones, setMilestones] = useState<RequestMilestone[]>(initialMilestones)
  const [commentBody, setCommentBody] = useState("")
  const [isInternal, setIsInternal] = useState(false)
  const [sendingComment, setSendingComment] = useState(false)
  const [showMilestoneForm, setShowMilestoneForm] = useState(false)
  const [milestoneTitle, setMilestoneTitle] = useState("")
  const [milestoneDesc, setMilestoneDesc] = useState("")
  const [milestoneVisible, setMilestoneVisible] = useState(false)
  const [milestoneDue, setMilestoneDue] = useState("")
  const [savingMilestone, setSavingMilestone] = useState(false)

  const tabs: { key: TabKey; label: string; icon: typeof MessageSquare }[] = [
    { key: "activity", label: "Actividad", icon: MessageSquare },
    { key: "milestones", label: "Hitos", icon: Flag },
    { key: "history", label: "Historial", icon: GitBranch },
  ]

  async function sendComment() {
    if (!commentBody.trim()) return
    setSendingComment(true)
    try {
      const res = await fetch(`/api/admin/queue/${request.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: commentBody.trim(), isInternal }),
      })
      if (res.ok) {
        const data = (await res.json()) as { comment: Comment }
        setComments((prev) => [...prev, data.comment])
        setCommentBody("")
      }
    } finally {
      setSendingComment(false)
    }
  }

  async function saveMilestone() {
    if (!milestoneTitle.trim()) return
    setSavingMilestone(true)
    try {
      const res = await fetch(`/api/admin/queue/${request.id}/milestones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: milestoneTitle.trim(),
          description: milestoneDesc.trim() || undefined,
          isClientVisible: milestoneVisible,
          dueDate: milestoneDue || undefined,
        }),
      })
      if (res.ok) {
        const data = (await res.json()) as { milestone: RequestMilestone }
        setMilestones((prev) => [...prev, data.milestone])
        setMilestoneTitle("")
        setMilestoneDesc("")
        setMilestoneVisible(false)
        setMilestoneDue("")
        setShowMilestoneForm(false)
      }
    } finally {
      setSavingMilestone(false)
    }
  }

  async function toggleMilestoneStatus(milestone: RequestMilestone) {
    const newStatus = milestone.status === "completed" ? "pending" : "completed"
    const res = await fetch(`/api/admin/milestones/${milestone.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: newStatus,
        completedAt: newStatus === "completed" ? new Date().toISOString() : null,
      }),
    })
    if (res.ok) {
      setMilestones((prev) =>
        prev.map((m) => (m.id === milestone.id ? { ...m, status: newStatus } : m))
      )
    }
  }

  const STATUS_LOG_LABELS: Record<string, string> = {
    pending_payment: "Pend. pago",
    pending_onboarding: "En cola",
    queued: "En cola",
    waiting_client: "Esp. cliente",
    consultation_scheduled: "Asesoría prog.",
    in_progress: "En progreso",
    active: "En progreso",
    waiting_third_party: "Esp. tercero",
    review: "En revisión",
    paused: "En pausa",
    completed: "Completado",
    cancelled: "Cancelado",
    refunded: "Reembolsado",
  }

  return (
    <div className="bg-[#14171A] border border-[#3D4A5C] rounded-xl overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-[#3D4A5C]">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors border-b-2 ${
              tab === key
                ? "border-[#FF5A1F] text-[#FF5A1F]"
                : "border-transparent text-[#8A9099] hover:text-[#F7F7F3]"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-5">
        {/* ── Activity ── */}
        {tab === "activity" && (
          <div className="space-y-4">
            {/* Comments list */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {comments.length === 0 ? (
                <p className="text-[#546072] text-sm text-center py-8">
                  Sin mensajes aún
                </p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`rounded-lg p-4 ${
                      comment.isInternal
                        ? "bg-[#EF4444]/5 border border-[#EF4444]/20"
                        : "bg-[#0B0D0F] border border-[#3D4A5C]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#F7F7F3]">
                          {comment.author?.fullName ?? comment.author?.email ?? "Sistema"}
                        </span>
                        <span className="text-xs text-[#546072] capitalize">
                          [{comment.authorRole}]
                        </span>
                        {comment.isInternal && (
                          <span className="text-xs font-medium bg-[#EF4444]/20 text-[#EF4444] px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            Interno
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#546072]">
                        {new Date(comment.createdAt).toLocaleString("es-ES", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-[#F7F7F3] whitespace-pre-wrap">{comment.body}</p>
                  </div>
                ))
              )}
            </div>

            {/* New comment form */}
            <div className="border-t border-[#3D4A5C] pt-4 space-y-3">
              <textarea
                rows={3}
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
                placeholder={
                  isInternal
                    ? "Nota interna (solo visible para el equipo)…"
                    : "Mensaje al cliente…"
                }
                className="w-full bg-[#0B0D0F] border border-[#3D4A5C] rounded-lg px-3 py-2.5 text-sm text-[#F7F7F3] placeholder:text-[#546072] focus:outline-none focus:border-[#FF5A1F] transition-colors resize-none"
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isInternal}
                    onChange={(e) => setIsInternal(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#EF4444]"
                  />
                  <span className="text-sm text-[#8A9099]">Nota interna</span>
                </label>
                <button
                  type="button"
                  onClick={sendComment}
                  disabled={!commentBody.trim() || sendingComment}
                  className="flex items-center gap-2 px-4 py-2 bg-[#FF5A1F] text-white text-sm font-medium rounded-lg hover:bg-[#E44D18] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {sendingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Enviar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Milestones ── */}
        {tab === "milestones" && (
          <div className="space-y-4">
            {milestones.length === 0 && !showMilestoneForm ? (
              <p className="text-[#546072] text-sm text-center py-8">Sin hitos definidos</p>
            ) : (
              <div className="space-y-2">
                {milestones.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-start gap-3 p-4 bg-[#0B0D0F] border border-[#3D4A5C] rounded-lg"
                  >
                    <button
                      type="button"
                      onClick={() => toggleMilestoneStatus(m)}
                      className="flex-shrink-0 mt-0.5"
                    >
                      {m.status === "completed" ? (
                        <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                      ) : (
                        <Circle className="w-5 h-5 text-[#3D4A5C]" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-medium ${
                            m.status === "completed"
                              ? "text-[#546072] line-through"
                              : "text-[#F7F7F3]"
                          }`}
                        >
                          {m.title}
                        </span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded flex items-center gap-1 ${
                            m.isClientVisible
                              ? "bg-[#22C55E]/10 text-[#22C55E]"
                              : "bg-[#3D4A5C] text-[#8A9099]"
                          }`}
                        >
                          {m.isClientVisible ? (
                            <Eye className="w-3 h-3" />
                          ) : (
                            <EyeOff className="w-3 h-3" />
                          )}
                          {m.isClientVisible ? "Visible" : "Interno"}
                        </span>
                      </div>
                      {m.description && (
                        <p className="text-xs text-[#8A9099] mt-1">{m.description}</p>
                      )}
                      {m.dueDate && (
                        <div className="flex items-center gap-1 mt-1.5">
                          <Clock className="w-3 h-3 text-[#546072]" />
                          <span className="text-xs text-[#546072]">
                            {new Date(m.dueDate).toLocaleDateString("es-ES")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add milestone form */}
            {showMilestoneForm ? (
              <div className="border border-[#3D4A5C] rounded-lg p-4 space-y-3 bg-[#0B0D0F]">
                <h4 className="text-sm font-medium text-[#F7F7F3]">Nuevo hito</h4>
                <input
                  type="text"
                  value={milestoneTitle}
                  onChange={(e) => setMilestoneTitle(e.target.value)}
                  placeholder="Título del hito"
                  className="w-full bg-[#14171A] border border-[#3D4A5C] rounded-lg px-3 py-2 text-sm text-[#F7F7F3] placeholder:text-[#546072] focus:outline-none focus:border-[#FF5A1F] transition-colors"
                />
                <textarea
                  rows={2}
                  value={milestoneDesc}
                  onChange={(e) => setMilestoneDesc(e.target.value)}
                  placeholder="Descripción (opcional)"
                  className="w-full bg-[#14171A] border border-[#3D4A5C] rounded-lg px-3 py-2 text-sm text-[#F7F7F3] placeholder:text-[#546072] focus:outline-none focus:border-[#FF5A1F] transition-colors resize-none"
                />
                <div className="flex items-center gap-4">
                  <input
                    type="date"
                    value={milestoneDue}
                    onChange={(e) => setMilestoneDue(e.target.value)}
                    className="bg-[#14171A] border border-[#3D4A5C] rounded-lg px-3 py-2 text-sm text-[#F7F7F3] focus:outline-none focus:border-[#FF5A1F] transition-colors"
                  />
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={milestoneVisible}
                      onChange={(e) => setMilestoneVisible(e.target.checked)}
                      className="w-4 h-4 rounded accent-[#22C55E]"
                    />
                    <span className="text-sm text-[#8A9099]">Visible para cliente</span>
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowMilestoneForm(false)}
                    className="px-4 py-2 text-sm border border-[#3D4A5C] text-[#8A9099] rounded-lg hover:border-[#546072] transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={saveMilestone}
                    disabled={!milestoneTitle.trim() || savingMilestone}
                    className="px-4 py-2 text-sm bg-[#FF5A1F] text-white rounded-lg hover:bg-[#E44D18] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {savingMilestone ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Guardar
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowMilestoneForm(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm border border-dashed border-[#3D4A5C] text-[#8A9099] rounded-lg hover:border-[#FF5A1F] hover:text-[#FF5A1F] transition-colors w-full justify-center"
              >
                <Plus className="w-4 h-4" />
                Añadir hito
              </button>
            )}
          </div>
        )}

        {/* ── History ── */}
        {tab === "history" && (
          <div className="space-y-3">
            {statusLog.length === 0 ? (
              <p className="text-[#546072] text-sm text-center py-8">
                Sin historial de estados
              </p>
            ) : (
              <ol className="relative border-l border-[#3D4A5C] space-y-6 pl-5">
                {statusLog.map((entry, index) => (
                  <li key={entry.id} className="relative">
                    <div className="absolute -left-[21px] w-3 h-3 rounded-full bg-[#FF5A1F] border-2 border-[#14171A]" />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {entry.fromStatus && (
                          <>
                            <span className="text-xs text-[#8A9099]">
                              {STATUS_LOG_LABELS[entry.fromStatus] ?? entry.fromStatus}
                            </span>
                            <span className="text-xs text-[#546072]">→</span>
                          </>
                        )}
                        <span className="text-sm font-medium text-[#F7F7F3]">
                          {STATUS_LOG_LABELS[entry.toStatus] ?? entry.toStatus}
                        </span>
                        {index === statusLog.length - 1 && (
                          <span className="text-xs bg-[#FF5A1F]/10 text-[#FF5A1F] px-2 py-0.5 rounded-full">
                            Actual
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {entry.changedByEmail && (
                          <span className="text-xs text-[#8A9099]">{entry.changedByEmail}</span>
                        )}
                        <span className="text-xs text-[#546072]">
                          {new Date(entry.createdAt).toLocaleString("es-ES", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      {entry.note && (
                        <p className="text-xs text-[#8A9099] mt-1.5 bg-[#0B0D0F] rounded px-2 py-1.5 border border-[#3D4A5C]">
                          {entry.note}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function QueueItemPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [data, setData] = useState<QueueItemData | null | "loading">("loading")

  useEffect(() => {
    fetch(`/api/admin/queue/${id}`)
      .then((r) => {
        if (r.status === 404) {
          setData(null)
          return null
        }
        return r.json() as Promise<QueueItemData>
      })
      .then((d) => {
        if (d !== null) setData(d)
      })
      .catch(() => setData(null))
  }, [id])

  if (data === "loading") {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#FF5A1F] border-t-transparent rounded-full animate-spin" />
          <span className="text-[#8A9099] text-sm">Cargando solicitud…</span>
        </div>
      </div>
    )
  }

  if (data === null) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-[#F7F7F3] text-lg font-semibold">Solicitud no encontrada</p>
        <Link
          href="/admin/queue"
          className="flex items-center gap-2 text-[#FF5A1F] text-sm hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la cola
        </Link>
      </div>
    )
  }

  const { request, milestones, comments, statusLog } = data

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div>
        <Link
          href="/admin/queue"
          className="flex items-center gap-1.5 text-[#8A9099] text-sm hover:text-[#F7F7F3] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Cola de trabajo
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#F7F7F3]">{request.serviceName}</h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <StatusBadge status={request.status} />
              <PriorityBadge priority={request.priority} />
              {request.org && (
                <div className="flex items-center gap-1 text-[#8A9099] text-sm">
                  <Building2 className="w-3.5 h-3.5" />
                  {request.org.name}
                </div>
              )}
            </div>
          </div>
          <RequestActions requestId={id} currentStatus={request.status} />
        </div>
      </div>

      {/* Scope (if set) */}
      {request.scope && (
        <div className="bg-[#14171A] border border-[#3D4A5C] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-[#546072]" />
            <span className="text-xs font-semibold text-[#8A9099] uppercase tracking-wider">
              Alcance
            </span>
          </div>
          <p className="text-sm text-[#F7F7F3] whitespace-pre-wrap">{request.scope}</p>
        </div>
      )}

      {/* 2-col layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Tabs */}
        <div className="lg:col-span-2">
          <RequestTabs
            request={request}
            milestones={milestones}
            comments={comments}
            statusLog={statusLog}
          />
        </div>

        {/* Right: Details */}
        <div>
          <RequestDetailsPanel request={request} />
        </div>
      </div>
    </div>
  )
}
