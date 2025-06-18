import "../styles/instagram.css";
import React from "react";
export default function InstagramWidget() {
  return (
    <aside style={{ width: '300px', background: '#f0f0ff', padding: '1rem', borderRadius: '1rem' }}>
      <h2 style={{ textAlign: 'center', color: '#d72638' }}>Instagram</h2>
      <div className="historias">
        <div className="tagembed-widget" data-widget-id="287657" website="1"></div>
        <script src="https://widget.tagembed.com/embed.min.js" type="text/javascript"></script>
      </div>
    </aside>
  );
}
