export default function MappaIndirizzo({ indirizzo, width=150, height=150 }) {
  if (!indirizzo) return null;

  const indirizzoEncoded = encodeURIComponent(indirizzo);
  const mapUrl = `https://www.google.com/maps?q=${indirizzoEncoded}&output=embed`;

  return (
    <div style={{borderRadius: "12px", overflow: "hidden" }}>
      <iframe
        src={mapUrl}
        width={width}
        height={height}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        title="Mappa"
      ></iframe>
    </div>
  );
}

