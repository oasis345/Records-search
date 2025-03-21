'use client';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body>
        <h2>{error.message}</h2>
      </body>
    </html>
  );
}
