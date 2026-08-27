import { useRef } from 'react'

export default function Card() {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleDownload = async () => {
    if (!cardRef.current) return

    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: null
      })

      const link = document.createElement('a')
      link.download = 'ryan-stefan-business-card.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (error) {
      console.error('Failed to download card:', error)
    }
  }

  return (
    <>
      <style>{`
        .bc-container {
          font-family: 'Nunito', Arial, sans-serif;
          background: #ffffff;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 32px;
          max-width: max-content;
          margin: 0 auto;
        }
        .bc-stage {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .bc-card {
          width: 4.2in;
          height: 2.4in;
          background: #E8DDCB;
          border-radius: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.3in 0.28in;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
        }
        .bc-card::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 6px;
          background: linear-gradient(90deg, #036564, #033649);
        }
        .bc-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .bc-title {
          font-size: 1.5rem;
          line-height: 1.2;
          margin-bottom: 8px;
          white-space: nowrap;
          letter-spacing: -0.01em;
        }
        .bc-title .first-name {
          color: #031634;
          font-weight: 400;
        }
        .bc-title .last-name {
          color: #036564;
          font-weight: 700;
        }
        .bc-subtitle {
          font-size: 0.875rem;
          font-weight: 600;
          color: #036564;
          line-height: 1.3;
          margin-bottom: 12px;
          letter-spacing: 0.01em;
        }
        .bc-contact {
          font-size: 0.8rem;
          font-weight: 600;
          color: #033649;
          line-height: 1.4;
          margin-bottom: 3px;
        }
        .bc-website {
          font-size: 0.8rem;
          font-weight: 700;
          color: #036564;
          line-height: 1.4;
        }
        .bc-website .handle {
          font-size: 0.6rem;
          font-weight: 400;
          color: #031634;
          letter-spacing: -0.02em;
        }
        .bc-qr {
          flex-shrink: 0;
          width: 1.55in;
          height: 1.55in;
          border-radius: 8px;
          background-color: #E8DDCB;
          display: block;
          object-fit: contain;
          margin-left: 0.15in;
        }
        .bc-download {
          padding: 12px 24px;
          background: #036564;
          color: white;
          border: none;
          border-radius: 8px;
          font-family: 'Nunito', Arial, sans-serif;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .bc-download:hover {
          background: #033649;
        }
        @media print {
          .bc-container { padding: 0; }
          .bc-stage { display: block; }
          .bc-download { display: none; }
        }
      `}</style>

      <div className="bc-container">
        <div className="bc-stage">
          <div className="bc-card" ref={cardRef}>
            <div className="bc-info">
              <div className="bc-title">
                <span className="first-name">Ryan</span>{' '}
                <span className="last-name">Stefan</span>
              </div>
              <div className="bc-subtitle">Optimize. Build. Grow.</div>
              <div className="bc-contact">(737) 205-9226</div>
              <div className="bc-website">
                <span className="handle">ryan@</span>dashwood.net
              </div>
            </div>
            <img src="/images/dashwood_qr.png" alt="QR Code" className="bc-qr" />
          </div>
        </div>

        <button className="bc-download" onClick={handleDownload}>
          Download as Image
        </button>
      </div>
    </>
  )
}
