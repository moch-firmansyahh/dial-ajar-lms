import React, { useState, useRef } from "react";
import "../../../shared.css";
import "../../mahasiswa/forumDiskusi/forumDiskusi.css";
import SidebarDosen from "../../../SidebarDosen";
import { useSidebar } from "../../../useSidebar";
import Navbar from "../../../Navbar";

const AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBjoXu55KCdSSPl-2t0t7d2EH6gux6Xz8nZaCdXHePrj-gGn1ZWZyBoOucWc2yVgrhmNFyy8cKbxWH8i9Wm5VKkpqX9jraXjkHTr8PVU1oN3V4nkzLWUUm6nyAIS3hGDic_uY0YoNLNNZluKTKqFwJb2gYlRl9eATGdlXClTx6IXpYvk-2u1qqvfUGTzs-QJPlXTouWTyNYzTe8j8mS09evVA_aHTYfHxneVwUsb2jUygYzuAIDU5KwqO2kISzLvnzaTentePscoGoo";

const INITIAL_THREADS = [
  {
    id: 1,
    authorName: "Dr. Firman Maulana",
    authorRole: "DOSEN PENGAMPU",
    authorAvatar: AVATAR,
    authorColor: null,
    authorInitials: null,
    time: "10 menit yang lalu",
    content:
      "Ada pertanyaan soal materi hari ini? Kita sudah membahas tentang <strong>Manajemen Memori</strong> pada sistem operasi modern. Silakan diskusikan hal yang paling menantang bagi Anda.",
    likes: 8,
    liked: false,
    replies: [
      {
        id: 11,
        authorName: "Aditya Arisandy",
        authorAvatar: "https://i.pravatar.cc/40?img=33",
        authorColor: null,
        authorInitials: null,
        time: "5 MENIT YANG LALU",
        content:
          "Izin bertanya Pak, apakah paging selalu lebih efisien daripada segmentasi?",
        likes: 0,
        liked: false,
      },
    ],
    replyCount: 1,
  },
  {
    id: 2,
    authorName: "Bella Puspita",
    authorRole: null,
    authorAvatar: null,
    authorColor: "#2f9696",
    authorInitials: "BP",
    time: "2 jam yang lalu",
    title: "Diskusi: Algoritma Replacement",
    content:
      "Apakah ada perbedaan signifikan antara LRU dan Clock algorithm dalam implementasi nyata?",
    likes: 4,
    liked: false,
    replies: [],
    replyCount: 7,
    collapsed: true,
  },
  {
    id: 3,
    authorName: "Fajar Ramadhan",
    authorRole: null,
    authorAvatar: "https://i.pravatar.cc/48?img=60",
    authorColor: null,
    authorInitials: null,
    time: "1 hari yang lalu",
    title: "Diskusi: Deadlock Prevention",
    content:
      "Strategi mana yang menurutnya paling efektif untuk mencegah deadlock: prevention, avoidance, atau detection?",
    likes: 6,
    liked: false,
    replies: [],
    replyCount: 14,
    collapsed: true,
  },
];

function Avatar({ src, initials, color, size = 40 }) {
  if (src) {
    return (
      <img
        src={src}
        alt={initials || "avatar"}
        className="fd-avatar-img"
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          flexShrink: 0,
        }}
      />
    );
  }
  return (
    <div
      className="fd-avatar-initials"
      style={{
        width: size,
        height: size,
        background: color || "#64748b",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: 800,
        fontSize: size * 0.35,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

export default function DosenForum({ onNavigate, onLogout }) {
  const { sidebarOpen, openSidebar, closeSidebar } = useSidebar();
  const [view, setView] = useState("forum");
  const [threads, setThreads] = useState(INITIAL_THREADS);
  const [toast, setToast] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [expandedIds, setExpandedIds] = useState(new Set([1]));
  const [formTitle, setFormTitle] = useState("");
  const [formBody, setFormBody] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const wrapText = (before, after = before) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart,
      end = ta.selectionEnd;
    const sel = formBody.slice(start, end);
    const next =
      formBody.slice(0, start) + before + sel + after + formBody.slice(end);
    setFormBody(next);
    setTimeout(() => {
      ta.selectionStart = start + before.length;
      ta.selectionEnd = end + before.length;
      ta.focus();
    }, 0);
  };

  const handleSubmit = (e) => {
    e && e.preventDefault();
    if (!formTitle.trim() || !formBody.trim()) {
      showToast("error", "Judul dan isi diskusi tidak boleh kosong.");
      return;
    }
    const newThread = {
      id: Date.now(),
      authorName: "Dr. Moch Firmansyah",
      authorRole: "DOSEN PENGAMPU",
      authorAvatar: AVATAR,
      authorColor: null,
      authorInitials: null,
      time: "Baru saja",
      title: formTitle.trim(),
      content: formBody.trim(),
      likes: 0,
      liked: false,
      replies: [],
      replyCount: 0,
      collapsed: false,
    };
    setThreads((prev) => [newThread, ...prev]);
    setExpandedIds((prev) => new Set([...prev, newThread.id]));
    setFormTitle("");
    setFormBody("");
    setAttachedFile(null);
    setView("forum");
    showToast("success", "Diskusi berhasil dibuat!");
  };

  const toggleLike = (threadId, replyId) => {
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === threadId && !replyId)
          return {
            ...t,
            likes: t.liked ? t.likes - 1 : t.likes + 1,
            liked: !t.liked,
          };
        if (t.id === threadId && replyId)
          return {
            ...t,
            replies: t.replies.map((r) =>
              r.id === replyId
                ? {
                    ...r,
                    likes: r.liked ? r.likes - 1 : r.likes + 1,
                    liked: !r.liked,
                  }
                : r,
            ),
          };
        return t;
      }),
    );
  };

  const submitReply = (threadId) => {
    if (!replyText.trim()) return;
    const newReply = {
      id: Date.now(),
      authorName: "Dr. Firman Maulana",
      authorAvatar: AVATAR,
      authorColor: null,
      authorInitials: null,
      time: "BARU SAJA",
      content: replyText.trim(),
      likes: 0,
      liked: false,
    };
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? {
              ...t,
              replies: [...t.replies, newReply],
              replyCount: t.replyCount + 1,
            }
          : t,
      ),
    );
    setReplyingTo(null);
    setReplyText("");
    showToast("success", "Balasan berhasil dikirim!");
  };

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setAttachedFile(file);
  };

  return (
    <div
      className="page-shell"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      {toast && (
        <div className={`fd-toast fd-toast--${toast.type}`}>
          <span className="material-symbols-outlined">
            {toast.type === "success" ? "check_circle" : "error"}
          </span>
          <span>{toast.msg}</span>
        </div>
      )}

      <SidebarDosen
        onNavigate={onNavigate}
        onLogout={onLogout}
        activePage="dosenForum"
        mobileOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      <main
        className="page-main"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        <Navbar
          role="Dosen"
          onOpenSidebar={openSidebar}
          onNavigate={
            typeof nav !== "undefined"
              ? nav
              : typeof onNavigate !== "undefined"
                ? onNavigate
                : undefined
          }
        />

        <div className="page-content">
          {/* FORUM LIST */}
          {view === "forum" && (
            <>
              <div className="fd-topbar">
                <div>
                  <nav className="fd-breadcrumb">
                    <span>MATA KULIAH</span>
                    <span className="material-symbols-outlined">
                      chevron_right
                    </span>
                    <span>SISTEM OPERASI</span>
                    <span className="material-symbols-outlined">
                      chevron_right
                    </span>
                    <span className="fd-breadcrumb--active">FORUM DISKUSI</span>
                  </nav>
                  <h2 className="fd-page-title">Forum Diskusi Kelas</h2>
                  <p className="fd-page-sub">
                    Ruang interaksi dosen dan mahasiswa untuk diskusi akademik.
                    <br />
                    Sebagai dosen, Anda dapat memantau dan merespons semua
                    diskusi.
                  </p>
                </div>
                <button
                  className="fd-new-btn"
                  onClick={() => setView("create")}
                >
                  <span className="material-symbols-outlined">add</span>
                  Mulai Diskusi Baru
                </button>
              </div>

              <div className="fd-thread-list">
                {threads.map((thread) => {
                  const isExpanded = expandedIds.has(thread.id);
                  return (
                    <div key={thread.id} className="fd-thread-card">
                      <div className="fd-thread-header">
                        <div className="fd-thread-author-row">
                          <div className="fd-thread-author-info">
                            <Avatar
                              src={thread.authorAvatar}
                              initials={thread.authorInitials}
                              color={thread.authorColor}
                              size={48}
                            />
                            <div>
                              <p className="fd-author-name">
                                {thread.authorName}
                                {thread.authorRole && (
                                  <span className="fd-role-badge">
                                    {thread.authorRole}
                                  </span>
                                )}
                              </p>
                              {thread.title && (
                                <p className="fd-thread-subtitle">
                                  {thread.title}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="fd-time">{thread.time}</span>
                        </div>
                        <div
                          className="fd-thread-body"
                          dangerouslySetInnerHTML={{ __html: thread.content }}
                        />
                        <div className="fd-thread-actions">
                          <button
                            className={`fd-action-btn ${thread.liked ? "fd-action-btn--liked" : ""}`}
                            onClick={() => toggleLike(thread.id)}
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{
                                fontVariationSettings: thread.liked
                                  ? "'FILL' 1"
                                  : "'FILL' 0",
                              }}
                            >
                              favorite
                            </span>
                            {thread.likes} Suka
                          </button>
                          <button
                            className="fd-action-btn"
                            onClick={() => {
                              setReplyingTo(
                                replyingTo === thread.id ? null : thread.id,
                              );
                              setReplyText("");
                            }}
                          >
                            <span className="material-symbols-outlined">
                              reply
                            </span>
                            Balas
                          </button>
                          {thread.replyCount > 0 && thread.collapsed && (
                            <button
                              className="fd-expand-btn"
                              onClick={() => toggleExpand(thread.id)}
                            >
                              <span className="material-symbols-outlined">
                                {isExpanded ? "expand_less" : "expand_more"}
                              </span>
                              {thread.replyCount} komentar
                            </button>
                          )}
                        </div>
                      </div>

                      {isExpanded && thread.replies.length > 0 && (
                        <div className="fd-replies">
                          {thread.replies.map((reply) => (
                            <div key={reply.id} className="fd-reply">
                              <Avatar
                                src={reply.authorAvatar}
                                initials={reply.authorInitials}
                                color={reply.authorColor}
                                size={36}
                              />
                              <div className="fd-reply-body">
                                <div className="fd-reply-header">
                                  <span className="fd-reply-name">
                                    {reply.authorName}
                                  </span>
                                  <span className="fd-reply-time">
                                    {reply.time}
                                  </span>
                                </div>
                                <p
                                  className="fd-reply-text"
                                  dangerouslySetInnerHTML={{
                                    __html: reply.content,
                                  }}
                                />
                                <button
                                  className={`fd-reply-action ${reply.liked ? "fd-action-btn--liked" : ""}`}
                                  onClick={() =>
                                    toggleLike(thread.id, reply.id)
                                  }
                                >
                                  <span
                                    className="material-symbols-outlined"
                                    style={{
                                      fontSize: "0.875rem",
                                      fontVariationSettings: reply.liked
                                        ? "'FILL' 1"
                                        : "'FILL' 0",
                                    }}
                                  >
                                    favorite
                                  </span>
                                  Suka
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {thread.collapsed && !isExpanded && (
                        <button
                          className="fd-collapsed-pill"
                          onClick={() => toggleExpand(thread.id)}
                        >
                          <span className="material-symbols-outlined">
                            comment
                          </span>
                          {thread.replyCount} komentar · Tampilkan semua
                        </button>
                      )}

                      {replyingTo === thread.id && (
                        <div className="fd-reply-input-wrap">
                          <Avatar
                            src={AVATAR}
                            initials="F"
                            color="#4b53bc"
                            size={34}
                          />
                          <div className="fd-reply-input-area">
                            <textarea
                              className="fd-reply-textarea"
                              placeholder="Tulis respons Anda..."
                              rows={3}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                            />
                            <div className="fd-reply-input-actions">
                              <button
                                className="fd-reply-cancel"
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyText("");
                                }}
                              >
                                Batal
                              </button>
                              <button
                                className="fd-reply-submit"
                                onClick={() => submitReply(thread.id)}
                              >
                                <span className="material-symbols-outlined">
                                  send
                                </span>
                                Kirim
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* CREATE VIEW */}
          {view === "create" && (
            <>
              <div className="fd-topbar">
                <div>
                  <nav className="fd-breadcrumb">
                    <span>Mata Kuliah</span>
                    <span className="material-symbols-outlined">
                      chevron_right
                    </span>
                    <button
                      className="fd-breadcrumb-link"
                      onClick={() => setView("forum")}
                    >
                      Forum Diskusi
                    </button>
                    <span className="material-symbols-outlined">
                      chevron_right
                    </span>
                    <span className="fd-breadcrumb--active">Buat Baru</span>
                  </nav>
                  <h2 className="fd-create-title">Buat Diskusi Baru</h2>
                  <p className="fd-create-sub">
                    Buat pengumuman atau pertanyaan untuk didiskusikan mahasiswa
                    di kelas.
                  </p>
                </div>
              </div>

              <div className="fd-create-card">
                <form onSubmit={handleSubmit}>
                  <div className="fd-field">
                    <label className="fd-label">Judul Diskusi</label>
                    <input
                      className="fd-input"
                      type="text"
                      placeholder="Ketikkan judul diskusi yang deskriptif..."
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                    />
                  </div>
                  <div className="fd-field">
                    <label className="fd-label">Isi Diskusi</label>
                    <div className="fd-editor-wrap">
                      <div className="fd-toolbar">
                        <button
                          type="button"
                          className="fd-tool-btn"
                          title="Bold"
                          onClick={() => wrapText("**")}
                        >
                          <span className="material-symbols-outlined">
                            format_bold
                          </span>
                        </button>
                        <button
                          type="button"
                          className="fd-tool-btn"
                          title="Italic"
                          onClick={() => wrapText("_")}
                        >
                          <span className="material-symbols-outlined">
                            format_italic
                          </span>
                        </button>
                        <button
                          type="button"
                          className="fd-tool-btn"
                          title="List"
                          onClick={() => setFormBody((b) => b + "\n- ")}
                        >
                          <span className="material-symbols-outlined">
                            format_list_bulleted
                          </span>
                        </button>
                        <button
                          type="button"
                          className="fd-tool-btn"
                          title="Link"
                          onClick={() => wrapText("[", "](url)")}
                        >
                          <span className="material-symbols-outlined">
                            link
                          </span>
                        </button>
                        <button
                          type="button"
                          className="fd-tool-btn"
                          title="Image"
                          onClick={() => wrapText("![alt](", ")")}
                        >
                          <span className="material-symbols-outlined">
                            image
                          </span>
                        </button>
                      </div>
                      <textarea
                        ref={textareaRef}
                        className="fd-textarea"
                        placeholder="Jelaskan detail diskusi..."
                        rows={9}
                        value={formBody}
                        onChange={(e) => setFormBody(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="fd-field">
                    <label className="fd-label">
                      Lampirkan File (Opsional)
                    </label>
                    <div
                      className={`fd-dropzone ${dragOver ? "fd-dropzone--over" : ""}`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                      }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleFileDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        style={{ display: "none" }}
                        onChange={(e) =>
                          setAttachedFile(e.target.files[0] || null)
                        }
                      />
                      {attachedFile ? (
                        <div className="fd-attached">
                          <span
                            className="material-symbols-outlined"
                            style={{ color: "var(--color-secondary)" }}
                          >
                            attach_file
                          </span>
                          <span className="fd-attached-name">
                            {attachedFile.name}
                          </span>
                          <button
                            type="button"
                            className="fd-attached-remove"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAttachedFile(null);
                            }}
                          >
                            <span className="material-symbols-outlined">
                              close
                            </span>
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="material-symbols-outlined fd-upload-icon">
                            cloud_upload
                          </span>
                          <p className="fd-upload-text">
                            Tarik file ke sini atau{" "}
                            <span className="fd-upload-link">pilih file</span>
                          </p>
                          <p className="fd-upload-hint">
                            PDF, PNG, JPG (Maks. 5MB)
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="fd-form-actions">
                    <button
                      type="button"
                      className="fd-btn-cancel"
                      onClick={() => setView("forum")}
                    >
                      Batal
                    </button>
                    <button type="submit" className="fd-btn-submit">
                      <span className="material-symbols-outlined">send</span>
                      Kirim Diskusi
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
