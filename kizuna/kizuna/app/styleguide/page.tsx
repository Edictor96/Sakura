import React from 'react';

export default function Styleguide() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', padding: '40px 0' }}>
      <section>
        <h1 className="h-display">Typography</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
          <div>
            <span className="stamp" style={{ display: 'block', marginBottom: '4px' }}>Display</span>
            <h1 className="h-display">Mochiy Pop One Headline</h1>
          </div>
          <div>
            <span className="stamp" style={{ display: 'block', marginBottom: '4px' }}>H2</span>
            <h2 className="h2">Sub-headline style</h2>
          </div>
          <div>
            <span className="stamp" style={{ display: 'block', marginBottom: '4px' }}>H3</span>
            <h3 className="h3">Section heading style</h3>
          </div>
          <div>
            <span className="stamp" style={{ display: 'block', marginBottom: '4px' }}>Body</span>
            <p className="body">
              This is the body text using Zen Maru Gothic. It has a generous line height and is limited to 70 characters per line to ensure optimal readability for a handmade feel.
            </p>
          </div>
          <div>
            <span className="stamp" style={{ display: 'block', marginBottom: '4px' }}>Small</span>
            <p className="small">This is small helper text for footnotes or metadata.</p>
          </div>
          <div>
            <span className="stamp" style={{ display: 'block', marginBottom: '4px' }}>Stamp</span>
            <p className="stamp">TINY STAMP LABEL</p>
          </div>
        </div>
      </section>

      <section>
        <h1 className="h-display">Surfaces</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px', marginTop: '24px' }}>
          <div className="surface-sticker">
            <h3 className="h3">Sticker</h3>
            <p className="small">Peeled sticker effect with white outline and tilt.</p>
          </div>
          <div className="surface-note">
            <h3 className="h3">Paper Note</h3>
            <p className="small">Washi tape accent and soft paper texture.</p>
          </div>
          <div className="surface-manga">
            <h3 className="h3">Manga Panel</h3>
            <p className="small">Hard borders and halftone dot corner.</p>
          </div>
          <div className="surface-ticket">
            <h3 className="h3">Ticket Stub</h3>
            <div className="ticket-divider" />
            <p className="small">Notched edges and dashed divider.</p>
          </div>
        </div>
      </section>

      <section>
        <h1 className="h-display">Buttons</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '24px' }}>
          <button className="btn btn-primary">Primary Action</button>
          <button className="btn btn-secondary">Secondary Action</button>
          <button className="btn btn-tertiary">Tertiary Action</button>
        </div>
      </section>
    </div>
  );
}
