/* SharePlaylistModal.jsx — add playlist form */
import React from "react";
import HackModal from "../../shared/HackModal";
import I from "../../../icons";
import useHackathonStore from "../../../stores/hackathonStore";

export default function SharePlaylistModal({ t }) {
  const { newPl, setNewPl, addPlaylist, setShowAddPl } = useHackathonStore();
  return (
    <HackModal t={t} onClose={() => setShowAddPl(false)} width={480}>
      <div style={{ padding: "28px 30px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700 }}>Share a Playlist</h3>
          <button onClick={() => setShowAddPl(false)} style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${t.ibr}`, background: t.ib, color: t.tm, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{I.close(16, t.tm)}</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: t.tm, display: "block", marginBottom: 5 }}>Playlist Name</label>
            <input value={newPl.title} onChange={(e) => setNewPl((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Deep Focus Beats" style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `1px solid ${t.ibr}`, background: t.ib, color: t.text, fontSize: 14, fontFamily: "inherit", outline: "none" }} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: t.tm, display: "block", marginBottom: 5 }}>Curated By</label>
            <input value={newPl.by} onChange={(e) => setNewPl((p) => ({ ...p, by: e.target.value }))} placeholder="Artist or curator name" style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `1px solid ${t.ibr}`, background: t.ib, color: t.text, fontSize: 14, fontFamily: "inherit", outline: "none" }} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: t.tm, display: "block", marginBottom: 5 }}>Link</label>
            <input value={newPl.url} onChange={(e) => setNewPl((p) => ({ ...p, url: e.target.value }))} placeholder="https://open.spotify.com/..." style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `1px solid ${t.ibr}`, background: t.ib, color: t.text, fontSize: 14, fontFamily: "inherit", outline: "none" }} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: t.tm, display: "block", marginBottom: 5 }}>Platform</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["Spotify", "YouTube", "Apple Music", "SoundCloud"].map((p) => (
                <button key={p} onClick={() => setNewPl((f) => ({ ...f, platform: p }))} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: `1.5px solid ${newPl.platform === p ? t.acc + "50" : t.ibr}`, background: newPl.platform === p ? t.al : "transparent", color: newPl.platform === p ? t.acc : t.tm, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{p}</button>
              ))}
            </div>
          </div>
          <button onClick={addPlaylist} style={{ marginTop: 6, padding: "12px 0", borderRadius: 12, border: "none", background: newPl.title.trim() && newPl.url.trim() ? t.acc : t.ib, color: newPl.title.trim() && newPl.url.trim() ? "#fff" : t.tm, fontSize: 14, fontWeight: 600, cursor: newPl.title.trim() && newPl.url.trim() ? "pointer" : "default", fontFamily: "inherit", width: "100%" }}>Share Playlist</button>
        </div>
      </div>
    </HackModal>
  );
}
